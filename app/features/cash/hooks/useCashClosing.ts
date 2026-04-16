'use client';

import { useEffect, useState } from 'react';
import {
  getCashSummary,
  getCashBreakdown,
  saveCashClosing,
} from '../service';
import { CashBreakdown } from '../types';
// import { CashBreakdown } from '../types';

export const useCashClosing = () => {
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
  });

  const [breakdown, setBreakdown] = useState<CashBreakdown[]>([]);
  const [counted, setCounted] = useState<number>(0);

  useEffect(() => {
    const loadEffect = async () => {
      const s = await getCashSummary();
      const b = await getCashBreakdown();

      setSummary(s);
      setBreakdown(b);
    };

    loadEffect();
  }, []);

  const load = async () => {
    const s = await getCashSummary();
    const b = await getCashBreakdown();

    setSummary(s);
    setBreakdown(b);
  };

  // 🔥 EXTRAER VALORES
  const cashSales =
    breakdown.find(b => b.payment_method === 'cash')?.total || 0;

  const cardSales =
    breakdown.find(b => b.payment_method === 'card')?.total || 0;

  // 🔥 ESTA ES LA CLAVE
  const difference = counted - cashSales;

  const submit = async () => {
    await saveCashClosing(cashSales, counted);
    alert('✅ Corte guardado');
  };

  return {
    summary,
    breakdown,
    counted,
    setCounted,
    difference,
    cashSales,
    cardSales,
    submit,
  };
};