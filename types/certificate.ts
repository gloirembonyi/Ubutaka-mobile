export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface LandTitle {
  upi: string;
  ownerName: string;
  ownerAuthId: string; // Link to User ID
  nationalId: string;
  ownerPhoto?: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  size: string; // in sqm
  landUse: string; // e.g., "Residential", "Agricultural"
  issueDate: string;
  expiryDate?: string;
  coordinates: GeoCoordinate[];
  blockchainHash: string; // SHA-256 hash of the title data
  status: 'ACTIVE' | 'SUSPENDED' | 'TRANSFERRED';
}

export interface Certificate {
  id: string; // Unique Certificate ID
  landTitle: LandTitle;
  qrData: string; // Encoded string for verification
  issuedAt: string;
  issuedBy: string; // Authority Name e.g., "RLMUA"
  watermarkText: string;
}

export interface VerificationResult {
  isValid: boolean;
  message: string;
  certificate?: Certificate;
}
