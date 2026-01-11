export interface User {
  id: string;
  name: string;
  email: string;
  nationalId: string;
  avatar: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date | string;
}

export interface Parcel {
  upi: string;
  size: string;
  use: string;
  district: string;
  location: string;
  status: string;
  ownerName: string;
  imageUrl: string;
  price: string | null;
  createdAt: Date | string;
}

export interface Transaction {
  id: string;
  title: string;
  upi: string;
  status: string;
  date: string;
  step: string;
  progress: number;
  createdAt: Date | string;
}

export interface Dispute {
  id: string;
  upi: string;
  type: string;
  status: string;
  dateOpened: string;
  parties: string;
  description: string;
  location: string;
  createdAt: Date | string;
}
