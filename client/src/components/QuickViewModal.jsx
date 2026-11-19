import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Standard', hex: '#000000' });
  const [quantity, setQuantity] = useState(1);

  const lang = i18n.language || 'uz';
  const name = product.name?.[lang] || product.name?.uz;
  const description = product.description?.[lang] || product.description?.uz;
  const isFavorited = isInWishlist(product._id);

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const effectivePrice = hasDiscount ? product.discountPrice : product.price;

  const handleAdd = () => {
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white rounded-md shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-mavi-muted hover:text-mavi-primary rounded-full hover:bg-mavi-secondary"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery */}
        <div className="md:w-1/2 bg-mavi-secondary p-4 flex flex-col justify-between">
          <div className="aspect-[3/4] w-full overflow-hidden rounded">
            <img
              src={selectedImage || product.images?.[0]}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 rounded overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-mavi-primary' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-mavi-muted font-semibold">
              {product.category}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-mavi-primary mt-1">
              {name}
            </h3>

            {/* Price */}
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xl font-bold text-mavi-primary">
                {effectivePrice.toLocaleString()} UZS
              </span>
              {hasDiscount && (
                <span className="text-sm text-mavi-muted line-through">
                  {product.price.toLocaleString()} UZS
                </span>
              )}
            </div>

            <p className="text-xs text-mavi-muted mt-3 line-clamp-3 leading-relaxed">
              {description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider text-mavi-text block mb-2">
                  {t('product.selectColor')}: <span className="font-normal text-mavi-muted">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        selectedColor.name === color.name
                          ? 'ring-2 ring-offset-2 ring-mavi-primary border-transparent'
                          : 'border-mavi-border'
                      }`}
                      title={color.name}
                    >
                      {selectedColor.name === color.name && (
                        <Check className={`w-3 h-3 ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider text-mavi-text block mb-2">
                  {t('product.selectSize')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider border rounded transition-all ${
                        selectedSize === size
                          ? 'bg-mavi-primary text-white border-mavi-primary'
                          : 'border-mavi-border text-mavi-text hover:border-mavi-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-mavi-text block mb-2">
                {t('product.quantity')}
              </label>
              <div className="flex items-center border border-mavi-border rounded w-28">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm text-mavi-muted hover:text-mavi-primary"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 text-sm text-mavi-muted hover:text-mavi-primary"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-mavi-border flex gap-3">
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-1 py-3 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}</span>
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 border rounded transition-colors ${
                isFavorited
                  ? 'border-red-500 text-red-500 bg-red-50'
                  : 'border-mavi-border text-mavi-primary hover:border-mavi-primary'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mt-3 text-center">
            <Link
              to={`/product/${product._id}`}
              onClick={onClose}
              className="text-xs underline text-mavi-muted hover:text-mavi-primary uppercase tracking-wider"
            >
              To‘liq ma’lumotlarni ko‘rish &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
