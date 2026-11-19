import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    coupon,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const lang = i18n.language || 'uz';

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCode);
    setApplyingCoupon(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white">
        <div className="w-16 h-16 rounded-full bg-mavi-secondary flex items-center justify-center text-mavi-accent mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary mb-2">
          {t('cart.empty')}
        </h2>
        <p className="text-xs text-mavi-muted max-w-sm mb-8">
          {t('cart.emptySubtitle')}
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm shadow-sm"
        >
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-mavi-primary mb-8 text-center sm:text-left">
          {t('cart.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="hidden sm:grid grid-cols-12 pb-3 border-b border-mavi-border text-[11px] uppercase tracking-widest text-mavi-muted font-bold">
              <div className="col-span-6">{t('cart.item')}</div>
              <div className="col-span-2 text-center">{t('cart.price')}</div>
              <div className="col-span-2 text-center">{t('cart.quantity')}</div>
              <div className="col-span-2 text-right">{t('cart.total')}</div>
            </div>

            {cartItems.map((item, idx) => {
              const itemName = item.name?.[lang] || item.name?.uz || 'MAVI Garment';
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.size}-${item.color.name}-${idx}`}
                  className="flex flex-col sm:grid sm:grid-cols-12 items-center py-4 border-b border-mavi-border gap-4"
                >
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-20 h-24 object-cover rounded bg-mavi-secondary shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-xs sm:text-sm font-semibold text-mavi-primary hover:text-mavi-accent transition-colors truncate block"
                      >
                        {itemName}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-mavi-muted mt-1">
                        <span>O‘lcham: <strong className="text-mavi-primary">{item.size}</strong></span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <span>Rang:</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-mavi-border"
                            style={{ backgroundColor: item.color.hex }}
                          ></span>
                          <strong className="text-mavi-primary">{item.color.name}</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size, item.color.name)}
                        className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1 mt-2 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t('cart.remove')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-center text-xs font-medium text-mavi-text">
                    <span className="sm:hidden text-mavi-muted mr-1">{t('cart.price')}:</span>
                    {item.price.toLocaleString()} UZS
                  </div>

                  {/* Quantity Adjuster */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-mavi-border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color.name, item.quantity - 1)
                        }
                        className="px-2.5 py-1 text-xs text-mavi-muted hover:text-mavi-primary"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-mavi-primary">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color.name, item.quantity + 1)
                        }
                        className="px-2.5 py-1 text-xs text-mavi-muted hover:text-mavi-primary"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="col-span-2 text-right text-xs sm:text-sm font-bold text-mavi-primary w-full sm:w-auto">
                    <span className="sm:hidden text-mavi-muted mr-1">{t('cart.total')}:</span>
                    {itemTotal.toLocaleString()} UZS
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex justify-between items-center">
              <Link
                to="/shop"
                className="text-xs uppercase tracking-luxury text-mavi-muted hover:text-mavi-primary underline underline-offset-4"
              >
                &larr; {t('cart.continueShopping')}
              </Link>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-mavi-secondary p-6 rounded-sm border border-mavi-border space-y-6">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mavi-primary border-b border-mavi-border pb-3">
                {t('cart.orderSummary')}
              </h3>

              {/* Coupon Form */}
              <div>
                {coupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-800">{coupon.code}</span>
                      <p className="text-[11px] text-emerald-700">Chegirma qo‘llandi: -{discountAmount.toLocaleString()} UZS</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Bekor qilish
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder={t('cart.couponPlaceholder')}
                        className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-mavi-border rounded focus:outline-none focus:border-mavi-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={applyingCoupon || !couponCode}
                      className="px-4 py-2 bg-mavi-primary text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-mavi-accent transition-colors disabled:opacity-50"
                    >
                      {applyingCoupon ? '...' : t('cart.applyCoupon')}
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-mavi-muted mt-1.5">
                  Sinov promokodi: <strong>MAVI10</strong> (10% chegirma)
                </p>
              </div>

              {/* Calculation Rows */}
              <div className="space-y-3 text-xs border-t border-mavi-border pt-4">
                <div className="flex justify-between text-mavi-text">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold">{subtotal.toLocaleString()} UZS</span>
                </div>

                <div className="flex justify-between text-mavi-text">
                  <span>{t('cart.deliveryFee')}</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-700 uppercase tracking-wider">{t('cart.freeDelivery')}</strong>
                    ) : (
                      `${deliveryFee.toLocaleString()} UZS`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-medium">
                    <span>{t('cart.discount')}</span>
                    <span>-{discountAmount.toLocaleString()} UZS</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-mavi-primary border-t border-mavi-border pt-3">
                  <span>{t('cart.total')}</span>
                  <span>{total.toLocaleString()} UZS</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span>{t('cart.proceedCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-mavi-muted space-y-1.5 pt-2 border-t border-mavi-border">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-mavi-accent" />
                  <span>500 000 so‘mdan yuqori xaridlarga yetkazish bepul</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-mavi-accent" />
                  <span>100% himoyalangan va xavfsiz to‘lov</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
