import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Check,
  Package,
  Sparkles,
  Eye
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const availableCategories = [
  'men',
  'women',
  'coats',
  'jackets',
  'dresses',
  'shirts',
  't-shirts',
  'hoodies',
  'sweatshirts',
  'trousers',
  'jeans',
  'shoes',
  'accessories'
];

const availableSizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '39', '40', '41', '42', '43', '44', 'One Size'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form State
  const [formData, setFormData] = useState({
    sku: '',
    nameUz: '',
    nameEn: '',
    nameRu: '',
    descUz: '',
    descEn: '',
    descRu: '',
    category: 'coats',
    gender: 'unisex',
    price: 0,
    discountPrice: 0,
    stock: 10,
    images: '',
    sizes: ['M', 'L'],
    colors: [{ name: 'Black', hex: '#111111' }],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products?limit=50';
      if (categoryFilter !== 'all') url += `&category=${categoryFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: `MAVI-${Date.now().toString().slice(-6)}`,
      nameUz: '',
      nameEn: '',
      nameRu: '',
      descUz: '',
      descEn: '',
      descRu: '',
      category: 'coats',
      gender: 'unisex',
      price: 500000,
      discountPrice: 0,
      stock: 15,
      images: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=85',
      sizes: ['S', 'M', 'L'],
      colors: [{ name: 'Black', hex: '#111111' }, { name: 'Camel', hex: '#B8A58A' }],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      sku: prod.sku,
      nameUz: prod.name?.uz || '',
      nameEn: prod.name?.en || '',
      nameRu: prod.name?.ru || '',
      descUz: prod.description?.uz || '',
      descEn: prod.description?.en || '',
      descRu: prod.description?.ru || '',
      category: prod.category || 'coats',
      gender: prod.gender || 'unisex',
      price: prod.price || 0,
      discountPrice: prod.discountPrice || 0,
      stock: prod.stock || 0,
      images: prod.images?.join('\n') || '',
      sizes: prod.sizes || [],
      colors: prod.colors || [{ name: 'Black', hex: '#111111' }],
      isFeatured: prod.isFeatured || false,
      isNewArrival: prod.isNewArrival || false,
      isBestSeller: prod.isBestSeller || false
    });
    setIsModalOpen(true);
  };

  const handleSizeToggle = (sz) => {
    if (formData.sizes.includes(sz)) {
      setFormData({ ...formData, sizes: formData.sizes.filter((s) => s !== sz) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, sz] });
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const imagesArray = formData.images
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload = {
      sku: formData.sku.toUpperCase(),
      name: {
        uz: formData.nameUz,
        en: formData.nameEn || formData.nameUz,
        ru: formData.nameRu || formData.nameUz
      },
      description: {
        uz: formData.descUz,
        en: formData.descEn || formData.descUz,
        ru: formData.descRu || formData.descUz
      },
      category: formData.category,
      gender: formData.gender,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
      stock: Number(formData.stock),
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=85'],
      sizes: formData.sizes,
      colors: formData.colors,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Mahsulot muvaffaqiyatli yangilandi');
      } else {
        await api.post('/products', payload);
        toast.success('Yangi mahsulot qo‘shildi');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Haqiqatdan ham ushbu mahsulotni o‘chirmoqchimisiz?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Mahsulot o‘chirildi');
        fetchProducts();
      } catch (err) {
        toast.error('O‘chirishda xatolik yuz berdi');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-mavi-primary">
            Mahsulotlar Katalogi
          </h1>
          <p className="text-xs text-mavi-muted mt-0.5">
            Do‘kondagi barcha kiyimlar, narxlar va ombor qoldiqlarini boshqarish
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded flex items-center justify-center gap-2 hover:bg-mavi-accent transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Mahsulot Qo‘shish</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-sm border border-mavi-border shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-mavi-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nomi yoki SKU bo‘yicha qidiring..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-mavi-border rounded focus:outline-none focus:border-mavi-primary"
          />
        </form>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-mavi-border rounded bg-white text-mavi-text focus:outline-none cursor-pointer"
        >
          <option value="all">Barcha Kategoriyalar</option>
          {availableCategories.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm border border-mavi-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-mavi-secondary text-mavi-primary uppercase tracking-wider font-semibold border-b border-mavi-border">
                <th className="p-3">Rasm</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Nomi (UZ / EN)</th>
                <th className="p-3">Kategoriya</th>
                <th className="p-3">Narxi</th>
                <th className="p-3">Qoldiq</th>
                <th className="p-3">Belgilar</th>
                <th className="p-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mavi-border">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-mavi-muted animate-pulse">
                    Mahsulotlar yuklanmoqda...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-mavi-secondary/40 transition-colors">
                    <td className="p-3">
                      <img
                        src={prod.images?.[0]}
                        alt=""
                        className="w-10 h-12 object-cover rounded bg-mavi-secondary"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-mavi-primary">{prod.sku}</td>
                    <td className="p-3">
                      <div className="font-semibold text-mavi-primary line-clamp-1">{prod.name.uz}</div>
                      <div className="text-[10px] text-mavi-muted line-clamp-1">{prod.name.en}</div>
                    </td>
                    <td className="p-3 uppercase text-mavi-muted font-medium">{prod.category}</td>
                    <td className="p-3 font-bold text-mavi-primary">
                      {prod.price.toLocaleString()} UZS
                      {prod.discountPrice > 0 && (
                        <span className="block text-[10px] text-red-600 line-through">
                          {prod.discountPrice.toLocaleString()} UZS
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          prod.stock > 5 ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {prod.stock} dona
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {prod.isNewArrival && (
                          <span className="px-1.5 py-0.5 bg-black text-white text-[9px] rounded font-semibold">
                            NEW
                          </span>
                        )}
                        {prod.isBestSeller && (
                          <span className="px-1.5 py-0.5 bg-amber-600 text-white text-[9px] rounded font-semibold">
                            HOT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-mavi-muted">
                    Mahsulotlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white rounded-md shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-mavi-border">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mavi-primary">
                {editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot Qo‘shish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-mavi-muted hover:text-mavi-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-5">
              {/* SKU & Category & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    Artikul (SKU) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-mavi-border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-mavi-border rounded bg-white"
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>
                        {c.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    Jins / Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-mavi-border rounded bg-white"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Erkaklar (Men)</option>
                    <option value="women">Ayollar (Women)</option>
                  </select>
                </div>
              </div>

              {/* Multilingual Names */}
              <div className="space-y-3 p-4 bg-mavi-secondary/40 rounded border border-mavi-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-mavi-primary block">
                  Mahsulot Nomi (3 tilda)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-mavi-muted font-bold block mb-1">O‘zbekcha (UZ) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nameUz}
                      onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                      placeholder="Kashmir Palto"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-mavi-muted font-bold block mb-1">English (EN)</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="Cashmere Coat"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-mavi-muted font-bold block mb-1">Русский (RU)</label>
                    <input
                      type="text"
                      value={formData.nameRu}
                      onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                      placeholder="Кашемировое пальто"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Multilingual Descriptions */}
              <div className="space-y-3 p-4 bg-mavi-secondary/40 rounded border border-mavi-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-mavi-primary block">
                  Tavsif (3 tilda)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-mavi-muted font-bold block mb-1">O‘zbekcha (UZ) *</label>
                    <textarea
                      rows="2"
                      required
                      value={formData.descUz}
                      onChange={(e) => setFormData({ ...formData, descUz: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-mavi-muted font-bold block mb-1">English (EN)</label>
                    <textarea
                      rows="2"
                      value={formData.descEn}
                      onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] text-mavi-muted font-bold block mb-1">Русский (RU)</label>
                    <textarea
                      rows="2"
                      value={formData.descRu}
                      onChange={(e) => setFormData({ ...formData, descRu: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-mavi-border rounded"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Price, Discount & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    Narxi (UZS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-mavi-border rounded font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    Chegirmali Narx (UZS)
                  </label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-mavi-border rounded"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                    Ombordagi Soni (Stock) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-mavi-border rounded font-semibold"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1.5">
                  Mavjud O‘lchamlar
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizesList.map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => handleSizeToggle(sz)}
                      className={`px-3 py-1 text-xs border rounded transition-colors ${
                        formData.sizes.includes(sz)
                          ? 'bg-mavi-primary text-white border-mavi-primary'
                          : 'border-mavi-border text-mavi-text'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URLs */}
              <div>
                <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                  Rasm havolalari (har bir qatorda bittadan URL)
                </label>
                <textarea
                  rows="3"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-xs border border-mavi-border rounded font-mono"
                ></textarea>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="checkbox checkbox-xs"
                  />
                  <span>Yangi to‘plam (New Arrival)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="checkbox checkbox-xs"
                  />
                  <span>Eng ko‘p sotilgan (Best Seller)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="checkbox checkbox-xs"
                  />
                  <span>Asosiy sahifada ko‘rsatish (Featured)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-mavi-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-mavi-muted hover:text-mavi-primary border border-mavi-border rounded"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-mavi-accent transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
