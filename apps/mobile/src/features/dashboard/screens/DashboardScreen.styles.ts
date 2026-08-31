import { StyleSheet } from 'react-native-unistyles';

import { space } from '@/theme';

const floatingActionClearance = space(28);

export const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.spacing.xl,
    paddingBottom: floatingActionClearance,
  },
  floatingAction: {
    bottom: theme.spacing.xl,
    position: 'absolute',
    right: theme.spacing.xl,
  },
  stateCard: {
    gap: theme.spacing.lg,
    width: '100%',
  },
}));
