import type { FunctionComponent, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from './text';

/**
 * Types
 */

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'destructive';
export type ButtonSize = 'default' | 'sm';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

type TextColorForVariant = Record<
  ButtonVariant,
  'onSurfaceVariant' | 'onPrimaryContainer' | 'onSurface' | 'destructive'
>;

/**
 * Constants
 */

const TEXT_COLOR: TextColorForVariant = {
  primary: 'onPrimaryContainer',
  secondary: 'onSurface',
  text: 'onSurfaceVariant',
  destructive: 'destructive',
};

/**
 * Button
 */

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const { theme } = useUnistyles();
  styles.useVariants({ variant, ...(size === 'sm' && { size }) });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: !!disabled }}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      disabled={disabled || loading}
      style={state => [
        styles.button,
        state.pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors[TEXT_COLOR[variant]]} />
      ) : (
        <Text variant="label" color={TEXT_COLOR[variant]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: theme.colors.outline,
    borderRadius: theme.radius.md,
    variants: {
      variant: {
        primary: { backgroundColor: theme.colors.primaryContainer },
        secondary: { backgroundColor: theme.colors.surface },
        text: { backgroundColor: 'transparent' },
        destructive: { backgroundColor: `${theme.colors.destructive}22` },
      },
      size: {
        default: {
          paddingVertical: theme.spacing.three,
          paddingHorizontal: theme.spacing.four,
          minHeight: 44,
        },
        sm: {
          paddingVertical: theme.spacing.two,
          paddingHorizontal: theme.spacing.three,
          minHeight: 32,
        },
      },
    },
    compoundVariants: [
      {
        variant: 'secondary',
        styles: { borderWidth: 1 },
      },
    ],
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
}));
