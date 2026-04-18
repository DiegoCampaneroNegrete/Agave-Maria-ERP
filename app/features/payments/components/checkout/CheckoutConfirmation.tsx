import { useAtomValue } from 'jotai';
import {
  checkoutOrderAtom,
  paymentMethodAtom,
  cashReceivedAtom,
  cardAmountAtom,
  changeAtom,
} from '../../atoms';
import { Button } from '@/components/ui/Button';

interface Props {
  onConfirm: () => void;
  onEdit: () => void;
  isProcessing?: boolean;
}

export const CheckoutConfirmation = ({ onConfirm, onEdit, isProcessing }: Props) => {
  const order = useAtomValue(checkoutOrderAtom);
  const paymentMethod = useAtomValue(paymentMethodAtom);
  const cashReceived = useAtomValue(cashReceivedAtom);
  const cardAmount = useAtomValue(cardAmountAtom);
  const change = useAtomValue(changeAtom);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Confirm Payment</h2>

      {/* Order Total */}
      <div className="bg-gray-50 p-3 rounded">
        <div className="text-sm text-gray-600">Order Total</div>
        <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
      </div>

      {/* Payment Breakdown */}
      <div className="space-y-3 p-3 bg-blue-50 rounded">
        {paymentMethod === 'cash' && (
          <>
            <div className="flex justify-between">
              <span>Cash Received</span>
              <span className="font-bold">${cashReceived.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-green-700 font-bold">
              <span>Change</span>
              <span>${change.toFixed(2)}</span>
            </div>
          </>
        )}

        {paymentMethod === 'card' && (
          <div className="flex justify-between">
            <span>Card Charge</span>
            <span className="font-bold">${order.total.toFixed(2)}</span>
          </div>
        )}

        {paymentMethod === 'mixed' && (
          <>
            <div className="flex justify-between">
              <span>Cash</span>
              <span className="font-bold">${cashReceived.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Card</span>
              <span className="font-bold">${cardAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Total</span>
              <span className="font-bold">
                ${(cashReceived + cardAmount).toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Payment Method Badge */}
      <div className="text-center p-2 bg-gray-100 rounded text-sm font-medium">
        {paymentMethod === 'cash' && '💵 Cash Payment'}
        {paymentMethod === 'card' && '💳 Card Payment'}
        {paymentMethod === 'mixed' && '🔀 Mixed Payment'}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={onConfirm} 
          disabled={isProcessing}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? 'Processing...' : 'Complete Payment'}
        </Button>
        <Button
          onClick={onEdit}
          disabled={isProcessing}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};
