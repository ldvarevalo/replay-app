import { Text } from 'react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import {
  typography,
  typographyVariants,
  type TypographyVariant,
} from '@/theme/typography';
import { ListItem } from '../list-item';

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const variantStyleOf = (variant: TypographyVariant): StyleEntry => ({
  fontFamily: typography.family[typographyVariants[variant].family],
  fontSize: typography.size[typographyVariants[variant].size],
  letterSpacing:
    typography.letterSpacing[typographyVariants[variant].letterSpacing],
});

const rowStyleAt = (view: RenderResult, index: number): StyleEntry =>
  view.getByTestId('row').props.style[index];

/**
 * Tests
 */

describe('ListItem', () => {
  it('should render title', async () => {
    const { getByText } = await render(<ListItem title="Title" />);
    expect(getByText('Title')).toBeTruthy();
  });

  it('should render description when provided', async () => {
    const { getByText } = await render(
      <ListItem title="Title" description="Description" />
    );
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
  });

  it('should render title as label and description as caption', async () => {
    const view = await render(
      <ListItem title="Title" description="Description" />
    );
    expect(view.getByText('Title').props.style[0]).toMatchObject(
      variantStyleOf('label')
    );
    expect(view.getByText('Description').props.style[0]).toMatchObject(
      variantStyleOf('caption')
    );
  });

  it('should resolve theme padding, layout, and outlineVariant separator', async () => {
    const view = await render(
      <ListItem testID="row" title="Title" right={<Text>r</Text>} />
    );
    expect(rowStyleAt(view, 0)).toMatchObject({
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.two,
      paddingVertical: spacing.three,
      paddingHorizontal: spacing.three,
      borderBottomWidth: 1,
      borderBottomColor: lightColors.outlineVariant,
    });
  });
});
