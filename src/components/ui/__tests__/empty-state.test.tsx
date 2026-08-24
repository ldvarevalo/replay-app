import { Text, View } from 'react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { spacing } from '@/theme/spacing';
import { EmptyState } from '../empty-state';

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const containerStyleAt = (view: RenderResult, index: number): StyleEntry =>
  view.getByTestId('empty').props.style[index];

/**
 * Tests
 */

describe('EmptyState', () => {
  it('should render title', async () => {
    const { getByText } = await render(
      <EmptyState testID="empty" title="No results" />
    );
    expect(getByText('No results')).toBeTruthy();
  });

  it('should expose title as a header for accessibility', async () => {
    const { getByText } = await render(
      <EmptyState testID="empty" title="No results" />
    );
    expect(getByText('No results').props.accessibilityRole).toBe('header');
  });

  it('should render description when provided', async () => {
    const { getByText } = await render(
      <EmptyState
        testID="empty"
        title="No results"
        description="Try a different search"
      />
    );
    expect(getByText('Try a different search')).toBeTruthy();
  });

  it('should render icon when provided', async () => {
    const { getByTestId } = await render(
      <EmptyState
        testID="empty"
        title="No results"
        icon={<View testID="icon" />}
      />
    );
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('should render action when provided', async () => {
    const { getByText } = await render(
      <EmptyState
        testID="empty"
        title="No results"
        action={<Text>Retry</Text>}
      />
    );
    expect(getByText('Retry')).toBeTruthy();
  });

  it('should resolve centered layout from theme tokens', async () => {
    const view = await render(<EmptyState testID="empty" title="No results" />);
    expect(containerStyleAt(view, 0)).toMatchObject({
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.four,
      gap: spacing.three,
    });
  });
});
