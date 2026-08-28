import { render } from '@/lib/test-utils/render-with-providers';
import { AlbumHero } from '../album-hero';

/**
 * Mocks
 */

const ALBUM_HERO_PROPS_MOCK = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'A Love Supreme',
  artist: 'John Coltrane',
};

/**
 * Tests
 */

describe('AlbumHero', () => {
  it('should render title and artist', async () => {
    const { getByText } = await render(<AlbumHero {...ALBUM_HERO_PROPS_MOCK} />);
    expect(getByText('A Love Supreme')).toBeTruthy();
    expect(getByText('John Coltrane')).toBeTruthy();
  });

  it('should render image with coverUrl', async () => {
    const { getByLabelText } = await render(<AlbumHero {...ALBUM_HERO_PROPS_MOCK} />);
    const img = getByLabelText('A Love Supreme');
    expect(img.props.source).toEqual([{ uri: ALBUM_HERO_PROPS_MOCK.coverUrl }]);
  });
});
