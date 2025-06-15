export interface PhoneType {
  id: string;
  imei: string;
  brand: string;
  model: string;
  color: string;
  status: 'lost' | 'stolen' | 'found';
  reportedDate: string;
  lastKnownLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  description: string;
  reward?: number;
}

export interface SearchResult {
  phone: PhoneType;
  confidence: number;
  lastSeen: string;
  matchType: 'exact' | 'partial' | 'similar';
}

export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}