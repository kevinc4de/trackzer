import { supabase } from '../lib/supabase';
import { PhoneType } from '../types';
import { mockPhones } from '../data/mockData';
import { errorHandler } from '../utils/errorHandler';
import { cache } from '../utils/cache';

export interface CreatePhoneData {
  imei: string;
  brand: string;
  model: string;
  status: 'stolen' | 'lost' | 'found';
  location: string;
  location_lat?: number;
  location_lng?: number;
  description?: string;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  reward?: number;
}

export interface PhoneRecord {
  id: string;
  imei: string;
  brand: string;
  model: string;
  status: 'stolen' | 'lost' | 'found';
  location: string;
  location_lat: number | null;
  location_lng: number | null;
  description: string | null;
  owner_name: string;
  owner_phone: string;
  owner_email: string | null;
  reward: number | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  lost: number;
  stolen: number;
  found: number;
  recovery_rate: number;
}

// Convert PhoneRecord from database to PhoneType for frontend
function convertPhoneRecordToPhoneType(record: PhoneRecord): PhoneType {
  return {
    id: record.id,
    imei: record.imei,
    brand: record.brand,
    model: record.model,
    status: record.status,
    description: record.description || '',
    reportedDate: record.created_at,
    lastKnownLocation: {
      address: record.location,
      coordinates: record.location_lat && record.location_lng ? {
        lat: record.location_lat,
        lng: record.location_lng
      } : undefined
    },
    owner: {
      name: record.owner_name,
      phone: record.owner_phone,
      email: record.owner_email || ''
    },
    reward: record.reward || undefined
  };
}

class PhoneService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async createPhone(data: CreatePhoneData): Promise<PhoneRecord> {
    try {
      const { data: result, error } = await supabase
        .from('phones')
        .insert([{
          imei: data.imei,
          brand: data.brand,
          model: data.model,
          status: data.status,
          location: data.location,
          location_lat: data.location_lat || null,
          location_lng: data.location_lng || null,
          description: data.description || null,
          owner_name: data.owner_name,
          owner_phone: data.owner_phone,
          owner_email: data.owner_email || null,
          reward: data.reward || null
        }])
        .select()
        .single();

      if (error) {
        throw errorHandler.handleDatabaseError(error);
      }

      // Clear relevant caches
      cache.clear();

      return result;
    } catch (error) {
      console.error('Error creating phone record:', error);
      
      // Fallback to mock data for development
      const mockRecord: PhoneRecord = {
        id: `mock_${Date.now()}`,
        imei: data.imei,
        brand: data.brand,
        model: data.model,
        status: data.status,
        location: data.location,
        location_lat: data.location_lat || null,
        location_lng: data.location_lng || null,
        description: data.description || null,
        owner_name: data.owner_name,
        owner_phone: data.owner_phone,
        owner_email: data.owner_email || null,
        reward: data.reward || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockRecord;
    }
  }

  async searchByIMEI(imei: string): Promise<PhoneType[]> {
    const cacheKey = `search_${imei}`;
    const cached = cache.get<PhoneType[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .ilike('imei', `%${imei}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw errorHandler.handleDatabaseError(error);
      }

      const results = (data || []).map(convertPhoneRecordToPhoneType);
      cache.set(cacheKey, results, this.CACHE_TTL);
      return results;
    } catch (error) {
      console.error('Error searching phones:', error);
      
      // Fallback to mock data
      const mockResults = mockPhones.filter(phone => 
        phone.imei.toLowerCase().includes(imei.toLowerCase())
      );
      
      cache.set(cacheKey, mockResults, this.CACHE_TTL);
      return mockResults;
    }
  }

  async getAllPhones(): Promise<PhoneType[]> {
    const cacheKey = 'all_phones';
    const cached = cache.get<PhoneType[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('phones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw errorHandler.handleDatabaseError(error);
      }

      const results = (data || []).map(convertPhoneRecordToPhoneType);
      cache.set(cacheKey, results, this.CACHE_TTL);
      return results;
    } catch (error) {
      console.error('Error fetching all phones:', error);
      
      // Fallback to mock data
      cache.set(cacheKey, mockPhones, this.CACHE_TTL);
      return mockPhones;
    }
  }

  async getStats(): Promise<DashboardStats> {
    const cacheKey = 'dashboard_stats';
    const cached = cache.get<DashboardStats>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('phones')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw errorHandler.handleDatabaseError(totalError);
      }

      // Get counts by status
      const { count: lostCount, error: lostError } = await supabase
        .from('phones')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'lost');

      const { count: stolenCount, error: stolenError } = await supabase
        .from('phones')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'stolen');

      const { count: foundCount, error: foundError } = await supabase
        .from('phones')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'found');

      if (lostError || stolenError || foundError) {
        throw new Error('Error fetching status counts');
      }

      const total = totalCount || 0;
      const lost = lostCount || 0;
      const stolen = stolenCount || 0;
      const found = foundCount || 0;
      const recovery_rate = total > 0 ? Math.round((found / total) * 100) : 0;

      const stats: DashboardStats = {
        total,
        lost,
        stolen,
        found,
        recovery_rate
      };

      cache.set(cacheKey, stats, this.CACHE_TTL);
      return stats;
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      // Fallback stats based on mock data
      const total = mockPhones.length;
      const lost = mockPhones.filter(p => p.status === 'lost').length;
      const stolen = mockPhones.filter(p => p.status === 'stolen').length;
      const found = mockPhones.filter(p => p.status === 'found').length;
      const recovery_rate = total > 0 ? Math.round((found / total) * 100) : 0;

      const fallbackStats: DashboardStats = {
        total,
        lost,
        stolen,
        found,
        recovery_rate
      };
      
      cache.set(cacheKey, fallbackStats, this.CACHE_TTL);
      return fallbackStats;
    }
  }

  async updatePhoneStatus(id: string, status: 'stolen' | 'lost' | 'found'): Promise<PhoneRecord> {
    try {
      const { data, error } = await supabase
        .from('phones')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw errorHandler.handleDatabaseError(error);
      }

      // Clear relevant caches
      cache.clear();

      return data;
    } catch (error) {
      console.error('Error updating phone status:', error);
      throw error;
    }
  }

  clearCache(): void {
    cache.clear();
  }
}

export const phoneService = new PhoneService();