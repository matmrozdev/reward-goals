import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  actions: {
    gap: theme.spacing.sm,
  },
  form: {
    gap: theme.spacing.xl,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  rewardFields: {
    gap: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.md,
  },
}));
