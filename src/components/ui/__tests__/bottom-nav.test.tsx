import { fireEvent } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { BottomNav } from '../bottom-nav';

/**
 * Mocks
 */

const handleTabPressMock = jest.fn();

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const containerStyleOf = (view: RenderResult): StyleEntry =>
  view.getByRole('tablist').props.style;

/**
 * Tests
 */

describe('BottomNav', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render all 4 tabs with labels', async () => {
    const { getByText } = await render(
      <BottomNav activeTab="home" onTabPress={handleTabPressMock} />
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Collection')).toBeTruthy();
    expect(getByText('Add')).toBeTruthy();
    expect(getByText('Analytics')).toBeTruthy();
  });

  it('should call onTabPress with the tab id when a tab is pressed', async () => {
    const { getByText } = await render(
      <BottomNav activeTab="home" onTabPress={handleTabPressMock} />
    );
    fireEvent.press(getByText('Collection'));
    expect(handleTabPressMock).toHaveBeenCalledWith('collection');
  });

  it('should expose accessibilityLabel per tab', async () => {
    const { getByLabelText } = await render(
      <BottomNav activeTab="home" onTabPress={handleTabPressMock} />
    );
    expect(getByLabelText('Home')).toBeTruthy();
    expect(getByLabelText('Collection')).toBeTruthy();
    expect(getByLabelText('Add')).toBeTruthy();
    expect(getByLabelText('Analytics')).toBeTruthy();
  });

  it('should expose tablist role on container and tab role with selected state on each tab', async () => {
    const { getByRole, getAllByRole } = await render(
      <BottomNav activeTab="collection" onTabPress={handleTabPressMock} />
    );
    expect(getByRole('tablist')).toBeTruthy();
    const tabs = getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    expect(tabs[0].props.accessibilityState).toMatchObject({ selected: false });
    expect(tabs[1].props.accessibilityState).toMatchObject({ selected: true });
    expect(tabs[2].props.accessibilityState).toMatchObject({ selected: false });
    expect(tabs[3].props.accessibilityState).toMatchObject({ selected: false });
  });

  it('should render one icon per tab', async () => {
    const { getAllByTestId } = await render(
      <BottomNav activeTab="home" onTabPress={handleTabPressMock} />
    );
    expect(getAllByTestId('lucide-icon')).toHaveLength(4);
  });

  it('should resolve container bg, border, and padding from theme tokens', async () => {
    const view = await render(
      <BottomNav activeTab="home" onTabPress={handleTabPressMock} />
    );
    expect(containerStyleOf(view)).toMatchObject({
      backgroundColor: lightColors.background,
      borderTopWidth: 1,
      borderTopColor: lightColors.outline,
      paddingTop: spacing.two,
      paddingBottom: spacing.two,
      paddingHorizontal: spacing.two,
    });
  });

  it('should pin the active label color to onPrimaryContainer for WCAG AA contrast', async () => {
    const view = await render(
      <BottomNav activeTab="collection" onTabPress={handleTabPressMock} />
    );
    expect(view.getByText('Collection').props.style[1]).toMatchObject({
      color: lightColors.onPrimaryContainer,
    });
  });
});
