import { StyleSheet } from 'react-native-unistyles';

import { space } from '@/theme';

export const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  giftIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.md,
    height: theme.sizes.controlMedium,
    justifyContent: 'center',
    width: theme.sizes.controlMedium,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visual: {
    alignItems: 'center',
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.lg,
    height: space(24),
    justifyContent: 'center',
    width: space(24),
  },
}));
