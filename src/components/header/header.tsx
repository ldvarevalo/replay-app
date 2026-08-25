import type { FunctionComponent } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ArrowLeft, type LucideIcon } from 'lucide-react-native';
import { IconButton } from '@/components/ui/icon-button';
import { Stack } from '@/components/ui/stack';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
  rightAccessibilityLabel?: string;
}

/**
 * Header
 */

export const Header: FunctionComponent<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  rightAccessibilityLabel,
}) => (
  <View accessibilityRole="header" accessible style={styles.wrap}>
    <Stack direction="row" gap="two" style={styles.left}>
      {onBack && (
        <IconButton
          icon={ArrowLeft}
          onPress={onBack}
          accessibilityLabel="Go back"
          size={20}
        />
      )}
      <Stack gap="one" style={styles.titleStack}>
        <Text variant="title">{title}</Text>
        {subtitle && (
          <Text variant="body" color="onSurfaceVariant">
            {subtitle}
          </Text>
        )}
      </Stack>
    </Stack>
    {rightIcon && onRightPress && (
      <IconButton
        icon={rightIcon}
        onPress={onRightPress}
        accessibilityLabel={rightAccessibilityLabel}
        size={20}
      />
    )}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingHorizontal: theme.spacing.three,
    paddingVertical: theme.spacing.three,
  },
  left: {
    flex: 1,
    alignItems: 'center',
  },
  titleStack: {
    flex: 1,
  },
}));
