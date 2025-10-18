import { User, AuthError } from '@/api/auth/auth.types';
import { authService } from '@/api/auth/auth.service';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  authToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  setAuth: (user: User, authToken: string, userId: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name?: string, username?: string, avatar?: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  authToken: localStorage.getItem('token'),
  userId: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  setAuth: (user, authToken, userId) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userId', userId);
    console.log('Setting auth in store', { user, authToken, userId });
    set({ user, authToken, userId, isAuthenticated: true, error: null });
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ email, password });
      get().setAuth(response.me, response.authToken, response.userId);
    } catch (error) {
      set({ error: error as AuthError });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, username) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register({ name, email, password, username });
      get().setAuth(response.user, response.token, response.refreshToken);
    } catch (error) {
      set({ error: error as AuthError });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await authService.logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      console.log('User logged out, clearing auth store');
      set({ user: null, authToken: null, userId: null, isAuthenticated: false });
    } catch (error) {
      set({ error: error as AuthError });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },


  updateProfile: async (name, username, avatar) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await authService.updateProfile({ name, username, avatar });
      set({ user: updatedUser });
    } catch (error) {
      set({ error: error as AuthError });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
