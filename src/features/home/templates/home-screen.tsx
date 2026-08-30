import { useCallback } from 'react';
import type { FunctionComponent } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { homeQueryKeys } from '@/lib/react-query/query-keys';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/section-header';
import { Stack } from '@/components/ui/stack';
import { Text } from '@/components/ui/text';
import { BannerCta } from '../components/banner-cta';
import { DailyPickCard } from '../components/daily-pick-card';
import { RecentlyListenedCard } from '../components/recently-listened-card';
import { RediscoverCard } from '../components/rediscover-card';
import { StatsCard } from '../components/stats-card';
import { UpNextList } from '../components/up-next-list';
import { useHomeData } from '../hooks/use-home-data';

/**
 * HomeScreen
 */

export const HomeScreen: FunctionComponent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme } = useUnistyles();

  const {
    stats: statsData,
    dailyPick,
    albums,
    rediscover,
    upNext,
    wantToBuyCount,
    handleShowAnother,
  } = useHomeData();

  const isRefreshing = useIsFetching({ queryKey: homeQueryKeys.all }) > 0;

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: homeQueryKeys.all });
  }, [queryClient]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.onSurface}
          />
        }
      >
        {dailyPick && (
          <DailyPickCard
            album={dailyPick}
            onListenToday={() => router.push(`/album/${dailyPick.id}`)}
            onShowAnother={handleShowAnother}
          />
        )}

        <StatsCard
          collectionCount={statsData.totalReleases}
          listeningHours={statsData.listeningTimeHours}
        />

        <BannerCta
          count={wantToBuyCount}
          onClick={() => router.push('/collection?want')}
        />

        <SectionHeader title="Recently Listened" />
        <Stack direction="row" gap="two" style={styles.recentGrid}>
          {albums.map(album => (
            <View key={album.id} style={styles.recentCell}>
              <RecentlyListenedCard
                coverUrl={album.coverUrl}
                title={album.title}
                artist={album.artist}
                listenedAt={album.listenedAt}
                onClick={() => router.push(`/album/${album.id}`)}
              />
            </View>
          ))}
        </Stack>

        {rediscover && (
          <>
            <SectionHeader title="Rediscover" />
            <RediscoverCard
              coverUrl={rediscover.coverUrl}
              title={rediscover.title}
              artist={rediscover.artist}
              onClick={() => router.push(`/album/${rediscover.id}`)}
            />
          </>
        )}

        <SectionHeader title="Up Next" />
        {upNext.length > 0 ? (
          <UpNextList
            albums={upNext}
            onAlbumClick={album => router.push(`/album/${album.id}`)}
          />
        ) : (
          <Text variant="caption" color="onSurfaceVariant">
            All caught up!
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  content: {
    paddingVertical: theme.spacing.four,
    paddingHorizontal: theme.spacing.three,
    gap: theme.spacing.four,
  },
  recentGrid: {
    flexWrap: 'wrap',
  },
  recentCell: {
    width: '48%',
  },
}));
