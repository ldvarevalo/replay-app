import type { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react-native';
import { AuthProvider, type AuthAdapter } from '@/core/auth';
import { createTestQueryClient } from '@/lib/react-query/query-client';
import { setRepositories } from '@/repositories/instance';
import type { Repositories } from '@/repositories/types';
import { createTestRepositories } from './create-test-repositories';

/**
 * Types
 */

type RepositoryOverrides = {
  [K in keyof Repositories]?: Partial<Repositories[K]>;
};

interface Options extends Omit<RenderOptions, 'wrapper'> {
  repositories?: RepositoryOverrides;
  adapter?: AuthAdapter;
  queryClient?: QueryClient;
}

/**
 * renderWithProviders
 */

export const renderWithProviders = (
  ui: ReactElement,
  options: Options = {}
) => {
  const { repositories, adapter, queryClient, ...rest } = options;
  const client = queryClient ?? createTestQueryClient();
  setRepositories(createTestRepositories(repositories));

  const stubAdapter: AuthAdapter = adapter ?? {
    signIn: jest.fn().mockResolvedValue({ user: null, accessToken: null }),
    signOut: jest.fn().mockResolvedValue(undefined),
    getSession: jest.fn().mockResolvedValue({ user: null, accessToken: null }),
    getUser: jest.fn().mockResolvedValue(null),
    onAuthStateChange: jest.fn().mockReturnValue(() => {}),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <AuthProvider adapter={stubAdapter}>{children}</AuthProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper, ...rest });
};
