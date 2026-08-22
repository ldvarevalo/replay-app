import { authStore } from '../store';
import type { AuthUser } from '../types';

const USER_MOCK: AuthUser = {
  id: 'A.USER.ID',
  email: 'A.USER.EMAIL',
};

/**
 * Tests
 */

describe('authStore', () => {
  it('should start with null user', () => {
    expect(authStore.getUser()).toBeNull();
  });

  it('should update the current user on setUser', () => {
    authStore.setUser(USER_MOCK);
    expect(authStore.getUser()).toEqual(USER_MOCK);
  });

  it('should clear the current user on setUser(null)', () => {
    authStore.setUser(USER_MOCK);
    authStore.setUser(null);
    expect(authStore.getUser()).toBeNull();
  });

  it('should call the listener on setUser', () => {
    const listenerMock = jest.fn();
    const unsubscribe = authStore.subscribe(listenerMock);
    authStore.setUser(USER_MOCK);
    expect(listenerMock).toHaveBeenCalledWith(USER_MOCK);
    authStore.setUser(null);
    expect(listenerMock).toHaveBeenCalledWith(null);
    unsubscribe();
  });

  it('should remove the listener on unsubscribe', () => {
    const listenerMock = jest.fn();
    const unsubscribe = authStore.subscribe(listenerMock);
    unsubscribe();
    authStore.setUser(USER_MOCK);
    expect(listenerMock).not.toHaveBeenCalled();
  });
});
