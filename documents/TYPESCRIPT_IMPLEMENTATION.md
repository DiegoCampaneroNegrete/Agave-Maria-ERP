# Checkout Flow - TypeScript Implementation

## Overview

Complete checkout flow implementation using:
- **TypeScript** - Full type safety
- **Jotai** - Global state management  
- **Reusable Hooks** - Logic separation from UI

## Architecture

### State Layer (Jotai Atoms)

```typescript
// app/features/payments/atoms.ts

// Order state
checkoutOrderAtom: {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// Payment state
paymentMethodAtom: 'cash' | 'card' | 'mixed' | null
cashReceivedAtom: number
cardAmountAtom: number
changeAtom: number

// UI state
checkoutStageAtom: 'summary' | 'method' | 'input' | 'confirm' | 'receipt'
checkoutErrorAtom: string | null
checkoutLoadingAtom: boolean
```

### Hooks Layer

#### 1. `useCheckoutCalculations()`

Handles payment calculations and validation.

```typescript
const {
  total,           // Current order total
  subtotal,        // Order subtotal
  tax,             // Tax amount
  cashReceived,    // Cash input amount
  cardAmount,      // Card charge amount
  change,          // Calculated change
  error,           // Validation error
  validate,        // Validation function
  setCashReceived, // Set cash input
  setCardAmount,   // Set card amount
} = useCheckoutCalculations();
```

**Validation Logic:**
```typescript
// Cash: amount >= total
if (paymentMethod === 'cash') {
  if (cashReceived < order.total) return false;
  change = cashReceived - order.total;
}

// Card: fixed amount
if (paymentMethod === 'card') {
  cardAmount = order.total;
  change = 0;
}

// Mixed: cash + auto-calc card
if (paymentMethod === 'mixed') {
  if (cashReceived < 0 || cashReceived > order.total) return false;
  cardAmount = order.total - cashReceived;
  change = 0;
}
```

#### 2. `useCheckoutFlow()`

Controls stage transitions through checkout.

```typescript
const {
  stage,          // Current stage: 'summary' | 'method' | 'input' | 'confirm' | 'receipt'
  goNext,         // Move to next stage
  goPrev,         // Move to previous stage
  reset,          // Reset to initial state
  goToMethod,     // Jump to method selection
  goToInput,      // Jump to amount input
  goToConfirm,    // Jump to confirmation
  goToReceipt,    // Jump to receipt
} = useCheckoutFlow();
```

**Stage Sequence:**
```
Summary → Method → Input → Confirm → Receipt
  ↓        ↑       ↓
  └────←──────────┘
     (Edit path)
```

#### 3. `usePaymentProcessing()`

Handles payment API calls.

```typescript
const {
  processPayment,  // async (method) => Promise<boolean>
  loading,         // boolean - API call in progress
  error,           // string | null - Error message
} = usePaymentProcessing();

// Usage
const success = await processPayment('cash');
```

## Components

### Component Hierarchy

```
CheckoutFlow (Orchestrator)
├── CheckoutSummary
├── PaymentMethodSelector
├── CashPaymentInput
├── CardPaymentInput
├── MixedPaymentInput
├── CheckoutConfirmation
└── CheckoutReceipt
```

### Component Responsibilities

| Component | Purpose | Props |
|-----------|---------|-------|
| **CheckoutFlow** | Main orchestrator, renders based on stage | - |
| **CheckoutSummary** | Display order items and total | `onCheckout: () => void` |
| **PaymentMethodSelector** | Let user choose payment method | `onMethodSelected: () => void` |
| **CashPaymentInput** | Input cash amount, calculate change | `onConfirm: () => void` |
| **CardPaymentInput** | Confirm card charge | `onConfirm: () => void, onCancel: () => void` |
| **MixedPaymentInput** | Input cash, auto-calc card | `onConfirm: () => void` |
| **CheckoutConfirmation** | Final review before payment | `onConfirm: () => void, onEdit: () => void, isProcessing: boolean` |
| **CheckoutReceipt** | Display receipt, print/close | `onClose: () => void, onPrint: () => void` |

## Type Safety

### Custom Types

```typescript
// app/features/payments/types.ts

export type CheckoutStage = 
  | 'summary' 
  | 'method' 
  | 'input' 
  | 'confirm' 
  | 'receipt';

export interface CashPaymentInput {
  amount: number;
  change: number;
}

export interface CardPaymentInput {
  amount: number;
}

export interface MixedPaymentInput {
  cash: number;
  card: number;
}

export interface CheckoutState {
  stage: CheckoutStage;
  paymentMethod: 'cash' | 'card' | 'mixed' | null;
  cashReceived: number;
  cardAmount: number;
  change: number;
  error: string | null;
}
```

## Usage Examples

### Basic Integration

```typescript
'use client';

import { useSetAtom } from 'jotai';
import { checkoutOrderAtom } from '@/app/features/payments/atoms';
import { CheckoutFlow } from '@/app/features/payments/components/checkout';

export default function CheckoutPage() {
  const setCheckoutOrder = useSetAtom(checkoutOrderAtom);

  // Set order data before rendering checkout
  useEffect(() => {
    setCheckoutOrder({
      items: [...],
      subtotal: 45.00,
      tax: 3.60,
      total: 48.60,
    });
  }, []);

  return <CheckoutFlow />;
}
```

