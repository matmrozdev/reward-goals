import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { normalizeProgress } from '@/ui/utils/normalize-progress';

import { styles } from './ProgressBar.styles';

const progressAnimationDuration = 450;

export type ProgressBarTone = 'primary' | 'success';

export type ProgressBarProps = {
  accessibilityLabel: string;
  max: number;
  tone?: ProgressBarTone;
  value: number;
};

export const ProgressBar = ({
  accessibilityLabel,
  max,
  tone = 'primary',
  value,
}: ProgressBarProps) => {
  const progress = normalizeProgress({ max, value });
  const animatedFraction = useSharedValue(0);

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: `${animatedFraction.value * 100}%` as `${number}%`,
  }));

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
      style={styles.track}
    >
      <Animated.View style={[styles.fill(tone), animatedFillStyle]} />
    </View>
  );
};
