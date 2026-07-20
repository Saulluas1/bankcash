import api from './api';
import type { ApiResponse } from '../types/api.types';
import type { Category, CreateCategoryPayload } from '../types/category.types';

export const categoriesService = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  create: (payload: CreateCategoryPayload) =>
    api.post<ApiResponse<Category>>('/categories', payload),

  update: (id: string, payload: Partial<CreateCategoryPayload>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, payload),

  remove: (id: string) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),
};
