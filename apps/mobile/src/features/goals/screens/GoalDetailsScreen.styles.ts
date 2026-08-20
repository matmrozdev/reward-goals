import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    gap: theme.spacing.lg,
  },
  content: {
    gap: theme.spacing.xl,
  },
  detailRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: theme.sizes.borderWidth,
  },
  header: {
    gap: theme.spacing.sm,
  },
  navigationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  stateCard: {
    gap: theme.spacing.lg,
  },
}));
