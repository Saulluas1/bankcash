import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user?.name ?? user?.email}
        </span>
        <button
          onClick={logout}
          className="text-sm text-destructive hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
