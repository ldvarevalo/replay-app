import { renderHook, waitFor } from '@/lib/test-utils/render-with-providers';
import type {
  Album,
  AlbumWithDate,
  AlbumWithListenedAt,
  HomeStats,
} from '@/types/domain';
import { useHomeData } from '../use-home-data';

/**
 * Constants
 */

const TEST_USER = { id: 'A.USER.ID', email: 'user@example.com' };

const SESSION = { user: TEST_USER, accessToken: 'token' };

const ADAPTER = {
  getSession: jest.fn().mockResolvedValue(SESSION),
  onAuthStateChange: jest.fn().mockReturnValue(() => {}),
} as const;

const MOCK_STATS = {
  totalReleases: 100,
  listeningTimeHours: 5,
  wantToBuy: 3,
} as const satisfies HomeStats;

const MOCK_DAILY_PICK = {
  id: 'A.DAILY.PICK.ID',
  coverUrl: '',
  title: 'A.DAILY.PICK',
  artist: 'AN.ARTIST',
  createdAt: '2024-01-01T00:00:00Z',
} as const satisfies AlbumWithDate;

const MOCK_RECENT = [
  {
    id: 'A.RECENT.ONE',
    coverUrl: '',
    title: 'A.RECENT.ALBUM',
    artist: 'AN.ARTIST',
    listenedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'A.RECENT.TWO',
    coverUrl: '',
    title: 'ANOTHER.RECENT',
    artist: 'ANOTHER.ARTIST',
    listenedAt: '2024-06-01T00:00:00Z',
  },
] as const satisfies AlbumWithListenedAt[];

const MOCK_REDISCOVER = {
  id: 'A.REDISCOVER.ID',
  coverUrl: '',
  title: 'AN.OLD.ALBUM',
  artist: 'AN.OLD.ARTIST',
} as const satisfies Album;

const MOCK_UP_NEXT = [
  {
    id: 'A.UP.NEXT.ONE',
    coverUrl: '',
    title: 'AN.UP.NEXT',
    artist: 'AN.ARTIST',
  },
] as const satisfies Album[];

/**
 * Tests
 */

describe('useHomeData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all home data sections', async () => {
    const { result } = await renderHook(() => useHomeData(), {
      adapter: ADAPTER,
      repositories: {
        stats: { findStats: jest.fn().mockResolvedValue(MOCK_STATS) },
        userReleases: {
          findRecent: jest.fn().mockResolvedValue([...MOCK_RECENT]),
          findDailyPick: jest.fn().mockResolvedValue(MOCK_DAILY_PICK),
          findOldestListened: jest.fn().mockResolvedValue(MOCK_REDISCOVER),
          findUpNext: jest.fn().mockResolvedValue([...MOCK_UP_NEXT]),
        },
      },
    });

    await waitFor(() => {
      expect(result.current.stats.totalReleases).toBe(100);
    });

    expect(result.current.dailyPick?.title).toBe('A.DAILY.PICK');
    expect(result.current.albums).toHaveLength(2);
    expect(result.current.rediscover?.title).toBe('AN.OLD.ALBUM');
    expect(result.current.upNext).toHaveLength(1);
    expect(result.current.wantToBuyCount).toBe(3);
    expect(typeof result.current.handleShowAnother).toBe('function');
  });
});