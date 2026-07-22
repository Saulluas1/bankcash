import { useState } from 'react';
import { useReports, type ReportPeriod } from '../hooks/useReports';
import { ExpensesByCategoryChart } from '../components/charts/ExpensesByCategoryChart';
import { MonthlyBalanceChart } from '../components/charts/MonthlyBalanceChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

// Current month as 'YYYY-MM'
const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('6M');
  const [monthDraft, setMonthDraft] = useState(currentMonth());
  const [month, setMonth] = useState(currentMonth());
  const [monthError, setMonthError] = useState('');
  const { trendData, categoryData, loading, error } = useReports(period, month);

  function applyMonth() {
    if (!MONTH_RE.test(monthDraft)) {
      setMonthError('Formato inválido. Usa el selector o escribe AAAA-MM.');
      return;
    }
    setMonthError('');
    setMonth(monthDraft);
  }

  function clearMonth() {
    setMonthDraft('');
    setMonthError('');
    setMonth('');
  }

  const btnClass = (p: ReportPeriod) =>
    `px-4 py-1.5 text-sm rounded-full border transition-colors ${
      period === p
        ? 'bg-primary text-primary-foreground border-primary'
        : 'border-border hover:bg-muted'
    }`;

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reportes</h1>
          {/* Period buttons */}
          <div className="flex gap-2">
            <button className={btnClass('3M')} onClick={() => setPeriod('3M')}>3M</button>
            <button className={btnClass('6M')} onClick={() => setPeriod('6M')}>6M</button>
            <button className={btnClass('1A')} onClick={() => setPeriod('1A')}>1A</button>
          </div>
        </div>

        {/* Month picker row */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="month"
            value={monthDraft}
            onChange={(e) => setMonthDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyMonth()}
            className="px-3 py-1.5 text-sm rounded-full border border-border bg-background hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-auto"
          />
          <button
            onClick={applyMonth}
            disabled={!monthDraft}
            className="px-3 py-1.5 text-sm rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buscar
          </button>
          {monthError && (
            <span className="text-xs text-red-500 whitespace-nowrap">{monthError}</span>
          )}
          {month && (
            <button
              onClick={clearMonth}
              className="px-3 py-1.5 text-sm rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground"
            >
              Ver todos
            </button>
          )}
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
