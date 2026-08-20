import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  centeredState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  content: {
    paddingVertical: theme.spacing.none,
  },
  header: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  heading: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: theme.spacing.lg,
  },
  stateCard: {
    gap: theme.spacing.lg,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
}));
