import type { Transaction } from '../types/transaction.types';
import type { CategorySummary } from '../services/reports.service';
import { TransactionCard } from '../components/shared/TransactionCard';
import { ExpensesByCategoryChart } from '../components/charts/ExpensesByCategoryChart';
import { formatCurrency } from '../lib/utils';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY_SUMMARY = { income: 15000, expense: 8450, balance: 6550 };

const CATEGORY_SUMMARY: CategorySummary[] = [
  { categoryId: '1', categoryName: 'Comida', total: 3200, categoryColor: '#f97316' },
  { categoryId: '2', categoryName: 'Transporte', total: 1800, categoryColor: '#3b82f6' },
  { categoryId: '3', categoryName: 'Entretenimiento', total: 950, categoryColor: '#a855f7' },
  { categoryId: '4', categoryName: 'Salud', total: 500, categoryColor: '#22c55e' },
];

const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 't1', amount: 15000, type: 'income', description: 'Salario mensual',
    date: '2024-07-01', categoryId: null, userId: 'mock', createdAt: '2024-07-01',
  },
  {
    id: 't2', amount: 3200, type: 'expense', description: 'Supermercado',
    date: '2024-07-05', categoryId: '1',
    category: { id: '1', name: 'Comida', color: '#f97316', icon: '🍔' },
    userId: 'mock', createdAt: '2024-07-05',
  },
  {
    id: 't3', amount: 800, type: 'expense', description: 'Gasolina',
    date: '2024-07-08', categoryId: '2',
    category: { id: '2', name: 'Transporte', color: '#3b82f6', icon: '🚗' },
    userId: 'mock', createdAt: '2024-07-08',
  },
  {
    id: 't4', amount: 450, type: 'expense', description: 'Cine y cena',
    date: '2024-07-10', categoryId: '3',
    category: { id: '3', name: 'Entretenimiento', color: '#a855f7', icon: '🎬' },
    userId: 'mock', createdAt: '2024-07-10',
  },
  {
    id: 't5', amount: 500, type: 'expense', description: 'Consulta médica',
    date: '2024-07-12', categoryId: '4',
    category: { id: '4', name: 'Salud', color: '#22c55e', icon: '💊' },
    userId: 'mock', createdAt: '2024-07-12',
  },
];

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: string;
  colorClass: string;
}

function SummaryCard({ label, amount, icon, colorClass }: SummaryCardProps) {
  return (
    <div className="flex items-center gap-4 p-5 border border-border rounded-xl bg-card">
      <div className={`text-3xl`}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={`text-xl font-bold ${colorClass}`}>{formatCurrency(amount)}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Ingresos del mes" amount={MONTHLY_SUMMARY.income} icon="💰" colorClass="text-green-600" />
        <SummaryCard label="Gastos del mes" amount={MONTHLY_SUMMARY.expense} icon="💸" colorClass="text-red-500" />
        <SummaryCard label="Balance neto" amount={MONTHLY_SUMMARY.balance} icon="📊" colorClass="text-blue-600" />
      </div>

      {/* Chart + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-xl bg-card p-5">
          <h2 className="text-base font-semibold mb-4">Gastos por categoría</h2>
          <ExpensesByCategoryChart data={CATEGORY_SUMMARY} />
        </div>

        <div className="border border-border rounded-xl bg-card p-5">
          <h2 className="text-base font-semibold mb-4">Transacciones recientes</h2>
          <div className="flex flex-col gap-2">
            {RECENT_TRANSACTIONS.map((tx) => (
              <TransactionCard
                key={tx.id}
                amount={tx.amount}
                type={tx.type}
                description={tx.description}
                date={tx.date}
                categoryName={tx.category?.name}
                categoryColor={tx.category?.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
