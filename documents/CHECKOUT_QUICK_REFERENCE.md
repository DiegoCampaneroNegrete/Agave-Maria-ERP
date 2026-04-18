# Quick Reference: Checkout Flow Implementation

## Installation & Setup

### 1. Import Components
```typescript
import { CheckoutFlow } from '@/app/features/payments/components/checkout';
```

### 2. Import Hooks
```typescript
import {
  useCheckoutCalculations,
  useCheckoutFlow,
  usePaymentProcessing,
} from '@/app/features/payments/hooks';
```

### 3. Import Atoms
```typescript
import {
  checkoutOrderAtom,
  paymentMethodAtom,
  cashReceivedAtom,
  cardAmountAtom,
  changeAtom,
  checkoutStageAtom,
  checkoutErrorAtom,
  checkoutLoadingAtom,
} from '@/app/features/payments/atoms';
```

## Usage Examples

### Basic: Render Checkout Flow
```typescript
export default function CheckoutPage() {
  return (
    <div className="p-4">
      <CheckoutFlow />
    </div>
  );
}
```

### Initialize Order Data
```typescript
import { useSetAtom } from 'jotai';
import { checkoutOrderAtom } from '@/app/features/payments/atoms';

export function SetOrderData() {
  const setOrder = useSetAtom(checkoutOrderAtom);

  return (
    <button
      onClick={() => {
        setOrder({
          items: [
            { name: 'Coffee', price: 4.00, qty: 1 },
            { name: 'Sandwich', price: 8.50, qty: 2 },
          ],
          subtotal: 20.00,
          tax: 1.60,
          total: 21.60,
        });
      }}
    >
      Start Checkout
    </button>
  );
}
```

### Display Order Summary
```typescript
import { useAtomValue } from 'jotai';
import { checkoutOrderAtom } from '@/app/features/payments/atoms';

export function OrderSummary() {
  const order = useAtomValue(checkoutOrderAtom);

  return (
    <div>
      {order.items.map((item) => (
        <div key={item.name}>
          {item.name} x{item.qty}: ${(item.price * item.qty).toFixed(2)}
        </div>
      ))}
      <div>Total: ${order.total.toFixed(2)}</div>
    </div>
  );
}
```

### Control Checkout Flow Manually
```typescript
import { useCheckoutFlow } from '@/app/features/payments/hooks';

export function CheckoutNavigation() {
  const { stage, goNext, goPrev, goToReceipt, reset } = useCheckoutFlow();

  return (
    <div>
      <div>Current Stage: {stage}</div>
      <button onClick={goPrev} disabled={stage === 'summary'}>
        Previous
      </button>
      <button onClick={goNext}>
        Next
      </button>
      <button onClick={goToReceipt}>
        Skip to Receipt
      </button>
      <button onClick={reset}>
        Start Over
      </button>
    </div>
  );
}
```

### Use Calculation Logic
```typescript
import { useCheckoutCalculations } from '@/app/features/payments/hooks';

export function PaymentCalculator() {
  const {
    total,
    cashReceived,
    change,
    error,
    validate,
    setCashReceived,
  } = useCheckoutCalculations();

  return (
    <div>
      <input
        type="number"
        value={cashReceived}
        onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
      />
      <button onClick={validate}>Validate Payment</button>
      <div>Total: ${total.toFixed(2)}</div>
      <div>Change: ${change.toFixed(2)}</div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Process Payment
```typescript
import { usePaymentProcessing } from '@/app/features/payments/hooks';
import { useAtomValue } from 'jotai';
import { paymentMethodAtom } from '@/app/features/payments/atoms';

