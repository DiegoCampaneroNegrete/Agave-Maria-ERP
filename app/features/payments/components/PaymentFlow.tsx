'use client';

import { useState } from 'react';
import { PaymentMethod, PaymentMetadata } from '../types';
import { usePaymentFlow } from '../hooks/usePaymentFlow';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { MethodSelector } from './MethodSelector';
import { AmountInput } from './AmountInput';
import { MetadataForm } from './MetadataForm';
import { PaymentList } from './PaymentList';
import { PaymentSummary } from './PaymentSummary';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface PaymentFlowProps {
  orderTotal: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  customerId?: string;
}

export const PaymentFlow = ({ orderTotal, onConfirm, onCancel, customerId }: PaymentFlowProps) => {
  const payment = usePaymentFlow(orderTotal);
  const { getMethodConfig } = usePaymentMethods();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [inputAmount, setInputAmount] = useState<number | null>(null);
  const [metadata, setMetadata] = useState<PaymentMetadata | undefined>();

  const breakdown = payment.getPaymentBreakdown();
  const selectedConfig = selectedMethod ? getMethodConfig(selectedMethod) : null;

  const handleAddPayment = () => {
    if (!selectedMethod || inputAmount === null) {
      payment.setError('Selecciona método y monto');
      return;
    }

    const success = payment.addPayment(selectedMethod, inputAmount, metadata);

    if (success) {
      setSelectedMethod(null);
      setInputAmount(null);
      setMetadata(undefined);
    }
  };

  const handleConfirm = async () => {
    if (!payment.isPaymentComplete) {
      payment.setError(`Pendiente: $${payment.remaining.toFixed(2)}`);
      return;
    }

    const success = await payment.confirmPayments();
    if (success) {
      await onConfirm();
    }
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {payment.error && (
        <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-600 text-sm">
          {payment.error}
        </div>
      )}

      {/* Payment input form */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-app-border">
          <h3 className="font-semibold text-app-text">Agregar pago</h3>
          <span className="text-sm text-app-muted">Pendiente: ${payment.remaining.toFixed(2)}</span>
        </div>

        {/* Method selector */}
        <MethodSelector
          selectedMethod={selectedMethod}
          onSelectMethod={setSelectedMethod}
        />

        {/* Amount input */}
        <AmountInput
          value={inputAmount}
          onChange={setInputAmount}
          max={payment.remaining}
        />

        {/* Metadata form (conditional) */}
        {selectedMethod && <MetadataForm method={selectedMethod} onMetadataChange={setMetadata} />}

        {/* Add payment button */}
        <Button
          onClick={handleAddPayment}
          disabled={!selectedMethod || inputAmount === null || payment.loading}
          className="w-full"
        >
          Agregar pago
        </Button>
      </Card>

      {/* Current payments list */}
      {payment.hasPayments && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-app-text">Pagos registrados</h3>
            <span className="text-sm text-app-muted">{payment.payments.length} pago(s)</span>
          </div>
          <PaymentList
            payments={payment.payments}
            onRemovePayment={payment.removePayment}
          />
        </>
      )}

      {/* Payment summary */}
      <PaymentSummary breakdown={breakdown} orderTotal={orderTotal} />

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1 text-white">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!payment.isPaymentComplete || payment.loading}
          className="flex-1"
        >
          {payment.loading ? 'Procesando...' : 'Confirmar pago'}
        </Button>
      </div>
    </div>
  );
};
