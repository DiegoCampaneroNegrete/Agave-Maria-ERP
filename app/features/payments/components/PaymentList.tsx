'use client';

import { Payment } from '../types';
import { PaymentItem } from './PaymentItem';

interface PaymentListProps {
  payments: Payment[];
  onRemovePayment: (id: string) => void;
  onEditPayment?: (id: string) => void;
  isEmpty?: boolean;
}

export const PaymentList = ({
  payments,
  onRemovePayment,
  onEditPayment,
  isEmpty = false,
}: PaymentListProps) => {
  if (isEmpty && payments.length === 0) {
    return (
      <div className="p-4 text-center text-app-muted bg-app-hover rounded-lg">
        <p>No hay pagos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {payments.map((payment) => (
        <PaymentItem
          key={payment.id}
          payment={payment}
          onRemove={onRemovePayment}
          onEdit={onEditPayment}
        />
      ))}
    </div>
  );
};
