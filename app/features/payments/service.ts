import { getDB } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { Payment, PaymentRecord, PaymentMethod, Customer, CustomerBalance } from './types';

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

// ============================================
// Customer Management
// ============================================

/**
 * Create customer
 */
export const createCustomer = async (name: string, phone?: string, email?: string): Promise<string> => {
  const db = await getDB();
  const id = uuid();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO customers (id, name, phone, email, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, phone || null, email || null, now, now]
  );

  return id;
};

/**
 * Get customer by ID
 */
export const getCustomer = async (customerId: string): Promise<Customer | null> => {
  const db = await getDB();
  const rows = await db.query(`SELECT * FROM customers WHERE id = ?`, [customerId]);
  return rows[0] || null;
};

/**
 * Find customer by phone or email
 */
export const findCustomer = async (phone?: string, email?: string): Promise<Customer | null> => {
  const db = await getDB();

  if (phone) {
    const rows = await db.query(`SELECT * FROM customers WHERE phone = ? LIMIT 1`, [phone]);
    if (rows.length > 0) return rows[0];
  }

  if (email) {
    const rows = await db.query(`SELECT * FROM customers WHERE email = ? LIMIT 1`, [email]);
    if (rows.length > 0) return rows[0];
  }

  return null;
};

/**
 * Update customer
 */
export const updateCustomer = async (
  customerId: string,
  updates: Partial<{ name: string; phone: string; email: string }>
): Promise<void> => {
  const db = await getDB();
  const now = new Date().toISOString();
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(updates), now, customerId];

  await db.run(
    `UPDATE customers SET ${fields}, updated_at = ? WHERE id = ?`,
    values
  );
};

// ============================================
// Customer Balance Management
// ============================================

/**
 * Create customer balance record
 */
export const createCustomerBalance = async (
  customerId: string,
  orderId: string,
  amount: number
): Promise<string> => {
  const db = await getDB();
  const id = uuid();
  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO customer_balances (id, customer_id, order_id, amount, paid_amount, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, customerId, orderId, amount, 0, 'pending', now, now]
  );

  return id;
};

/**
 * Get customer balances (all outstanding)
 */
export const getCustomerBalances = async (customerId: string): Promise<CustomerBalance[]> => {
  const db = await getDB();

  return await db.query(
    `SELECT * FROM customer_balances 
     WHERE customer_id = ? AND status != 'settled'
     ORDER BY created_at DESC`,
    [customerId]
  );
};

/**
 * Get balance for specific order
 */
export const getOrderBalance = async (orderId: string): Promise<CustomerBalance | null> => {
  const db = await getDB();
  const rows = await db.query(
    `SELECT * FROM customer_balances WHERE order_id = ?`,
    [orderId]
  );
  return rows[0] || null;
};

/**
 * Update balance (record payment)
 */
export const recordBalancePayment = async (
  balanceId: string,
  paymentAmount: number
): Promise<void> => {
  const db = await getDB();
  const now = new Date().toISOString();

  // Get current balance
  const rows = await db.query(
    `SELECT amount, paid_amount FROM customer_balances WHERE id = ?`,
    [balanceId]
  );

  if (!rows[0]) throw new Error('Balance not found');

  const { amount, paid_amount } = rows[0];
  const newPaidAmount = Math.min(paid_amount + paymentAmount, amount);
  const newStatus = newPaidAmount >= amount ? 'settled' : 'partial';

  await db.run(
    `UPDATE customer_balances SET paid_amount = ?, status = ?, updated_at = ? WHERE id = ?`,
    [newPaidAmount, newStatus, now, balanceId]
  );
};

/**
 * Get total outstanding balance for customer
 */
export const getCustomerTotalOutstanding = async (customerId: string): Promise<number> => {
  const db = await getDB();
  const rows = await db.query(
    `SELECT SUM(amount - paid_amount) as total 
     FROM customer_balances 
     WHERE customer_id = ? AND status != 'settled'`,
    [customerId]
  );

  return rows[0]?.total || 0;
};

/**
 * Settle outstanding balance (after payment)
 */
export const settleCustomerBalance = async (
  balanceId: string,
  orderId: string
): Promise<void> => {
  const db = await getDB();
  const now = new Date().toISOString();

  // Mark balance settled
  await db.run(
    `UPDATE customer_balances SET status = 'settled', updated_at = ? WHERE id = ?`,
    [now, balanceId]
  );

  // Update order to PAID
  await markOrderAsPaid(orderId);
};

/**
 * Get payment history for customer
 */
export const getCustomerPaymentHistory = async (customerId: string): Promise<PaymentRecord[]> => {
  const db = await getDB();

  return await db.query(
    `SELECT p.* FROM payments p
     JOIN orders o ON p.order_id = o.id
     WHERE o.customer_id = ?
     ORDER BY p.created_at DESC`,
    [customerId]
  );
};
