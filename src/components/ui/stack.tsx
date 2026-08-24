import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { spacing, type Spacing } from '@/theme/spacing';

/**
 * Types
 */

export interface StackProps extends ViewProps {
  children?: ReactNode;
  direction?: 'row' | 'column';
  gap?: Spacing;
}

/**
 * Helpers
 */

const gapNumber = (gap: Spacing): number => spacing[gap];

/**
 * Stack
 */

export const Stack: FunctionComponent<StackProps> = ({
  children,
  direction = 'column',
  gap = 'three',
  style,
  ...props
}) => (
  <View
    style={[
      direction === 'row' ? styles.row : styles.column,
      { gap: gapNumber(gap) },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(() => ({
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
}));
