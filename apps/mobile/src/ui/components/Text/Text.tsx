import { Text as NativeText } from 'react-native';
import type { TextProps as NativeTextProps } from 'react-native';

import { styles } from './Text.styles';

export type TextVariant =
  'caption' | 'body' | 'bodyStrong' | 'label' | 'title' | 'heading';

export type TextTone =
  'default' | 'muted' | 'inverse' | 'primary' | 'danger' | 'success';

export type TextProps = NativeTextProps & {
  tone?: TextTone;
  variant?: TextVariant;
};

export const Text = ({
  tone = 'default',
  variant = 'body',
  style,
  ...props
}: TextProps) => {
  styles.useVariants({
    tone: tone === 'default' ? undefined : tone,
    variant,
  });

  return <NativeText {...props} style={[styles.text, style]} />;
};
