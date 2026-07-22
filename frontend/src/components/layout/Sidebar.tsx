import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/transactions', label: 'Transacciones', icon: '💸' },
  { to: '/categories', label: 'Categorías', icon: '🏷️' },
  { to: '/reports', label: 'Reportes', icon: '📈' },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar (hidden on mobile) ─────────────────────── */}
      <aside className="hidden md:flex w-64 min-h-screen bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">💳 BankCash</h1>
          <p className="text-sm text-muted-foreground">Control de gastos</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <h1 className="text-base font-bold text-primary">💳 BankCash</h1>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md text-muted-foreground hover:bg-accent transition-colors"
          aria-label="Abrir menú"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* ── Mobile drawer overlay ───────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer panel ─────────────────────────────────────── */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">💳 BankCash</h1>
          <p className="text-sm text-muted-foreground">Control de gastos</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
