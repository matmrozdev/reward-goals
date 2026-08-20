import { ActivityIndicator, Text, View } from 'react-native';
import type { ActivityIndicatorProps, ViewProps } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { styles } from './Loader.styles';

export type LoaderProps = ActivityIndicatorProps & {
  containerProps?: ViewProps;
  fullScreen?: boolean;
  label?: string;
};

export const Loader = ({
  accessibilityLabel,
  color,
  containerProps,
  fullScreen = false,
  label,
  size = 'small',
  ...props
}: LoaderProps) => {
  const { theme } = useUnistyles();

  return (
    <View
      {...containerProps}
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        containerProps?.style,
      ]}
    >
      <ActivityIndicator
        {...props}
        accessibilityLabel={accessibilityLabel ?? label ?? 'Loading'}
        accessibilityRole="progressbar"
        accessibilityState={{ busy: true }}
        color={color ?? theme.colors.primary}
        size={size}
      />
      {label ? (
        <Text aria-hidden style={styles.label}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};
