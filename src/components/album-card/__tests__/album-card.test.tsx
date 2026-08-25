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

  it('should expose button role and title-by-artist label for a11y', async () => {
    const { getByRole } = await render(<AlbumCard {...BASE_PROPS} />);
    const pressable = getByRole('button');
    expect(pressable.props.accessibilityLabel).toBe(
      'A Love Supreme by John Coltrane'
    );
  });

  it('should render the listened Check icon when isListened=true', async () => {
    const { getByTestId } = await render(
      <AlbumCard {...BASE_PROPS} isListened />
    );
    expect(getByTestId('lucide-icon')).toBeTruthy();
  });

  it('should not render the listened Check icon when isListened is false or omitted', async () => {
    const withFalse = await render(
      <AlbumCard {...BASE_PROPS} isListened={false} />
    );
    expect(withFalse.queryByTestId('lucide-icon')).toBeNull();
    const withOmitted = await render(<AlbumCard {...BASE_PROPS} />);
    expect(withOmitted.queryByTestId('lucide-icon')).toBeNull();
  });
});
