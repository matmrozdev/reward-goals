import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  ReduceMotion,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

import type { GoalAccent } from '@/features/goals/types/goal-preview.types';

import { styles } from './GoalStatusAction.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const completionAnimationDuration = 720;
const undoAnimationDuration = 220;

type GoalStatusActionProps = {
  accent: GoalAccent;
  accessibilityLabel: string;
  completed: boolean;
  disabled?: boolean;
  onPress?: () => Promise<boolean>;
};

export const GoalStatusAction = ({
  accent,
  accessibilityLabel,
  completed,
  disabled = false,
  onPress,
}: GoalStatusActionProps) => {
  const { theme } = useUnistyles();
  const [optimisticCompleted, setOptimisticCompleted] = useState<
    boolean | null
  >(null);

  const interactionPending = useRef(false);
  const reducedMotion = useReducedMotion();
  const visualCompleted = optimisticCompleted ?? completed;
  const isAnimationPending = optimisticCompleted !== null;
  const isActionDisabled = disabled || isAnimationPending;
  const accentColor =
    accent === 'success' ? theme.colors.success : theme.colors.primary;
  const actionSize = theme.sizes.minTouchTarget;
  const strokeWidth = theme.sizes.borderWidth * 2;
  const center = actionSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const completionProgress = useDerivedValue(
    () =>
      withTiming(visualCompleted ? 1 : 0, {
        duration: visualCompleted
          ? completionAnimationDuration
          : undoAnimationDuration,
        easing: visualCompleted ? Easing.linear : Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
    [visualCompleted],
  );

  const ringAnimatedProps = useAnimatedProps(() => {
    const ringProgress = interpolate(
      completionProgress.value,
      [0, 0.48],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: ringProgress > 0 ? 1 : 0,
      strokeDashoffset: circumference * (1 - ringProgress),
    };
  });

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      completionProgress.value,
      [0.4, 0.54],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          completionProgress.value,
          [0, 0.4, 0.65, 0.86],
          [0.7, 0.7, 1.24, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity:
      visualCompleted && onPress
        ? interpolate(
            completionProgress.value,
            [0.52, 0.66, 0.84, 1],
            [0, 1, 1, 0],
            Extrapolation.CLAMP,
          )
        : 0,
    transform: [
      {
        scale: interpolate(
          completionProgress.value,
          [0.52, 0.7, 1],
          [0.5, 1.15, 0.8],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const handlePress = async () => {
    if (!onPress || interactionPending.current) {
      return;
    }

    interactionPending.current = true;

    const nextCompleted = !completed;
    let animationDuration = 0;

    if (!reducedMotion) {
      animationDuration = nextCompleted
        ? completionAnimationDuration
        : undoAnimationDuration;
    }

    setOptimisticCompleted(nextCompleted);

    try {
      const animationFinished = new Promise<void>((resolve) => {
        setTimeout(resolve, animationDuration);
      });
      const requestSucceeded = await onPress();

      if (requestSucceeded) {
        await animationFinished;
      }
    } finally {
      interactionPending.current = false;
      setOptimisticCompleted(null);
    }
  };

  const content = (
    <>
      <Svg
        accessibilityElementsHidden
        height={actionSize}
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={styles.ring}
        width={actionSize}
      >
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          animatedProps={ringAnimatedProps}
          cx={center}
          cy={center}
          fill="none"
          origin={`${center}, ${center}`}
          r={radius}
          rotation={-90}
          stroke={accentColor}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      <Animated.View style={[styles.check, checkAnimatedStyle]}>
        <MaterialCommunityIcons
          color={accentColor}
          name="check"
          size={theme.spacing.xl}
        />
      </Animated.View>
      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={[styles.sparkles, sparkleAnimatedStyle]}
      >
        <MaterialCommunityIcons
          color={accentColor}
          name="star-four-points"
          size={theme.spacing.md}
          style={styles.sparkleTop}
        />
        <MaterialCommunityIcons
          color={accentColor}
          name="star-four-points"
          size={theme.spacing.sm}
          style={styles.sparkleTopLeft}
        />
        <MaterialCommunityIcons
          color={accentColor}
          name="star-four-points"
          size={theme.spacing.sm}
          style={styles.sparkleBottomLeft}
        />
      </Animated.View>
    </>
  );

  if (!onPress) {
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
        style={styles.action}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: visualCompleted,
        disabled: isActionDisabled,
      }}
      disabled={isActionDisabled}
      onPress={() => void handlePress()}
      style={[
        styles.action,
        disabled && !isAnimationPending && styles.disabled,
      ]}
    >
      {content}
    </Pressable>
  );
};
