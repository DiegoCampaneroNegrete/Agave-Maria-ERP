
// export interface OrderItem {
//   id: string;
//   product_id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }


export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface GroupedOrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}