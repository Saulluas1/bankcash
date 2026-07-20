import { useState, useEffect } from 'react';
import { transactionsService } from '../services/transactions.service';
import type { Transaction, TransactionFilters } from '../types/transaction.types';

export function useTransactions(filters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await transactionsService.getAll(filters);
      setTransactions(data.data ?? []);
    } catch {
      setError('Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { transactions, loading, error, refetch: fetchTransactions };
}
