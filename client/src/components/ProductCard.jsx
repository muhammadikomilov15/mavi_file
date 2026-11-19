import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const { t, i18n } = useTranslation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Standard', hex: '#000000' });
  const [isHovered, setIsHovered] = useState(false);

  const lang = i18n.language || 'uz';
  const name = product.name?.[lang] || product.name?.uz || 'MAVI Garment';
  const isFavorited = isInWishlist(product._id);

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const effectivePrice = hasDiscount ? product.discountPrice : product.price;

  const currentImage = (isHovered && product.images?.[1]) ? product.images[1] : (product.images?.[0] || '');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'M';
    addToCart(product, defaultSize, selectedColor, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-mavi-secondary rounded-sm">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={currentImage}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-mavi-primary text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm">
              {t('product.newBadge')}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-700 text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorited
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-mavi-primary hover:bg-white hover:text-red-500 shadow-sm'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleQuickViewClick}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-mavi-primary hover:bg-white hover:text-mavi-accent shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-white text-mavi-primary text-xs uppercase tracking-widest font-semibold hover:bg-mavi-primary hover:text-white transition-colors shadow-md rounded-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('product.addToCart')}</span>
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        {/* Colors Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1.5">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color.hex }}
                className={`w-3 h-3 rounded-full border ${
                  selectedColor.name === color.name
                    ? 'ring-1 ring-offset-1 ring-mavi-primary border-transparent'
                    : 'border-mavi-border'
                }`}
                title={color.name}
              />
            ))}
          </div>
        )}

        {/* Product Title */}
        <Link
          to={`/product/${product._id}`}
          className="text-xs sm:text-sm font-medium text-mavi-primary hover:text-mavi-accent transition-colors line-clamp-1"
        >
          {name}
        </Link>

        {/* Category Subtitle */}
        <p className="text-[11px] text-mavi-muted uppercase tracking-wider mt-0.5">
          {product.category}
        </p>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-mavi-primary">
            {effectivePrice.toLocaleString()} UZS
          </span>
          {hasDiscount && (
            <span className="text-xs text-mavi-muted line-through">
              {product.price.toLocaleString()} UZS
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
