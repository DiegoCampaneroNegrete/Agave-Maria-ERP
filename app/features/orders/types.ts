// /features/orders/types.ts

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  total: number;
  status: 'OPEN' | 'PAID';
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}