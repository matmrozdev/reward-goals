import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  centeredState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingVertical: theme.spacing.none,
  },
  floatingAction: {
    bottom: theme.spacing.xl,
    position: 'absolute',
    right: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  headerSpacer: {
    height: theme.sizes.minTouchTarget,
    width: theme.sizes.minTouchTarget,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxxl * 2,
  },
  navigationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    height: theme.spacing.lg,
  },
  stateCard: {
    gap: theme.spacing.lg,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
}));
