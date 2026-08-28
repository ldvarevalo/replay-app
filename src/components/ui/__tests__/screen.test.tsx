import { Text } from 'react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { Screen } from '../screen';

/**
 * Tests
 */

describe('Screen', () => {
  it('should render children', async () => {
    const { getByText } = await render(
      <Screen>
        <Text>child</Text>
      </Screen>
    );
    expect(getByText('child')).toBeTruthy();
  });
});
