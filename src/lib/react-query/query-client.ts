import { QueryClient } from '@tanstack/react-query';

/**
 * Constants
 */

const DEFAULT_STALE_TIME = 30_000;
const DEFAULT_RETRY_COUNT = 1;
const TEST_RETRY_COUNT = 0;

/**
 * createQueryClient
 */

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME,
        retry: DEFAULT_RETRY_COUNT,
        refetchOnWindowFocus: false,
      },
    },
  });

/**
 * createTestQueryClient
 */

export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: TEST_RETRY_COUNT,
      },
    },
  });
