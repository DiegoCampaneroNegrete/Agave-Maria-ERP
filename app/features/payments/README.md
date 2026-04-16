# Mixed Payments Architecture Documentation

## Overview

This document describes the mixed payments system for the Agave POS. It allows customers to pay using multiple payment methods in a single transaction (e.g., cash + card, multiple vouchers, etc.).

## Architecture

### Directory Structure

```
app/features/payments/
├── types.ts                    # TypeScript interfaces
├── constants.ts                # Configuration & constants
├── store.ts                    # Jotai atoms for state management
├── service.ts                  # Database operations
├── index.ts                    # Barrel export
├── utils/
│   ├── validators.ts           # Validation logic
│   └── formatters.ts           # Display formatting
├── hooks/
│   ├── usePaymentFlow.ts       # Core payment flow orchestration
│   ├── usePaymentMethods.ts    # Payment method configuration
│   ├── usePaymentValidation.ts # Validation utilities
│   ├── usePaymentHistory.ts    # History tracking
│   └── usePaymentCheckout.ts   # DB integration
└── components/
    ├── PaymentFlow.tsx         # Main container
    ├── PaymentModal.tsx        # Modal wrapper
    ├── MethodSelector.tsx      # Payment method selection
    ├── AmountInput.tsx         # Amount entry
    ├── MetadataForm.tsx        # Additional info (voucher code, etc.)
    ├── PaymentList.tsx         # Display all payments
    ├── PaymentItem.tsx         # Individual payment item
    └── PaymentSummary.tsx      # Breakdown & remaining balance
```

## Core Concepts

### Payment Method
- **Type**: `'cash' | 'card' | 'check' | 'voucher' | 'bank_transfer'`
- **Config**: Defined in `constants.ts` with label, icon, limits, metadata requirements
- **Enabled**: Only enabled methods appear in UI

### Payment
Single payment in a transaction:
```typescript
interface Payment {
  id: string;                // UUID
  method: PaymentMethod;     // Type of payment
  amount: number;            // Amount paid
  status: PaymentStatus;     // 'pending' | 'confirmed' | 'failed'
  metadata?: PaymentMetadata; // Extra info (authCode, voucherCode, etc.)
}
```

### PaymentBreakdown
Complete picture of all payments for a transaction:
```typescript
interface PaymentBreakdown {
  payments: Payment[];       // All payments added
  total: number;             // Sum of all payments
  remaining: number;         // orderTotal - total
  isComplete: boolean;       // remaining <= 0.01 (1 cent tolerance)
}
```

## State Management (Jotai)

### Main Atoms
- `paymentsAtom` - Current session payments
- `paymentUIStateAtom` - UI state (selected method, input amount, errors)
- `paymentErrorAtom` - Current error message
- `paymentLoadingAtom` - Loading state for async operations

### Derived Atoms
- `paymentTotalAtom` - Sum of all payments
- `paymentBreakdownAtom` - Complete breakdown
- `isPaymentCompleteAtom` - Whether payment is complete

## Hooks

### usePaymentFlow(orderTotal)
**Core hook for managing payments**
```typescript
const {
  // State
  payments,           // Payment[]
  total,              // number
  remaining,          // number
  error,              // string | null
  
  // Actions
  addPayment,         // (method, amount, metadata?) => boolean
  removePayment,      // (id) => void
  updatePayment,      // (id, amount?, metadata?) => void
  clearPayments,      // () => void
  confirmPayments,    // async () => boolean
  getPaymentBreakdown,// () => PaymentBreakdown
  
  // Derived
  hasPayments,        // boolean
  isPaymentComplete,  // boolean
} = usePaymentFlow(orderTotal);
```

### usePaymentValidation()
**Granular validation functions**
```typescript
const {
  validatePaymentAmount,      // Check amount is valid
  validatePaymentMethod,      // Check method exists
  validatePaymentMetadata,    // Check required metadata
  validateComplete,           // Check order is fully paid
  validateDuplicateMethods,   // Check method limits
  validateMaxPaymentCount,    // Check max payments per order
  validateNewPaymentFull,     // All checks combined
} = usePaymentValidation();
```

### usePaymentMethods()
**Payment method configuration**
```typescript
const {
  supportedMethods,           // PaymentMethod[]
  methodConfig,               // Config for all methods
  allConfigs,                 // Array of {method, config}
  isSupported,                // (method) => boolean
  getMethodConfig,            // (method) => MethodConfig
  validateIsEnabled,          // (method) => boolean
} = usePaymentMethods();
```

### usePaymentHistory()
**Track payment usage for analytics**
```typescript
const {
  history,                    // PaymentHistoryItem[]
  addToHistory,               // (payment) => void
  getByMethod,                // (method) => PaymentHistoryItem | undefined
  getTotalByMethod,           // (method) => number
  getCountByMethod,           // (method) => number
} = usePaymentHistory();
```

### usePaymentCheckout()
**Orchestrates DB operations**
```typescript
const {
  processPayment,             // async (orderId) => boolean
  cancelPayment,              // () => void
  loading,                    // boolean
} = usePaymentCheckout();
```

## Components

