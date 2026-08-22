import type { SupabaseClient } from '@supabase/supabase-js';
import type { Track } from '@/types/domain';
import type { TracksRepository, TrackInput } from '../types';

/**
 * Helpers
 */

const mapTrack = (row: Record<string, unknown>): Track => ({
  id: row.id as string,
  title: row.title as string,
  durationSeconds: (row.duration_seconds as number) ?? null,
  side: (row.side as string) ?? '',
  position: (row.position as number) ?? 0,
});

/**
 * createSupabaseTracksRepository
 */

export const createSupabaseTracksRepository = (
  supabase: SupabaseClient
): TracksRepository => ({
  async findRecentByUser(userId: string, limit: number): Promise<Track[]> {
    const { data: userReleases, error: urError } = await supabase
      .from('user_releases')
      .select('release_id')
      .eq('user_id', userId)
      .eq('is_listened', true)
      .order('listened_at', {
        ascending: false,
        nullsFirst: false,
      })
      .limit(limit);

    if (urError) {
      throw urError;
    }

    const releaseIds = (userReleases ?? []).map(r => r.release_id);

    if (releaseIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('tracks')
      .select(
        `
        id,
        title,
        duration_seconds,
        side,
        position
      `
      )
      .in('release_id', releaseIds)
      .order('position', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((row: unknown) =>
      mapTrack(row as Record<string, unknown>)
    );
  },

  async createMany(releaseId: string, tracks: TrackInput[]): Promise<void> {
    const { error } = await supabase.from('tracks').insert(
      tracks.map(t => ({
        release_id: releaseId,
        title: t.title,
        duration_seconds: t.durationSeconds,
        side: t.side,
        position: t.position,
      }))
    );

    if (error) {
      throw error;
    }
  },

  async findByRelease(releaseId: string): Promise<Track[]> {
    const { data, error } = await supabase
      .from('tracks')
      .select('id, title, duration_seconds, side, position')
      .eq('release_id', releaseId)
      .order('position', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(row => mapTrack(row as Record<string, unknown>));
  },
});
