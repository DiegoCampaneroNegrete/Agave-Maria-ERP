import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentFlow } from '@/features/payments/hooks/usePaymentFlow';
import { usePaymentMethods } from '@/features/payments/hooks/usePaymentMethods';
import { usePaymentValidation } from '@/features/payments/hooks/usePaymentValidation';
import { usePaymentHistory } from '@/features/payments/hooks/usePaymentHistory';
import { Provider } from 'jotai';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, null, children);

describe('Payment Flow Integration Tests', () => {
  describe('Checkout Scenario: Mixed Payment (Cash + Card)', () => {
    it('completes full mixed payment flow', async () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(150), {
        wrapper,
      });
      const { result: historyResult } = renderHook(() => usePaymentHistory(), {
        wrapper,
      });

      // Step 1: Add cash payment
      act(() => {
        const success = flowResult.current.addPayment('cash', 100);
        expect(success).toBe(true);
      });

      expect(flowResult.current.total).toBe(100);
      expect(flowResult.current.remaining).toBe(50);

      // Step 2: Add card payment
      act(() => {
        const success = flowResult.current.addPayment('card', 50);
        expect(success).toBe(true);
      });

      expect(flowResult.current.total).toBe(150);
      expect(flowResult.current.remaining).toBe(0);
      expect(flowResult.current.isPaymentComplete).toBe(true);

      // Step 3: Confirm payment
      await act(async () => {
        const success = await flowResult.current.confirmPayments();
        expect(success).toBe(true);
      });

      // Step 4: Track in history
      act(() => {
        flowResult.current.payments.forEach((p) =>
          historyResult.current.addToHistory(p)
        );
      });

      expect(historyResult.current.getTotalByMethod('cash')).toBe(100);
      expect(historyResult.current.getTotalByMethod('card')).toBe(50);
    });
  });

  describe('Checkout Scenario: Exact Cash Payment', () => {
    it('accepts exact cash payment', async () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(75.50), {
        wrapper,
      });

      act(() => {
        const success = flowResult.current.addPayment('cash', 75.50);
        expect(success).toBe(true);
      });

      expect(flowResult.current.isPaymentComplete).toBe(true);

      await act(async () => {
        const success = await flowResult.current.confirmPayments();
        expect(success).toBe(true);
      });
    });
  });

  describe('Checkout Scenario: Voucher + Cash', () => {
    it('combines voucher and cash', () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(100), {
        wrapper,
      });

      // Voucher first
      act(() => {
        const success = flowResult.current.addPayment('voucher', 60, {
          voucherCode: 'VOUCHER123',
        });
        expect(success).toBe(true);
      });

      expect(flowResult.current.total).toBe(60);
      expect(flowResult.current.remaining).toBe(40);

      // Cash to complete
      act(() => {
        const success = flowResult.current.addPayment('cash', 40);
        expect(success).toBe(true);
      });

      expect(flowResult.current.isPaymentComplete).toBe(true);
    });
  });

  describe('Error Scenario: Insufficient Payment', () => {
    it('blocks confirmation with insufficient payment', async () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(100), {
        wrapper,
      });

      act(() => {
        flowResult.current.addPayment('cash', 75);
      });

      expect(flowResult.current.isPaymentComplete).toBe(false);

      await act(async () => {
        const success = await flowResult.current.confirmPayments();
        expect(success).toBe(false);
      });

      expect(flowResult.current.error).toContain('Saldo pendiente');
    });
  });

  describe('Error Scenario: Overpayment Rejected', () => {
    it('rejects overpayment > 1 cent', () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(100), {
        wrapper,
      });

      act(() => {
        const success = flowResult.current.addPayment('cash', 100.02);
        expect(success).toBe(false);
      });

      expect(flowResult.current.error).toContain('saldo');
    });
  });

  describe('Error Scenario: Missing Voucher Code', () => {
    it('blocks voucher without code', () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(100), {
        wrapper,
      });

      act(() => {
        const success = flowResult.current.addPayment('voucher', 50);
        expect(success).toBe(false);
      });

      expect(flowResult.current.error).toContain('requiere');
    });
  });

  describe('Error Scenario: Disabled Method', () => {
    it('blocks disabled payment method', () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(100), {
        wrapper,
      });

      act(() => {
        const success = flowResult.current.addPayment('check', 50);
        expect(success).toBe(false);
      });

      expect(flowResult.current.error).toContain('no está disponible');
    });
  });

  describe('Payment Methods Configuration', () => {
    it('lists all supported methods', () => {
      const { result } = renderHook(() => usePaymentMethods(), { wrapper });

      expect(result.current.supportedMethods).toContain('cash');
      expect(result.current.supportedMethods).toContain('card');
      expect(result.current.supportedMethods).toContain('voucher');
      expect(result.current.supportedMethods).not.toContain('check');
    });

    it('gets method config', () => {
      const { result } = renderHook(() => usePaymentMethods(), { wrapper });

      const cashConfig = result.current.getMethodConfig('cash');
      expect(cashConfig?.label).toBe('Efectivo');
      expect(cashConfig?.requiresMetadata).toBe(false);
    });

    it('checks method support', () => {
      const { result } = renderHook(() => usePaymentMethods(), { wrapper });

      expect(result.current.isSupported('cash')).toBe(true);
      expect(result.current.isSupported('check')).toBe(false);
    });
  });

  describe('Payment Validation Utilities', () => {
    it('validates amount independently', () => {
      const { result } = renderHook(() => usePaymentValidation(), {
        wrapper,
      });

      const error = result.current.validatePaymentAmount(150, 'cash', 100);
      expect(error).not.toBeNull();

      const success = result.current.validatePaymentAmount(50, 'cash', 100);
      expect(success).toBeNull();
    });

    it('validates method independently', () => {
      const { result } = renderHook(() => usePaymentValidation(), {
        wrapper,
      });

      const error = result.current.validatePaymentMethod('check');
      expect(error).not.toBeNull();

      const success = result.current.validatePaymentMethod('cash');
      expect(success).toBeNull();
    });

    it('validates metadata independently', () => {
      const { result } = renderHook(() => usePaymentValidation(), {
        wrapper,
      });

      const error = result.current.validatePaymentMetadata('voucher', undefined);
      expect(error).not.toBeNull();

      const success = result.current.validatePaymentMetadata('cash', undefined);
      expect(success).toBeNull();
    });
  });

  describe('Payment History Tracking', () => {
    it('tracks multiple payment methods', () => {
      const { result } = renderHook(() => usePaymentHistory(), { wrapper });

      act(() => {
        result.current.addToHistory({
          id: '1',
          method: 'cash',
          amount: 100,
          status: 'confirmed',
        });
        result.current.addToHistory({
          id: '2',
          method: 'card',
          amount: 50,
          status: 'confirmed',
        });
        result.current.addToHistory({
          id: '3',
          method: 'cash',
          amount: 50,
          status: 'confirmed',
        });
      });

      expect(result.current.getTotalByMethod('cash')).toBe(150);
      expect(result.current.getTotalByMethod('card')).toBe(50);
      expect(result.current.getCountByMethod('cash')).toBe(2);
    });

    it('clears history', () => {
      const { result } = renderHook(() => usePaymentHistory(), { wrapper });

      act(() => {
        result.current.addToHistory({
          id: '1',
          method: 'cash',
          amount: 100,
          status: 'confirmed',
        });
      });

      expect(result.current.getAll()).toHaveLength(1);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.getAll()).toHaveLength(0);
    });
  });

  describe('Breakdown Calculation', () => {
    it('calculates correct breakdown', () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(200), {
        wrapper,
      });

      act(() => {
        flowResult.current.addPayment('cash', 100);
        flowResult.current.addPayment('card', 75);
      });

      const breakdown = flowResult.current.getPaymentBreakdown();

      expect(breakdown.payments).toHaveLength(2);
      expect(breakdown.total).toBe(175);
      expect(breakdown.remaining).toBe(25);
      expect(breakdown.isComplete).toBe(false);
    });
  });

  describe('State Management', () => {
    it('maintains independent state across instances', () => {
      const { result: flow1 } = renderHook(() => usePaymentFlow(100), {
        wrapper,
      });
      const { result: flow2 } = renderHook(() => usePaymentFlow(200), {
        wrapper,
      });

      act(() => {
        flow1.current.addPayment('cash', 50);
      });

      // flow2 should not be affected
      expect(flow2.current.total).toBe(0);
      expect(flow1.current.total).toBe(50);
    });
  });

  describe('Rounding and Precision', () => {
    it('handles floating point precision', () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(100.50), {
        wrapper,
      });

      act(() => {
        flowResult.current.addPayment('cash', 50.25);
        flowResult.current.addPayment('card', 50.25);
      });

      expect(flowResult.current.total).toBe(100.50);
      expect(flowResult.current.isPaymentComplete).toBe(true);
    });

    it('respects 2 decimal precision', () => {
      const { result: flowResult } = renderHook(() => usePaymentFlow(100), {
        wrapper,
      });

      act(() => {
        flowResult.current.addPayment('cash', 33.333333);
      });

      // Should round to 2 decimals
      expect(flowResult.current.payments[0].amount).toBe(33.33);
    });
  });
});
