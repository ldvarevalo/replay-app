import { Text } from 'react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { Card } from '../card';

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const cardStyleAt = (view: RenderResult, index: number): StyleEntry =>
  view.getByText('child').parent?.props.style[index];

/**
 * Tests
 */

describe('Card', () => {
  it('should render children', async () => {
    const { getByText } = await render(
      <Card>
        <Text>child</Text>
      </Card>
    );
    expect(getByText('child')).toBeTruthy();
  });

  it('should resolve theme surface background and radius token', async () => {
    const view = await render(
      <Card>
        <Text>child</Text>
      </Card>
    );
    expect(cardStyleAt(view, 0)).toMatchObject({
      backgroundColor: lightColors.surface,
      borderRadius: radius.md,
      padding: spacing.three,
    });
  });

  it('should accept a style override', async () => {
    const view = await render(
      <Card style={{ marginTop: 50 }}>
        <Text>child</Text>
      </Card>
    );
    const card = view.getByText('child').parent;
    expect(card?.props.style).toContainEqual({ marginTop: 50 });
  });
});
