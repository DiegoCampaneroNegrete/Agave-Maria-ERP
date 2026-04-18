'use client';

import { useMemo } from 'react';
import { useCart } from './useCart';

/**
 * Hook to get current order data for checkout
 * Combines cart items with calculated totals (subtotal, tax, total)
 */
export const useOrderStore = () => {
  const { cart, total } = useCart();

  const order = useMemo(() => {
    // Calculate subtotal (before tax)
    const subtotal = total;
    
    // Calculate tax (assuming 10% tax rate - adjust as needed)
    const taxRate = 0.1;
    const tax = Number((subtotal * taxRate).toFixed(2));
    
    // Calculate final total
    const finalTotal = Number((subtotal + tax).toFixed(2));

    return {
      items: cart,
      subtotal: Number(subtotal.toFixed(2)),
      tax,
      total: finalTotal,
    };
  }, [cart, total]);

  return order;
};
