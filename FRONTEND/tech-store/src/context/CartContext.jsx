import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('techstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('techstore_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, product.stock);
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: newQty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.min(qty, item.stock) } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [items]);

  const count = useMemo(() => {
    return items.reduce((acc, item) => acc + item.qty, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}