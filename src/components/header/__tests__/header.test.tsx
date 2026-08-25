import { fireEvent } from '@testing-library/react-native';
import { Plus } from 'lucide-react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { lightColors } from '@/theme/colors';
import { Header } from '../header';

/**
 * Mocks
 */

const handleBackMock = jest.fn();
const handleRightPressMock = jest.fn();

/**
 * Tests
 */

describe('Header', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render the title text', async () => {
    const { getByText } = await render(<Header title="Replay" />);
    expect(getByText('Replay')).toBeTruthy();
  });

  it('should render the subtitle when provided', async () => {
    const { getByText } = await render(
      <Header title="Album" subtitle="John Coltrane" />
    );
    expect(getByText('Album')).toBeTruthy();
    expect(getByText('John Coltrane')).toBeTruthy();
  });

  it('should not render subtitle when not provided', async () => {
    const { queryByText } = await render(<Header title="Replay" />);
    expect(queryByText('John Coltrane')).toBeNull();
  });

  it('should call onBack when back button is pressed', async () => {
    const { getByLabelText } = await render(
      <Header title="Album" onBack={handleBackMock} />
    );
    fireEvent.press(getByLabelText('Go back'));
    expect(handleBackMock).toHaveBeenCalledTimes(1);
  });

  it('should not render back button when onBack is not provided', async () => {
    const { queryByLabelText } = await render(<Header title="Replay" />);
    expect(queryByLabelText('Go back')).toBeNull();
  });

  it('should call onRightPress when right icon is pressed', async () => {
    const { getByRole } = await render(
      <Header
        title="Album"
        rightIcon={Plus}
        onRightPress={handleRightPressMock}
      />
    );
    fireEvent.press(getByRole('button'));
    expect(handleRightPressMock).toHaveBeenCalledTimes(1);
  });

  it('should expose header role for accessibility', async () => {
    const { getByRole } = await render(<Header title="Replay" />);
    expect(getByRole('header')).toBeTruthy();
  });

  it('should apply theme-derived bg and border-bottom from outlineVariant', async () => {
    const { getByRole } = await render(<Header title="Replay" />);
    expect(getByRole('header').props.style).toEqual(
      expect.objectContaining({
        backgroundColor: lightColors.background,
        borderBottomWidth: 1,
        borderBottomColor: lightColors.outlineVariant,
      })
    );
  });
});
