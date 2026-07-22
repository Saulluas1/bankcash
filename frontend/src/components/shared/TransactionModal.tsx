import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Dialog from '@radix-ui/react-dialog';

// ─── Schema & types ───────────────────────────────────────────────────────────

const transactionSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, 'La descripción es requerida'),
  date: z.string().min(1, 'La fecha es requerida'),
  categoryId: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  /** Recibe los valores del form. Lanza un Error para mostrar mensaje en el modal. */
  onSave: (values: TransactionFormValues) => Promise<void>;
  categoryOptions: { id: string; name: string; icon: string | null }[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TransactionModal({ open, onClose, onSave, categoryOptions }: TransactionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'expense', date: new Date().toISOString().split('T')[0] },
  });
  const [apiError, setApiError] = useState<string | null>(null);

  function handleClose() {
    reset();
    setApiError(null);
    onClose();
  }

  async function onSubmit(values: TransactionFormValues) {
    setApiError(null);
    try {
      await onSave(values);
      reset();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al guardar');
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed inset-x-3 bottom-3 sm:inset-auto sm:left-1/2 sm:top-1/2 z-50 sm:-translate-x-1/2 sm:-translate-y-1/2 w-auto sm:w-full sm:max-w-md bg-card border border-border rounded-xl p-5 sm:p-6 shadow-lg max-h-[90dvh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold mb-4">Nueva transacción</Dialog.Title>

          {apiError && <p className="text-sm text-red-500 mb-3">{apiError}</p>}

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
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
