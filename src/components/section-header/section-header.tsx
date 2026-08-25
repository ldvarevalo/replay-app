import type { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

export interface SectionHeaderProps {
  title: string;
  onLinkClick?: () => void;
  linkLabel?: string;
}

/**
 * SectionHeader
 */

export const SectionHeader: FunctionComponent<SectionHeaderProps> = ({
  title,
  onLinkClick,
  linkLabel = 'VIEW ALL',
}) => (
  <View style={styles.wrap}>
    <Text variant="heading">{title}</Text>
    {onLinkClick && (
      <Pressable
        onPress={onLinkClick}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={linkLabel}
      >
        <Text variant="label" color="onSurfaceVariant">
          {linkLabel}
        </Text>
      </Pressable>
    )}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.three,
  },
}));
