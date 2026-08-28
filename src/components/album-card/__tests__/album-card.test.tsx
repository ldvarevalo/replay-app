import { fireEvent } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { AlbumCard } from '../album-card';

/**
 * Mocks
 */

const handleClickMock = jest.fn();
const ALBUM_CARD_PROPS_MOCK = {
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
    const { getByText } = await render(<AlbumCard {...ALBUM_CARD_PROPS_MOCK} />);
    expect(getByText('A Love Supreme')).toBeTruthy();
    expect(getByText('John Coltrane')).toBeTruthy();
  });

  it('should render year when provided', async () => {
    const { getByText } = await render(
      <AlbumCard {...ALBUM_CARD_PROPS_MOCK} year="1965" />
    );
    expect(getByText('1965')).toBeTruthy();
  });

  it('should not render year when not provided', async () => {
    const { queryByText } = await render(<AlbumCard {...ALBUM_CARD_PROPS_MOCK} />);
    expect(queryByText('1965')).toBeNull();
  });

  it('should call onClick when pressed', async () => {
    const { getByText } = await render(<AlbumCard {...ALBUM_CARD_PROPS_MOCK} />);
    fireEvent.press(getByText('A Love Supreme'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });

  it('should expose button role and title-by-artist label for a11y', async () => {
    const { getByRole } = await render(<AlbumCard {...ALBUM_CARD_PROPS_MOCK} />);
    const pressable = getByRole('button');
    expect(pressable.props.accessibilityLabel).toBe(
      'A Love Supreme by John Coltrane'
    );
  });

  it('should render the listened Check icon when isListened=true', async () => {
    const { getByTestId } = await render(
      <AlbumCard {...ALBUM_CARD_PROPS_MOCK} isListened />
    );
    expect(getByTestId('lucide-icon')).toBeTruthy();
  });

  it('should not render the listened Check icon when isListened is false or omitted', async () => {
    const withFalse = await render(
      <AlbumCard {...ALBUM_CARD_PROPS_MOCK} isListened={false} />
    );
    expect(withFalse.queryByTestId('lucide-icon')).toBeNull();
    const withOmitted = await render(<AlbumCard {...ALBUM_CARD_PROPS_MOCK} />);
    expect(withOmitted.queryByTestId('lucide-icon')).toBeNull();
  });
});
