// API Configuration for Mobile App
// Update this with your computer's local IP address when running on a physical device
// To find your IP on Windows: run `ipconfig` and look for IPv4 Address
// To find your IP on Mac/Linux: run `ifconfig` or `hostname -I`

export const getApiBaseUrl = () => {
  // For iOS Simulator or Android Emulator, use localhost
  // For physical devices, use your computer's local IP address
  
  // Option 1: localhost (for emulators only)
  // return 'http://192.168.1.67:3000/api';
  
  // Option 2: Use your computer's IP address (for physical devices)
  // Example: return 'http://192.168.1.100:3000/api';
  
  // Auto-detect based on __DEV__ flag
  if (__DEV__) {
    // Updated to use your computer's IP address for physical device/emulator testing
    // Your backend is running at http://10.175.113.252:3000
    return 'http://10.175.113.252:3000/api';
  }
  
  // Production URL (when app is built)
  return 'https://your-production-api.com/api';
};

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
};
