import { createDeezerMusicSearchRepository } from '../deezer-music-search';
import type { SearchItem } from '@/repositories/types';
import type { SupabaseClient } from '@supabase/supabase-js';

jest.mock('expo-constants', () => ({
  expoConfig: { extra: { apiUrl: 'http://localhost:8080' } },
}));

/**
 * Mocks
 */

const mockSupabase = (token: string | null): jest.Mocked<SupabaseClient> =>
  ({
    auth: {
      getSession: jest
        .fn()
        .mockResolvedValue({ data: { session: { access_token: token } } }),
    },
  }) as unknown as jest.Mocked<SupabaseClient>;

const mockResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as Response;

/**
 * Tests
 */

describe('createDeezerMusicSearchRepository.search', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should return SearchItem[] when backend returns 200', async () => {
    const expected: SearchItem[] = [
      {
        id: '111',
        title: 'A Love Supreme',
        artist: 'John Coltrane',
        coverUrl: 'https://cdn.example/cover.jpg',
        year: '1965',
        genre: 'Jazz',
      },
    ];
    global.fetch = jest.fn().mockResolvedValue(mockResponse(200, expected));
    const repo = createDeezerMusicSearchRepository(mockSupabase('A.TOKEN'));
    await expect(repo.search('coltrane')).resolves.toEqual(expected);
  });

  it('should return [] when backend returns non-2xx', async () => {
    global.fetch = jest.fn().mockResolvedValue(mockResponse(500, {}));
    const repo = createDeezerMusicSearchRepository(mockSupabase('A.TOKEN'));
    await expect(repo.search('coltrane')).resolves.toEqual([]);
  });

  it('should return [] when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));
    const repo = createDeezerMusicSearchRepository(mockSupabase('A.TOKEN'));
    await expect(repo.search('coltrane')).resolves.toEqual([]);
  });
});
