import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION INSTRUCTIONS ---
// 1. Go to https://supabase.com/dashboard/project/_/settings/api
// 2. Copy "Project URL" and "anon" public key.
// 3. Replace the values below OR set them in your .env file.

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://nxrrromcaaevxodwuitv.supabase.co'; 
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cnJyb21jYWFldnhvZHd1aXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjY4MjksImV4cCI6MjA4NTUwMjgyOX0.N5IoX5_GQrg-WMPEB3dMGgOhE1HIZmEacPMp3UrLUl0';

// Standard Client (Safe to expose in browser)
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
      }
    }) 
  : null;

export const isSupabaseConfigured = () => {
    // Basic check to see if we are using the default placeholder which might be invalid for the user's network
    if (!supabase) return false;
    return true;
};