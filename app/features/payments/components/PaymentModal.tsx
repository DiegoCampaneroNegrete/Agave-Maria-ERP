'use client';

import { useState } from 'react';
import { PaymentFlow } from './PaymentFlow';
import { Customer } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  orderTotal: number;
  orderId?: string;
  customerId?: string;
  selectedCustomer?: Customer | null;
  onPaymentComplete: () => void;
  onClose: () => void;
}

export const PaymentModal = ({
  isOpen,
  orderTotal,
  orderId,
  customerId,
  selectedCustomer,
  onPaymentComplete,
  onClose,
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onPaymentComplete();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-amber-100 /90 flex items-end z-50">
      <div className="bg-app-card w-full rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-app-text">Procesamiento de pago</h2>
            <button
              onClick={onClose}
              className="text-2xl text-app-muted hover:text-app-text"
              disabled={isProcessing}
            >
              ✕
            </button>
          </div>

          {/* Customer info (if selected) */}
          {selectedCustomer && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-700">Cliente</div>
              <div className="font-semibold text-green-900">{selectedCustomer.name}</div>
            </div>
          )}

          {/* Order total display */}
          <div className="mb-4 p-3 bg-app-hover rounded-lg">
            <div className="text-sm text-app-muted">Monto a cobrar</div>
            <div className="text-3xl font-bold text-app-primary">
              ${orderTotal.toFixed(2)}
            </div>
          </div>

          {/* Payment flow */}
          <PaymentFlow
            orderTotal={orderTotal}
            onConfirm={handleConfirm}
            onCancel={onClose}
            customerId={customerId}
          />
        </div>
      </div>
    </div>
  );
};
