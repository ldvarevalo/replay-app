import { fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { AlbumRow } from '../album-row';

/**
 * Mocks
 */

const handleClickMock = jest.fn();
const ALBUM_ROW_PROPS_MOCK = {
  thumbnail: 'https://example.com/thumb.jpg',
  title: 'A Love Supreme',
  artist: 'John Coltrane',
  onClick: handleClickMock,
};

/**
 * Tests
 */

describe('AlbumRow', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render title, artist and thumbnail', async () => {
    const { getByText, getByLabelText } = await render(
      <AlbumRow {...ALBUM_ROW_PROPS_MOCK} />
    );
    expect(getByText('A Love Supreme')).toBeTruthy();
    expect(getByText('John Coltrane')).toBeTruthy();
    expect(getByLabelText('A Love Supreme').props.source).toEqual([
      { uri: ALBUM_ROW_PROPS_MOCK.thumbnail },
    ]);
  });

  it('should render duration when provided', async () => {
    const { getByText } = await render(
      <AlbumRow {...ALBUM_ROW_PROPS_MOCK} duration="5:30" />
    );
    expect(getByText('5:30')).toBeTruthy();
  });

  it('should render actionIcon instead of duration when provided', async () => {
    const { getByTestId, queryByText } = await render(
      <AlbumRow
        {...ALBUM_ROW_PROPS_MOCK}
        duration="5:30"
        actionIcon={<Text testID="action">+</Text>}
      />
    );
    expect(getByTestId('action')).toBeTruthy();
    expect(queryByText('5:30')).toBeNull();
  });

  it('should call onClick when pressed', async () => {
    const { getByText } = await render(<AlbumRow {...ALBUM_ROW_PROPS_MOCK} />);
    fireEvent.press(getByText('A Love Supreme'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });

  it('should expose button role and title-by-artist label for a11y', async () => {
    const { getByRole } = await render(<AlbumRow {...ALBUM_ROW_PROPS_MOCK} />);
    const pressable = getByRole('button');
    expect(pressable.props.accessibilityLabel).toBe(
      'A Love Supreme by John Coltrane'
    );
  });
});
