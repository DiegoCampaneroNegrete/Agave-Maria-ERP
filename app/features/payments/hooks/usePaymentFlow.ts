'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import {
  paymentsAtom,
  paymentUIStateAtom,
  paymentErrorAtom,
  paymentLoadingAtom,
} from '../store';
import { Payment, PaymentMethod, PaymentMetadata, PaymentBreakdown } from '../types';
import { validateNewPayment, validatePaymentComplete } from '../utils/validators';

/**
 * Core hook for managing payment flow
 * Handles: add, remove, update, and confirm payments
 */
export const usePaymentFlow = (orderTotal: number) => {
  const [payments, setPayments] = useAtom(paymentsAtom);
  const [uiState, setUIState] = useAtom(paymentUIStateAtom);
  const [error, setError] = useAtom(paymentErrorAtom);
  const [loading, setLoading] = useAtom(paymentLoadingAtom);

  // Calculate current totals
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = orderTotal - total;

  /**
   * Add a new payment to the current session
   */
  const addPayment = useCallback(
    (method: PaymentMethod, amount: number, metadata?: PaymentMetadata) => {
      // Validate payment
      const validationError = validateNewPayment(
        amount,
        method,
        remaining,
        payments,
        metadata
      );

      if (validationError) {
        setError(validationError.message);
        return false;
      }

      // Create new payment
      const newPayment: Payment = {
        id: uuid(),
        method,
        amount: Number(amount.toFixed(2)), // Round to 2 decimals
        status: 'confirmed',
        metadata,
      };

      setPayments((prev) => [...prev, newPayment]);
      setError(null);

      // Clear UI state
      setUIState({
        activeMethod: null,
        inputAmount: null,
        validationErrors: {},
      });

      return true;
    },
    [payments, orderTotal, remaining, setPayments, setUIState, setError]
  );

  /**
   * Remove a payment by ID
   */
  const removePayment = useCallback(
    (paymentId: string) => {
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      setError(null);
    },
    [setPayments, setError]
  );

  /**
   * Update a payment's amount or metadata
   */
  const updatePayment = useCallback(
    (paymentId: string, amount?: number, metadata?: PaymentMetadata) => {
      setPayments((prev) =>
        prev.map((p) => {
          if (p.id !== paymentId) return p;

          const newAmount = amount !== undefined ? Number(amount.toFixed(2)) : p.amount;

          return {
            ...p,
            amount: newAmount,
            metadata: metadata || p.metadata,
          };
        })
      );
    },
    [setPayments]
  );

  /**
   * Clear all payments
   */
  const clearPayments = useCallback(() => {
    setPayments([]);
    setUIState({
      activeMethod: null,
      inputAmount: null,
      validationErrors: {},
    });
    setError(null);
  }, [setPayments, setUIState, setError]);

  /**
   * Validate that payment is complete
   */
  const validateComplete = useCallback((): boolean => {
    const validationError = validatePaymentComplete(payments, orderTotal);
    if (validationError) {
      setError(validationError.message);
      return false;
    }
    return true;
  }, [payments, orderTotal, setError]);

  /**
   * Confirm all payments (final validation before save)
   */
  const confirmPayments = useCallback(async (): Promise<boolean> => {
    setLoading(true);

    try {
      if (!validateComplete()) {
        return false;
      }

      // All validations passed, payments are ready to be saved
      setError(null);
      return true;
    } finally {
      setLoading(false);
    }
  }, [validateComplete, setLoading, setError]);

  /**
   * Get current payment breakdown
   */
  const getPaymentBreakdown = useCallback((): PaymentBreakdown => {
    return {
      payments,
      total,
      remaining: Math.round(remaining * 100) / 100, // Round to 2 decimals
      isComplete: remaining <= 0.01, // Allow 1 cent tolerance
    };
  }, [payments, total, remaining]);

  /**
   * Set active payment method in UI
   */
  const setActiveMethod = useCallback(
    (method: PaymentMethod | null) => {
      setUIState((prev) => ({
        ...prev,
        activeMethod: method,
      }));
    },
    [setUIState]
  );

  /**
   * Set input amount in UI
   */
  const setInputAmount = useCallback(
    (amount: number | null) => {
      setUIState((prev) => ({
        ...prev,
        inputAmount: amount,
      }));
    },
    [setUIState]
  );

  return {
    // State
    payments,
    total,
    remaining,
    orderTotal,
    error,
    loading,
    uiState,

    // Actions
    addPayment,
    removePayment,
    updatePayment,
    clearPayments,
    confirmPayments,
    getPaymentBreakdown,
    setActiveMethod,
    setInputAmount,
    setError,

    // Derived
    hasPayments: payments.length > 0,
    isPaymentComplete: remaining <= 0.01,
  };
};
