# Payment Integration Analysis & Implementation Plan

## 📊 Current State Analysis

### Existing Systems (Pre-Analysis)

#### 1. Order Flow (`/orders/page.tsx`)
- **Status**: Active, works well
- **Flow**: ProductGrid → Cart → PaymentModal → ProcessPayment → DB
- **Uses**: `useCart`, `usePaymentCheckout`, `PaymentModal`
- **Payment Processing**: `usePaymentFlow` hook + `usePaymentCheckout`

#### 2. Checkout Flow (`/checkout/page.tsx`) 
- **Status**: Recently created (this sprint)
- **Flow**: OrderSummary → MethodSelect → AmountInput → Confirm → Receipt
- **Uses**: `CheckoutFlow`, `useCheckoutCalculations`, `useCheckoutFlow`, `usePaymentProcessing`
- **Features**: Cash, Card, Mixed payments
- **Issue**: Separate from order flow, no integration

#### 3. Payment System (Sophisticated)
- **Atoms**: `paymentsAtom`, `paymentUIStateAtom`, `paymentErrorAtom`, `paymentLoadingAtom`
- **Database**: `payments` table (order_id, method, amount, status, metadata)
- **Hooks**: `usePaymentFlow`, `usePaymentCheckout`, `usePaymentHistory`
- **Status**: PARTIAL, card-only implementation

### Missing Components

❌ Customer tracking
❌ Customer balances
❌ Partial payments with balance recording
❌ Payment history per customer
❌ Discount integration
❌ Tax calculations at order level
❌ Balance settlement tracking
❌ Multiple checkout paths (order flow vs /checkout page)

---

## 🎯 Architecture Plan

### Phase 1: Core Data Models

#### New Types (payment.types.ts)
```typescript
interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

interface CustomerBalance {
  id: string;
  customer_id: string;
  order_id: string;
  amount: number;           // Outstanding balance
  paid_amount: number;      // Amount paid toward balance
  status: 'pending' | 'partial' | 'settled';
  created_at: string;
  updated_at: string;
}

interface OrderPaymentState {
  orderId: string;
  customerId?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;       // Cumulative paid
  outstandingBalance: number; // total - paidAmount
  paymentMethods: Payment[];
  status: 'unpaid' | 'partial' | 'paid';
}

interface PartialPayment {
  paymentId: string;
  balanceId: string;
  amount: number;
  method: 'cash' | 'card' | 'mixed';
  createdAt: string;
}
```

### Phase 2: State Management

#### New Atoms (in payments/atoms.ts or separate store)
```typescript
// Order-level payment tracking
export const orderPaymentStateAtom = atom<OrderPaymentState | null>(null);

// Customer tracking
export const currentCustomerAtom = atom<Customer | null>(null);

// Customer balances
export const customerBalancesAtom = atom<CustomerBalance[]>([]);

// Outstanding balances for current order
export const outstandingBalanceAtom = atom((get) => {
  const state = get(orderPaymentStateAtom);
  return state ? state.total - state.paidAmount : 0;
});

// Payment history for current order
export const orderPaymentHistoryAtom = atom<Payment[]>([]);
```

### Phase 3: Hooks

#### New Hooks Location: `app/features/orders/hooks/`

**1. useOrderPayment(orderId, orderTotal)**
- Manages order-level payment state
- Tracks cumulative payments
- Calculates outstanding balance
- Handles partial vs full payments
- Returns: state, addPayment, settleBalance, getStatus

**2. useCustomerBalance(customerId)**
- Gets customer's outstanding balances
- Settles partial payments
- Records payment history
- Returns: balances, totalOutstanding, settlePayment, getHistory

#### Reuse Existing:
- `usePaymentFlow` - already handles multi-payment input
- `usePaymentCheckout` - already writes to DB

### Phase 4: Utilities

#### paymentCalculations.ts
```typescript
calculateTax(subtotal: number, rate: number): number
applyDiscount(subtotal: number, discountAmount: number): number
calculateTotal(subtotal: number, tax: number, discount: number): number
calculateOutstandingBalance(total: number, paid: number): number
canSettlePartial(amount: number, outstanding: number): boolean
```

### Phase 5: Database Schema Updates

#### Migrations Needed
```sql
-- Add customers table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Add customer_id to orders
ALTER TABLE orders ADD COLUMN customer_id TEXT;
ALTER TABLE orders ADD FOREIGN KEY(customer_id) REFERENCES customers(id);

-- Add customer_balances table
CREATE TABLE customer_balances (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  amount REAL NOT NULL,
  paid_amount REAL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(customer_id) REFERENCES customers(id),
  FOREIGN KEY(order_id) REFERENCES orders(id)
);
```

