import { fireEvent } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { spacing } from '@/theme/spacing';
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

  it('should pad the input so text clears the leading search icon', async () => {
    const { getByTestId } = await render(
      <SearchBar value="" onChangeText={handleChangeTextMock} />
    );
    const input = getByTestId('search-bar-input');
    const override = input.props.style[1];
    expect(override).toMatchObject({ paddingLeft: spacing.five });
  });

  it('should hide the decorative search icon from screen readers', async () => {
    const { toJSON } = await render(
      <SearchBar value="" onChangeText={handleChangeTextMock} />
    );
    const findIconWrapper = (
      node: ReturnType<typeof toJSON>
    ): { props: Record<string, unknown> } | null => {
      if (!node || typeof node !== 'object') {
        return null;
      }
      const n = node as {
        props?: Record<string, unknown>;
        children?: unknown[];
      };
      if (n.props?.testID === 'search-bar-icon') {
        return n as { props: Record<string, unknown> };
      }
      for (const child of n.children ?? []) {
        const found = findIconWrapper(child as ReturnType<typeof toJSON>);
        if (found) {
          return found;
        }
      }
      return null;
    };
    const iconWrapper = findIconWrapper(toJSON());
    expect(iconWrapper).not.toBeNull();
    expect(iconWrapper?.props.accessible).toBe(false);
    expect(iconWrapper?.props.accessibilityElementsHidden).toBe(true);
    expect(iconWrapper?.props.importantForAccessibility).toBe('no');
  });
});
