import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { transactionsService } from '../services/transactions.service';
import type { Transaction, CreateTransactionPayload } from '../types/transaction.types';
// TransactionPage is the paginated wrapper returned by GET /api/transactions

export type TransactionFilter = 'all' | 'income' | 'expense';

export function useTransactions(filter: TransactionFilter = 'all') {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = filter !== 'all' ? { type: filter } : undefined;
    transactionsService
      .getAll(params)
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
  }, [filter, tick]);

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
