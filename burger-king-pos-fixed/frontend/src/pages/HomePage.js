import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, Flame, Star, Crown, Clock, Truck, UtensilsCrossed, Utensils, ShoppingCart } from 'lucide-react';
import { productsAPI, categoriesAPI, offersAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const HERO_ITEMS = [
  { 
    name: 'Whopper Supreme', 
    desc: 'Flame-grilled perfection with fresh veggies', 
    price: 249, 
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', 
    tag: 'BESTSELLER' 
  },
  { 
    name: 'Crispy Chicken', 
    desc: 'Golden crispy with signature BK sauce', 
    price: 199, 
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=400&fit=crop', 
    tag: 'NEW' 
  },
  { 
    name: 'Spicy Paneer', 
    desc: 'Spicy paneer with jalapeño mayo', 
    price: 179, 
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=400&fit=crop', 
    tag: 'VEG' 
  },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const heroImgRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
      .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(heroImgRef.current, { scale: 0.8, opacity: 0, rotation: -5 }, { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.8');

    // Parallax
    gsap.to('.hero-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true }
    });

    // Animate sections on scroll
    gsap.utils.toArray('.animate-section').forEach(el => {
      gsap.fromTo(el, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % HERO_ITEMS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    productsAPI.getAll({ isBestseller: true }).then(r => setProducts(r.data.products.slice(0, 8))).catch(() => {});
    categoriesAPI.getAll().then(r => setCategories(r.data.categories)).catch(() => {});
    offersAPI.getAll().then(r => setOffers(r.data.offers.slice(0, 3))).catch(() => {});
  }, []);

  const item = HERO_ITEMS[heroIdx];

  return (
    <div className="min-h-screen bg-bk-dark">

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="hero-bg absolute inset-0 z-0">
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #C8962A 0%, transparent 60%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bk-dark to-transparent" />
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div key={i}
            className="absolute w-1 h-1 bg-bk-gold rounded-full opacity-40 animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bk-gold/10 border border-bk-gold/30 rounded-full mb-6">
                <Flame size={14} className="text-bk-orange flame" />
                <span className="font-heading text-xs tracking-widest text-bk-gold uppercase">Flame Grilled Since 1954</span>
              </div>

              <div ref={titleRef}>
                <h1 className="font-heading text-5xl md:text-7xl font-black leading-none mb-2 text-bk-cream">
                  HAVE IT
                </h1>
                <h1 className="font-heading text-5xl md:text-7xl font-black leading-none mb-6 gold-text">
                  YOUR WAY
                </h1>
              </div>

              <p ref={subtitleRef} className="font-body text-lg text-bk-cream/70 mb-8 max-w-md leading-relaxed">
                Premium flame-grilled burgers made fresh for every order.
                Customize your meal exactly the way you like it.
              </p>

              <div ref={ctaRef} className="flex flex-wrap gap-4">
                <Link to="/menu" className="btn-gold text-base px-8 py-3.5 inline-flex items-center gap-2">
                  Order Now <ChevronRight size={18} />
                </Link>
                <Link to="/dine-in" className="btn-outline-gold text-base px-8 py-3.5 inline-flex items-center gap-2">
                  <UtensilsCrossed size={18} /> Dine In
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10">
                {[
                  { value: '50+', label: 'Menu Items' },
                  { value: '4.8★', label: 'Rating' },
                  { value: '20min', label: 'Avg Delivery' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-heading text-2xl font-bold text-bk-yellow">{s.value}</div>
                    <div className="font-body text-xs text-bk-cream/50 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div ref={heroImgRef} className="flex justify-center">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 scale-75 blur-3xl bg-bk-orange/30 rounded-full" />
                {/* Image display */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-bk-gold/20 overflow-hidden animate-float drop-shadow-2xl select-none transition-all duration-700 p-4 bg-bk-dark-2">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                {/* Item card */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 bg-bk-dark-2/90 backdrop-blur border border-bk-gold/20 rounded-2xl p-4 shadow-gold">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-heading text-bk-red bg-bk-red/10 px-2 py-0.5 rounded-full">{item.tag}</span>
                      <h3 className="font-heading text-base font-bold text-bk-cream mt-1">{item.name}</h3>
                      <p className="font-body text-xs text-bk-cream/50 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="font-heading text-xl font-black text-bk-yellow">₹{item.price}</span>
                  </div>
                  <div className="flex gap-1 mt-3">
                    {HERO_ITEMS.map((_, i) => (
                      <div key={i} onClick={() => setHeroIdx(i)}
                        className={`h-1 rounded-full flex-1 cursor-pointer transition-all ${i === heroIdx ? 'bg-bk-gold' : 'bg-bk-gold/20'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER TYPE SECTION */}
      <section className="animate-section py-12 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <UtensilsCrossed size={28} />, label: 'Dine In', desc: 'Table ordering', link: '/dine-in', color: 'from-amber-900/40 to-amber-800/20' },
            { icon: <Truck size={28} />, label: 'Delivery', desc: 'Door delivery', link: '/menu', color: 'from-red-900/40 to-red-800/20' },
            { icon: <Clock size={28} />, label: 'Takeaway', desc: 'Ready fast', link: '/menu', color: 'from-yellow-900/40 to-yellow-800/20' },
          ].map(opt => (
            <Link key={opt.label} to={opt.link}
              className={`card-dark bg-gradient-to-br ${opt.color} p-6 text-center hover:scale-105 transition-all duration-300`}>
              <div className="text-bk-gold mb-3 flex justify-center">{opt.icon}</div>
              <div className="font-heading text-lg font-bold text-bk-cream">{opt.label}</div>
              <div className="font-body text-xs text-bk-cream/50 mt-1">{opt.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="animate-section py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-8">EXPLORE MENU</h2>
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide justify-center flex-wrap px-4">
            {(categories.length > 0 ? categories : [
              { _id: '1', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=400&auto=format&fit=crop', slug: 'burgers' },
              { _id: '2', name: 'Chicken', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&h=400&auto=format&fit=crop', slug: 'chicken' },
              { _id: '3', name: 'Beverages', image: 'https://images.unsplash.com/photo-1543250606-2c18af2b6833?q=80&w=400&h=400&auto=format&fit=crop', slug: 'beverages' },
              { _id: '4', name: 'Sides', image: 'https://images.unsplash.com/photo-1630384066242-17a178021547?q=80&w=400&h=400&auto=format&fit=crop', slug: 'sides' },
              { _id: '5', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&h=400&auto=format&fit=crop', slug: 'desserts' },
              { _id: '6', name: 'Meals', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?q=80&w=400&h=400&auto=format&fit=crop', slug: 'meals' },
            ]).map(cat => (
              <Link key={cat._id} to={`/menu?category=${cat._id || cat.slug}`}
                className="flex-shrink-0 group flex flex-col items-center gap-5 p-6 w-44 rounded-[3rem] bg-gradient-to-b from-bk-dark-2 to-bk-dark border border-bk-gold/20 hover:border-bk-gold hover:shadow-gold transition-all duration-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-bk-gold/30 overflow-hidden group-hover:scale-110 group-hover:border-bk-gold transition-all duration-700 shadow-2xl relative z-10">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-700 brightness-110"
                    loading="lazy"
                  />
                </div>
                <div className="text-center relative z-10">
                  <span className="font-heading text-sm text-bk-cream group-hover:text-bk-yellow uppercase tracking-[0.2em] font-black transition-colors">{cat.name}</span>
                  <div className="h-1 w-0 group-hover:w-full bg-bk-gold mx-auto mt-2 transition-all duration-500 rounded-full" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="animate-section py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">BESTSELLERS</h2>
              <p className="font-body text-bk-cream/50 text-sm mt-1">Our most loved items</p>
            </div>
            <Link to="/menu" className="btn-outline-gold text-sm px-5 py-2 inline-flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(products.length > 0 ? products : MOCK_PRODUCTS).map((prod, i) => (
              <ProductCard 
                key={prod._id || i} 
                product={prod} 
                onAdd={() => {
                  if (!user) {
                    toast.error('Please sign in to order! 👑');
                    navigate('/login');
                    return;
                  }
                  addItem(prod);
                }} 
                delay={i * 0.1} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS BANNER */}
      {offers.length > 0 && (
        <section className="animate-section py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title text-center mb-8">TODAY'S OFFERS</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {offers.map(offer => (
                <div key={offer._id} className="card-dark bg-gradient-to-br from-bk-red/20 to-bk-brown/30 p-6 relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-bk-red text-white text-xs font-heading px-2 py-1 rounded-full">
                    {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-bk-yellow mb-2">{offer.title}</h3>
                  <p className="font-body text-sm text-bk-cream/60 mb-4">{offer.description}</p>
                  {offer.code && (
                    <div className="inline-flex items-center gap-2 bg-bk-dark border border-bk-gold/30 rounded-lg px-3 py-1.5">
                      <span className="font-heading text-bk-gold text-sm font-bold tracking-widest">{offer.code}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CROWN LOYALTY */}
      <section className="animate-section py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-dark bg-gradient-to-br from-bk-brown to-bk-dark-2 p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C8962A 0%, transparent 70%)' }} />
            <Crown size={48} className="text-bk-gold mx-auto mb-4" />
            <h2 className="font-heading text-4xl font-black text-bk-yellow mb-3">CROWN REWARDS</h2>
            <p className="font-body text-bk-cream/70 mb-6 max-w-lg mx-auto">
              Earn Crown Points on every order. Redeem them for free food, exclusive deals and more.
            </p>
            <Link to="/signup" className="btn-gold text-base px-8 py-3">Join & Earn Free 🍔</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onAdd, delay = 0 }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay, ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 90%' }
      }
    );
  }, [delay]);

  return (
    <div ref={cardRef} className="card-dark group cursor-pointer overflow-hidden border border-bk-gold/10 hover:border-bk-gold/30 hover:shadow-gold-sm transition-all duration-500">
      <div className="relative bg-gradient-to-br from-bk-brown/40 to-bk-dark-2 h-44 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image || 'https://via.placeholder.com/400?text=' + product.name} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bk-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.isVeg && (
          <div className="absolute top-3 left-3 w-5 h-5 border-2 border-green-500 rounded-sm flex items-center justify-center bg-white/90 shadow-md">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        )}
        {product.isBestseller && (
          <div className="absolute top-3 right-3 bg-bk-yellow text-bk-dark text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg tracking-tighter">
            Bestseller
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading text-base font-bold text-bk-cream group-hover:text-bk-yellow transition-colors line-clamp-1">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="font-heading text-lg font-black text-bk-yellow">₹{product.basePrice || product.price}</span>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(product); }}
            className="w-10 h-10 rounded-xl bg-gold-gradient text-bk-dark flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-gold"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const MOCK_PRODUCTS = [
  { _id: 'm1', name: 'Whopper Supreme', description: 'Classic flame-grilled beef burger', basePrice: 249, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', isBestseller: true },
  { _id: 'm2', name: 'Crispy Chicken', description: 'Golden fried chicken burger', basePrice: 199, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=400&fit=crop', isVeg: false },
  { _id: 'm3', name: 'Spicy Paneer', description: 'Spicy paneer patty with jalapeño', basePrice: 179, image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=400&fit=crop', isVeg: true },
  { _id: 'm4', name: 'BK Hi-Fries', description: 'Crispy seasoned fries', basePrice: 99, image: 'https://images.unsplash.com/photo-1630384066242-17a178021547?w=600&h=400&fit=crop', isVeg: true },
  { _id: 'm5', name: 'Choco Shake', description: 'Thick creamy chocolate milkshake', basePrice: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop', isVeg: true },
  { _id: 'm6', name: 'Meal Deal', description: 'Burger + Fries + Drink', basePrice: 299, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=600&h=400&fit=crop', isBestseller: true },
  { _id: 'm7', name: 'Onion Rings', description: 'Crispy golden onion rings', basePrice: 89, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop', isVeg: true },
  { _id: 'm8', name: 'Sundae', description: 'Soft serve with chocolate sauce', basePrice: 79, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop', isVeg: true },
];
