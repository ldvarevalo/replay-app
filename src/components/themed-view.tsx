import { View, type ViewProps } from 'react-native';
import { type FunctionComponent } from 'react';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Types
 */

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
}

/**
 * ThemedView
 */

export const ThemedView: FunctionComponent<ThemedViewProps> = ({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}) => {
  const theme = useTheme();

  return (
    <View
      style={[{ backgroundColor: theme[type ?? 'background'] }, style]}
      {...otherProps}
    />
  );
};
