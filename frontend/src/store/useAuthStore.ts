import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'citizen' | 'authority' | 'admin';
  phone_number?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      setAuth: (token: string) => {
        try {
          const decoded: any = jwtDecode(token);
          set({
            token,
            user: {
              id: decoded.user_id,
              username: decoded.username || '',
              email: decoded.email || '',
              role: (decoded.role || 'citizen').toLowerCase() as any,
            },
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to decode token', error);
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
      login: (user: User, token: string) => {
        // Robust normalization
        let normalizedUser = user;
        if (user) {
          normalizedUser = {
            ...user,
            role: (user.role || 'citizen').toLowerCase() as any
          };
        }

        // Fallback to decode if user is missing but token exists
        if (!normalizedUser && token) {
          try {
            const decoded: any = jwtDecode(token);
            normalizedUser = {
              id: decoded.user_id,
              username: decoded.username || '',
              email: decoded.email || '',
              role: (decoded.role || 'citizen').toLowerCase() as any,
            };
          } catch (e) {
            console.error('Invalid token on login', e);
          }
        }

        set({ user: normalizedUser, token, isAuthenticated: !!token });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        localStorage.removeItem('infracred-auth');
      },
    }),
    {
      name: 'infracred-auth',
    }
  )
);
