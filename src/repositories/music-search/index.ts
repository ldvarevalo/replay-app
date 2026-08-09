import type { MusicSearchRepository, SearchItem } from '../types';

/**
 * createMusicSearchRepository
 */

export const createMusicSearchRepository = (): MusicSearchRepository => ({
  async search(_query: string): Promise<SearchItem[]> {
    return [];
  },
});

export type { MusicSearchRepository, SearchItem } from '../types';
