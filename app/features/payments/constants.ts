import { PaymentMethod } from './types';

export interface PaymentMethodConfig {
  label: string;
  icon: string;
  maxAmount: number | null;
  minAmount: number;
  requiresMetadata: boolean;
  metadataFields?: string[];
  enabled: boolean;
  description?: string;
}

export const PAYMENT_METHODS_CONFIG: Record<PaymentMethod, PaymentMethodConfig> = {
  cash: {
    label: 'Efectivo',
    icon: '💵',
    maxAmount: null,
    minAmount: 0.01,
    requiresMetadata: false,
    enabled: true,
    description: 'Pago en efectivo',
  },
  card: {
    label: 'Tarjeta',
    icon: '💳',
    maxAmount: null,
    minAmount: 0.01,
    requiresMetadata: false,
    metadataFields: ['authCode', 'reference'],
    enabled: true,
    description: 'Pago con tarjeta de crédito/débito',
  },
  voucher: {
    label: 'Vale',
    icon: '🎟️',
    maxAmount: null,
    minAmount: 0.01,
    requiresMetadata: true,
    metadataFields: ['voucherCode'],
    enabled: true,
    description: 'Pago con vale o cupón',
  },
  check: {
    label: 'Cheque',
    icon: '📝',
    maxAmount: null,
    minAmount: 0.01,
    requiresMetadata: true,
    metadataFields: ['checkNumber', 'reference'],
    enabled: false,
    description: 'Pago con cheque',
  },
  bank_transfer: {
    label: 'Transferencia',
    icon: '🏦',
    maxAmount: null,
    minAmount: 0.01,
    requiresMetadata: true,
    metadataFields: ['reference'],
    enabled: false,
    description: 'Pago por transferencia bancaria',
  },
};

export const ENABLED_PAYMENT_METHODS = Object.entries(PAYMENT_METHODS_CONFIG)
  .filter(([, config]) => config.enabled)
  .map(([method]) => method as PaymentMethod);

export const PAYMENT_CONSTRAINTS = {
  maxPaymentsPerOrder: 10,
  maxSameMethodCount: 3,
  requireExactAmount: false, // if true, no change allowed
  allowPartialPayment: false,
  roundingDecimal: 2,
};
