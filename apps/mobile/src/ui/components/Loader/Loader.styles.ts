import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    minHeight: theme.sizes.controlLarge,
  },
  label: {
    ...theme.typography.bodyStrong,
    color: theme.colors.textMuted,
  },
}));
