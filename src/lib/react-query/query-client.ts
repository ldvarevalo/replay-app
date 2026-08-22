import { QueryClient } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 30_000;
const DEFAULT_RETRY_COUNT = 1;
const TEST_RETRY_COUNT = 0;

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

export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: TEST_RETRY_COUNT,
      },
    },
  });
