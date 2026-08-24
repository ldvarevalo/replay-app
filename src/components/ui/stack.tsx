import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { Spacing } from '@/theme/spacing';

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

const gapNumber = (gap: Spacing): number => {
  switch (gap) {
    case 'half':
      return 2;
    case 'one':
      return 4;
    case 'two':
      return 8;
    case 'three':
      return 16;
    case 'four':
      return 24;
    case 'five':
      return 32;
    case 'six':
      return 64;
  }
};

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
      styles.base,
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
  base: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
}));
