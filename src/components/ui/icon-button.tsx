import type { FunctionComponent } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { LucideIcon } from 'lucide-react-native';

/**
 * Types
 */

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: LucideIcon;
  size?: number;
}

/**
 * IconButton
 */

export const IconButton: FunctionComponent<IconButtonProps> = ({
  icon: Icon,
  size = 24,
  disabled,
  style,
  ...props
}) => (
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
    <View>
      <Icon size={size} strokeWidth={2} />
    </View>
  </Pressable>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  pressed: { opacity: 0.5 },
  disabled: { opacity: 0.3 },
}));
