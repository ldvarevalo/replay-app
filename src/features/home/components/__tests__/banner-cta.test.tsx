import { fireEvent, render } from '@/lib/test-utils/render-with-providers';
import { BannerCta } from '../banner-cta';

/**
 * Mocks
 */

const handleClickMock = jest.fn();
const BANNER_CTA_PROPS_MOCK = {
  count: 5,
  onClick: handleClickMock,
} as const;

/**
 * Tests
 */

describe('BannerCta', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render count and records waiting text', async () => {
    const view = await render(<BannerCta {...BANNER_CTA_PROPS_MOCK} />);

    expect(view.getByText('5 records waiting')).toBeTruthy();
    expect(view.getByText('WHISHLIST')).toBeTruthy();
  });

  it('should fire onClick when pressed', async () => {
    const view = await render(<BannerCta {...BANNER_CTA_PROPS_MOCK} />);

    fireEvent.press(view.getByRole('button'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});