import { useState } from 'react';
import { useReports, type ReportPeriod } from '../hooks/useReports';
import { ExpensesByCategoryChart } from '../components/charts/ExpensesByCategoryChart';
import { MonthlyBalanceChart } from '../components/charts/MonthlyBalanceChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

export function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('6M');
  const { trendData, categoryData, loading, error } = useReports(period);

  const btnClass = (p: ReportPeriod) =>
    `px-4 py-1.5 text-sm rounded-full border transition-colors ${
      period === p
        ? 'bg-primary text-primary-foreground border-primary'
        : 'border-border hover:bg-muted'
    }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <div className="flex gap-2">
          <button className={btnClass('3M')} onClick={() => setPeriod('3M')}>3M</button>
          <button className={btnClass('6M')} onClick={() => setPeriod('6M')}>6M</button>
          <button className={btnClass('1A')} onClick={() => setPeriod('1A')}>1A</button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="border border-border rounded-xl bg-card p-5">
              <h2 className="text-base font-semibold mb-4">Gastos por categoría</h2>
              <ExpensesByCategoryChart data={categoryData} />
            </div>

            <div className="border border-border rounded-xl bg-card p-5">
              <h2 className="text-base font-semibold mb-4">Ingresos vs Gastos</h2>
              <MonthlyBalanceChart data={trendData} />
            </div>
          </div>

          <div className="border border-border rounded-xl bg-card p-5">
            <h2 className="text-base font-semibold mb-4">Tendencia</h2>
            <TrendLineChart data={trendData} />
          </div>
        </>
      )}
    </div>
  );
}
