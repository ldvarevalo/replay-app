import type { FunctionComponent, ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Types
 */

interface ScreenProps extends ViewProps {
  children?: ReactNode;
}

/**
 * Screen
 */

export const Screen: FunctionComponent<ScreenProps> = ({
  children,
  style,
  ...props
}) => (
  <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']} {...props}>
    <View style={[styles.container, style]}>{children}</View>
  </SafeAreaView>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
}));
