import { useEffect, type FunctionComponent } from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * Types
 */

export interface SkeletonProps extends ViewProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

/**
 * Skeleton
 */

export const Skeleton: FunctionComponent<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  style,
  ...props
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      {...props}
      style={[
        styles.skeleton,
        animatedStyle,
        { width, height, borderRadius },
        style,
      ]}
    />
  );
};

/**
 * Styles
 */

const styles = StyleSheet.create(theme => ({
  skeleton: {
    backgroundColor: theme.colors.outlineVariant,
  },
}));
