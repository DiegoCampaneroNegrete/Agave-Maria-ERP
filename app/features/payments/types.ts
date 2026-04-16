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