### Using Calculation Hook

```typescript
function PaymentSummary() {
  const { 
    total, 
    cashReceived, 
    change, 
    error 
  } = useCheckoutCalculations();

  return (
    <div>
      <div>Total: ${total.toFixed(2)}</div>
      <div>Cash: ${cashReceived.toFixed(2)}</div>
      <div>Change: ${change.toFixed(2)}</div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Using Flow Hook

```typescript
function CheckoutButtons() {
  const { stage, goNext, goPrev, reset } = useCheckoutFlow();

  return (
    <div>
      <button onClick={goPrev} disabled={stage === 'summary'}>
        Back
      </button>
      <button onClick={goNext}>
        Next
      </button>
      <button onClick={reset}>
        Start Over
      </button>
      Current: {stage}
    </div>
  );
}
```

### Payment Processing

```typescript
async function ConfirmButton() {
  const { processPayment, loading, error } = usePaymentProcessing();
  const paymentMethod = useAtomValue(paymentMethodAtom);

  const handleConfirm = async () => {
    const success = await processPayment(paymentMethod);
    if (success) {
      // Navigate to receipt
    }
  };

  return (
    <button onClick={handleConfirm} disabled={loading}>
      {loading ? 'Processing...' : 'Confirm'}
    </button>
  );
}
```

## API Integration

### Payment API Endpoint

**POST `/api/payments`**

Request:
```typescript
{
  method: 'cash' | 'card' | 'mixed',
  orderId: string,
  total: number,
  cashAmount?: number,
  cardAmount?: number,
  change?: number
}
```

Response:
```typescript
{
  success: boolean,
  paymentId?: string,
  receiptId?: string,
  error?: string,
  timestamp: string
}
```

### Updating Hook with Real Backend

In `app/features/payments/hooks/useCheckout.ts`:

```typescript
export const usePaymentProcessing = () => {
  const [loading, setLoading] = useAtom(checkoutLoadingAtom);
  const error = useAtomValue(checkoutErrorAtom);
  const setError = useSetAtom(checkoutErrorAtom);
  const order = useAtomValue(checkoutOrderAtom);
  const cashReceived = useAtomValue(cashReceivedAtom);
  const cardAmount = useAtomValue(cardAmountAtom);
  const paymentMethod = useAtomValue(paymentMethodAtom);

  const processPayment = async (method: 'cash' | 'card' | 'mixed') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          orderId: 'current-order-id', // Get from context
          total: order.total,
          cashAmount: method !== 'card' ? cashReceived : undefined,
          cardAmount: method !== 'cash' ? cardAmount : undefined,
          change: method === 'cash' ? (cashReceived - order.total) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      setLoading(false);
      return data.success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
      setLoading(false);
      return false;
    }
  };

  return { processPayment, loading, error };
};
```

## Testing

### Test Scenarios

```typescript
describe('Checkout Flow', () => {
  // 1. Cash exact payment
  test('should accept exact cash payment', () => {
    // Set cash = total
    // Validate
    // Expect: success, change = 0
  });

  // 2. Cash with change
  test('should calculate change correctly', () => {
    // Set cash > total
    // Validate
    // Expect: success, change = cash - total
  });

  // 3. Insufficient cash
  test('should reject insufficient cash', () => {
    // Set cash < total
    // Validate
    // Expect: error
  });

  // 4. Card payment
  test('should process full card charge', () => {
    // Select card method
    // Validate
    // Expect: cardAmount = total, change = 0
  });

  // 5. Mixed payment
  test('should split cash and card', () => {
    // Set cash = 25
    // Validate mixed
    // Expect: card = total - 25
  });
});
```

## File Structure

```
app/features/payments/
├── atoms.ts                          # Jotai atoms
├── types.ts                          # TypeScript interfaces
├── hooks/
│   ├── useCheckout.ts                # Main hooks
│   ├── index.ts                      # Exports
│   └── __tests__/
│       └── useCheckout.test.ts       # Tests
├── components/
│   └── checkout/
│       ├── CheckoutFlow.tsx          # Orchestrator
│       ├── CheckoutSummary.tsx       # Order display
│       ├── PaymentMethodSelector.tsx # Method choice
│       ├── CashPaymentInput.tsx      # Cash input
│       ├── CardPaymentInput.tsx      # Card confirmation
│       ├── MixedPaymentInput.tsx     # Mixed split
│       ├── CheckoutConfirmation.tsx  # Final review
│       ├── CheckoutReceipt.tsx       # Receipt
│       └── index.ts                  # Exports
├── README.md                         # This file
└── __tests__/
    └── README.md                     # Test documentation

app/
├── checkout/
│   └── page.tsx                      # Checkout page example
└── api/
    └── payments/
        └── route.ts                  # Payment API handler
```

## Performance Optimizations

1. **Atom Selectors** - Use `useAtomValue` for read-only values
2. **Component Memoization** - Memoize components with `memo` to prevent re-renders
3. **Lazy Loading** - Load payment processor SDK on demand
4. **Debouncing** - Debounce input validation for cash amounts

## Next Steps

- [ ] Connect real payment processor (Stripe/Square)
- [ ] Add receipt printing/emailing
- [ ] Add payment history storage
- [ ] Add refund handling
- [ ] Add multi-currency support
- [ ] Add barcode scanning for items
- [ ] Add offline mode for cash payments
