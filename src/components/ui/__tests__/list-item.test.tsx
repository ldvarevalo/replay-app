import { Text } from 'react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { ListItem } from '../list-item';

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

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

  it('should resolve theme horizontal padding and separator tokens', async () => {
    const view = await render(
      <ListItem testID="row" title="Title" right={<Text>r</Text>} />
    );
    expect(rowStyleAt(view, 0)).toMatchObject({
      paddingHorizontal: spacing.three,
      borderBottomWidth: 1,
      borderBottomColor: lightColors.outline,
    });
  });
});
