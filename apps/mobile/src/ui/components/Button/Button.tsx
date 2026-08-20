import { useState } from 'react';
import { ActivityIndicator, Pressable, Text as NativeText } from 'react-native';
import type {
  NativeSyntheticEvent,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TargetedEvent,
  ViewStyle,
} from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './Button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const pressedStyleByVariant = {
  primary: styles.primaryPressed,
  secondary: styles.secondaryPressed,
  ghost: styles.ghostPressed,
  danger: styles.dangerPressed,
} satisfies Record<ButtonVariant, StyleProp<ViewStyle>>;

export const Button = ({
  accessibilityLabel,
  accessibilityState,
  disabled = false,
  label,
  loading = false,
  onBlur,
  onFocus,
  size = 'medium',
  style,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const { theme } = useUnistyles();
  const isDisabled = disabled || loading;
  const [isFocused, setIsFocused] = useState(false);

  styles.useVariants({ size, variant });

  const pressedStyle = pressedStyleByVariant[variant];
  const spinnerColor = {
    primary: theme.colors.onPrimary,
    secondary: theme.colors.primary,
    ghost: theme.colors.primary,
    danger: theme.colors.onDanger,
  }[variant];
  const resolveStyle = (
    state: PressableStateCallbackType,
  ): StyleProp<ViewStyle> => [
    styles.button,
    state.pressed && !isDisabled && pressedStyle,
    isFocused && !isDisabled && styles.focused,
    isDisabled && styles.disabled,
    typeof style === 'function' ? style(state) : style,
  ];
  const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    onBlur?.(event);
  };
  const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        busy: loading,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={resolveStyle}
    >
      <NativeText
        aria-hidden={loading}
        style={[
          styles.label,
          isDisabled && styles.disabledLabel,
          loading && styles.loadingLabel,
        ]}
      >
        {label}
      </NativeText>
      {loading ? (
        <ActivityIndicator
          accessibilityElementsHidden
          color={spinnerColor}
          importantForAccessibility="no-hide-descendants"
          style={styles.loader}
        />
      ) : null}
    </Pressable>
  );
};
