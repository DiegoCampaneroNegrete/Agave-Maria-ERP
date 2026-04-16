'use client';

import { useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { paymentsAtom } from '../store';
import {
  createPayments,
  markOrderAsPaid,
} from '../service';
import { usePaymentHistory } from './usePaymentHistory';
import { useToast } from '@/hooks/useToast';

/**
 * Hook that handles the complete payment checkout flow
 * Orchestrates: validation, UI, DB operations, and history tracking
 */
export const usePaymentCheckout = () => {
  const [payments, setPayments] = useAtom(paymentsAtom);
  const { addToHistory } = usePaymentHistory();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  /**
   * Process the payment: save to DB and update order status
   */
  const processPayment = useCallback(
    async (orderId: string): Promise<boolean> => {
      if (payments.length === 0) {
        addToast('No hay pagos registrados', 'error');
        return false;
      }

      setLoading(true);

      try {
        // Save all payments to database
        await createPayments(orderId, payments);

        // Mark order as paid
        await markOrderAsPaid(orderId);

        // Add payments to history
        payments.forEach((payment) => {
          addToHistory(payment);
        });

        // Success feedback
        addToast(`✓ Orden pagada (${payments.length} método(s))`, 'success');

        // Clear payments from atom
        setPayments([]);

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al procesar pago';
        addToast(`Error: ${errorMessage}`, 'error');
        console.error('Payment processing error:', error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [payments, setPayments, addToHistory, addToast]
  );

  /**
   * Cancel current payment session
   */
  const cancelPayment = useCallback(() => {
    setPayments([]);
    addToast('Pago cancelado', 'info');
  }, [setPayments, addToast]);

  return {
    processPayment,
    cancelPayment,
    loading,
    hasPayments: payments.length > 0,
  };
};
