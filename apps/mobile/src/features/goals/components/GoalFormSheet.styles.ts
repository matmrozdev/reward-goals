import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  content: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  scrollView: {
    flexShrink: 1,
  },
}));
