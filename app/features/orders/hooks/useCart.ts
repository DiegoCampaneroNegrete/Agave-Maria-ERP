'use client';

import { useEffect, useState } from 'react';
import {
  saveCart,
  loadCart,
  clearCartStorage,
} from '../storage';
import { CartItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const add = (product: Omit<CartItem, 'qty'>) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);

      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const remove = (id: string) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const increase = (id: string) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      )
    );
  };

  const decrease = (id: string) => {
    setCart(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter(p => p.qty > 0)
    );
  };

  const clear = () => {
    setCart([]);
    clearCartStorage();
  };

  const total = cart.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );

  return {
    cart,
    add,
    remove,
    increase,
    decrease,
    clear,
    total,
  };
};