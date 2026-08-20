import { Pressable, View } from 'react-native';

import type { Goal } from '@/features/goals/types/goals.types';
import { formatGoalSchedule } from '@/features/goals/utils/format-goal-schedule';
import { Card } from '@/ui/components/Card';
import { Text } from '@/ui/components/Text';

import { GoalProgress } from './GoalProgress';
import { styles } from './GoalCard.styles';

type GoalCardProps = {
  goal: Goal;
  onPress: () => void;
};

const statusLabels: Record<Goal['status'], string> = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  COMPLETED: 'Completed',
};

export const GoalCard = ({ goal, onPress }: GoalCardProps) => (
  <Pressable
    accessibilityHint="Opens Goal details"
    accessibilityLabel={goal.title}
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
  >
    <Card padding="large" style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title} variant="title">
          {goal.title}
        </Text>
        <View style={styles.statusBadge}>
          <Text tone="primary" variant="caption">
            {statusLabels[goal.status]}
          </Text>
        </View>
      </View>
      {goal.description ? (
        <Text numberOfLines={2} tone="muted">
          {goal.description}
        </Text>
      ) : null}
      <Text tone="muted" variant="caption">
        {formatGoalSchedule(goal.scheduleDays)}
      </Text>
      <GoalProgress goal={goal} />
    </Card>
  </Pressable>
);
