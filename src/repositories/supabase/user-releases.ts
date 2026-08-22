import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Album,
  AlbumWithDate,
  AlbumWithListenedAt,
  CollectionAlbum,
  CollectionStatus,
  PriorityLevel,
} from '@/types/domain';
import type { UserReleasesRepository } from '../types';

/**
 * Constants
 */

const RECENT_ALBUM_SELECT = `
  release_id,
  status,
  listened_at,
  releases!inner (
    id,
    title,
    cover_url,
    release_artists!inner (
      artists!inner (
        name
      )
    )
  )
`;

const ALL_FIELDS_SELECT = `
  id,
  status,
  priority,
  rating,
  is_listened,
  listened_at,
  release_id,
  releases!inner (
    id,
    title,
    cover_url,
    release_year,
    release_artists!inner (
      artists!inner (
        name
      )
    )
  )
`;

const DAILY_PICK_SELECT = `
  created_at,
  release_id,
  releases!inner (
    id,
    title,
    cover_url,
    release_artists!inner (
      artists!inner (
        name
      )
    )
  )
`;

/**
 * Helpers
 */

const getArtistName = (releases: Record<string, unknown>): string => {
  const releaseArtists = releases.release_artists as
    Record<string, unknown>[] | undefined;

  return (
    ((releaseArtists?.[0]?.artists as Record<string, unknown>)
      ?.name as string) ?? ''
  );
};

const mapCollectionAlbum = (row: Record<string, unknown>): CollectionAlbum => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: getArtistName(releases),
    year: (releases.release_year as string) ?? '',
    status: row.status as CollectionStatus,
    isListened: row.is_listened as boolean,
  };
};

const mapToAlbum = (row: Record<string, unknown>): Album => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: getArtistName(releases),
  };
};

const mapToAlbumWithDate = (row: Record<string, unknown>): AlbumWithDate => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: getArtistName(releases),
    createdAt: row.created_at as string,
  };
};

const mapToAlbumWithListenedAt = (
  row: Record<string, unknown>
): AlbumWithListenedAt => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: getArtistName(releases),
    listenedAt: row.listened_at as string,
  };
};

/**
 * SupabaseUserReleasesRepository
 */

export class SupabaseUserReleasesRepository implements UserReleasesRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async findRecent(
    userId: string,
    limit: number
  ): Promise<AlbumWithListenedAt[]> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(RECENT_ALBUM_SELECT)
      .eq('user_id', userId)
      .eq('is_listened', true)
      .order('listened_at', {
        ascending: false,
        nullsFirst: false,
      })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapToAlbumWithListenedAt);
  }

  async findDailyPick(userId: string): Promise<AlbumWithDate | null> {
    const { count } = await this.supabase
      .from('user_releases')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('user_id', userId)
      .eq('status', 'discover')
      .eq('is_listened', false);

    if (!count || count === 0) {
      return null;
    }

    const offset = Math.floor(Math.random() * count);

    const { data, error } = await this.supabase
      .from('user_releases')
      .select(DAILY_PICK_SELECT)
      .eq('user_id', userId)
      .eq('status', 'discover')
      .eq('is_listened', false)
      .order('created_at', { ascending: true })
      .range(offset, offset);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return mapToAlbumWithDate(data[0]);
  }

  async findOldestListened(userId: string): Promise<Album | null> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(RECENT_ALBUM_SELECT)
      .eq('user_id', userId)
      .eq('is_listened', true)
      .order('listened_at', {
        ascending: true,
        nullsFirst: false,
      })
      .limit(1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return mapToAlbum(data[0]);
  }

  async findUpNext(userId: string, limit: number): Promise<Album[]> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(RECENT_ALBUM_SELECT)
      .eq('user_id', userId)
      .eq('is_listened', false)
      .eq('status', 'owned')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapToAlbum);
  }

  async findAllByUser(userId: string): Promise<CollectionAlbum[]> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(ALL_FIELDS_SELECT)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapCollectionAlbum);
  }

  async create(data: {
    userId: string;
    releaseId: string;
    status: CollectionStatus;
  }): Promise<void> {
    const { error } = await this.supabase.from('user_releases').insert({
      user_id: data.userId,
      release_id: data.releaseId,
      status: data.status,
    });

    if (error) {
      throw error;
    }
  }

  async upsert(data: {
    userId: string;
    releaseId: string;
    status: CollectionStatus;
  }): Promise<void> {
    const { error } = await this.supabase.from('user_releases').upsert(
      {
        user_id: data.userId,
        release_id: data.releaseId,
        status: data.status,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,release_id',
      }
    );

    if (error) {
      throw error;
    }
  }

  async findByRelease(
    releaseId: string,
    userId: string
  ): Promise<{ id: string } | null> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select('id')
      .eq('release_id', releaseId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  async markAsListened(userReleaseId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_releases')
      .update({
        is_listened: true,
        listened_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userReleaseId);

    if (error) {
      throw error;
    }
  }

  async updatePriority(
    releaseId: string,
    userId: string,
    priority: PriorityLevel
  ): Promise<void> {
    const { error } = await this.supabase
      .from('user_releases')
      .update({
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq('release_id', releaseId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }

  async archive(releaseId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_releases')
      .update({
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('release_id', releaseId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }

  async unarchive(releaseId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_releases')
      .update({
        archived_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('release_id', releaseId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }
}
