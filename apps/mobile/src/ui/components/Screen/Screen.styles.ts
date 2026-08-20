import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: theme.sizes.contentMaxWidth,
    paddingHorizontal: {
      phone: theme.spacing.lg,
      tablet: theme.spacing.xxl,
      desktop: theme.spacing.xxxl,
    },
    paddingVertical: {
      phone: theme.spacing.lg,
      tablet: theme.spacing.xl,
      desktop: theme.spacing.xxl,
    },
    width: '100%',
  },
  staticContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    justifyContent: 'center',
  },
}));
