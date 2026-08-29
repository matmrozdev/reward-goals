import { StyleSheet } from 'react-native-unistyles';

import { space } from '@/theme';

const heroImageAspectRatio = 1536 / 1024;

export const styles = StyleSheet.create((theme) => ({
  actions: {
    marginTop: theme.spacing.xs,
  },
  card: {
    borderRadius: theme.borderRadius.xl,
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
    justifyContent: 'center',
    maxWidth: theme.sizes.contentMaxWidth,
    width: '100%',
  },
  form: {
    gap: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  hero: {
    alignItems: 'center',
  },
  heroImage: {
    aspectRatio: heroImageAspectRatio,
    maxWidth: space(96),
    width: {
      phone: '82%',
      tablet: '70%',
      desktop: '70%',
    },
  },
  signInButton: {
    minHeight: theme.sizes.minTouchTarget,
    paddingHorizontal: theme.spacing.sm,
  },
  signInPrompt: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xxs,
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
}));
