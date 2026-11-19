import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If not admin, redirect to admin login
  if (!isAdmin) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Umumiy Tahlil / Overview' },
    { to: '/admin/products', icon: Package, label: 'Mahsulotlar / Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Buyurtmalar / Orders' },
    { to: '/admin/customers', icon: Users, label: 'Mijozlar / Customers' },
    { to: '/admin/coupons', icon: Tag, label: 'Promokodlar / Coupons' },
    { to: '/admin/settings', icon: Settings, label: 'Sozlamalar & Telegram' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row text-mavi-text">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-mavi-primary text-white flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                MAVI
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-mavi-accent font-mono">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-mavi-accent" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & External Links */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#A0A0A0] hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Do‘konni ochish</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-mavi-border h-16 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-mavi-text hover:text-mavi-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 hidden sm:inline" />
              <span className="text-xs font-semibold text-mavi-primary uppercase tracking-wider">
                MAVI Boshqaruv Markazi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="flex items-center gap-2.5 pl-3 border-l border-mavi-border">
              <div className="w-8 h-8 rounded-full bg-mavi-primary text-white text-xs font-bold flex items-center justify-center">
                A
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-mavi-primary leading-tight">{user?.fullName || 'Admin'}</p>
                <p className="text-[10px] text-mavi-muted font-mono">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* MOBILE DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-64 bg-mavi-primary text-white h-full p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="font-serif text-2xl font-bold tracking-widest">MAVI</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-5 h-5 text-[#A0A0A0]" />
                </button>
              </div>

              <nav className="py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-xs rounded text-[#A0A0A0] hover:text-white"
                  >
                    <item.icon className="w-4 h-4 text-mavi-accent" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2 text-xs text-[#A0A0A0]"
              >
                <Store className="w-4 h-4" />
                <span>Do‘konga o‘tish</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                className="flex items-center gap-2 text-xs text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
