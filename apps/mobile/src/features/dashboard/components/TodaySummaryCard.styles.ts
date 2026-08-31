import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: theme.spacing.md,
  },
  countRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
}));
