export type PaymentMethod = 'cash' | 'card' | 'check' | 'voucher' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'confirmed' | 'failed';

export interface PaymentMetadata {
  reference?: string;
  authCode?: string;
  voucherCode?: string;
  checkNumber?: string;
  notes?: string;
  [key: string]: string | undefined;
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  metadata?: PaymentMetadata;
}

export interface PaymentBreakdown {
  payments: Payment[];
  total: number;
  remaining: number;
  isComplete: boolean;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  metadata?: string; // stored as JSON
  created_at: string;
  updated_at: string;
}

export interface PaymentHistoryItem {
  method: PaymentMethod;
  count: number;
  total: number;
  lastUsed: string;
}

// Checkout flow types
export type CheckoutStage = 'summary' | 'method' | 'input' | 'confirm' | 'receipt';

export interface CashPaymentInput {
  amount: number;
  change: number;
}

export interface CardPaymentInput {
  amount: number;
}

export interface MixedPaymentInput {
  cash: number;
  card: number;
}

export interface CheckoutState {
  stage: CheckoutStage;
  paymentMethod: PaymentMethod | null;
  cashReceived: number;
  cardAmount: number;
  change: number;
  error: string | null;
}

// Customer & Balance types
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerBalance {
  id: string;
  customer_id: string;
  order_id: string;
  amount: number;           // Original outstanding balance
  paid_amount: number;      // Cumulative paid toward balance
  status: 'pending' | 'partial' | 'settled';
  created_at: string;
  updated_at: string;
}

export interface OrderPaymentState {
  orderId: string;
  customerId?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;       // Cumulative paid across all payments
  outstandingBalance: number; // total - paidAmount
  paymentMethods: Payment[];
  status: 'unpaid' | 'partial' | 'paid';
}
