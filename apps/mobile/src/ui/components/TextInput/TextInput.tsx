import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useId, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Text, TextInput as NativeTextInput, View } from 'react-native';
import type {
  BlurEvent,
  FocusEvent,
  TextInputProps as NativeTextInputProps,
} from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './TextInput.styles';

export type TextInputProps = NativeTextInputProps & {
  disabled?: boolean;
  error?: string;
  hint?: string;
  label?: string;
  leadingIcon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  trailingAdornment?: ReactNode;
};

export const TextInput = ({
  accessibilityLabel,
  accessibilityState,
  disabled = false,
  editable = true,
  error,
  hint,
  label,
  leadingIcon,
  nativeID,
  onBlur,
  onFocus,
  placeholderTextColor,
  selectionColor,
  style,
  trailingAdornment,
  ...props
}: TextInputProps) => {
  const generatedId = useId();
  const { theme } = useUnistyles();
  const [isFocused, setIsFocused] = useState(false);
  const inputId = nativeID ?? `input-${generatedId}`;
  const isDisabled = disabled || !editable;
  const supportingText = error ?? hint;

  const handleBlur = (event: BlurEvent) => {
    setIsFocused(false);
    onBlur?.(event);
  };
  const handleFocus = (event: FocusEvent) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  return (
    <View style={styles.field}>
      {label ? (
        <Text nativeID={`${inputId}-label`} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          Boolean(error) && styles.invalid,
          isDisabled && styles.disabled,
        ]}
      >
        {leadingIcon ? (
          <View style={styles.leadingAdornment}>
            <MaterialCommunityIcons
              accessibilityElementsHidden
              color={theme.colors.textMuted}
              importantForAccessibility="no-hide-descendants"
              name={leadingIcon}
              size={theme.spacing.xl}
            />
          </View>
        ) : null}
        <NativeTextInput
          {...props}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{
            ...accessibilityState,
            disabled: isDisabled,
          }}
          aria-describedby={
            supportingText ? `${inputId}-supporting-text` : undefined
          }
          aria-invalid={Boolean(error)}
          editable={!isDisabled}
          nativeID={inputId}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={placeholderTextColor ?? theme.colors.textMuted}
          selectionColor={selectionColor ?? theme.colors.primary}
          style={[styles.input, isDisabled && styles.disabledInput, style]}
        />
        {trailingAdornment ? (
          <View style={styles.trailingAdornment}>{trailingAdornment}</View>
        ) : null}
      </View>
      {supportingText ? (
        <Text
          accessibilityLiveRegion={error ? 'polite' : 'none'}
          accessibilityRole={error ? 'alert' : undefined}
          nativeID={`${inputId}-supporting-text`}
          style={error ? styles.errorText : styles.supportingText}
        >
          {supportingText}
        </Text>
      ) : null}
    </View>
  );
};
