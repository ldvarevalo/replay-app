import { fireEvent } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { SegmentedControl } from '../segmented-control';

/**
 * Mocks
 */

const handleChangeMock = jest.fn();

const OPTIONS = [
  { value: 'discover', label: 'Discover' },
  { value: 'want', label: 'Want' },
  { value: 'owned', label: 'Owned' },
] as const;

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const containerStyleOf = (view: RenderResult): StyleEntry =>
  view.getByTestId('segmented').props.style;

/**
 * Tests
 */

describe('SegmentedControl', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render one label per option', async () => {
    const { getByText } = await render(
      <SegmentedControl
        options={OPTIONS}
        value="discover"
        onChange={handleChangeMock}
      />
    );
    expect(getByText('Discover')).toBeTruthy();
    expect(getByText('Want')).toBeTruthy();
    expect(getByText('Owned')).toBeTruthy();
  });

  it('should call onChange with the new value when a non-active segment is pressed', async () => {
    const { getByText } = await render(
      <SegmentedControl
        options={OPTIONS}
        value="discover"
        onChange={handleChangeMock}
      />
    );
    fireEvent.press(getByText('Want'));
    expect(handleChangeMock).toHaveBeenCalledWith('want');
  });

  it('should not call onChange when the active segment is pressed', async () => {
    const { getByText } = await render(
      <SegmentedControl
        options={OPTIONS}
        value="discover"
        onChange={handleChangeMock}
      />
    );
    fireEvent.press(getByText('Discover'));
    expect(handleChangeMock).not.toHaveBeenCalled();
  });

  it('should expose tablist role on container and tab role with selected state on each segment', async () => {
    const { getByRole, getAllByRole } = await render(
      <SegmentedControl
        options={OPTIONS}
        value="want"
        onChange={handleChangeMock}
      />
    );
    expect(getByRole('tablist')).toBeTruthy();
    const tabs = getAllByRole('tab');
    expect(tabs).toHaveLength(OPTIONS.length);
    expect(tabs[0].props.accessibilityState).toMatchObject({ selected: false });
    expect(tabs[1].props.accessibilityState).toMatchObject({ selected: true });
    expect(tabs[2].props.accessibilityState).toMatchObject({ selected: false });
  });

  it('should resolve container bg and radius from theme tokens', async () => {
    const view = await render(
      <SegmentedControl
        testID="segmented"
        options={OPTIONS}
        value="discover"
        onChange={handleChangeMock}
      />
    );
    expect(containerStyleOf(view)).toMatchObject({
      backgroundColor: lightColors.surface,
      borderRadius: radius.md,
    });
  });
});
