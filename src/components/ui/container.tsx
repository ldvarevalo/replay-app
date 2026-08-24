import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Types
 */

interface ContainerProps extends ViewProps {
  children?: ReactNode;
}

/**
 * Container
 */

export const Container: FunctionComponent<ContainerProps> = ({
  children,
  style,
  ...props
}) => (
  <View style={[styles.container, style]} {...props}>
    {children}
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(() => ({
  container: {
    flex: 1,
  },
}));
