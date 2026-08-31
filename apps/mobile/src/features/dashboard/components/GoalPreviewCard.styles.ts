import { StyleSheet } from 'react-native-unistyles';

import type { DashboardAccent } from '@/features/dashboard/types/dashboard.types';
import { space } from '@/theme';

export const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  content: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.md,
    height: space(14),
    justifyContent: 'center',
    width: space(14),
  },
  metadataRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  scheduleBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.pill,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusAction: (completed: boolean, accent: DashboardAccent) => {
    const accentColor =
      accent === 'success' ? theme.colors.success : theme.colors.primary;

    return {
      alignItems: 'center',
      backgroundColor: completed ? accentColor : theme.colors.surface,
      borderColor: accentColor,
      borderRadius: theme.borderRadius.pill,
      borderWidth: theme.sizes.borderWidth * 2,
      height: theme.sizes.minTouchTarget,
      justifyContent: 'center',
      width: theme.sizes.minTouchTarget,
    };
  },
}));
