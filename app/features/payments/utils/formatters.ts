import { Payment, PaymentBreakdown, PaymentMethod } from '../types';
import { PAYMENT_METHODS_CONFIG } from '../constants';

/**
 * Format currency value
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Format payment method label with icon
 */
export const formatMethodLabel = (method: PaymentMethod): string => {
  const config = PAYMENT_METHODS_CONFIG[method];
  return config ? `${config.icon} ${config.label}` : method;
};

/**
 * Format single payment for display
 */
export const formatPayment = (payment: Payment): string => {
  return `${formatMethodLabel(payment.method)} - ${formatCurrency(payment.amount)}`;
};

/**
 * Format payment breakdown summary
 */
export const formatPaymentSummary = (breakdown: PaymentBreakdown): string[] => {
  const lines: string[] = [];

  if (breakdown.payments.length === 0) {
    lines.push('Sin pagos registrados');
    return lines;
  }

  breakdown.payments.forEach((payment) => {
    lines.push(`${formatPayment(payment)}`);
  });

  lines.push('---');
  lines.push(`Total: ${formatCurrency(breakdown.total)}`);

  if (breakdown.remaining > 0) {
    lines.push(`Pendiente: ${formatCurrency(breakdown.remaining)}`);
  } else if (breakdown.remaining < 0) {
    lines.push(`Cambio: ${formatCurrency(Math.abs(breakdown.remaining))}`);
  } else {
    lines.push('✓ Pago completo');
  }

  return lines;
};

/**
 * Get icon for payment method
 */
export const getPaymentMethodIcon = (method: PaymentMethod): string => {
  const config = PAYMENT_METHODS_CONFIG[method];
  return config?.icon ?? '❓';
};

/**
 * Get color class for payment status badge
 */
export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
