import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import type { LoginPayload, RegisterPayload } from '../services/auth.service';

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = async (payload: LoginPayload) => {
    try {
      const { data } = await authService.login(payload);
      if (data.data) {
        setAuth(data.data.user, data.data.token);
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error al iniciar sesión';
      throw new Error(message);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const { data } = await authService.register(payload);
      if (data.data) {
        setAuth(data.data.user, data.data.token);
      }
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Error al crear la cuenta';
      throw new Error(message);
    }
  };

  const logout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return { user, token, isAuthenticated, login, register, logout };
}
