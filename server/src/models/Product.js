const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: {
    uz: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
    ru: { type: String, required: true, trim: true }
  },
  description: {
    uz: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'men',
      'women',
      't-shirts',
      'shirts',
      'hoodies',
      'sweatshirts',
      'jackets',
      'coats',
      'jeans',
      'trousers',
      'dresses',
      'shoes',
      'accessories'
    ]
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    default: 'unisex'
  },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0, min: 0 },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', '44', '45', 'One Size']
  }],
  colors: [colorSchema],
  stock: { type: Number, required: true, min: 0, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  material: { type: String, default: '' },
  careInstructions: { type: String, default: '' },
  viewsCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

productSchema.index({ 'name.uz': 'text', 'name.en': 'text', 'name.ru': 'text', 'description.en': 'text', sku: 'text' });

module.exports = mongoose.model('Product', productSchema);
