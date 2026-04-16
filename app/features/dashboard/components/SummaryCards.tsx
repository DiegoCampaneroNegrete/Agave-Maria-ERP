'use client';

import { DashboardSummary } from '../types';
import { Card } from '@/components/ui/Card';

interface Props {
  data: DashboardSummary | null;
}

export const SummaryCards = ({ data }: Props) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      
      <Card>
        <div className="text-sm text-app-muted">Ventas</div>
        <div className="text-xl font-bold text-green-400">
          ${data.totalSales}
        </div>
      </Card>

      <Card>
        <div className="text-sm text-app-muted">Órdenes</div>
        <div className="text-xl font-bold">
          {data.totalOrders}
        </div>
      </Card>

      <Card>
        <div className="text-sm text-app-muted">Ticket promedio</div>
        <div className="text-xl font-bold">
          ${data.avgTicket.toFixed(2)}
        </div>
      </Card>

    </div>
  );
};