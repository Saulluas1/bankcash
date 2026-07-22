import { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { TransactionCard } from '../components/shared/TransactionCard';
import { ExpensesByCategoryChart } from '../components/charts/ExpensesByCategoryChart';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { TransactionModal, type TransactionFormValues } from '../components/shared/TransactionModal';
import { formatCurrency } from '../lib/utils';
import type { TransactionType } from '../types/transaction.types';

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
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={`text-xl font-bold ${colorClass}`}>{formatCurrency(amount)}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    summary,
    categoryData,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useReports('3M');

  const {
    transactions,
    loading: txLoading,
    createTransaction,
    refetch: refetchTransactions,
  } = useTransactions();

  const { categories } = useCategories();

  const loading = reportsLoading || txLoading;
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  async function handleSave(values: TransactionFormValues) {
    await createTransaction({
      amount: values.amount,
      type: values.type as TransactionType,
      description: values.description,
      date: values.date,
      categoryId: values.categoryId || undefined,
    });
    // Recargar los totales del mes y las transacciones recientes
    refetchReports();
    refetchTransactions();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          + Nueva
        </button>
      </div>

      {reportsError && (
        <p className="text-sm text-red-500 mb-4">{reportsError}</p>
      )}

      {loading ? (
        <LoadingSpinner className="py-8" />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <SummaryCard
              label="Ingresos del mes"
              amount={summary?.income ?? 0}
              icon="💰"
              colorClass="text-green-600"
            />
            <SummaryCard
              label="Gastos del mes"
              amount={summary?.expense ?? 0}
              icon="💸"
              colorClass="text-red-500"
            />
            <SummaryCard
              label="Balance neto"
              amount={summary?.balance ?? 0}
              icon="📊"
              colorClass="text-blue-600"
            />
          </div>

          {/* Chart + recent transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-border rounded-xl bg-card p-5">
              <h2 className="text-base font-semibold mb-4">Gastos por categoría</h2>
              <ExpensesByCategoryChart data={categoryData} />
            </div>

            <div className="border border-border rounded-xl bg-card p-5">
              <h2 className="text-base font-semibold mb-4">Transacciones recientes</h2>
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin transacciones recientes.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentTransactions.map((tx) => (
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
              )}
            </div>
          </div>
        </>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categoryOptions={categories}
      />
    </div>
  );
}
