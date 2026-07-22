import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-border bg-card px-4 md:px-6 flex items-center justify-end gap-3">
      <span className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
        {user?.name ?? user?.email}
      </span>
      <button
        onClick={logout}
        className="text-sm text-destructive hover:underline whitespace-nowrap"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
