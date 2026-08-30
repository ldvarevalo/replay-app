import type { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native-unistyles';
import { Stack } from '@/components/ui/stack';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

export interface RediscoverCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  onClick: () => void;
}

/**
 * RediscoverCard
 */

export const RediscoverCard: FunctionComponent<RediscoverCardProps> = ({
  coverUrl,
  title,
  artist,
  onClick,
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${title} by ${artist}`}
    onPress={onClick}
    style={({ pressed }) => pressed && styles.pressed}
  >
    <View style={styles.card}>
      <View style={styles.cover}>
        <Image
          source={{ uri: coverUrl }}
          style={styles.image}
          accessibilityLabel={title}
          contentFit="cover"
        />
      </View>
      <Stack direction="column" gap="half" style={styles.body}>
        <Text variant="heading">{title}</Text>
        <Text variant="caption" color="onSurfaceVariant">
          {artist}
        </Text>
      </Stack>
    </View>
  </Pressable>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  pressed: { opacity: 0.7 },
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    aspectRatio: 3,
    backgroundColor: theme.colors.outlineVariant,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  body: { padding: theme.spacing.two },
}));
