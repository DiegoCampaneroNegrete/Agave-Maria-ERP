'use client';

import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { SummaryCards } from '@/features/dashboard/components/SummaryCards';
import { TopProducts } from '@/features/dashboard/components/TopProducts';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const { summary, topProducts, salesByMethod } = useDashboard();
  //   const expectedCash = cashSales;
  // const difference = counted - expectedCash;

  return (
    <div className="space-y-4">
      
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <SummaryCards data={summary} />

      <TopProducts products={topProducts} />

      <Card>
        <div className="space-y-2">
          <div className="font-bold">Métodos de pago</div>

          {salesByMethod.map(m => (
            <div key={m.payment_method} className="flex justify-between">
              <span>{m.payment_method}</span>
              <span>${m.total}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}