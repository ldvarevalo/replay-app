export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser | null;
  accessToken: string | null;
}

export interface AuthAdapter {
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession>;
  getUser(): Promise<AuthUser | null>;
  onAuthStateChange(
    callback: (session: AuthSession | null) => void
  ): () => void;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
