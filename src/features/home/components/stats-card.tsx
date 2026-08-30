import type { FunctionComponent } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/components/ui/text';

/**
 * Types
 */

interface StatsCardProps {
  collectionCount: number;
  listeningHours: number;
}

/**
 * StatsCard
 */

export const StatsCard: FunctionComponent<StatsCardProps> = ({
  collectionCount,
  listeningHours,
}) => (
  <View style={styles.wrap}>
    <View style={styles.column}>
      <Text variant="label" style={styles.eyebrow}>
        Collection
      </Text>
      <Text variant="title">{collectionCount.toLocaleString()} albums</Text>
    </View>
    <View style={styles.column}>
      <Text variant="label" style={styles.eyebrow}>
        This month
      </Text>
      <Text variant="title">{listeningHours}h listening</Text>
    </View>
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: {
    flexDirection: 'row',
    gap: theme.spacing.four,
    backgroundColor: theme.colors.secondaryBrand,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.four,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    gap: theme.spacing.one,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: theme.typography.letterSpacing.wider,
  },
}));
