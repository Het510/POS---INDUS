import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { Search, Leaf, Star, X } from 'lucide-react';
import { PRODUCTS_DATA, CATEGORIES } from '../data/productsData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellersOnly, setBestsellersOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) setActiveCategory(catParam);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const filtered = PRODUCTS_DATA.filter(p => {
      if (activeCategory !== 'all') {
        if (p.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }
      if (vegOnly && !p.isVeg) return false;
      if (bestsellersOnly && !p.isBestseller) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    
    setTimeout(() => {
      setProducts(filtered);
      setLoading(false);
    }, 300);
  }, [activeCategory, search, vegOnly, bestsellersOnly]);

  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo('.product-card', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [loading, products]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add items to your cart! 🔐');
      navigate('/login');
      return;
    }
    addItem(product);
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-bk-dark' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gradient-to-b from-bk-dark-2 to-bk-dark' : 'bg-gradient-to-b from-white to-slate-50'} pt-6 pb-8 px-4 border-b ${isDark ? 'border-bk-brown-light/20' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`font-heading text-4xl font-black mb-1 ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>
            OUR MENU
          </h1>
          <p className={`font-body text-sm ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
            Fresh, flame-grilled, made your way
          </p>

          {/* Search bar */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-bk-cream/40' : 'text-gray-400'}`} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search menu..."
                className={`w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-bk-brown/20 border border-bk-brown-light/30 text-bk-cream placeholder-bk-cream/30 focus:border-bk-gold/40'
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-bk-red focus:ring-1 focus:ring-bk-red'
                }`}
              />
            </div>
            {/* Filters */}
            <button onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-heading transition-all ${
                vegOnly 
                  ? isDark ? 'bg-green-900/40 border-green-500 text-green-400' : 'bg-green-100 border-green-500 text-green-700'
                  : isDark ? 'border-bk-brown-light/30 text-bk-cream/60 hover:border-bk-gold/30' : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}>
              <Leaf size={14} /> Veg
            </button>
            <button onClick={() => setBestsellersOnly(!bestsellersOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-heading transition-all ${
                bestsellersOnly 
                  ? isDark ? 'bg-yellow-900/40 border-bk-yellow text-bk-yellow' : 'bg-yellow-100 border-bk-red text-bk-red'
                  : isDark ? 'border-bk-brown-light/30 text-bk-cream/60 hover:border-bk-gold/30' : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}>
              <Star size={14} /> Best
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className={`sticky top-16 z-30 backdrop-blur px-4 py-3 border-b ${
        isDark ? 'bg-bk-dark/95 border-bk-gold/10' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-4 py-2.5 rounded-full whitespace-nowrap transition-all font-heading text-sm font-bold ${
                  activeCategory === cat._id
                    ? isDark ? 'bg-bk-yellow text-bk-dark' : 'bg-bk-red text-white'
                    : isDark ? 'bg-bk-dark-2 border border-bk-brown-light/30 text-bk-cream/70 hover:border-bk-gold/30' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
                <span className="mr-2">{cat.icon}</span>{cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-64 rounded-xl ${isDark ? 'bg-bk-dark-2' : 'bg-gray-200'} shimmer`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className={`font-heading text-xl ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
              No items found
            </p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product._id}
                className={`product-card group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isDark ? 'bg-bk-dark-2 border border-bk-brown-light/20 hover:border-bk-gold/40' : 'bg-white border border-gray-200 hover:border-bk-red'
                }`}
                onClick={() => setSelectedProduct(product)}>
                {/* Image area */}
                <div className={`relative h-40 overflow-hidden flex items-center justify-center ${
                  isDark ? 'bg-gradient-to-br from-bk-brown/30 to-bk-dark' : 'bg-gradient-to-br from-gray-100 to-gray-50'
                }`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=' + product.name.replace(/\s+/g, '+');
                    }}
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isVeg && (
                      <div className={`w-5 h-5 border-2 border-green-500 rounded-sm flex items-center justify-center ${isDark ? 'bg-bk-dark/80' : 'bg-white/80'}`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    )}
                  </div>
                  {product.isBestseller && (
                    <div className="absolute top-2 right-2 bg-bk-red text-white text-[9px] font-heading px-1.5 py-0.5 rounded font-bold">
                      ★ BEST
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className={`text-[10px] font-heading uppercase tracking-wider mb-1 ${isDark ? 'text-bk-gold/60' : 'text-bk-red/60'}`}>
                    {product.category}
                  </div>
                  <h3 className={`font-heading text-sm font-bold group-hover:${isDark ? 'text-bk-yellow' : 'text-bk-red'} transition-colors line-clamp-1 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                    {product.name}
                  </h3>
                  <p className={`font-body text-xs mt-1 line-clamp-2 ${isDark ? 'text-bk-cream/40' : 'text-gray-600'}`}>
                    {product.description}
                  </p>
                  {product.rating && (
                    <p className={`font-body text-[10px] mt-1 ${isDark ? 'text-bk-cream/30' : 'text-gray-500'}`}>
                      ⭐ {product.rating}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className={`font-heading text-lg font-black ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>
                      ₹{product.basePrice}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 active:scale-95 transition-transform ${
                        isDark ? 'bg-gold-gradient text-bk-dark shadow-gold' : 'bg-bk-red text-white hover:bg-red-600'
                      }`}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isDark={isDark}
          onClose={() => setSelectedProduct(null)}
          onAdd={(p, qty, variant) => { 
            if (!user) {
              toast.error('Please sign in to add items! 🔐');
              navigate('/login');
              return;
            }
            addItem(p, qty, variant); 
            setSelectedProduct(null); 
          }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, isDark, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.name || null);
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(modalRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
  }, []);

  const price = selectedVariant
    ? product.variants?.find(v => v.name === selectedVariant)?.price || product.basePrice
    : product.basePrice;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div ref={modalRef} className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border ${
        isDark ? 'bg-bk-dark-2 border-bk-gold/20' : 'bg-white border-gray-200'
      }`}>
        {/* Product Image */}
        <div className={`relative h-48 flex items-center justify-center overflow-hidden ${
          isDark ? 'bg-gradient-to-br from-bk-brown/40 to-bk-dark' : 'bg-gradient-to-br from-gray-100 to-gray-50'
        }`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=' + product.name.replace(/\s+/g, '+');
            }}
          />
          <button onClick={onClose}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
              isDark ? 'bg-bk-dark/80 text-bk-cream hover:text-bk-yellow' : 'bg-white/80 text-gray-900 hover:text-bk-red'
            }`}>
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className={`font-heading text-2xl font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                {product.name}
              </h2>
              <p className={`font-body text-sm mt-1 ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
                {product.description}
              </p>
            </div>
            <span className={`font-heading text-2xl font-black ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>
              ₹{Math.round(price * qty)}
            </span>
          </div>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div className="mt-4">
              <p className={`font-heading text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
                Size
              </p>
              <div className="flex gap-2">
                {product.variants.map(v => (
                  <button key={v.name}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-4 py-2 rounded-xl text-sm font-heading border transition-all ${
                      selectedVariant === v.name
                        ? isDark ? 'bg-gold-gradient text-bk-dark border-transparent' : 'bg-bk-red text-white border-bk-red'
                        : isDark ? 'border-bk-brown-light/30 text-bk-cream/60 hover:border-bk-gold/30' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}>
                    {v.name} – ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className={`w-9 h-9 rounded-full font-bold text-xl flex items-center justify-center hover:scale-110 transition-transform ${
                  isDark ? 'border border-bk-gold/30 text-bk-gold hover:bg-bk-gold/10' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}>
                −
              </button>
              <span className={`font-heading text-xl font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                {qty}
              </span>
              <button onClick={() => setQty(qty + 1)}
                className={`w-9 h-9 rounded-full font-bold text-xl flex items-center justify-center hover:scale-110 transition-transform ${
                  isDark ? 'bg-gold-gradient text-bk-dark shadow-gold' : 'bg-bk-red text-white hover:bg-red-600'
                }`}>
                +
              </button>
            </div>
            <button
              onClick={() => onAdd(product, qty, selectedVariant)}
              className={`px-6 py-3 text-sm font-heading font-bold rounded-lg transition-all ${
                isDark ? 'bg-gold-gradient text-bk-dark hover:shadow-gold' : 'bg-bk-red text-white hover:bg-red-600'
              }`}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
