import { render } from '@/lib/test-utils/render-with-providers';
import { Text } from '../text';

/**
 * Tests
 */

describe('Text', () => {
  it('should render children', async () => {
    const view = await render(<Text>Hello</Text>);
    expect(view.getByText('Hello')).toBeTruthy();
  });

  it('should accept a variant prop without throwing', async () => {
    const view = await render(<Text variant="display">Title</Text>);
    expect(view.getByText('Title')).toBeTruthy();
  });

  it('should accept a color override', async () => {
    const view = await render(<Text color="onSurfaceVariant">Muted</Text>);
    expect(view.getByText('Muted')).toBeTruthy();
  });

  it('should support numberOfLines', async () => {
    const view = await render(
      <Text numberOfLines={1}>Long text that should be truncated</Text>
    );
    expect(view.getByText('Long text that should be truncated')).toBeTruthy();
  });
});
