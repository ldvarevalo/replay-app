import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render as renderNative,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react-native';
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
  adapter?: Partial<AuthAdapter>;
  queryClient?: QueryClient;
}

interface RenderResultWithProviders extends RenderResult {
  adapter: AuthAdapter;
}

/**
 * Helpers
 */

const createDefaultAuthAdapter = (): AuthAdapter => ({
  signIn: jest.fn().mockResolvedValue({ user: null, accessToken: null }),
  signOut: jest.fn().mockResolvedValue(undefined),
  getSession: jest.fn().mockResolvedValue({ user: null, accessToken: null }),
  getUser: jest.fn().mockResolvedValue(null),
  onAuthStateChange: jest.fn().mockReturnValue(() => {}),
});

const mergeAdapter = (
  defaults: AuthAdapter,
  override: Partial<AuthAdapter> | undefined
): AuthAdapter => ({
  signIn: override?.signIn ?? defaults.signIn,
  signOut: override?.signOut ?? defaults.signOut,
  getSession: override?.getSession ?? defaults.getSession,
  getUser: override?.getUser ?? defaults.getUser,
  onAuthStateChange: override?.onAuthStateChange ?? defaults.onAuthStateChange,
});

/**
 * render
 */

export const render = async (
  ui: ReactElement,
  options: Options = {}
): Promise<RenderResultWithProviders> => {
  const { repositories, adapter, queryClient, ...rest } = options;
  const client = queryClient ?? createTestQueryClient();
  setRepositories(createTestRepositories(repositories));

  const resolvedAdapter = mergeAdapter(createDefaultAuthAdapter(), adapter);

  const wrapped: ReactElement = (
    <QueryClientProvider client={client}>
      <AuthProvider adapter={resolvedAdapter}>{ui}</AuthProvider>
    </QueryClientProvider>
  );

  const result = await renderNative(wrapped, rest);
  return Object.assign(result, { adapter: resolvedAdapter });
};
