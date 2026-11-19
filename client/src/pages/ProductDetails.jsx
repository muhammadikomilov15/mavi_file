import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  ShoppingBag,
  Share2,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import SizeGuideModal from '../components/SizeGuideModal';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'materials' | 'reviews'

  // New review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setRelatedProducts(res.data.relatedProducts || []);
          setSelectedImage(prod.images?.[0] || '');
          setSelectedSize(prod.sizes?.[0] || '');
          setSelectedColor(prod.colors?.[0] || null);
          setQuantity(1);

          // Save to recently viewed
          try {
            const stored = JSON.parse(localStorage.getItem('mavi_recently_viewed') || '[]');
            const filtered = stored.filter((p) => p._id !== prod._id);
            const updated = [prod, ...filtered].slice(0, 4);
            localStorage.setItem('mavi_recently_viewed', JSON.stringify(updated));
            setRecentlyViewed(updated.filter((p) => p._id !== prod._id));
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${id}`);
        if (res.data.success) {
          setReviews(res.data.reviews || []);
          setAverageRating(res.data.averageRating || 5.0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchProductData();
    fetchReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mavi-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-serif text-2xl font-bold mb-2">Mahsulot topilmadi</h2>
        <Link to="/shop" className="text-xs uppercase tracking-widest text-mavi-accent underline">
          Do‘konga qaytish
        </Link>
      </div>
    );
  }

  const lang = i18n.language || 'uz';
  const name = product.name?.[lang] || product.name?.uz;
  const description = product.description?.[lang] || product.description?.uz;
  const isFavorited = isInWishlist(product._id);

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const effectivePrice = hasDiscount ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t('product.selectSize'));
      return;
    }
    if (!selectedColor) {
      toast.error(t('product.selectColor'));
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Iltimos, o‘lcham va rangni tanlang');
      return;
    }
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      toast.error('Barcha maydonlarni to‘ldiring');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.data.success) {
        toast.success('Fikringiz muvaffaqiyatli qabul qilindi!');
        setReviews([res.data.review, ...reviews]);
        setReviewComment('');
        setReviewName('');
      }
    } catch (err) {
      toast.error('Fikr qoldirishda xatolik yuz berdi');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-mavi-border bg-mavi-secondary/40 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-mavi-muted">
            <Link to="/" className="hover:text-mavi-primary">{t('nav.home')}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-mavi-primary">{t('nav.shop')}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-mavi-primary uppercase">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-mavi-primary font-medium truncate max-w-[200px]">{name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[3/4] w-16 sm:w-full rounded overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'border-mavi-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Zoom Display */}
            <div className="flex-1 relative aspect-[3/4] bg-mavi-secondary rounded-sm overflow-hidden group">
              <img
                src={selectedImage || product.images?.[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 cursor-crosshair"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.isNewArrival && (
                  <span className="bg-mavi-primary text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    {t('product.newBadge')}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-red-700 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    -{discountPercent}% {t('product.saleBadge')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information & Checkout Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-mavi-muted uppercase tracking-wider mb-2">
                <span>{product.category}</span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-mavi-primary leading-tight">
                {name}
              </h1>

              {/* Rating Review Summary */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-mavi-primary">{averageRating}</span>
                <span className="text-xs text-mavi-muted">({reviews.length} {t('product.reviews')})</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3 pb-6 border-b border-mavi-border">
                <span className="text-2xl sm:text-3xl font-bold text-mavi-primary">
                  {effectivePrice.toLocaleString()} UZS
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-mavi-muted line-through">
                      {product.price.toLocaleString()} UZS
                    </span>
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Tejam: {(product.price - product.discountPrice).toLocaleString()} UZS
                    </span>
                  </>
                )}
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-mavi-text">
                      {t('product.selectColor')}:
                    </span>
                    <span className="text-xs text-mavi-muted font-medium">{selectedColor?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                          selectedColor?.name === color.name
                            ? 'ring-2 ring-offset-2 ring-mavi-primary border-transparent'
                            : 'border-mavi-border hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        {selectedColor?.name === color.name && (
                          <Check className={`w-3.5 h-3.5 ${color.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector + Size Guide */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-mavi-text">
                      {t('product.selectSize')}
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-mavi-accent hover:text-mavi-primary flex items-center gap-1 underline underline-offset-2"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{t('product.sizeGuide')}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 py-2 px-3 text-xs font-medium uppercase rounded border text-center transition-all ${
                          selectedSize === size
                            ? 'bg-mavi-primary text-white border-mavi-primary'
                            : 'border-mavi-border text-mavi-text hover:border-mavi-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock Status */}
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-mavi-text block mb-2">
                    {t('product.quantity')}
                  </span>
                  <div className="flex items-center border border-mavi-border rounded w-32">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-sm text-mavi-muted hover:text-mavi-primary"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-xs font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3.5 py-2 text-sm text-mavi-muted hover:text-mavi-primary"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-5">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>{t('product.inStock')} ({product.stock} {t('product.itemsLeft')})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{t('product.outOfStock')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('product.addToCart')}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 border border-mavi-primary text-mavi-primary text-xs uppercase tracking-widest font-semibold hover:bg-mavi-primary hover:text-white transition-colors rounded-sm text-center disabled:opacity-50"
                >
                  <span>{t('product.buyNow')}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border rounded-sm transition-colors flex items-center justify-center shrink-0 ${
                    isFavorited
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-mavi-border text-mavi-primary hover:border-mavi-primary'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="mt-8 p-4 bg-mavi-secondary rounded space-y-2.5 text-xs text-mavi-text">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-mavi-accent shrink-0" />
                  <span>Toshkentda 24 soat ichida, O‘zbekiston bo‘ylab 48 soatda bepul yetkazish.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-mavi-accent shrink-0" />
                  <span>14 kun ichida o‘lcham mos kelmasa oson qaytarish yoki almashtirish.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-mavi-accent shrink-0" />
                  <span>100% asl sifat kafolati va qulay to‘lov (Naqd / Click / Payme).</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS: Description, Material & Reviews */}
        <div className="mt-16 pt-10 border-t border-mavi-border">
          <div className="flex items-center justify-center gap-8 border-b border-mavi-border pb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-xs uppercase tracking-widest font-bold pb-2 transition-colors ${
                activeTab === 'description'
                  ? 'text-mavi-primary border-b-2 border-mavi-primary'
                  : 'text-mavi-muted hover:text-mavi-primary'
              }`}
            >
              {t('product.description')}
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`text-xs uppercase tracking-widest font-bold pb-2 transition-colors ${
                activeTab === 'materials'
                  ? 'text-mavi-primary border-b-2 border-mavi-primary'
                  : 'text-mavi-muted hover:text-mavi-primary'
              }`}
            >
              {t('product.materialCare')}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs uppercase tracking-widest font-bold pb-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'text-mavi-primary border-b-2 border-mavi-primary'
                  : 'text-mavi-muted hover:text-mavi-primary'
              }`}
            >
              {t('product.reviews')} ({reviews.length})
            </button>
          </div>

          <div className="py-8 max-w-3xl mx-auto">
            {activeTab === 'description' && (
              <div className="text-xs sm:text-sm text-mavi-text leading-relaxed space-y-4">
                <p>{description}</p>
                <p className="text-mavi-muted">
                  MAVI liboslari zamonaviy shaharlik insonning didi va qulayligini hisobga olgan holda loyihalashtiriladi. Barcha tikuvlar va furnituralar xalqaro standartlarga to‘liq javob beradi.
                </p>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4 text-xs sm:text-sm text-mavi-text">
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-1">Tarkibi / Material:</h4>
                  <p className="text-mavi-muted">{product.material || '100% Organik Paxta va Sof Jun aralashmasi'}</p>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider mb-1">Parvarish bo‘yicha ko‘rsatmalar:</h4>
                  <p className="text-mavi-muted">{product.careInstructions || '30°C da qo‘lda yuvish yoki professional quruq tozalash tavsiya etiladi.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Write a review */}
                <form onSubmit={handleReviewSubmit} className="bg-mavi-secondary p-6 rounded space-y-4">
                  <h4 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
                    {t('product.writeReview')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-mavi-muted block mb-1">
                        {t('product.yourName')}
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-mavi-border rounded text-mavi-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-mavi-muted block mb-1">
                        {t('product.yourRating')}
                      </label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-mavi-border rounded text-mavi-primary"
                      >
                        <option value="5">★★★★★ (5/5)</option>
                        <option value="4">★★★★☆ (4/5)</option>
                        <option value="3">★★★☆☆ (3/5)</option>
                        <option value="2">★★☆☆☆ (2/5)</option>
                        <option value="1">★☆☆☆☆ (1/5)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-mavi-muted block mb-1">
                      {t('product.yourComment')}
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-mavi-border rounded text-mavi-primary"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-mavi-accent transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? 'Yuborilmoqda...' : t('product.submitReview')}
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 border border-mavi-border rounded bg-white">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-mavi-primary">{rev.name}</span>
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-mavi-text leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-mavi-muted text-center py-4">
                      Hozircha sharhlar yo‘q. Birinchi bo‘lib o‘z fikringizni qoldiring!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-mavi-border">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-mavi-primary mb-8 text-center">
              {t('product.relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}

        {/* RECENTLY VIEWED PRODUCTS */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-12 border-t border-mavi-border">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-mavi-primary mb-8 text-center">
              {t('product.recentlyViewed')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map((rec) => (
                <ProductCard key={rec._id} product={rec} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};

export default ProductDetails;
