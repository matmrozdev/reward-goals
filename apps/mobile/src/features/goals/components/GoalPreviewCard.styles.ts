import { StyleSheet } from 'react-native-unistyles';

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
  pressable: {
    borderRadius: theme.borderRadius.lg,
  },
  pressed: {
    opacity: 0.72,
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
    maxWidth: '100%',
  },
}));
