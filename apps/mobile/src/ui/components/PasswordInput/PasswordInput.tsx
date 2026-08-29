import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { TextInput, type TextInputProps } from '@/ui/components/TextInput';

import { styles } from './PasswordInput.styles';

export type PasswordInputProps = Omit<
  TextInputProps,
  'leadingIcon' | 'secureTextEntry' | 'trailingAdornment'
>;

export const PasswordInput = ({
  disabled = false,
  editable = true,
  label = 'Password',
  ...props
}: PasswordInputProps) => {
  const { theme } = useUnistyles();
  const [isVisible, setIsVisible] = useState(false);
  const isDisabled = disabled || !editable;
  const fieldName = label.toLowerCase();
  const handleVisibilityPress = () => {
    setIsVisible((visible) => !visible);
  };

  return (
    <TextInput
      {...props}
      disabled={disabled}
      editable={editable}
      label={label}
      leadingIcon="lock-outline"
      secureTextEntry={!isVisible}
      trailingAdornment={
        <Pressable
          accessibilityLabel={`${isVisible ? 'Hide' : 'Show'} ${fieldName}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled }}
          disabled={isDisabled}
          hitSlop={theme.spacing.sm}
          onPress={handleVisibilityPress}
          style={styles.visibilityButton}
        >
          <MaterialCommunityIcons
            color={theme.colors.textMuted}
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={theme.spacing.xl}
          />
        </Pressable>
      }
    />
  );
};
