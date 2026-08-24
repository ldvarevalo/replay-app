import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Types
 */

export interface SectionProps extends ViewProps {
  header?: ReactNode;
  children: ReactNode;
}

/**
 * Section
 */

export const Section: FunctionComponent<SectionProps> = ({
  header,
  children,
  style,
  ...props
}) => (
  <View {...props} style={[styles.section, style]}>
    {header && <View>{header}</View>}
    {children}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  section: { gap: theme.spacing.three },
}));
