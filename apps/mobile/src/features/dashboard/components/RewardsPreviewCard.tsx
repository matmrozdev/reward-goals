import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { DashboardReward } from '@/features/dashboard/types/dashboard.types';
import { Card } from '@/ui/components/Card';
import { ProgressBar } from '@/ui/components/ProgressBar';
import { Text } from '@/ui/components/Text';

import { styles } from './RewardsPreviewCard.styles';

type RewardsPreviewCardProps = {
  reward: DashboardReward;
};

export const RewardsPreviewCard = ({ reward }: RewardsPreviewCardProps) => {
  const { theme } = useUnistyles();

  return (
    <Card padding="large" style={styles.card} variant="elevated">
      <View style={styles.header}>
        <Text variant="title">Your rewards</Text>
        <View style={styles.giftIcon}>
          <MaterialCommunityIcons
            color={theme.colors.primary}
            name="gift-outline"
            size={theme.spacing.xl}
          />
        </View>
      </View>
      <View style={styles.content}>
        <View
          accessibilityLabel={`${reward.title} reward visual`}
          accessibilityRole="image"
          style={styles.visual}
        >
          <MaterialCommunityIcons
            color={theme.colors.primary}
            name="movie-open-outline"
            size={theme.spacing.xxxl}
          />
        </View>
        <View style={styles.copy}>
          <Text variant="bodyStrong">{reward.title}</Text>
          <ProgressBar
            accessibilityLabel={`${reward.title} unlock progress: ${reward.currentProgress} of ${reward.targetProgress}`}
            max={reward.targetProgress}
            value={reward.currentProgress}
          />
          <Text tone="muted" variant="caption">
            <Text tone="primary" variant="label">
              {reward.currentProgress}
            </Text>{' '}
            / {reward.targetProgress}
          </Text>
          <Text tone="muted">{reward.remainingCopy}</Text>
        </View>
      </View>
    </Card>
  );
};
