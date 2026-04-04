import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Truck, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const services = [
  {
    id: 'delivery',
    title: 'Delivery',
    description: 'Get it delivered to your doorstep',
    icon: Truck,
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600'
  },
  {
    id: 'dine-in',
    title: 'Dine In',
    description: 'Enjoy at our restaurant',
    icon: UtensilsCrossed,
    color: 'from-orange-500 to-orange-600',
    textColor: 'text-orange-600'
  },
  {
    id: 'takeaway',
    title: 'Takeaway',
    description: 'Quick pickup from counter',
    icon: ShoppingBag,
    color: 'from-yellow-500 to-yellow-600',
    textColor: 'text-yellow-600'
  },
];

export default function ServiceSelectionPage() {
  const navigate = useNavigate();
  const { setOrderType, orderType } = useCart();
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
    
    gsap.fromTo('.service-card',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' }
    );
  }, []);

  const handleServiceSelect = (service) => {
    setOrderType(service.id);
    if (service.id === 'dine-in') {
      navigate('/dine-in');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-bk-dark dark:via-bk-dark-2 dark:to-bk-dark px-4 py-20">
      <div ref={containerRef} className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-black text-bk-dark dark:text-bk-yellow mb-4">
            Choose Your Way
          </h1>
          <p className="font-body text-xl text-gray-600 dark:text-bk-cream/70">
            Select how you'd like to enjoy your meal
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="service-card group relative overflow-hidden rounded-2xl transition-all duration-300"
              >
                {/* Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity`} />
                
                {/* Content */}
                <div className="relative p-8 rounded-2xl border-2 border-gray-200 dark:border-bk-brown-light/30 bg-white dark:bg-bk-dark-2 group-hover:border-bk-red group-hover:shadow-xl dark:group-hover:border-bk-gold transition-all">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Text */}
                  <h2 className="font-heading text-2xl font-bold text-bk-dark dark:text-white mb-2 text-left">
                    {service.title}
                  </h2>
                  <p className="font-body text-gray-600 dark:text-bk-cream/60 text-left">
                    {service.description}
                  </p>

                  {/* Arrow */}
                  <div className="absolute bottom-4 right-4 text-2xl group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="font-body text-sm text-gray-500 dark:text-bk-cream/50">
            You can change this anytime from the menu
          </p>
        </div>
      </div>
    </div>
  );
}
