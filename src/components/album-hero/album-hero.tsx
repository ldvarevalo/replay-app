import type { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

export interface AlbumHeroProps {
  coverUrl: string;
  title: string;
  artist: string;
}

/**
 * AlbumHero
 */

export const AlbumHero: FunctionComponent<AlbumHeroProps> = ({
  coverUrl,
  title,
  artist,
}) => (
  <View style={styles.wrap}>
    <Image
      source={{ uri: coverUrl }}
      style={styles.cover}
      accessibilityLabel={title}
      contentFit="cover"
    />
    <View style={styles.scrim} />
    <View style={styles.text}>
      <Text variant="display">{title}</Text>
      <Text variant="title">{artist}</Text>
    </View>
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: { width: '100%', position: 'relative' },
  cover: { width: '100%', aspectRatio: 4 / 3 },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${theme.colors.background}99`,
  },
  text: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.three,
    gap: theme.spacing.one,
  },
}));
