'use client';

import { Payment } from '../types';
import { formatCurrency, formatMethodLabel, getStatusColorClass } from '../utils/formatters';
import { Button } from '@/components/ui/Button';

interface PaymentItemProps {
  payment: Payment;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const PaymentItem = ({ payment, onRemove, onEdit }: PaymentItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-app-hover rounded-lg">
      <div className="flex-1">
        <div className="font-semibold text-app-text">
          {formatMethodLabel(payment.method)}
        </div>
        <div className="text-lg font-bold text-app-primary">
          {formatCurrency(payment.amount)}
        </div>
        <div className="flex gap-2 mt-1">
          <span
            className={`text-xs text-white px-2 py-1 rounded ${getStatusColorClass(
              payment.status
            )}`}
          >
            {payment.status === 'confirmed' ? '✓ Confirmado' : payment.status}
          </span>
          {payment.metadata && Object.keys(payment.metadata).length > 0 && (
            <span className="text-xs text-app-muted">
              {Object.entries(payment.metadata)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' • ')}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(payment.id)}
            className="text-xs"
          >
            ✎
          </Button>
        )}
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(payment.id)}
          className="text-xs"
        >
          ✕
        </Button>
      </div>
    </div>
  );
};
