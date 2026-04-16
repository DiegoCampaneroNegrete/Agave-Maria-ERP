'use client';

import { PaymentMethod } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { Button } from '@/components/ui/Button';

interface MethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const MethodSelector = ({ selectedMethod, onSelectMethod }: MethodSelectorProps) => {
  const { supportedMethods, methodConfig } = usePaymentMethods();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-app-text">
        Método de pago
      </label>
      <div className="grid grid-cols-2 gap-2">
        {supportedMethods.map((method) => {
          const config = methodConfig[method];
          const isSelected = selectedMethod === method;

          return (
            <Button
              key={method}
              variant={isSelected ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onSelectMethod(method)}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-2xl">{config.icon}</span>
              <span className="text-xs">{config.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
