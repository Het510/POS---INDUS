import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Package, MapPin, LogOut, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-bk-dark flex flex-col items-center justify-center px-4">
        <h2 className="font-heading text-2xl text-bk-cream mb-4">Sign in to view your profile</h2>
        <Link to="/login" className="btn-gold px-8 py-3">Sign In</Link>
      </div>
    );
  }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-bk-dark pb-20">
      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold-lg">
            <span className="font-heading text-2xl font-black text-bk-dark">{user.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-bk-cream">{user.name}</h1>
            <p className="font-body text-sm text-bk-cream/50">{user.email}</p>
            <p className="font-body text-xs text-bk-cream/40">{user.phone}</p>
          </div>
        </div>

        {/* Crown Points */}
        <div className="bg-gradient-to-r from-bk-brown to-bk-dark-2 border border-bk-gold/20 rounded-2xl p-5 mb-6 flex items-center gap-4 shadow-gold">
          <Crown size={32} className="text-bk-gold flex-shrink-0" />
          <div>
            <p className="font-heading text-3xl font-black text-bk-yellow">{user.crownPoints || 0}</p>
            <p className="font-body text-xs text-bk-gold/70">Crown Points — Keep ordering to earn more!</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-body text-xs text-bk-cream/40">Worth</p>
            <p className="font-heading text-sm text-bk-cream/70">₹{Math.floor((user.crownPoints || 0) / 10)}</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {[
            { icon: <Package size={18} />, label: 'My Orders', desc: 'View order history', href: '/orders' },
            { icon: <MapPin size={18} />, label: 'Saved Addresses', desc: 'Manage delivery addresses' },
          ].map((item, i) => (
            <div key={i} className="bg-bk-dark-2 border border-bk-brown-light/20 rounded-xl p-4 flex items-center gap-4 hover:border-bk-gold/20 transition-all cursor-pointer">
              <div className="text-bk-gold/70">{item.icon}</div>
              <div className="flex-1">
                <p className="font-heading text-sm font-bold text-bk-cream">{item.label}</p>
                <p className="font-body text-xs text-bk-cream/40">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-bk-cream/30" />
            </div>
          ))}

          {(user.role === 'admin' || user.role === 'staff') && (
            <>
              <Link to="/pos" className="block bg-bk-dark-2 border border-bk-gold/20 rounded-xl p-4 flex items-center gap-4 hover:border-bk-gold/40 transition-all">
                <div className="text-bk-gold">🖥️</div>
                <div className="flex-1">
                  <p className="font-heading text-sm font-bold text-bk-gold">POS Terminal</p>
                  <p className="font-body text-xs text-bk-cream/40">Open cashier view</p>
                </div>
                <ChevronRight size={16} className="text-bk-gold/40" />
              </Link>
              <Link to="/admin" className="block bg-bk-dark-2 border border-bk-gold/20 rounded-xl p-4 flex items-center gap-4 hover:border-bk-gold/40 transition-all">
                <div className="text-bk-gold">📊</div>
                <div className="flex-1">
                  <p className="font-heading text-sm font-bold text-bk-gold">Admin Dashboard</p>
                  <p className="font-body text-xs text-bk-cream/40">View sales & reports</p>
                </div>
                <ChevronRight size={16} className="text-bk-gold/40" />
              </Link>
            </>
          )}

          <button onClick={handleLogout}
            className="w-full bg-red-950/30 border border-red-900/40 rounded-xl p-4 flex items-center gap-4 hover:border-red-500/40 transition-all">
            <LogOut size={18} className="text-red-400" />
            <span className="font-heading text-sm font-bold text-red-400">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
