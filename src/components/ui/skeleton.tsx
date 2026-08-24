import type { FunctionComponent } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Types
 */

export interface SkeletonProps extends ViewProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

/**
 * Skeleton
 */

export const Skeleton: FunctionComponent<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  style,
  ...props
}) => (
  <View
    {...props}
    style={[styles.skeleton, { width, height, borderRadius }, style]}
  />
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  skeleton: {
    backgroundColor: theme.colors.outlineVariant,
  },
}));
