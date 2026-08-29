import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: theme.sizes.controlLarge,
  },
  pressable: {
    borderRadius: theme.borderRadius.lg,
  },
  pressed: {
    opacity: 0.72,
  },
}));
