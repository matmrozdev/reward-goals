import { StyleSheet } from 'react-native-unistyles';

import type { ProgressBarTone } from './ProgressBar';

export const styles = StyleSheet.create((theme) => ({
  fill: (tone: ProgressBarTone) => ({
    backgroundColor:
      tone === 'success' ? theme.colors.success : theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: '100%',
  }),
  track: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: theme.borderRadius.pill,
    height: theme.spacing.sm,
    overflow: 'hidden',
  },
}));
