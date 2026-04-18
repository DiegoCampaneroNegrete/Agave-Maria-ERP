import { atom } from 'jotai';
import { Payment, PaymentBreakdown, PaymentHistoryItem, PaymentStatus, Customer, CustomerBalance, OrderPaymentState } from './types';

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

// ============================================
// Customer & Balance Management
// ============================================

// Current customer for order
export const currentCustomerAtom = atom<Customer | null>(null);

// Customer balances (for current or selected customer)
export const customerBalancesAtom = atom<CustomerBalance[]>([]);

// Current order payment state
export const orderPaymentStateAtom = atom<OrderPaymentState | null>(null);

// Derived: Outstanding balance for current order
export const outstandingBalanceAtom = atom((get) => {
  const state = get(orderPaymentStateAtom);
  return state ? state.total - state.paidAmount : 0;
});

// Derived: Total outstanding across customer's orders
export const customerTotalOutstandingAtom = atom((get) => {
  const balances = get(customerBalancesAtom);
  return balances.reduce((sum, b) => sum + (b.amount - b.paid_amount), 0);
});

// Derived: Count of pending customer balances
export const pendingBalanceCountAtom = atom((get) => {
  const balances = get(customerBalancesAtom);
  return balances.filter(b => b.status !== 'settled').length;
});
