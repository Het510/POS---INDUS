import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { UtensilsCrossed, Users, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const MOCK_TABLES = [
  { _id: 't1', tableNumber: '1', floor: 'Ground Floor', seats: 4, status: 'available' },
  { _id: 't2', tableNumber: '2', floor: 'Ground Floor', seats: 2, status: 'occupied' },
  { _id: 't3', tableNumber: '3', floor: 'Ground Floor', seats: 6, status: 'available' },
  { _id: 't4', tableNumber: '4', floor: 'Ground Floor', seats: 4, status: 'available' },
  { _id: 't5', tableNumber: '5', floor: 'Ground Floor', seats: 4, status: 'reserved' },
  { _id: 't6', tableNumber: '6', floor: 'Ground Floor', seats: 8, status: 'available' },
  { _id: 't7', tableNumber: '7', floor: 'First Floor', seats: 2, status: 'available' },
  { _id: 't8', tableNumber: '8', floor: 'First Floor', seats: 4, status: 'occupied' },
  { _id: 't9', tableNumber: '9', floor: 'First Floor', seats: 6, status: 'available' },
];

export default function DineInPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setOrderType, setTableId, setTableNumber } = useCart();
  const { isDark } = useTheme();
  const [tables, setTables] = useState(MOCK_TABLES);
  const [activeFloor, setActiveFloor] = useState('Ground Floor');
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    if (token) {
      // QR scan flow - auto select table
      setOrderType('dine-in');
      toast.success('✅ QR Code scanned successfully! 🍽️');
      setTimeout(() => navigate('/menu'), 1500);
      return;
    }

    setLoading(false);
    setTables(MOCK_TABLES);
  }, [token]);

  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo('.table-card', { scale: 0.8, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.3)'
      });
    }
  }, [loading, activeFloor]);

  const floors = [...new Set(tables.map(t => t.floor))];
  const filteredTables = tables.filter(t => t.floor === activeFloor);

  const selectTable = (table) => {
    if (table.status === 'occupied') return toast.error('Table is currently occupied');
    if (table.status === 'reserved') return toast.error('Table is reserved');
    setSelectedTable(table);
  };

  const confirmTable = () => {
    setOrderType('dine-in');
    setTableId(selectedTable._id);
    setTableNumber(selectedTable.tableNumber);
    toast.success(`Table ${selectedTable.tableNumber} selected! 🍽️`);
    navigate('/menu');
  };

  const statusConfig = {
    available: {
      border: isDark ? 'border-green-500/50 hover:border-green-400' : 'border-green-400 hover:border-green-500',
      bg: isDark ? 'bg-green-900/10 hover:bg-green-900/20' : 'bg-green-50 hover:bg-green-100',
      badge: isDark ? 'text-green-400' : 'text-green-600',
      label: '✓ Available'
    },
    occupied: {
      border: 'border-red-500/40 opacity-60',
      bg: isDark ? 'bg-red-900/10' : 'bg-red-50',
      badge: isDark ? 'text-red-400' : 'text-red-600',
      label: '✗ Occupied'
    },
    reserved: {
      border: isDark ? 'border-yellow-500/40' : 'border-yellow-400',
      bg: isDark ? 'bg-yellow-900/10' : 'bg-yellow-50',
      badge: isDark ? 'text-yellow-400' : 'text-yellow-600',
      label: '⏰ Reserved'
    },
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-bk-dark' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gradient-to-b from-bk-dark-2 to-bk-dark' : 'bg-gradient-to-b from-white to-slate-50'} pt-8 pb-10 px-4 border-b ${isDark ? 'border-bk-brown-light/20' : 'border-gray-200'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-full ${isDark ? 'bg-bk-gold/20' : 'bg-bk-red/20'}`}>
              <UtensilsCrossed size={28} className={isDark ? 'text-bk-gold' : 'text-bk-red'} />
            </div>
            <h1 className={`font-heading text-4xl font-black ${isDark ? 'text-bk-yellow' : 'text-bk-red'}`}>
              DINE IN
            </h1>
          </div>
          <p className={`font-body text-sm ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
            Select your table to start ordering
          </p>

          {/* Floor tabs */}
          <div className="flex gap-3 mt-6">
            {(floors.length > 0 ? floors : ['Ground Floor', 'First Floor']).map(floor => (
              <button key={floor} onClick={() => setActiveFloor(floor)}
                className={`px-6 py-3 rounded-full font-heading font-bold text-sm transition-all ${
                  activeFloor === floor
                    ? isDark ? 'bg-bk-yellow text-bk-dark' : 'bg-bk-red text-white'
                    : isDark ? 'bg-bk-dark-2 border border-bk-brown-light/30 text-bk-cream/70 hover:border-bk-gold/30' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
                <MapPin size={16} className="inline mr-2" />
                {floor}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-32 rounded-2xl ${isDark ? 'bg-bk-dark-2' : 'bg-gray-200'} shimmer`} />
            ))}
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTables.map(table => {
              const config = statusConfig[table.status];
              const isDisabled = table.status !== 'available';
              
              return (
                <button key={table._id}
                  onClick={() => !isDisabled && selectTable(table)}
                  disabled={isDisabled}
                  className={`table-card rounded-2xl p-6 border-2 transition-all cursor-pointer group ${
                    selectedTable?._id === table._id
                      ? isDark ? 'border-bk-gold bg-bk-dark-2 ring-2 ring-bk-gold' : 'border-bk-red bg-red-50 ring-2 ring-bk-red'
                      : `border-current ${config.bg} ${config.border}`
                  } ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}>
                  
                  <div className="text-center">
                    {/* Table Number */}
                    <div className={`font-heading text-3xl font-black mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                      {table.tableNumber}
                    </div>

                    {/* Table Status */}
                    <div className={`text-xs font-heading font-bold mb-3 ${config.badge}`}>
                      {config.label}
                    </div>

                    {/* Seats Info */}
                    <div className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-bk-cream/70' : 'text-gray-600'}`}>
                      <Users size={16} />
                      <span className="font-body">{table.seats} Seats</span>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTable?._id === table._id && (
                      <div className="mt-4 flex justify-center">
                        <CheckCircle size={24} className={isDark ? 'text-bk-gold' : 'text-bk-red'} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8 border ${
            isDark ? 'bg-bk-dark-2 border-bk-gold/20' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`font-heading text-2xl font-bold mb-2 ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
              Confirm Table
            </h3>
            <p className={`font-body mb-6 ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>
              You're about to order at Table {selectedTable.tableNumber}
            </p>

            <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-bk-dark border border-bk-brown-light/30' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`text-xs font-heading uppercase ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>Floor</div>
                  <div className={`text-lg font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                    {selectedTable.floor}
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-heading uppercase ${isDark ? 'text-bk-cream/50' : 'text-gray-600'}`}>Capacity</div>
                  <div className={`text-lg font-bold ${isDark ? 'text-bk-cream' : 'text-gray-900'}`}>
                    {selectedTable.seats} Seats
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedTable(null)}
                className={`flex-1 py-3 rounded-lg font-heading font-bold transition-all ${
                  isDark
                    ? 'bg-bk-dark border border-bk-brown-light/30 text-bk-cream hover:border-bk-gold/50'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}>
                Cancel
              </button>
              <button onClick={confirmTable}
                className={`flex-1 py-3 rounded-lg font-heading font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-gold-gradient text-bk-dark hover:shadow-gold'
                    : 'bg-bk-red text-white hover:bg-red-600'
                }`}>
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
