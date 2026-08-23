import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  AuthProvider,
  useAuth,
  useSignIn,
  useSignOut,
  useUser,
} from '../auth-context';
import type { AuthAdapter, AuthSession, AuthUser } from '../types';

const USER_MOCK: AuthUser = {
  id: 'A.USER.ID',
  email: 'A.USER.EMAIL',
};
const SESSION_MOCK: AuthSession = {
  user: USER_MOCK,
  accessToken: 'A.ACCESS.TOKEN',
};
const EMPTY_SESSION_MOCK: AuthSession = {
  user: null,
  accessToken: null,
};

/**
 * Mocks
 */

const createMockAdapter = (
  overrides: Partial<AuthAdapter> = {}
): AuthAdapter => ({
  signIn: jest.fn().mockResolvedValue(SESSION_MOCK),
  signOut: jest.fn().mockResolvedValue(undefined),
  getSession: jest.fn().mockResolvedValue(EMPTY_SESSION_MOCK),
  getUser: jest.fn().mockResolvedValue(null),
  onAuthStateChange: jest.fn().mockReturnValue(() => {}),
  ...overrides,
});

const wrapper = (adapter: AuthAdapter) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider adapter={adapter}>{children}</AuthProvider>
  );
  Wrapper.displayName = 'Wrapper';
  return Wrapper;
};

/**
 * Tests
 */

describe('AuthProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should expose user from getSession on mount', async () => {
    const getSessionMock = jest.fn().mockResolvedValue(SESSION_MOCK);
    const adapter = createMockAdapter({ getSession: getSessionMock });
    const { result } = await renderHook(() => useUser(), {
      wrapper: wrapper(adapter),
    });
    await waitFor(() => expect(result.current).toEqual(USER_MOCK));
  });

  it('should call adapter and update user on signIn', async () => {
    const handleSignInMock = jest.fn().mockResolvedValue(SESSION_MOCK);
    const adapter = createMockAdapter({ signIn: handleSignInMock });
    const { result } = await renderHook(
      () => ({ signIn: useSignIn(), user: useUser() }),
      { wrapper: wrapper(adapter) }
    );
    await act(async () => {
      await result.current.signIn('A.USER.EMAIL', 'A.PASSWORD');
    });
    expect(handleSignInMock).toHaveBeenCalledWith('A.USER.EMAIL', 'A.PASSWORD');
    await waitFor(() => expect(result.current.user).toEqual(USER_MOCK));
  });

  it('should call adapter and clear user on signOut', async () => {
    const handleSignOutMock = jest.fn().mockResolvedValue(undefined);
    const getSessionMock = jest.fn().mockResolvedValue(SESSION_MOCK);
    const adapter = createMockAdapter({
      getSession: getSessionMock,
      signOut: handleSignOutMock,
    });
    const { result } = await renderHook(
      () => ({ signOut: useSignOut(), user: useUser() }),
      { wrapper: wrapper(adapter) }
    );
    await waitFor(() => expect(result.current.user).toEqual(USER_MOCK));
    await act(async () => {
      await result.current.signOut();
    });
    expect(handleSignOutMock).toHaveBeenCalled();
    await waitFor(() => expect(result.current.user).toBeNull());
  });

  it('should throw when useAuth is used outside AuthProvider', async () => {
    await expect(renderHook(() => useAuth())).rejects.toThrow(/AuthProvider/);
  });
});
