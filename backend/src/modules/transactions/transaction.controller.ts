import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { successResponse } from '../../shared/utils/response';

const transactionService = new TransactionService();

const ISO_DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && ISO_DATE_RE.test(value);
}

// GET /api/transactions
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  // Supports query params: ?page=1&limit=20&type=expense&categoryId=...&startDate=...&endDate=...
  const { startDate, endDate } = req.query;

  if (startDate !== undefined && !isValidDate(startDate)) {
    res.status(400).json({ success: false, message: 'startDate debe tener formato YYYY-MM-DD' });
    return;
  }
  if (endDate !== undefined && !isValidDate(endDate)) {
    res.status(400).json({ success: false, message: 'endDate debe tener formato YYYY-MM-DD' });
    return;
  }

  const transactions = await transactionService.findByUser(req.user!.userId, req.query);
  res.status(200).json(successResponse(transactions));
};

// GET /api/transactions/:id
export const getTransaction = async (req: Request, res: Response): Promise<void> => {
  const transaction = await transactionService.findOne(req.user!.userId, req.params.id);
  res.status(200).json(successResponse(transaction));
};

// POST /api/transactions
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  const transaction = await transactionService.create(req.user!.userId, req.body);
  res.status(201).json(successResponse(transaction, 'Transaction created'));
};

// PUT /api/transactions/:id
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  const transaction = await transactionService.update(req.user!.userId, req.params.id, req.body);
  res.status(200).json(successResponse(transaction, 'Transaction updated'));
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  await transactionService.remove(req.user!.userId, req.params.id);
  res.status(200).json(successResponse(null, 'Transaction deleted'));
};
