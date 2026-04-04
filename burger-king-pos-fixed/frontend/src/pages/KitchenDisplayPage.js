import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChefHat, Clock, CheckCheck, Flame, Bell } from 'lucide-react';
import { kitchenAPI } from '../utils/api';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const STAGES = {
  'to-cook': { label: 'To Cook', color: 'border-orange-500 bg-orange-900/20', badge: 'bg-orange-500', icon: <Flame size={14} /> },
  'preparing': { label: 'Preparing', color: 'border-bk-yellow bg-yellow-900/20', badge: 'bg-bk-yellow', icon: <ChefHat size={14} /> },
  'completed': { label: 'Completed', color: 'border-green-500 bg-green-900/20', badge: 'bg-green-500', icon: <CheckCheck size={14} /> },
};

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    kitchenAPI.getOrders()
      .then(r => setOrders(r.data.orders))
      .catch(() => setOrders(MOCK_KITCHEN_ORDERS));

    const s = io(process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000');
    s.emit('join-kitchen');
    s.on('new-order', (order) => {
      setOrders(prev => [{ ...order, status: 'confirmed', items: order.items.map(i => ({ ...i, kitchenStatus: 'to-cook' })) }, ...prev]);
      toast.success(`New order: ${order.orderNumber}`, { icon: '🍔' });
    });
    s.on('order-updated', (data) => {
      setOrders(prev => prev.map(o => o._id === data.orderId ? { ...o, status: data.status } : o));
    });
    setSocket(s);

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => { s.disconnect(); clearInterval(timer); };
  }, []);

  const moveToNext = async (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;
    const allToCooke = order.items.every(i => i.kitchenStatus === 'to-cook');
    const newStatus = allToCooke ? 'preparing' : 'completed';
    setOrders(prev => prev.map(o => o._id === orderId
      ? { ...o, items: o.items.map(i => ({ ...i, kitchenStatus: newStatus })) }
      : o));
  };

  const markItemDone = (orderId, itemIdx) => {
    setOrders(prev => prev.map(o => {
      if (o._id !== orderId) return o;
      const items = [...o.items];
      items[itemIdx] = { ...items[itemIdx], kitchenStatus: 'completed' };
      return { ...o, items };
    }));
    kitchenAPI.updateItem(orderId, itemIdx, 'completed').catch(() => {});
  };

  const getStage = (order) => {
    const statuses = order.items?.map(i => i.kitchenStatus) || [];
    if (statuses.every(s => s === 'completed')) return 'completed';
    if (statuses.some(s => s === 'preparing' || s === 'completed')) return 'preparing';
    return 'to-cook';
  };

  const toCook = orders.filter(o => getStage(o) === 'to-cook');
  const preparing = orders.filter(o => getStage(o) === 'preparing');
  const completed = orders.filter(o => getStage(o) === 'completed').slice(0, 5);

  return (
    <div className="min-h-screen bg-bk-dark p-4 font-heading">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-gradient rounded-xl">
            <ChefHat size={24} className="text-bk-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-bk-yellow">KITCHEN DISPLAY</h1>
            <p className="text-xs text-bk-cream/50">BK Crown POS System</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-bk-cream">{time.toLocaleTimeString()}</div>
          <div className="text-xs text-bk-cream/50">{time.toLocaleDateString()}</div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 mb-6">
        <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <Flame className="text-orange-400" size={18} />
          <div><div className="text-xl font-black text-orange-300">{toCook.length}</div><div className="text-[10px] text-orange-400/60">TO COOK</div></div>
        </div>
        <div className="bg-yellow-900/30 border border-bk-yellow/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <ChefHat className="text-bk-yellow" size={18} />
          <div><div className="text-xl font-black text-bk-yellow">{preparing.length}</div><div className="text-[10px] text-bk-yellow/60">PREPARING</div></div>
        </div>
        <div className="bg-green-900/30 border border-green-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <CheckCheck className="text-green-400" size={18} />
          <div><div className="text-xl font-black text-green-300">{completed.length}</div><div className="text-[10px] text-green-400/60">COMPLETED</div></div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        {[
          { key: 'to-cook', orders: toCook, ...STAGES['to-cook'] },
          { key: 'preparing', orders: preparing, ...STAGES['preparing'] },
          { key: 'completed', orders: completed, ...STAGES['completed'] },
        ].map(col => (
          <div key={col.key} className="flex flex-col">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-t-xl mb-2 ${col.badge} bg-opacity-20`}>
              {col.icon}
              <span className="text-sm font-black uppercase tracking-wider text-bk-cream">{col.label}</span>
              <span className={`ml-auto w-6 h-6 ${col.badge} rounded-full flex items-center justify-center text-xs font-black text-bk-dark`}>
                {col.orders.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {col.orders.map(order => (
                <KitchenCard
                  key={order._id || order.orderNumber}
                  order={order}
                  stage={col.key}
                  onAdvance={() => moveToNext(order._id)}
                  onItemDone={(idx) => markItemDone(order._id, idx)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KitchenCard({ order, stage, onAdvance, onItemDone }) {
  const cardRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(cardRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.2)' });
  }, []);

  const elapsed = order.kitchenSentAt
    ? Math.floor((Date.now() - new Date(order.kitchenSentAt)) / 60000)
    : 0;

  return (
    <div ref={cardRef}
      className={`border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${STAGES[stage]?.color || 'border-bk-gold/20 bg-bk-dark-2'}`}
      onClick={stage !== 'completed' ? onAdvance : undefined}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-black text-bk-yellow text-sm">#{order.orderNumber}</span>
          {order.tableNumber && <span className="ml-2 text-xs text-bk-cream/50">Table {order.tableNumber}</span>}
        </div>
        <div className={`flex items-center gap-1 text-xs ${elapsed > 10 ? 'text-red-400' : 'text-bk-cream/50'}`}>
          <Clock size={10} />{elapsed}m
        </div>
      </div>
      <div className="space-y-1.5">
        {order.items?.map((item, idx) => (
          <div key={idx}
            className={`flex items-center gap-2 text-sm ${item.kitchenStatus === 'completed' ? 'line-through text-bk-cream/30' : 'text-bk-cream'}`}
            onClick={(e) => { e.stopPropagation(); onItemDone(idx); }}>
            <span className="text-bk-gold font-bold text-xs w-5">{item.quantity}×</span>
            <span className="font-body">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-bk-cream/30 uppercase">{order.orderType}</span>
        {stage !== 'completed' && (
          <span className="text-[10px] text-bk-gold/60 uppercase tracking-wider">
            Tap → {stage === 'to-cook' ? 'Preparing' : 'Done'}
          </span>
        )}
      </div>
    </div>
  );
}

const MOCK_KITCHEN_ORDERS = [
  { _id: 'k1', orderNumber: 'BK001', tableNumber: '3', orderType: 'dine-in', kitchenSentAt: new Date(Date.now() - 300000),
    items: [{ name: 'Whopper Supreme', quantity: 2, kitchenStatus: 'to-cook' }, { name: 'BK Hi-Fries', quantity: 2, kitchenStatus: 'to-cook' }] },
  { _id: 'k2', orderNumber: 'BK002', tableNumber: '6', orderType: 'dine-in', kitchenSentAt: new Date(Date.now() - 600000),
    items: [{ name: 'Crispy Chicken', quantity: 1, kitchenStatus: 'preparing' }, { name: 'Cold Coffee', quantity: 1, kitchenStatus: 'to-cook' }] },
  { _id: 'k3', orderNumber: 'BK003', tableNumber: null, orderType: 'takeaway', kitchenSentAt: new Date(Date.now() - 900000),
    items: [{ name: 'Spicy Paneer Burger', quantity: 1, kitchenStatus: 'completed' }, { name: 'Mango Smoothie', quantity: 1, kitchenStatus: 'completed' }] },
];
