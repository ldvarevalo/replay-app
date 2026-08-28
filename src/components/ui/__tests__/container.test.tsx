import { Text } from 'react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { Container } from '../container';

/**
 * Tests
 */

describe('Container', () => {
  it('should render children', async () => {
    const { getByText } = await render(
      <Container>
        <Text>child</Text>
      </Container>
    );
    expect(getByText('child')).toBeTruthy();
  });

  it('should accept a testID', async () => {
    const { getByTestId } = await render(<Container testID="c" />);
    expect(getByTestId('c')).toBeTruthy();
  });
});
