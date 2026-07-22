import { AppDataSource } from '../../data-source';
import { Transaction, TransactionType } from '../transactions/transaction.entity';

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  categoryName: string;
  categoryColor: string | null;
  total: number;
}

export interface TrendPoint {
  month: string; // 'YYYY-MM'
  income: number;
  expense: number;
}

export class ReportsService {
  async getMonthlySummary(userId: string, month: string): Promise<MonthlySummary> {
    // month format: 'YYYY-MM'
    const startDate = `${month}-01`;
    // Last day of the month: first day of next month minus 1 day
    const [year, mon] = month.split('-').map(Number);
    const nextMonth = mon === 12 ? `${year + 1}-01-01` : `${year}-${String(mon + 1).padStart(2, '0')}-01`;

    const transactionRepo = AppDataSource.getRepository(Transaction);

    const raw = await transactionRepo
      .createQueryBuilder('t')
      .select(`SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END)`, 'income')
      .addSelect(`SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)`, 'expense')
      .where('t.userId = :userId', { userId })
      .andWhere('t.date >= :startDate', { startDate })
      .andWhere('t.date < :nextMonth', { nextMonth })
      .getRawOne<{ income: string; expense: string }>();

    const income = Number(raw?.income ?? 0);
    const expense = Number(raw?.expense ?? 0);

    return { income, expense, balance: income - expense };
  }

  async getByCategory(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<CategorySummary[]> {
    const transactionRepo = AppDataSource.getRepository(Transaction);

    const rows = await transactionRepo
      .createQueryBuilder('t')
      .innerJoin('t.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('category.color', 'categoryColor')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.userId = :userId', { userId })
      .andWhere('t.type = :type', { type: TransactionType.EXPENSE })
      .andWhere('t.date >= :startDate', { startDate })
      .andWhere('t.date <= :endDate', { endDate })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.color')
      .orderBy('total', 'DESC')
      .getRawMany<{ categoryName: string; categoryColor: string | null; total: string }>();

    return rows.map((r) => ({
      categoryName: r.categoryName,
      categoryColor: r.categoryColor,
      total: Number(r.total),
    }));
  }

  async getTrend(userId: string, months: number): Promise<TrendPoint[]> {
    const transactionRepo = AppDataSource.getRepository(Transaction);

    // Build start date: first day of `months` months ago (use local time to avoid UTC off-by-one)
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    const y = start.getFullYear();
    const mo = String(start.getMonth() + 1).padStart(2, '0');
    const startDate = `${y}-${mo}-01`;

    const rows = await transactionRepo
      .createQueryBuilder('t')
      .select(`TO_CHAR(t.date, 'YYYY-MM')`, 'month')
      .addSelect(`SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END)`, 'income')
      .addSelect(`SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)`, 'expense')
      .where('t.userId = :userId', { userId })
      .andWhere('t.date >= :startDate', { startDate })
      .groupBy(`TO_CHAR(t.date, 'YYYY-MM')`)
      .orderBy('month', 'ASC')
      .getRawMany<{ month: string; income: string; expense: string }>();

    return rows.map((r) => ({
      month: r.month,
      income: Number(r.income),
      expense: Number(r.expense),
    }));
  }
}
