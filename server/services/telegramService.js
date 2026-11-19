require('dotenv').config();
const axios = require('axios');

/**
 * Escapes HTML characters for Telegram HTML parse_mode
 */
const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Formats price in Uzbek Som (UZS)
 */
const formatPrice = (amount) => {
  return new Intl.NumberFormat('uz-UZ').format(amount || 0) + ' UZS';
};

/**
 * Formats order into the required MAVI Telegram notification format
 */
const formatOrderMessage = (order) => {
  const orderId = escapeHtml(order.orderId || order._id || 'MAVI-ORDER');
  const customer = order.customer || {};
  const name = escapeHtml(customer.fullName || customer.name || 'Anonymous');
  const phone = escapeHtml(customer.phone || 'N/A');
  const region = escapeHtml(customer.region || 'N/A');
  const district = escapeHtml(customer.district || 'N/A');
  const address = escapeHtml(customer.address || customer.fullAddress || 'N/A');
  const notes = customer.notes ? escapeHtml(customer.notes) : 'None';

  let productsText = '';
  const items = order.items || [];
  items.forEach((item) => {
    let prodName = 'Mahsulot';
    if (typeof item.name === 'object' && item.name !== null) {
      prodName = item.name.uz || item.name.en || item.name.ru || 'Mahsulot';
    } else if (typeof item.name === 'string') {
      prodName = item.name;
    }

    const size = escapeHtml(item.size || 'M');
    
    let colorName = 'Standard';
    if (typeof item.color === 'object' && item.color !== null) {
      colorName = item.color.name || 'Standard';
    } else if (typeof item.color === 'string') {
      colorName = item.color;
    }

    const color = escapeHtml(colorName);
    const qty = item.quantity || 1;
    const price = formatPrice(item.price);

    productsText += `<b>Product:</b> ${escapeHtml(prodName)}\n<b>Size:</b> ${size} | <b>Color:</b> ${color}\n<b>Quantity:</b> ${qty} | <b>Price:</b> ${price}\n\n`;
  });

  const subtotal = formatPrice(order.subtotal);
  const deliveryFee = order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee);
  const discount = order.discountAmount > 0 ? `\n<b>Discount:</b> -${formatPrice(order.discountAmount)}` : '';
  const total = formatPrice(order.total);
  const paymentMethod = escapeHtml(order.paymentMethod || 'Cash on Delivery');

  return `🛍 <b>NEW ORDER — MAVI</b>

━━━━━━━━━━━━━━━━

🆔 <b>ORDER ID:</b> #${orderId}

👤 <b>CUSTOMER INFORMATION</b>

<b>Name:</b> ${name}
<b>Phone:</b> ${phone}
<b>Region:</b> ${region}
<b>District:</b> ${district}
<b>Address:</b> ${address}

━━━━━━━━━━━━━━━━

🛒 <b>PRODUCTS</b>

${productsText.trim()}

━━━━━━━━━━━━━━━━

💰 <b>PAYMENT INFORMATION</b>

<b>Subtotal:</b> ${subtotal}
<b>Delivery:</b> ${deliveryFee}${discount}
<b>TOTAL:</b> ${total}

<b>Payment method:</b> ${paymentMethod}

📝 <b>Customer notes:</b> ${notes}

━━━━━━━━━━━━━━━━

<b>MAVI ONLINE STORE</b>`;
};

/**
 * Sends order notification to configured Telegram Chat/Channel
 * Function requested by user: sendTelegramOrderNotification(order)
 */
const sendTelegramOrderNotification = async (order, customToken = null, customChatId = null) => {
  const token = customToken || process.env.TELEGRAM_BOT_TOKEN;
  let chatId = customChatId || process.env.TELEGRAM_CHAT_ID;

  if (!token) {
    const errorMsg = 'TELEGRAM_BOT_TOKEN is not defined in environment variables';
    console.error(`[Telegram Service] ${errorMsg}`);
    return {
      success: false,
      error: errorMsg
    };
  }

  if (!chatId) {
    const errorMsg = 'TELEGRAM_CHAT_ID is not defined in environment variables';
    console.error(`[Telegram Service] ${errorMsg}`);
    return {
      success: false,
      error: errorMsg
    };
  }

  // Ensure channel / supergroup chat ID starts with minus if numeric
  if (typeof chatId === 'string' && !chatId.startsWith('-') && !chatId.startsWith('@')) {
    if (/^\d+$/.test(chatId)) {
      chatId = `-${chatId}`;
    }
  }

  const message = formatOrderMessage(order);
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  console.log(`[Telegram Service] Dispatching order #${order.orderId || order._id} to Telegram chat ${chatId}...`);

  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      }, {
        timeout: 10000
      });

      if (response.data && response.data.ok) {
        console.log(`[Telegram Service] Order #${order.orderId || order._id} notification successfully sent! (Message ID: ${response.data.result.message_id})`);
        return {
          success: true,
          messageId: response.data.result.message_id,
          sentAt: new Date()
        };
      } else {
        throw new Error(response.data.description || 'Unknown Telegram API error');
      }
    } catch (err) {
      const errorDetail = err.response?.data?.description || err.message;
      lastError = errorDetail;
      console.error(`[Telegram Service] Attempt ${attempt}/${maxRetries} failed: ${errorDetail}`);

      // If client-side HTTP error (4xx) like 401 Unauthorized or 400 Bad Request, retrying won't help credentials error
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        break;
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  return {
    success: false,
    error: lastError,
    failedAt: new Date()
  };
};

/**
 * Backward-compatible alias
 */
const sendOrderNotification = sendTelegramOrderNotification;

/**
 * Test Telegram bot connection with a verification message
 */
const testTelegramConnection = async (token, chatId) => {
  const botToken = token || process.env.TELEGRAM_BOT_TOKEN;
  let targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !targetChatId) {
    throw new Error('Both Bot Token and Chat ID are required.');
  }

  if (typeof targetChatId === 'string' && !targetChatId.startsWith('-') && !targetChatId.startsWith('@')) {
    if (/^\d+$/.test(targetChatId)) {
      targetChatId = `-${targetChatId}`;
    }
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const text = `✨ <b>MAVI — Telegram Bot Connected</b>\n\nSystem test verified on ${new Date().toLocaleString('uz-UZ')}.\nNotifications will appear here automatically upon order placement.`;

  const response = await axios.post(url, {
    chat_id: targetChatId,
    text: text,
    parse_mode: 'HTML'
  }, { timeout: 10000 });

  return response.data;
};

module.exports = {
  sendTelegramOrderNotification,
  sendOrderNotification,
  formatOrderMessage,
  testTelegramConnection,
  escapeHtml
};
