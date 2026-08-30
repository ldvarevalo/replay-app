import { fireEvent, render } from '@/lib/test-utils/render-with-providers';
import { RecentlyListenedCard } from '../recently-listened-card';

/**
 * Mocks
 */

const handleClickMock = jest.fn();
const RECENTLY_LISTENED_CARD_PROPS_MOCK = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.ALBUM.TITLE',
  artist: 'AN.ARTIST.NAME',
  listenedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  onClick: handleClickMock,
} as const;

/**
 * Tests
 */

describe('RecentlyListenedCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render album title and artist', async () => {
    const view = await render(
      <RecentlyListenedCard {...RECENTLY_LISTENED_CARD_PROPS_MOCK} />,
    );

    expect(view.getByText('AN.ALBUM.TITLE')).toBeTruthy();
    expect(view.getByText('AN.ARTIST.NAME')).toBeTruthy();
  });

  it('should render relative time since last listened', async () => {
    const view = await render(
      <RecentlyListenedCard {...RECENTLY_LISTENED_CARD_PROPS_MOCK} />,
    );

    expect(view.getByText('5 hours ago')).toBeTruthy();
  });

  it('should fire onClick when pressed', async () => {
    const view = await render(
      <RecentlyListenedCard {...RECENTLY_LISTENED_CARD_PROPS_MOCK} />,
    );

    fireEvent.press(view.getByRole('button'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});