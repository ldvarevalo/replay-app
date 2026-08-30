import type { QueryKey } from '@tanstack/react-query';

/**
 * homeQueryKeys
 *
 * Hierarchical TanStack Query key factory for the Home screen. Build keys
 * with the helpers (`homeQueryKeys.stats(userId)`) and invalidate / count
 * all home queries with `homeQueryKeys.all`. The `all` reference matches
 * every key that starts with `['home', ...]`, which is exactly the five
 * queries the Home hook subscribes to.
 */

export const homeQueryKeys = {
  all: ['home'] as const,
  stats: (userId: string) => [...homeQueryKeys.all, 'stats', userId] as const,
  dailyPick: (userId: string, offset: number) =>
    [...homeQueryKeys.all, 'daily-pick', userId, offset] as const,
  recent: (userId: string) => [...homeQueryKeys.all, 'recent', userId] as const,
  rediscover: (userId: string) =>
    [...homeQueryKeys.all, 'rediscover', userId] as const,
  upNext: (userId: string) =>
    [...homeQueryKeys.all, 'up-next', userId] as const,
};

export type HomeQueryKey = QueryKey;
