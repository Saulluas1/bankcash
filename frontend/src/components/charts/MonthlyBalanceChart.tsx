import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { TrendPoint } from '../../services/reports.service';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MonthlyBalanceChartProps {
  data: TrendPoint[];
}

export function MonthlyBalanceChart({ data }: MonthlyBalanceChartProps) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Ingresos',
        data: data.map((d) => d.income),
        backgroundColor: '#22c55e',
      },
      {
        label: 'Gastos',
        data: data.map((d) => d.expense),
        backgroundColor: '#ef4444',
      },
    ],
  };

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      }}
    />
  );
}
