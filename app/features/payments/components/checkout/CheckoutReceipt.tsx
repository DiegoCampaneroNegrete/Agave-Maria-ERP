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
  onClose: () => void;
  onPrint?: () => void;
}

export const CheckoutReceipt = ({ onClose, onPrint }: Props) => {
  const order = useAtomValue(checkoutOrderAtom);
  const paymentMethod = useAtomValue(paymentMethodAtom);
  const cashReceived = useAtomValue(cashReceivedAtom);
  const cardAmount = useAtomValue(cardAmountAtom);
  const change = useAtomValue(changeAtom);

  const now = new Date();
  const receiptId = `REC-${now.getTime()}`;

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">✓ Payment Complete</h2>
      </div>

      {/* Receipt */}
      <div className="border-2 border-dashed border-gray-400 p-4 font-mono text-sm bg-white">
        <div className="text-center mb-3">
          <div className="font-bold">RECEIPT</div>
          <div className="text-xs text-gray-600">{receiptId}</div>
        </div>

        <div className="border-b border-gray-300 py-2">
          <div className="text-xs text-gray-600 text-center">
            {now.toLocaleString()}
          </div>
        </div>

        {/* Items */}
        <div className="py-2 space-y-1 text-xs">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {item.name} x{item.qty}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 py-2 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-b border-gray-300 py-2 font-bold">
          <div className="flex justify-between">
            <span>TOTAL</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="py-2 text-xs space-y-1">
          {paymentMethod === 'cash' && (
            <>
              <div className="flex justify-between">
                <span>Cash</span>
                <span>${cashReceived.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-700 font-bold">
                <span>Change</span>
                <span>${change.toFixed(2)}</span>
              </div>
            </>
          )}
          {paymentMethod === 'card' && (
            <div className="flex justify-between">
              <span>Card</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          )}
          {paymentMethod === 'mixed' && (
            <>
              <div className="flex justify-between">
                <span>Cash</span>
                <span>${cashReceived.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Card</span>
                <span>${cardAmount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-300 pt-2 text-center text-xs">
          <div>Thank you!</div>
          <div className="text-gray-600">Come again soon</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {onPrint && (
          <Button
            onClick={onPrint}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Print Receipt
          </Button>
        )}
        <Button onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-700">
          Close & New Order
        </Button>
      </div>
    </div>
  );
};
