import { setRepositories } from '@/repositories/instance';
import { createTestRepositories } from '@/lib/test-utils/create-test-repositories';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      supabaseUrl: 'http://localhost:54321',
      supabaseAnonKey: 'test-anon-key',
    },
  },
}));

beforeEach(() => {
  setRepositories(createTestRepositories());
});
