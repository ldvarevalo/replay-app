import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Types
 */

export interface CardProps extends ViewProps {
  children: ReactNode;
}

/**
 * Card
 */

export const Card: FunctionComponent<CardProps> = ({
  children,
  style,
  ...props
}) => (
  <View {...props} style={[styles.card, style]}>
    {children}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.three,
  },
}));
