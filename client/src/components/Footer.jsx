import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Send,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  Truck
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-mavi-dark text-[#D5D5D5] pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-3xl font-bold tracking-[0.25em] text-white">
              MAVI
            </span>
            <p className="text-xs text-[#999999] leading-relaxed max-w-sm">
              {t('footer.about')}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://t.me/mavi_boutique"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-mavi-accent transition-colors"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/mavi_boutique"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-mavi-accent transition-colors"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-2 text-xs text-[#A0A0A0]">
              <li>
                <Link to="/shop?category=men" className="hover:text-white transition-colors">
                  {t('nav.men')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=women" className="hover:text-white transition-colors">
                  {t('nav.women')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=coats" className="hover:text-white transition-colors">
                  Paltolar & Kurtkalar
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dresses" className="hover:text-white transition-colors">
                  Ko‘ylaklar
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="hover:text-white transition-colors">
                  {t('nav.newArrivals')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2 text-xs text-[#A0A0A0]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-white transition-colors">
                  {t('footer.delivery')}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">
              Concierge
            </h4>
            <div className="space-y-2.5 text-xs text-[#A0A0A0]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-mavi-accent shrink-0 mt-0.5" />
                <span>Amir Temur shoh ko‘chasi, 107A, Toshkent, O‘zbekiston</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-mavi-accent shrink-0" />
                <span>+998 71 200 00 00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-mavi-accent shrink-0" />
                <span>concierge@mavi.uz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Payment Methods & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#777777]">
          <div>
            &copy; {new Date().getFullYear()} MAVI Boutique LLC. {t('footer.rights')}
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-mono tracking-wider text-[#CCCCCC]">
              Click
            </span>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-mono tracking-wider text-[#CCCCCC]">
              Payme
            </span>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-mono tracking-wider text-[#CCCCCC]">
              COD / Naqd
            </span>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-mono tracking-wider text-[#CCCCCC]">
              UzCard / Humo
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
