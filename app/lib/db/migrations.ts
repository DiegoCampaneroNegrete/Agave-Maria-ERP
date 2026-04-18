export const migrations = [
  `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    created_at TEXT,
    updated_at TEXT,
    synced INTEGER DEFAULT 0
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    total REAL,
    status TEXT,
    payment_status TEXT DEFAULT 'PENDING',
    created_at TEXT,
    updated_at TEXT,
    payment_method TEXT,
    synced INTEGER DEFAULT 0
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    product_id TEXT,
    quantity INTEGER,
    price REAL
  );

  CREATE TABLE IF NOT EXISTS cash_closings (
    id TEXT PRIMARY KEY,
    expected REAL,
    counted REAL,
    difference REAL,
    created_at TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    method TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    metadata TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
  CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);
  CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
  `,
  `
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  `,
  `
  ALTER TABLE orders ADD COLUMN customer_id TEXT;
  CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
  `,
  `
  CREATE TABLE IF NOT EXISTS customer_balances (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    amount REAL NOT NULL,
    paid_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
  `,
  `
  CREATE INDEX IF NOT EXISTS idx_customer_balances_customer_id ON customer_balances(customer_id);
  CREATE INDEX IF NOT EXISTS idx_customer_balances_order_id ON customer_balances(order_id);
  CREATE INDEX IF NOT EXISTS idx_customer_balances_status ON customer_balances(status);
  `
];