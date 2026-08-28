import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from './text';

/**
 * Types
 */

export interface EmptyStateProps extends ViewProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * EmptyState
 */

export const EmptyState: FunctionComponent<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  style,
  ...props
}) => (
  <View {...props} style={[styles.container, style]}>
    {icon && <View>{icon}</View>}
    <Text variant="heading" align="center" accessibilityRole="header">
      {title}
    </Text>
    {description && (
      <Text variant="caption" color="onSurfaceVariant" align="center">
        {description}
      </Text>
    )}
    {action && <View>{action}</View>}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.four,
    gap: theme.spacing.three,
  },
}));
