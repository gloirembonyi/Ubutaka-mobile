export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface MapCoordinates {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LandParcel {
  id: string;
  upi: string;
  ownerName: string;
  status: 'active' | 'pending' | 'disputed';
  area: number; // in square meters
  value: number; // in RWF
  boundary: GeoPoint[];
  center: GeoPoint;
  landUse?: string;
}

export type MapLayer = 'standard' | 'satellite' | 'hybrid' | 'terrain';
