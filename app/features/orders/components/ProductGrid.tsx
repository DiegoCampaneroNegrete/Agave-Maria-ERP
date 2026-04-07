/* eslint-disable @typescript-eslint/no-explicit-any */
// /features/orders/components/ProductGrid.tsx

'use client';

export const ProductGrid = ({ products, onAdd }: { products: any[]; onAdd: (product: any) => void }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {products.map(p => (
        <button
          key={p.id}
          onClick={() => onAdd(p)}
          className="p-4 bg-zinc-800 text-white rounded-xl"
        >
          <div className="font-bold">{p.name}</div>
          <div>${p.price}</div>
        </button>
      ))}
    </div>
  );
};