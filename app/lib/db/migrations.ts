export const migrations = [
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    stock INTEGER,
    created_at TEXT,
    updated_at TEXT,
    synced INTEGER DEFAULT 0
  );`,

  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    total REAL,
    status TEXT,
    created_at TEXT,
    updated_at TEXT,
    synced INTEGER DEFAULT 0
  );`,

  `CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    product_id TEXT,
    quantity INTEGER,
    price REAL
  );`,

  `CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    created_at TEXT,
    updated_at TEXT,
    synced INTEGER DEFAULT 0
  );`
];