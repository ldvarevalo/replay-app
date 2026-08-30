import type { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Stack } from '@/components/ui/stack';
import { Text } from '@/components/ui/text';
import type { Album } from '@/types/domain';

/**
 * Types
 */

export interface UpNextListProps {
  albums: readonly Album[];
  onAlbumClick: (album: Album) => void;
}

/**
 * UpNextList
 */

export const UpNextList: FunctionComponent<UpNextListProps> = ({
  albums,
  onAlbumClick,
}) => {
  const { theme } = useUnistyles();

  const itemBackground = (index: number): string => {
    if (index === 0) {
      return `${theme.colors.violet}33`;
    }
    if (index === 1) {
      return `${theme.colors.violet}1A`;
    }
    return theme.colors.surfaceContainerLowest;
  };

  return (
    <Stack direction="column" gap="two">
      {albums.map((album, i) => (
        <Pressable
          key={album.id}
          accessibilityRole="button"
          accessibilityLabel={`${album.title} by ${album.artist}`}
          onPress={() => onAlbumClick(album)}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <View style={[styles.row, { backgroundColor: itemBackground(i) }]}>
            <View style={styles.thumb}>
              <Image
                source={{ uri: album.coverUrl }}
                style={styles.image}
                accessibilityLabel={album.title}
                contentFit="cover"
              />
            </View>
            <View style={styles.body}>
              <Text variant="body" numberOfLines={1}>
                {album.title}
              </Text>
              <Text variant="label" color="onSurfaceVariant" numberOfLines={1}>
                {album.artist}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </Stack>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  pressed: { opacity: 0.7 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.two,
    padding: theme.spacing.two,
    borderRadius: theme.radius.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    overflow: 'hidden',
    backgroundColor: theme.colors.outlineVariant,
  },
  image: { width: '100%', height: '100%' },
  body: { flex: 1 },
}));
