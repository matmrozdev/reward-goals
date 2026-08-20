import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.sm,
  },
  fill: (fraction: number) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: '100%',
    width: `${fraction * 100}%`,
  }),
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.pill,
    height: theme.spacing.sm,
    overflow: 'hidden',
  },
}));
