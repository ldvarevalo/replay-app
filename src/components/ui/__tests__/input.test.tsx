import { fireEvent } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Input } from '../input';

/**
 * Mocks
 */

const handleChangeTextMock = jest.fn();

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const inputStyleAt = (view: RenderResult, index: number): StyleEntry =>
  view.getByTestId('input').props.style[index];

/**
 * Tests
 */

describe('Input', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render with placeholder text', async () => {
    const { getByPlaceholderText } = await render(
      <Input placeholder="Email" testID="input" />
    );
    expect(getByPlaceholderText('Email')).toBeTruthy();
  });

  it('should call onChangeText when value changes', async () => {
    const view = await render(
      <Input onChangeText={handleChangeTextMock} testID="input" />
    );
    fireEvent.changeText(view.getByTestId('input'), 'new');
    expect(handleChangeTextMock).toHaveBeenCalledWith('new');
  });

  it('should support secureTextEntry', async () => {
    const { getByTestId } = await render(
      <Input placeholder="Password" secureTextEntry testID="input" />
    );
    expect(getByTestId('input').props.secureTextEntry).toBe(true);
  });

  it('should resolve theme border and radius tokens', async () => {
    const view = await render(<Input placeholder="x" testID="input" />);
    expect(inputStyleAt(view, 0)).toMatchObject({
      borderWidth: 1,
      borderColor: lightColors.outline,
      borderRadius: radius.sm,
    });
  });
});
