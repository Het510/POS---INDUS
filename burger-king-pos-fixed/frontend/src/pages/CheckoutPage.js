import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { CreditCard, Smartphone, Banknote, MapPin, User, Phone, ChevronLeft, Lock, CheckCircle, Building2, DollarSign } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ordersAPI, paymentsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR Code', icon: Smartphone, desc: 'PhonePe, GPay, Paytm & more', color: 'from-purple-500 to-purple-600' },
  { id: 'card', label: 'Debit/Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex', color: 'from-blue-500 to-blue-600' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks supported', color: 'from-indigo-500 to-indigo-600' },
  { id: 'cash', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when order arrives', color: 'from-green-500 to-green-600' },
];

const MAJOR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', logo: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/65e94b15-943e-460d-965a-8b8941551608?' },
  { id: 'icici', name: 'ICICI Bank', logo: 'https://www.icicibank.com/managed-assets/images/logo.png' },
  { id: 'sbi', name: 'State Bank of India', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-Logo.svg/1200px-SBI-Logo.svg.png' },
  { id: 'axis', name: 'Axis Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Axis_Bank_logo.svg/2560px-Axis_Bank_logo.svg.png' },
  { id: 'kotak', name: 'Kotak Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Kotak_Mahindra_Bank_logo.svg/2560px-Kotak_Mahindra_Bank_logo.svg.png' },
];

