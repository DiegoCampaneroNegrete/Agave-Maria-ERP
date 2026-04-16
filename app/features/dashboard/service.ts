import { getDB } from '@/lib/db';
import { DashboardSummary, TopProduct } from './types';

const today = () => new Date().toISOString().split('T')[0];

export const getSummary = async (): Promise<DashboardSummary> => {
  const db = await getDB();

  const res = await db.query(
    `
    SELECT 
      COUNT(*) as totalOrders,
      SUM(total) as totalSales
    FROM orders
    WHERE DATE(created_at) = ?
    `,
    [today()]
  );

  const row = res[0] || {};

  const totalOrders = Number(row.totalOrders || 0);
  const totalSales = Number(row.totalSales || 0);

  return {
    totalOrders,
    totalSales,
    avgTicket: totalOrders > 0 ? totalSales / totalOrders : 0,
  };
};

export const getTopProducts = async (): Promise<TopProduct[]> => {
  const db = await getDB();

  return await db.query(
    `
    SELECT 
      oi.product_id,
      p.name,
      SUM(oi.quantity) as quantity,
      SUM(oi.quantity * oi.price) as total
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE DATE(o.created_at) = ?
    GROUP BY oi.product_id
    ORDER BY quantity DESC
    LIMIT 5
    `,
    [today()]
  );
};

export const getSalesByMethod = async () => {
  const db = await getDB();

  return await db.query(`
    SELECT 
      payment_method,
      SUM(total) as total
    FROM orders
    WHERE DATE(created_at) = ?
    GROUP BY payment_method
  `, [today()]);
};