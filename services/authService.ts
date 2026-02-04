
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from '../config/api';
import { LoginCredentials, AuthResponse } from '../types/auth';
import { encryptData } from '../utils/encryption';

const BIOMETRIC_KEY = 'biometric_auth_token';

export const AuthService = {
  // Biometric methods
  async checkBiometricAvailability() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return { hasHardware, isEnrolled };
  },

  async authenticateWithBiometrics(): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Face ID or Fingerprint',
      fallbackLabel: 'Use Password',
    });
    return result.success;
  },

  async enableBiometrics(email: string, token: string) {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_KEY, JSON.stringify({ email, token }));
      return true;
    } catch (error) {
      console.error('Error enabling biometrics:', error);
      return false;
    }
  },

  async getStoredBiometricCredentials(): Promise<{ email: string, token: string } | null> {
    try {
      const stored = await SecureStore.getItemAsync(BIOMETRIC_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  },

  // API methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const body = { ...credentials };
    if (body.nationalId) body.nationalId = encryptData(body.nationalId);
    
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    return response.json();
  },

  async register(userData: any): Promise<AuthResponse> {
    const body = { ...userData };
    if (body.nationalId) body.nationalId = encryptData(body.nationalId);
    
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    return response.json();
  },
};
