import type { FunctionComponent } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Types
 */

export type InputProps = TextInputProps;

/**
 * Input
 */

export const Input: FunctionComponent<InputProps> = ({ style, ...props }) => (
  <TextInput {...props} style={[styles.input, style]} />
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.three,
    paddingVertical: theme.spacing.two,
    color: theme.colors.onSurface,
    fontSize: 16,
  },
}));
