import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { reportsService } from '../services/reports.service';
import type { MonthlySummary, CategorySummary, TrendPoint } from '../services/reports.service';

export type ReportPeriod = '3M' | '6M' | '1A';

const PERIOD_MONTHS: Record<ReportPeriod, number> = { '3M': 3, '6M': 6, '1A': 12 };

/** Format a Date as 'YYYY-MM-DD' using local time (avoids UTC off-by-one). */
function toLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDateRange(months: number): { startDate: string; endDate: string; currentMonth: string } {
  const now = new Date();
  const endDate = toLocalDate(now);
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const startDate = toLocalDate(start);
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return { startDate, endDate, currentMonth };
}

/** month: 'YYYY-MM' to pin to a specific month; '' to use the period range */
export function useReports(period: ReportPeriod, month = '') {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    const months = PERIOD_MONTHS[period];
    const { startDate, endDate, currentMonth } = getDateRange(months);

    // When a specific month is selected, narrow the date range to that month
    const activeMonth = month || currentMonth;
    const categoryStart = month ? `${month}-01` : startDate;
    const categoryEnd = month
      ? (() => {
          const [y, m] = month.split('-').map(Number);
          // day 0 of next month = last day of current month
          return toLocalDate(new Date(y, m, 0));
        })()
      : endDate;

    setLoading(true);
    setError(null);

    Promise.all([
      reportsService.getMonthlySummary(activeMonth),
      reportsService.getByCategory(categoryStart, categoryEnd),
      reportsService.getTrend(months),
    ])
      .then(([summaryRes, categoryRes, trendRes]) => {
        if (!cancelled) {
          setSummary(summaryRes.data.data ?? null);
          setCategoryData(categoryRes.data.data ?? []);
          setTrendData(trendRes.data.data ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            axios.isAxiosError(err) && err.response?.data?.message
              ? err.response.data.message
              : 'Error al cargar los reportes';
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [period, month, tick]);

  return { summary, trendData, categoryData, loading, error, refetch };
}
