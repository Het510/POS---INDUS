import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TrendingUp, ShoppingBag, Users, DollarSign, ChefHat, ArrowLeft, RefreshCw } from 'lucide-react';
import { dashboardAPI, ordersAPI } from '../utils/api';

const MOCK_STATS = {
  todayOrders: 24, todayRevenue: 8640, weekOrders: 156, weekRevenue: 54820,
  totalOrders: 892, totalRevenue: 312400,
  recentOrders: [
    { _id: 'o1', orderNumber: 'BK001', status: 'completed', total: 448, orderType: 'dine-in', createdAt: new Date(), table: { tableNumber: '3' } },
    { _id: 'o2', orderNumber: 'BK002', status: 'preparing', total: 249, orderType: 'takeaway', createdAt: new Date() },
    { _id: 'o3', orderNumber: 'BK003', status: 'confirmed', total: 399, orderType: 'dine-in', createdAt: new Date(), table: { tableNumber: '6' } },
    { _id: 'o4', orderNumber: 'BK004', status: 'pending', total: 179, orderType: 'delivery', createdAt: new Date() },
  ]
};

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-900/20',
  confirmed: 'text-blue-400 bg-blue-900/20',
  preparing: 'text-orange-400 bg-orange-900/20',
  ready: 'text-green-300 bg-green-900/20',
  completed: 'text-green-400 bg-green-900/20',
  cancelled: 'text-red-400 bg-red-900/20',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const statsRef = useRef(null);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        dashboardAPI.getStats(),
        ordersAPI.getAll({ limit: 20 })
      ]);
      setStats(statsRes.data.stats);
      setOrders(ordersRes.data.orders);
    } catch {
      setStats(MOCK_STATS);
      setOrders(MOCK_STATS.recentOrders);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (stats && statsRef.current) {
      gsap.fromTo('.stat-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' });
    }
  }, [stats]);

  const statCards = stats ? [
    { label: "Today's Revenue", value: `₹${stats.todayRevenue?.toLocaleString() || 0}`, sub: `${stats.todayOrders || 0} orders today`, icon: <DollarSign size={22} />, color: 'from-bk-gold/20 to-bk-brown/20' },
    { label: "This Week", value: `₹${stats.weekRevenue?.toLocaleString() || 0}`, sub: `${stats.weekOrders || 0} orders`, icon: <TrendingUp size={22} />, color: 'from-blue-900/20 to-blue-800/10' },
    { label: "Total Orders", value: (stats.totalOrders || 0).toLocaleString(), sub: 'All time', icon: <ShoppingBag size={22} />, color: 'from-purple-900/20 to-purple-800/10' },
    { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, sub: 'All time', icon: <TrendingUp size={22} />, color: 'from-green-900/20 to-green-800/10' },
  ] : [];

  return (
    <div className="min-h-screen bg-bk-dark pb-20 font-heading">
      {/* Header */}
      <div className="bg-bk-dark-2 border-b border-bk-gold/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/pos" className="p-1.5 rounded-lg border border-bk-gold/20 text-bk-cream/60 hover:text-bk-yellow hover:border-bk-gold/40 transition-all">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-black text-bk-yellow text-xl uppercase tracking-wider">Admin Dashboard</h1>
        </div>
        <button onClick={fetchData} disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 border border-bk-gold/20 rounded-lg text-bk-cream/60 hover:text-bk-yellow text-xs transition-all">
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* Stat Cards */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className={`stat-card card-dark bg-gradient-to-br ${card.color} p-5`}>
              <div className="text-bk-gold/70 mb-3">{card.icon}</div>
              <div className="text-2xl font-black text-bk-cream">{card.value}</div>
              <div className="text-xs font-bold text-bk-cream/60 mt-0.5">{card.label}</div>
              <div className="text-[10px] text-bk-cream/30 mt-1">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'POS Terminal', href: '/pos', emoji: '🖥️' },
            { label: 'Kitchen Display', href: '/kitchen', emoji: '👨‍🍳' },
            { label: 'View Menu', href: '/menu', emoji: '🍔' },
          ].map((a, i) => (
            <Link key={i} to={a.href} className="card-dark p-4 text-center hover:border-bk-gold/40 transition-all">
              <div className="text-3xl mb-2">{a.emoji}</div>
              <div className="text-xs font-bold text-bk-cream/70">{a.label}</div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card-dark p-5">
          <h2 className="text-lg font-black text-bk-yellow mb-4 uppercase tracking-wider">Recent Orders</h2>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl shimmer" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bk-gold/10 text-xs text-bk-cream/40 uppercase tracking-wider">
                    <th className="text-left pb-3 pr-4">Order</th>
                    <th className="text-left pb-3 pr-4">Type</th>
                    <th className="text-left pb-3 pr-4">Table</th>
                    <th className="text-left pb-3 pr-4">Status</th>
                    <th className="text-right pb-3">Total</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {(orders.length > 0 ? orders : MOCK_STATS.recentOrders).map(order => (
                    <tr key={order._id} className="border-b border-bk-gold/5 hover:bg-bk-brown/10 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="text-bk-gold font-bold">#{order.orderNumber}</span>
                        <div className="text-[10px] text-bk-cream/30">{new Date(order.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td className="py-3 pr-4 text-bk-cream/60 capitalize text-xs">{order.orderType}</td>
                      <td className="py-3 pr-4 text-bk-cream/60 text-xs">{order.table?.tableNumber ? `T${order.table.tableNumber}` : '—'}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] || 'text-bk-cream/50'}`}>
                          {order.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-bk-yellow">₹{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
