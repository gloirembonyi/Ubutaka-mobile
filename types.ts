
export type Screen = 
  | 'landing' 
  | 'dashboard' 
  | 'parcel-details' 
  | 'transactions' 
  | 'marketplace' 
  | 'support' 
  | 'profile' 
  | 'offline' 
  | 'report-anomaly' 
  | 'inheritance'
  | 'register-land'
  | 'sell-land'
  | 'buy-land'
  | 'verification'
  | 'dispute-list'
  | 'dispute-detail'
  | 'mediation-room'
  | 'login'
  | 'signup'
  | 'settings'
  | 'tax-payment'
  | 'certificate'
  | 'qr-scanner'
  | 'land-map'
  | 'abunzi-dashboard'
  | 'my-parcels'
  | 'land-vault'
  | 'profile-completion'
  | 'edit-profile'
  | 'notary-dashboard';

export type Language = 'RW' | 'EN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nationalId: string;
  isVerified: boolean;
  avatar: string;
  role: 'USER' | 'ABUNZI' | 'ADMIN' | 'CITIZEN' | 'NOTARY';
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  // Profile Completion Fields
  idPictureUrl?: string;
  biometricRegistered?: boolean;
  digitalSignature?: string;
  profileCompleted?: boolean;
}

export interface Parcel {
  upi: string;
  size: string;
  use: string;
  district: string;
  sector?: string;
  cell?: string;
  village?: string;
  location: string;
  price?: string | null;
  status: string;
  ownerName: string;
  imageUrl: string;
  isVerified?: boolean;
  verifiedAt?: string;
  certificateId?: string;
  documents?: string;
  partners?: string;
  children?: string;
  coordinates?: string;
  userId?: string;
  ownerHistory?: string; // JSON string of ownership transfer history
}

export interface Transaction {
  id: string;
  title: string;
  upi: string;
  status: string;
  type?: string;
  date: string;
  step: string;
  progress: number;
  sellerName?: string;
  buyerName?: string;
  price?: string;
  txHash?: string;
  blockNumber?: number;
}

export interface Dispute {
  id: string;
  upi: string;
  type: string;
  status: string;
  dateOpened: string;
  parties: string | string[];
  description: string;
  location: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  assignedAbunziId?: string;
  reportedById?: string;
  
  // Abunzi Portal Fields
  statements?: string;  // JSON string
  evidence?: string;    // JSON string
  decisions?: string;   // JSON string
  familyTree?: string;  // JSON string
}

export interface LandDocument {
  id: string;
  name: string;
  category: string;
  url: string;
  upi?: string;
  ownerId: string;
  fileDate?: string;
  description?: string;
  status: string;
  isCertified: boolean;
  isEncrypted: boolean;
  createdAt: string;
}

export interface AnomalyReport {
  id: string;
  upi?: string;
  type: string;
  description: string;
  imageUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  reportedById?: string;
  createdAt: string;
  updatedAt: string;
}
