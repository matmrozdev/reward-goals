import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.borderRadius.lg,
    variants: {
      padding: {
        none: {
          padding: theme.spacing.none,
        },
        small: {
          padding: theme.spacing.md,
        },
        medium: {
          padding: theme.spacing.lg,
        },
        large: {
          padding: theme.spacing.xl,
        },
      },
      variant: {
        default: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: theme.sizes.borderWidth,
        },
        muted: {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.transparent,
          borderWidth: theme.sizes.borderWidth,
        },
        elevated: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.transparent,
          borderWidth: theme.sizes.borderWidth,
          elevation: 2,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            height: 2,
            width: 0,
          },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        },
      },
    },
  },
}));