export default function CheckoutPage() {
  const { items, subtotal, orderType, tableId, tableNumber, clearCart } = useCart();
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { discount = 0, appliedOffer } = location.state || {};

  const [step, setStep] = useState(1); // 1: details, 2: payment, 3: processing
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiQR, setUpiQR] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: 'Ahmedabad',
    pincode: '',
    houseNo: '',
    instructions: '',
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [selectedBank, setSelectedBank] = useState('');

  const containerRef = useRef(null);
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = orderType === 'delivery' ? 49 : 0;
  const total = subtotal + tax + deliveryFee - discount;

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items]);

  const handleCreateOrder = async () => {
    if (!form.name || !form.phone) return toast.error('Please fill your name and phone');
    if (orderType === 'delivery') {
      if (!form.address || !form.houseNo) return toast.error('Please enter complete delivery address');
    }
    if (!form.email) return toast.error('Please enter your email');

    setProcessing(true);
    try {
      const orderData = {
        items: items.map(i => ({ product: i.product, name: i.name, quantity: i.quantity, price: i.price, variant: i.variant })),
        orderType, tableId, tableNumber,
        offerCode: appliedOffer?.code,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        deliveryAddress: orderType === 'delivery' ? { 
          houseNo: form.houseNo,
          street: form.address, 
          city: form.city, 
          pincode: form.pincode,
          instructions: form.instructions 
        } : undefined,
      };
      const { data } = await ordersAPI.create(orderData);
      setCreatedOrder(data.order);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!createdOrder) return;

    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        return toast.error('Please fill all card details');
      }
    }

    if (paymentMethod === 'netbanking' && !selectedBank) {
      return toast.error('Please select your bank');
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'upi') {
        const { data } = await paymentsAPI.generateUPIQR({ amount: total, orderId: createdOrder._id });
        setUpiQR(data.qrCode);
        setStep(3);
        setProcessing(false);
        return;
      }

      // Simulation delay for card/netbanking
      if (paymentMethod === 'card' || paymentMethod === 'netbanking') {
        await new Promise(r => setTimeout(r, 2000));
      }

      if (paymentMethod === 'cash') {
        await ordersAPI.updatePayment(createdOrder._id, { 
          paymentMethod: 'cash', 
          paymentStatus: 'pending'
        });
      } else if (paymentMethod === 'card') {
        await ordersAPI.updatePayment(createdOrder._id, { 
          paymentMethod: 'card', 
          paymentStatus: 'paid', 
          paymentId: `card_${Date.now()}` 
        });
      } else if (paymentMethod === 'netbanking') {
        await ordersAPI.updatePayment(createdOrder._id, { 
          paymentMethod: 'netbanking', 
          paymentStatus: 'paid', 
          paymentId: `nba_${Date.now()}`
        });
      }

      await ordersAPI.sendToKitchen(createdOrder._id);
      clearCart();
      refreshUser();
      toast.success('Order Placed Successfully! 🍔');
      navigate(`/order-confirm/${createdOrder._id}`);
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const confirmUPIPayment = async () => {
    setProcessing(true);
    try {
      await ordersAPI.updatePayment(createdOrder._id, { paymentMethod: 'upi', paymentStatus: 'paid', paymentId: `upi_${Date.now()}` });
      await ordersAPI.sendToKitchen(createdOrder._id);
      clearCart();
      refreshUser();
      navigate(`/order-confirm/${createdOrder._id}`);
    } catch (err) {
      toast.error('Failed to confirm payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen pb-20 ${isDark ? 'bg-bk-dark' : 'bg-slate-50'}`}>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
            className={`p-2 rounded-full border transition-all ${
              isDark ? 'border-bk-gold/20 text-bk-cream/60 hover:text-bk-yellow' : 'border-gray-300 text-gray-600 hover:text-bk-red'
            }`}>
            <ChevronLeft size={20} />
          </button>
          <h1 className={`font-heading text-2xl font-black uppercase ${
            isDark ? 'text-bk-yellow' : 'text-bk-red'
          }`}>
            {step === 1 ? 'Your Details' : step === 2 ? 'Payment Method' : 'Confirm Payment'}
          </h1>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold transition-all ${
                step >= s 
                  ? isDark ? 'bg-gold-gradient text-bk-dark' : 'bg-bk-red text-white'
                  : isDark ? 'bg-bk-dark-2 border border-bk-brown-light/30 text-bk-cream/40' : 'bg-gray-200 border border-gray-300 text-gray-600'
              }`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-0.5 transition-all ${step > s ? (isDark ? 'bg-bk-gold' : 'bg-bk-red') : (isDark ? 'bg-bk-brown-light/20' : 'bg-gray-300')}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: Details */}
        {step === 1 && (
          <div className={`rounded-2xl p-8 border ${isDark ? 'bg-bk-dark-2 border-bk-brown-light/20' : 'bg-white border-gray-200'} space-y-6`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Your name"
                  className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                    isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream placeholder-bk-cream/30 focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-bk-red focus:ring-1 focus:ring-bk-red'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="your@email.com"
                  className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                    isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream placeholder-bk-cream/30 focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-bk-red focus:ring-1 focus:ring-bk-red'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="+91 XXXXXXXXXX"
                className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                  isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream placeholder-bk-cream/30 focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-bk-red focus:ring-1 focus:ring-bk-red'
                }`}
              />
            </div>

            {orderType === 'delivery' && (
              <>
                <div>
                  <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Street Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    placeholder="Street name, Area, Locality"
                    className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                      isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 focus:border-bk-red'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>House/Flat No *</label>
                    <input
                      type="text"
                      value={form.houseNo}
                      onChange={e => setForm({...form, houseNo: e.target.value})}
                      placeholder="Apt No."
                      className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                        isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 focus:border-bk-red'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Pincode *</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={e => setForm({...form, pincode: e.target.value})}
                      placeholder="XXXXXX"
                      className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                        isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 focus:border-bk-red'
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleCreateOrder}
              disabled={processing}
              className={`w-full py-4 rounded-lg font-heading font-bold text-lg transition-all ${
                isDark ? 'bg-gold-gradient text-bk-dark hover:shadow-gold disabled:opacity-50' : 'bg-bk-red text-white hover:bg-red-600 disabled:opacity-50'
              }`}>
              {processing ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        )}

        {/* STEP 2: Payment Method */}
        {step === 2 && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-8 border ${isDark ? 'bg-bk-dark-2 border-bk-brown-light/20' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-heading font-bold mb-6 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                Select Payment Method
              </h3>

              <div className="grid gap-4 mb-8">
                {PAYMENT_METHODS.map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === method.id
                          ? isDark ? 'border-bk-gold bg-bk-dark' : 'border-bk-red bg-red-50'
                          : isDark ? 'border-bk-brown-light/30 hover:border-bk-gold/50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg text-white bg-gradient-to-br ${method.color}`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-heading font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                            {method.label}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-bk-cream/60' : 'text-gray-600'}`}>
                            {method.desc}
                          </div>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle size={24} className={isDark ? 'text-bk-gold' : 'text-bk-red'} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Net Banking Bank Selector */}
              {paymentMethod === 'netbanking' && (
                <div className="animate-in fade-in slide-in-from-top-4 pb-8">
                  <label className={`block text-sm font-heading font-bold mb-4 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                    Select Your Bank
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {MAJOR_BANKS.map(bank => (
                      <button key={bank.id}
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          selectedBank === bank.name 
                            ? isDark ? 'border-bk-gold bg-bk-gold/10' : 'border-bk-red bg-red-50'
                            : isDark ? 'border-bk-brown-light/20 bg-bk-dark' : 'border-gray-200 bg-white'
                        }`}>
                        <div className="h-8 flex items-center justify-center grayscale brightness-150 contrast-125">
                          <span className="font-heading text-xs font-bold text-center leading-tight">
                            {bank.name === 'State Bank of India' ? 'SBI' : bank.name.split(' ')[0]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Details Group */}
              {paymentMethod === 'card' && (
                <div className="animate-in fade-in slide-in-from-top-4 space-y-4 pb-8">
                   <div>
                    <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                        isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-bk-red'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                        placeholder="MM/YY"
                        className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                          isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-bk-red'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-heading font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})}
                        placeholder="***"
                        className={`w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none ${
                          isDark ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream focus:border-bk-gold' : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-bk-red'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Section */}
              <div className={`rounded-xl p-6 mb-8 border ${isDark ? 'bg-bk-dark border-bk-brown-light/20' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`space-y-2 mb-4 pb-4 border-b ${isDark ? 'border-bk-brown-light/20' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-bk-cream/70' : 'text-gray-600'}>Subtotal</span>
                    <span className={`font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-bk-cream/70' : 'text-gray-600'}>Tax (5%)</span>
                    <span className={`font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>₹{tax}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-bk-cream/70' : 'text-gray-600'}>Delivery Fee</span>
                      <span className={`font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>₹{deliveryFee}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500 font-bold">
                      <span>Discount</span>
                      <span>–₹{discount}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className={`font-heading font-bold text-lg ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>Total Payable</span>
                  <span className={`font-heading font-black text-2xl ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full py-4 rounded-lg font-heading font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isDark ? 'bg-gold-gradient text-bk-dark hover:shadow-gold disabled:opacity-50' : 'bg-bk-red text-white hover:bg-red-600 disabled:opacity-50'
                }`}>
                {processing ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Lock size={18} />}
                {processing ? 'Processing Securely...' : paymentMethod === 'cash' ? 'Confirm Order' : `Pay ₹${total}`}
              </button>
              
              {paymentMethod === 'cash' && (
                <p className={`text-center mt-4 text-xs font-heading ${isDark ? 'text-bk-cream/50' : 'text-gray-500'}`}>
                  You will pay <span className="font-bold">₹{total}</span> in cash when your order arrives.
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: UPI QR */}
        {step === 3 && upiQR && (
          <div className={`rounded-2xl p-8 border ${isDark ? 'bg-bk-dark-2 border-bk-brown-light/20' : 'bg-white border-gray-200'} text-center`}>
            <h3 className={`text-lg font-heading font-bold mb-6 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
              Scan to Pay
            </h3>
            <div className={`inline-block p-6 rounded-2xl mb-6 bg-white`}>
              <img src={upiQR} alt="UPI QR Code" className="w-64 h-64" />
            </div>
            <p className={`mb-6 ${isDark ? 'text-bk-cream/70' : 'text-gray-600'}`}>
              Amount to be paid: <span className={`font-bold text-lg ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>₹{total}</span>
            </p>
            <button
              onClick={confirmUPIPayment}
              disabled={processing}
              className={`w-full py-4 rounded-lg font-heading font-bold text-lg transition-all ${
                isDark ? 'bg-gold-gradient text-bk-dark hover:shadow-gold disabled:opacity-50' : 'bg-bk-red text-white hover:bg-red-600 disabled:opacity-50'
              }`}>
              {processing ? 'Confirming Payment...' : 'Verify Payment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

