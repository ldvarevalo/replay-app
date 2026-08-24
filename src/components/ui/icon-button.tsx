import type { FunctionComponent } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { LucideIcon } from 'lucide-react-native';

/**
 * Types
 */

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: LucideIcon;
  size?: number;
  color?: string;
}

/**
 * IconButton
 */

export const IconButton: FunctionComponent<IconButtonProps> = ({
  icon: Icon,
  size = 24,
  color,
  disabled,
  style,
  ...props
}) => {
  const { theme } = useUnistyles();

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={state => [
        typeof style === 'function' ? style(state) : style,
        state.pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...props}
    >
      <Icon
        size={size}
        strokeWidth={2}
        color={color ?? theme.colors.onSurface}
      />
    </Pressable>
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  pressed: { opacity: 0.5 },
  disabled: { opacity: 0.3 },
}));
