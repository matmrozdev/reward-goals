import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './FloatingActionButton.styles';

export type FloatingActionButtonProps = Omit<
  PressableProps,
  'children' | 'style'
> & {
  accessibilityLabel: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  style?: StyleProp<ViewStyle>;
};

export const FloatingActionButton = ({
  accessibilityLabel,
  disabled = false,
  icon = 'plus',
  style,
  ...props
}: FloatingActionButtonProps) => {
  const { theme } = useUnistyles();
  const isDisabled = disabled === true;

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <MaterialCommunityIcons
        color={theme.colors.onPrimary}
        name={icon}
        size={theme.spacing.xxl}
      />
    </Pressable>
  );
};
