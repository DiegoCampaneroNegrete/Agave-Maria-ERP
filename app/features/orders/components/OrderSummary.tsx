// /features/orders/components/OrderSummary.tsx

'use client';

export const OrderSummary = ({ total, onCheckout }: { total: number; onCheckout: () => void }) => {
  return (
    <div className="mt-4">
      <div className="text-xl font-bold">
        Total: ${total}
      </div>

      <button
        onClick={onCheckout}
        className="mt-2 w-full bg-green-600 p-3 rounded-xl"
      >
        Cobrar
      </button>
    </div>
  );
};