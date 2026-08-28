import { Text } from 'react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { Stack } from '../stack';

/**
 * Tests
 */

describe('Stack', () => {
  it('should render children with vertical direction by default', async () => {
    const { getByTestId, getByText } = await render(
      <Stack testID="s">
        <Text>a</Text>
        <Text>b</Text>
      </Stack>
    );
    expect(getByTestId('s')).toBeTruthy();
    expect(getByText('a')).toBeTruthy();
    expect(getByText('b')).toBeTruthy();
  });

  it('should accept direction=row', async () => {
    const { getByTestId } = await render(<Stack direction="row" testID="s" />);
    expect(getByTestId('s')).toBeTruthy();
  });
});
