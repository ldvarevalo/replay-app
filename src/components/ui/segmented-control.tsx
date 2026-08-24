import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from './text';

/**
 * Types
 */

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  testID?: string;
}

/**
 * SegmentedControl
 */

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  testID,
}: SegmentedControlProps<T>) => (
  <View
    accessibilityRole="tablist"
    accessible
    testID={testID}
    style={styles.container}
  >
    {options.map(option => {
      const selected = option.value === value;
      return (
        <Pressable
          key={option.value}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          onPress={() => {
            if (!selected) {
              onChange(option.value);
            }
          }}
          style={[styles.segment, selected && styles.segmentSelected]}
        >
          <Text
            variant="label"
            color={selected ? 'onPrimaryContainer' : 'onSurfaceVariant'}
          >
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.one,
    gap: theme.spacing.one,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.two,
    borderRadius: theme.radius.sm,
  },
  segmentSelected: {
    backgroundColor: theme.colors.primaryContainer,
  },
}));
