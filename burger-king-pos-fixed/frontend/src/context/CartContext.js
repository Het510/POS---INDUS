import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bk_cart') || '[]'); } catch { return []; }
  });
  const [orderType, setOrderType] = useState('dine-in');
  const [tableId, setTableId] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    localStorage.setItem('bk_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, variant = null, customizations = []) => {
    const key = `${product._id}-${variant || 'default'}-${customizations.join(',')}`;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        toast.success(`${product.name} quantity updated`);
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      toast.success(`${product.name} added to cart 🍔`);
      return [...prev, {
        key,
        product: product._id,
        name: product.name,
        price: variant ? (product.variants?.find(v => v.name === variant)?.price || product.basePrice) : product.basePrice,
        imageEmoji: product.imageEmoji,
        image: product.image,
        isVeg: product.isVeg,
        quantity,
        variant,
        customizations,
      }];
    });
  };

  const removeItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) return removeItem(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('bk_cart');
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, orderType, setOrderType,
      tableId, setTableId, tableNumber, setTableNumber,
      addItem, removeItem, updateQuantity, clearCart,
      subtotal, itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
