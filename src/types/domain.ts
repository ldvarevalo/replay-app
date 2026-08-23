/**
 * Types
 */

export type CollectionStatus = 'discover' | 'want' | 'owned';

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Album {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
}

export interface AlbumWithDate extends Album {
  createdAt: string;
}

export interface AlbumWithListenedAt extends Album {
  listenedAt: string;
}

export interface Track {
  id: string;
  title: string;
  durationSeconds: number | null;
  side: string;
  position: number;
}

export interface HomeStats {
  totalReleases: number;
  listeningTimeHours: number;
  wantToBuy: number;
}

export interface HomeData {
  stats: HomeStats;
  dailyPick: AlbumWithDate | null;
  albums: AlbumWithListenedAt[];
  rediscover: Album | null;
  upNext: Album[];
  wantToBuyCount: number;
  handleShowAnother: () => void;
}

export interface BacklogEntry {
  coverUrl: string;
  title: string;
  artist: string;
  daysSinceAdded: number;
}

export interface DiscoverBacklog {
  count: number;
  oldestEntry?: BacklogEntry;
}

export interface MostListenedAlbum {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  sessionCount: number;
  totalDurationSeconds: number;
}

export interface AnalyticsData {
  listenedAlbums: number;
  listeningTimeSeconds: number;
  addedToWant: number;
  markedOwned: number;
  discoverBacklog: DiscoverBacklog;
  mostListenedAlbum?: MostListenedAlbum;
  topArtists: string[];
  topGenres: string[];
  peakActivityDay: string;
  averageSessionSeconds: number;
  completionRate: number;
}

export interface CollectionAlbum {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  year: string;
  status: CollectionStatus;
  isListened: boolean;
}

export interface AlbumDetail {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  tracks: Track[];
  status: CollectionStatus | null;
  isListened: boolean;
  priority: PriorityLevel | null;
  addedAt: string | null;
  archivedAt: string | null;
}

export interface SearchResult {
  id: string;
  thumbnail: string;
  title: string;
  artist: string;
  isAdded: boolean;
}

export interface ManualEntryData {
  title: string;
  artist: string;
  year: string;
  genre: string;
  artworkUrl: string;
  status: CollectionStatus;
}

export type ListeningScope =
  | 'full_release'
  | 'partial_release'
  | 'side_a'
  | 'side_b'
  | 'side_c'
  | 'side_d';

export type SourceFormat = 'vinyl' | 'digital';

export interface ListeningSession {
  id: string;
  userReleaseId: string;
  scope: ListeningScope;
  sourceFormat: SourceFormat;
  durationSeconds: number | null;
  listenedAt: string;
  createdAt: string;
}
