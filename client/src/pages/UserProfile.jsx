import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address Form Modal
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    region: 'Toshkent shahri',
    district: '',
    address: '',
    isDefault: false
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [isAuthenticated, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ fullName, phone });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address) {
      toast.error('Barcha maydonlarni to‘ldiring');
      return;
    }

    const updatedAddresses = [...(user.addresses || []), newAddress];
    const success = await updateProfile({ addresses: updatedAddresses });
    if (success) {
      setIsAddingAddress(false);
      setNewAddress({
        fullName: '',
        phone: '',
        region: 'Toshkent shahri',
        district: '',
        address: '',
        isDefault: false
      });
    }
  };

  const handleDeleteAddress = async (index) => {
    const updated = user.addresses.filter((_, i) => i !== index);
    await updateProfile({ addresses: updated });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Kutilmoqda</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Tasdiqlandi</span>;
      case 'Processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Tayyorlanmoqda</span>;
      case 'Shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Yo‘lda</span>;
      case 'Delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Yetkazildi</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Bekor qilindi</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-mavi-secondary/40 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* SIDEBAR NAVIGATION (4 cols) */}
          <div className="md:col-span-4">
            <div className="bg-white p-6 rounded-sm border border-mavi-border shadow-sm space-y-6">
              <div className="text-center pb-6 border-b border-mavi-border">
                <div className="w-16 h-16 rounded-full bg-mavi-primary text-white flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-3">
                  {user?.fullName?.charAt(0) || 'M'}
                </div>
                <h3 className="font-serif text-base font-bold text-mavi-primary">{user?.fullName}</h3>
                <p className="text-xs text-mavi-muted mt-0.5">{user?.email}</p>
                <p className="text-[11px] font-mono text-mavi-accent mt-0.5">{user?.phone}</p>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded transition-colors text-left ${
                    activeTab === 'orders'
                      ? 'bg-mavi-primary text-white'
                      : 'text-mavi-text hover:bg-mavi-secondary'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>{t('auth.orders')} ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded transition-colors text-left ${
                    activeTab === 'profile'
                      ? 'bg-mavi-primary text-white'
                      : 'text-mavi-text hover:bg-mavi-secondary'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{t('auth.profile')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded transition-colors text-left ${
                    activeTab === 'addresses'
                      ? 'bg-mavi-primary text-white'
                      : 'text-mavi-text hover:bg-mavi-secondary'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t('auth.addresses')} ({user?.addresses?.length || 0})</span>
                </button>

                <Link
                  to="/wishlist"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded text-mavi-text hover:bg-mavi-secondary text-left transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>{t('nav.wishlist')}</span>
                </Link>
              </nav>

              <div className="pt-4 border-t border-mavi-border">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN TAB CONTENT (8 cols) */}
          <div className="md:col-span-8">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-mavi-border shadow-sm space-y-6">
                <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-mavi-primary border-b border-mavi-border pb-4">
                  {t('auth.orders')}
                </h2>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-mavi-muted animate-pulse">
                    Buyurtmalar yuklanmoqda...
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-5 border border-mavi-border rounded-sm hover:border-mavi-primary transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-mavi-border">
                          <div>
                            <span className="font-mono text-xs font-bold text-mavi-primary">
                              #{ord.orderId}
                            </span>
                            <span className="text-[11px] text-mavi-muted block sm:inline sm:ml-3">
                              {new Date(ord.createdAt).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                          <div>{getStatusBadge(ord.status)}</div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {ord.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs">
                              <img
                                src={item.image}
                                alt=""
                                className="w-10 h-12 object-cover rounded bg-mavi-secondary"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-mavi-primary truncate">
                                  {item.name?.uz || item.name?.en}
                                </p>
                                <p className="text-[11px] text-mavi-muted">
                                  {item.size} • {item.color?.name} × {item.quantity}
                                </p>
                              </div>
                              <span className="font-bold text-mavi-primary">
                                {(item.price * item.quantity).toLocaleString()} UZS
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-mavi-border flex items-center justify-between text-xs">
                          <span className="text-mavi-muted">To‘lov: {ord.paymentMethod}</span>
                          <span className="font-bold text-mavi-primary text-sm">
                            Jami: {ord.total.toLocaleString()} UZS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-mavi-muted">
                    Sizda hali hech qanday buyurtma yo‘q.
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-mavi-border shadow-sm space-y-6">
                <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-mavi-primary border-b border-mavi-border pb-4">
                  {t('auth.profile')}
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                      {t('auth.fullName')}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                      {t('auth.phone')}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3.5 py-2 text-xs border border-mavi-border bg-mavi-secondary text-mavi-muted rounded cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm"
                  >
                    {t('auth.saveChanges')}
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 rounded-sm border border-mavi-border shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-mavi-border pb-4">
                  <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-mavi-primary">
                    {t('auth.addresses')}
                  </h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="px-3.5 py-1.5 bg-mavi-primary text-white text-xs font-semibold rounded flex items-center gap-1.5 hover:bg-mavi-accent transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yangi manzil</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="p-4 bg-mavi-secondary rounded space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-mavi-primary">
                      Yetkazish manzilini qo‘shish
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Qabul qiluvchi ismi"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Telefon raqami"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Viloyat / Shahar"
                        value={newAddress.region}
                        onChange={(e) => setNewAddress({ ...newAddress, region: e.target.value })}
                        className="px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Tuman"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                        className="px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Ko‘cha, uy, xonadon"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-1.5 text-xs border border-mavi-border rounded text-mavi-muted hover:text-mavi-primary"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs bg-mavi-primary text-white rounded font-semibold hover:bg-mavi-accent"
                      >
                        Saqlash
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((addr, idx) => (
                      <div key={idx} className="p-4 border border-mavi-border rounded relative bg-white">
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="absolute top-3 right-3 text-mavi-muted hover:text-red-600 transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <h4 className="text-xs font-bold text-mavi-primary">{addr.fullName}</h4>
                        <p className="text-[11px] text-mavi-muted mt-1">{addr.phone}</p>
                        <p className="text-xs text-mavi-text mt-2">
                          {addr.region}, {addr.district}
                          <br />
                          {addr.address}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-mavi-muted py-6">Hozircha saqlangan manzillar yo‘q.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
