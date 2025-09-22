import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing
let supabase: any;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not found. Using mock client.');
  
  // Create a mock client that returns empty results
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({ data: [], error: null }),
        ilike: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: { message: 'Mock client - no data' } })
      }),
      insert: () => ({
        select: () => ({
          single: () => ({ data: null, error: { message: 'Mock client - no insert' } })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({ data: null, error: { message: 'Mock client - no update' } })
          })
        })
      })
    })
  };
}

export { supabase };