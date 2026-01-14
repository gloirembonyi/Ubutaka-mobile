
import { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface BiometricData {
  enabled: boolean;
  isRegistered: boolean;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  nationalId?: string;
  biometricToken?: string;
}
