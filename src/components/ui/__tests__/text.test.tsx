import { render } from '@/lib/test-utils/render-with-providers';
import type { RenderResult } from '@testing-library/react-native';
import { lightColors } from '@/theme/colors';
import {
  typography,
  typographyVariants,
  type TypographyVariant,
} from '@/theme/typography';
import { Text } from '../text';

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

const styleEntryAt = (
  view: RenderResult,
  text: string,
  index: number
): StyleEntry => view.getByText(text).props.style[index];

/**
 * Tests
 */

describe('Text', () => {
  it('should render children', async () => {
    const view = await render(<Text>Hello</Text>);
    expect(view.getByText('Hello')).toBeTruthy();
  });

  it('should apply body variant tokens by default', async () => {
    const view = await render(<Text>Hello</Text>);
    expect(styleEntryAt(view, 'Hello', 0)).toMatchObject(
      variantStyleOf('body')
    );
  });

  it('should accept a variant prop and map its tokens', async () => {
    const view = await render(<Text variant="display">Title</Text>);
    expect(view.getByText('Title')).toBeTruthy();
    expect(styleEntryAt(view, 'Title', 0)).toMatchObject(
      variantStyleOf('display')
    );
  });

  it('should map caption variant tokens', async () => {
    const view = await render(<Text variant="caption">Note</Text>);
    expect(styleEntryAt(view, 'Note', 0)).toMatchObject(
      variantStyleOf('caption')
    );
  });

  it('should resolve a color override to theme colors', async () => {
    const view = await render(<Text color="onSurfaceVariant">Muted</Text>);
    expect(styleEntryAt(view, 'Muted', 1)).toMatchObject({
      color: lightColors.onSurfaceVariant,
    });
  });

  it('should support numberOfLines', async () => {
    const view = await render(
      <Text numberOfLines={1}>Long text that should be truncated</Text>
    );
    expect(view.getByText('Long text that should be truncated')).toBeTruthy();
  });

  it('should map align prop to textAlign on the rendered Text', async () => {
    const view = await render(<Text align="center">Centered</Text>);
    expect(view.getByText('Centered').props.style).toContainEqual(
      expect.objectContaining({ textAlign: 'center' })
    );
  });
});
