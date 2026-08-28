import { createElement } from 'react';
import { View } from 'react-native';

const router = {
  replace: jest.fn(),
  navigate: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
  dismiss: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(false),
};

module.exports = {
  __esModule: true,
  router,
  useRouter: () => router,
  usePathname: () => '/',
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  Stack: {
    Screen: (props: Record<string, unknown>) => createElement(View, props),
  },
  Tabs: {
    Screen: (props: Record<string, unknown>) => createElement(View, props),
  },
  Redirect: () => null,
  Link: (props: Record<string, unknown>) => createElement(View, props),
  Href: {},
};