---

## 🔄 Data Flow (New)

### Full Payment Flow
```
Order Created (OPEN)
  ↓
Select Customer (optional)
  ↓
Add Items to Cart
  ↓
Initiate Payment
  ↓
Choose Method(s)
  ↓
Amount >= Remaining?
  ├─ YES → Complete Payment → Order status = PAID
  └─ NO → Create Balance → Order status = PARTIAL
     ↓
     Save outstanding balance to customer_balances table
     ↓
     Later: Customer pays remaining balance
     ↓
     Balance settled → Order status = PAID
```

### Partial Payment Flow
```
Order: $100 (OPEN)
  ↓
Customer pays $60 (Cash)
  ↓
Outstanding: $40
  ↓
Create Balance Record:
  - order_id: ABC
  - customer_id: CUST1
  - amount: $40
  - paid_amount: $0
  - status: 'partial'
  ↓
Order status → PARTIAL
  ↓
Later: Customer pays $25 (Card)
  ↓
Update Balance:
  - paid_amount: $25
  - status: 'partial' (still)
  ↓
Later: Customer pays $15 (Cash)
  ↓
Update Balance:
  - paid_amount: $40
  - status: 'settled'
  ↓
Order status → PAID
```

---

## 🛣️ Implementation Roadmap

### Step 1: Database Schema
- [ ] Add migrations for customers, customer_balances, customer_id to orders
- [ ] Index customer_id, balances by customer_id and status

### Step 2: Types
- [ ] Create payment.types.ts with Customer, CustomerBalance, OrderPaymentState
- [ ] Update existing types if needed
- [ ] Export from payments/index.ts

### Step 3: State (Atoms)
- [ ] Add new atoms to payments/store.ts or new file
- [ ] Create derived atoms for totals, status
- [ ] Ensure no conflicts with existing atoms

### Step 4: Utilities
- [ ] Create paymentCalculations.ts
- [ ] Implement calculation functions with tests
- [ ] Export from payments/utils/index.ts

### Step 5: Hooks
- [ ] Create useOrderPayment hook
- [ ] Create useCustomerBalance hook
- [ ] Integration with existing usePaymentFlow
- [ ] Add tests

### Step 6: Services
- [ ] Add DB functions: createCustomer, getCustomer, updateCustomerBalance
- [ ] Add functions: recordPartialPayment, settleBalance, getOutstandingBalances
- [ ] Export from payments/service.ts

### Step 7: Integration
- [ ] Update /orders/page.tsx to support customer selection
- [ ] Integrate useOrderPayment into payment modal
- [ ] Update /checkout to use new system
- [ ] Ensure PaymentModal still works

### Step 8: UI (If Time)
- [ ] Customer lookup component
- [ ] Balance display in order summary
- [ ] Outstanding balance notification
- [ ] Payment history view

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Duplicate logic** between systems | Hard to maintain | Use shared utilities, same types, composition |
| **Breaking existing order flow** | Critical bug | Keep /orders/page.tsx unchanged until tested |
| **Database migration issues** | Data loss | Test migrations on mock first |
| **Jotai atom conflicts** | State corruption | Use unique atom names, no overrides |
| **API mismatch** (DB vs atoms) | Sync issues | Validate writes, use derived atoms |
| **Partial payment edge cases** | Data integrity | Comprehensive testing, validation rules |
| **Customer lookup slow** | UX impact | Add customer search debounce, cache |
| **Outstanding balance orphans** | Money tracking issues | Enforce customer_id foreign key |

---

## ✅ Success Criteria

1. ✓ Orders can be partially paid
2. ✓ Outstanding balances tracked per customer
3. ✓ Payment history visible per customer
4. ✓ Balance can be settled with future payments
5. ✓ /checkout page still works
6. ✓ /orders/page.tsx still works (enhanced with customer tracking)
7. ✓ No code duplication between payment flows
8. ✓ Full TypeScript type safety
9. ✓ Jotai atoms properly used
10. ✓ Database schema normalized (customers, balances, orders linked)

---

## 📋 Implementation Order

**Recommended sequence (lowest-risk first):**

1. **Database** (Migrations) - No code risk, easy to rollback
2. **Types** - Zero dependency risk
3. **Atoms** - Isolated, easy to test
4. **Utilities** - Pure functions, easy to test
5. **Services** - DB layer, one-way dependency
6. **Hooks** - Use existing + new, composed
7. **Integration** - Verify with /orders and /checkout
8. **UI** - Polish (optional for MVP)

---

## 🚀 Ready to Implement?

Confirm approach, then proceed step-by-step with validation after each phase.
