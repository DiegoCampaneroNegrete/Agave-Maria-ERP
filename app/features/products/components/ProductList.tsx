'use client';

import { Product } from "../types";

export const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <div className="space-y-2">
      {products.map((p) => (
        <div
          key={p.id}
          className="flex justify-between p-3 rounded-xl shadow"
        >
          <span>{p.name}</span>
          <span className="font-bold">${p.price}</span>
        </div>
      ))}
    </div>
  );
};