interface CategoryBadgeProps {
  name: string;
  color?: string | null;
  icon?: string | null;
  className?: string;
}

export function CategoryBadge({ name, color, icon, className }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${className ?? ''}`}
      style={{ backgroundColor: color ?? '#6b7280' }}
    >
      {icon && <span>{icon}</span>}
      {name}
    </span>
  );
}
