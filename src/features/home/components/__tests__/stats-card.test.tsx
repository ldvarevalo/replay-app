import { render } from '@/lib/test-utils/render-with-providers';
import { StatsCard } from '../stats-card';

/**
 * Tests
 */

describe('StatsCard', () => {
  it('should render collection count and listening hours', async () => {
    const view = await render(
      <StatsCard collectionCount={1200} listeningHours={8} />
    );

    expect(view.getByText('1,200 albums')).toBeTruthy();
    expect(view.getByText('8h listening')).toBeTruthy();
    expect(view.getByText('Collection')).toBeTruthy();
    expect(view.getByText('This month')).toBeTruthy();
  });
});
