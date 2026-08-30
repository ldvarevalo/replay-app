import type { ReactElement, ReactNode } from 'react';
import {
  QueryClientProvider,
  type QueryClient,
} from '@tanstack/react-query';
import {
  fireEvent,
  render as renderNative,
  renderHook as renderHookNative,
  waitFor,
  type RenderHookOptions as RNTLRenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react-native';
import { AuthProvider, type AuthAdapter } from '@/core/auth';
import { createTestQueryClient } from '@/lib/react-query/query-client';
import { setRepositories } from '@/repositories/instance';
import type { Repositories } from '@/repositories/types';
import {
  createTestRepositories,
  type RepositoryOverrides,
} from './create-test-repositories';

/**
 * Types
 */

export interface RenderHookOptions
  extends Omit<RNTLRenderHookOptions<unknown>, 'wrapper'> {
  queryClient?: QueryClient;
  repositories?: RepositoryOverrides;
  adapter?: Partial<AuthAdapter>;
}

export interface RenderResultWithProviders extends RenderResult {
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
  onAuthStateChange:
    override?.onAuthStateChange ?? defaults.onAuthStateChange,
});

/**
 * render
 */

export const render = async (
  ui: ReactElement,
  options: RenderOptions & {
    repositories?: RepositoryOverrides;
    adapter?: Partial<AuthAdapter>;
    queryClient?: QueryClient;
  } = {}
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

/**
 * renderHook
 */

export const renderHook = <T,>(
  hook: () => T,
  options: RenderHookOptions = {}
): Promise<RenderHookResult<T, unknown>> => {
  const { queryClient, repositories, adapter, ...rest } = options;
  const client = queryClient ?? createTestQueryClient();
  setRepositories(createTestRepositories(repositories));

  const resolvedAdapter = mergeAdapter(createDefaultAuthAdapter(), adapter);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <AuthProvider adapter={resolvedAdapter}>{children}</AuthProvider>
    </QueryClientProvider>
  );
  Wrapper.displayName = 'TestProvidersWrapper';

  return renderHookNative(hook, { wrapper: Wrapper, ...rest });
};

/**
 * Re-exports
 */

export { waitFor, fireEvent };