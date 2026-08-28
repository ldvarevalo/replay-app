import { fireEvent } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import { SectionHeader } from '../section-header';

/**
 * Mocks
 */

const handleLinkClickMock = jest.fn();

/**
 * Tests
 */

describe('SectionHeader', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render title', async () => {
    const { getByText } = await render(<SectionHeader title="My Section" />);
    expect(getByText('My Section')).toBeTruthy();
  });

  it('should render link button when onLinkClick provided', async () => {
    const { getByText } = await render(
      <SectionHeader title="My Section" onLinkClick={handleLinkClickMock} />
    );
    expect(getByText('VIEW ALL')).toBeTruthy();
  });

  it('should call onLinkClick when link pressed', async () => {
    const { getByText } = await render(
      <SectionHeader title="My Section" onLinkClick={handleLinkClickMock} />
    );
    fireEvent.press(getByText('VIEW ALL'));
    expect(handleLinkClickMock).toHaveBeenCalledTimes(1);
  });

  it('should use custom linkLabel', async () => {
    const { getByText } = await render(
      <SectionHeader
        title="My Section"
        onLinkClick={handleLinkClickMock}
        linkLabel="SHOW MORE"
      />
    );
    expect(getByText('SHOW MORE')).toBeTruthy();
  });

  it('should not render link when onLinkClick missing', async () => {
    const { queryByText } = await render(<SectionHeader title="My Section" />);
    expect(queryByText('VIEW ALL')).toBeNull();
  });

  it('should expose the link as a button with linkLabel as a11y label', async () => {
    const { getByRole } = await render(
      <SectionHeader title="My Section" onLinkClick={handleLinkClickMock} />
    );
    const link = getByRole('button');
    expect(link.props.accessibilityLabel).toBe('VIEW ALL');
  });
});
