import type { SupabaseClient } from '@supabase/supabase-js';
import { computeSessionMetrics } from './compute-analytics';
import type { ViewRow } from './compute-analytics';
import type {
  AnalyticsData,
  BacklogEntry,
  DiscoverBacklog,
} from '@/types/domain';
import type { AnalyticsRepository } from '../types';

const extractOldestEntry = (
  rows: Record<string, unknown>[]
): BacklogEntry | undefined => {
  if (rows.length === 0) {
    return undefined;
  }

  const oldest = rows[0];
  const releases = oldest.releases as Record<string, unknown>;
  const releaseArtists = releases.release_artists as Record<string, unknown>[];
  const artistName =
    ((releaseArtists?.[0]?.artists as Record<string, unknown>)
      ?.name as string) ?? '';
  const addedAt = new Date(oldest.created_at as string);
  const now = new Date();
  const daysSinceAdded = Math.floor(
    (now.getTime() - addedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: artistName,
    daysSinceAdded,
  };
};

export class SupabaseAnalyticsRepository implements AnalyticsRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async find(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<AnalyticsData> {
    const [viewRows, backlog, funnel] = await Promise.all([
      this.queryViewRows(userId, startDate, endDate),
      this.queryDiscoverBacklog(userId),
      this.queryAddedAndOwned(userId, startDate, endDate),
    ]);

    return {
      ...computeSessionMetrics(viewRows),
      ...funnel,
      discoverBacklog: backlog,
    };
  }

  private async queryViewRows(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<ViewRow[]> {
    const { data, error } = await this.supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('listened_at', startDate)
      .lte('listened_at', endDate);

    if (error) {
      throw error;
    }
    return (data ?? []) as ViewRow[];
  }

  private async queryDiscoverBacklog(userId: string): Promise<DiscoverBacklog> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(
        `
        id,
        release_id,
        created_at,
        releases!inner (
          id,
          title,
          cover_url,
          release_artists!inner (
            artists!inner (name)
          )
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'discover')
      .eq('is_listened', false)
      .is('archived_at', null)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    const rows = data ?? [];

    return {
      count: rows.length,
      oldestEntry: extractOldestEntry(rows),
    };
  }

  private async queryAddedAndOwned(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    addedToWant: number;
    markedOwned: number;
  }> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select('status, created_at, updated_at, is_listened')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    const rows = data ?? [];

    const addedToWant = rows.filter(
      r =>
        r.status === 'want' &&
        r.updated_at >= startDate &&
        r.updated_at <= endDate
    ).length;

    const markedOwned = rows.filter(
      r =>
        r.status === 'owned' &&
        r.updated_at >= startDate &&
        r.updated_at <= endDate
    ).length;

    return {
      addedToWant,
      markedOwned,
    };
  }
}
