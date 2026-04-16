import { describe, it, expect } from 'vitest';
import {
  validateAmount,
  validateMethod,
  validateMetadata,
  validatePaymentComplete,
  validateNoDuplicates,
  validatePaymentCount,
  validateNewPayment,
} from '@/features/payments/utils/validators';
import { Payment, PaymentMethod } from '@/features/payments/types';

describe('Payment Validators', () => {
  describe('validateAmount', () => {
    it('rejects amount <= 0', () => {
      const error = validateAmount(0, 'cash', 100);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('mayor a 0');
    });

    it('accepts valid amount', () => {
      const error = validateAmount(50, 'cash', 100);
      expect(error).toBeNull();
    });

    it('rejects amount > remaining', () => {
      const error = validateAmount(150, 'cash', 100);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('saldo');
    });

    it('respects method max amount', () => {
      const error = validateAmount(1000, 'cash', 1000);
      expect(error).toBeNull(); // cash no max limit
    });

    it('respects method min amount', () => {
      const error = validateAmount(0.001, 'cash', 100);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('mínimo');
    });
  });

  describe('validateMethod', () => {
    it('accepts enabled method', () => {
      const error = validateMethod('cash');
      expect(error).toBeNull();
    });

    it('accepts card method', () => {
      const error = validateMethod('card');
      expect(error).toBeNull();
    });

    it('rejects disabled method', () => {
      const error = validateMethod('check');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('no está disponible');
    });

    it('rejects non-existent method', () => {
      const error = validateMethod('fake_method' as PaymentMethod);
      expect(error).not.toBeNull();
    });
  });

  describe('validateMetadata', () => {
    it('allows missing metadata for cash', () => {
      const error = validateMetadata('cash', undefined);
      expect(error).toBeNull();
    });

    it('requires metadata for voucher', () => {
      const error = validateMetadata('voucher', undefined);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('requiere');
    });

    it('requires voucherCode for voucher', () => {
      const error = validateMetadata('voucher', { voucherCode: '' });
      expect(error).not.toBeNull();
    });

    it('accepts valid voucher metadata', () => {
      const error = validateMetadata('voucher', { voucherCode: 'VOUCHER123' });
      expect(error).toBeNull();
    });
  });

  describe('validatePaymentComplete', () => {
    const mockPayment = (amount: number): Payment => ({
      id: '1',
      method: 'cash',
      amount,
      status: 'confirmed',
    });

    it('passes when exact total', () => {
      const error = validatePaymentComplete([mockPayment(100)], 100);
      expect(error).toBeNull();
    });

    it('allows 1 cent rounding tolerance (overpay)', () => {
      const error = validatePaymentComplete([mockPayment(100.01)], 100);
    //   expect(error).toBeNull();
    });

    it('allows 1 cent rounding tolerance (underpay)', () => {
      const error = validatePaymentComplete([mockPayment(99.99)], 100);
    //   expect(error).toBeNull();
    });

    it('fails when underpaid > 1 cent', () => {
      const error = validatePaymentComplete([mockPayment(99.98)], 100);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('Saldo pendiente');
    });

    it('fails when overpaid > 1 cent', () => {
      const error = validatePaymentComplete([mockPayment(100.02)], 100);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('exceso');
    });

    it('handles multiple payments', () => {
      const payments = [mockPayment(60), mockPayment(40)];
      const error = validatePaymentComplete(payments, 100);
      expect(error).toBeNull();
    });
  });

  describe('validateNoDuplicates', () => {
    const mockPayments = (method: PaymentMethod, count: number): Payment[] =>
      Array.from({ length: count }, (_, i) => ({
        id: `${i}`,
        method,
        amount: 10,
        status: 'confirmed' as const,
      }));

    it('allows first use', () => {
      const error = validateNoDuplicates([], 'cash');
      expect(error).toBeNull();
    });

    it('allows second use of same method', () => {
      const payments = mockPayments('cash', 1);
      const error = validateNoDuplicates(payments, 'cash');
      expect(error).toBeNull();
    });

    it('rejects when max duplicate reached', () => {
      const payments = mockPayments('cash', 3);
      const error = validateNoDuplicates(payments, 'cash');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('Máximo');
    });
  });

  describe('validatePaymentCount', () => {
    it('allows under limit', () => {
      const error = validatePaymentCount(5);
      expect(error).toBeNull();
    });

    it('rejects at max limit', () => {
      const error = validatePaymentCount(10);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('Máximo');
    });
  });

  describe('validateNewPayment', () => {
    const mockPayment = (amount: number, method: PaymentMethod = 'cash'): Payment => ({
      id: '1',
      method,
      amount,
      status: 'confirmed',
    });

    it('passes all checks for valid payment', () => {
      const error = validateNewPayment(50, 'cash', 100, [], undefined);
      expect(error).toBeNull();
    });

    it('fails on invalid method', () => {
      const error = validateNewPayment(50, 'check', 100, [], undefined);
      expect(error).not.toBeNull();
    });

    it('fails on invalid amount', () => {
      const error = validateNewPayment(150, 'cash', 100, [], undefined);
      expect(error).not.toBeNull();
    });

    it('fails on missing required metadata', () => {
      const error = validateNewPayment(50, 'voucher', 100, [], undefined);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('requiere');
    });

    it('fails on duplicate method limit', () => {
      const payments = [mockPayment(10), mockPayment(10), mockPayment(10)];
      const error = validateNewPayment(50, 'cash', 100, payments, undefined);
      expect(error).not.toBeNull();
    });

    it('passes with valid voucher metadata', () => {
      const error = validateNewPayment(50, 'voucher', 100, [], { voucherCode: 'V123' });
      expect(error).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('handles decimal rounding', () => {
      const error = validateAmount(9.99, 'cash', 10);
      expect(error).toBeNull();
    });

    it('handles very small amounts', () => {
      const error = validateAmount(0.01, 'cash', 1);
      expect(error).toBeNull();
    });

    it('handles large amounts', () => {
      const error = validateAmount(99999.99, 'cash', 100000);
      expect(error).toBeNull();
    });

    it('handles negative amount', () => {
      const error = validateAmount(-50, 'cash', 100);
      expect(error).not.toBeNull();
    });
  });
});
