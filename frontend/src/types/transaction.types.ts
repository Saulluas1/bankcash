// ─── Transaction types ────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
  userId: string;
  createdAt: string;
}

export interface CreateTransactionPayload {
  amount: number;
  type: TransactionType;
  description?: string;
  date: string;
  categoryId?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}
