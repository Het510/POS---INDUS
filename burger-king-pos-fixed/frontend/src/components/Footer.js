import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Instagram, Twitter, Facebook, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bk-dark-2 border-t border-bk-gold/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold">
                  <span className="text-bk-dark font-heading font-black text-lg">BK</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-bk-red rounded-full flex items-center justify-center">
                  <Crown size={8} className="text-bk-yellow" />
                </div>
              </div>
              <div>
                <div className="font-heading font-black text-lg text-bk-yellow leading-none">BK CROWN</div>
                <div className="font-body text-[9px] text-bk-gold/60 tracking-widest">Flame Grilled Perfection</div>
              </div>
            </div>
            <p className="font-body text-sm text-bk-cream/50 leading-relaxed">
              Premium flame-grilled burgers since 1954. Have it your way, every single time.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-bk-brown/40 rounded-full flex items-center justify-center text-bk-cream/50 hover:text-bk-gold hover:bg-bk-brown/60 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold text-bk-yellow uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="space-y-2.5">
              {[['Menu', '/menu'], ['Offers', '/offers'], ['Dine In', '/dine-in'], ['Cart', '/cart']].map(([label, href]) => (
                <Link key={href} to={href} className="block font-body text-sm text-bk-cream/50 hover:text-bk-gold transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-heading text-sm font-bold text-bk-yellow uppercase tracking-wider mb-4">Account</h4>
            <div className="space-y-2.5">
              {[['Sign In', '/login'], ['Register', '/signup'], ['My Profile', '/profile'], ['Crown Rewards', '/profile']].map(([label, href]) => (
                <Link key={label} to={href} className="block font-body text-sm text-bk-cream/50 hover:text-bk-gold transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-bold text-bk-yellow uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-3">
              {[
                { icon: <MapPin size={14} />, text: 'Ahmedabad, Gujarat, India' },
                { icon: <Phone size={14} />, text: '+91 98765 43210' },
                { icon: <Mail size={14} />, text: 'hello@bkcrown.in' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 font-body text-sm text-bk-cream/50">
                  <span className="text-bk-gold/60">{c.icon}</span>{c.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-bk-gold/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-bk-cream/30">© 2024 BK Crown. All rights reserved.</p>
          <p className="font-body text-xs text-bk-cream/30">Made with 🔥 for Hackathon</p>
        </div>
      </div>
    </footer>
  );
}
