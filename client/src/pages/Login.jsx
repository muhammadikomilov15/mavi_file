import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
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
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs text-mavi-muted mt-1">
            Buyurtmalaringiz va shaxsiy imtiyozlaringizni boshqaring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-mavi-border rounded text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Tekshirilmoqda...' : t('auth.loginBtn')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-mavi-border text-center space-y-3">
          <p className="text-xs text-mavi-muted">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-mavi-primary hover:underline">
              {t('auth.registerTitle')}
            </Link>
          </p>
          <div className="p-3 bg-mavi-secondary rounded text-[11px] text-mavi-muted text-left font-mono">
            <strong>Sinov uchun mijoz akkaunti:</strong>
            <br />
            Email: customer@mavi.uz
            <br />
            Parol: CustomerPassword2026!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
