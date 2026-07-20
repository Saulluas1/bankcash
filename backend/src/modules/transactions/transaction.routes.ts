import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from './transaction.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET    /api/transactions
router.get('/', getTransactions);

// GET    /api/transactions/:id
router.get('/:id', getTransaction);

// POST   /api/transactions
router.post('/', createTransaction);

// PUT    /api/transactions/:id
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

export default router;
