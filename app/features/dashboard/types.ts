export interface DashboardSummary {
  totalSales: number;
  totalOrders: number;
  avgTicket: number;
}

export interface TopProduct {
  product_id: string;
  name: string;
  quantity: number;
  total: number;
}

export interface SalesByMethod {
  payment_method: 'cash' | 'card';
  total: number;
}