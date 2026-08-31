import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.shadow,
  },
  backdropAction: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.pill,
    height: theme.sizes.minTouchTarget,
    justifyContent: 'center',
    width: theme.sizes.minTouchTarget,
  },
  closeButtonDisabled: {
    opacity: 0.45,
  },
  closeButtonPressed: {
    backgroundColor: theme.colors.primaryMuted,
  },
  content: {
    flexShrink: 1,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.pill,
    height: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    width: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  heading: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  keyboardContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  safeArea: {
    flexShrink: 1,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    borderWidth: theme.sizes.borderWidth,
    elevation: 8,
    maxHeight: '92%',
    maxWidth: theme.sizes.contentMaxWidth,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      height: -4,
      width: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    width: '100%',
  },
}));
