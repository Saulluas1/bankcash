import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from './category.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET    /api/categories
router.get('/', getCategories);

// POST   /api/categories
router.post('/', createCategory);

// PUT    /api/categories/:id
router.put('/:id', updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', deleteCategory);

export default router;
