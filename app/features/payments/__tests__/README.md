# Payment System Tests

Complete test suite for mixed payments feature using Vitest.

## Setup

Install deps:
```bash
npm install
```

Run tests:
```bash
npm run test          # Watch mode
npm run test:ui       # UI dashboard
npm run test:coverage # Coverage report
```

## Test Files

### validators.test.ts
Unit tests for validation logic (pure functions).

**Coverage:**
- ✅ `validateAmount` - amount range, limits, remaining balance
- ✅ `validateMethod` - method exists, enabled
- ✅ `validateMetadata` - required fields per method
- ✅ `validatePaymentComplete` - exact/under/overpayment
- ✅ `validateNoDuplicates` - method count limit
- ✅ `validatePaymentCount` - total payment methods limit
- ✅ `validateNewPayment` - comprehensive checks

**Test cases:** 40+
- Positive cases (valid input)
- Negative cases (invalid input)
- Edge cases (rounding, decimals, large amounts)

### usePaymentFlow.test.ts
Hook integration tests using React Testing Library + Jotai.

**Coverage:**
- ✅ State initialization
- ✅ Add single/multiple payments
- ✅ Remove payments
- ✅ Update payment amount
- ✅ Clear all payments
- ✅ Payment complete detection
- ✅ Confirm & error handling
- ✅ Metadata handling (vouchers)
- ✅ Duplicate method limits
- ✅ Rounding tolerance (1 cent)
- ✅ UI state management

**Test cases:** 22

### integration.test.ts
End-to-end scenarios combining multiple hooks.

**Scenarios covered:**
1. **Mixed Payment (Cash + Card)** - Full flow with history
2. **Exact Cash** - Simple single payment
3. **Voucher + Cash** - Multiple methods with metadata
4. **Insufficient Payment** - Blocks confirmation
5. **Overpayment** - Amount validation
6. **Missing Voucher Code** - Metadata validation
7. **Disabled Method** - Method validation
8. **Config Access** - Payment methods list
9. **Independent Validators** - Granular checks
10. **History Tracking** - Analytics collection
11. **Breakdown Calc** - Math accuracy
12. **State Isolation** - No cross-contamination
13. **Floating Point** - Precision handling

**Test cases:** 28

## Test Count

**Total:** 90+ test cases

| File | Cases |
|------|-------|
| validators | 40 |
| usePaymentFlow | 22 |
| integration | 28 |

## What's Tested

### Business Logic
✅ Amount validation (positive, within limits, vs remaining)
✅ Payment method validation (enabled, exists)
✅ Metadata requirements (vouchers, auth codes)
✅ Payment completion (exact, tolerance, under/overpay)
✅ Duplicate prevention (max same methods)
✅ Rounding & precision (2 decimals, 1 cent tolerance)

### State Management
✅ Jotai atom updates
✅ Hook state isolation
✅ Error state tracking
✅ UI state management

### Workflows
✅ Single payment flow
✅ Mixed payment flow
✅ Payment removal
✅ Payment confirmation
✅ Error handling
✅ History tracking

### Edge Cases
✅ Exact payment ($100 = $100)
✅ Underpayment ($99 < $100)
✅ Overpayment ($101 > $100, blocked)
✅ Rounding ($100.01 ≈ $100, allowed)
✅ Decimals (0.01 minimum)
✅ Large amounts (99999.99)
✅ Negative amounts (rejected)
✅ Missing metadata (voucher)
✅ Disabled methods (check, bank transfer)
✅ Duplicate methods (3 max, then blocked)

## Running Specific Tests

```bash
# All validators
npm run test validators

# Single file
npm run test usePaymentFlow

# Integration only
npm run test integration

# With UI
npm run test:ui

# Coverage
npm run test:coverage
```

## Test Structure

Each test uses:
- **AAA Pattern**: Arrange → Act → Assert
- **Jotai Wrapper**: Tests use Provider wrapper for hooks
- **Act**: Wrapped state updates for proper batching
- **Clear Semantics**: Descriptive test names

Example:
```typescript
it('adds payment successfully', () => {
  // Arrange
  const { result } = renderHook(() => usePaymentFlow(100), { wrapper });

  // Act
  act(() => {
    const success = result.current.addPayment('cash', 50);
    expect(success).toBe(true);
  });

  // Assert
  expect(result.current.total).toBe(50);
});
```

## Mocking

Setup includes:
- ✅ localStorage mock (for persistence tests)
- ✅ window.matchMedia mock (responsive)
- ✅ Global test utilities
- ✅ jsdom environment

## Coverage Goals

Target:
- Validators: 100% (pure functions)
- Hooks: 90%+
- Components: 70%+
- Overall: 85%+

Run:
```bash
npm run test:coverage
```

## CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Run tests
  run: npm run test -- --run
```

## Debugging

Watch mode with UI:
```bash
npm run test:ui
```

Then:
- Click tests to expand
- See line-by-line results
- Live reload on save

## Common Issues

### Tests timeout
- Increase timeout in vitest.config.ts
- Check for missing `act()` wrappers

### Jotai state not updating
- Ensure hooks use Provider wrapper
- Wrap state changes in `act()`

### Import errors
- Check tsconfig paths (@ alias)
- Run `npm install` again

## Future Enhancements

- [ ] Component tests (PaymentFlow.tsx UI)
- [ ] E2E tests (full checkout flow)
- [ ] Performance tests (large payment arrays)
- [ ] Database operation tests (if local DB)
- [ ] Snapshot tests (payment breakdown)