### PaymentFlow
Main container component that orchestrates the entire payment UI.
**Props:**
```typescript
{
  orderTotal: number;         // Total to be paid
  onConfirm: () => Promise<void>; // Callback when payment confirmed
  onCancel: () => void;       // Callback when cancelled
}
```

### PaymentModal
Wrapper that displays PaymentFlow in a bottom sheet modal.

### MethodSelector
Button grid to select payment method.

### AmountInput
Numeric input for payment amount with validation.

### MetadataForm
Conditional form for extra information (auth code, voucher code, etc.).

### PaymentList
Shows all added payments with edit/remove buttons.

### PaymentSummary
Displays breakdown: each payment method, total paid, and remaining balance.

## Validation Strategy

### Multi-Layer Validation

**Layer 1: Input Validation**
- Amount: positive, ≤ remaining, within method limits
- Method: supported and enabled
- Metadata: required fields present if needed

**Layer 2: Business Logic**
- No duplicate methods exceeding limit
- Payment count ≤ max allowed
- No overpayment (unless configured)

**Layer 3: State Validation**
- Cart not empty
- Order exists
- Session valid

## Database Schema

### payments table
```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  method TEXT NOT NULL,                 -- 'cash', 'card', etc.
  amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',        -- 'pending', 'confirmed', 'failed'
  metadata TEXT,                        -- JSON string
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### orders table (updated)
```sql
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'PENDING';
-- payment_status: 'PENDING', 'PARTIAL', 'PAID'
-- Replaces the old single payment_method column
```

## Usage Example

### In a Component

```typescript
import { PaymentModal, usePaymentCheckout } from '@/features/payments';

export function CheckoutPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { processPayment } = usePaymentCheckout();

  const handleCheckout = async () => {
    // Create order
    const id = await createOrder(cartItems);
    setOrderId(id);
    setShowPayment(true);
  };

  const handlePaymentComplete = async () => {
    const success = await processPayment(orderId!);
    if (success) {
      // Order paid, proceed
      clearCart();
    }
  };

  return (
    <>
      <button onClick={handleCheckout}>Checkout</button>
      
      <PaymentModal
        isOpen={showPayment}
        orderTotal={total}
        onPaymentComplete={handlePaymentComplete}
        onClose={() => setShowPayment(false)}
      />
    </>
  );
}
```

## Adding New Payment Methods

1. **Add type** in `types.ts`:
   ```typescript
   export type PaymentMethod = '...' | 'new_method';
   ```

2. **Add config** in `constants.ts`:
   ```typescript
   new_method: {
     label: 'New Method',
     icon: '🆕',
     maxAmount: null,
     minAmount: 0.01,
     requiresMetadata: true,
     metadataFields: ['field1', 'field2'],
     enabled: true,
   }
   ```

3. **Optional: Add custom validation** in `utils/validators.ts`

4. **UI automatically updates** - no component changes needed

## Configuration

Edit `constants.ts` to customize:
- Enabled payment methods
- Maximum payments per order (default: 10)
- Maximum same-method uses (default: 3)
- Rounding decimals (default: 2)

## Error Handling

All validation errors are caught and displayed in UI:
- Amount errors: "Monto no puede exceder..."
- Method errors: "Método no disponible"
- Metadata errors: "Campo requerido..."
- Complete payment errors: "Pendiente: $X.XX"

## Analytics & Reporting

Use `usePaymentHistory()` to track:
- Total by payment method
- Count of each method used
- Last used timestamp

Example - Cash closing:
```typescript
const { getTotalByMethod } = usePaymentHistory();
const cashTotal = getTotalByMethod('cash');
const cardTotal = getTotalByMethod('card');
```

## Migration from Old System

Old orders with single `payment_method` field:
1. Database migration script runs automatically
2. Creates `payments` table with index
3. Old orders still accessible via view/mapping
4. New orders use `payments` table

## Edge Cases Handled

✅ Overpayment (configurable)
✅ Underpayment (blocks confirmation)
✅ Rounding errors (1 cent tolerance)
✅ Duplicate methods (configurable limit)
✅ Missing metadata (validation blocks)
✅ Network failures (logged, can retry)
✅ Offline payments (queued, synced later)

## Best Practices

1. **Always use `usePaymentFlow`** for payment logic
2. **Validate early** - use `usePaymentValidation` before adding
3. **Clear atoms** after payment confirms - `usePaymentCheckout` handles this
4. **Track history** - automatically done in `processPayment`
5. **Test edge cases** - see test files for scenarios

## Troubleshooting

### "Monto no puede exceder..."
- User entered more than remaining balance
- Check `remaining` value in `usePaymentFlow`

### "Método de pago no válido"
- Method not in `ENABLED_PAYMENT_METHODS`
- Check `constants.ts` - is it enabled?

### Payment not saving
- Check database migrations ran
- Verify `payments` table exists
- Check DB permissions

### UI not updating
- Ensure atoms are being read with `useAtom`
- Check component is wrapped in Jotai provider
- Use React DevTools to inspect atom state

## Performance Notes

- Atoms are efficiently memoized
- Validators run synchronously (fast)
- DB operations are batched in `createPayments`
- No unnecessary re-renders due to proper hook dependencies

## Security Considerations

- All amounts validated server-side (in real app)
- Metadata sanitized before DB save
- Order ownership verified
- Payment status immutable after confirmation
