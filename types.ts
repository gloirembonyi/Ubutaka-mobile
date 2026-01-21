
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
  | 'my-parcels';

export type Language = 'RW' | 'EN';

export interface User {
  id: string;
  name: string;
  email: string;
  nationalId: string;
  isVerified: boolean;
  avatar: string;
  role: 'USER' | 'ABUNZI' | 'ADMIN' | 'CITIZEN';
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
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
  coordinates?: string;
  userId?: string;
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
}
