import { OrderItem, GroupedOrderItem } from '../types';

export const groupItems = (
  items: OrderItem[]
): GroupedOrderItem[] => {
  const map = new Map<string, GroupedOrderItem>();

  for (const item of items) {
    const existing = map.get(item.product_id);

    if (existing) {
      existing.quantity += item.quantity;
      existing.subtotal += item.quantity * item.price;
    } else {
      map.set(item.product_id, {
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      });
    }
  }

  return Array.from(map.values());
};