import { StyleSheet } from 'react-native-unistyles';

import { space } from '@/theme';

export const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    elevation: 6,
    height: space(16),
    justifyContent: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    width: space(16),
  },
  disabled: {
    backgroundColor: theme.colors.disabledSurface,
  },
  pressed: {
    backgroundColor: theme.colors.primaryPressed,
    transform: [{ scale: 0.96 }],
  },
}));
