import { getDB } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export const getProducts = async () => {
  const db = await getDB();
  return await db.query(`SELECT * FROM products`);
};

export const createProduct = async (data: { name: string; price: number }) => {
  const db = await getDB();

  const now = new Date().toISOString();

  await db.run(
    `INSERT INTO products (id, name, price, created_at, updated_at, synced)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [uuid(), data.name, data.price, now, now]
  );
};