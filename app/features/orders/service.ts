/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDB } from '@/lib/db';
import { Order, OrderItem } from './types';
import { applyInventoryForOrder } from '../inventory/service';

export const createOrderWithItems = async (orderId: string, items: any[]) => {
  const db = await getDB();

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const now = new Date().toISOString();

  // Orden
  await db.run(
    `INSERT INTO orders (id, total, status, created_at, updated_at, synced)
     VALUES (?, ?, 'PAID', ?, ?, 0)`,
    [orderId, total, now, now]
  );

  // Items
  for (const item of items) {
    await db.run(
      `INSERT INTO order_items (id, order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?, ?)`,
      [item.id, orderId, item.product_id, item.quantity, item.price]
    );
    // await decreaseStock(item.product_id, item.quantity);
    await applyInventoryForOrder(items);
  }
};

export const createOrder = async (order: any) => {
  const db = await getDB();

  await db.run(
    `INSERT INTO orders (id, total, status, created_at)
     VALUES (?, ?, ?, ?)`,
    [order.id, order.total, order.status, order.created_at]
  );
};

export const getOrders = async (): Promise<Order[]> => {
  const db = await getDB();

  return await db.query(`
    SELECT * FROM orders
    ORDER BY created_at DESC
  `);
};

export const getOrderItems = async (
  orderId: string
): Promise<OrderItem[]> => {
  const db = await getDB();

  return await db.query(
    `
    SELECT 
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.quantity,
      oi.price,
      p.name
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
    `,
    [orderId]
  );
};