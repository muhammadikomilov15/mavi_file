import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  PackageCheck,
  Send,
  Truck,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  const lang = i18n.language || 'uz';

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data.success) {
            setOrder(res.data.order);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mavi-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mavi-secondary py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-mavi-border text-center">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary mb-2">
            {t('orderSuccess.title')}
          </h1>
          <p className="text-xs text-mavi-muted max-w-md mx-auto mb-6">
            {t('orderSuccess.subtitle')}
          </p>

          {/* Order ID Badge */}
          <div className="inline-block px-5 py-2.5 bg-mavi-secondary border border-mavi-border rounded text-xs font-mono font-bold text-mavi-primary mb-6">
            {t('orderSuccess.orderId')}: <span className="text-mavi-accent">{order?.orderId || id}</span>
          </div>

          {/* Telegram Status Badge */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm text-left flex items-start gap-3 mb-8">
            <Send className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <strong>Telegram orqali xabardor qilindi:</strong>
              <p className="mt-0.5 text-blue-700">
                Ushbu buyurtma tafsilotlari avtomatik tarzda Telegram do‘kon kanaliga jo‘natildi. Menejerimiz tez orada siz bilan telefon orqali aloqaga chiqadi.
              </p>
            </div>
          </div>

          {/* Delivery & Address Summary */}
          {order && (
            <div className="text-left border-t border-mavi-border pt-6 space-y-4">
              <h3 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
                Buyurtma Tafsilotlari
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-mavi-secondary/50 rounded space-y-1">
                  <span className="text-[10px] uppercase text-mavi-muted font-bold block">
                    Qabul qiluvchi
                  </span>
                  <p className="font-semibold text-mavi-primary">{order.customer?.fullName}</p>
                  <p className="text-mavi-muted">{order.customer?.phone}</p>
                </div>

                <div className="p-3 bg-mavi-secondary/50 rounded space-y-1">
                  <span className="text-[10px] uppercase text-mavi-muted font-bold block">
                    Yetkazish manzili
                  </span>
                  <p className="font-semibold text-mavi-primary">{order.customer?.region}, {order.customer?.district}</p>
                  <p className="text-mavi-muted truncate">{order.customer?.address}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="pt-2">
                <span className="text-[10px] uppercase text-mavi-muted font-bold block mb-2">
                  Buyurtma qilingan mahsulotlar ({order.items?.length})
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {order.items?.map((item, idx) => {
                    const itemName = item.name?.[lang] || item.name?.uz || 'MAVI Garment';
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-mavi-border/50">
                        <div>
                          <span className="font-medium text-mavi-primary">{itemName}</span>
                          <span className="text-mavi-muted ml-2">({item.size} • {item.color?.name} × {item.quantity})</span>
                        </div>
                        <span className="font-bold text-mavi-primary">
                          {(item.price * item.quantity).toLocaleString()} UZS
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-center pt-3 border-t border-mavi-border text-sm font-bold text-mavi-primary">
                <span>Jami to‘lov ({order.paymentMethod}):</span>
                <span className="text-base text-emerald-800">{order.total?.toLocaleString()} UZS</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-mavi-border flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 py-3.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm text-center"
            >
              {t('orderSuccess.backHome')}
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-3.5 border border-mavi-border text-mavi-primary text-xs uppercase tracking-widest font-semibold hover:border-mavi-primary transition-colors rounded-sm text-center"
            >
              Xaridni davom ettirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
