import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { CategorySummary } from '../../services/reports.service';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesByCategoryChartProps {
  data: CategorySummary[];
}

export function ExpensesByCategoryChart({ data }: ExpensesByCategoryChartProps) {
  const chartData = {
    labels: data.map((d) => d.categoryName),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((d) => d.categoryColor ?? '#6b7280'),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        }}
      />
    </div>
  );
}
