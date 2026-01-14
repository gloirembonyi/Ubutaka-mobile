import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { BiometricData } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  biometricData: BiometricData;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setBiometricStatus: (enabled: boolean, isRegistered: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      biometricData: {
        enabled: false,
        isRegistered: false,
      },
      isLoading: false,
      error: null,

      login: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          error: null 
        }),

      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        }),

      setBiometricStatus: (enabled, isRegistered) =>
        set((state) => ({
          biometricData: { ...state.biometricData, enabled, isRegistered }
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated,
        biometricData: state.biometricData 
      }),
    }
  )
);
