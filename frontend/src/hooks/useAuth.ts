import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import type { LoginPayload, RegisterPayload } from '../services/auth.service';

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = async (payload: LoginPayload) => {
    const { data } = await authService.login(payload);
    if (data.data) {
      setAuth(data.data.user, data.data.token);
    }
  };

  const register = async (payload: RegisterPayload) => {
    const { data } = await authService.register(payload);
    if (data.data) {
      setAuth(data.data.user, data.data.token);
    }
  };

  const logout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return { user, token, isAuthenticated, login, register, logout };
}
