import type { SupabaseClient } from '@supabase/supabase-js';
import { createDeezerMusicSearchRepository } from './deezer-music-search';
import type { MusicSearchRepository } from './types';

/**
 * createMusicSearchRepository
 */

export const createMusicSearchRepository = (
  supabase: SupabaseClient
): MusicSearchRepository => createDeezerMusicSearchRepository(supabase);

export { createDeezerMusicSearchRepository } from './deezer-music-search';
export type { MusicSearchRepository, SearchItem } from './types';
