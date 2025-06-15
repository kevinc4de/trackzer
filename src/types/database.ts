export interface Database {
  public: {
    Tables: {
      phones: {
        Row: {
          id: string;
          imei: string;
          brand: string;
          model: string;
          color: string | null;
          status: 'lost' | 'stolen' | 'found';
          description: string;
          reward: number | null;
          owner_name: string;
          owner_phone: string;
          owner_email: string;
          location_address: string;
          location_lat: number;
          location_lng: number;
          reported_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          imei: string;
          brand: string;
          model: string;
          color?: string | null;
          status: 'lost' | 'stolen' | 'found';
          description: string;
          reward?: number | null;
          owner_name: string;
          owner_phone: string;
          owner_email: string;
          location_address: string;
          location_lat: number;
          location_lng: number;
          reported_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          imei?: string;
          brand?: string;
          model?: string;
          color?: string | null;
          status?: 'lost' | 'stolen' | 'found';
          description?: string;
          reward?: number | null;
          owner_name?: string;
          owner_phone?: string;
          owner_email?: string;
          location_address?: string;
          location_lat?: number;
          location_lng?: number;
          reported_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}