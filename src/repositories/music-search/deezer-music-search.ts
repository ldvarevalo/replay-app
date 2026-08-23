import type { SupabaseClient } from '@supabase/supabase-js';
import { getApiUrl } from '@/lib/env/api-url';
import type { MusicSearchRepository, SearchItem } from '../types';

/**
 * createDeezerMusicSearchRepository
 */

export const createDeezerMusicSearchRepository = (
  supabase: SupabaseClient
): MusicSearchRepository => ({
  async search(query: string): Promise<SearchItem[]> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(
        `${getApiUrl()}/api/music/search?q=${encodeURIComponent(query)}`,
        { headers }
      );

      if (!res.ok) {
        return [];
      }
      return (await res.json()) as SearchItem[];
    } catch {
      return [];
    }
  },
});
