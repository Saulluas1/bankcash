import { useState } from 'react';
import { TransactionCard } from '../components/shared/TransactionCard';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { TransactionModal, type TransactionFormValues } from '../components/shared/TransactionModal';
import { useTransactions, type TransactionFilter } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import type { TransactionType } from '../types/transaction.types';

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TransactionsPage() {
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const { transactions, loading, error, createTransaction } = useTransactions(filter);
  const { categories } = useCategories();

  async function handleSave(values: TransactionFormValues) {
    await createTransaction({
      amount: values.amount,
      type: values.type as TransactionType,
      description: values.description,
      date: values.date,
      categoryId: values.categoryId || undefined,
    });
  }

  const filterBtnClass = (f: TransactionFilter) =>
    `px-4 py-1.5 text-sm rounded-full border transition-colors ${
      filter === f
        ? 'bg-primary text-primary-foreground border-primary'
        : 'border-border hover:bg-muted'
    }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          + Nueva transacción
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-5">
        <button className={filterBtnClass('all')} onClick={() => setFilter('all')}>Todos</button>
        <button className={filterBtnClass('income')} onClick={() => setFilter('income')}>Ingresos</button>
        <button className={filterBtnClass('expense')} onClick={() => setFilter('expense')}>Gastos</button>
      </div>

      {/* Transaction list */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error ? (
        <p className="text-sm text-red-500 py-4">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay transacciones para este filtro.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {transactions.map((tx) => (
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

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categoryOptions={categories}
      />
    </div>
  );
}
