import { useAtomValue } from 'jotai';
import { checkoutOrderAtom } from '../../atoms';
import Button from '@/app/components/ui/Button';

interface Props {
  onCheckout: () => void;
}

export const CheckoutSummary = ({ onCheckout }: Props) => {
  const order = useAtomValue(checkoutOrderAtom);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Order Summary</h2>

      {/* Items list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.name} x{item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-3 space-y-1 text-sm">
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
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={onCheckout} className="w-full">
        Checkout
      </Button>
    </div>
  );
};
