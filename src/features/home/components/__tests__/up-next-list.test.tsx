import { fireEvent, render } from '@/lib/test-utils/render-with-providers';
import type { Album } from '@/types/domain';
import { UpNextList } from '../up-next-list';

/**
 * Mocks
 */

const handleAlbumClickMock = jest.fn();
const MOCK_ALBUMS: ReadonlyArray<Album> = [
  {
    id: 'A.ALBUM.ONE',
    coverUrl: '',
    title: 'AN.ALBUM.TITLE',
    artist: 'AN.ARTIST.NAME',
  },
  {
    id: 'A.ALBUM.TWO',
    coverUrl: '',
    title: 'ANOTHER.ALBUM',
    artist: 'ANOTHER.ARTIST',
  },
  {
    id: 'A.ALBUM.THREE',
    coverUrl: '',
    title: 'THIRD.ALBUM',
    artist: 'THIRD.ARTIST',
  },
];

/**
 * Tests
 */

describe('UpNextList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all albums', async () => {
    const view = await render(
      <UpNextList albums={MOCK_ALBUMS} onAlbumClick={handleAlbumClickMock} />,
    );

    expect(view.getByText('AN.ALBUM.TITLE')).toBeTruthy();
    expect(view.getByText('ANOTHER.ALBUM')).toBeTruthy();
    expect(view.getByText('THIRD.ALBUM')).toBeTruthy();
  });

  it('should fire onAlbumClick with the clicked album', async () => {
    const view = await render(
      <UpNextList albums={MOCK_ALBUMS} onAlbumClick={handleAlbumClickMock} />,
    );

    fireEvent.press(view.getByText('ANOTHER.ALBUM'));
    expect(handleAlbumClickMock).toHaveBeenCalledWith(MOCK_ALBUMS[1]);
  });
});