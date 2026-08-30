import type { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

interface BannerCtaProps {
  count: number;
  onClick: () => void;
}

/**
 * BannerCta
 */

export const BannerCta: FunctionComponent<BannerCtaProps> = ({
  count,
  onClick,
}) => (
  <Pressable
    onPress={onClick}
    accessibilityRole="button"
    style={styles.wrap}
  >
    <View style={styles.textColumn}>
      <Text variant="label" color="onPrimaryContainer" style={styles.eyebrow}>
        WHISHLIST
      </Text>
      <Text variant="title" color="onPrimaryContainer">
        {count} records waiting
      </Text>
    </View>
    <Text variant="body" color="onPrimaryContainer" style={styles.arrow}>
      →
    </Text>
  </Pressable>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.five,
    paddingVertical: theme.spacing.four,
  },
  textColumn: {
    flexDirection: 'column',
    gap: theme.spacing.one,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: theme.typography.letterSpacing.wider,
  },
  arrow: {
    fontSize: theme.typography.size.xl,
  },
}));
