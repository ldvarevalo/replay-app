import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { Skeleton } from '../skeleton';

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const skeletonStyleAt = (view: RenderResult, index: number): StyleEntry =>
  view.getByTestId('skeleton').props.style[index];

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
    expect(skeletonStyleAt(view, 0)).toMatchObject({
      backgroundColor: lightColors.outlineVariant,
    });
    expect(skeletonStyleAt(view, 1)).toMatchObject({
      width: 120,
      height: 24,
      borderRadius: 4,
    });
  });

  it('should resolve theme outlineVariant as background color', async () => {
    const view = await render(<Skeleton testID="skeleton" />);
    expect(skeletonStyleAt(view, 0)).toMatchObject({
      backgroundColor: lightColors.outlineVariant,
    });
  });
});
