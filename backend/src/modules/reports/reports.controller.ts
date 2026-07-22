import { Request, Response } from 'express';
import { ReportsService } from './reports.service';
import { successResponse } from '../../shared/utils/response';

const reportsService = new ReportsService();

// Regex for YYYY-MM
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
// Regex for YYYY-MM-DD
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function isValidMonth(monthStr: string): boolean {
  return MONTH_RE.test(monthStr);
}

function isValidDate(dateStr: string): boolean {
  if (!DATE_RE.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

// GET /api/reports/summary?month=2024-06
export const getMonthlySummary = async (req: Request, res: Response): Promise<void> => {
  const { month } = req.query;
  if (!month || typeof month !== 'string' || !isValidMonth(month)) {
    res.status(400).json({ success: false, message: 'month inválido. Formato: YYYY-MM' });
    return;
  }
  const summary = await reportsService.getMonthlySummary(req.user!.userId, month);
  res.status(200).json(successResponse(summary));
};

// GET /api/reports/by-category?startDate=...&endDate=...
export const getByCategory = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.query;
  if (!startDate || typeof startDate !== 'string' || !isValidDate(startDate)) {
    res.status(400).json({ success: false, message: 'startDate inválido. Formato: YYYY-MM-DD' });
    return;
  }
  if (!endDate || typeof endDate !== 'string' || !isValidDate(endDate)) {
    res.status(400).json({ success: false, message: 'endDate inválido. Formato: YYYY-MM-DD' });
    return;
  }
  const data = await reportsService.getByCategory(req.user!.userId, startDate, endDate);
  res.status(200).json(successResponse(data));
};

// GET /api/reports/trend?months=6
export const getTrend = async (req: Request, res: Response): Promise<void> => {
  const months = Number(req.query.months) || 6;
  const trend = await reportsService.getTrend(req.user!.userId, months);
  res.status(200).json(successResponse(trend));
};
