import { useState } from 'react';
import type { TrendPoint, CategorySummary } from '../services/reports.service';
import { ExpensesByCategoryChart } from '../components/charts/ExpensesByCategoryChart';
import { MonthlyBalanceChart } from '../components/charts/MonthlyBalanceChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TREND_3M: TrendPoint[] = [
  { month: 'May 2024', income: 15000, expense: 7800 },
  { month: 'Jun 2024', income: 16500, expense: 9200 },
  { month: 'Jul 2024', income: 15000, expense: 8450 },
];

const TREND_6M: TrendPoint[] = [
  { month: 'Feb 2024', income: 14000, expense: 6500 },
  { month: 'Mar 2024', income: 14500, expense: 7100 },
  { month: 'Abr 2024', income: 15000, expense: 8000 },
  { month: 'May 2024', income: 15000, expense: 7800 },
  { month: 'Jun 2024', income: 16500, expense: 9200 },
  { month: 'Jul 2024', income: 15000, expense: 8450 },
];

const TREND_1Y: TrendPoint[] = [
  { month: 'Ago 2023', income: 12000, expense: 5500 },
  { month: 'Sep 2023', income: 12500, expense: 6000 },
  { month: 'Oct 2023', income: 13000, expense: 6800 },
  { month: 'Nov 2023', income: 13000, expense: 7200 },
  { month: 'Dic 2023', income: 18000, expense: 11000 },
  { month: 'Ene 2024', income: 14000, expense: 6200 },
  { month: 'Feb 2024', income: 14000, expense: 6500 },
  { month: 'Mar 2024', income: 14500, expense: 7100 },
  { month: 'Abr 2024', income: 15000, expense: 8000 },
  { month: 'May 2024', income: 15000, expense: 7800 },
  { month: 'Jun 2024', income: 16500, expense: 9200 },
  { month: 'Jul 2024', income: 15000, expense: 8450 },
];

const CATEGORIES_3M: CategorySummary[] = [
  { categoryId: '1', categoryName: 'Comida', total: 9200, categoryColor: '#f97316' },
  { categoryId: '2', categoryName: 'Transporte', total: 4800, categoryColor: '#3b82f6' },
  { categoryId: '3', categoryName: 'Entretenimiento', total: 2600, categoryColor: '#a855f7' },
  { categoryId: '4', categoryName: 'Salud', total: 1650, categoryColor: '#22c55e' },
];

const CATEGORIES_6M: CategorySummary[] = [
  { categoryId: '1', categoryName: 'Comida', total: 18400, categoryColor: '#f97316' },
  { categoryId: '2', categoryName: 'Transporte', total: 9600, categoryColor: '#3b82f6' },
  { categoryId: '3', categoryName: 'Entretenimiento', total: 5200, categoryColor: '#a855f7' },
  { categoryId: '4', categoryName: 'Salud', total: 3200, categoryColor: '#22c55e' },
  { categoryId: '5', categoryName: 'Servicios', total: 7200, categoryColor: '#eab308' },
];

const CATEGORIES_1Y: CategorySummary[] = [
  { categoryId: '1', categoryName: 'Comida', total: 36800, categoryColor: '#f97316' },
  { categoryId: '2', categoryName: 'Transporte', total: 19200, categoryColor: '#3b82f6' },
  { categoryId: '3', categoryName: 'Entretenimiento', total: 10400, categoryColor: '#a855f7' },
  { categoryId: '4', categoryName: 'Salud', total: 6400, categoryColor: '#22c55e' },
  { categoryId: '5', categoryName: 'Servicios', total: 14400, categoryColor: '#eab308' },
  { categoryId: '6', categoryName: 'Ropa', total: 4800, categoryColor: '#ec4899' },
];

type Period = '3M' | '6M' | '1A';

const TREND_DATA: Record<Period, TrendPoint[]> = { '3M': TREND_3M, '6M': TREND_6M, '1A': TREND_1Y };
const CATEGORY_DATA: Record<Period, CategorySummary[]> = { '3M': CATEGORIES_3M, '6M': CATEGORIES_6M, '1A': CATEGORIES_1Y };

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [period, setPeriod] = useState<Period>('6M');

  const trendData = TREND_DATA[period];
  const categoryData = CATEGORY_DATA[period];

  const btnClass = (p: Period) =>
    `px-4 py-1.5 text-sm rounded-full border transition-colors ${
      period === p
        ? 'bg-primary text-primary-foreground border-primary'
        : 'border-border hover:bg-muted'
    }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reportes</h1>
        {/* Period selector */}
        <div className="flex gap-2">
          <button className={btnClass('3M')} onClick={() => setPeriod('3M')}>3M</button>
          <button className={btnClass('6M')} onClick={() => setPeriod('6M')}>6M</button>
          <button className={btnClass('1A')} onClick={() => setPeriod('1A')}>1A</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Doughnut */}
        <div className="border border-border rounded-xl bg-card p-5">
          <h2 className="text-base font-semibold mb-4">Gastos por categoría</h2>
          <ExpensesByCategoryChart data={categoryData} />
        </div>

        {/* Bar */}
        <div className="border border-border rounded-xl bg-card p-5">
          <h2 className="text-base font-semibold mb-4">Ingresos vs Gastos</h2>
          <MonthlyBalanceChart data={trendData} />
        </div>
      </div>

      {/* Line */}
      <div className="border border-border rounded-xl bg-card p-5">
        <h2 className="text-base font-semibold mb-4">Tendencia</h2>
        <TrendLineChart data={trendData} />
      </div>
    </div>
  );
}
