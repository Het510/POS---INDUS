import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Search, ShoppingCart, Send, CreditCard, Banknote, Smartphone, Trash2, Plus, Minus, X, LayoutGrid, LogOut } from 'lucide-react';
import { productsAPI, categoriesAPI, ordersAPI, tablesAPI, paymentsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MOCK_CATS = [
  { _id: 'all', name: 'All', emoji: '🍽️' },
  { _id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { _id: 'chicken', name: 'Chicken', emoji: '🍗' },
  { _id: 'meals', name: 'Meals', emoji: '🍱' },
  { _id: 'sides', name: 'Sides', emoji: '🍟' },
  { _id: 'beverages', name: 'Beverages', emoji: '🥤' },
  { _id: 'desserts', name: 'Desserts', emoji: '🍨' },
];

const MOCK_PRODUCTS = [
  { _id: 'p1', name: 'Whopper Supreme', basePrice: 249, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', isVeg: false, category: { name: 'Burgers' } },
  { _id: 'p2', name: 'Double Whopper', basePrice: 349, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop', isVeg: false, category: { name: 'Burgers' } },
  { _id: 'p3', name: 'Crispy Chicken', basePrice: 199, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=400&fit=crop', isVeg: false, category: { name: 'Chicken' } },
  { _id: 'p4', name: 'Spicy Paneer', basePrice: 179, image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=400&fit=crop', isVeg: true, category: { name: 'Burgers' } },
  { _id: 'p5', name: 'Veggie Bean Burger', basePrice: 149, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop', isVeg: true, category: { name: 'Burgers' } },
  { _id: 'p6', name: 'Chicken Strips', basePrice: 229, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop', isVeg: false, category: { name: 'Chicken' } },
  { _id: 'p7', name: 'BK Hi-Fries', basePrice: 99, image: 'https://images.unsplash.com/photo-1573080491704-8693aa31bc2a?w=600&h=400&fit=crop', isVeg: true, category: { name: 'Sides' } },
  { _id: 'p8', name: 'Onion Rings', basePrice: 89, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop', isVeg: true, category: { name: 'Sides' } },
  { _id: 'p9', name: 'Whopper Meal', basePrice: 399, image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=400&fit=crop', isVeg: false, category: { name: 'Meals' } },
  { _id: 'p10', name: 'Paneer Meal', basePrice: 329, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=600&h=400&fit=crop', isVeg: true, category: { name: 'Meals' } },
  { _id: 'p11', name: 'Choco Shake', basePrice: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop', isVeg: true, category: { name: 'Beverages' } },
  { _id: 'p12', name: 'Soft Serve', basePrice: 39, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop', isVeg: true, category: { name: 'Desserts' } },
];

export default function POSPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderType, setOrderType] = useState('dine-in');
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [upiQR, setUpiQR] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  
  // New payment states
  const [amountReceived, setAmountReceived] = useState('');
  const [cardProcessingState, setCardProcessingState] = useState('idle'); // idle, swipe, pin, success

  useEffect(() => {
    productsAPI.getAll().then(r => setProducts(r.data.products)).catch(() => setProducts(MOCK_PRODUCTS));
    categoriesAPI.getAll().then(r => setCategories([{ _id: 'all', name: 'All', emoji: '🍽️' }, ...r.data.categories])).catch(() => setCategories(MOCK_CATS));
    tablesAPI.getAll().then(r => setTables(r.data.tables)).catch(() => {});
    gsap.fromTo('.pos-grid', { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }, []);

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory !== 'all' && p.category?._id !== activeCategory && p.category?.name?.toLowerCase() !== activeCategory.toLowerCase()) return false;
    return true;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i._id !== id));
    else setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const subtotal = cart.reduce((s, i) => s + i.basePrice * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handlePay = async () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    
    if (paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < total)) {
      return toast.error('Please enter a valid amount received');
    }

    setProcessing(true);
    
    if (paymentMethod === 'card') {
      setCardProcessingState('swipe');
      await new Promise(r => setTimeout(r, 1500));
      setCardProcessingState('pin');
      await new Promise(r => setTimeout(r, 1500));
      setCardProcessingState('success');
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const orderData = {
        items: cart.map(i => ({ product: i._id, name: i.name, quantity: i.quantity, price: i.basePrice })),
        orderType,
        tableId: selectedTable?._id,
        tableNumber: selectedTable?.tableNumber,
        customerName: 'Walk-in Customer',
        customerPhone: '0000000000',
      };
      const { data } = await ordersAPI.create(orderData);
      const order = data.order;

      if (paymentMethod === 'upi') {
        const qrRes = await paymentsAPI.generateUPIQR({ amount: total, orderId: order._id });
        setUpiQR({ qr: qrRes.data.qrCode, order });
        setProcessing(false);
        return;
      }

      await ordersAPI.updatePayment(order._id, { 
        paymentMethod, 
        paymentStatus: 'paid', // Mark as paid for card/cash in POS
        paymentDetails: paymentMethod === 'cash' ? { amountReceived: parseFloat(amountReceived), change: parseFloat(amountReceived) - total } : undefined
      });
      await ordersAPI.sendToKitchen(order._id);
      
      toast.success(`Order ${order.orderNumber} Successful! 🎉`);
      if (paymentMethod === 'cash') {
        toast(`Change to return: ₹${parseFloat(amountReceived) - total}`, { icon: '💰', duration: 5000 });
      }

      // Reset
      setCart([]);
      setPaymentModal(false);
      setSelectedTable(null);
      setAmountReceived('');
      setCardProcessingState('idle');
    } catch (err) {
      toast.error('Failed to process order');
    } finally {
      setProcessing(false);
    }
  };

  const confirmUPI = async () => {
    if (!upiQR) return;
    setProcessing(true);
    try {
      await ordersAPI.updatePayment(upiQR.order._id, { paymentMethod: 'upi', paymentStatus: 'paid', paymentId: `upi_${Date.now()}` });
      await ordersAPI.sendToKitchen(upiQR.order._id);
      toast.success(`Order ${upiQR.order.orderNumber} paid! 🍔`);
      setCart([]);
      setPaymentModal(false);
      setUpiQR(null);
      setSelectedTable(null);
    } catch (err) {
      toast.error('Failed to confirm');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-screen bg-bk-dark flex flex-col overflow-hidden font-heading">
      {/* Top Bar */}
      <div className="bg-bk-dark-2 border-b border-bk-gold/20 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center">
            <span className="text-bk-dark font-black text-sm">BK</span>
          </div>
          <span className="font-black text-bk-yellow text-sm uppercase tracking-wider">POS Terminal</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-bk-cream/50">
          {user && <span>Cashier: <span className="text-bk-gold">{user.name}</span></span>}
          <button onClick={() => navigate('/kitchen')} className="px-3 py-1.5 border border-bk-gold/20 rounded-lg text-bk-cream/60 hover:text-bk-yellow hover:border-bk-gold/40 transition-all">Kitchen</button>
          <button onClick={() => navigate('/admin')} className="px-3 py-1.5 border border-bk-gold/20 rounded-lg text-bk-cream/60 hover:text-bk-yellow hover:border-bk-gold/40 transition-all">Dashboard</button>
          <button onClick={() => { logout(); navigate('/login'); }} className="px-3 py-1.5 border border-red-900/40 rounded-lg text-red-400/70 hover:text-red-400 transition-all flex items-center gap-1"><LogOut size={12} />Exit</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Products */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-bk-gold/10">
          {/* Categories */}
          <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-bk-gold/10 flex-shrink-0">
            {categories.map(cat => (
              <button key={cat._id} onClick={() => setActiveCategory(cat._id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeCategory === cat._id ? 'bg-gold-gradient text-bk-dark font-bold' : 'bg-bk-dark-2 text-bk-cream/60 hover:text-bk-yellow'
                }`}>
                <span>{cat.emoji}</span><span className="uppercase tracking-wide">{cat.name}</span>
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="px-3 py-2 border-b border-bk-gold/10 flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bk-cream/30" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full bg-bk-brown/20 border border-bk-brown-light/20 rounded-lg pl-8 pr-3 py-2 text-bk-cream text-xs placeholder-bk-cream/30 focus:outline-none focus:border-bk-gold/30" />
            </div>
          </div>
          {/* Product Grid */}
          <div className="pos-grid flex-1 overflow-y-auto p-3 grid grid-cols-3 xl:grid-cols-4 gap-2.5 content-start">
            {filtered.map(product => (
              <button key={product._id} onClick={() => addToCart(product)}
                className="bg-bk-dark-2 border border-bk-brown-light/20 rounded-xl overflow-hidden hover:border-bk-gold/40 hover:bg-bk-brown/20 active:scale-95 transition-all group">
                <div className="h-28 overflow-hidden bg-bk-dark/50">
                  <img src={product.image || 'https://via.placeholder.com/200?text=' + product.name} 
                       alt={product.name} 
                       className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase text-bk-cream/40 mb-1">{product.category?.name}</div>
                  <div className="text-xs font-bold text-bk-cream line-clamp-1">{product.name}</div>
                  <div className="text-bk-yellow font-black text-sm mt-1">₹{product.basePrice}</div>
                  {product.isVeg && <div className="mt-1 w-3 h-3 border border-green-500 rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /></div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Cart */}
        <div className="w-80 xl:w-96 flex flex-col bg-bk-dark-2 flex-shrink-0">
          {/* Order info */}
          <div className="p-3 border-b border-bk-gold/10 flex-shrink-0 space-y-2">
            <div className="flex gap-1.5">
              {['dine-in', 'takeaway', 'delivery'].map(t => (
                <button key={t} onClick={() => setOrderType(t)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                    orderType === t ? 'bg-gold-gradient text-bk-dark' : 'bg-bk-dark text-bk-cream/50 hover:text-bk-yellow'
                  }`}>{t.replace('-', ' ')}</button>
              ))}
            </div>
            {orderType === 'dine-in' && (
              <button onClick={() => setShowTablePicker(true)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all ${
                  selectedTable ? 'border-bk-gold/40 text-bk-gold' : 'border-bk-brown-light/20 text-bk-cream/50 hover:border-bk-gold/20'
                }`}>
                <span className="flex items-center gap-2"><LayoutGrid size={12} />{selectedTable ? `Table ${selectedTable.tableNumber}` : 'Select Table'}</span>
                <span>›</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                <ShoppingCart size={40} className="text-bk-cream/30 mb-2" />
                <p className="text-xs text-bk-cream/50">Add items to order</p>
              </div>
            ) : cart.map(item => (
              <div key={item._id} className="flex items-center gap-2 bg-bk-dark/50 rounded-xl p-2.5">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-bk-dark flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-bk-cream line-clamp-1">{item.name}</p>
                  <p className="text-bk-yellow text-xs font-black">₹{item.basePrice * item.quantity}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => updateCartQty(item._id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full border border-bk-gold/20 flex items-center justify-center text-bk-cream/60 hover:text-bk-gold text-xs">–</button>
                  <span className="text-xs font-bold text-bk-cream w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartQty(item._id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-bk-gold/20 flex items-center justify-center text-bk-gold text-xs hover:bg-bk-gold/30">+</button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="p-3 border-t border-bk-gold/10 flex-shrink-0 space-y-2">
              <div className="space-y-1 text-xs text-bk-cream/50">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-bk-cream">₹{subtotal}</span></div>
                <div className="flex justify-between"><span>GST (5%)</span><span className="text-bk-cream">₹{tax}</span></div>
                <div className="flex justify-between font-bold text-sm text-bk-cream border-t border-bk-gold/10 pt-1.5">
                  <span>Total</span><span className="text-bk-yellow">₹{total}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setCart([]); setSelectedTable(null); }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-900/40 text-red-400/70 text-xs hover:border-red-500/40 hover:text-red-400 transition-all">
                  <Trash2 size={12} />Clear
                </button>
                <button onClick={() => setPaymentModal(true)}
                  className="btn-gold py-2 text-xs flex items-center justify-center gap-1.5">
                  <CreditCard size={14} />Pay ₹{total}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Picker Modal */}
      {showTablePicker && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowTablePicker(false)}>
          <div className="bg-bk-dark-2 border border-bk-gold/20 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-bk-yellow mb-4 text-lg">Select Table</h3>
            <div className="grid grid-cols-4 gap-2">
              {(tables.length > 0 ? tables : Array.from({ length: 12 }, (_, i) => ({ _id: `t${i+1}`, tableNumber: `${i+1}`, status: i % 3 === 1 ? 'occupied' : 'available' }))).map(t => (
                <button key={t._id}
                  disabled={t.status !== 'available'}
                  onClick={() => { setSelectedTable(t); setShowTablePicker(false); }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    t.status === 'available' ? 'border-green-500/40 bg-green-900/10 hover:bg-green-900/20 text-green-400' : 'border-red-500/30 opacity-40 cursor-not-allowed text-red-400'
                  } ${selectedTable?._id === t._id ? 'bg-bk-gold/20 border-bk-gold' : ''}`}>
                  <div className="font-black text-lg">T{t.tableNumber}</div>
                  <div className="text-[9px]">{t.status}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && !upiQR && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-bk-dark-2 border border-bk-gold/20 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-bold text-bk-yellow text-xl">Payment</h3>
              <button onClick={() => { setPaymentModal(false); setCardProcessingState('idle'); }}><X size={20} className="text-bk-cream/50 hover:text-bk-cream" /></button>
            </div>
            
            <div className="text-center mb-5">
              <span className="font-heading text-4xl font-black text-bk-yellow">₹{total}</span>
            </div>

            {cardProcessingState === 'idle' ? (
              <>
                <div className="space-y-2 mb-5">
                  {[
                    { id: 'cash', label: 'Cash', icon: <Banknote size={18} /> },
                    { id: 'card', label: 'Card / Digital', icon: <CreditCard size={18} /> },
                    { id: 'upi', label: 'UPI QR', icon: <Smartphone size={18} /> },
                  ].map(pm => (
                    <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        paymentMethod === pm.id ? 'border-bk-gold bg-bk-gold/10 text-bk-gold' : 'border-bk-brown-light/20 text-bk-cream/60 hover:border-bk-gold/30'
                      }`}>
                      {pm.icon}<span className="font-heading text-sm font-bold">{pm.label}</span>
                      {paymentMethod === pm.id && <div className="ml-auto w-4 h-4 bg-bk-gold rounded-full" />}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'cash' && (
                  <div className="mb-5 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] uppercase font-bold text-bk-cream/40 mb-1 block tracking-wider">Amount Received (₹)</label>
                    <input 
                      type="number"
                      value={amountReceived}
                      onChange={e => setAmountReceived(e.target.value)}
                      placeholder="Enter cash amount..."
                      className="w-full bg-bk-brown/20 border border-bk-gold/20 rounded-xl px-4 py-3 text-bk-cream focus:outline-none focus:border-bk-gold text-lg font-black" 
                    />
                    {amountReceived && parseFloat(amountReceived) >= total && (
                      <div className="mt-2 text-xs text-green-400 font-bold flex justify-between">
                        <span>Change due:</span>
                        <span>₹{parseFloat(amountReceived) - total}</span>
                      </div>
                    )}
                  </div>
                )}

                <button onClick={handlePay} disabled={processing}
                  className="w-full btn-gold py-3.5 flex items-center justify-center gap-2 text-sm">
                  {processing ? 'Processing...' : <><Send size={16} /> Confirm Payment</>}
                </button>
              </>
            ) : (
              <div className="py-10 text-center flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-full border-4 border-t-bk-gold border-bk-gold/10 animate-spin ${cardProcessingState === 'success' ? 'hidden' : ''}`} />
                {cardProcessingState === 'success' && <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center animate-bounce"><Send size={32} /></div>}
                <div className="text-bk-cream font-bold text-lg">
                  {cardProcessingState === 'swipe' && 'Please Dip/Swipe Card...'}
                  {cardProcessingState === 'pin' && 'Enter PIN on Terminal...'}
                  {cardProcessingState === 'success' && 'Payment Successful!'}
                </div>
                <p className="text-bk-cream/40 text-xs italic">Syncing with card terminal...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPI QR Modal */}
      {upiQR && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-bk-dark-2 border border-bk-gold/20 rounded-2xl p-6 w-full max-w-xs text-center">
            <h3 className="font-heading font-bold text-bk-yellow text-xl mb-3">Scan to Pay</h3>
            <div className="bg-white p-3 rounded-xl inline-block mb-4">
              <img src={upiQR.qr} alt="UPI QR" className="w-48 h-48" />
            </div>
            <p className="font-heading text-3xl font-black text-bk-yellow mb-1">₹{total}</p>
            <p className="text-xs text-bk-cream/50 mb-5">Order #{upiQR.order.orderNumber}</p>
            <div className="space-y-2">
              <button onClick={confirmUPI} disabled={processing}
                className="w-full btn-gold py-3 text-sm">
                {processing ? 'Confirming...' : '✓ Payment Received'}
              </button>
              <button onClick={() => setUpiQR(null)}
                className="w-full py-2.5 border border-bk-brown-light/20 rounded-xl text-bk-cream/50 text-xs hover:border-bk-gold/20 transition-all">
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

