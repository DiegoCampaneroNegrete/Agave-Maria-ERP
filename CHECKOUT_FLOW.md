# Checkout Flow - Bar POS

## State Flow

```
Order Total → Payment Method Select → Amount Input → Validation → Confirm → Print/Close
```

## Payment Methods

### 1. Cash
- Enter cash amount
- Calculate change
- Show breakdown
- Confirm → Complete

### 2. Card
- Amount = total (no change)
- Process card
- Confirm → Complete

### 3. Mixed (Cash + Card)
- Enter cash amount
- Calculate remaining = total - cash
- Process card for remaining
- Show: cash + card split
- Confirm → Complete

## UI Screens

### Screen 1: Summary
- Order items + prices
- Subtotal
- Tax (if needed)
- **Total (highlighted)**
- Button: "Checkout"

### Screen 2: Payment Method
- 3 buttons: Cash | Card | Mixed
- Selected → highlight + show input form

### Screen 3: Amount Input
#### Cash Mode:
- Input: "Cash Received"
- Show: Change calculation
- If cash < total: error "Insufficient"
- Button: "Confirm"

#### Card Mode:
- Show: "Charge $X.XX"
- No input needed
- Button: "Process Card" | "Cancel"

#### Mixed Mode:
- Input 1: "Cash Amount"
- Auto-calc: "Card Charge: $X.XX"
- Show breakdown
- Button: "Confirm"

### Screen 4: Confirmation
- Payment method
- Amounts
- Final total
- Button: "Complete" → Print receipt

## Component Structure

```
CheckoutFlow
├── CheckoutSummary (read-only order display)
├── PaymentMethodSelector (Cash | Card | Mixed)
├── CashPayment (input + change calc)
├── CardPayment (confirmation)
├── MixedPayment (dual input)
├── CheckoutConfirmation (final review)
└── CheckoutReceipt (print/close)
```

## Jotai Atoms

```typescript
// Orders
checkoutOrderAtom        // { items, subtotal, tax, total }

// Payment State
paymentMethodAtom        // 'cash' | 'card' | 'mixed'
cashReceivedAtom         // number
cardAmountAtom           // number (calculated for mixed)
changeAtom               // number (calculated)

// UI State
checkoutStageAtom        // 'summary' | 'method' | 'input' | 'confirm' | 'receipt'
```

## Hooks

```typescript
useCheckoutCalculations()
  → { total, subtotal, tax, change, isValid, errors }

usePaymentProcessing()
  → { processPayment, loading, error }

useCheckoutFlow()
  → { currentStage, goNext, goPrev, reset }
```

## Validation Rules

- Cash mode: `cashReceived >= total`
- Card mode: Auto-process (no validation needed)
- Mixed mode: `cashAmount >= 0 && cashAmount <= total`

## Edge Cases

- Zero change: Show "No change needed"
- Exact cash: "Exact payment"
- Overpaid: Show change breakdown (bills + coins)
- Mixed with card error: Retry card or adjust cash

## Transitions

```
Summary
  ↓ (Checkout click)
Method Select
  ↓ (Pick: Cash/Card/Mixed)
Amount Input → Confirm
  ↓
Confirmation → Complete
  ↓
Receipt → Close/Print
```

## UX Details

- **Mobile:** Stack inputs vertically, large touch targets
- **Desktop:** Side-by-side summary + input
- **Keyboard:** Tab between fields, Enter to confirm
- **Accessibility:** Clear labels, ARIA roles, focus management
