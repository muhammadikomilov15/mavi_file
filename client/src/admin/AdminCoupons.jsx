import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Calendar, Check, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 300000,
    maxDiscount: 150000,
    expiryDate: '2028-12-31'
  });

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', {
        ...newCoupon,
        code: newCoupon.code.toUpperCase().trim(),
        discountValue: Number(newCoupon.discountValue),
        minOrderAmount: Number(newCoupon.minOrderAmount),
        maxDiscount: Number(newCoupon.maxDiscount)
      });

      if (res.data.success) {
        toast.success('Yangi promokod yaratildi');
        setIsAdding(false);
        setNewCoupon({
          code: '',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 300000,
          maxDiscount: 150000,
          expiryDate: '2028-12-31'
        });
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Promokod yaratishda xatolik');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Ushbu promokodni o‘chirmoqchimisiz?')) {
      try {
        await api.delete(`/coupons/${id}`);
        toast.success('Promokod o‘chirildi');
        fetchCoupons();
      } catch (err) {
        toast.error('Xatolik yuz berdi');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-mavi-primary">
            Chegirma Promokodlari
          </h1>
          <p className="text-xs text-mavi-muted mt-0.5">
            Xaridorlar uchun chegirma kuponlari va aksiyalarni boshqarish
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded flex items-center justify-center gap-2 hover:bg-mavi-accent transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Promokod</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateCoupon} className="p-6 bg-white border border-mavi-border rounded-sm shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-serif text-sm font-bold uppercase text-mavi-primary">
            Yangi Kupon Parametrlari
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">Kupon Kodi *</label>
              <input
                type="text"
                required
                placeholder="MASALAN: MAVI20"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                className="w-full px-3 py-2 text-xs uppercase border border-mavi-border rounded font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">Chegirma Turi</label>
              <select
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-mavi-border rounded bg-white"
              >
                <option value="percentage">Foiz (%)</option>
                <option value="fixed">Qat’iy Summa (UZS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">Qiymati *</label>
              <input
                type="number"
                required
                value={newCoupon.discountValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-mavi-border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">Minimal Buyurtma (UZS)</label>
              <input
                type="number"
                value={newCoupon.minOrderAmount}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-mavi-border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">Amal Qilish Muddati</label>
              <input
                type="date"
                required
                value={newCoupon.expiryDate}
                onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-mavi-border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-mavi-border">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-mavi-muted hover:text-mavi-primary"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-mavi-primary text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-mavi-accent"
            >
              Kuponni Saqlash
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      <div className="bg-white rounded-sm border border-mavi-border shadow-sm overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-mavi-secondary text-mavi-primary uppercase tracking-wider font-semibold border-b border-mavi-border">
              <th className="p-3">Kupon Kodi</th>
              <th className="p-3">Chegirma Miqdori</th>
              <th className="p-3">Min. Xarid Summasi</th>
              <th className="p-3">Muddati</th>
              <th className="p-3">Ishlatilgan</th>
              <th className="p-3 text-right">O‘chirish</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mavi-border">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-mavi-secondary/40 transition-colors">
                <td className="p-3 font-mono font-bold text-mavi-primary">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded">
                    {c.code}
                  </span>
                </td>
                <td className="p-3 font-bold text-emerald-700">
                  {c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue.toLocaleString()} UZS`}
                </td>
                <td className="p-3 text-mavi-text">
                  {c.minOrderAmount ? `${c.minOrderAmount.toLocaleString()} UZS` : 'Cheklovsiz'}
                </td>
                <td className="p-3 text-mavi-muted">
                  {new Date(c.expiryDate).toLocaleDateString('uz-UZ')}
                </td>
                <td className="p-3 font-medium text-mavi-primary">{c.usedCount || 0} marta</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
