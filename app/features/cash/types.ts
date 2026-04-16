export interface CashSummary {
  totalSales: number;
  totalOrders: number;
}

export interface CashClosing {
  id: string;
  expected: number;
  counted: number;
  difference: number;
  created_at: string;
}

export interface CashBreakdown {
  payment_method: 'cash' | 'card';
  total: number;
}