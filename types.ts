
export type Screen = 'landing' | 'dashboard' | 'parcel-details' | 'transactions' | 'marketplace' | 'support' | 'profile' | 'offline' | 'report-anomaly' | 'inheritance';

export interface User {
  id: string;
  name: string;
  nationalId: string;
  isVerified: boolean;
  avatar: string;
}

export interface Parcel {
  upi: string;
  size: string;
  use: string;
  district: string;
  location: string;
  price?: string;
  status: 'registered' | 'pending' | 'disputed';
  ownerName: string;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  title: string;
  upi: string;
  status: 'action_required' | 'in_progress' | 'completed' | 'archived';
  date: string;
  step: string;
  progress: number;
}
