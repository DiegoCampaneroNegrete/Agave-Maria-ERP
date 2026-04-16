# Checkout Flow Implementation Guide

## Quick Start

### 1. Import & Use

```tsx
import { CheckoutFlow } from '@/app/features/payments/components/checkout';

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
```

## Component Architecture

### Flow Diagram
```
CheckoutFlow (Orchestrator)
├── Stage: summary → method → input → confirm → receipt
├── Components
│   ├── CheckoutSummary
│   ├── PaymentMethodSelector
│   ├── CashPaymentInput
│   ├── CardPaymentInput
│   ├── MixedPaymentInput
│   ├── CheckoutConfirmation
│   └── CheckoutReceipt
└── State (Jotai)
    ├── checkoutOrderAtom
    ├── paymentMethodAtom
    ├── cashReceivedAtom
    ├── cardAmountAtom
    ├── changeAtom
    └── checkoutStageAtom
```

## State Management

### Atoms (in `atoms.ts`)

```typescript
// Order data
checkoutOrderAtom: { items, subtotal, tax, total }

// Payment inputs
paymentMethodAtom: 'cash' | 'card' | 'mixed'
cashReceivedAtom: number
cardAmountAtom: number
changeAtom: number

// UI flow
checkoutStageAtom: 'summary' | 'method' | 'input' | 'confirm' | 'receipt'
checkoutErrorAtom: string | null
```

## Hooks

### `useCheckoutCalculations()`

```typescript
const {
  total,
  subtotal,
  tax,
  cashReceived,
  cardAmount,
  change,
  error,
  validate,
  setCashReceived,
  setCardAmount,
} = useCheckoutCalculations();
```

**Validates:** Cash amounts, mixed payment splits, card totals.

### `useCheckoutFlow()`

```typescript
const {
  stage,
  goNext,
  goPrev,
  reset,
  goToMethod,
  goToInput,
  goToConfirm,
  goToReceipt,
} = useCheckoutFlow();
```

**Controls:** Stage transitions through checkout steps.

### `usePaymentProcessing()`

```typescript
const {
  processPayment,
  loading,
  error,
} = usePaymentProcessing();

// Usage
await processPayment('cash'); // or 'card' or 'mixed'
```

**Handles:** API calls to backend payment service.

## Integration Steps

### Step 1: Set Order Data

In your orders page, populate `checkoutOrderAtom` before navigating to checkout:

```typescript
import { useSetAtom } from 'jotai';
import { checkoutOrderAtom } from '@/app/features/payments/atoms';

// In your component
const setOrder = useSetAtom(checkoutOrderAtom);

// When user clicks checkout
setOrder({
  items: currentOrder.items,
  subtotal: currentOrder.subtotal,
  tax: currentOrder.tax,
  total: currentOrder.total,
});
```

### Step 2: Add Checkout Page

Create `app/checkout/page.tsx`:

```typescript
import { CheckoutFlow } from '@/app/features/payments/components/checkout';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <CheckoutFlow />
    </div>
  );
}
```

### Step 3: Backend Integration

Implement payment API endpoint:

```typescript
// POST /api/payments
// Body:
{
  "method": "cash" | "card" | "mixed",
  "orderId": "...",
  "cashAmount"?: number,      // for cash/mixed
  "cardAmount"?: number,      // for card/mixed
  "change"?: number            // for cash
}

// Response:
{
  "success": true,
  "paymentId": "...",
  "receiptId": "...",
  "timestamp": "..."
}
```

In `hooks/useCheckout.ts`, update `processPayment()`:

```typescript
const processPayment = async (method: 'cash' | 'card' | 'mixed') => {
  const response = await fetch('/api/payments', {
    method: 'POST',
    body: JSON.stringify({
      method,
      orderId: 'current-order-id',
      cashAmount: method !== 'card' ? cashReceived : undefined,
      cardAmount: method !== 'cash' ? cardAmount : undefined,
      change: method === 'cash' ? change : undefined,
    }),
  });
  // Handle response...
};
```

### Step 4: Styling

All components use Tailwind + `Button` and `Input` from UI library. Customize by modifying component classes.

## Payment Flow Details

### Cash Flow
```
Summary → Method (select Cash) → Input (enter cash) 
  → Confirm (show change) → Receipt → Close
```

### Card Flow
```
Summary → Method (select Card) → Input (show charge) 
  → Confirm → Receipt → Close
```

### Mixed Flow
```
Summary → Method (select Mixed) → Input (cash + auto card calc) 
  → Confirm (show split) → Receipt → Close
```

## Validation

| Mode | Validation |
|------|-----------|
| Cash | `cashReceived >= total` |
| Card | None (fixed amount) |
| Mixed | `0 <= cash <= total` |

## Change Calculation

- **Cash only:** `change = cashReceived - total`
- **Card only:** `change = 0`
- **Mixed:** `change = 0` (all paid via card remainder)

## Error Handling

Errors set on `checkoutErrorAtom`:

```
Cash: "Insufficient. Need $X.XX"
Mixed: "Cash amount invalid"
Card: "Card processing failed"
```

Display in `CashPaymentInput` and `CardPaymentInput` UI.

## Mobile Optimization

- Stack layout vertically
- Large touch targets (min 44px)
- Full-width buttons
- Responsive font sizes
- Print-friendly receipt

## Testing

Test scenarios:
1. ✓ Exact cash payment
2. ✓ Overpaid cash (with change)
3. ✓ Insufficient cash (error)
4. ✓ Card payment (100% charge)
5. ✓ Mixed: 50% cash + 50% card
6. ✓ Mixed: 25% cash + 75% card

## Next Steps

1. [ ] Connect to real payment processor (Stripe, Square, etc.)
2. [ ] Add receipt printing integration
3. [ ] Add payment history/reporting
4. [ ] Add refund handling
5. [ ] Add multi-currency support
