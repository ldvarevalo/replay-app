import { SupabaseReleasesRepository } from '../releases';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Helpers
 */

const createMockSupabase = (): jest.Mocked<SupabaseClient> => {
  const builder: any = {
    from: jest.fn(),
    select: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };
  return builder as jest.Mocked<SupabaseClient>;
};

/**
 * Tests
 */

describe('SupabaseReleasesRepository.findByTitleAndArtist', () => {
  it('should return the release id when found', async () => {
    const supabase = createMockSupabase();
    const selectChain = {
      ilike: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { id: 'A.RELEASE.ID' },
        error: null,
      }),
    };
    selectChain.ilike.mockReturnValue(selectChain);
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(selectChain),
    });
    const repo = new SupabaseReleasesRepository(supabase);
    const id = await repo.findByTitleAndArtist(
      'A.RELEASE.TITLE',
      'A.ARTIST.NAME'
    );
    expect(id).toBe('A.RELEASE.ID');
  });

  it('should return null when no release matches', async () => {
    const supabase = createMockSupabase();
    const selectChain = {
      ilike: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
    selectChain.ilike.mockReturnValue(selectChain);
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(selectChain),
    });
    const repo = new SupabaseReleasesRepository(supabase);
    const id = await repo.findByTitleAndArtist(
      'NONEXISTENT.TITLE',
      'NOBODY.NAME'
    );
    expect(id).toBeNull();
  });

  it('should throw when supabase returns an error', async () => {
    const supabase = createMockSupabase();
    const selectChain = {
      ilike: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'A.DB.ERROR' },
      }),
    };
    selectChain.ilike.mockReturnValue(selectChain);
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue(selectChain),
    });
    const repo = new SupabaseReleasesRepository(supabase);
    await expect(
      repo.findByTitleAndArtist('A.RELEASE.TITLE', 'A.ARTIST.NAME')
    ).rejects.toEqual({ message: 'A.DB.ERROR' });
  });
});
