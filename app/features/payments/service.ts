import { getDB } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { Payment, PaymentRecord, PaymentMethod } from './types';

/**
 * Create a payment record in the database
 */
export const createPayment = async (
  orderId: string,
  payment: Payment
): Promise<string> => {
  const db = await getDB();
  const id = uuid();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO payments (id, order_id, method, amount, status, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      orderId,
      payment.method,
      payment.amount,
      payment.status,
      payment.metadata ? JSON.stringify(payment.metadata) : null,
      now,
      now,
    ]
  );

  return id;
};

/**
 * Create multiple payments for an order
 */
export const createPayments = async (
  orderId: string,
  payments: Payment[]
): Promise<string[]> => {
  const ids: string[] = [];

  for (const payment of payments) {
    const id = await createPayment(orderId, payment);
    ids.push(id);
  }

  return ids;
};

/**
 * Get all payments for an order
 */
export const getOrderPayments = async (orderId: string): Promise<PaymentRecord[]> => {
  const db = await getDB();

  const rows = await db.query(
    `SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC`,
    [orderId]
  );

  return rows.map((row) => ({
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
  }));
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: string
): Promise<void> => {
  const db = await getDB();
  const now = new Date().toISOString();

  await db.run(
    `UPDATE payments SET status = ?, updated_at = ? WHERE id = ?`,
    [status, now, paymentId]
  );
};

/**
 * Get total by payment method for date range
 */
export const getPaymentTotalByMethod = async (
  method: PaymentMethod,
  startDate?: string,
  endDate?: string
): Promise<number> => {
  const db = await getDB();

  let query = `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE method = ? AND status = 'confirmed'`;
  const params: (string | PaymentMethod)[] = [method];

  if (startDate) {
    query += ` AND created_at >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND created_at <= ?`;
    params.push(endDate);
  }

  const result = await db.query(query, params);
  return result[0]?.total ?? 0;
};

/**
 * Get payment summary for a date range
 */
export const getPaymentSummary = async (startDate?: string, endDate?: string) => {
  const db = await getDB();

  let query = `SELECT method, COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
               FROM payments WHERE status = 'confirmed'`;
  const params: string[] = [];

  if (startDate) {
    query += ` AND created_at >= ?`;
    params.push(startDate);
  }

  if (endDate) {
    query += ` AND created_at <= ?`;
    params.push(endDate);
  }

  query += ` GROUP BY method ORDER BY total DESC`;

  const result = await db.query(query, params);
  return result;
};

/**
 * Delete payment (for corrections)
 */
export const deletePayment = async (paymentId: string): Promise<void> => {
  const db = await getDB();

  await db.run(`DELETE FROM payments WHERE id = ?`, [paymentId]);
};

/**
 * Update order to mark as paid
 */
export const markOrderAsPaid = async (orderId: string): Promise<void> => {
  const db = await getDB();
  const now = new Date().toISOString();

  await db.run(
    `UPDATE orders SET status = ?, payment_status = ?, updated_at = ? WHERE id = ?`,
    ['PAID', 'PAID', now, orderId]
  );
};
