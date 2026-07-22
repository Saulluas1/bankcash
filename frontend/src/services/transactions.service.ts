import api from './api';
import type { ApiResponse } from '../types/api.types';
import type { Transaction, CreateTransactionPayload, TransactionFilters } from '../types/transaction.types';

export interface TransactionPage {
  data: Transaction[];
  meta: { total: number; page: number; limit: number };
}

export const transactionsService = {
  getAll: (filters?: TransactionFilters) =>
    api.get<ApiResponse<TransactionPage>>('/transactions', { params: filters }),

  getOne: (id: string) =>
    api.get<ApiResponse<Transaction>>(`/transactions/${id}`),

  create: (payload: CreateTransactionPayload) =>
    api.post<ApiResponse<Transaction>>('/transactions', payload),

  update: (id: string, payload: Partial<CreateTransactionPayload>) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${id}`, payload),

  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/transactions/${id}`),
};
