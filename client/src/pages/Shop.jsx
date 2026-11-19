import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Filter,
  X,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

const categoriesList = [
  { id: 'all', label: 'Barchasi / All' },
  { id: 'men', label: 'Erkaklar (Men)' },
  { id: 'women', label: 'Ayollar (Women)' },
  { id: 'coats', label: 'Paltolar (Coats)' },
  { id: 'jackets', label: 'Kurtkalar (Jackets)' },
  { id: 'dresses', label: 'Ko‘ylaklar (Dresses)' },
  { id: 'shirts', label: 'Rubashkalar (Shirts)' },
  { id: 't-shirts', label: 'Futbolkalar (T-Shirts)' },
  { id: 'hoodies', label: 'Xudilar (Hoodies)' },
  { id: 'sweatshirts', label: 'Svitshtlar (Sweatshirts)' },
  { id: 'trousers', label: 'Shimlar (Trousers)' },
  { id: 'jeans', label: 'Jinsilar (Jeans)' },
  { id: 'shoes', label: 'Poyabzallar (Shoes)' },
  { id: 'accessories', label: 'Aksessuarlar (Accessories)' }
];

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '40', '41', '42', '43', '44', 'One Size'];

const availableColors = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Camel', hex: '#B8A58A' },
  { name: 'Grey', hex: '#666666' },
  { name: 'Blue', hex: '#1B263B' },
  { name: 'Brown', hex: '#4A3B32' }
];

