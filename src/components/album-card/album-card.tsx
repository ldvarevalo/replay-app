import type { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

export interface AlbumCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  year?: string;
  isListened?: boolean;
  onClick: () => void;
}

/**
 * AlbumCard
 */

export const AlbumCard: FunctionComponent<AlbumCardProps> = ({
  coverUrl,
  title,
  artist,
  year,
  isListened = false,
  onClick,
}) => {
  const { theme } = useUnistyles();

  return (
    <Pressable
      onPress={onClick}
      accessibilityRole="button"
      accessibilityLabel={`${title} by ${artist}`}
      style={styles.wrap}
    >
      <View style={styles.cover}>
        <Image
          source={{ uri: coverUrl }}
          style={styles.image}
          accessibilityLabel={title}
          contentFit="cover"
        />
        {isListened && (
          <View style={styles.badge}>
            <Check size={12} color={theme.colors.tertiary} />
          </View>
        )}
      </View>
      <Text variant="heading" numberOfLines={1}>
        {title}
      </Text>
      <Text variant="label" color="onSurfaceVariant" numberOfLines={1}>
        {artist}
      </Text>
      {year && (
        <Text variant="label" color="onSurfaceVariant">
          {year}
        </Text>
      )}
    </Pressable>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: { alignItems: 'flex-start', gap: theme.spacing.one },
  cover: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
    overflow: 'hidden',
    marginBottom: theme.spacing.two,
  },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    bottom: theme.spacing.one,
    right: theme.spacing.one,
    width: 20,
    height: 20,
    borderRadius: theme.radius.full,
    backgroundColor: `${theme.colors.tertiary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
