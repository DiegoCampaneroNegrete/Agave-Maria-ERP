import { useAtomValue, useSetAtom } from 'jotai';
import { checkoutOrderAtom, cardAmountAtom } from '../../atoms';
import { Button } from '@/components/ui/Button';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export const CardPaymentInput = ({ onConfirm, onCancel }: Props) => {
  const order = useAtomValue(checkoutOrderAtom);
  const setCardAmount = useSetAtom(cardAmountAtom);

  const handleConfirm = () => {
    setCardAmount(order.total);
    onConfirm();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Card Payment</h2>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg space-y-4">
        <div className="text-sm opacity-80">TOTAL CHARGE</div>
        <div className="text-4xl font-bold">${order.total.toFixed(2)}</div>
        <div className="text-sm opacity-80">💳 Ready to process</div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>✓ Card will be charged for the full amount</p>
        <p>✓ No change to return</p>
        <p>✓ Receipt will be printed</p>
      </div>

      <div className="space-y-2">
        <Button onClick={handleConfirm} className="w-full bg-blue-600 hover:bg-blue-700">
          Process Card
        </Button>
        <Button
          onClick={onCancel}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
