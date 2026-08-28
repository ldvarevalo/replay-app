import type { RenderResult } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { Skeleton } from '../skeleton';

/**
 * Helpers
 */

const flattenedSkeletonStyle = (
  view: RenderResult
): Record<string, unknown> => {
  const raw = view.getByTestId('skeleton').props.style;
  return StyleSheet.flatten(raw) as Record<string, unknown>;
};

/**
 * Tests
 */

describe('Skeleton', () => {
  it('should render without children', async () => {
    const { getByTestId } = await render(<Skeleton testID="skeleton" />);
    expect(getByTestId('skeleton')).toBeTruthy();
  });

  it('should accept width, height, and borderRadius props', async () => {
    const view = await render(
      <Skeleton testID="skeleton" width={120} height={24} borderRadius={4} />
    );
    expect(flattenedSkeletonStyle(view)).toMatchObject({
      backgroundColor: lightColors.outlineVariant,
      width: 120,
      height: 24,
      borderRadius: 4,
    });
  });

  it('should resolve theme outlineVariant as background color', async () => {
    const view = await render(<Skeleton testID="skeleton" />);
    expect(flattenedSkeletonStyle(view)).toMatchObject({
      backgroundColor: lightColors.outlineVariant,
    });
  });

  it('should render shimmer animation without throwing', async () => {
    const { getByTestId } = await render(<Skeleton testID="skeleton" />);
    expect(getByTestId('skeleton')).toBeTruthy();
  });
});
