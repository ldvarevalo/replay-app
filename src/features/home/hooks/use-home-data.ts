import { useState, useCallback } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useUser } from '@/core/auth';
import { homeQueryKeys } from '@/lib/react-query/query-keys';
import { useRepositories } from '@/repositories/hooks';
import type { HomeData, HomeStats } from '@/types/domain';

/**
 * Constants
 */

const EMPTY_STATS: HomeStats = {
  totalReleases: 0,
  listeningTimeHours: 0,
  wantToBuy: 0,
};

const RECENT_ALBUMS_LIMIT = 4;
const UP_NEXT_LIMIT = 6;

/**
 * Helpers
 */

const or = <T>(value: T | undefined, fallback: T): T => value ?? fallback;

/**
 * useHomeData
 */

export const useHomeData = (): HomeData => {
  const user = useUser();
  const userId = user?.id;
  const { stats, userReleases } = useRepositories();
  const [dailyPickOffset, setDailyPickOffset] = useState(0);

  const { data: statsData } = useQuery({
    queryKey: homeQueryKeys.stats(userId ?? ''),
    queryFn: () => stats.findStats(user!.id),
    enabled: !!user,
  });

  const { data: dailyPick } = useQuery({
    queryKey: homeQueryKeys.dailyPick(userId ?? '', dailyPickOffset),
    queryFn: () => userReleases.findDailyPick(user!.id),
    enabled: !!user,
    placeholderData: keepPreviousData,
  });

  const { data: albumsData } = useQuery({
    queryKey: homeQueryKeys.recent(userId ?? ''),
    queryFn: () => userReleases.findRecent(user!.id, RECENT_ALBUMS_LIMIT),
    enabled: !!user,
  });

  const { data: rediscover } = useQuery({
    queryKey: homeQueryKeys.rediscover(userId ?? ''),
    queryFn: () => userReleases.findOldestListened(user!.id),
    enabled: !!user,
  });

  const { data: upNextData } = useQuery({
    queryKey: homeQueryKeys.upNext(userId ?? ''),
    queryFn: () => userReleases.findUpNext(user!.id, UP_NEXT_LIMIT),
    enabled: !!user,
  });

  const handleShowAnother = useCallback(() => {
    setDailyPickOffset(Math.floor(Math.random() * 9999));
  }, []);

  return {
    stats: or(statsData, EMPTY_STATS),
    dailyPick: or(dailyPick, null),
    albums: or(albumsData, []),
    rediscover: or(rediscover, null),
    upNext: or(upNextData, []),
    wantToBuyCount: or(statsData?.wantToBuy, 0),
    handleShowAnother,
  };
};
