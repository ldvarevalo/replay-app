import type {
  Album,
  AlbumDetail,
  AlbumWithDate,
  AlbumWithListenedAt,
  CollectionAlbum,
  HomeStats,
  Track,
} from '@/types/domain';
import type { Repositories, LookupResult } from '@/repositories/types';

/**
 * Types
 */

type RepositoryOverrides = {
  [K in keyof Repositories]?: Partial<Repositories[K]>;
};

/**
 * Helpers
 */

const createNoopRepositories = (): Repositories => ({
  releases: {
    findByQuery: jest.fn().mockResolvedValue({
      results: [],
      totalPages: 0,
    }),
    findByTitleAndArtist: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(''),
    findById: jest.fn().mockResolvedValue({
      id: '',
      coverUrl: '',
      title: '',
      artist: '',
      year: '',
      genre: '',
      tracks: [],
      status: null,
      isListened: false,
      priority: null,
      addedAt: null,
      archivedAt: null,
    } as AlbumDetail),
    linkArtist: jest.fn().mockResolvedValue(undefined),
    linkGenre: jest.fn().mockResolvedValue(undefined),
  },
  musicSearch: {
    search: jest.fn().mockResolvedValue([]),
  },
  userReleases: {
    findRecent: jest.fn().mockResolvedValue([] as AlbumWithListenedAt[]),
    findDailyPick: jest.fn().mockResolvedValue(null as AlbumWithDate | null),
    findOldestListened: jest.fn().mockResolvedValue(null as Album | null),
    findUpNext: jest.fn().mockResolvedValue([] as Album[]),
    findAllByUser: jest.fn().mockResolvedValue([] as CollectionAlbum[]),
    create: jest.fn().mockResolvedValue(undefined),
    upsert: jest.fn().mockResolvedValue(undefined),
    findByRelease: jest.fn().mockResolvedValue(null),
    markAsListened: jest.fn().mockResolvedValue(undefined),
    updatePriority: jest.fn().mockResolvedValue(undefined),
    archive: jest.fn().mockResolvedValue(undefined),
    unarchive: jest.fn().mockResolvedValue(undefined),
  },
  tracks: {
    findRecentByUser: jest.fn().mockResolvedValue([] as Track[]),
    createMany: jest.fn().mockResolvedValue(undefined),
    findByRelease: jest.fn().mockResolvedValue([] as Track[]),
  },
  stats: {
    findStats: jest.fn().mockResolvedValue({
      totalReleases: 0,
      listeningTimeHours: 0,
      wantToBuy: 0,
    } as HomeStats),
  },
  artists: {
    findByName: jest.fn().mockResolvedValue(null),
    create: jest
      .fn()
      .mockImplementation((name: string) => Promise.resolve(name)),
    search: jest.fn().mockResolvedValue([] as LookupResult[]),
  },
  genres: {
    findByName: jest.fn().mockResolvedValue(null),
    create: jest
      .fn()
      .mockImplementation((name: string) => Promise.resolve(name)),
    search: jest.fn().mockResolvedValue([] as LookupResult[]),
  },
  sessions: {
    create: jest.fn().mockResolvedValue(undefined),
    findByRelease: jest.fn().mockResolvedValue([]),
  },
  analytics: {
    find: jest.fn().mockResolvedValue({
      listenedAlbums: 0,
      listeningTimeSeconds: 0,
      addedToWant: 0,
      markedOwned: 0,
      discoverBacklog: {
        count: 0,
        oldestEntry: undefined,
      },
      mostListenedAlbum: undefined,
      topArtists: [],
      topGenres: [],
      peakActivityDay: '',
      averageSessionSeconds: 0,
      completionRate: 0,
    }),
  },
});

/**
 * createTestRepositories
 */

export const createTestRepositories = (
  overrides?: RepositoryOverrides
): Repositories => {
  const noop = createNoopRepositories();

  if (!overrides) {
    return noop;
  }

  const result = { ...noop } as Record<keyof Repositories, unknown>;

  for (const key of Object.keys(overrides) as Array<keyof Repositories>) {
    const override = overrides[key];

    if (!override) {
      continue;
    }

    result[key] = {
      ...noop[key],
      ...override,
    };
  }

  return result as Repositories;
};
