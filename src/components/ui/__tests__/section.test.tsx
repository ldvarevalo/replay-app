import { Text } from 'react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { spacing } from '@/theme/spacing';
import { Section } from '../section';

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const sectionStyleAt = (view: RenderResult, index: number): StyleEntry =>
  view.getByTestId('section').props.style[index];

/**
 * Tests
 */

describe('Section', () => {
  it('should render children', async () => {
    const { getByText } = await render(
      <Section testID="section">
        <Text>body</Text>
      </Section>
    );
    expect(getByText('body')).toBeTruthy();
  });

  it('should render header when provided', async () => {
    const { getByText } = await render(
      <Section testID="section" header={<Text>header</Text>}>
        <Text>body</Text>
      </Section>
    );
    expect(getByText('header')).toBeTruthy();
    expect(getByText('body')).toBeTruthy();
  });

  it('should resolve theme vertical spacing from tokens', async () => {
    const view = await render(
      <Section testID="section" header={<Text>header</Text>}>
        <Text testID="body">body</Text>
      </Section>
    );
    expect(sectionStyleAt(view, 0)).toMatchObject({
      gap: spacing.three,
    });
    expect(view.getByTestId('body').parent).toBe(view.getByTestId('section'));
  });
});
