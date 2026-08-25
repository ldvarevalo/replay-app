import { fireEvent } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { SearchBar } from '../search-bar';

/**
 * Mocks
 */

const handleChangeTextMock = jest.fn();

/**
 * Tests
 */

describe('SearchBar', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render with default placeholder', async () => {
    const { getByPlaceholderText } = await render(
      <SearchBar value="" onChangeText={handleChangeTextMock} />
    );
    expect(getByPlaceholderText('Search archive...')).toBeTruthy();
  });

  it('should render custom placeholder', async () => {
    const { getByPlaceholderText } = await render(
      <SearchBar
        value=""
        onChangeText={handleChangeTextMock}
        placeholder="Search albums..."
      />
    );
    expect(getByPlaceholderText('Search albums...')).toBeTruthy();
  });

  it('should call onChangeText when typed', async () => {
    const { getByPlaceholderText } = await render(
      <SearchBar value="" onChangeText={handleChangeTextMock} />
    );
    fireEvent.changeText(getByPlaceholderText('Search archive...'), 'jazz');
    expect(handleChangeTextMock).toHaveBeenCalledWith('jazz');
  });
});
