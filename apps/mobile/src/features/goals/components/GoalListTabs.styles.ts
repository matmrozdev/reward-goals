import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.sizes.borderWidth,
    flexDirection: 'row',
    padding: theme.spacing.xs,
  },
  label: {
    textAlign: 'center',
  },
  tab: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: theme.sizes.minTouchTarget,
    paddingHorizontal: theme.spacing.sm,
  },
  tabPressed: {
    opacity: 0.72,
  },
  tabSelected: {
    backgroundColor: theme.colors.surface,
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
}));
