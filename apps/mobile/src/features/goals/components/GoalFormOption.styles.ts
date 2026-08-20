import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  disabled: {
    opacity: 0.5,
  },
  option: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.pill,
    borderWidth: theme.sizes.borderWidth,
    minHeight: theme.sizes.minTouchTarget,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  pressed: {
    opacity: 0.72,
  },
  selected: {
    backgroundColor: theme.colors.primaryMuted,
    borderColor: theme.colors.primary,
  },
}));
