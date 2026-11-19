import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Truck,
  MapPin,
  X,
  Clock
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const orderStatuses = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/admin/orders?limit=50';
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Buyurtma holati "${newStatus}"ga o‘zgartirildi`);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      toast.error('Holatni o‘zgartirishda xatolik');
    }
  };

  const handleRetryTelegram = async (orderId) => {
    setRetryingId(orderId);
    try {
      const res = await api.post(`/orders/${orderId}/retry-telegram`);
      if (res.data.success) {
        toast.success('Telegram bildirishnomasi yetkazildi!');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            telegramNotification: { sent: true, error: '' }
          });
        }
      } else {
        toast.error(`Telegram xatoligi: ${res.data.notification?.error || 'Ulanib bo‘lmadi'}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Telegramga yuborishda xatolik yuz berdi');
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-mavi-primary">
          Buyurtmalarni Boshqarish
        </h1>
        <p className="text-xs text-mavi-muted mt-0.5">
          Barcha tushgan buyurtmalar, to‘lovlar va Telegram bildirishnomalar nazorati
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-sm border border-mavi-border shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order ID (#MAVI-...), mijoz ismi yoki telefon raqami..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-mavi-border rounded focus:outline-none focus:border-mavi-primary"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-mavi-border rounded bg-white text-mavi-text focus:outline-none cursor-pointer"
        >
          <option value="all">Barcha Holatlar</option>
          {orderStatuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm border border-mavi-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-mavi-secondary text-mavi-primary uppercase tracking-wider font-semibold border-b border-mavi-border">
                <th className="p-3">Order ID</th>
                <th className="p-3">Sana</th>
                <th className="p-3">Mijoz / Manzil</th>
                <th className="p-3">Mahsulotlar</th>
                <th className="p-3">Jami</th>
                <th className="p-3">Telegram</th>
                <th className="p-3">Holati</th>
                <th className="p-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mavi-border">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-mavi-muted animate-pulse">
                    Buyurtmalar yuklanmoqda...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-mavi-secondary/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-mavi-primary">
                      #{ord.orderId}
                    </td>
                    <td className="p-3 text-mavi-muted whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString('uz-UZ')}
                      <span className="block text-[10px]">
                        {new Date(ord.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-mavi-primary">{ord.customer.fullName}</div>
                      <div className="text-[11px] text-mavi-muted">{ord.customer.phone}</div>
                      <div className="text-[10px] text-mavi-muted truncate max-w-[150px]">
                        {ord.customer.region}, {ord.customer.district}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-mavi-primary">{ord.items.length} ta buyum</span>
                      <div className="text-[10px] text-mavi-muted truncate max-w-[140px]">
                        {ord.items[0]?.name.uz || ord.items[0]?.name.en}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-mavi-primary whitespace-nowrap">
                      {ord.total.toLocaleString()} UZS
                      <span className="block text-[10px] font-normal text-mavi-muted">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      {ord.telegramNotification?.sent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Yuborildi
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold">
                            <AlertTriangle className="w-3 h-3" /> Qayta urinish
                          </span>
                          <button
                            onClick={() => handleRetryTelegram(ord._id)}
                            disabled={retryingId === ord._id}
                            className="p-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                            title="Telegramga qayta yuborish"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="px-2 py-1 text-xs border border-mavi-border rounded bg-white font-medium focus:outline-none cursor-pointer"
                      >
                        {orderStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 text-xs bg-mavi-secondary hover:bg-mavi-border text-mavi-primary font-semibold rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Batafsil</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-mavi-muted">
                    Buyurtmalar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white rounded-md shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-mavi-border">
              <div>
                <span className="text-[10px] uppercase font-bold text-mavi-muted">Buyurtma tafsilotlari</span>
                <h3 className="font-serif text-xl font-bold text-mavi-primary">
                  #{selectedOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-mavi-muted hover:text-mavi-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telegram Dispatch Banner with Retry Action */}
            <div
              className={`p-4 rounded border flex items-center justify-between gap-3 text-xs ${
                selectedOrder.telegramNotification?.sent
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Send className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>
                    {selectedOrder.telegramNotification?.sent
                      ? 'Telegram bildirishnomasi kanalga muvaffaqiyatli yetkazilgan.'
                      : 'Telegram xabarnomasi hali yetkazilmagan yoki xatolik yuz bergan.'}
                  </strong>
                  {selectedOrder.telegramNotification?.error && (
                    <p className="text-[11px] font-mono text-red-600 mt-0.5">
                      Sabab: {selectedOrder.telegramNotification.error}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleRetryTelegram(selectedOrder._id)}
                disabled={retryingId === selectedOrder._id}
                className="px-3 py-1.5 bg-mavi-primary text-white text-[11px] uppercase tracking-wider font-semibold rounded hover:bg-mavi-accent transition-colors shrink-0 disabled:opacity-50"
              >
                {retryingId === selectedOrder._id ? 'Yuborilmoqda...' : 'Telegramga Yuborish'}
              </button>
            </div>

            {/* Customer & Delivery Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-mavi-secondary/40 rounded border border-mavi-border space-y-1">
                <span className="text-[10px] uppercase text-mavi-muted font-bold block">
                  Mijoz Ma’lumotlari
                </span>
                <p className="font-bold text-mavi-primary">{selectedOrder.customer.fullName}</p>
                <p className="text-mavi-muted font-mono">{selectedOrder.customer.phone}</p>
                <p className="text-mavi-muted">{selectedOrder.customer.email || 'Email ko‘rsatilmagan'}</p>
              </div>

              <div className="p-4 bg-mavi-secondary/40 rounded border border-mavi-border space-y-1">
                <span className="text-[10px] uppercase text-mavi-muted font-bold block">
                  Yetkazish Manzili
                </span>
                <p className="font-semibold text-mavi-primary">
                  {selectedOrder.customer.region}, {selectedOrder.customer.district}
                </p>
                <p className="text-mavi-text">{selectedOrder.customer.address}</p>
                {selectedOrder.customer.notes && (
                  <p className="text-[11px] text-mavi-muted italic mt-1">
                    Izoh: "{selectedOrder.customer.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Products Table */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-mavi-primary block mb-2">
                Mahsulotlar Ro‘yxati
              </span>
              <div className="space-y-2 border border-mavi-border rounded p-3">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-mavi-border/50 text-xs last:border-none">
                    <img src={it.image} alt="" className="w-12 h-14 object-cover rounded bg-mavi-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-mavi-primary truncate">{it.name?.uz || it.name?.en}</p>
                      <p className="text-[11px] text-mavi-muted">
                        O‘lcham: <strong>{it.size}</strong> | Rang: <strong>{it.color?.name}</strong> | Soni: <strong>{it.quantity}</strong>
                      </p>
                    </div>
                    <span className="font-bold text-mavi-primary">
                      {(it.price * it.quantity).toLocaleString()} UZS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-mavi-secondary rounded border border-mavi-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Oraliq hisob:</span>
                <span>{selectedOrder.subtotal.toLocaleString()} UZS</span>
              </div>
              <div className="flex justify-between">
                <span>Yetkazib berish:</span>
                <span>{selectedOrder.deliveryFee === 0 ? 'BEPUL' : `${selectedOrder.deliveryFee.toLocaleString()} UZS`}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Chegirma ({selectedOrder.couponCode}):</span>
                  <span>-{selectedOrder.discountAmount.toLocaleString()} UZS</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-mavi-primary border-t border-mavi-border pt-2">
                <span>Jami ({selectedOrder.paymentMethod}):</span>
                <span>{selectedOrder.total.toLocaleString()} UZS</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-mavi-accent transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
