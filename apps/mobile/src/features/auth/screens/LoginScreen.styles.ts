import { StyleSheet } from 'react-native-unistyles';

import { space } from '@/theme';

const heroImageAspectRatio = 941 / 1672;

export const styles = StyleSheet.create((theme) => ({
  actions: {
    gap: theme.spacing.md,
  },
  brandTitle: {
    color: theme.colors.text,
    fontSize: {
      phone: space(10),
      tablet: space(12),
      desktop: space(12),
    },
    lineHeight: {
      phone: space(11.5),
      tablet: space(14),
      desktop: space(14),
    },
  },
  card: {
    gap: {
      phone: theme.spacing.xl,
      tablet: theme.spacing.xxl,
      desktop: theme.spacing.xxl,
    },
    marginHorizontal: {
      phone: theme.spacing.sm,
      tablet: theme.spacing.xxl,
      desktop: theme.spacing.xxl,
    },
    borderRadius: theme.borderRadius.xl,
    marginTop: -space(10),
    zIndex: 2,
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    maxWidth: theme.sizes.contentMaxWidth,
    paddingHorizontal: {
      phone: theme.spacing.md,
      tablet: theme.spacing.xxl,
      desktop: theme.spacing.xxl,
    },
    width: '100%',
  },
  form: {
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  hero: {
    backgroundColor: theme.colors.background,
    marginRight: {
      phone: -theme.spacing.md,
      tablet: 0,
      desktop: 0,
    },
    minHeight: {
      phone: space(82),
      tablet: space(112),
      desktop: space(112),
    },
    overflow: 'hidden',
  },
  heroCopy: {
    justifyContent: 'center',
    maxWidth: {
      phone: '64%',
      tablet: '46%',
      desktop: '46%',
    },
    minHeight: {
      phone: space(82),
      tablet: space(112),
      desktop: space(112),
    },
    paddingBottom: theme.spacing.xxl,
    paddingLeft: {
      phone: theme.spacing.xl,
      tablet: theme.spacing.xxl,
      desktop: theme.spacing.xxl,
    },
    zIndex: 2,
  },
  heroBottomFade: {
    bottom: 0,
    height: space(14),
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  heroBottomFadeBottom: {
    backgroundColor: theme.colors.background,
    flex: 1,
    opacity: 0.36,
  },
  heroBottomFadeTop: {
    backgroundColor: theme.colors.background,
    flex: 1,
    opacity: 0.12,
  },
  heroImage: {
    aspectRatio: heroImageAspectRatio,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '80%',
  },
  registerButton: {
    minHeight: theme.sizes.minTouchTarget,
    paddingHorizontal: theme.spacing.sm,
  },
  registerPrompt: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xxs,
    justifyContent: 'center',
  },
  successMessage: {
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  successText: {
    flex: 1,
  },
  tagline: {
    color: theme.colors.textMuted,
    fontSize: {
      phone: space(4.5),
      tablet: space(5),
      desktop: space(5),
    },
    lineHeight: {
      phone: space(6.5),
      tablet: space(7.5),
      desktop: space(7.5),
    },
    marginTop: theme.spacing.lg,
  },
}));
