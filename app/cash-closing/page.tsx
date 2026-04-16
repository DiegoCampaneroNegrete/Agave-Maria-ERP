'use client';

import { useCashClosing } from '@/features/cash/hooks/useCashClosing';
import { CashSummary } from '@/features/cash/components/CashSummary';
import { CashForm } from '@/features/cash/components/CashForm';

export default function CashClosingPage() {
  const {
    summary,
    counted,
    setCounted,
    difference,
    submit,
    cashSales,
    cardSales,
  } = useCashClosing();

  return (
    <div className="space-y-4 max-w-md mx-auto">

      <h1 className="text-2xl font-bold">
        Corte de caja
      </h1>

      <CashSummary 
        summary={summary}
        cashSales={cashSales}
        cardSales={cardSales}
      />

      <CashForm
        counted={counted}
        setCounted={setCounted}
        difference={difference}
        onSubmit={submit}
      />

    </div>
  );
}