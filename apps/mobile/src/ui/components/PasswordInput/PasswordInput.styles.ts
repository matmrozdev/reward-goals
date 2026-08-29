import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  visibilityButton: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.pill,
    justifyContent: 'center',
    minHeight: theme.sizes.minTouchTarget,
    minWidth: theme.sizes.minTouchTarget,
  },
}));
