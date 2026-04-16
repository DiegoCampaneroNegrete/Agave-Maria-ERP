import { useSetAtom, useAtomValue } from 'jotai';
import { paymentMethodAtom, checkoutErrorAtom } from '../../atoms';
import Button from '@/app/components/ui/Button';

interface Props {
  onMethodSelected: () => void;
}

export const PaymentMethodSelector = ({ onMethodSelected }: Props) => {
  const setPaymentMethod = useSetAtom(paymentMethodAtom);
  const selectedMethod = useAtomValue(paymentMethodAtom);
  const error = useAtomValue(checkoutErrorAtom);

  const handleSelect = (method: 'cash' | 'card' | 'mixed') => {
    setPaymentMethod(method);
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onMethodSelected();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Payment Method</h2>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <button
          onClick={() => handleSelect('cash')}
          className={`p-4 rounded border-2 transition ${
            selectedMethod === 'cash'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300'
          }`}
        >
          💵 Cash
        </button>

        <button
          onClick={() => handleSelect('card')}
          className={`p-4 rounded border-2 transition ${
            selectedMethod === 'card'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300'
          }`}
        >
          💳 Card
        </button>

        <button
          onClick={() => handleSelect('mixed')}
          className={`p-4 rounded border-2 transition ${
            selectedMethod === 'mixed'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300'
          }`}
        >
          🔀 Mixed
        </button>
      </div>

      <Button onClick={handleConfirm} disabled={!selectedMethod} className="w-full">
        Continue
      </Button>
    </div>
  );
};
