import { fireEvent, render } from '@/lib/test-utils/render-with-providers';
import type { AlbumWithDate } from '@/types/domain';
import { DailyPickCard } from '../daily-pick-card';

/**
 * Mocks
 */

const handleListenTodayMock = jest.fn();
const handleShowAnotherMock = jest.fn();
const MOCK_ALBUM: AlbumWithDate = {
  id: 'A.DAILY.PICK.ID',
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.ALBUM.TITLE',
  artist: 'AN.ARTIST.NAME',
  createdAt: '2024-01-15T00:00:00Z',
};

/**
 * Tests
 */

describe('DailyPickCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render album info and relative date', async () => {
    const view = await render(
      <DailyPickCard
        album={MOCK_ALBUM}
        onListenToday={handleListenTodayMock}
        onShowAnother={handleShowAnotherMock}
      />,
    );

    expect(view.getByText("Today's Pick")).toBeTruthy();
    expect(view.getByText('AN.ALBUM.TITLE')).toBeTruthy();
    expect(view.getByText('AN.ARTIST.NAME')).toBeTruthy();
    expect(view.getByText(/Added.*ago/)).toBeTruthy();
    expect(view.getByText('Listen today')).toBeTruthy();
    expect(view.getByText('Show another')).toBeTruthy();
  });

  it('should fire onListenToday when Listen today is pressed', async () => {
    const view = await render(
      <DailyPickCard
        album={MOCK_ALBUM}
        onListenToday={handleListenTodayMock}
        onShowAnother={handleShowAnotherMock}
      />,
    );

    fireEvent.press(view.getByText('Listen today'));
    expect(handleListenTodayMock).toHaveBeenCalledTimes(1);
  });

  it('should fire onShowAnother when Show another is pressed', async () => {
    const view = await render(
      <DailyPickCard
        album={MOCK_ALBUM}
        onListenToday={handleListenTodayMock}
        onShowAnother={handleShowAnotherMock}
      />,
    );

    fireEvent.press(view.getByText('Show another'));
    expect(handleShowAnotherMock).toHaveBeenCalledTimes(1);
  });
});