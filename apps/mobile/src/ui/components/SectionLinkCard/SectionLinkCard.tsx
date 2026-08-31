import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { Card } from '@/ui/components/Card';
import { Text } from '@/ui/components/Text';

import { styles } from './SectionLinkCard.styles';

export type SectionLinkCardProps = Omit<
  PressableProps,
  'children' | 'style'
> & {
  label: string;
  style?: StyleProp<ViewStyle>;
};

export const SectionLinkCard = ({
  accessibilityHint,
  label,
  style,
  ...props
}: SectionLinkCardProps) => {
  const { theme } = useUnistyles();

  return (
    <Pressable
      {...props}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Card padding="medium" style={styles.card} variant="elevated">
        <Text tone="primary" variant="label">
          {label}
        </Text>
        <MaterialCommunityIcons
          color={theme.colors.primary}
          name="chevron-right"
          size={theme.spacing.xl}
        />
      </Card>
    </Pressable>
  );
};
