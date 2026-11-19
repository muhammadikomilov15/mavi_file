const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: {
    uz: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  description: {
    uz: { type: String, default: '' },
    en: { type: String, default: '' },
    ru: { type: String, default: '' }
  },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
