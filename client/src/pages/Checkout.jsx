import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const uzbekistanRegions = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand viloyati',
  'Buxoro viloyati',
  'Farg‘ona viloyati',
  'Andijon viloyati',
  'Namangan viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Xorazm viloyati',
  'Navoiy viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Qoraqalpog‘iston Respublikasi'
];

const Checkout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, discountAmount, total, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const lang = i18n.language || 'uz';

  // Customer Form State
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [formData, setFormData] = useState({
    fullName: user?.fullName || defaultAddress?.fullName || '',
    phone: user?.phone || defaultAddress?.phone || '+998 ',
    email: user?.email || '',
    region: defaultAddress?.region || 'Toshkent shahri',
    district: defaultAddress?.district || '',
    address: defaultAddress?.address || '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-serif text-2xl font-bold mb-2">{t('cart.empty')}</h2>
        <button
          onClick={() => navigate('/shop')}
          className="text-xs uppercase tracking-widest text-mavi-accent underline"
        >
          {t('cart.continueShopping')}
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Iltimos, ism-familiyangizni kiriting');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      toast.error('Iltimos, to‘g‘ri telefon raqamini kiriting');
      return;
    }
    if (!formData.region) {
      toast.error('Iltimos, viloyatni tanlang');
      return;
    }
    if (!formData.district.trim()) {
      toast.error('Iltimos, tuman yoki shaharni kiriting');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Iltimos, to‘liq manzilni kiriting');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          region: formData.region.trim(),
          district: formData.district.trim(),
          address: formData.address.trim(),
          notes: formData.notes.trim()
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          name: item.name
        })),
        couponCode: coupon?.code || '',
        paymentMethod
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        toast.success('Buyurtmangiz muvaffaqiyatli qabul qilindi!');
        clearCart();
        navigate(`/order-success/${res.data.order.orderId}`, {
          state: { order: res.data.order }
        });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      const msg = err.response?.data?.message || 'Buyurtmani rasmiylashtirishda xatolik yuz berdi';
      toast.error(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-mavi-primary mb-8 text-center sm:text-left">
          {t('checkout.title')}
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Customer & Shipping Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact & Address */}
            <div className="p-6 border border-mavi-border rounded-sm bg-white space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-mavi-border">
                <Truck className="w-4 h-4 text-mavi-accent" />
                <h3 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
                  {t('checkout.shippingInfo')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    {t('checkout.fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Aziz Rakhimov"
                    className="w-full px-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                  {t('checkout.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="aziz@example.com"
                  className="w-full px-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    {t('checkout.region')} *
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary bg-white focus:outline-none focus:border-mavi-primary cursor-pointer"
                  >
                    {uzbekistanRegions.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    {t('checkout.district')} *
                  </label>
                  <input
                    type="text"
                    required
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Mirobod tumani"
                    className="w-full px-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                  {t('checkout.address')} *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nukus ko‘chasi, 24-uy, 15-xonadon"
                  className="w-full px-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                  {t('checkout.notes')}
                </label>
                <textarea
                  rows="2"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Kuryer uchun qo‘shimcha eslatmalar (domofon kodi, yetkazish vaqti va h.k.)"
                  className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                ></textarea>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="p-6 border border-mavi-border rounded-sm bg-white space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-mavi-border">
                <CreditCard className="w-4 h-4 text-mavi-accent" />
                <h3 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
                  {t('checkout.paymentMethod')}
                </h3>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-mavi-primary bg-mavi-secondary/50 ring-1 ring-mavi-primary'
                      : 'border-mavi-border hover:border-mavi-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="radio radio-xs mt-0.5 checked:bg-mavi-primary"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-mavi-primary" />
                      <span className="text-xs font-bold text-mavi-primary">
                        {t('checkout.cod')}
                      </span>
                    </div>
                    <p className="text-[11px] text-mavi-muted mt-1">
                      Buyurtmani qabul qilib olganingizda kuryerga naqd pul yoki UzCard/Humo terminal orqali to‘lang.
                    </p>
                  </div>
                </label>

                {/* Click */}
                <label
                  className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-all ${
                    paymentMethod === 'Click'
                      ? 'border-mavi-primary bg-mavi-secondary/50 ring-1 ring-mavi-primary'
                      : 'border-mavi-border hover:border-mavi-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Click"
                    checked={paymentMethod === 'Click'}
                    onChange={() => setPaymentMethod('Click')}
                    className="radio radio-xs mt-0.5 checked:bg-mavi-primary"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">
                        CLICK
                      </span>
                      <span className="text-xs font-bold text-mavi-primary">
                        {t('checkout.click')}
                      </span>
                    </div>
                    <p className="text-[11px] text-mavi-muted mt-1">
                      Click ilovasi yoki veb-sayti orqali xavfsiz onlayn to‘lov (tayyor integratsiya).
                    </p>
                  </div>
                </label>

                {/* Payme */}
                <label
                  className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-all ${
                    paymentMethod === 'Payme'
                      ? 'border-mavi-primary bg-mavi-secondary/50 ring-1 ring-mavi-primary'
                      : 'border-mavi-border hover:border-mavi-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Payme"
                    checked={paymentMethod === 'Payme'}
                    onChange={() => setPaymentMethod('Payme')}
                    className="radio radio-xs mt-0.5 checked:bg-mavi-primary"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded">
                        PAYME
                      </span>
                      <span className="text-xs font-bold text-mavi-primary">
                        {t('checkout.payme')}
                      </span>
                    </div>
                    <p className="text-[11px] text-mavi-muted mt-1">
                      Payme to‘lov tizimi orqali zudlik bilan to‘lash (tayyor integratsiya).
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary & Telegram Dispatch Notice (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-mavi-secondary p-6 rounded-sm border border-mavi-border space-y-6 sticky top-28">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mavi-primary border-b border-mavi-border pb-3">
                {t('checkout.orderSummary')} ({cartItems.length})
              </h3>

              {/* Items List Mini */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => {
                  const itemName = item.name?.[lang] || item.name?.uz || 'MAVI Garment';
                  return (
                    <div key={idx} className="flex items-center gap-3 py-2 border-b border-mavi-border/50 text-xs">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-14 object-cover rounded bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-mavi-primary truncate">{itemName}</p>
                        <p className="text-[11px] text-mavi-muted">
                          {item.size} • {item.color.name} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-mavi-primary shrink-0">
                        {(item.price * item.quantity).toLocaleString()} UZS
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 text-xs border-t border-mavi-border pt-4">
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
                    <span>Chegirma ({coupon?.code})</span>
                    <span>-{discountAmount.toLocaleString()} UZS</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-mavi-primary border-t border-mavi-border pt-3">
                  <span>{t('cart.total')}</span>
                  <span>{total.toLocaleString()} UZS</span>
                </div>
              </div>

              {/* Telegram Auto-Notification Highlight */}
              <div className="p-3 bg-white border border-mavi-border rounded text-[11px] text-mavi-muted flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Buyurtmangiz tasdiqlanishi bilan uning to‘liq tafsilotlari Telegram kanalimizga avtomatik ravishda yetkaziladi.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t('checkout.processing')}</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t('checkout.placeOrder')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
