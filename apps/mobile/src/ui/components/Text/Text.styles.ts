import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text,
    variants: {
      variant: {
        caption: theme.typography.caption,
        body: theme.typography.body,
        bodyStrong: theme.typography.bodyStrong,
        label: theme.typography.label,
        title: theme.typography.title,
        heading: theme.typography.heading,
      },
      tone: {
        default: {
          color: theme.colors.text,
        },
        muted: {
          color: theme.colors.textMuted,
        },
        inverse: {
          color: theme.colors.textInverse,
        },
        primary: {
          color: theme.colors.primary,
        },
        danger: {
          color: theme.colors.danger,
        },
        success: {
          color: theme.colors.success,
        },
      },
    },
  },
}));
