import { getDB } from './index';
import { v4 as uuid } from 'uuid';

export const seedProducts = async () => {
  const db = await getDB();

  const existing = await db.query('SELECT * FROM products');

  if (existing.length > 0) return;

  const now = new Date().toISOString();

  const products = [
    { name: 'Cerveza', price: 50 },
    { name: 'Tequila', price: 80 },
    { name: 'Mezcal', price: 90 },
  ];

  for (const p of products) {
    await db.run(
      `INSERT INTO products (id, name, price, created_at, updated_at, synced)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [uuid(), p.name, p.price, now, now]
    );
  }

  console.log('🌱 Productos sembrados');
};