import type { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/components/ui/button';
import { Stack } from '@/components/ui/stack';
import { Text } from '@/components/ui/text';
import type { AlbumWithDate } from '@/types/domain';
import { getRelativeTime } from '../helpers/get-relative-time';

/**
 * Types
 */

export interface DailyPickCardProps {
  album: AlbumWithDate;
  onListenToday: () => void;
  onShowAnother: () => void;
}

/**
 * DailyPickCard
 */

export const DailyPickCard: FunctionComponent<DailyPickCardProps> = ({
  album,
  onListenToday,
  onShowAnother,
}) => (
  <View style={styles.card}>
    <Stack direction="row" gap="five" style={styles.top}>
      <View style={styles.text}>
        <Text variant="label" color="onSurfaceVariant">
          Today&apos;s Pick
        </Text>
        <Stack direction="column" gap="one" style={styles.meta}>
          <Text variant="heading">{album.title}</Text>
          <Text variant="caption" color="onSurfaceVariant">
            {album.artist}
          </Text>
          <Text variant="caption" color="onSurfaceVariant">
            {getRelativeTime(album.createdAt)}
          </Text>
        </Stack>
      </View>
      <View style={styles.cover}>
        <Image
          source={{ uri: album.coverUrl }}
          style={styles.image}
          accessibilityLabel={album.title}
          contentFit="cover"
        />
      </View>
    </Stack>

    <Stack direction="row" gap="two" style={styles.actions}>
      <Button variant="text" size="sm" onPress={onListenToday}>
        Listen today
      </Button>
      <Button variant="text" size="sm" onPress={onShowAnother}>
        Show another
      </Button>
    </Stack>
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  card: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.radius.md,
    padding: theme.spacing.three,
    gap: theme.spacing.three,
  },
  top: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  text: { flex: 1 },
  meta: { marginTop: theme.spacing.four },
  cover: {
    width: 160,
    height: 160,
    overflow: 'hidden',
    backgroundColor: theme.colors.outlineVariant,
  },
  image: { width: '100%', height: '100%' },
  actions: {
    justifyContent: 'space-between',
    marginTop: theme.spacing.two,
  },
}));
