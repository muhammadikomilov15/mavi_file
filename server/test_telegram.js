require('dotenv').config();
const axios = require('axios');

async function checkTelegram() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('Testing Telegram Bot Token:', token ? token.slice(0, 10) + '...' : 'NONE');
  console.log('Testing Telegram Chat ID:', chatId);

  try {
    const me = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
    console.log('Bot verified successfully:', me.data.result.username);

    // Send test message
    const msg = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: '✨ <b>MAVI — Telegram Bot Integratsiyasi Muvaffaqiyatli Ishga Tushirildi!</b>\n\nBu test xabari. Endi barcha yangi buyurtmalar avtomatik ravishda ushbu kanalga kelib tushadi.',
      parse_mode: 'HTML'
    });

    console.log('Test message sent to channel! Message ID:', msg.data.result.message_id);
    return true;
  } catch (err) {
    console.error('Telegram check error:', err.response?.data || err.message);
    return false;
  }
}

checkTelegram();
