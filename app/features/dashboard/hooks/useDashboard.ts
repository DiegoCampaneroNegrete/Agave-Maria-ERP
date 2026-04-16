'use client';

import { useEffect, useState } from 'react';
import { getSummary, getTopProducts, getSalesByMethod } from '../service';
import { DashboardSummary, SalesByMethod, TopProduct } from '../types';

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [salesByMethod, setSalesByMethod] = useState<SalesByMethod[]>([]);

  useEffect(() => {
    const loadEffect = async () => {
    const s = await getSummary();
    const t = await getTopProducts();
    const m = await getSalesByMethod();

    setSalesByMethod(m)
    setSummary(s);
    setTopProducts(t);
  };
  
    loadEffect();
  }, []);

  const load = async () => {
    const s = await getSummary();
    const t = await getTopProducts();
    const m = await getSalesByMethod();

    setSummary(s);
    setTopProducts(t);
    setSalesByMethod(m)
  };

  return {
    summary,
    topProducts,
    salesByMethod,
  };
};