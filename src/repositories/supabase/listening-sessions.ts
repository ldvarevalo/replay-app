import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ListeningScope,
  ListeningSession,
  SourceFormat,
} from '@/types/domain';
import type { ListeningSessionsRepository } from '../types';

/**
 * SupabaseListeningSessionsRepository
 */

export class SupabaseListeningSessionsRepository implements ListeningSessionsRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async create(data: {
    userReleaseId: string;
    scope: ListeningScope;
    sourceFormat: SourceFormat;
    durationSeconds: number | null;
  }): Promise<void> {
    const { error } = await this.supabase.from('listening_sessions').insert({
      user_release_id: data.userReleaseId,
      scope: data.scope,
      source_format: data.sourceFormat,
      duration_seconds: data.durationSeconds,
    });

    if (error) {
      throw error;
    }
  }

  async findByRelease(
    releaseId: string,
    userId: string
  ): Promise<ListeningSession[]> {
    const { data: userRelease, error: lookupError } = await this.supabase
      .from('user_releases')
      .select('id')
      .eq('release_id', releaseId)
      .eq('user_id', userId)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (!userRelease) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('listening_sessions')
      .select('*')
      .eq('user_release_id', userRelease.id)
      .order('listened_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(row => ({
      id: row.id,
      userReleaseId: row.user_release_id,
      scope: row.scope,
      sourceFormat: row.source_format,
      durationSeconds: row.duration_seconds,
      listenedAt: row.listened_at,
      createdAt: row.created_at,
    }));
  }
}
