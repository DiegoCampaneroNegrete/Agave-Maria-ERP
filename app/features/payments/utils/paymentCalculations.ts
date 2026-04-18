/**
 * Payment calculation utilities
 * Pure functions for tax, discounts, totals, balance tracking
 */

/**
 * Calculate tax on subtotal
 */
export const calculateTax = (subtotal: number, taxRate: number = 0.1): number => {
  const tax = subtotal * taxRate;
  return Math.round(tax * 100) / 100; // Round to 2 decimals
};

/**
 * Apply discount to subtotal
 */
export const applyDiscount = (
  subtotal: number,
  discountType: 'fixed' | 'percent',
  discountValue: number
): number => {
  if (discountValue <= 0) return 0;

  if (discountType === 'fixed') {
    return Math.min(discountValue, subtotal); // Don't exceed subtotal
  }

  if (discountType === 'percent') {
    const discount = (subtotal * discountValue) / 100;
    return Math.min(discount, subtotal);
  }

  return 0;
};

/**
 * Calculate final order total
 */
export const calculateOrderTotal = (
  subtotal: number,
  taxRate: number = 0.1,
  discountValue: number = 0,
  discountType: 'fixed' | 'percent' = 'fixed'
): number => {
  const discount = applyDiscount(subtotal, discountType, discountValue);
  const afterDiscount = subtotal - discount;
  const tax = calculateTax(afterDiscount, taxRate);
  const total = afterDiscount + tax;

  return Math.round(total * 100) / 100;
};

/**
 * Calculate outstanding balance
 * @returns max(0, total - paid) to prevent negative balances
 */
export const calculateOutstandingBalance = (total: number, paidAmount: number): number => {
  const remaining = total - paidAmount;
  return Math.max(0, Math.round(remaining * 100) / 100);
};

/**
 * Check if partial payment is valid
 * @returns true if 0 < amount <= outstanding
 */
export const isValidPartialPayment = (
  partialAmount: number,
  outstandingBalance: number
): boolean => {
  return partialAmount > 0 && partialAmount <= outstandingBalance;
};

/**
 * Determine payment status based on amounts
 */
export const getPaymentStatus = (
  total: number,
  paidAmount: number
): 'unpaid' | 'partial' | 'paid' => {
  if (paidAmount <= 0) return 'unpaid';
  if (paidAmount >= total) return 'paid';
  return 'partial';
};

/**
 * Determine balance status
 */
export const getBalanceStatus = (
  amount: number,
  paidAmount: number
): 'pending' | 'partial' | 'settled' => {
  if (paidAmount <= 0) return 'pending';
  if (paidAmount >= amount) return 'settled';
  return 'partial';
};

/**
 * Calculate total outstanding across multiple balances
 */
export const calculateTotalOutstanding = (
  balances: Array<{ amount: number; paid_amount: number }>
): number => {
  const total = balances.reduce((sum, b) => sum + (b.amount - b.paid_amount), 0);
  return Math.round(total * 100) / 100;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Check if amount can be paid with given payment method
 * (Placeholder for payment processor limits)
 */
export const canPayWithMethod = (
  amount: number,
  method: 'cash' | 'card' | 'mixed'
): boolean => {
  // Cash: no limit (assuming POS has cash drawer)
  if (method === 'cash') return true;

  // Card: typical limit per transaction
  if (method === 'card') return amount > 0;

  // Mixed: both must be valid
  if (method === 'mixed') return amount > 0;

  return false;
};

/**
 * Split payment between methods (for mixed payments)
 */
export const splitPayment = (
  total: number,
  cashAmount: number
): { cash: number; card: number } => {
  const cash = Math.min(cashAmount, total);
  const card = Math.max(0, total - cash);

  return {
    cash: Math.round(cash * 100) / 100,
    card: Math.round(card * 100) / 100,
  };
};
