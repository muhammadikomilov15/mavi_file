import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mavi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('mavi_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('mavi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist coupon to localStorage
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('mavi_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('mavi_coupon');
    }
  }, [coupon]);

  // Add item to cart
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    if (!selectedSize) {
      toast.error('Iltimos, o‘lchamni tanlang');
      return false;
    }

    if (!selectedColor) {
      toast.error('Iltimos, rangni tanlang');
      return false;
    }

    const effectivePrice = (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price)
      ? product.discountPrice
      : product.price;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.productId === product._id &&
          item.size === selectedSize &&
          item.color.name === selectedColor.name
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Mavjud qoldiq: faqat ${product.stock} dona`);
          return prevItems;
        }
        updated[existingIndex].quantity = newQty;
        toast.success('Savatdagi mahsulot soni yangilandi');
        return updated;
      } else {
        if (quantity > product.stock) {
          toast.error(`Mavjud qoldiq: faqat ${product.stock} dona`);
          return prevItems;
        }
        toast.success('Mahsulot savatga qo‘shildi');
        return [
          ...prevItems,
          {
            productId: product._id,
            sku: product.sku,
            name: product.name,
            price: effectivePrice,
            originalPrice: product.price,
            image: product.images[0] || '',
            size: selectedSize,
            color: selectedColor,
            quantity,
            stock: product.stock
          }
        ];
      }
    });

    return true;
  };

  // Remove item from cart
  const removeFromCart = (productId, size, colorName) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.size === size && item.color.name === colorName)
      )
    );
    toast.success('Mahsulot savatdan olib tashlandi');
  };

  // Update item quantity
  const updateQuantity = (productId, size, colorName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, colorName);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === size && item.color.name === colorName) {
          if (newQuantity > item.stock) {
            toast.error(`Maksimal mavjud miqdor: ${item.stock}`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Update size or color
  const updateSizeColor = (productId, oldSize, oldColorName, newSize, newColor) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === oldSize && item.color.name === oldColorName) {
          return {
            ...item,
            size: newSize || item.size,
            color: newColor || item.color
          };
        }
        return item;
      })
    );
    toast.success('Tanlov yangilandi');
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('mavi_cart');
    localStorage.removeItem('mavi_coupon');
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Delivery fee calculation (Free above 500 000 UZS)
  const deliveryFee = subtotal >= 500000 || subtotal === 0 ? 0 : 25000;

  // Coupon discount calculation
  let discountAmount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }
  }

  // Final total
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Apply coupon from API
  const applyCoupon = async (code) => {
    if (!code || code.trim() === '') {
      toast.error('Iltimos, promokodni kiriting');
      return;
    }

    try {
      const res = await api.post('/coupons/validate', {
        code: code.trim(),
        subtotal
      });

      if (res.data.success) {
        setCoupon(res.data.coupon);
        toast.success(`Promokod qo‘llandi: -${res.data.coupon.discountAmount.toLocaleString()} UZS`);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Yaroqsiz promokod';
      toast.error(msg);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success('Promokod olib tashlandi');
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        coupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSizeColor,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
