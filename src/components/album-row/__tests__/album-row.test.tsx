import { fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { AlbumRow } from '../album-row';

/**
 * Mocks
 */

const handleClickMock = jest.fn();
const BASE_PROPS = {
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
      <AlbumRow {...BASE_PROPS} />
    );
    expect(getByText('A Love Supreme')).toBeTruthy();
    expect(getByText('John Coltrane')).toBeTruthy();
    expect(getByLabelText('A Love Supreme').props.source).toEqual([
      { uri: BASE_PROPS.thumbnail },
    ]);
  });

  it('should render duration when provided', async () => {
    const { getByText } = await render(
      <AlbumRow {...BASE_PROPS} duration="5:30" />
    );
    expect(getByText('5:30')).toBeTruthy();
  });

  it('should render actionIcon instead of duration when provided', async () => {
    const { getByTestId, queryByText } = await render(
      <AlbumRow
        {...BASE_PROPS}
        duration="5:30"
        actionIcon={<Text testID="action">+</Text>}
      />
    );
    expect(getByTestId('action')).toBeTruthy();
    expect(queryByText('5:30')).toBeNull();
  });

  it('should call onClick when pressed', async () => {
    const { getByText } = await render(<AlbumRow {...BASE_PROPS} />);
    fireEvent.press(getByText('A Love Supreme'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
