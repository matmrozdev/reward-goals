import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  action: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.pill,
    height: theme.sizes.minTouchTarget,
    justifyContent: 'center',
    width: theme.sizes.minTouchTarget,
  },
  check: {
    position: 'absolute',
  },
  disabled: {
    opacity: 0.56,
  },
  ring: {
    position: 'absolute',
  },
  sparkleBottomLeft: {
    bottom: -theme.spacing.xs,
    left: -theme.spacing.xs,
    position: 'absolute',
  },
  sparkleTop: {
    position: 'absolute',
    right: theme.spacing.xs,
    top: -theme.spacing.sm,
  },
  sparkleTopLeft: {
    left: -theme.spacing.xs,
    position: 'absolute',
    top: theme.spacing.xs,
  },
  sparkles: {
    height: theme.sizes.minTouchTarget,
    position: 'absolute',
    width: theme.sizes.minTouchTarget,
  },
}));
