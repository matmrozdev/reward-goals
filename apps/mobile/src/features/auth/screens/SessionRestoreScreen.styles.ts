import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  actions: {
    gap: theme.spacing.sm,
  },
  card: {
    gap: {
      phone: theme.spacing.xl,
      tablet: theme.spacing.xxl,
      desktop: theme.spacing.xxl,
    },
  },
  content: {
    alignSelf: 'center',
    gap: {
      phone: theme.spacing.xl,
      tablet: theme.spacing.xxl,
      desktop: theme.spacing.xxl,
    },
    maxWidth: theme.sizes.contentMaxWidth,
    width: '100%',
  },
  header: {
    gap: theme.spacing.sm,
  },
}));
