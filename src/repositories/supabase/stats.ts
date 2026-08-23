import type { SupabaseClient } from '@supabase/supabase-js';
import type { HomeStats } from '@/types/domain';
import type { StatsRepository } from '../types';

/**
 * Constants
 */

const SECONDS_PER_HOUR = 3600;

/**
 * Helpers
 */

const getFirstOfMonth = (): string =>
  new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

const sumListeningSeconds = async (
  supabase: SupabaseClient,
  releaseIds: string[],
  since: string
): Promise<number> => {
  const { data, error } = await supabase
    .from('listening_sessions')
    .select('duration_seconds')
    .in('user_release_id', releaseIds)
    .gte('listened_at', since);

  if (error) {
    throw error;
  }

  return (data ?? []).reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0);
};

/**
 * createSupabaseStatsRepository
 */

export const createSupabaseStatsRepository = (
  supabase: SupabaseClient
): StatsRepository => ({
  async findStats(userId: string): Promise<HomeStats> {
    const { data, error } = await supabase
      .from('user_releases')
      .select('id, status')
      .eq('user_id', userId)
      .is('archived_at', null);

    if (error) {
      throw error;
    }

    const rows = data ?? [];
    const releaseIds = rows.map(r => r.id);
    const totalSeconds = await sumListeningSeconds(
      supabase,
      releaseIds,
      getFirstOfMonth()
    );

    return {
      totalReleases: rows.filter(row => row.status === 'owned').length,
      listeningTimeHours: Math.round(totalSeconds / SECONDS_PER_HOUR),
      wantToBuy: rows.filter(row => row.status === 'want').length,
    };
  },
});
