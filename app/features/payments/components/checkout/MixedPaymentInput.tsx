import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { checkoutOrderAtom, cashReceivedAtom, cardAmountAtom } from '../../atoms';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Props {
  onConfirm: () => void;
}

export const MixedPaymentInput = ({ onConfirm }: Props) => {
  const order = useAtomValue(checkoutOrderAtom);
  const [cashInput, setCashInput] = useState('');
  const setCashReceived = useSetAtom(cashReceivedAtom);
  const setCardAmount = useSetAtom(cardAmountAtom);

  const cashAmount = parseFloat(cashInput) || 0;
  const cardAmount = Math.max(0, order.total - cashAmount);
  const isValid = cashAmount >= 0 && cashAmount <= order.total;

  const handleConfirm = () => {
    if (!isValid) return;
    setCashReceived(cashAmount);
    setCardAmount(cardAmount);
    onConfirm();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Mixed Payment</h2>

      <div className="bg-gray-50 p-3 rounded">
        <div className="text-sm text-gray-600">Total Amount</div>
        <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
      </div>

      <div>
        <Input
          label="Cash Amount"
          type="number"
          value={cashInput}
          onChange={(e) => setCashInput(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          max={order.total}
        />
      </div>

      {cashInput && (
        <div className="space-y-2 p-3 bg-blue-50 rounded">
          <div className="flex justify-between">
            <span className="text-gray-700">Cash</span>
            <span className="font-bold">${cashAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-700">Card</span>
            <span className="font-bold">${cardAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleConfirm}
        disabled={!isValid || !cashInput}
        className="w-full"
      >
        Confirm Mixed Payment
      </Button>
    </div>
  );
};
