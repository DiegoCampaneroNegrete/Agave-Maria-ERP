'use client';

import { Order, OrderItem } from '../types';
import { Card } from '@/components/ui/Card';
import { groupItems } from '../utils/groupItems';

interface Props {
  order: Order | null;
  items: OrderItem[];
}

export const OrderDetail = ({ order, items }: Props) => {
  if (!order) {
    return (
      <div className="text-app-muted">
        Selecciona una orden
      </div>
    );
  }

  const grouped = groupItems(items);

  const groupedSorted= grouped.sort((a, b) => b.quantity - a.quantity);

  const totalItems = grouped.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card>
      <div className="space-y-3">
        
        <div className="font-bold text-lg">
          Orden #{order.id.slice(0, 6)}
        </div>

        {/* 🔥 ITEMS AGRUPADOS */}
        {groupedSorted.map(i => (
          <div key={i.product_id} className="flex justify-between">
            
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-app-muted">
                {i.quantity} x ${i.price}
              </div>
            </div>

            <div className="font-semibold">
              ${i.subtotal}
            </div>
            <div className="border-t border-dashed border-app-border my-2" />
          </div>
        ))}

        {/* TOTAL Items */}
        <div className="border-t border-app-border pt-2 font-bold text-lg">
          Total Items: ${totalItems}
        </div>


        {/* TOTAL */}
        <div className="border-t border-app-border pt-2 font-bold text-lg">
          Total: ${order.total}
        </div>

      </div>
    </Card>
  );
};