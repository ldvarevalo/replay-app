import type { FunctionComponent } from 'react';
import { View } from 'react-native';
import { Search } from 'lucide-react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Input, type InputProps } from '@/components/ui/input';

/**
 * Types
 */

export interface SearchBarProps extends Omit<
  InputProps,
  'label' | 'helper' | 'error'
> {
  placeholder?: string;
}

/**
 * SearchBar
 */

export const SearchBar: FunctionComponent<SearchBarProps> = ({
  placeholder = 'Search archive...',
  ...props
}) => (
  <View style={styles.wrap}>
    <View style={styles.icon}>
      <Search size={16} />
    </View>
    <Input placeholder={placeholder} {...props} />
  </View>
);

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  wrap: { position: 'relative', justifyContent: 'center' },
  icon: {
    position: 'absolute',
    left: theme.spacing.two,
    zIndex: 1,
    pointerEvents: 'none',
  },
}));
