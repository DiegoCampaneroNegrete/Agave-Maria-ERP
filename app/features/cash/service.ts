import { getDB } from '@/lib/db';
import { CashSummary } from './types';

const today = () => new Date().toISOString().split('T')[0];

export const getCashSummary = async (): Promise<CashSummary> => {
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

  return {
    totalOrders: Number(row.totalOrders || 0),
    totalSales: Number(row.totalSales || 0),
  };
};

export const saveCashClosing = async (
  expected: number,
  counted: number
) => {
  const db = await getDB();

  const difference = counted - expected;
  const now = new Date().toISOString();

  await db.run(
    `
    INSERT INTO cash_closings 
    (id, expected, counted, difference, created_at)
    VALUES (?, ?, ?, ?, ?)
    `,
    [crypto.randomUUID(), expected, counted, difference, now]
  );
};

export const getCashBreakdown = async () => {
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