import * as SecureStore from 'expo-secure-store';
import type { SupportedStorage } from '@supabase/supabase-js';

export const createSecureStoreStorage = (): SupportedStorage => ({
  getItem: async (key: string): Promise<string | null> =>
    SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
});
