import type { FunctionComponent, ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

export interface AlbumRowProps {
  thumbnail: string;
  title: string;
  artist: string;
  duration?: string;
  isActive?: boolean;
  isAdded?: boolean;
  actionIcon?: ReactNode;
  onClick: () => void;
}

/**
 * AlbumRow
 */

export const AlbumRow: FunctionComponent<AlbumRowProps> = ({
  thumbnail,
  title,
  artist,
  duration,
  isActive = false,
  isAdded = false,
  actionIcon,
  onClick,
}) => {
  styles.useVariants({ isActive, isAdded });

  return (
    <Pressable
      onPress={onClick}
      accessibilityRole="button"
      accessibilityLabel={`${title} by ${artist}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: thumbnail }}
        style={styles.thumb}
        accessibilityLabel={title}
        contentFit="cover"
      />
      <View style={styles.body}>
        <Text numberOfLines={1}>{title}</Text>
        <Text variant="label" color="onSurfaceVariant" numberOfLines={1}>
          {artist}
        </Text>
      </View>
      {actionIcon ? (
        <View>{actionIcon}</View>
      ) : (
        duration && <Text variant="label">{duration}</Text>
      )}
    </Pressable>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.two,
    paddingHorizontal: theme.spacing.two,
    paddingVertical: theme.spacing.two,
    borderLeftWidth: 0,
    variants: {
      isActive: {
        true: { backgroundColor: theme.colors.surfaceContainerHigh },
        false: { backgroundColor: 'transparent' },
      },
      isAdded: {
        true: {
          borderLeftWidth: 2,
          borderLeftColor: `${theme.colors.tertiary}66`,
        },
        false: {},
      },
    },
  },
  pressed: { opacity: 0.7 },
  thumb: { width: 40, height: 40 },
  body: { flex: 1 },
}));
