import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, DollarSign } from 'lucide-react';
import api from '../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/admin/customers');
        if (res.data.success) {
          setCustomers(res.data.customers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-mavi-primary">
          Mijozlar Bazasi
        </h1>
        <p className="text-xs text-mavi-muted mt-0.5">
          Ro‘yxatdan o‘tgan xaridorlar, buyurtmalar soni va jami sarflangan mablag‘
        </p>
      </div>

      <div className="bg-white rounded-sm border border-mavi-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-mavi-secondary text-mavi-primary uppercase tracking-wider font-semibold border-b border-mavi-border">
                <th className="p-3">Mijoz Ismi</th>
                <th className="p-3">Elektron Pochta</th>
                <th className="p-3">Telefon</th>
                <th className="p-3">Buyurtmalar</th>
                <th className="p-3">Jami Xarid (UZS)</th>
                <th className="p-3">Ro‘yxatdan o‘tgan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mavi-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-mavi-muted animate-pulse">
                    Mijozlar ro‘yxati yuklanmoqda...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-mavi-secondary/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-mavi-primary text-white text-[11px] font-bold flex items-center justify-center">
                          {cust.fullName.charAt(0)}
                        </div>
                        <span className="font-bold text-mavi-primary">{cust.fullName}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-mavi-text">{cust.email}</td>
                    <td className="p-3 text-mavi-text font-mono">{cust.phone}</td>
                    <td className="p-3 font-semibold text-mavi-primary">
                      {cust.ordersCount || 0} ta
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      {(cust.totalSpent || 0).toLocaleString()} UZS
                    </td>
                    <td className="p-3 text-mavi-muted">
                      {new Date(cust.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-mavi-muted">
                    Hozircha mijozlar mavjud emas.
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

export default AdminCustomers;
