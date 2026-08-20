import { View } from 'react-native';

import { ApiError } from '@/api/errors';
import { GoalProgress } from '@/features/goals/components/GoalProgress';
import { useGoalQuery } from '@/features/goals/hooks/useGoalQuery';
import { formatGoalSchedule } from '@/features/goals/utils/format-goal-schedule';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Loader } from '@/ui/components/Loader';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalDetailsScreen.styles';

type GoalDetailsScreenProps = {
  goalId: string;
  onBack: () => void;
};

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <Text tone="muted">{label}</Text>
    <Text variant="bodyStrong">{value}</Text>
  </View>
);

const statusLabels = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
  COMPLETED: 'Completed',
} as const;

export const GoalDetailsScreen = ({
  goalId,
  onBack,
}: GoalDetailsScreenProps) => {
  const goalQuery = useGoalQuery(goalId);
  const goal = goalQuery.data;
  const errorMessage = goalQuery.error
    ? ApiError.fromUnknown(goalQuery.error).message
    : null;

  if (!goalId) {
    return (
      <Screen contentContainerStyle={styles.content} centered>
        <Card padding="large" style={styles.stateCard}>
          <Text accessibilityRole="alert" tone="danger">
            This Goal link is invalid.
          </Text>
          <Button label="Back to Goals" onPress={onBack} variant="secondary" />
        </Card>
      </Screen>
    );
  }

  if (goalQuery.isPending) {
    return (
      <Screen centered>
        <Loader label="Loading Goal" size="large" />
      </Screen>
    );
  }

  if (!goal) {
    return (
      <Screen contentContainerStyle={styles.content} centered>
        <Card padding="large" style={styles.stateCard}>
          <Text accessibilityRole="alert" tone="danger">
            {errorMessage ?? 'This Goal could not be loaded.'}
          </Text>
          <Button
            label="Try again"
            loading={goalQuery.isRefetching}
            onPress={() => void goalQuery.refetch()}
          />
          <Button label="Back to Goals" onPress={onBack} variant="ghost" />
        </Card>
      </Screen>
    );
  }

  const rewardStatus = goal.reward?.unlockedAt ? 'Unlocked' : 'Locked';

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.navigationRow}>
        <Button label="Back" onPress={onBack} size="small" variant="ghost" />
        <Button
          label="Reload"
          loading={goalQuery.isRefetching}
          onPress={() => void goalQuery.refetch()}
          size="small"
          variant="ghost"
        />
      </View>
      {errorMessage ? (
        <Card padding="small" variant="muted">
          <Text accessibilityRole="alert" tone="danger">
            {errorMessage} Reload to try again.
          </Text>
        </Card>
      ) : null}
      <View style={styles.header}>
        <Text variant="heading">{goal.title}</Text>
        {goal.description ? <Text tone="muted">{goal.description}</Text> : null}
      </View>
      <Card padding="large" style={styles.card}>
        <GoalProgress goal={goal} />
        <View style={styles.divider} />
        <DetailRow label="Status" value={statusLabels[goal.status]} />
        <DetailRow
          label="Type"
          value={goal.measurementType === 'FINITE' ? 'Finite' : 'Ongoing'}
        />
        <DetailRow
          label="Schedule"
          value={formatGoalSchedule(goal.scheduleDays)}
        />
      </Card>
      {goal.reward ? (
        <Card padding="large" style={styles.card} variant="muted">
          <View style={styles.rewardHeader}>
            <Text variant="title">Reward</Text>
            <Text tone={goal.reward.unlockedAt ? 'success' : 'muted'}>
              {rewardStatus}
            </Text>
          </View>
          <Text variant="bodyStrong">{goal.reward.title}</Text>
          <Text tone="muted">
            Unlocks at {goal.reward.requiredProgress} completed
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
};
