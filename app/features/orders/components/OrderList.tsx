'use client';

import { Order } from '../types';
import { Card } from '@/components/ui/Card';

interface Props {
  orders: Order[];
  onSelect: (o: Order) => void;
}

export const OrderList = ({ orders, onSelect }: Props) => {
  return (
    <div className="space-y-2">
      {orders.map(o => (
        <Card
          key={o.id}
          className="cursor-pointer hover:bg-app-hover"
          onClick={() => onSelect(o)}
        >
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">
                Orden #{o.id.slice(0, 6)}
              </div>
              <div className="text-sm text-app-muted">
                {new Date(o.created_at).toLocaleString()}
              </div>
            </div>

            <div className="font-bold text-green-400">
              ${o.total}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};