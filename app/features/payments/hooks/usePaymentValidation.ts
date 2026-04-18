'use client';

import { useCallback } from 'react';
import {
  validateAmount,
  validateMethod,
  validateMetadata,
  validateNewPayment,
  validatePaymentComplete,
  validateNoDuplicates,
  validatePaymentCount,
  ValidationError,
} from '../utils/validators';
import { Payment, PaymentMethod, PaymentMetadata,  } from '../types';

/**
 * Hook for payment validation logic
 * Provides granular validation functions for different scenarios
 */
export const usePaymentValidation = () => {
  /**
   * Validate payment amount
   */
  const validatePaymentAmount = useCallback(
    (amount: number, method: PaymentMethod, remaining: number) => {
      return validateAmount(amount, method, remaining);
    },
    []
  );

  /**
   * Validate payment method exists and is enabled
   */
  const validatePaymentMethod = useCallback((method: PaymentMethod) => {
    return validateMethod(method);
  }, []);

  /**
   * Validate metadata based on method requirements
   */
  const validatePaymentMetadata = useCallback(
    (method: PaymentMethod, metadata?: PaymentMetadata) => {
      return validateMetadata(method, metadata);
    },
    []
  );

  /**
   * Validate complete payment breakdown
   */
  const validateComplete = useCallback(
    (payments: Payment[], orderTotal: number) => {
      return validatePaymentComplete(payments, orderTotal);
    },
    []
  );

  /**
   * Validate no duplicate methods exceed limit
   */
  const validateDuplicateMethods = useCallback(
    (payments: Payment[], newMethod: PaymentMethod) => {
      return validateNoDuplicates(payments, newMethod);
    },
    []
  );

  /**
   * Validate payment count doesn't exceed max
   */
  const validateMaxPaymentCount = useCallback((paymentsCount: number) => {
    return validatePaymentCount(paymentsCount);
  }, []);

  /**
   * Comprehensive validation for a new payment (all checks)
   */
  const validateNewPaymentFull = useCallback(
    (
      amount: number,
      method: PaymentMethod,
      remaining: number,
      currentPayments: Payment[],
      metadata?: PaymentMetadata
    ) => {
      return validateNewPayment(amount, method, remaining, currentPayments, metadata);
    },
    []
  );

  /**
   * Check if validation passed (no error returned)
   */
  const isValid = useCallback((error: ValidationError | null): boolean => {
    return error === null;
  }, []);

  /**
   * Get error message if validation failed
   */
  const getErrorMessage = useCallback((error: ValidationError | null): string | null => {
    return error?.message ?? null;
  }, []);

  return {
    // Individual validators
    validatePaymentAmount,
    validatePaymentMethod,
    validatePaymentMetadata,
    validateComplete,
    validateDuplicateMethods,
    validateMaxPaymentCount,
    validateNewPaymentFull,

    // Utility functions
    isValid,
    getErrorMessage,
  };
};
