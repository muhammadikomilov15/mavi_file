const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, default: '' },
  name: {
    uz: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  image: { type: String, default: '' },
  size: { type: String, required: true },
  color: {
    name: { type: String, required: true },
    hex: { type: String, default: '#000000' }
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customer: {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    region: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0, default: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  couponCode: { type: String, default: '' },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Click', 'Payme'],
    default: 'Cash on Delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  telegramNotification: {
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
    error: { type: String, default: '' },
    retryCount: { type: Number, default: 0 },
    lastAttemptAt: { type: Date }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
