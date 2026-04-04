import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { offersAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, orderType, setOrderType } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }, []);

  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = orderType === 'delivery' ? 49 : 0;
  const total = subtotal + tax + deliveryFee - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await offersAPI.validate({ code: couponCode, orderTotal: subtotal });
      setAppliedOffer(data.offer);
      setDiscount(data.discount);
      toast.success(`Coupon applied! ₹${data.discount} off 🎉`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedOffer(null);
    setDiscount(0);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to place your order! 🍔');
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { discount, appliedOffer } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bk-dark flex flex-col items-center justify-center px-4">
        <div className="w-48 h-48 rounded-full overflow-hidden mb-6 flex items-center justify-center bg-bk-dark-2 border-2 border-bk-gold/20">
          <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=400&fit=crop" alt="Empty Cart" className="w-full h-full object-cover opacity-60" />
        </div>
        <h2 className="font-heading text-3xl text-bk-yellow mb-3 uppercase tracking-wider">Your cart is empty</h2>
        <p className="font-body text-bk-cream/50 mb-8">Add some flame-grilled goodness!</p>
        <Link to="/menu" className="btn-gold px-8 py-3">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-bk-dark pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full border border-bk-gold/20 text-bk-cream/60 hover:text-bk-yellow hover:border-bk-gold/40 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-heading text-3xl font-black text-bk-yellow">YOUR CART</h1>
            <p className="font-body text-xs text-bk-cream/50">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Order Type */}
        <div className="bg-bk-dark-2 border border-bk-gold/10 rounded-2xl p-4 mb-6">
          <p className="font-heading text-xs text-bk-cream/50 uppercase tracking-wider mb-3">Order Type</p>
          <div className="flex gap-3">
            {[
              { value: 'dine-in', label: '🍽️ Dine In' },
              { value: 'takeaway', label: '🥡 Takeaway' },
              { value: 'delivery', label: '🛵 Delivery' },
            ].map(opt => (
              <button key={opt.value}
                onClick={() => setOrderType(opt.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-heading transition-all ${
                  orderType === opt.value
                    ? 'bg-gold-gradient text-bk-dark font-bold shadow-gold'
                    : 'border border-bk-brown-light/20 text-bk-cream/60 hover:border-bk-gold/20'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.key}
                className="bg-bk-dark-2 border border-bk-brown-light/20 rounded-2xl p-4 flex gap-4 hover:border-bk-gold/20 transition-all">
                <div className="w-16 h-16 bg-bk-brown/20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-bold text-bk-cream">{item.name}</h3>
                  {item.variant && <p className="text-xs text-bk-cream/50 font-body">{item.variant}</p>}
                  {item.customizations?.length > 0 && (
                    <p className="text-xs text-bk-gold/60 font-body">{item.customizations.join(', ')}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-heading text-base font-bold text-bk-yellow">₹{item.price * item.quantity}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-bk-gold/20 flex items-center justify-center text-bk-cream/60 hover:border-bk-gold/50 hover:text-bk-gold transition-all">
                        <Minus size={12} />
                      </button>
                      <span className="font-heading text-sm w-6 text-center text-bk-cream">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-bk-dark hover:scale-105 transition-transform">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(item.key)}
                        className="w-7 h-7 rounded-full text-red-400/60 hover:text-red-400 hover:bg-red-900/20 flex items-center justify-center ml-1 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-bk-dark-2 border border-bk-gold/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-bk-gold" />
                <span className="font-heading text-sm text-bk-cream/80 uppercase tracking-wide">Coupon Code</span>
              </div>
              {appliedOffer ? (
                <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded-xl px-3 py-2">
                  <div>
                    <span className="font-heading text-sm text-green-400 font-bold">{appliedOffer.code}</span>
                    <p className="font-body text-xs text-green-400/60">–₹{discount} saved</p>
                  </div>
                  <button onClick={removeCoupon} className="text-red-400 text-xs hover:text-red-300">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 bg-bk-brown/20 border border-bk-brown-light/20 rounded-xl px-3 py-2 text-sm text-bk-cream placeholder-bk-cream/30 focus:outline-none focus:border-bk-gold/30 font-heading tracking-wider"
                  />
                  <button onClick={applyCoupon} disabled={couponLoading}
                    className="px-3 py-2 bg-gold-gradient rounded-xl text-bk-dark text-xs font-heading font-bold hover:scale-105 transition-transform disabled:opacity-60">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-bk-dark-2 border border-bk-gold/10 rounded-2xl p-5">
              <h3 className="font-heading text-sm uppercase tracking-wider text-bk-cream/60 mb-4">Order Summary</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between font-body text-sm text-bk-cream/70">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-bk-cream/70">
                  <span>Tax (5%)</span><span>₹{tax}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between font-body text-sm text-bk-cream/70">
                    <span>Delivery Fee</span><span>₹{deliveryFee}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between font-body text-sm text-green-400">
                    <span>Discount</span><span>–₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-bk-gold/10 pt-3 flex justify-between">
                  <span className="font-heading font-bold text-bk-cream">Total</span>
                  <span className="font-heading text-xl font-black text-bk-yellow">₹{total}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full btn-gold mt-5 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>

            <Link to="/menu" className="block text-center font-heading text-xs text-bk-gold/60 hover:text-bk-gold transition-colors uppercase tracking-wider">
              + Add More Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
