import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Tag, Clock, ChevronRight } from 'lucide-react';
import { offersAPI } from '../utils/api';

const MOCK_OFFERS = [
  { _id: 'o1', title: '20% OFF on Meals', description: 'Get 20% off on all combo meals above ₹300', code: 'MEAL20', type: 'percentage', value: 20, minOrderValue: 300, badge: '🔥 HOT' },
  { _id: 'o2', title: '₹50 OFF First Order', description: 'New users get flat ₹50 off on first order', code: 'NEWBK50', type: 'flat', value: 50, minOrderValue: 150, badge: '👑 NEW' },
  { _id: 'o3', title: 'Free Fries Friday', description: 'Order any burger on Friday, get fries free!', code: 'FREEFRI', type: 'bogo', badge: '🍟 FREE' },
  { _id: 'o4', title: 'Crown Member Extra 10%', description: 'Exclusive 10% for Crown loyalty members', code: 'CROWN10', type: 'percentage', value: 10, minOrderValue: 200, badge: '👑 VIP' },
];

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    offersAPI.getAll().then(r => setOffers(r.data.offers)).catch(() => setOffers(MOCK_OFFERS));
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-bk-dark pb-20">
      <div className="bg-gradient-to-b from-bk-dark-2 to-bk-dark pt-6 pb-10 px-4 text-center mb-8">
        <Tag size={32} className="text-bk-gold mx-auto mb-3" />
        <h1 className="font-heading text-4xl font-black text-bk-yellow">TODAY'S OFFERS</h1>
        <p className="font-body text-bk-cream/50 text-sm mt-2">Exclusive deals for you</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 grid gap-5">
        {(offers.length > 0 ? offers : MOCK_OFFERS).map(offer => (
          <div key={offer._id}
            className="card-dark bg-gradient-to-r from-bk-brown/30 to-bk-dark-2 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle, #C8962A 0%, transparent 70%)' }} />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs font-heading text-bk-red bg-bk-red/10 px-2 py-0.5 rounded-full">{offer.badge}</span>
                <h3 className="font-heading text-xl font-bold text-bk-yellow mt-2">{offer.title}</h3>
                <p className="font-body text-sm text-bk-cream/60 mt-1">{offer.description}</p>
                {offer.minOrderValue > 0 && (
                  <p className="font-body text-xs text-bk-cream/40 mt-2">Min order: ₹{offer.minOrderValue}</p>
                )}
              </div>
              {offer.type === 'percentage' && (
                <div className="text-center bg-bk-red rounded-2xl px-4 py-3 flex-shrink-0">
                  <div className="font-heading text-3xl font-black text-white">{offer.value}%</div>
                  <div className="font-heading text-xs text-white/70">OFF</div>
                </div>
              )}
              {offer.type === 'flat' && (
                <div className="text-center bg-bk-brown border border-bk-gold/30 rounded-2xl px-4 py-3 flex-shrink-0">
                  <div className="font-heading text-xl font-black text-bk-yellow">₹{offer.value}</div>
                  <div className="font-heading text-xs text-bk-gold/60">FLAT OFF</div>
                </div>
              )}
            </div>
            {offer.code && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 border border-dashed border-bk-gold/30 rounded-xl px-4 py-2.5 flex items-center justify-between">
                  <span className="font-heading text-bk-gold tracking-widest font-bold">{offer.code}</span>
                  <button onClick={() => copyCode(offer.code)}
                    className={`text-xs font-heading transition-all ${copiedCode === offer.code ? 'text-green-400' : 'text-bk-cream/40 hover:text-bk-gold'}`}>
                    {copiedCode === offer.code ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <Link to="/cart" className="btn-gold text-xs px-4 py-2.5">Use Now</Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
