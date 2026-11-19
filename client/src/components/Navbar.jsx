import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ShieldAlert,
  Package,
  LogOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import SearchModal from './SearchModal';

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/shop?category=men', label: t('nav.men') },
    { to: '/shop?category=women', label: t('nav.women') },
    { to: '/shop?filter=new', label: t('nav.newArrivals') },
    { to: '/shop?filter=bestseller', label: t('nav.collections') }
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-mavi-primary text-white text-[11px] tracking-widest uppercase py-2 text-center font-medium px-4">
        <span>{t('home.freeDeliveryBadge')}</span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mavi-border transition-all">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-mavi-primary hover:text-mavi-accent transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop Navigation Links (Left) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.slice(0, 4).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-luxury font-medium transition-colors hover:text-mavi-accent ${
                      isActive ? 'text-mavi-primary font-semibold border-b border-mavi-primary pb-1' : 'text-mavi-text'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Brand Logo (Center) */}
            <div className="flex-1 lg:flex-initial text-center">
              <Link to="/" className="inline-block">
                <span className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.25em] text-mavi-primary uppercase">
                  MAVI
                </span>
                <span className="block text-[8px] uppercase tracking-[0.35em] text-mavi-muted font-sans font-medium -mt-1">
                  Atelier
                </span>
              </Link>
            </div>

            {/* Right Desktop Links + Actions */}
            <div className="flex items-center gap-6">
              <nav className="hidden lg:flex items-center gap-8 mr-2">
                {navLinks.slice(4).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-xs uppercase tracking-luxury font-medium transition-colors hover:text-mavi-accent ${
                        isActive ? 'text-mavi-primary font-semibold border-b border-mavi-primary pb-1' : 'text-mavi-text'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Search Icon */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-1.5 text-mavi-primary hover:text-mavi-accent transition-colors"
                title={t('nav.search')}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-1.5 text-mavi-primary hover:text-mavi-accent transition-colors"
                title={t('nav.wishlist')}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mavi-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Icon */}
              <Link
                to="/cart"
                className="relative p-1.5 text-mavi-primary hover:text-mavi-accent transition-colors"
                title={t('nav.cart')}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mavi-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="p-1.5 text-mavi-primary hover:text-mavi-accent transition-colors flex items-center"
                  title={t('nav.account')}
                >
                  <User className="w-5 h-5" />
                </button>

                {accountDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-52 bg-white border border-mavi-border rounded-md shadow-xl py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setAccountDropdownOpen(false)}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-mavi-border">
                          <p className="text-xs font-semibold text-mavi-primary truncate">
                            {user?.fullName}
                          </p>
                          <p className="text-[11px] text-mavi-muted truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-mavi-text hover:bg-mavi-secondary"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>{t('auth.profile')}</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-mavi-text hover:bg-mavi-secondary"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>{t('auth.orders')}</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-700 font-semibold bg-amber-50 hover:bg-amber-100"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                            <span>{t('nav.admin')}</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 text-left border-t border-mavi-border mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('nav.logout')}</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-mavi-text hover:bg-mavi-secondary"
                        >
                          <span>{t('nav.login')}</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-mavi-muted hover:bg-mavi-secondary"
                        >
                          <span>{t('nav.register')}</span>
                        </Link>
                        <div className="border-t border-mavi-border my-1"></div>
                        <Link
                          to="/admin/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[11px] text-mavi-muted hover:text-mavi-primary"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{t('nav.admin')}</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-mavi-border">
                <span className="font-serif text-2xl font-bold tracking-widest">MAVI</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-mavi-muted hover:text-mavi-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Language Switcher */}
              <div className="mt-4 pb-4 border-b border-mavi-border">
                <p className="text-[11px] uppercase tracking-widest text-mavi-muted mb-2 font-medium">
                  Til / Language
                </p>
                <LanguageSwitcher isMobile={true} />
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-4 py-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-luxury font-medium text-mavi-text hover:text-mavi-accent py-1"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-mavi-border">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold">{user?.fullName}</div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs uppercase tracking-wider text-mavi-muted hover:text-mavi-primary"
                  >
                    {t('auth.profile')}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs uppercase tracking-wider text-amber-700 font-bold"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs uppercase tracking-wider text-red-600 block pt-2"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs uppercase tracking-wider font-semibold border border-mavi-primary text-mavi-primary rounded"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs uppercase tracking-wider font-semibold bg-mavi-primary text-white rounded"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};

export default Navbar;
