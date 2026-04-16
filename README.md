# 🍺 Agave María POS

## 📌 Overview

Agave María POS is a modern **Point of Sale system for bars**, designed to run on **Android (via Capacitor)** and web.

It is built with:

* Next.js (App Router)
* TypeScript
* TailwindCSS (Dark Mode Only)
* SQLite (via Capacitor)
* Mock DB for web development

---

# 🧠 Architecture Philosophy

This project follows a **feature-based modular architecture**:

```
/features
  /products
  /orders
  /cash
  /dashboard
```

Each feature contains:

* `types.ts` → Domain models
* `service.ts` → DB access
* `hooks/` → State + logic
* `components/` → UI

---

# 🧱 Core Modules

## 1. 🛒 Products

Manages product catalog.

**Capabilities:**

* Create products
* List products
* Used by POS

---

## 2. 🧾 Orders (POS)

Main selling interface.

**Flow:**

1. Select products
2. Add to cart
3. Choose payment method
4. Checkout

**Key Concepts:**

* Cart is persisted (localStorage)
* Orders stored in DB
* Order items normalized

---

## 3. 💳 Payments

Supported methods:

```ts
export type PaymentMethod = 'cash' | 'card';
```

Used in:

* Orders
* Dashboard
* Cash Closing

---

## 4. 📊 Dashboard

Daily business insights:

* Total sales
* Total orders
* Average ticket
* Top products
* Sales by payment method

---

## 5. 💰 Cash Closing

Validates physical cash vs system.

**Important Rule:**

```
Cash Closing ONLY compares CASH sales
```

Example:

```
Total Sales: $1000
Cash: $600
Card: $400

Counted: $580

Difference = 580 - 600 = -20
```

---

# 💾 Database Design

## Tables

### products

```
id
name
price
created_at
updated_at
```

---

### orders

```
id
total
status
payment_method
created_at
updated_at
synced
```

---

### order_items

```
id
order_id
product_id
quantity
price
```

---

### cash_closings

```
id
expected
counted
difference
created_at
```

---

# 🔄 Data Flow

### POS Flow

```
UI → Hook → Service → DB
```

### Example:

```
ProductGrid → useCart → checkout → service → SQLite
```

---

# 🧩 State Management

* Local React state (hooks)
* No global store (yet)
* Cart persisted via localStorage

---

# 🌐 Persistence Strategy

| Environment | Storage      |
| ----------- | ------------ |
| Web         | localStorage |
| Android     | SQLite       |

---

# 🎨 UI System

Dark mode only.

### Design tokens:

* `bg-app-bg`
* `bg-app-card`
* `text-app-text`
* `text-app-muted`
* `bg-app-primary`

### Components:

* Button
* Input
* Card

---

# 📱 Mobile Considerations

* Large touch targets
* Vertical layouts
* Minimal modals
* Fast interactions

---

# ⚙️ Development Setup

## Install

```
npm install
```

## Run

```
npm run dev
```

## Android

```
npx cap add android
npx cap sync
```

---

# 🧪 Mock DB

Used for web development.

* Simulates SQLite
* May require manual JOIN logic

---

# 🚀 Future Roadmap

## High Priority

* Payment split (cash + card)
* Users & roles
* Order history filters
* Ticket printing

## Advanced

* Sync with backend
* Offline-first strategy
* Analytics dashboard

---

# 🤖 AI Agent Guidelines

When interacting with this project:

1. Always respect feature boundaries
2. Use existing types before creating new ones
3. Prefer hooks for logic
4. Never mix UI with DB logic
5. Maintain TypeScript strictness

---

# 📌 Conventions

## Naming

* camelCase for variables
* PascalCase for components

## Files

* `types.ts` → interfaces
* `service.ts` → DB logic
* `hooks/` → business logic

---

# 🧠 Key Insights

* This is an **offline-first POS**
* Data integrity is critical
* UX speed > visual complexity

---

# ✅ Summary

Agave María POS is:

* Modular
* Scalable
* Offline-capable
* Ready for real-world bar operations

---

🔥 End of Documentation
