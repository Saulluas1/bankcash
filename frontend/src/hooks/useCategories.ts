import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { categoriesService } from '../services/categories.service';
import type { Category, CreateCategoryPayload } from '../types/category.types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    categoriesService
      .getAll()
      .then(({ data }) => {
        if (!cancelled) setCategories(data.data ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : 'Error al cargar las categorías';
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const createCategory = useCallback(async (payload: CreateCategoryPayload) => {
    try {
      const { data } = await categoriesService.create(payload);
      const created = data.data;
      if (created) setCategories((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error al crear la categoría';
      throw new Error(message);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await categoriesService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error al eliminar la categoría';
      throw new Error(message);
    }
  }, []);

  return { categories, loading, error, createCategory, deleteCategory };
}
