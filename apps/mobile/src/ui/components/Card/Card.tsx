import { View } from 'react-native';
import type { ViewProps } from 'react-native';

import { styles } from './Card.styles';

export type CardVariant = 'default' | 'muted' | 'elevated';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export type CardProps = ViewProps & {
  padding?: CardPadding;
  variant?: CardVariant;
};

export const Card = ({
  padding = 'medium',
  style,
  variant = 'default',
  ...props
}: CardProps) => {
  styles.useVariants({
    padding,
    variant: variant === 'default' ? undefined : variant,
  });

  return <View {...props} style={[styles.card, style]} />;
};
