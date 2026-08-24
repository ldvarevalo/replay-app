// ponytail: hand-rolled Reanimated 4 mock — the bundled mock.js pulls in
// worklets initializers that hit the native module in jest. This stub
// covers only the surface the app uses (Skeleton today; extend as needed).
const {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Animated,
} = require('react-native');

const NOOP = () => {};
const ID = x => x;
const Easing = {
  linear: ID,
  ease: ID,
  inOut: ID,
  out: ID,
  in: ID,
  easeIn: ID,
  easeOut: ID,
  easeInOut: ID,
  bezier: () => ID,
};

const useSharedValue = initial => ({ value: initial });
const withRepeat = animation => animation;
const withTiming = toValue => ({ toValue });
const withSpring = toValue => ({ toValue });
const withDecay = toValue => ({ toValue });

module.exports = {
  __esModule: true,
  default: {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    Extrapolate: { CLAMP: 'clamp' },
    interpolate: NOOP,
    interpolateColor: NOOP,
    clamp: NOOP,
    createAnimatedComponent: C => C,
    addWhitelistedUIProps: NOOP,
    addWhitelistedNativeProps: NOOP,
    ...Animated,
  },
  Easing,
  useSharedValue,
  useAnimatedStyle: ID,
  useDerivedValue: ID,
  useAnimatedReaction: NOOP,
  useAnimatedRef: () => ({ current: null }),
  useAnimatedScrollHandler: () => NOOP,
  withRepeat,
  withTiming,
  withSpring,
  withDecay,
  runOnJS: fn => fn,
  runOnUI: fn => fn,
  interpolate: ID,
  Extrapolation: { CLAMP: 'clamp' },
  cancelAnimation: NOOP,
};
