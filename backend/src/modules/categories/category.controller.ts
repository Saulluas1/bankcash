import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { successResponse } from '../../shared/utils/response';

const categoryService = new CategoryService();

// GET /api/categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await categoryService.findByUser(req.user!.userId);
  res.status(200).json(successResponse(categories));
};

// POST /api/categories
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await categoryService.create(req.user!.userId, req.body);
  res.status(201).json(successResponse(category, 'Category created'));
};

// PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const category = await categoryService.update(req.user!.userId, req.params.id, req.body);
  res.status(200).json(successResponse(category, 'Category updated'));
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  await categoryService.remove(req.user!.userId, req.params.id);
  res.status(200).json(successResponse(null, 'Category deleted'));
};
