import { Request, Response } from 'express';
import { ReportsService } from './reports.service';
import { successResponse } from '../../shared/utils/response';

const reportsService = new ReportsService();

// GET /api/reports/summary?month=2024-06
export const getMonthlySummary = async (req: Request, res: Response): Promise<void> => {
  const { month } = req.query;
  const summary = await reportsService.getMonthlySummary(req.user!.userId, month as string);
  res.status(200).json(successResponse(summary));
};

// GET /api/reports/by-category?startDate=...&endDate=...
export const getByCategory = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.query;
  const data = await reportsService.getByCategory(
    req.user!.userId,
    startDate as string,
    endDate as string
  );
  res.status(200).json(successResponse(data));
};

// GET /api/reports/trend?months=6
export const getTrend = async (req: Request, res: Response): Promise<void> => {
  const months = Number(req.query.months) || 6;
  const trend = await reportsService.getTrend(req.user!.userId, months);
  res.status(200).json(successResponse(trend));
};
