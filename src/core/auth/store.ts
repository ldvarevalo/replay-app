import type { AuthUser } from './types';

type Listener = (user: AuthUser | null) => void;

let currentUser: AuthUser | null = null;
const listeners: Set<Listener> = new Set();

export const authStore = {
  getUser: (): AuthUser | null => currentUser,
  setUser: (user: AuthUser | null): void => {
    currentUser = user;
    listeners.forEach(fn => {
      fn(user);
    });
  },
  subscribe: (fn: Listener): (() => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
