import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { Card } from '@/ui/components/Card';
import { CircularProgress } from '@/ui/components/CircularProgress';
import { Text } from '@/ui/components/Text';

import { styles } from './TodaySummaryCard.styles';

type TodaySummaryCardProps = {
  completedCount: number;
  totalCount: number;
};

export const TodaySummaryCard = ({
  completedCount,
  totalCount,
}: TodaySummaryCardProps) => {
  const { theme } = useUnistyles();

  return (
    <Card padding="large" style={styles.card} variant="elevated">
      <View style={styles.copy}>
        <Text variant="title">Today</Text>
        <View style={styles.countRow}>
          <Text tone="primary" variant="title">
            {completedCount}
          </Text>
          <Text variant="title">of</Text>
          <Text tone="primary" variant="title">
            {totalCount}
          </Text>
          <Text variant="title">done</Text>
        </View>
      </View>
      <CircularProgress
        accessibilityLabel={`${completedCount} of ${totalCount} goals completed today`}
        max={totalCount}
        value={completedCount}
      >
        <MaterialCommunityIcons
          color={theme.colors.primary}
          name="calendar-blank-outline"
          size={theme.spacing.xxl}
        />
      </CircularProgress>
    </Card>
  );
};
