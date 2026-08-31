import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.pill,
    height: theme.sizes.minTouchTarget,
    justifyContent: 'center',
    width: theme.sizes.minTouchTarget,
  },
  pressed: {
    backgroundColor: theme.colors.primaryMuted,
  },
}));
