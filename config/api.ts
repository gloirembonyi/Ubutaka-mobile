// API Configuration for Mobile App
// Update this with your computer's local IP address when running on a physical device
// To find your IP on Windows: run `ipconfig` and look for IPv4 Address
// To find your IP on Mac/Linux: run `ifconfig` or `hostname -I`

import Constants from 'expo-constants';

export const getApiBaseUrl = () => {
  // Get the API URL from environment variable
  // Expo loads EXPO_PUBLIC_* variables from .env file automatically
  let envUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl;
  
  // Strip quotes if present (sometimes .env files have quotes)
  if (envUrl && typeof envUrl === 'string') {
    envUrl = envUrl.replace(/^["']|["']$/g, '').trim();
  }
  
  const productionUrl = 'https://ubutaka-admin.vercel.app/api';
  
  if (__DEV__) {
    // In development, use the environment variable if available, otherwise fallback to local IP
    if (!envUrl) {
      console.warn('⚠️ EXPO_PUBLIC_API_URL is not set in .env file!');
      console.warn('⚠️ Falling back to default: http://192.168.1.70:3000/api');
      return 'http://192.168.1.70:3000/api'; 
    }
    console.log('✅ API Base URL:', envUrl);
    return envUrl;
  }
  
  // In production builds (like the APK you downloaded), use the Vercel URL
  // unless an environment variable was explicitly provided during the build
  return envUrl || productionUrl;
};

// Compute API_BASE_URL (quotes already stripped in getApiBaseUrl)
export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  
  // Parcels
  PARCELS: `${API_BASE_URL}/parcels`,
  PARCEL_BY_ID: (id: string) => `${API_BASE_URL}/parcels/${id}`,
  
  // Transactions
  TRANSACTIONS: `${API_BASE_URL}/transactions`,
  TRANSACTION_BY_ID: (id: string) => `${API_BASE_URL}/transactions/${id}`,
  
  // Disputes
  DISPUTES: `${API_BASE_URL}/disputes`,
  DISPUTE_BY_ID: (id: string) => `${API_BASE_URL}/disputes/${id}`,
  
  // Anomalies
  ANOMALIES: `${API_BASE_URL}/anomalies`,
  
  // Documents
  DOCUMENTS: `${API_BASE_URL}/documents`,
};
