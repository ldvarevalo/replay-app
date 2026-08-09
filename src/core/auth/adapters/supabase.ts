import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthAdapter, AuthSession, AuthUser } from '../types';
import { AuthError } from '../types';

/**
 * Types
 */

interface SupabaseUser {
  id: string;
  email?: string | null;
}

interface SupabaseSession {
  user: SupabaseUser;
  access_token: string;
}

/**
 * Helpers
 */

const mapUser = (user: SupabaseUser | null): AuthUser | null => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
  };
};

const mapSession = (session: SupabaseSession | null): AuthSession => {
  if (!session) {
    return {
      user: null,
      accessToken: null,
    };
  }

  return {
    user: mapUser(session.user),
    accessToken: session.access_token,
  };
};

/**
 * createSupabaseAdapter
 */

export const createSupabaseAdapter = (
  supabase: SupabaseClient
): AuthAdapter => ({
  signIn: async (email: string, password: string): Promise<AuthSession> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthError(error.message);
    }

    return mapSession(data.session);
  },

  signOut: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AuthError(error.message);
    }
  },

  getSession: async (): Promise<AuthSession> => {
    const { data } = await supabase.auth.getSession();

    return mapSession(data.session);
  },

  getUser: async (): Promise<AuthUser | null> => {
    const { data } = await supabase.auth.getUser();

    return mapUser(data.user);
  },

  onAuthStateChange: (
    callback: (session: AuthSession | null) => void
  ): (() => void) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(mapSession(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  },
});
