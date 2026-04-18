import { renderHook, act } from '@testing-library/react';
import { useCheckoutCalculations, useCheckoutFlow } from '../hooks/useCheckout';
import { Provider } from 'jotai';
import { ReactNode } from 'react';

// Wrapper for Jotai provider
const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider>{children}</Provider>
);

describe('useCheckoutCalculations', () => {
  it('should validate cash payment', () => {
    const { result } = renderHook(() => useCheckoutCalculations(), { wrapper });

    act(() => {
      result.current.setCashReceived(50);
    });

    const isValid = result.current.validate();
    expect(isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should error on insufficient cash', () => {
    const { result } = renderHook(() => useCheckoutCalculations(), { wrapper });

    act(() => {
      result.current.setCashReceived(10);
    });

    const isValid = result.current.validate();
    expect(isValid).toBe(false);
    expect(result.current.error).toContain('Insufficient');
  });

  it('should calculate change correctly', () => {
    const { result } = renderHook(() => useCheckoutCalculations(), { wrapper });

    act(() => {
      result.current.setCashReceived(50);
    });

    result.current.validate();
    expect(result.current.change).toBe(50 - result.current.total);
  });
});

describe('useCheckoutFlow', () => {
  it('should initialize at summary stage', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });
    expect(result.current.stage).toBe('summary');
  });

  it('should transition forward through stages', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });

    act(() => {
      result.current.goNext();
    });
    expect(result.current.stage).toBe('method');

    act(() => {
      result.current.goNext();
    });
    expect(result.current.stage).toBe('input');
  });

  it('should transition backward through stages', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });

    act(() => {
      result.current.goNext();
      result.current.goNext();
      result.current.goPrev();
    });
    expect(result.current.stage).toBe('method');
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });

    act(() => {
      result.current.goNext();
      result.current.goNext();
      result.current.reset();
    });
    expect(result.current.stage).toBe('summary');
  });

  it('should jump directly to stages', () => {
    const { result } = renderHook(() => useCheckoutFlow(), { wrapper });

    act(() => {
      result.current.goToConfirm();
    });
    expect(result.current.stage).toBe('confirm');

    act(() => {
      result.current.goToReceipt();
    });
    expect(result.current.stage).toBe('receipt');
  });
});
