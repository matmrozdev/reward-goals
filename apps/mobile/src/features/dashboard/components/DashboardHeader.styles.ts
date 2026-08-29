import { StyleSheet } from 'react-native-unistyles';

import { space } from '@/theme';

export const styles = StyleSheet.create((theme) => ({
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: space(14),
    justifyContent: 'center',
    width: space(14),
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.sizes.borderWidth,
    height: theme.sizes.controlMedium,
    justifyContent: 'center',
    width: theme.sizes.controlMedium,
  },
  notificationButtonDisabled: {
    opacity: 0.7,
  },
  notificationButtonPressed: {
    backgroundColor: theme.colors.primaryMuted,
  },
}));
