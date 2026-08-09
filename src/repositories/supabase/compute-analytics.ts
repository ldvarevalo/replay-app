import type { MostListenedAlbum } from '@/types/domain';

export interface ViewRow {
  user_id: string;
  session_id: string;
  duration_seconds: number | null;
  listened_at: string;
  scope: string;
  release_id: string;
  release_title: string;
  cover_url: string | null;
  artist_name: string | null;
  genre_name: string | null;
  status: string;
  is_listened: boolean;
  added_at: string;
}

interface SessionMetrics {
  listenedAlbums: number;
  listeningTimeSeconds: number;
  mostListenedAlbum?: MostListenedAlbum;
  topArtists: string[];
  topGenres: string[];
  peakActivityDay: string;
  averageSessionSeconds: number;
  completionRate: number;
}

const computeMostListened = (
  rows: ViewRow[]
): MostListenedAlbum | undefined => {
  const albumDuration = new Map<
    string,
    {
      id: string;
      title: string;
      cover: string | null;
      artist: string;
      dur: number;
      sessions: number;
    }
  >();
  for (const row of rows) {
    const entry = albumDuration.get(row.release_id) ?? {
      id: row.release_id,
      title: row.release_title,
      cover: row.cover_url,
      artist: row.artist_name ?? '',
      dur: 0,
      sessions: 0,
    };
    entry.dur += row.duration_seconds ?? 0;
    entry.sessions += 1;
    albumDuration.set(row.release_id, entry);
  }

  const top = [...albumDuration.values()].sort((a, b) => b.dur - a.dur)[0];
  if (!top) {
    return undefined;
  }

  return {
    id: top.id,
    coverUrl: top.cover ?? '',
    title: top.title,
    artist: top.artist,
    sessionCount: top.sessions,
    totalDurationSeconds: top.dur,
  };
};

const computeTop = (
  rows: ViewRow[],
  field: 'artist_name' | 'genre_name',
  limit = 6
): string[] => {
  const freq = new Map<string, number>();
  for (const row of rows) {
    const val = row[field];
    if (val) {
      freq.set(val, (freq.get(val) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
};

const getDayName = (dateStr: string): string => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[new Date(dateStr).getDay()];
};

const computePeakDay = (rows: ViewRow[]): string => {
  const freq = new Map<string, number>();
  for (const row of rows) {
    const day = getDayName(row.listened_at);
    freq.set(day, (freq.get(day) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
};

export const computeSessionMetrics = (rows: ViewRow[]): SessionMetrics => {
  if (rows.length === 0) {
    return {
      listenedAlbums: 0,
      listeningTimeSeconds: 0,
      mostListenedAlbum: undefined,
      topArtists: [],
      topGenres: [],
      peakActivityDay: '',
      averageSessionSeconds: 0,
      completionRate: 0,
    };
  }

  const uniqueAlbums = new Set(rows.map(r => r.release_id));
  const totalDuration = rows.reduce(
    (sum, r) => sum + (r.duration_seconds ?? 0),
    0
  );
  const fullReleaseSessions = rows.filter(
    r => r.scope === 'full_release'
  ).length;

  return {
    listenedAlbums: uniqueAlbums.size,
    listeningTimeSeconds: totalDuration,
    mostListenedAlbum: computeMostListened(rows),
    topArtists: computeTop(rows, 'artist_name'),
    topGenres: computeTop(rows, 'genre_name'),
    peakActivityDay: computePeakDay(rows),
    averageSessionSeconds: Math.round(totalDuration / rows.length),
    completionRate:
      rows.length > 0
        ? Math.round((fullReleaseSessions / rows.length) * 100)
        : 0,
  };
};
