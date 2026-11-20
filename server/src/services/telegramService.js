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
  const name = escapeHtml(customer.fullName || customer.name || 'Mijoz');
  const phone = escapeHtml(customer.phone || 'N/A');
  const region = escapeHtml(customer.region || 'N/A');
  const district = escapeHtml(customer.district || 'N/A');
  const address = escapeHtml(customer.address || customer.fullAddress || 'N/A');
  const notes = customer.notes ? escapeHtml(customer.notes) : 'Yo‘q';

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

    productsText += `<b>Mahsulot:</b> ${escapeHtml(prodName)}\n<b>O‘lcham:</b> ${size} | <b>Rang:</b> ${color}\n<b>Miqdor:</b> ${qty} dona | <b>Narx:</b> ${price}\n\n`;
  });

  const subtotal = formatPrice(order.subtotal);
  const deliveryFee = order.deliveryFee === 0 ? 'BEPUL (0 UZS)' : formatPrice(order.deliveryFee);
  const discount = order.discountAmount > 0 ? `\n<b>Chegirma:</b> -${formatPrice(order.discountAmount)}` : '';
  const total = formatPrice(order.total);
  const paymentMethod = escapeHtml(order.paymentMethod || 'Naqd pul / Yetkazganda');

  return `🛍 <b>YANGI BUYURTMA — MAVI BOUTIQUE</b>

━━━━━━━━━━━━━━━━

🆔 <b>BUYURTMA ID:</b> #${orderId}

👤 <b>MIJOZ MA'LUMOTLARI:</b>
<b>Ism-familiya:</b> ${name}
<b>Telefon:</b> ${phone}
<b>Viloyat:</b> ${region}
<b>Tuman/Shahar:</b> ${district}
<b>Manzil:</b> ${address}

━━━━━━━━━━━━━━━━

🛒 <b>MAHSULOTLAR:</b>
${productsText.trim()}

━━━━━━━━━━━━━━━━

💰 <b>TO‘LOV VA HISOB:</b>
<b>Mahsulotlar jami:</b> ${subtotal}
<b>Yetkazib berish:</b> ${deliveryFee}${discount}
<b>JAMI TO‘LOV:</b> ${total}

<b>To‘lov usuli:</b> ${paymentMethod}
<b>Mijoz izohi:</b> ${notes}

━━━━━━━━━━━━━━━━
✨ <b>MAVI ONLINE STORE — Vercel Platform</b>`;
};

/**
 * Sends order notification to configured Telegram Chat/Channel
 */
const sendTelegramOrderNotification = async (order, customToken = null, customChatId = null) => {
  const token = customToken || process.env.TELEGRAM_BOT_TOKEN || '9141572210:AAFnPv0T--m2cHy9tIZK8iUnIfq8Z4nHvZU';
  let chatId = customChatId || process.env.TELEGRAM_CHAT_ID || '-1004335804992';

  if (!token) {
    console.warn('[Telegram Service] TELEGRAM_BOT_TOKEN not provided, skipping notification.');
    return { success: false, error: 'TELEGRAM_BOT_TOKEN missing' };
  }

  if (!chatId) {
    console.warn('[Telegram Service] TELEGRAM_CHAT_ID not provided, skipping notification.');
    return { success: false, error: 'TELEGRAM_CHAT_ID missing' };
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

  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    }, {
      timeout: 8000
    });

    if (response.data && response.data.ok) {
      console.log(`[Telegram Service] Notification sent successfully! (ID: ${response.data.result.message_id})`);
      return {
        success: true,
        messageId: response.data.result.message_id,
        sentAt: new Date()
      };
    } else {
      throw new Error(response.data.description || 'Unknown Telegram error');
    }
  } catch (err) {
    const errorDetail = err.response?.data?.description || err.message;
    console.error(`[Telegram Service] Notification failed: ${errorDetail}`);
    return {
      success: false,
      error: errorDetail
    };
  }
};

const sendOrderNotification = sendTelegramOrderNotification;

const testTelegramConnection = async (token, chatId) => {
  const botToken = token || process.env.TELEGRAM_BOT_TOKEN || '9141572210:AAFnPv0T--m2cHy9tIZK8iUnIfq8Z4nHvZU';
  let targetChatId = chatId || process.env.TELEGRAM_CHAT_ID || '-1004335804992';

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
  }, { timeout: 8000 });

  return response.data;
};

module.exports = {
  sendTelegramOrderNotification,
  sendOrderNotification,
  formatOrderMessage,
  testTelegramConnection,
  escapeHtml
};
