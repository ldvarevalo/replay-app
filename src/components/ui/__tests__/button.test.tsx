import { fireEvent } from '@testing-library/react-native';
import type { RenderResult } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { Button } from '../button';

/**
 * Mocks
 */

const handlePressMock = jest.fn();

/**
 * Types
 */

type StyleEntry = Record<string, unknown>;

/**
 * Helpers
 */

const pressableStyleAt = (view: RenderResult, index: number): StyleEntry =>
  view.getByText('Save').parent?.props.style[index];

/**
 * Tests
 */

describe('Button', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render children', async () => {
    const view = await render(<Button>Save</Button>);
    expect(view.getByText('Save')).toBeTruthy();
  });

  it('should expose button role and default accessibilityState', async () => {
    const view = await render(<Button>Save</Button>);
    expect(view.getByRole('button').props.accessibilityRole).toBe('button');
    expect(view.getByRole('button').props.accessibilityState).toMatchObject({
      busy: false,
      disabled: false,
    });
  });

  it('should call onPress when pressed', async () => {
    const view = await render(<Button onPress={handlePressMock}>Save</Button>);
    fireEvent.press(view.getByText('Save'));
    expect(handlePressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', async () => {
    const view = await render(
      <Button disabled onPress={handlePressMock}>
        Save
      </Button>
    );
    fireEvent.press(view.getByText('Save'));
    expect(handlePressMock).not.toHaveBeenCalled();
    expect(view.getByRole('button').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it('should accept variant=primary', async () => {
    const view = await render(<Button variant="primary">Save</Button>);
    expect(view.getByText('Save')).toBeTruthy();
  });

  it('should accept variant=secondary', async () => {
    const view = await render(<Button variant="secondary">Save</Button>);
    expect(view.getByText('Save')).toBeTruthy();
  });

  it('should accept variant=text', async () => {
    const view = await render(<Button variant="text">Save</Button>);
    expect(view.getByText('Save')).toBeTruthy();
  });

  it('should accept variant=destructive', async () => {
    const view = await render(<Button variant="destructive">Delete</Button>);
    expect(view.getByText('Delete')).toBeTruthy();
  });

  it('should accept size=sm', async () => {
    const view = await render(<Button size="sm">Save</Button>);
    expect(view.getByText('Save')).toBeTruthy();
  });

  it('should render ActivityIndicator when loading', async () => {
    const view = await render(<Button loading>Save</Button>);
    expect(view.queryByText('Save')).toBeNull();
    expect(view.getByRole('button').props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
  });

  it('should resolve base tokens from theme', async () => {
    const view = await render(<Button>Save</Button>);
    expect(pressableStyleAt(view, 0)).toMatchObject({
      borderRadius: radius.md,
      borderColor: lightColors.outline,
    });
  });
});
