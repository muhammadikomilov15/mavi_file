import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2
} from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import toast from 'react-hot-toast';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [resNew, resBest, resFeatured] = await Promise.all([
          api.get('/products?isNewArrival=true&limit=4'),
          api.get('/products?isBestSeller=true&limit=4'),
          api.get('/products?isFeatured=true&limit=4')
        ]);

        if (resNew.data.success) setNewArrivals(resNew.data.products);
        if (resBest.data.success) setBestSellers(resBest.data.products);
        if (resFeatured.data.success) setFeaturedProducts(resFeatured.data.products);
      } catch (err) {
        console.error('Home products loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      toast.success('Rahmat! Siz MAVI xabarnomasiga muvaffaqiyatli a’zo bo‘ldingiz.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] sm:h-[90vh] w-full overflow-hidden flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=90"
            alt="MAVI Campaign 2026"
            className="w-full h-full object-cover object-top filter brightness-[0.78]"
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-mavi-accent mb-4 animate-in fade-in slide-in-from-bottom-2">
            {t('hero.tagline')}
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-tight mb-4">
            {t('hero.title')}
          </h1>

          <p className="text-sm sm:text-lg md:text-xl font-light tracking-widest text-[#E0E0E0] max-w-2xl mb-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-mavi-primary text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent hover:text-white transition-all shadow-lg rounded-sm"
            >
              {t('hero.shopNow')}
            </Link>
            <Link
              to="/shop?category=women"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/80 text-white text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-mavi-primary transition-all rounded-sm backdrop-blur-sm"
            >
              {t('hero.explore')}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 text-[10px] tracking-widest uppercase flex flex-col items-center gap-1 animate-bounce">
          <span>Scroll</span>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BAR */}
      <section className="bg-mavi-secondary border-b border-mavi-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-mavi-accent">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-mavi-primary">
                  Tezkor Yetkazib Berish
                </h4>
                <p className="text-[11px] text-mavi-muted mt-0.5">
                  Toshkentda 24 soatda, viloyatlarda 48 soatda bepul yetkazish
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-mavi-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-mavi-primary">
                  100% Asl Sifat
                </h4>
                <p className="text-[11px] text-mavi-muted mt-0.5">
                  Tabiiy kashmir, sof jun va organik paxtadan tikilgan
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-mavi-accent">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-mavi-primary">
                  14 Kunlik Qaytarish
                </h4>
                <p className="text-[11px] text-mavi-muted mt-0.5">
                  Agar o‘lcham mos kelmasa, oson va bepul almashtirib beriladi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-mavi-border">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-mavi-accent font-bold">
                Kuz-Bahor 2026
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
                {t('home.newArrivals')}
              </h2>
              <p className="text-xs text-mavi-muted mt-1">{t('home.newArrivalsSubtitle')}</p>
            </div>
            <Link
              to="/shop?filter=new"
              className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-mavi-primary hover:text-mavi-accent flex items-center gap-1.5 transition-colors"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEN & WOMEN CAMPAIGN SPLIT */}
      <section className="py-8 bg-mavi-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Women Card */}
            <div className="group relative h-[480px] sm:h-[560px] overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85"
                alt="Women Collection"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12 text-white">
                <span className="text-[11px] uppercase tracking-[0.25em] text-mavi-accent font-semibold mb-2">
                  Atelier Feminine
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-4">
                  {t('home.womenCollection')}
                </h3>
                <div>
                  <Link
                    to="/shop?category=women"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-mavi-primary text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent hover:text-white transition-colors rounded-sm"
                  >
                    <span>{t('home.exploreCategory')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Men Card */}
            <div className="group relative h-[480px] sm:h-[560px] overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85"
                alt="Men Collection"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12 text-white">
                <span className="text-[11px] uppercase tracking-[0.25em] text-mavi-accent font-semibold mb-2">
                  Tailored Sartorial
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider mb-4">
                  {t('home.menCollection')}
                </h3>
                <div>
                  <Link
                    to="/shop?category=men"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-mavi-primary text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent hover:text-white transition-colors rounded-sm"
                  >
                    <span>{t('home.exploreCategory')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-mavi-border">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-mavi-accent font-bold">
                Signature Iconic Pieces
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
                {t('home.bestSellers')}
              </h2>
              <p className="text-xs text-mavi-muted mt-1">{t('home.bestSellersSubtitle')}</p>
            </div>
            <Link
              to="/shop?filter=bestseller"
              className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-mavi-primary hover:text-mavi-accent flex items-center gap-1.5 transition-colors"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL HIGHLIGHT BANNER */}
      <section className="relative py-28 bg-mavi-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1600&q=80"
            alt="Editorial"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-mavi-accent font-bold">
            Editorial Capsule 2026
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider my-4">
            The Pure Cashmere & Wool Capsule
          </h2>
          <p className="text-xs sm:text-sm text-[#CCCCCC] font-light leading-relaxed max-w-xl mx-auto mb-8">
            Har bir chiziq va tikuvda mukammallik. Italiya junidan tikilgan cheklangan miqdordagi paltolar to‘plami.
          </p>
          <Link
            to="/shop?category=coats"
            className="inline-block px-8 py-3.5 bg-mavi-accent text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent-hover transition-colors rounded-sm"
          >
            Kolleksiyani xarid qilish
          </Link>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-mavi-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-widest text-mavi-accent font-bold">
              Haqiqiy Mijozlar
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
              {t('home.customerReviews')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded shadow-sm border border-mavi-border flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-mavi-text leading-relaxed italic">
                  "Kashmir palto buyurtma qilgan edim, Toshkent bo‘yicha ertasi kuni ertalab olib kelib berishdi. Sifati, qad-qomatda turishi Massimo Dutti darajasidan ancha yuqori!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-mavi-border flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-mavi-primary">Sherzod Qodirov</h5>
                  <span className="text-[10px] text-mavi-muted">Toshkent shahri</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-8 rounded shadow-sm border border-mavi-border flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-mavi-text leading-relaxed italic">
                  "Ipak slip ko‘ylak haqiqatdan ham 100% sof ipak matodan tikilgan. Oqshom tadbirida juda hashamatli va bejirim ko‘rindi. Rahmat MAVI jamoasiga!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-mavi-border flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-mavi-primary">Nigora Alimova</h5>
                  <span className="text-[10px] text-mavi-muted">Samarqand</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-8 rounded shadow-sm border border-mavi-border flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-mavi-text leading-relaxed italic">
                  "Telegram orqali buyurtma qabul qilingani haqida zudlik bilan bildirishnoma keldi va menejer tezda bog‘landi. Premium servis va qulay to‘lov usullari!"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-mavi-border flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-mavi-primary">Jasurbek Usmonov</h5>
                  <span className="text-[10px] text-mavi-muted">Buxoro</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM GALLERY (#MAVISTYLE) */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-mavi-accent font-bold">
              {t('home.instagramTitle')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
              {t('home.instagramSubtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3">
            {[
              'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'
            ].map((imgUrl, idx) => (
              <a
                key={idx}
                href="https://instagram.com/mavi_boutique"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden bg-mavi-secondary block"
              >
                <img
                  src={imgUrl}
                  alt={`MAVI Look ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <InstagramIcon className="w-6 h-6" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION */}
      <section className="py-20 bg-mavi-primary text-white">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <span className="text-[10px] uppercase tracking-widest text-mavi-accent font-bold">
            Eksklyuziv Imtiyozlar
          </span>
          <h2 className="font-serif text-3xl font-bold uppercase tracking-wider my-2">
            {t('home.newsletterTitle')}
          </h2>
          <p className="text-xs text-[#A0A0A0] mb-8 leading-relaxed">
            {t('home.newsletterSubtitle')}
          </p>

          {newsletterSubmitted ? (
            <div className="p-4 bg-white/10 rounded border border-white/20 text-xs font-medium text-emerald-400">
              ✓ Tabriklaymiz! Sizga birinchi buyurtmangiz uchun maxsus promokod jo‘natildi.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('home.newsletterPlaceholder')}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-sm text-xs text-white placeholder:text-[#888888] focus:outline-none focus:border-mavi-accent"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-mavi-primary text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent hover:text-white transition-colors rounded-sm shrink-0"
              >
                {t('home.subscribe')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Home;
