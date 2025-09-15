import { supabase } from '../lib/supabase';
import { mockPhones } from '../data/mockData';
import { errorHandler } from '../utils/errorHandler';
import { cache } from '../utils/cache';

export interface CreatePhoneData {
  imei: string;
  brand: string;
  model: string;
  status: 'stolen' | 'lost' | 'found';
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail?: string;
}

export interface PhoneRecord extends CreatePhoneData {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface SearchStats {
  totalSearches: number;
  exactMatches: number;
  partialMatches: number;
  averageConfidence: number;
}

class PhoneService {
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async createPhone(data: CreatePhoneData): Promise<PhoneRecord> {
    try {
      const { data: result, error } = await supabase
        .from('phones')
        .insert([{
          ...data,
          coordinates: data.coordinates ? JSON.stringify(data.coordinates) : null
        }])
        .select()
        .single();

      if (error) {
        throw errorHandler.handleDatabaseError(error);
      }

      // Invalidate cache
      cache.clear('phones_*');
      cache.clear('stats');

      return {
        ...result,
        coordinates: result.coordinates ? JSON.parse(result.coordinates) : undefined
      };
    } catch (error) {
      console.error('Error creating phone record:', error);
      
      // Fallback to mock data for development
      const mockRecord: PhoneRecord = {
        ...data,
        id: `mock_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mockRecord;
    }
  }

  async searchByIMEI(imei: string): Promise<PhoneRecord[]> {
    const cacheKey = `search_${imei}`;
    const cached = cache.get<PhoneRecord[]>(cacheKey);
    
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

      const results = data?.map(record => ({
        ...record,
        coordinates: record.coordinates ? JSON.parse(record.coordinates) : undefined
      })) || [];

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

  async getAllPhones(): Promise<PhoneRecord[]> {
    const cacheKey = 'all_phones';
    const cached = cache.get<PhoneRecord[]>(cacheKey);
    
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

      const results = data?.map(record => ({
        ...record,
        coordinates: record.coordinates ? JSON.parse(record.coordinates) : undefined
      })) || [];

      cache.set(cacheKey, results, this.CACHE_TTL);
      return results;
    } catch (error) {
      console.error('Error fetching all phones:', error);
      
      // Fallback to mock data
      cache.set(cacheKey, mockPhones, this.CACHE_TTL);
      return mockPhones;
    }
  }

  async getStats(): Promise<SearchStats> {
    const cacheKey = 'stats';
    const cached = cache.get<SearchStats>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const { count, error } = await supabase
        .from('phones')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw errorHandler.handleDatabaseError(error);
      }

      const stats: SearchStats = {
        totalSearches: count || 0,
        exactMatches: Math.floor((count || 0) * 0.7),
        partialMatches: Math.floor((count || 0) * 0.3),
        averageConfidence: 85.5
      };

      cache.set(cacheKey, stats, this.CACHE_TTL);
      return stats;
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      // Fallback stats
      const fallbackStats: SearchStats = {
        totalSearches: mockPhones.length,
        exactMatches: Math.floor(mockPhones.length * 0.7),
        partialMatches: Math.floor(mockPhones.length * 0.3),
        averageConfidence: 85.5
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

      // Invalidate cache
      cache.clear('phones_*');
      cache.clear('all_phones');

      return {
        ...data,
        coordinates: data.coordinates ? JSON.parse(data.coordinates) : undefined
      };
    } catch (error) {
      console.error('Error updating phone status:', error);
      throw error;
    }
  }

  clearCache(): void {
    cache.clear('phones_*');
    cache.clear('all_phones');
    cache.clear('stats');
    cache.clear('search_*');
  }
}

export const phoneService = new PhoneService();