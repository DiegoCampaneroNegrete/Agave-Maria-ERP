'use client';

import { useCallback, useMemo } from 'react';
import { PAYMENT_METHODS_CONFIG, ENABLED_PAYMENT_METHODS } from '../constants';
import { PaymentMethod } from '../types';
import { validateMethod } from '../utils/validators';

/**
 * Hook for managing payment methods and their configuration
 */
export const usePaymentMethods = () => {
  /**
   * Get all enabled payment methods
   */
  const supportedMethods = useMemo(() => ENABLED_PAYMENT_METHODS, []);

  /**
   * Check if a payment method is supported and enabled
   */
  const isSupported = useCallback((method: PaymentMethod): boolean => {
    return supportedMethods.includes(method);
  }, [supportedMethods]);

  /**
   * Get configuration for a specific payment method
   */
  const getMethodConfig = useCallback(
    (method: PaymentMethod) => {
      return PAYMENT_METHODS_CONFIG[method];
    },
    []
  );

  /**
   * Validate a method is enabled
   */
  const validateIsEnabled = useCallback((method: PaymentMethod) => {
    return validateMethod(method) === null;
  }, []);

  /**
   * Get all method configurations
   */
  const allConfigs = useMemo(
    () =>
      supportedMethods.map((method) => ({
        method,
        config: PAYMENT_METHODS_CONFIG[method],
      })),
    [supportedMethods]
  );

  return {
    supportedMethods,
    methodConfig: PAYMENT_METHODS_CONFIG,
    allConfigs,
    isSupported,
    getMethodConfig,
    validateIsEnabled,
  };
};