export function ProcessPayment() {
  const { processPayment, loading, error } = usePaymentProcessing();
  const method = useAtomValue(paymentMethodAtom);

  const handlePay = async () => {
    const success = await processPayment(method || 'cash');
    if (success) {
      console.log('Payment completed!');
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

## Common Patterns

### Pattern 1: Custom Payment Input
```typescript
function CustomCashInput() {
  const [amount, setAmount] = useState('');
  const { setCashReceived } = useCheckoutCalculations();
  const { goToConfirm } = useCheckoutFlow();

  const handlePay = () => {
    setCashReceived(parseFloat(amount));
    goToConfirm();
  };

  return (
    <div>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handlePay}>Confirm</button>
    </div>
  );
}
```

### Pattern 2: Payment Status Display
```typescript
function PaymentStatus() {
  const stage = useAtomValue(checkoutStageAtom);
  const error = useAtomValue(checkoutErrorAtom);
  const { loading } = usePaymentProcessing();

  return (
    <div>
      <div>Stage: {stage}</div>
      {loading && <div>Processing payment...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Pattern 3: Calculate Discount
```typescript
function ApplyDiscount() {
  const order = useAtomValue(checkoutOrderAtom);
  const setOrder = useSetAtom(checkoutOrderAtom);

  const applyTenPercent = () => {
    const newTotal = order.total * 0.9;
    setOrder({
      ...order,
      total: newTotal,
    });
  };

  return <button onClick={applyTenPercent}>Apply 10% Discount</button>;
}
```

## Type Checking

### Get Type of Hook Return
```typescript
import type { ReturnType } from 'typescript';
import { useCheckoutFlow } from '@/app/features/payments/hooks';

type CheckoutFlowType = ReturnType<typeof useCheckoutFlow>;
// Now use in other hooks or functions
```

### Create Typed Component
```typescript
import { FC } from 'react';
import { CheckoutStage } from '@/app/features/payments/types';

interface StageProps {
  stage: CheckoutStage;
  data: any;
}

const StageDisplay: FC<StageProps> = ({ stage, data }) => {
  return <div>{stage}: {JSON.stringify(data)}</div>;
};
```

## Testing

### Test Calculation Hook
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCheckoutCalculations } from '@/app/features/payments/hooks';

test('calculates change correctly', () => {
  const { result } = renderHook(() => useCheckoutCalculations());

  act(() => {
    result.current.setCashReceived(50);
  });

  expect(result.current.change).toBe(50 - result.current.total);
});
```

### Test Flow Hook
```typescript
test('transitions between stages', () => {
  const { result } = renderHook(() => useCheckoutFlow());

  expect(result.current.stage).toBe('summary');

  act(() => {
    result.current.goNext();
  });

  expect(result.current.stage).toBe('method');
});
```

## Debugging

### Log State Changes
```typescript
import { useAtomValue } from 'jotai';
import { checkoutStageAtom } from '@/app/features/payments/atoms';

export function DebugCheckout() {
  const stage = useAtomValue(checkoutStageAtom);

  console.log('Current stage:', stage);

  return <div>Debug: {stage}</div>;
}
```

### Monitor All Atoms
```typescript
import { useAtomValue } from 'jotai';
import * as CheckoutAtoms from '@/app/features/payments/atoms';

export function DebugAllAtoms() {
  const order = useAtomValue(CheckoutAtoms.checkoutOrderAtom);
  const method = useAtomValue(CheckoutAtoms.paymentMethodAtom);
  const stage = useAtomValue(CheckoutAtoms.checkoutStageAtom);
  const error = useAtomValue(CheckoutAtoms.checkoutErrorAtom);

  return (
    <pre>{JSON.stringify({ order, method, stage, error }, null, 2)}</pre>
  );
}
```

## Error Handling

### Catch Payment Errors
```typescript
const { processPayment, error } = usePaymentProcessing();

try {
  const success = await processPayment('card');
  if (!success && error) {
    console.error('Payment failed:', error);
    // Show error to user
  }
} catch (err) {
  console.error('Payment exception:', err);
}
```

### Validate Before Processing
```typescript
const { validate, error } = useCheckoutCalculations();

if (!validate()) {
  console.error('Validation failed:', error);
  return;
}

const success = await processPayment('cash');
```

## Performance Tips

1. **Use `useAtomValue` for read-only access** - More efficient than `useAtom`
2. **Use `useSetAtom` for write-only access** - Prevents component re-renders
3. **Memoize component props** - Prevent unnecessary re-renders
4. **Lazy load payment processor** - Load Stripe/Square SDK on demand

```typescript
// Good ✓
const stage = useAtomValue(checkoutStageAtom);

// Good ✓
const setStage = useSetAtom(checkoutStageAtom);

// Less efficient ✗
const [stage, setStage] = useAtom(checkoutStageAtom);
```

## Need Help?

- See: `TYPESCRIPT_IMPLEMENTATION.md` - Full implementation guide
- See: `CHECKOUT_FLOW.md` - UX flow details
- See: `CHECKOUT_IMPLEMENTATION.md` - Integration guide
- Check: `app/features/payments/hooks/__tests__/` - Test examples
