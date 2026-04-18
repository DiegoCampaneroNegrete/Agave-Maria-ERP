'use client';

import { TopProduct } from '../types';
import { Card } from '@/components/ui/Card';

interface Props {
  products: TopProduct[];
}

export const TopProducts = ({ products }: Props) => {
  return (
    <Card>
      <div className="font-bold mb-2">🔥 Más vendidos</div>

      <div className="space-y-2">
        {products.map(p => (
          <div key={p.name +"-" + p.product_id + "-" + p.quantity} className="flex justify-between">
            <span>{p.name}</span>
            <span className="text-app-muted">
              {p.quantity} vendidos
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};