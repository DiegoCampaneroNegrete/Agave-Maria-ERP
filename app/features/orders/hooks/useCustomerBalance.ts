'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { customerBalancesAtom } from '@/features/payments/store';
import { CustomerBalance } from '@/features/payments/types';
import {
  getCustomerBalances,
  recordBalancePayment,
  getCustomerTotalOutstanding,
  settleCustomerBalance,
} from '@/features/payments/service';

/**
 * Hook: Manage customer-level balance tracking
 * Tracks: all outstanding balances for customer
 * Handles: partial payment settlement, balance queries
 */
export const useCustomerBalance = (customerId: string | undefined) => {
  const [balances, setBalances] = useAtom(customerBalancesAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load customer balances
  const loadBalances = useCallback(async () => {
    if (!customerId) {
      setBalances([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCustomerBalances(customerId);
      setBalances(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load balances';
      setError(msg);
      console.error('Load balances error:', err);
    } finally {
      setLoading(false);
    }
  }, [customerId, setBalances]);

  // Record payment toward balance
  const payBalance = useCallback(
    async (balanceId: string, amount: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await recordBalancePayment(balanceId, amount);
        // Reload balances to reflect updates
        await loadBalances();
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to record payment';
        setError(msg);
        console.error('Pay balance error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadBalances]
  );

  // Settle balance (after full payment)
  const settle = useCallback(
    async (balanceId: string, orderId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await settleCustomerBalance(balanceId, orderId);
        // Reload balances
        await loadBalances();
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to settle balance';
        setError(msg);
        console.error('Settle balance error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadBalances]
  );

  // Get total outstanding
  const getTotalOutstanding = useCallback(async (): Promise<number> => {
    if (!customerId) return 0;

    try {
      return await getCustomerTotalOutstanding(customerId);
    } catch (err) {
      console.error('Get total outstanding error:', err);
      return 0;
    }
  }, [customerId]);

  // Get pending balances (not settled)
  const getPendingBalances = useCallback((): CustomerBalance[] => {
    return balances.filter(b => b.status !== 'settled');
  }, [balances]);

  // Get settled balances
  const getSettledBalances = useCallback((): CustomerBalance[] => {
    return balances.filter(b => b.status === 'settled');
  }, [balances]);

  // Count pending balances
  const getPendingCount = useCallback((): number => {
    return getPendingBalances().length;
  }, [getPendingBalances]);

  // Calculate total pending amount
  const getPendingAmount = useCallback((): number => {
    return getPendingBalances().reduce((sum, b) => sum + (b.amount - b.paid_amount), 0);
  }, [getPendingBalances]);

  return {
    // State
    balances,
    loading,
    error,

    // Actions
    loadBalances,
    payBalance,
    settle,

    // Queries
    getTotalOutstanding,
    getPendingBalances,
    getSettledBalances,
    getPendingCount,
    getPendingAmount,
  };
};
