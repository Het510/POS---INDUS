// OrderConfirmPage.js
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { CheckCircle, Clock, ChefHat, Crown } from 'lucide-react';
import { ordersAPI } from '../utils/api';

export default function OrderConfirmPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const checkRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    ordersAPI.getOne(orderId).then(r => setOrder(r.data.order)).catch(() => {});
  }, [orderId]);

  useEffect(() => {
    if (!order) return;
    gsap.fromTo(checkRef.current, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' });
    gsap.fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' });
  }, [order]);

  const STATUS_STEPS = [
    { key: 'confirmed', label: 'Order Placed', icon: <CheckCircle size={18} /> },
    { key: 'preparing', label: 'Preparing', icon: <ChefHat size={18} /> },
    { key: 'ready', label: 'Ready', icon: <Clock size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-bk-dark flex flex-col items-center justify-center px-4 py-12">
      <div ref={checkRef} className="w-20 h-20 bg-green-900/30 border-2 border-green-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-green-400" />
      </div>

      <h1 className="font-heading text-4xl font-black text-bk-yellow mb-2">ORDER PLACED!</h1>
      <p className="font-body text-bk-cream/60 mb-8">Your order is being prepared 🔥</p>

      {order && (
        <div ref={cardRef} className="w-full max-w-sm bg-bk-dark-2 border border-bk-gold/20 rounded-3xl p-6 space-y-4 shadow-gold">
          <div className="text-center">
            <p className="font-body text-xs text-bk-cream/40 uppercase tracking-wider">Order Number</p>
            <p className="font-heading text-2xl font-black text-bk-gold">{order.orderNumber}</p>
          </div>

          <div className="space-y-2 border-t border-bk-gold/10 pt-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-body text-bk-cream/70">{item.quantity}× {item.name}</span>
                <span className="font-heading text-bk-cream/70">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-bk-gold/10 pt-2 flex justify-between font-heading font-bold">
              <span className="text-bk-cream">{order.paymentMethod === 'cash' ? 'Amount to Pay' : 'Total Paid'}</span>
              <span className="text-bk-yellow">₹{order.total}</span>
            </div>
          </div>

          <div className="bg-bk-brown/10 rounded-xl p-4 border border-bk-gold/10 text-center">
            <p className="text-[10px] text-bk-cream/40 uppercase tracking-widest mb-1">Payment Method</p>
            <p className="text-sm font-bold text-bk-gold uppercase">{order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}</p>
            <p className={`text-[10px] mt-1 font-bold ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-bk-yellow'}`}>
              Status: {order.paymentStatus === 'paid' ? 'PAID' : 'PAY ON ARRIVAL'}
            </p>
          </div>

          {order.crownPointsEarned > 0 && (
            <div className="flex items-center gap-2 bg-bk-gold/10 rounded-xl px-4 py-3">
              <Crown size={16} className="text-bk-gold" />
              <span className="font-heading text-sm text-bk-gold">+{order.crownPointsEarned} Crown Points earned!</span>
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/menu" className="flex-1 btn-outline-gold text-sm py-2.5 text-center transition-all hover:scale-[1.02]">Order More</Link>
            <Link to="/" className="flex-1 btn-gold text-sm py-2.5 text-center transition-all hover:scale-[1.02]">Home</Link>
          </div>
        </div>
      )}
    </div>
  );
}
