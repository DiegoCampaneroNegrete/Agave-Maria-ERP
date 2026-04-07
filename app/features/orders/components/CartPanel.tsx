/* eslint-disable @typescript-eslint/no-explicit-any */
// /features/orders/components/CartPanel.tsx

'use client';

export const CartPanel = ({ cart, onAdd, onRemove }: { cart: any; onAdd: (item: any) => void; onRemove: (product_id: string) => void } ) => {
  return (
    <div className="space-y-2">
      {cart.map((item: any) => (
        <div
          key={item.id}
          className="flex justify-between bg-zinc-900 p-2 rounded"
        >
          <div>
            {item.name} x{item.quantity}
          </div>

          <div className="flex gap-2">
            <button onClick={() => onAdd(item)}>+</button>
            <button onClick={() => onRemove(item.product_id)}>-</button>
          </div>
        </div>
      ))}
    </div>
  );
};