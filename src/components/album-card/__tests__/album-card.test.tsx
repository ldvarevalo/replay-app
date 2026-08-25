import { fireEvent } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { AlbumCard } from '../album-card';

/**
 * Mocks
 */

const handleClickMock = jest.fn();
const BASE_PROPS = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'A Love Supreme',
  artist: 'John Coltrane',
  onClick: handleClickMock,
};

/**
 * Tests
 */

describe('AlbumCard', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render title and artist', async () => {
    const { getByText } = await render(<AlbumCard {...BASE_PROPS} />);
    expect(getByText('A Love Supreme')).toBeTruthy();
    expect(getByText('John Coltrane')).toBeTruthy();
  });

  it('should render year when provided', async () => {
    const { getByText } = await render(
      <AlbumCard {...BASE_PROPS} year="1965" />
    );
    expect(getByText('1965')).toBeTruthy();
  });

  it('should not render year when not provided', async () => {
    const { queryByText } = await render(<AlbumCard {...BASE_PROPS} />);
    expect(queryByText('1965')).toBeNull();
  });

  it('should call onClick when pressed', async () => {
    const { getByText } = await render(<AlbumCard {...BASE_PROPS} />);
    fireEvent.press(getByText('A Love Supreme'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
