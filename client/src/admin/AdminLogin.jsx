import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@mavi.uz');
  const [password, setPassword] = useState('AdminPassword2026!');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      if (res.user?.role === 'admin') {
        toast.success('Admin paneliga xush kelibsiz!');
        navigate('/admin');
      } else {
        toast.error('Sizda administrator huquqlari mavjud emas.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-mavi-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1A1A] text-white p-8 sm:p-10 rounded border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="font-serif text-3xl font-bold tracking-[0.25em] text-white block">
            MAVI
          </span>
          <h2 className="text-sm uppercase tracking-widest font-bold text-amber-500 mt-2">
            Administrator Kirishi
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Ushbu bo‘lim faqat tasdiqlangan do‘kon xodimlari uchun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase text-[#AAAAAA] block mb-1">
              Admin E-Mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mavi.uz"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#242424] border border-white/10 rounded text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-[#AAAAAA] block mb-1">
              Parol
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#242424] border border-white/10 rounded text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white text-xs uppercase tracking-widest font-bold transition-colors rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-6"
          >
            {loading ? 'Tasdiqlanmoqda...' : 'Boshqaruv Paneliga Kirish'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#777777] font-mono">
            Standart admin: admin@mavi.uz / AdminPassword2026!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
