import { DeezerMusicSearchRepository } from './deezer-music-search';
import type { MusicSearchRepository } from './types';

/**
 * createMusicSearchRepository
 */

export const createMusicSearchRepository = (): MusicSearchRepository =>
  new DeezerMusicSearchRepository();

export { DeezerMusicSearchRepository } from './deezer-music-search';
export type { MusicSearchRepository, SearchItem } from './types';
