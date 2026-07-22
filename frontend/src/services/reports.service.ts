import api from './api';
import type { ApiResponse } from '../types/api.types';

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  total: number;
}

export interface TrendPoint {
  month: string;
  income: number;
  expense: number;
}

export const reportsService = {
  getMonthlySummary: (month: string) =>
    api.get<ApiResponse<MonthlySummary>>('/reports/summary', { params: { month } }),

  getByCategory: (startDate: string, endDate: string) =>
    api.get<ApiResponse<CategorySummary[]>>('/reports/by-category', {
      params: { startDate, endDate },
    }),

  getTrend: (months = 6) =>
    api.get<ApiResponse<TrendPoint[]>>('/reports/trend', { params: { months } }),
};
