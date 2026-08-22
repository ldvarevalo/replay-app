import type { SupabaseClient } from '@supabase/supabase-js';
import { createMusicSearchRepository } from '../music-search';
import type { Repositories } from '../types';
import { createSupabaseAnalyticsRepository } from './analytics';
import { createSupabaseArtistsRepository } from './artists';
import { createSupabaseGenresRepository } from './genres';
import { createSupabaseListeningSessionsRepository } from './listening-sessions';
import { createSupabaseReleasesRepository } from './releases';
import { createSupabaseStatsRepository } from './stats';
import { createSupabaseTracksRepository } from './tracks';
import { createSupabaseUserReleasesRepository } from './user-releases';

/**
 * createSupabaseRepositories
 */

export const createSupabaseRepositories = (
  supabase: SupabaseClient
): Repositories => ({
  releases: createSupabaseReleasesRepository(supabase),
  musicSearch: createMusicSearchRepository(supabase),
  userReleases: createSupabaseUserReleasesRepository(supabase),
  tracks: createSupabaseTracksRepository(supabase),
  stats: createSupabaseStatsRepository(supabase),
  artists: createSupabaseArtistsRepository(supabase),
  genres: createSupabaseGenresRepository(supabase),
  sessions: createSupabaseListeningSessionsRepository(supabase),
  analytics: createSupabaseAnalyticsRepository(supabase),
});
