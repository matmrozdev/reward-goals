import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { TextInput, type TextInputProps } from '@/ui/components/TextInput';

import { styles } from './SecureTextInput.styles';

export type SecureTextInputProps = Omit<
  TextInputProps,
  'secureTextEntry' | 'trailingAdornment'
>;

export const SecureTextInput = ({
  accessibilityLabel,
  disabled = false,
  editable = true,
  label,
  ...props
}: SecureTextInputProps) => {
  const { theme } = useUnistyles();
  const [isVisible, setIsVisible] = useState(false);
  const isDisabled = disabled || !editable;
  const fieldName = accessibilityLabel ?? label ?? 'secure text';
  const handleVisibilityPress = () => {
    setIsVisible((visible) => !visible);
  };

  return (
    <TextInput
      {...props}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      editable={editable}
      label={label}
      secureTextEntry={!isVisible}
      trailingAdornment={
        <Pressable
          accessibilityLabel={`${isVisible ? 'Hide' : 'Show'} ${fieldName.toLowerCase()}`}
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
