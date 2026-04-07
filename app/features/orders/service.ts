/* eslint-disable @typescript-eslint/no-explicit-any */
// /features/orders/service.ts

import { getDB } from '@/lib/db';

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

export const getOrders = async () => {
  const db = await getDB();

  return await db.query(`SELECT * FROM orders`);
};