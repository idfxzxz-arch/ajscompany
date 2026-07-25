import { createClient } from '@supabase/supabase-js';

// UMARA Supabase Client
const umaraUrl = import.meta.env.VITE_SUPABASE_UMARA_URL;
const umaraAnonKey = import.meta.env.VITE_SUPABASE_UMARA_ANON_KEY;

// JNE Supabase Client
const jneUrl = import.meta.env.VITE_SUPABASE_JNE_URL;
const jneAnonKey = import.meta.env.VITE_SUPABASE_JNE_ANON_KEY;

export const supabaseUmara = createClient(umaraUrl, umaraAnonKey);
export const supabaseJne = createClient(jneUrl, jneAnonKey);

export const isSupabaseConfigured = Boolean(umaraUrl && umaraAnonKey && jneUrl && jneAnonKey);
