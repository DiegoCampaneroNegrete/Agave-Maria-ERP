'use client';

import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export const CashSummary = ({ summary, cashSales, cardSales } : { summary: { totalSales: number; totalOrders: number }; cashSales: number; cardSales: number }) => {
  const [cash, setCash] = useState(0);
  const [card, setCard] = useState();
  return (
    <Card>
      <div className="space-y-2">

        <div>
          Ventas totales:
          <span className="font-bold text-green-400">
            ${summary.totalSales}
          </span>
        </div>

        <div className="text-sm text-app-muted">
          💵 Efectivo: ${cashSales}
        </div>

        <div className="text-sm text-app-muted">
          💳 Tarjeta: ${cardSales}
        </div>

        <div>
          Órdenes: {summary.totalOrders}
        </div>

      </div>
    </Card>
  );
};