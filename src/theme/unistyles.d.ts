import 'react-native-unistyles';
import type { AppTheme } from './index';

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme;
    dark: AppTheme;
  }
}
