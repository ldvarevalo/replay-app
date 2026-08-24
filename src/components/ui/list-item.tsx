import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from './text';

/**
 * Types
 */

export interface ListItemProps extends ViewProps {
  title: string;
  description?: string;
  right?: ReactNode;
}

/**
 * ListItem
 */

export const ListItem: FunctionComponent<ListItemProps> = ({
  title,
  description,
  right,
  style,
  ...props
}) => (
  <View {...props} style={[styles.row, style]}>
    <View style={styles.body}>
      <Text variant="label">{title}</Text>
      {description && (
        <Text variant="caption" color="onSurfaceVariant">
          {description}
        </Text>
      )}
    </View>
    {right && <View style={styles.right}>{right}</View>}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.three,
    paddingHorizontal: theme.spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    gap: theme.spacing.two,
  },
  body: { flex: 1 },
  right: { alignItems: 'flex-end' },
}));
