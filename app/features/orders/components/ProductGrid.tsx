'use client';

import { Product } from '@/features/products/types';

interface Props {
  products: Product[];
  onAdd: (p: Product) => void;
}

export const ProductGrid = ({ products, onAdd }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {products.map(p => (
        <button
          key={p.id}
          onClick={() => onAdd(p)}
          className="
            bg-amber-500
            bg-app-card
            hover:bg-app-hover
            p-4
            rounded-xl
            text-left
            active:scale-95
          "
        >
          <div className="font-semibold">{p.name}</div>
          <div className="text-app-muted">${p.price}</div>
        </button>
      ))}
    </div>
  );
};