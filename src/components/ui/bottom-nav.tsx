import type { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import {
  BarChart3,
  House,
  Library,
  Plus,
  type LucideIcon,
} from 'lucide-react-native';
import { Text } from './text';

/**
 * Types
 */

export type TabId = 'home' | 'collection' | 'add' | 'analytics';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export interface BottomNavProps {
  activeTab: TabId;
  onTabPress: (tab: TabId) => void;
}

/**
 * Constants
 */

const TABS: readonly Tab[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'collection', label: 'Collection', icon: Library },
  { id: 'add', label: 'Add', icon: Plus },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const;

/**
 * BottomNav
 */

export const BottomNav: FunctionComponent<BottomNavProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { theme } = useUnistyles();
  const colors = theme.colors;

  return (
    <View accessibilityRole="tablist" accessible style={styles.wrap}>
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeTab;
        return (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
            onPress={() => onTabPress(id)}
            style={({ pressed }) => [
              styles.tab(isActive),
              pressed ? styles.pressed : null,
            ]}
          >
            <Icon
              color={
                isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant
              }
              size={20}
            />
            <Text
              variant="label"
              color={isActive ? 'onPrimaryContainer' : 'onSurfaceVariant'}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    paddingTop: theme.spacing.two,
    paddingBottom: theme.spacing.two,
    paddingHorizontal: theme.spacing.two,
  },
  tab: (isActive: boolean) => ({
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.one,
    opacity: isActive ? 1 : 0.85,
  }),
  pressed: { opacity: 0.7 },
}));
