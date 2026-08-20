import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  archivedBadge: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  badges: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  card: {
    gap: theme.spacing.md,
  },
  pressable: {
    borderRadius: theme.borderRadius.lg,
  },
  pressed: {
    opacity: 0.72,
  },
  statusBadge: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  title: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
}));
