import { useState } from 'react';
import { TransactionCard } from '../components/shared/TransactionCard';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { TransactionModal, type TransactionFormValues } from '../components/shared/TransactionModal';
import { useTransactions, type TransactionFilter } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import type { TransactionType } from '../types/transaction.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByMonth<T extends { date: string }>(items: T[]): { label: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  const result: { label: string; items: T[] }[] = [];
  for (const txs of map.values()) {
    const d = new Date(txs[0].date);
    const label = d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
    result.push({ label, items: txs });
  }
  return result;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Current month as 'YYYY-MM'
const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function TransactionsPage() {
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [monthDraft, setMonthDraft] = useState(currentMonth());
  const [month, setMonth] = useState(currentMonth());
  const [monthError, setMonthError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { transactions, loading, error, createTransaction } = useTransactions(filter, month);

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
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button className={filterBtnClass('all')} onClick={() => setFilter('all')}>Todos</button>
        <button className={filterBtnClass('income')} onClick={() => setFilter('income')}>Ingresos</button>
        <button className={filterBtnClass('expense')} onClick={() => setFilter('expense')}>Gastos</button>

        <div className="ml-auto flex items-center gap-2">
          <input
            type="month"
            value={monthDraft}
            onChange={(e) => setMonthDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyMonth()}
            className="px-3 py-1.5 text-sm rounded-full border border-border bg-background hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
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

      {/* Transaction list */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error ? (
        <p className="text-sm text-red-500 py-4">{error}</p>
      ) : transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay transacciones para este filtro.</p>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {groupByMonth(transactions).map(({ label, items }) => (
            <div key={label}>
              {/* Month separator */}
              <div className="flex items-center gap-3 my-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  {label}
                </span>
                <div className="flex-1 border-t border-border" />
              </div>
              <div className="flex flex-col gap-2">
                {items.map((tx) => (
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
