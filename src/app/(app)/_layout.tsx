import { Stack, usePathname, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, type TabId } from '@/components/ui/bottom-nav';

/**
 * Constants
 */

const PATH_TO_TAB: Record<string, TabId> = {
  '/inicio': 'home',
  '/collection': 'collection',
  '/release/add': 'add',
  '/analytics': 'analytics',
};

const TAB_TO_PATH: Record<
  TabId,
  '/inicio' | '/collection' | '/release/add' | '/analytics'
> = {
  home: '/inicio',
  collection: '/collection',
  add: '/release/add',
  analytics: '/analytics',
};

/**
 * AppLayout
 */

export default function AppLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeTab: TabId =
    Object.entries(PATH_TO_TAB).find(([path]) =>
      pathname?.startsWith(path)
    )?.[1] ?? 'home';

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="inicio" />
          <Stack.Screen name="collection" />
          <Stack.Screen name="release/add" />
          <Stack.Screen name="analytics" />
        </Stack>
      </View>
      <BottomNav
        activeTab={activeTab}
        onTabPress={tab =>
          router.push(TAB_TO_PATH[tab] as Parameters<typeof router.push>[0])
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
