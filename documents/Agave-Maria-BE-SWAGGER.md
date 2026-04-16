# 🍺 Agave María POS - Backend API Documentation (OpenAPI / Swagger Style)

## 📌 Overview

This document defines the **backend API contract** for the Agave María POS system.

* Style: REST
* Format: JSON
* Auth: (future) JWT
* Base URL: `/api`

---

# 🔐 Authentication (Future)

```http
Authorization: Bearer <token>
```

---

# 📦 SCHEMAS

## Product

```json
{
  "id": "string",
  "name": "string",
  "price": 0,
  "created_at": "string"
}
```

---

## Order

```json
{
  "id": "string",
  "total": 0,
  "status": "PAID",
  "payment_method": "cash | card",
  "created_at": "string"
}
```

---

## OrderItem

```json
{
  "id": "string",
  "order_id": "string",
  "product_id": "string",
  "quantity": 0,
  "price": 0
}
```

---

## CashClosing

```json
{
  "id": "string",
  "expected": 0,
  "counted": 0,
  "difference": 0,
  "created_at": "string"
}
```

---

# 🛒 PRODUCTS

## GET /products

### Response

```json
[
  {
    "id": "1",
    "name": "Cerveza",
    "price": 50
  }
]
```

---

## POST /products

### Body

```json
{
  "name": "Cerveza",
  "price": 50
}
```

---

# 🧾 ORDERS

## GET /orders

### Query Params

* `date` (optional)

### Response

```json
[
  {
    "id": "1",
    "total": 200,
    "payment_method": "cash",
    "created_at": "2026-01-01"
  }
]
```

---

## POST /orders

### Body

```json
{
  "total": 200,
  "payment_method": "cash",
  "items": [
    {
      "product_id": "1",
      "quantity": 2,
      "price": 100
    }
  ]
}
```

---

## GET /orders/{id}

### Response

```json
{
  "id": "1",
  "total": 200,
  "items": [
    {
      "name": "Cerveza",
      "quantity": 2,
      "price": 100
    }
  ]
}
```

---

# 📊 DASHBOARD

## GET /dashboard/summary

### Response

```json
{
  "totalSales": 1000,
  "totalOrders": 10,
  "avgTicket": 100
}
```

---

## GET /dashboard/top-products

### Response

```json
[
  {
    "name": "Cerveza",
    "quantity": 20,
    "total": 1000
  }
]
```

---

## GET /dashboard/sales-by-method

### Response

```json
[
  {
    "payment_method": "cash",
    "total": 600
  },
  {
    "payment_method": "card",
    "total": 400
  }
]
```

---

# 💰 CASH CLOSING

## GET /cash/summary

### Response

```json
{
  "totalSales": 1000,
  "cashSales": 600,
  "cardSales": 400
}
```

---

## POST /cash/closing

### Body

```json
{
  "counted": 580
}
```

### Response

```json
{
  "expected": 600,
  "counted": 580,
  "difference": -20
}
```

---

# 🔄 SYNC (Future)

## POST /sync

### Body

```json
{
  "products": [],
  "orders": [],
  "cash_closings": []
}
```

---

# ⚠️ BUSINESS RULES

## Cash Closing

* Only compares CASH payments

## Orders

* Must include items
* Must include payment method

## Offline First

* Client is source of truth
* Backend syncs later

---

# 🚀 NOTES FOR BACKEND IMPLEMENTATION

* Use transactions for order creation
* Normalize order_items
* Index by created_at
* Prepare for sync conflicts

---

🔥 End of API Documentation
