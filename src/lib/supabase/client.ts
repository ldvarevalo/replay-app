import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { createSecureStoreStorage } from './storage';

const getSupabaseUrl = (): string => {
  const url = Constants.expoConfig?.extra?.supabaseUrl as string | undefined;
  if (!url) {
    throw new Error('supabaseUrl is not defined in app config extra');
  }
  return url;
};

const getSupabaseAnonKey = (): string => {
  const key = Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined;
  if (!key) {
    throw new Error('supabaseAnonKey is not defined in app config extra');
  }
  return key;
};

export const createSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: createSecureStoreStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
};
