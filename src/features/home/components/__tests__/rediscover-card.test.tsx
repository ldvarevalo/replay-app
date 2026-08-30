import { fireEvent, render } from '@/lib/test-utils/render-with-providers';
import { RediscoverCard } from '../rediscover-card';

/**
 * Mocks
 */

const handleClickMock = jest.fn();
const REDISCOVER_CARD_PROPS_MOCK = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.OLD.ALBUM',
  artist: 'AN.OLD.ARTIST',
  onClick: handleClickMock,
} as const;

/**
 * Tests
 */

describe('RediscoverCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render album title and artist', async () => {
    const view = await render(
      <RediscoverCard {...REDISCOVER_CARD_PROPS_MOCK} />,
    );

    expect(view.getByText('AN.OLD.ALBUM')).toBeTruthy();
    expect(view.getByText('AN.OLD.ARTIST')).toBeTruthy();
  });

  it('should fire onClick when pressed', async () => {
    const view = await render(
      <RediscoverCard {...REDISCOVER_CARD_PROPS_MOCK} />,
    );

    fireEvent.press(view.getByRole('button'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});