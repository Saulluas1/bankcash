import { Router } from 'express';
import { getMonthlySummary, getByCategory, getTrend } from './reports.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/reports/summary?month=YYYY-MM
router.get('/summary', getMonthlySummary);

// GET /api/reports/by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/by-category', getByCategory);

// GET /api/reports/trend?months=6
router.get('/trend', getTrend);

export default router;
