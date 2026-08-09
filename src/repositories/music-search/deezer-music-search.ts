import type { MusicSearchRepository, SearchItem } from './types';

const DEEZER_SEARCH_URL = 'https://api.deezer.com/search/album';

interface DeezerAlbum {
  id: number;
  title: string;
  cover_medium: string;
  release_date: string;
  artist: { name: string };
  genres?: { data: { name: string }[] };
}

interface DeezerSearchResponse {
  data: DeezerAlbum[];
}

/**
 * DeezerMusicSearchRepository
 */

// ponytail: hits Deezer public API directly. Web used a backend proxy at
// /api/music/search that did the same transform; mobile has no such endpoint.
export class DeezerMusicSearchRepository implements MusicSearchRepository {
  async search(query: string): Promise<SearchItem[]> {
    try {
      const res = await fetch(
        `${DEEZER_SEARCH_URL}?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        return [];
      }
      const json = (await res.json()) as DeezerSearchResponse;
      return json.data.map((album) => ({
        id: String(album.id),
        title: album.title,
        artist: album.artist.name,
        coverUrl: album.cover_medium,
        year: album.release_date?.split('-')[0] ?? '',
        genre: album.genres?.data?.[0]?.name ?? '',
      }));
    } catch {
      return [];
    }
  }
}
