import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { t } = useTranslation();
  const { wishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white">
        <div className="w-16 h-16 rounded-full bg-mavi-secondary flex items-center justify-center text-mavi-accent mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary mb-2">
          {t('nav.wishlist')} bo‘sh
        </h2>
        <p className="text-xs text-mavi-muted max-w-sm mb-8">
          Sizga yoqqan kiyimlarni saqlab qo‘yish uchun mahsulot kartasidagi yurakcha belgisini bosing.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm shadow-sm"
        >
          Kolleksiyalarni ko‘rish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-mavi-border mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-mavi-primary">
              {t('nav.wishlist')}
            </h1>
            <p className="text-xs text-mavi-muted mt-1">
              {wishlistCount} ta saqlangan mahsulot
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-luxury text-mavi-primary hover:text-mavi-accent flex items-center gap-1.5"
          >
            <span>Do‘konga o‘tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((item) => {
            const product = typeof item === 'object' ? item : null;
            if (!product) return null;
            return <ProductCard key={product._id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
