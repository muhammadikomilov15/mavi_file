import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+998 ',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Parollar bir-biriga mos kelmadi');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Parol kamida 6 belgidan iborat bo‘lishi lozim');
      return;
    }

    setLoading(true);
    const res = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    setLoading(false);

    if (res?.success) {
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-mavi-secondary/50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-mavi-border">
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] text-mavi-primary uppercase">
            MAVI
          </span>
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-mavi-primary mt-3">
            {t('auth.registerTitle')}
          </h2>
          <p className="text-xs text-mavi-muted mt-1">
            MAVI eksklyuziv a’zolar klubiga xush kelibsiz
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              {t('auth.fullName')} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Aziz Rakhimov"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              {t('auth.email')} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              {t('auth.phone')} *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              {t('auth.password')} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              Parolni tasdiqlash *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-6"
          >
            {loading ? 'Yaratilmoqda...' : t('auth.registerBtn')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-mavi-border text-center">
          <p className="text-xs text-mavi-muted">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-semibold text-mavi-primary hover:underline">
              {t('auth.loginTitle')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
