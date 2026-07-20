import { cn } from '../../lib/utils';
import type { TransactionType } from '../../types/transaction.types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface TransactionCardProps {
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryName?: string;
  categoryColor?: string | null;
  className?: string;
}

export function TransactionCard({
  amount,
  type,
  description,
  date,
  categoryName,
  categoryColor,
  className,
}: TransactionCardProps) {
  const isIncome = type === 'income';

  return (
    <div className={cn('flex items-center justify-between p-4 border border-border rounded-lg bg-card', className)}>
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: categoryColor ?? (isIncome ? '#22c55e' : '#ef4444') }}
        />
        <div>
          <p className="text-sm font-medium">{description ?? 'Sin descripción'}</p>
          <p className="text-xs text-muted-foreground">
            {categoryName ?? 'Sin categoría'} · {formatDate(date)}
          </p>
        </div>
      </div>
      <span className={cn('text-sm font-semibold', isIncome ? 'text-green-600' : 'text-red-500')}>
        {isIncome ? '+' : '-'}{formatCurrency(amount)}
      </span>
    </div>
  );
}
