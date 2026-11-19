const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'MAVI' },
  contactPhone: { type: String, default: '+998 71 200 00 00' },
  contactEmail: { type: String, default: 'concierge@mavi.uz' },
  contactAddress: { type: String, default: 'Amir Temur Avenue 107A, Tashkent, Uzbekistan' },
  telegramChannel: { type: String, default: 'https://t.me/mavi_boutique' },
  instagramUrl: { type: String, default: 'https://instagram.com/mavi_boutique' },
  deliveryFee: { type: Number, default: 25000 },
  freeDeliveryThreshold: { type: Number, default: 500000 },
  announcementText: {
    uz: { type: String, default: 'O‘zbekiston bo‘ylab bepul yetkazib berish (500 000 so‘mdan yuqori xaridlar uchun)' },
    en: { type: String, default: 'Complimentary delivery across Uzbekistan on orders over 500,000 UZS' },
    ru: { type: String, default: 'Бесплатная доставка по Узбекистану при заказе от 500 000 сум' }
  },
  telegramBotToken: { type: String, default: '' },
  telegramChatId: { type: String, default: '-1004335804992' },
  telegramEnabled: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
