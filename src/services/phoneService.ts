import { supabase } from '../lib/supabase';

export interface Phone {
  id: string;
  imei: string;
  brand: string;
  model: string;
  color?: string;
  status: 'lost' | 'stolen' | 'found';
  description: string;
  reward?: number;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
  reported_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportPhoneData {
  imei: string;
  brand: string;
  model: string;
  color?: string;
  status: 'lost' | 'stolen' | 'found';
  description: string;
  reward?: number | null;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
}

export interface SearchFilters {
  status?: 'lost' | 'stolen' | 'found';
  brand?: string;
  model?: string;
  imei?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
}

class PhoneService {
  async reportPhone(phoneData: ReportPhoneData): Promise<Phone> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .insert([phoneData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to report phone: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error reporting phone:', error);
      throw error;
    }
  }

  async searchPhones(filters: SearchFilters = {}): Promise<Phone[]> {
    try {
      let query = supabase
        .from('phones')
        .select('*')
        .order('reported_date', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }

      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }

      if (filters.imei) {
        query = query.eq('imei', filters.imei);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to search phones: ${error.message}`);
      }

      // Apply location-based filtering if specified
      if (filters.location && data) {
        const filteredData = data.filter(phone => {
          const distance = this.calculateDistance(
            filters.location!.lat,
            filters.location!.lng,
            phone.location_lat,
            phone.location_lng
          );
          return distance <= filters.location!.radius;
        });
        return filteredData;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching phones:', error);
      throw error;
    }
  }

  async getPhoneById(id: string): Promise<Phone | null> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Phone not found
        }
        throw new Error(`Failed to get phone: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting phone by ID:', error);
      throw error;
    }
  }

  async getPhoneByImei(imei: string): Promise<Phone | null> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .eq('imei', imei)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Phone not found
        }
        throw new Error(`Failed to get phone: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting phone by IMEI:', error);
      throw error;
    }
  }

  async updatePhoneStatus(id: string, status: 'lost' | 'stolen' | 'found'): Promise<Phone> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update phone status: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating phone status:', error);
      throw error;
    }
  }

  async deletePhone(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('phones')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete phone: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting phone:', error);
      throw error;
    }
  }

  async getRecentPhones(limit: number = 10): Promise<Phone[]> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .order('reported_date', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to get recent phones: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting recent phones:', error);
      throw error;
    }
  }

  async getPhonesByStatus(status: 'lost' | 'stolen' | 'found'): Promise<Phone[]> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .eq('status', status)
        .order('reported_date', { ascending: false });

      if (error) {
        throw new Error(`Failed to get phones by status: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting phones by status:', error);
      throw error;
    }
  }

  async getPhonesNearLocation(lat: number, lng: number, radiusKm: number = 10): Promise<Phone[]> {
    try {
      // Get all phones first, then filter by distance
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .order('reported_date', { ascending: false });

      if (error) {
        throw new Error(`Failed to get phones: ${error.message}`);
      }

      if (!data) return [];

      // Filter by distance
      const nearbyPhones = data.filter(phone => {
        const distance = this.calculateDistance(lat, lng, phone.location_lat, phone.location_lng);
        return distance <= radiusKm;
      });

      return nearbyPhones;
    } catch (error) {
      console.error('Error getting phones near location:', error);
      throw error;
    }
  }

  // Utility function to calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get statistics for dashboard
  async getPhoneStatistics(): Promise<{
    total: number;
    lost: number;
    stolen: number;
    found: number;
    recentReports: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .select('status, created_at');

      if (error) {
        throw new Error(`Failed to get phone statistics: ${error.message}`);
      }

      if (!data) {
        return { total: 0, lost: 0, stolen: 0, found: 0, recentReports: 0 };
      }

      const stats = {
        total: data.length,
        lost: data.filter(phone => phone.status === 'lost').length,
        stolen: data.filter(phone => phone.status === 'stolen').length,
        found: data.filter(phone => phone.status === 'found').length,
        recentReports: 0
      };

      // Count reports from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      stats.recentReports = data.filter(phone => {
        if (!phone.created_at) return false;
        const createdDate = new Date(phone.created_at);
        return createdDate >= sevenDaysAgo;
      }).length;

      return stats;
    } catch (error) {
      console.error('Error getting phone statistics:', error);
      throw error;
    }
  }
}

export const phoneService = new PhoneService();