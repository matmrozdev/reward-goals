import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { Text } from '@/ui/components/Text';

import { styles } from './DashboardHeader.styles';

type DashboardHeaderProps = {
  avatarLabel: string;
  greeting: string;
  onNotificationsPress?: () => void;
  subtitle: string;
};

export const DashboardHeader = ({
  avatarLabel,
  greeting,
  onNotificationsPress,
  subtitle,
}: DashboardHeaderProps) => {
  const { theme } = useUnistyles();
  const notificationsDisabled = !onNotificationsPress;

  return (
    <View style={styles.container}>
      <View
        accessibilityLabel={`Avatar for ${avatarLabel}`}
        accessibilityRole="image"
        style={styles.avatar}
      >
        <Text tone="inverse" variant="title">
          {avatarLabel.slice(0, 1).toUpperCase()}
        </Text>
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={2} variant="title">
          {greeting}
        </Text>
        <Text numberOfLines={2} tone="muted">
          {subtitle}
        </Text>
      </View>
      <Pressable
        accessibilityHint={
          notificationsDisabled
            ? 'Notifications are not available in this preview'
            : undefined
        }
        accessibilityLabel="Notifications"
        accessibilityRole="button"
        accessibilityState={{ disabled: notificationsDisabled }}
        disabled={notificationsDisabled}
        onPress={onNotificationsPress}
        style={({ pressed }) => [
          styles.notificationButton,
          pressed && styles.notificationButtonPressed,
          notificationsDisabled && styles.notificationButtonDisabled,
        ]}
      >
        <MaterialCommunityIcons
          color={theme.colors.primary}
          name="bell-outline"
          size={theme.spacing.xl}
        />
      </Pressable>
    </View>
  );
};
