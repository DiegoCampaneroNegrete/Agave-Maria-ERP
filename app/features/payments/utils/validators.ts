import { PAYMENT_METHODS_CONFIG, PAYMENT_CONSTRAINTS} from '../constants';
import { Payment, PaymentMethod, PaymentMetadata } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate a single payment amount
 */
export const validateAmount = (
  amount: number,
  method: PaymentMethod,
  remaining: number
): ValidationError | null => {
  const config = PAYMENT_METHODS_CONFIG[method];
  const roundingTolerance = 0.01; // Allow 1 cent rounding

  if (!config) {
    return { field: 'method', message: 'Método de pago no válido' };
  }

  if (amount <= 0) {
    return { field: 'amount', message: 'El monto debe ser mayor a 0' };
  }

  if (amount < config.minAmount) {
    return {
      field: 'amount',
      message: `Monto mínimo: $${config.minAmount}`,
    };
  }

  if (config.maxAmount && amount > config.maxAmount) {
    return {
      field: 'amount',
      message: `Monto máximo: $${config.maxAmount}`,
    };
  }

  // Allow overpayment up to 1 cent (rounding tolerance)
  if (amount > remaining + roundingTolerance) {
    return {
      field: 'amount',
      message: `Monto no puede exceder el saldo: $${remaining.toFixed(2)}`,
    };
  }

  return null;
};

/**
 * Validate payment method is supported and enabled
 */
export const validateMethod = (method: PaymentMethod): ValidationError | null => {
  const config = PAYMENT_METHODS_CONFIG[method];

  if (!config) {
    return { field: 'method', message: 'Método de pago no existe' };
  }

  if (!config.enabled) {
    return { field: 'method', message: `${config.label} no está disponible` };
  }

  return null;
};

/**
 * Validate metadata based on method requirements
 */
export const validateMetadata = (
  method: PaymentMethod,
  metadata?: PaymentMetadata
): ValidationError | null => {
  const config = PAYMENT_METHODS_CONFIG[method];

  if (!config) {
    return null;
  }

  if (config.requiresMetadata && !metadata) {
    return {
      field: 'metadata',
      message: `${config.label} requiere información adicional`,
    };
  }

  if (config.metadataFields) {
    for (const field of config.metadataFields) {
      if (config.requiresMetadata && !metadata?.[field]) {
        return {
          field: 'metadata',
          message: `Campo requerido: ${field}`,
        };
      }
    }
  }

  return null;
};

/**
 * Validate payment breakdown is complete
 */
export const validatePaymentComplete = (
  payments: Payment[],
  orderTotal: number
): ValidationError | null => {
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = orderTotal - total;

  // Allow small rounding differences (within 1 cent)
  const roundingTolerance = 0.01;

  if (Math.abs(remaining) > roundingTolerance) {
    if (remaining > 0) {
      return {
        field: 'total',
        message: `Saldo pendiente: $${remaining.toFixed(2)}`,
      };
    } else {
      return {
        field: 'total',
        message: `Monto en exceso: $${Math.abs(remaining).toFixed(2)}`,
      };
    }
  }

  return null;
};

/**
 * Check duplicate payment methods in session
 */
export const validateNoDuplicates = (
  payments: Payment[],
  newMethod: PaymentMethod
): ValidationError | null => {
  const sameMethodCount = payments.filter((p) => p.method === newMethod).length;

  if (sameMethodCount >= PAYMENT_CONSTRAINTS.maxSameMethodCount) {
    return {
      field: 'method',
      message: `Máximo ${PAYMENT_CONSTRAINTS.maxSameMethodCount} pagos por método`,
    };
  }

  return null;
};

/**
 * Validate payment count doesn't exceed max
 */
export const validatePaymentCount = (
  paymentsCount: number
): ValidationError | null => {
  if (paymentsCount >= PAYMENT_CONSTRAINTS.maxPaymentsPerOrder) {
    return {
      field: 'count',
      message: `Máximo ${PAYMENT_CONSTRAINTS.maxPaymentsPerOrder} métodos de pago permitidos`,
    };
  }

  return null;
};

/**
 * Comprehensive validation for adding a new payment
 */
export const validateNewPayment = (
  amount: number,
  method: PaymentMethod,
  remaining: number,
  currentPayments: Payment[],
  metadata?: PaymentMetadata
): ValidationError | null => {
  // Check method exists and enabled
  const methodError = validateMethod(method);
  if (methodError) return methodError;

  // Check amount is valid
  const amountError = validateAmount(amount, method, remaining);
  if (amountError) return amountError;

  // Check metadata if required
  const metadataError = validateMetadata(method, metadata);
  if (metadataError) return metadataError;

  // Check no duplicate methods
  const duplicateError = validateNoDuplicates(currentPayments, method);
  if (duplicateError) return duplicateError;

  // Check payment count
  const countError = validatePaymentCount(currentPayments.length);
  if (countError) return countError;

  return null;
};
