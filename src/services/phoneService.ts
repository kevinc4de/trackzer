import { supabase } from '../lib/supabase';
import { PhoneType } from '../types';

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
      throw new Error(`Erreur lors de l'enregistrement: ${error.message}`);
    }

    return phone;
  },

  // Search phones by IMEI
  async searchByIMEI(imei: string): Promise<PhoneType[]> {
    const { data: phones, error } = await supabase
      .from('phones')
      .select('*')
      .or(`imei.eq.${imei},imei.ilike.%${imei}%`)
      .order('reported_date', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }

    return phones?.map(this.transformPhone) || [];
  },

  // Get all phones
  async getAllPhones(): Promise<PhoneType[]> {
    const { data: phones, error } = await supabase
      .from('phones')
      .select('*')
      .order('reported_date', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors du chargement: ${error.message}`);
    }

    return phones?.map(this.transformPhone) || [];
  },

  // Get phones statistics
  async getStats() {
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
      recovery_rate
    };
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