import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

import { normalizeProgress } from '@/ui/utils/normalize-progress';

import { styles } from './CircularProgress.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const progressAnimationDuration = 450;

export type CircularProgressProps = {
  accessibilityLabel: string;
  children?: ReactNode;
  max: number;
  size?: number;
  value: number;
};

export const CircularProgress = ({
  accessibilityLabel,
  children,
  max,
  size = 104,
  value,
}: CircularProgressProps) => {
  const { theme } = useUnistyles();
  const progress = normalizeProgress({ max, value });
  const strokeWidth = size * 0.11;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedFraction = useSharedValue(0);

  const animatedProps = useAnimatedProps(
    () => ({
      strokeDashoffset: circumference * (1 - animatedFraction.value),
    }),
    [circumference],
  );

  useEffect(() => {
    animatedFraction.value = withTiming(progress.fraction, {
      duration: progressAnimationDuration,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [animatedFraction, progress.fraction]);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: progress.max, min: 0, now: progress.value }}
      style={styles.container(size)}
    >
      <Svg
        accessibilityElementsHidden
        height={size}
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={styles.ring}
        width={size}
      >
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={theme.colors.primaryMuted}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={center}
          cy={center}
          fill="none"
          origin={`${center}, ${center}`}
          r={radius}
          rotation={-90}
          stroke={theme.colors.primary}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.content}
      >
        {children}
      </View>
    </View>
  );
};
