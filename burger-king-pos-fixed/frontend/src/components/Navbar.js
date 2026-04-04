import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ShoppingCart, User, Search, Menu, X, Crown, ChevronDown, Sun, Moon, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const BKLogo = () => (
  <div className="flex items-center gap-2">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold">
        <span className="text-bk-dark font-heading font-black text-lg">BK</span>
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-bk-red rounded-full flex items-center justify-center">
        <Crown size={8} className="text-bk-yellow" />
      </div>
    </div>
    <div className="hidden sm:block">
      <div className="font-heading font-black text-xl text-bk-yellow leading-none tracking-wider">BK CROWN</div>
      <div className="font-body text-[9px] text-bk-gold/80 tracking-widest uppercase">Flame Grilled Perfection</div>
    </div>
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'Offers', href: '/offers' },
    { label: 'Dine In', href: '/dine-in' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-bk-dark/95 backdrop-blur-md border-b border-bk-gold/20 shadow-dark'
            : 'bg-bk-dark/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <BKLogo />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link relative group ${location.pathname === link.href ? 'text-bk-yellow' : ''}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-bk-gold transition-all duration-300 ${
                    location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="theme-toggle p-2 rounded-full border border-bk-gold/30 hover:border-bk-gold/60
                           text-bk-cream/70 hover:text-bk-yellow transition-all duration-300
                           hover:bg-bk-gold/10"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-bk-cream/70 hover:text-bk-yellow transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-bk-cream/70 hover:text-bk-yellow transition-colors">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-bk-red text-white text-xs font-bold rounded-full flex items-center justify-center badge-pulse">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Login */}
              {user ? (
                <div className="flex items-center gap-3">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-bk-red/30 hover:border-bk-red bg-bk-red/5 transition-all">
                      <div className="w-6 h-6 bg-bk-red rounded-full flex items-center justify-center shadow-lg">
                        <Tag size={12} className="text-white" />
                      </div>
                      <p className="text-[10px] text-bk-red font-black tracking-widest">ADMIN PANEL</p>
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-bk-gold/30 hover:border-bk-gold bg-bk-gold/5 transition-all group">
                    <div className="w-7 h-7 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                      <User size={14} className="text-bk-dark" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-bk-gold font-bold leading-none">MY PROFILE</p>
                      <p className="text-[12px] text-bk-cream font-heading mt-0.5">{user.name.split(' ')[0]}</p>
                    </div>
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="btn-gold text-sm px-5 py-2 uppercase tracking-widest font-black">
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-bk-cream/70 hover:text-bk-yellow transition-colors"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-bk-gold/20 bg-bk-dark/95 px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search burgers, meals, drinks..."
                className="flex-1 bg-bk-brown/30 border border-bk-gold/20 rounded-full px-4 py-2 text-bk-cream placeholder-bk-cream/40 text-sm focus:outline-none focus:border-bk-gold/50"
              />
              <button type="submit" className="btn-gold text-sm px-5 py-2">Search</button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-bk-gold/20 bg-bk-dark/98 px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                className="block py-2 font-heading text-bk-cream/80 hover:text-bk-yellow transition-colors uppercase tracking-wider text-sm border-b border-bk-brown/30">
                {link.label}
              </Link>
            ))}
            {/* Theme toggle in mobile menu */}
            <button
              onClick={() => { toggleTheme(); setMobileOpen(false); }}
              className="flex items-center gap-3 py-2 font-heading text-bk-cream/80 hover:text-bk-yellow transition-colors uppercase tracking-wider text-sm w-full"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
