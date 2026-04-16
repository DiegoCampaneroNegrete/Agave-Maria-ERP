'use client';

import { PaymentBreakdown } from '../types';
import { formatCurrency, formatMethodLabel } from '../utils/formatters';
import { Card } from '@/components/ui/Card';

interface PaymentSummaryProps {
  breakdown: PaymentBreakdown;
  orderTotal: number;
}

export const PaymentSummary = ({ breakdown, orderTotal }: PaymentSummaryProps) => {
  const { payments, total, remaining, isComplete } = breakdown;

  return (
    <Card className="space-y-3">
      <div className="flex justify-between items-center pb-3 border-b border-app-border">
        <span className="font-semibold text-app-text">Resumen de pago</span>
        {isComplete && <span className="text-green-500 font-bold">✓ Completo</span>}
      </div>

      {/* Payment breakdown */}
      <div className="space-y-2">
        {payments.map((payment) => (
          <div key={payment.id} className="flex justify-between text-sm">
            <span className="text-app-muted">{formatMethodLabel(payment.method)}</span>
            <span className="font-semibold">{formatCurrency(payment.amount)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-app-border pt-3 space-y-2">
        {/* Total paid */}
        <div className="flex justify-between">
          <span className="text-app-text">Total pagado:</span>
          <span className="font-bold text-lg">{formatCurrency(total)}</span>
        </div>

        {/* Order total */}
        <div className="flex justify-between">
          <span className="text-app-text">Monto a cobrar:</span>
          <span className="font-bold">{formatCurrency(orderTotal)}</span>
        </div>

        {/* Remaining or change */}
        <div
          className={`flex justify-between p-2 rounded ${
            remaining > 0.01
              ? 'bg-yellow-500/10 border border-yellow-500'
              : 'bg-green-500/10 border border-green-500'
          }`}
        >
          <span className="font-semibold">
            {remaining > 0.01 ? 'Pendiente:' : 'Cambio:'}
          </span>
          <span
            className={`font-bold text-lg ${
              remaining > 0.01 ? 'text-yellow-600' : 'text-green-600'
            }`}
          >
            {remaining > 0.01
              ? formatCurrency(remaining)
              : formatCurrency(Math.abs(remaining))}
          </span>
        </div>
      </div>
    </Card>
  );
};
