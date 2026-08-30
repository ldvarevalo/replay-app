import type { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

export interface RecentlyListenedCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  listenedAt: string;
  onClick: () => void;
}

/**
 * Constants
 */

const INTERVALS: readonly (readonly [number, string])[] = [
  [31_536_000, 'year'],
  [2_592_000, 'month'],
  [604_800, 'week'],
  [86_400, 'day'],
  [3_600, 'hour'],
  [60, 'minute'],
];

/**
 * Helpers
 */

// ponytail: Hermes does not implement Intl.RelativeTimeFormat, so this mirrors
// Intl.RelativeTimeFormat('en', { numeric: 'auto' }) in plain JS instead.
const RELATIVE_SINGULARS: Readonly<Record<string, string>> = {
  day: 'yesterday',
  month: 'last month',
  year: 'last year',
};

const formatRelativeTime = (isoDate: string): string => {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  const match = INTERVALS.find(([s]) => seconds >= s);
  const [unitSeconds, unit] = match ?? [60, 'minute'];
  const value = Math.floor(seconds / unitSeconds);

  if (value <= 0) {
    return 'this minute';
  }

  const singular = RELATIVE_SINGULARS[unit];
  if (value === 1 && singular) {
    return singular;
  }
  if (value === 1) {
    return `1 ${unit} ago`;
  }

  return `${value} ${unit}s ago`;
};

/**
 * RecentlyListenedCard
 */

export const RecentlyListenedCard: FunctionComponent<
  RecentlyListenedCardProps
> = ({ coverUrl, title, artist, listenedAt, onClick }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${title} by ${artist}`}
    onPress={onClick}
    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
  >
    <View style={styles.thumb}>
      <Image
        source={{ uri: coverUrl }}
        style={styles.image}
        accessibilityLabel={title}
        contentFit="cover"
      />
    </View>
    <View style={styles.body}>
      <Text variant="body" numberOfLines={1}>
        {title}
      </Text>
      <Text variant="label" color="onSurfaceVariant" numberOfLines={1}>
        {artist}
      </Text>
      <Text variant="caption" color="onSurfaceVariant">
        {formatRelativeTime(listenedAt)}
      </Text>
    </View>
  </Pressable>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.two,
    padding: theme.spacing.two,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  pressed: { opacity: 0.7 },
  thumb: {
    width: 56,
    height: 56,
    overflow: 'hidden',
    backgroundColor: theme.colors.outlineVariant,
  },
  image: { width: '100%', height: '100%' },
  body: { flex: 1 },
}));
