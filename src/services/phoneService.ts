import { supabase } from '../lib/supabase';
import { PhoneType } from '../types';
import { cache, CACHE_KEYS, CACHE_TTL } from '../utils/cache';

export interface CreatePhoneData {
  imei: string;
  brand: string;
  model: string;
  color?: string;
  status: 'lost' | 'stolen';
  description: string;
  reward?: number;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
}

export const phoneService = {
  // Create a new phone report
  async createPhone(data: CreatePhoneData) {
    try {
    const { data: phone, error } = await supabase
      .from('phones')
      .insert([{
        imei: data.imei,
        brand: data.brand,
        model: data.model,
        color: data.color || null,
        status: data.status,
        description: data.description,
        reward: data.reward || null,
        owner_name: data.owner_name,
        owner_phone: data.owner_phone,
        owner_email: data.owner_email,
        location_address: data.location_address,
        location_lat: data.location_lat,
        location_lng: data.location_lng,
        reported_date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
        // Handle specific database errors
        if (error.code === '23505') {
          throw new Error('Ce numéro IMEI a déjà été signalé dans notre base de données');
        }
        throw new Error(`Erreur lors de l'enregistrement: ${error.message}`);
    }

    return phone;
    } catch (error) {
      console.error('Database error in createPhone:', error);
      throw error;
    }
  },

  // Search phones by IMEI
  async searchByIMEI(imei: string): Promise<PhoneType[]> {
    try {
      // Check cache first
      const cacheKey = CACHE_KEYS.SEARCH_RESULTS(imei);
      const cached = cache.get<PhoneType[]>(cacheKey);
      if (cached) {
        return cached;
      }
      
    const { data: phones, error } = await supabase
      .from('phones')
      .select('*')
        .or(`imei.eq.${imei},imei.ilike.%${imei}%,imei.ilike.${imei.slice(0, 8)}%`)
      .order('reported_date', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }

    return phones?.map(this.transformPhone) || [];
    } catch (error) {
      console.error('Database error in searchByIMEI:', error);
      throw error;
    }
  },

  // Get all phones
  async getAllPhones(): Promise<PhoneType[]> {
    try {
      // Check cache first
      const cached = cache.get<PhoneType[]>(CACHE_KEYS.ALL_PHONES);
      if (cached) {
        return cached;
      }
      
    const { data: phones, error } = await supabase
      .from('phones')
      .select('*')
        .limit(1000) // Limit for performance
      .order('reported_date', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors du chargement: ${error.message}`);
    }

    return phones?.map(this.transformPhone) || [];
    } catch (error) {
      console.error('Database error in getAllPhones:', error);
      throw error;
    }
  },

  // Get phones statistics
  async getStats() {
    try {
      // Check cache first
      const cached = cache.get(CACHE_KEYS.PHONE_STATS);
      if (cached) {
        return cached;
      }
      
    const { data: phones, error } = await supabase
      .from('phones')
      .select('status');

    if (error) {
      throw new Error(`Erreur lors du chargement des statistiques: ${error.message}`);
    }

    const total = phones?.length || 0;
    const lost = phones?.filter(p => p.status === 'lost').length || 0;
    const stolen = phones?.filter(p => p.status === 'stolen').length || 0;
    const found = phones?.filter(p => p.status === 'found').length || 0;
    const recovery_rate = total > 0 ? Math.round((found / total) * 100) : 0;

    return {
      total,
      lost,
      stolen,
      found,
    } catch (error) {
      console.error('Database error in getStats:', error);
      throw error;
    }
  },

  // Update phone status
  async updatePhoneStatus(id: string, status: 'lost' | 'stolen' | 'found') {
    try {
      const { data, error } = await supabase
        .from('phones')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }

      // Invalidate relevant caches
      cache.delete(CACHE_KEYS.ALL_PHONES);
      cache.delete(CACHE_KEYS.PHONE_STATS);

      // Invalidate relevant caches
      cache.delete(CACHE_KEYS.ALL_PHONES);
      cache.delete(CACHE_KEYS.PHONE_STATS);
      cache.delete(CACHE_KEYS.SEARCH_RESULTS(data.imei));

      return data;
    } catch (error) {
      console.error('Database error in updatePhoneStatus:', error);
      throw error;
    }
  },

  // Get phones by status
  async getPhonesByStatus(status: 'lost' | 'stolen' | 'found'): Promise<PhoneType[]> {
    try {
      const { data: phones, error } = await supabase
        .from('phones')
        .select('*')
        .eq('status', status)
        .order('reported_date', { ascending: false })
        .limit(100);
      recovery_rate
      if (error) {
        throw new Error(`Erreur lors du chargement: ${error.message}`);
      }
      const transformedPhones = phones?.map(this.transformPhone) || [];
      
      // Cache search results
      cache.set(cacheKey, transformedPhones, CACHE_TTL.SEARCH_RESULTS);
      
      return transformedPhones;
      const transformedPhones = phones?.map(this.transformPhone) || [];
      
      // Cache the results
      const stats = {
      
      return transformedPhones;
      
      // Cache the stats
      cache.set(CACHE_KEYS.PHONE_STATS, stats, CACHE_TTL.PHONE_STATS);
      
      return stats;
    } catch (error) {
      console.error('Database error in getPhonesByStatus:', error);
      throw error;
    }
  },

  // Transform database row to PhoneType
  transformPhone(dbPhone: any): PhoneType {
    return {
      id: dbPhone.id,
      imei: dbPhone.imei,
      brand: dbPhone.brand,
      model: dbPhone.model,
      color: dbPhone.color || '',
      status: dbPhone.status,
      reportedDate: dbPhone.reported_date,
      lastKnownLocation: {
        lat: dbPhone.location_lat,
        lng: dbPhone.location_lng,
        address: dbPhone.location_address
      },
      owner: {
        name: dbPhone.owner_name,
        phone: dbPhone.owner_phone,
        email: dbPhone.owner_email
      },
      description: dbPhone.description,
      reward: dbPhone.reward
    };
  }
};