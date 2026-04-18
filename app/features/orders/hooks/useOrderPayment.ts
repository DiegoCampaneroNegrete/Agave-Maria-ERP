'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  orderPaymentStateAtom,
  outstandingBalanceAtom,
} from '@/features/payments/store';
import { OrderPaymentState, Payment } from '@/features/payments/types';
import {
  calculateOrderTotal,
  calculateOutstandingBalance,
  getPaymentStatus,
} from '@/features/payments/utils/paymentCalculations';
import { createCustomerBalance } from '@/features/payments/service';

/**
 * Hook: Manage payment state for single order
 * Tracks: items, totals, paid amounts, outstanding balance
 * Handles: full payment, partial payment, status transitions
 */
export const useOrderPayment = (orderId: string, orderTotal: number) => {
  const [paymentState, setPaymentState] = useAtom(orderPaymentStateAtom);
  const outstandingBalance = useAtomValue(outstandingBalanceAtom);

  // Initialize payment state
  const ensureInitialized = useCallback(() => {
    if (!paymentState || paymentState.orderId !== orderId) {
      setPaymentState({
        orderId,
        customerId: undefined,
        subtotal: orderTotal,
        discount: 0,
        tax: 0,
        total: orderTotal,
        paidAmount: 0,
        outstandingBalance: orderTotal,
        paymentMethods: [],
        status: 'unpaid',
      });
    }
  }, [orderId, orderTotal, paymentState, setPaymentState]);

  // Set customer for order
  const setCustomer = useCallback(
    (customerId: string) => {
      ensureInitialized();
      setPaymentState(prev => prev ? { ...prev, customerId } : null);
    },
    [ensureInitialized, setPaymentState]
  );

  // Add payment method
  const addPaymentMethod = useCallback(
    (payment: Payment) => {
      ensureInitialized();
      setPaymentState(prev => {
        if (!prev) return null;
        const newMethods = [...prev.paymentMethods, payment];
        const newPaidAmount = newMethods.reduce((sum, p) => sum + p.amount, 0);
        const newOutstanding = calculateOutstandingBalance(prev.total, newPaidAmount);
        const newStatus = getPaymentStatus(prev.total, newPaidAmount);

        return {
          ...prev,
          paymentMethods: newMethods,
          paidAmount: newPaidAmount,
          outstandingBalance: newOutstanding,
          status: newStatus,
        };
      });
    },
    [ensureInitialized, setPaymentState]
  );

  // Remove payment method
  const removePaymentMethod = useCallback(
    (paymentId: string) => {
      setPaymentState(prev => {
        if (!prev) return null;
        const newMethods = prev.paymentMethods.filter(p => p.id !== paymentId);
        const newPaidAmount = newMethods.reduce((sum, p) => sum + p.amount, 0);
        const newOutstanding = calculateOutstandingBalance(prev.total, newPaidAmount);
        const newStatus = getPaymentStatus(prev.total, newPaidAmount);

        return {
          ...prev,
          paymentMethods: newMethods,
          paidAmount: newPaidAmount,
          outstandingBalance: newOutstanding,
          status: newStatus,
        };
      });
    },
    [setPaymentState]
  );

  // Apply discount
  const applyDiscount = useCallback(
    (discountAmount: number) => {
      setPaymentState(prev => {
        if (!prev) return null;
        const newTotal = calculateOrderTotal(
          prev.subtotal,
          0.1, // assume 10% tax
          discountAmount,
          'fixed'
        );
        const newOutstanding = calculateOutstandingBalance(newTotal, prev.paidAmount);

        return {
          ...prev,
          discount: discountAmount,
          total: newTotal,
          outstandingBalance: newOutstanding,
        };
      });
    },
    [setPaymentState]
  );

  // Check if payment complete
  const isPaymentComplete = useCallback((): boolean => {
    return paymentState ? paymentState.status === 'paid' : false;
  }, [paymentState]);

  // Check if payment is partial
  const isPartialPayment = useCallback((): boolean => {
    return paymentState ? paymentState.status === 'partial' : false;
  }, [paymentState]);

  // Create balance record if partial
  const recordPartialBalance = useCallback(
    async (customerId: string): Promise<string | null> => {
      if (!paymentState || !isPartialPayment()) return null;

      try {
        const balanceId = await createCustomerBalance(
          customerId,
          orderId,
          paymentState.outstandingBalance
        );
        return balanceId;
      } catch (err) {
        console.error('Failed to create balance:', err);
        return null;
      }
    },
    [orderId, paymentState, isPartialPayment]
  );

  // Get payment breakdown
  const getBreakdown = useCallback(() => {
    ensureInitialized();
    return {
      subtotal: paymentState?.subtotal || 0,
      discount: paymentState?.discount || 0,
      tax: paymentState?.tax || 0,
      total: paymentState?.total || 0,
      paid: paymentState?.paidAmount || 0,
      outstanding: paymentState?.outstandingBalance || 0,
    };
  }, [paymentState, ensureInitialized]);

  return {
    // State
    state: paymentState,
    outstandingBalance,

    // Actions
    setCustomer,
    addPaymentMethod,
    removePaymentMethod,
    applyDiscount,
    recordPartialBalance,

    // Checks
    isPaymentComplete,
    isPartialPayment,

    // Display
    getBreakdown,
  };
};
