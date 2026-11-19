import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('mavi_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync wishlist with server if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      setWishlist(user.wishlist);
    }
  }, [isAuthenticated, user]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('mavi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = async (product) => {
    const isExisting = wishlist.some((item) => (item._id || item) === product._id);

    if (isExisting) {
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== product._id));
      toast.success('Sevimlilardan olib tashlandi');
    } else {
      setWishlist((prev) => [...prev, product]);
      toast.success('Sevimlilarga qo‘shildi');
    }

    if (isAuthenticated) {
      try {
        await api.post('/auth/wishlist/toggle', { productId: product._id });
      } catch (e) {
        console.error('Wishlist sync error:', e);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
