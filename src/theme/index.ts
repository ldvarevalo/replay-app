import { StyleSheet } from 'react-native-unistyles';
import { darkColors, lightColors, type ColorTokens } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';

/**
 * Types
 */

export interface AppTheme {
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

/**
 * Constants
 */

const lightTheme: AppTheme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
};

const darkTheme: AppTheme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
};

/**
 * Configuration
 *
 * Unistyles 3.0 uses a single `StyleSheet.configure()` call. Note: in 3.0,
 * `initialTheme` and `adaptiveThemes` are mutually exclusive (discriminated
 * union). We use `adaptiveThemes: true` so the app follows the system color
 * scheme (matches the design spec: "Dark + light desde el inicio").
 *
 * Runtime theme switch: `UnistylesRuntime.setTheme('light' | 'dark')`.
 */

StyleSheet.configure({
  themes: { light: lightTheme, dark: darkTheme },
  settings: {
    adaptiveThemes: true,
  },
});

export { lightTheme, darkTheme };
