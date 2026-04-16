import { atom } from 'jotai';
import { Payment, PaymentBreakdown, PaymentHistoryItem, PaymentStatus } from './types';

// Current payment session
export const paymentsAtom = atom<Payment[]>([]);

// UI state for payment input
export const paymentUIStateAtom = atom<{
  activeMethod: string | null;
  inputAmount: number | null;
  validationErrors: Record<string, string>;
}>({
  activeMethod: null,
  inputAmount: null,
  validationErrors: {},
});

// Payment history for analytics
export const paymentHistoryAtom = atom<PaymentHistoryItem[]>([]);

// Derived: Total of all current payments
export const paymentTotalAtom = atom((get) =>
  get(paymentsAtom).reduce((sum, payment) => sum + payment.amount, 0)
);

// Derived: Breakdown with calculation
export const paymentBreakdownAtom = atom((get) => {
  const payments = get(paymentsAtom);
  const total = get(paymentTotalAtom);

  // Note: We'll pass orderTotal from component/hook context
  // For now, return structure with 0 remaining (will be updated in checkout)
  const breakdown: PaymentBreakdown = {
    payments,
    total,
    remaining: 0,
    isComplete: false,
  };

  return breakdown;
});

// Derived: Check if payment is complete (updated in hooks with orderTotal)
export const isPaymentCompleteAtom = atom((get) => {
  const payments = get(paymentsAtom);
  return payments.length > 0 && payments.every((p) => p.status !== 'failed');
});

// Payment error state
export const paymentErrorAtom = atom<string | null>(null);

// Payment loading state (for async operations)
export const paymentLoadingAtom = atom(false);
