import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.sizes.borderWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: theme.sizes.minTouchTarget,
    paddingHorizontal: theme.spacing.lg,
    variants: {
      size: {
        small: {
          minHeight: theme.sizes.controlSmall,
        },
        medium: {
          minHeight: theme.sizes.controlMedium,
        },
        large: {
          minHeight: theme.sizes.controlLarge,
        },
      },
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        ghost: {
          backgroundColor: theme.colors.transparent,
          borderColor: theme.colors.transparent,
        },
        danger: {
          backgroundColor: theme.colors.danger,
          borderColor: theme.colors.danger,
        },
      },
    },
  },
  label: {
    ...theme.typography.label,
    variants: {
      variant: {
        primary: {
          color: theme.colors.onPrimary,
        },
        secondary: {
          color: theme.colors.text,
        },
        ghost: {
          color: theme.colors.primary,
        },
        danger: {
          color: theme.colors.onDanger,
        },
      },
    },
  },
  primaryPressed: {
    backgroundColor: theme.colors.primaryPressed,
    borderColor: theme.colors.primaryPressed,
  },
  secondaryPressed: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  ghostPressed: {
    backgroundColor: theme.colors.primaryMuted,
  },
  dangerPressed: {
    backgroundColor: theme.colors.dangerPressed,
    borderColor: theme.colors.dangerPressed,
  },
  disabled: {
    backgroundColor: theme.colors.disabledSurface,
    borderColor: theme.colors.disabledSurface,
  },
  disabledLabel: {
    color: theme.colors.disabledText,
  },
  focused: {
    borderColor: theme.colors.text,
    borderWidth: theme.sizes.borderWidth * 2,
  },
  loadingLabel: {
    opacity: 0,
  },
  loader: {
    position: 'absolute',
  },
}));
