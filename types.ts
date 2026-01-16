
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
  role: 'USER' | 'ABUNZI' | 'ADMIN';
  district?: string;
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

export interface Dispute {
  id: string;
  upi: string;
  type: 'Boundary' | 'Ownership' | 'Encroachment';
  status: 'Investigation' | 'Mediation' | 'Resolved';
  dateOpened: string;
  parties: string[];
  description: string;
  location: string;
  district?: string;
  reportedById?: string;
}
