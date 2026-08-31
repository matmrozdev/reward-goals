import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import type { ReactNode } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { Text } from '@/ui/components/Text';

import { styles } from './BottomSheet.styles';

const transitionDuration = 260;
const transitionConfig = {
  duration: transitionDuration,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
};

type BottomSheetActions = {
  close: () => void;
};

export type BottomSheetProps = {
  children: ReactNode | ((actions: BottomSheetActions) => ReactNode);
  dismissible?: boolean;
  onClose: () => void;
  subtitle?: string;
  title: string;
  visible: boolean;
};

export const BottomSheet = ({
  children,
  dismissible = true,
  onClose,
  subtitle,
  title,
  visible,
}: BottomSheetProps) => {
  const { theme } = useUnistyles();
  const { height: windowHeight } = useWindowDimensions();
  const [isClosing, setIsClosing] = useState(false);
  const transitionProgress = useSharedValue(0);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: transitionProgress.value * 0.42,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - transitionProgress.value) * windowHeight,
      },
    ],
  }));

  const finishClose = () => {
    setIsClosing(false);
    onClose();
  };

  const close = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);

    transitionProgress.value = withTiming(0, transitionConfig, (finished) => {
      if (finished) {
        runOnJS(finishClose)();
      }
    });
  };

  const requestClose = () => {
    if (dismissible) {
      close();
    }
  };

  const content =
    typeof children === 'function' ? children({ close }) : children;

  useEffect(() => {
    if (!visible) {
      return;
    }

    transitionProgress.value = 0;
    transitionProgress.value = withTiming(1, transitionConfig);
  }, [transitionProgress, visible]);

  return (
    <Modal
      animationType="none"
      onRequestClose={requestClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View pointerEvents={isClosing ? 'none' : 'auto'} style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable
            accessibilityLabel={`Close ${title}`}
            accessibilityRole="button"
            disabled={!dismissible}
            onPress={requestClose}
            style={styles.backdropAction}
          />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={styles.keyboardContainer}
        >
          <Animated.View style={[styles.sheet, sheetAnimatedStyle]}>
            <SafeAreaView
              accessibilityViewIsModal
              edges={['bottom']}
              style={styles.safeArea}
            >
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={styles.handle}
              />
              <View style={styles.header}>
                <View style={styles.heading}>
                  <Text variant="title">{title}</Text>
                  {subtitle ? <Text tone="muted">{subtitle}</Text> : null}
                </View>
                <Pressable
                  accessibilityLabel={`Close ${title}`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !dismissible }}
                  disabled={!dismissible}
                  hitSlop={theme.spacing.sm}
                  onPress={requestClose}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && dismissible && styles.closeButtonPressed,
                    !dismissible && styles.closeButtonDisabled,
                  ]}
                >
                  <MaterialCommunityIcons
                    accessibilityElementsHidden
                    color={theme.colors.textMuted}
                    importantForAccessibility="no-hide-descendants"
                    name="close"
                    size={theme.spacing.xl}
                  />
                </Pressable>
              </View>
              <View style={styles.content}>{content}</View>
            </SafeAreaView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
