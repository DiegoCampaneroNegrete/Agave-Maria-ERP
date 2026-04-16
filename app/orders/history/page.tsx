'use client';

import { useOrders } from '@/features/orders/hooks/useOrders';
import { OrderList } from '@/features/orders/components/OrderList';
import { OrderDetail } from '@/features/orders/components/OrderDetail';

export default function OrdersHistoryPage() {
  const { orders, selected, items, selectOrder } = useOrders();

  return (
    <div className="grid md:grid-cols-[1fr_1fr] gap-4">
      
      {/* Lista */}
      <OrderList
        orders={orders}
        onSelect={selectOrder}
      />

      {/* Detalle */}
      <OrderDetail
        order={selected}
        items={items}
      />
    </div>
  );
}