import type { SupabaseClient } from '@supabase/supabase-js';
import { createMusicSearchRepository } from '../music-search';
import type { Repositories } from '../types';
import { SupabaseAnalyticsRepository } from './analytics';
import { SupabaseArtistsRepository } from './artists';
import { SupabaseGenresRepository } from './genres';
import { SupabaseListeningSessionsRepository } from './listening-sessions';
import { SupabaseReleasesRepository } from './releases';
import { SupabaseStatsRepository } from './stats';
import { SupabaseTracksRepository } from './tracks';
import { SupabaseUserReleasesRepository } from './user-releases';

/**
 * createSupabaseRepositories
 */

export const createSupabaseRepositories = (
  supabase: SupabaseClient
): Repositories => ({
  releases: new SupabaseReleasesRepository(supabase),
  musicSearch: createMusicSearchRepository(),
  userReleases: new SupabaseUserReleasesRepository(supabase),
  tracks: new SupabaseTracksRepository(supabase),
  stats: new SupabaseStatsRepository(supabase),
  artists: new SupabaseArtistsRepository(supabase),
  genres: new SupabaseGenresRepository(supabase),
  sessions: new SupabaseListeningSessionsRepository(supabase),
  analytics: new SupabaseAnalyticsRepository(supabase),
});
