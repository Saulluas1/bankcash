import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Dialog from '@radix-ui/react-dialog';
import { TransactionCard } from '../components/shared/TransactionCard';
import type { Transaction, TransactionType } from '../types/transaction.types';
import type { Category } from '../types/category.types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Comida', icon: '🍔', color: '#f97316', userId: 'mock', createdAt: '2024-01-01' },
  { id: '2', name: 'Transporte', icon: '🚗', color: '#3b82f6', userId: 'mock', createdAt: '2024-01-01' },
  { id: '3', name: 'Entretenimiento', icon: '🎬', color: '#a855f7', userId: 'mock', createdAt: '2024-01-01' },
  { id: '4', name: 'Salud', icon: '💊', color: '#22c55e', userId: 'mock', createdAt: '2024-01-01' },
  { id: '5', name: 'Servicios', icon: '💡', color: '#eab308', userId: 'mock', createdAt: '2024-01-01' },
  { id: '6', name: 'Ropa', icon: '👕', color: '#ec4899', userId: 'mock', createdAt: '2024-01-01' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', amount: 15000, type: 'income', description: 'Salario mensual', date: '2024-07-01', categoryId: null, userId: 'mock', createdAt: '2024-07-01' },
  { id: 't2', amount: 3200, type: 'expense', description: 'Supermercado', date: '2024-07-05', categoryId: '1', category: { id: '1', name: 'Comida', color: '#f97316', icon: '🍔' }, userId: 'mock', createdAt: '2024-07-05' },
  { id: 't3', amount: 800, type: 'expense', description: 'Gasolina', date: '2024-07-08', categoryId: '2', category: { id: '2', name: 'Transporte', color: '#3b82f6', icon: '🚗' }, userId: 'mock', createdAt: '2024-07-08' },
  { id: 't4', amount: 450, type: 'expense', description: 'Cine y cena', date: '2024-07-10', categoryId: '3', category: { id: '3', name: 'Entretenimiento', color: '#a855f7', icon: '🎬' }, userId: 'mock', createdAt: '2024-07-10' },
  { id: 't5', amount: 500, type: 'expense', description: 'Consulta médica', date: '2024-07-12', categoryId: '4', category: { id: '4', name: 'Salud', color: '#22c55e', icon: '💊' }, userId: 'mock', createdAt: '2024-07-12' },
  { id: 't6', amount: 1200, type: 'expense', description: 'Internet + luz', date: '2024-07-14', categoryId: '5', category: { id: '5', name: 'Servicios', color: '#eab308', icon: '💡' }, userId: 'mock', createdAt: '2024-07-14' },
  { id: 't7', amount: 600, type: 'expense', description: 'Ropa de temporada', date: '2024-07-18', categoryId: '6', category: { id: '6', name: 'Ropa', color: '#ec4899', icon: '👕' }, userId: 'mock', createdAt: '2024-07-18' },
  { id: 't8', amount: 2000, type: 'income', description: 'Freelance diseño', date: '2024-07-22', categoryId: null, userId: 'mock', createdAt: '2024-07-22' },
];

// ─── Form Schema ──────────────────────────────────────────────────────────────

const transactionSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, 'La descripción es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  categoryId: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

// ─── New Transaction Modal ────────────────────────────────────────────────────

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
}

function TransactionModal({ open, onClose, onSave }: TransactionModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'expense', date: new Date().toISOString().split('T')[0] },
  });

  function onSubmit(values: TransactionFormValues) {
    const cat = MOCK_CATEGORIES.find((c) => c.id === values.categoryId);
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      amount: values.amount,
      type: values.type as TransactionType,
      description: values.description,
      date: values.date,
      categoryId: values.categoryId ?? null,
      category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : undefined,
      userId: 'mock',
      createdAt: new Date().toISOString(),
    };
    onSave(newTx);
    reset();
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">Nueva transacción</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monto</label>
              <input
                type="number"
                step="0.01"
                {...register('amount')}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                {...register('type')}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <input
                type="text"
                {...register('description')}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe la transacción"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                {...register('date')}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                {...register('categoryId')}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin categoría</option>
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Guardar
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'income' | 'expense';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  function handleSave(tx: Transaction) {
    setTransactions((prev) => [tx, ...prev]);
  }

  const filterBtnClass = (f: FilterType) =>
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
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay transacciones para este filtro.</p>
        ) : (
          filtered.map((tx) => (
            <TransactionCard
              key={tx.id}
              amount={tx.amount}
              type={tx.type}
              description={tx.description}
              date={tx.date}
              categoryName={tx.category?.name}
              categoryColor={tx.category?.color}
            />
          ))
        )}
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}
