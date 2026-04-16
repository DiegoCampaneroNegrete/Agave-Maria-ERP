'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { paymentHistoryAtom } from '../store';
import { Payment, PaymentMethod } from '../types';

/**
 * Hook for managing payment history and analytics
 */
export const usePaymentHistory = () => {
  const [history, setHistory] = useAtom(paymentHistoryAtom);

  /**
   * Add payment to history
   */
  const addToHistory = useCallback(
    (payment: Payment) => {
      setHistory((prev) => {
        const existing = prev.find((h) => h.method === payment.method);

        if (existing) {
          return prev.map((h) =>
            h.method === payment.method
              ? {
                  ...h,
                  count: h.count + 1,
                  total: h.total + payment.amount,
                  lastUsed: new Date().toISOString(),
                }
              : h
          );
        }

        return [
          ...prev,
          {
            method: payment.method,
            count: 1,
            total: payment.amount,
            lastUsed: new Date().toISOString(),
          },
        ];
      });
    },
    [setHistory]
  );

  /**
   * Get history for a specific payment method
   */
  const getByMethod = useCallback(
    (method: PaymentMethod) => {
      return history.find((h) => h.method === method);
    },
    [history]
  );

  /**
   * Get all history
   */
  const getAll = useCallback(() => {
    return history;
  }, [history]);

  /**
   * Clear history (useful for daily closing)
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  /**
   * Get total by method
   */
  const getTotalByMethod = useCallback(
    (method: PaymentMethod): number => {
      return getByMethod(method)?.total ?? 0;
    },
    [getByMethod]
  );

  /**
   * Get count by method
   */
  const getCountByMethod = useCallback(
    (method: PaymentMethod): number => {
      return getByMethod(method)?.count ?? 0;
    },
    [getByMethod]
  );

  return {
    history,
    addToHistory,
    getByMethod,
    getAll,
    clearHistory,
    getTotalByMethod,
    getCountByMethod,
  };
};
