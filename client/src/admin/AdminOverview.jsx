import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send
} from 'lucide-react';
import api from '../services/api';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-mavi-muted animate-pulse">
        Dashboard ko‘rsatkichlari yuklanmoqda...
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalCustomers = 0,
    statusCounts = {},
    recentOrders = [],
    monthlyStats = []
  } = data || {};

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary">
            Do‘kon Ko‘rsatkichlari
          </h1>
          <p className="text-xs text-mavi-muted mt-1">
            Real vaqt rejimidagi savdo, buyurtmalar va mijozlar tahlili
          </p>
        </div>

        <Link
          to="/admin/settings"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded hover:bg-blue-100 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram Bot Holatini Tekshirish</span>
        </Link>
      </div>

      {/* 4 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-sm border border-mavi-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-mavi-muted font-bold block">
              Jami Tushum
            </span>
            <h3 className="text-xl font-bold text-mavi-primary mt-1">
              {totalRevenue.toLocaleString()} UZS
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Tasdiqlangan savdolar</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-sm border border-mavi-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-mavi-muted font-bold block">
              Buyurtmalar Soni
            </span>
            <h3 className="text-xl font-bold text-mavi-primary mt-1">{totalOrders}</h3>
            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              <span>{statusCounts.pending || 0} ta kutilmoqda</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-sm border border-mavi-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-mavi-muted font-bold block">
              Mahsulotlar
            </span>
            <h3 className="text-xl font-bold text-mavi-primary mt-1">{totalProducts}</h3>
            <span className="text-[10px] text-blue-600 font-semibold block mt-1">
              13 ta kategoriyada
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-sm border border-mavi-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-mavi-muted font-bold block">
              Mijozlar Bazasi
            </span>
            <h3 className="text-xl font-bold text-mavi-primary mt-1">{totalCustomers}</h3>
            <span className="text-[10px] text-purple-600 font-semibold block mt-1">
              Faol ro‘yxatdan o‘tganlar
            </span>
          </div>
          <div className="w-12 h-12 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ORDER STATUSES BREAKDOWN */}
      <div className="bg-white p-6 rounded-sm border border-mavi-border shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-luxury text-mavi-primary mb-4">
          Buyurtmalar Holati Bo‘yicha Taqsimot
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-amber-50 rounded border border-amber-200 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Kutilmoqda</span>
            <span className="text-lg font-bold text-amber-900 mt-0.5 block">{statusCounts.pending || 0}</span>
          </div>
          <div className="p-3 bg-purple-50 rounded border border-purple-200 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-800 block">Tayyorlanmoqda</span>
            <span className="text-lg font-bold text-purple-900 mt-0.5 block">{statusCounts.processing || 0}</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded border border-indigo-200 text-center">
            <span className="text-[10px] uppercase font-bold text-indigo-800 block">Yo‘lda / Kuryerda</span>
            <span className="text-lg font-bold text-indigo-900 mt-0.5 block">{statusCounts.shipped || 0}</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Yetkazildi</span>
            <span className="text-lg font-bold text-emerald-900 mt-0.5 block">{statusCounts.delivered || 0}</span>
          </div>
          <div className="p-3 bg-red-50 rounded border border-red-200 text-center">
            <span className="text-[10px] uppercase font-bold text-red-800 block">Bekor Qilindi</span>
            <span className="text-lg font-bold text-red-900 mt-0.5 block">{statusCounts.cancelled || 0}</span>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white p-6 rounded-sm border border-mavi-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-mavi-border">
          <h3 className="text-xs font-bold uppercase tracking-luxury text-mavi-primary">
            Oxirgi Buyurtmalar
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs text-mavi-primary hover:text-mavi-accent font-semibold flex items-center gap-1"
          >
            <span>Barchasini boshqarish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-mavi-secondary text-mavi-primary uppercase tracking-wider font-semibold border-b border-mavi-border">
                <th className="p-3">Order ID</th>
                <th className="p-3">Mijoz</th>
                <th className="p-3">Telefon</th>
                <th className="p-3">To‘lov</th>
                <th className="p-3">Jami</th>
                <th className="p-3">Telegram</th>
                <th className="p-3">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mavi-border">
              {recentOrders.length > 0 ? (
                recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-mavi-secondary/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-mavi-primary">#{ord.orderId}</td>
                    <td className="p-3 font-medium">{ord.customer.fullName}</td>
                    <td className="p-3 text-mavi-muted">{ord.customer.phone}</td>
                    <td className="p-3">{ord.paymentMethod}</td>
                    <td className="p-3 font-bold text-mavi-primary">
                      {ord.total.toLocaleString()} UZS
                    </td>
                    <td className="p-3">
                      {ord.telegramNotification?.sent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Yuborildi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold">
                          <AlertTriangle className="w-3 h-3" /> Yuborilmagan
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-mavi-primary">{ord.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-mavi-muted">
                    Hozircha buyurtmalar yo‘q.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
