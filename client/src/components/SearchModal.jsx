import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const SearchModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setLoading(true);
        try {
          const res = await api.get(`/products?search=${encodeURIComponent(searchTerm.trim())}&limit=6`);
          if (res.data.success) {
            setResults(res.data.products);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectProduct = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between pb-6 border-b border-mavi-border">
          <span className="font-serif tracking-widest text-lg font-bold">MAVI</span>
          <button
            onClick={onClose}
            className="p-2 text-mavi-muted hover:text-mavi-primary transition-colors rounded-full hover:bg-mavi-secondary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSearchSubmit} className="relative mt-8">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-mavi-muted" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
            className="w-full bg-transparent pl-10 pr-12 py-4 text-xl sm:text-2xl font-light text-mavi-primary placeholder:text-mavi-muted/60 border-b-2 border-mavi-primary focus:outline-none"
          />
          {searchTerm && (
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-mavi-primary hover:text-mavi-accent"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </form>

        {/* Suggestions & Results */}
        <div className="mt-8 max-h-[65vh] overflow-y-auto pr-2">
          {loading && (
            <div className="py-12 text-center text-mavi-muted animate-pulse">
              Qidirilmoqda...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-mavi-muted font-semibold mb-4">
                {results.length} ta natija topildi
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSelectProduct(product._id)}
                    className="flex items-center gap-3 p-2 rounded hover:bg-mavi-secondary cursor-pointer transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name[i18n.language] || product.name.uz}
                      className="w-16 h-20 object-cover rounded bg-mavi-secondary"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-mavi-primary line-clamp-1">
                        {product.name[i18n.language] || product.name.uz}
                      </h4>
                      <p className="text-xs text-mavi-muted mt-0.5">{product.category}</p>
                      <p className="text-sm font-semibold text-mavi-primary mt-1">
                        {product.price.toLocaleString()} UZS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && searchTerm.trim().length > 1 && results.length === 0 && (
            <div className="text-center py-12 text-mavi-muted">
              "{searchTerm}" bo‘yicha mahsulot topilmadi.
            </div>
          )}

          {searchTerm.trim().length <= 1 && (
            <div className="py-6">
              <p className="text-xs uppercase tracking-widest text-mavi-muted font-semibold mb-3">
                Mashhur kategoriyalar
              </p>
              <div className="flex flex-wrap gap-2">
                {['men', 'women', 'coats', 'dresses', 'jackets', 'shirts'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onClose();
                      navigate(`/shop?category=${cat}`);
                    }}
                    className="px-4 py-2 bg-mavi-secondary hover:bg-mavi-border text-xs uppercase tracking-luxury text-mavi-text rounded-full transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
