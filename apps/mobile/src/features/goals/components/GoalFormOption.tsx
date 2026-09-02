import { Pressable } from 'react-native';
import type { AccessibilityRole } from 'react-native';

import { Text } from '@/ui/components/Text';

import { styles } from './GoalFormOption.styles';

type GoalFormOptionProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  role?: Extract<AccessibilityRole, 'checkbox' | 'radio' | 'switch'>;
  selected: boolean;
  testID?: string;
};

export const GoalFormOption = ({
  disabled = false,
  label,
  onPress,
  role = 'checkbox',
  selected,
  testID,
}: GoalFormOptionProps) => (
  <Pressable
    accessibilityRole={role}
    accessibilityState={{
      checked: role === 'checkbox' || role === 'switch' ? selected : undefined,
      disabled,
      selected: role === 'radio' ? selected : undefined,
    }}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.option,
      selected && styles.selected,
      pressed && !disabled && styles.pressed,
      disabled && styles.disabled,
    ]}
    testID={testID}
  >
    <Text tone={selected ? 'primary' : 'default'} variant="label">
      {label}
    </Text>
  </Pressable>
);
