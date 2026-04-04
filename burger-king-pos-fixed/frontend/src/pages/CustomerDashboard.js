import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { LogOut, Package, User, Settings, ChevronRight, Crown, Tag, Trash2, ShieldCheck, Mail, Phone, Calendar, Star, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, offersAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, offersRes] = await Promise.all([
        ordersAPI.getMyOrders(),
        offersAPI.getAll()
      ]);
      setOrders(ordersRes?.data?.orders || []);
      setOffers(offersRes?.data?.offers?.filter(o => o.isActive) || []);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        toast.error('Session expired or connection failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await ordersAPI.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchData();
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getMembershipTier = (points) => {
    if (points >= 1000) return { name: 'CROWN ELITE', color: 'text-bk-gold', bg: 'bg-bk-gold/20', icon: Crown, gradient: 'from-amber-400 via-bk-gold to-yellow-600' };
    if (points >= 500) return { name: 'GOLD MEMBER', color: 'text-yellow-500', bg: 'bg-yellow-500/20', icon: Star, gradient: 'from-yellow-400 to-amber-600' };
    if (points >= 200) return { name: 'SILVER MEMBER', color: 'text-slate-300', bg: 'bg-slate-300/20', icon: ShieldCheck, gradient: 'from-slate-400 to-slate-200' };
    return { name: 'BRONZE MEMBER', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: Flame, gradient: 'from-orange-600 to-orange-400' };
  };

  if (!user) return null;
  const tier = getMembershipTier(user.crownPoints || 0);

  return (
    <div className={isDark ? 'bg-bk-dark' : 'bg-slate-100'}>
      <div ref={containerRef} className="min-h-screen pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-12 xl:col-span-4 space-y-8">
              <div className={`relative h-64 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl transition-all duration-700 bg-gradient-to-br ${tier.gradient} group hover:scale-[1.02]`}>
                <div className="absolute top-0 right-0 p-12 opacity-20 transform translate-x-12 -translate-y-12">
                  <Crown size={240} className="text-white rotate-12" />
                </div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl opacity-30" />
                <div className="relative z-10 h-full flex flex-col justify-between text-bk-dark">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60">BK Crown Pass</p>
                      <h2 className="text-2xl font-black font-heading mt-1">{tier.name}</h2>
                    </div>
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <Crown size={28} />
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black tracking-widest opacity-60 uppercase mb-0.5">Points Balance</p>
                      <p className="text-4xl font-black font-heading tracking-tighter">{user.crownPoints || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black tracking-widest opacity-60 uppercase">Member Since</p>
                      <p className="text-sm font-bold">{new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`rounded-[2.5rem] p-8 border-2 ${isDark ? 'bg-bk-dark-2 border-bk-gold/20' : 'bg-white border-gray-100 shadow-xl'}`}>
                <h3 className={`font-heading text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                  <User size={24} className="text-bk-gold" /> Identity
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-bk-gold/10 text-bk-gold flex items-center justify-center transition-all group-hover:scale-110">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-black tracking-widest ${isDark ? 'text-bk-cream/30' : 'text-gray-400'}`}>Email Address</p>
                      <p className={`font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-bk-gold/10 text-bk-gold flex items-center justify-center transition-all group-hover:scale-110">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-black tracking-widest ${isDark ? 'text-bk-cream/30' : 'text-gray-400'}`}>Mobile Number</p>
                      <p className={`font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>{user.phone || 'Not Shared'}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="w-full mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all ring-2 ring-red-500/20"
                >
                  <LogOut size={18} /> Sign Out of Account
                </button>
              </div>
            </div>
            <div className="lg:col-span-12 xl:col-span-8">
              <div className="flex gap-2 p-2 mb-8 rounded-3xl bg-bk-dark-2/50 backdrop-blur-md border border-bk-gold/10 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'coupons', label: 'My Coupons', icon: Tag },
                  { id: 'settings', label: 'Preferences', icon: Settings },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-[140px] px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${
                        activeTab === tab.id
                          ? 'bg-gold-gradient text-bk-dark shadow-gold shadow-sm'
                          : isDark ? 'text-bk-cream/50 hover:text-bk-cream hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'
                      }`}>
                      <Icon size={16} /> {tab.label}
                    </button>
                  );
                })}
              </div>
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {loading ? (
                    <div className="py-20 text-center animate-pulse">
                      <div className="w-16 h-16 border-4 border-bk-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="font-heading font-black text-bk-gold">Syncing your history...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    orders.map(order => (
                      <div key={order._id} className={`rounded-3xl p-6 border-2 transition-all ${
                        isDark ? 'bg-bk-dark-2 border-bk-gold/5 hover:border-bk-gold/20' : 'bg-white border-gray-50 shadow-lg shadow-black/5'
                      }`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-bk-gold/10">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className={`font-heading text-xl font-black ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>{order.orderNumber}</h4>
                              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                order.status === 'delivered' || order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-bk-gold/20 text-bk-gold'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-bk-gold/60 mt-1 uppercase tracking-widest">
                              {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className={`text-2xl font-black ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>₹{order.total}</p>
                            <button 
                              onClick={() => navigate(`/order-confirm/${order._id}`)}
                              className="p-3 bg-bk-gold rounded-2xl text-bk-dark hover:scale-110 active:scale-95 transition-all shadow-gold"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="col-span-2">
                            <p className="text-[10px] font-black uppercase text-bk-gold/40 tracking-widest mb-2">Order Summary</p>
                            <div className="flex flex-wrap gap-2">
                              {order.items.map((item, i) => (
                                <span key={i} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${isDark ? 'bg-bk-dark text-bk-cream/70' : 'bg-gray-100 text-gray-700'}`}>
                                  {item.quantity}× {item.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {['pending', 'confirmed'].includes(order.status) && (
                          <div className="mt-4 pt-4 border-t border-bk-gold/5 flex items-center justify-between">
                            {order.paymentMethod === 'cash' ? (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={cancellingId === order._id}
                                className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                              >
                                {cancellingId === order._id ? 'Cancelling...' : 'Request Cancellation'}
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[9px] text-bk-cream/30 italic uppercase tracking-tighter">
                                <span>Online payment cannot be cancelled</span>
                              </div>
                            )}
                            <p className="text-[10px] text-bk-cream/30 font-body">Contact support for help</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center rounded-[3rem] border-4 border-dashed border-bk-gold/10">
                      <div className="w-20 h-20 bg-bk-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={32} className="text-bk-gold" />
                      </div>
                      <h4 className={`text-xl font-heading font-black mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-800'}`}>No Orders on Record</h4>
                      <p className="text-xs text-bk-gold/50 mb-8 max-w-xs mx-auto uppercase tracking-wider font-bold">Your flame-grilled history is awaiting its first entry.</p>
                      <button onClick={() => navigate('/menu')} className="btn-gold px-10 py-4 font-black">Go To Menu</button>
                    </div>
                  )}
                </div>
              )}

              {/* Coupons Tab */}
              {activeTab === 'coupons' && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {offers.length > 0 ? offers.map(offer => (
                    <div key={offer._id} className="group relative p-6 rounded-[2.5rem] bg-bk-dark-2 border-4 border-bk-gold/10 overflow-hidden hover:border-bk-gold transition-all duration-500">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-bk-red/10 text-bk-red rounded-2xl flex items-center justify-center">
                          <Tag size={24} />
                        </div>
                        <span className="bg-bk-gold text-bk-dark text-[10px] font-black px-3 py-1 rounded-full">{offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}</span>
                      </div>
                      <h4 className="font-heading font-black text-bk-cream mb-1">{offer.title}</h4>
                      <p className="text-[10px] text-bk-cream/40 mb-6 group-hover:text-bk-cream/70 transition-colors uppercase tracking-widest">{offer.code}</p>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(offer.code); toast.success('Coupon copied to clipboard!'); }}
                        className="w-full py-3 rounded-2xl bg-bk-gold/5 text-bk-gold text-[10px] font-black uppercase tracking-[0.2em] border border-bk-gold/20 hover:bg-bk-gold hover:text-bk-dark transition-all"
                      >
                        Copy Promo Code
                      </button>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center italic text-bk-gold/30 uppercase tracking-[0.3em] text-xs">Stay tuned for exclusive offers</div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className={`rounded-[2.5rem] p-10 border-2 ${isDark ? 'bg-bk-dark-2 border-bk-gold/20' : 'bg-white border-gray-50'}`}>
                  <h4 className={`text-2xl font-black font-heading mb-8 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Notification Vault</h4>
                  <div className="space-y-4 max-w-lg">
                    {[
                      { label: 'Real-time Order Alerts', desc: 'Get notified as soon as your Whopper is ready' },
                      { label: 'Promotional Transmissions', desc: 'Exclusive access to flash deals and freebies' },
                      { label: 'Email Receipting', desc: 'Automated tax invoices sent to your inbox' }
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-bk-dark/50 border border-bk-gold/5 group hover:border-bk-gold/20 transition-all cursor-pointer">
                        <div>
                          <p className="font-black text-xs text-bk-cream tracking-wide">{s.label}</p>
                          <p className="text-[10px] text-bk-gold/40 font-bold uppercase mt-1 tracking-tighter">{s.desc}</p>
                        </div>
                        <div className="w-12 h-6 bg-bk-dark-2 rounded-full relative border border-bk-gold/20">
                          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full ${idx < 2 ? 'bg-bk-gold translate-x-6' : 'bg-gray-600 translate-x-0'} transition-all`} />
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-8 btn-gold py-5 font-black uppercase tracking-[0.3em]">Update Preferences</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
