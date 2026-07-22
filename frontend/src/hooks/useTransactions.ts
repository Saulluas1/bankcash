import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { transactionsService } from '../services/transactions.service';
import type { Transaction, CreateTransactionPayload } from '../types/transaction.types';
// TransactionPage is the paginated wrapper returned by GET /api/transactions

export type TransactionFilter = 'all' | 'income' | 'expense';

/** month: 'YYYY-MM' or '' for all */
export function useTransactions(filter: TransactionFilter = 'all', month = '') {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params: Record<string, string> = {};
    if (filter !== 'all') params.type = filter;
    if (month) {
      const [y, m] = month.split('-').map(Number);
      params.startDate = `${month}-01`;
      // day 0 of next month = last day of current month; use local formatter
      const lastDate = new Date(y, m, 0);
      const lastDay = String(lastDate.getDate()).padStart(2, '0');
      params.endDate = `${month}-${lastDay}`;
    }
    transactionsService
      .getAll(Object.keys(params).length ? params : undefined)
      .then(({ data }) => {
        // data.data is { data: Transaction[], meta: {...} } — the paginated wrapper
        if (!cancelled) setTransactions(data.data?.data ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : 'Error al cargar las transacciones';
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [filter, month, tick]);

  const createTransaction = useCallback(async (payload: CreateTransactionPayload) => {
    try {
      const { data } = await transactionsService.create(payload);
      const created = data.data;
      if (created) setTransactions((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error al crear la transacción';
      throw new Error(message);
    }
  }, []);

  return { transactions, loading, error, createTransaction, refetch };
}
