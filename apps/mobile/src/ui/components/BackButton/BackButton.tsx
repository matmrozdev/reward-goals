import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';
import type { PressableProps } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './BackButton.styles';

export type BackButtonProps = Omit<
  PressableProps,
  'accessibilityLabel' | 'children'
> & {
  accessibilityLabel?: string;
};

export const BackButton = ({
  accessibilityLabel = 'Go back',
  hitSlop,
  style,
  ...props
}: BackButtonProps) => {
  const { theme } = useUnistyles();

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={hitSlop ?? theme.spacing.sm}
      style={(state) => [
        styles.button,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <MaterialCommunityIcons
        accessibilityElementsHidden
        color={theme.colors.primary}
        importantForAccessibility="no-hide-descendants"
        name="chevron-left"
        size={theme.spacing.xxl}
      />
    </Pressable>
  );
};
