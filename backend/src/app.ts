import express, { Application } from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import categoryRoutes from './modules/categories/category.routes';
import transactionRoutes from './modules/transactions/transaction.routes';
import reportRoutes from './modules/reports/reports.routes';

const app: Application = express();

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global error handler (must be last) ────────────────────────────────────
app.use(errorMiddleware);

export default app;
