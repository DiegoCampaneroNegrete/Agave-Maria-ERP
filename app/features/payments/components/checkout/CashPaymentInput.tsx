import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { checkoutOrderAtom, cashReceivedAtom, changeAtom, checkoutErrorAtom } from '../../atoms';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
interface Props {
  onConfirm: () => void;
}

export const CashPaymentInput = ({ onConfirm }: Props) => {
  const order = useAtomValue(checkoutOrderAtom);
  const [localCash, setLocalCash] = useState('');
  const setCashReceived = useSetAtom(cashReceivedAtom);
  const setChange = useSetAtom(changeAtom);
  const setError = useSetAtom(checkoutErrorAtom);

  const cashAmount = parseFloat(localCash) || 0;
  const change = Math.max(0, cashAmount - order.total);
  const isValid = cashAmount >= order.total;

  const handleConfirm = () => {
    if (!isValid) {
      setError(`Need $${(order.total - cashAmount).toFixed(2)} more`);
      return;
    }
    setCashReceived(cashAmount);
    setChange(change);
    setError(null);
    onConfirm();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Cash Payment</h2>

      <div className="bg-gray-50 p-3 rounded">
        <div className="text-sm text-gray-600">Total Amount</div>
        <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
      </div>

      <div>
        <Input
          label="Cash Received"
          type="number"
          value={localCash}
          onChange={(e) => setLocalCash(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      {localCash && (
        <div className={`p-3 rounded text-sm ${isValid ? 'bg-green-50' : 'bg-red-50'}`}>
          {isValid ? (
            <>
              <div className="text-green-700">✓ Payment valid</div>
              <div className="text-lg font-bold text-green-900">
                Change: ${change.toFixed(2)}
              </div>
            </>
          ) : (
            <div className="text-red-700">
              Need $
              {(order.total - cashAmount).toFixed(2)}
            </div>
          )}
        </div>
      )}

      <Button onClick={handleConfirm} disabled={!isValid} className="w-full">
        Confirm Cash Payment
      </Button>
    </div>
  );
};