const Shop = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state from URL or defaults
  const categoryParam = searchParams.get('category') || 'all';
  const filterParam = searchParams.get('filter') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sizesParam = searchParams.get('sizes') ? searchParams.get('sizes').split(',') : [];
  const inStockParam = searchParams.get('inStock') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [selectedSizes, setSelectedSizes] = useState(sizesParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedSort(searchParams.get('sort') || 'newest');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSelectedSizes(searchParams.get('sizes') ? searchParams.get('sizes').split(',') : []);
    setInStockOnly(searchParams.get('inStock') === 'true');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedSort) params.append('sort', selectedSort);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (selectedSizes.length > 0) params.append('sizes', selectedSizes.join(','));
      if (inStockOnly) params.append('inStock', 'true');
      if (filterParam === 'new') params.append('isNewArrival', 'true');
      if (filterParam === 'bestseller') params.append('isBestSeller', 'true');
      if (searchParam) params.append('search', searchParam);
      params.append('page', currentPage);
      params.append('limit', 12);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalProducts(res.data.totalProducts);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, selectedSort, minPrice, maxPrice, selectedSizes, inStockOnly, filterParam, searchParam, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSizeToggle = (size) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(updated);
    updateParam('sizes', updated.length > 0 ? updated.join(',') : '');
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSizes([]);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-mavi-secondary border-b border-mavi-border py-10 sm:py-14 text-center">
        <div className="container mx-auto px-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-mavi-accent">
            MAVI Atelier Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
            {searchParam ? `Qidiruv: "${searchParam}"` : selectedCategory !== 'all' ? selectedCategory : t('catalog.allProducts')}
          </h1>
          <p className="text-xs text-mavi-muted mt-2 max-w-md mx-auto">
            Klassik tikuvchilik an’analari va zamonaviy minimalist estetika uyg‘unligi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-mavi-border gap-4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-mavi-border rounded text-xs uppercase tracking-wider font-semibold hover:border-mavi-primary"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('catalog.filters')}</span>
          </button>

          {/* Showing Count */}
          <div className="text-xs text-mavi-muted">
            {t('catalog.showing')} <span className="font-semibold text-mavi-primary">{products.length}</span> {t('catalog.of')}{' '}
            <span className="font-semibold text-mavi-primary">{totalProducts}</span> {t('catalog.products')}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <span className="text-xs text-mavi-muted hidden sm:inline">{t('catalog.sortBy')}:</span>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                updateParam('sort', e.target.value);
              }}
              className="bg-transparent border border-mavi-border text-xs uppercase tracking-wider text-mavi-text py-2 px-3 rounded focus:outline-none focus:border-mavi-primary cursor-pointer"
            >
              <option value="newest">{t('catalog.sortNewest')}</option>
              <option value="popular">{t('catalog.sortPopular')}</option>
              <option value="price-asc">{t('catalog.sortPriceAsc')}</option>
              <option value="price-desc">{t('catalog.sortPriceDesc')}</option>
            </select>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-10 mt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            {/* Clear All */}
            <div className="flex items-center justify-between pb-2 border-b border-mavi-border">
              <h3 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
                {t('catalog.filters')}
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-[11px] text-mavi-muted hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('catalog.clearFilters')}</span>
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-mavi-primary mb-3">
                {t('catalog.category')}
              </h4>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      updateParam('category', cat.id === 'all' ? '' : cat.id);
                    }}
                    className={`w-full text-left py-1 text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'text-mavi-primary font-bold'
                        : 'text-mavi-muted hover:text-mavi-primary'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <span className="w-1.5 h-1.5 rounded-full bg-mavi-accent"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-mavi-border pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-mavi-primary mb-3">
                {t('catalog.priceRange')} (UZS)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => updateParam('minPrice', minPrice)}
                  className="w-full px-2.5 py-1.5 text-xs border border-mavi-border rounded text-mavi-primary placeholder:text-mavi-muted focus:outline-none focus:border-mavi-primary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => updateParam('maxPrice', maxPrice)}
                  className="w-full px-2.5 py-1.5 text-xs border border-mavi-border rounded text-mavi-primary placeholder:text-mavi-muted focus:outline-none focus:border-mavi-primary"
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="border-t border-mavi-border pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-mavi-primary mb-3">
                {t('catalog.size')}
              </h4>
              <div className="grid grid-cols-4 gap-1.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`py-1.5 text-xs font-medium uppercase rounded border text-center transition-colors ${
                      selectedSizes.includes(size)
                        ? 'bg-mavi-primary text-white border-mavi-primary'
                        : 'border-mavi-border text-mavi-text hover:border-mavi-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="border-t border-mavi-border pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    updateParam('inStock', e.target.checked ? 'true' : '');
                  }}
                  className="checkbox checkbox-xs rounded border-mavi-border checked:bg-mavi-primary"
                />
                <span className="text-xs text-mavi-text font-medium">{t('catalog.inStockOnly')}</span>
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="aspect-[3/4] bg-mavi-secondary rounded"></div>
                    <div className="h-4 bg-mavi-secondary rounded w-3/4"></div>
                    <div className="h-3 bg-mavi-secondary rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-mavi-border">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          updateParam('page', (i + 1).toString());
                        }}
                        className={`w-9 h-9 text-xs font-semibold rounded transition-colors ${
                          currentPage === i + 1
                            ? 'bg-mavi-primary text-white'
                            : 'border border-mavi-border text-mavi-text hover:bg-mavi-secondary'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 px-4">
                <h3 className="font-serif text-xl font-bold text-mavi-primary mb-2">
                  {t('catalog.noProductsFound')}
                </h3>
                <p className="text-xs text-mavi-muted mb-6">
                  {t('catalog.noProductsSuggestion')}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-mavi-accent transition-colors"
                >
                  {t('catalog.clearFilters')}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-mavi-border">
                <h3 className="text-sm font-bold uppercase tracking-wider">{t('catalog.filters')}</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-mavi-muted" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="py-4 border-b border-mavi-border">
                <h4 className="text-xs font-bold uppercase mb-2">{t('catalog.category')}</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        updateParam('category', cat.id === 'all' ? '' : cat.id);
                      }}
                      className={`block w-full text-left text-xs py-1 ${
                        selectedCategory === cat.id ? 'font-bold text-mavi-primary' : 'text-mavi-muted'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Sizes */}
              <div className="py-4 border-b border-mavi-border">
                <h4 className="text-xs font-bold uppercase mb-2">{t('catalog.size')}</h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`py-1 text-xs border rounded ${
                        selectedSizes.includes(size) ? 'bg-mavi-primary text-white' : 'border-mavi-border'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-mavi-border">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded"
              >
                Natijalarni ko‘rish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Shop;
