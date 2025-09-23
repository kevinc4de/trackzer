import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined');
};

// Create Supabase client or mock client
let supabase: any;

if (isSupabaseConfigured()) {
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
    supabase = createMockClient();
  }
} else {
  console.warn('Supabase environment variables not found. Using mock client for development.');
  supabase = createMockClient();
}

// Create a comprehensive mock client
function createMockClient() {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: () => ({ data: [], error: null }),
        ilike: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: { message: 'Mock client - no data available' } })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => ({ 
            data: { 
              id: `mock_${Date.now()}`, 
              ...data, 
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, 
            error: null 
          })
        })
      }),
      update: (data: any) => ({
        eq: () => ({
          select: () => ({
            single: () => ({ data: { ...data, updated_at: new Date().toISOString() }, error: null })
          })
        })
      })
    })
  };
}

export { supabase };