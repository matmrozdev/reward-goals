import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  field: {
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.sizes.borderWidth,
    flexDirection: 'row',
    minHeight: theme.sizes.controlMedium,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    minHeight: theme.sizes.controlMedium - theme.sizes.borderWidth * 2,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  leadingAdornment: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.lg,
  },
  trailingAdornment: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.xs,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
  invalid: {
    borderColor: theme.colors.danger,
  },
  disabled: {
    backgroundColor: theme.colors.disabledSurface,
  },
  disabledInput: {
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
