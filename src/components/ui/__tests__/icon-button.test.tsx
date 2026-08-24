import { fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { IconButton } from '../index';

/**
 * Mocks
 */

const HeartIconMock = (() => (
  <View testID="heart-icon-mock" />
)) as unknown as LucideIcon;
const handlePressMock = jest.fn();

/**
 * Tests
 */

describe('IconButton', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render the icon', async () => {
    const view = await render(
      <IconButton icon={HeartIconMock} onPress={handlePressMock} />
    );
    expect(view.getByTestId('heart-icon-mock')).toBeTruthy();
  });

  it('should call onPress when pressed', async () => {
    const view = await render(
      <IconButton icon={HeartIconMock} onPress={handlePressMock} />
    );
    fireEvent.press(view.getByRole('button'));
    expect(handlePressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', async () => {
    const view = await render(
      <IconButton icon={HeartIconMock} disabled onPress={handlePressMock} />
    );
    fireEvent.press(view.getByRole('button'));
    expect(handlePressMock).not.toHaveBeenCalled();
  });

  it('should expose disabled state for accessibility', async () => {
    const view = await render(<IconButton icon={HeartIconMock} disabled />);
    expect(view.getByRole('button').props.accessibilityState.disabled).toBe(
      true
    );
  });

  it.each([16, 20, 24])(
    'should accept size=%i without throwing',
    async size => {
      const view = await render(
        <IconButton icon={HeartIconMock} size={size} />
      );
      expect(view.getByRole('button')).toBeTruthy();
    }
  );
});
