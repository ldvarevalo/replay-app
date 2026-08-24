import '@/theme';
import { setRepositories } from '@/repositories/instance';
import { createTestRepositories } from '@/lib/test-utils/create-test-repositories';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('react-native-reanimated');

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = ({
    children: _children,
    ...props
  }: Record<string, unknown>) =>
    React.createElement(View, { testID: 'lucide-icon', ...props });
  const handler: ProxyHandler<object> = {
    get: (_target, prop: string) => MockIcon,
  };
  return new Proxy({}, handler);
});

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
