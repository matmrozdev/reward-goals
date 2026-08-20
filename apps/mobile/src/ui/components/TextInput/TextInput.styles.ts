import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  field: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.sizes.borderWidth,
    color: theme.colors.text,
    minHeight: theme.sizes.controlMedium,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
  invalid: {
    borderColor: theme.colors.danger,
  },
  disabled: {
    backgroundColor: theme.colors.disabledSurface,
    color: theme.colors.disabledText,
  },
  supportingText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
  },
}));
