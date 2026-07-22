import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      {/* On mobile the sidebar is fixed/overlay, so the content takes full width.
          On desktop (md+) the sidebar occupies 256px and is part of the flow. */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Spacer so the fixed mobile top-bar doesn't overlap content */}
        <div className="md:hidden h-14 flex-shrink-0" />
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
