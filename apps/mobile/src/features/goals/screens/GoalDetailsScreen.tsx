import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/api/errors';
import { GoalProgress } from '@/features/goals/components/GoalProgress';
import { useGoalQuery } from '@/features/goals/hooks/useGoalQuery';
import {
  type GoalLifecycleAction,
  useGoalLifecycleMutation,
} from '@/features/goals/hooks/useGoalLifecycleMutation';
import { GoalFormSheet } from '@/features/goals/sheets/GoalFormSheet';
import { formatGoalSchedule } from '@/features/goals/utils/format-goal-schedule';
import { BackButton } from '@/ui/components/BackButton';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Loader } from '@/ui/components/Loader';
import { Screen } from '@/ui/components/Screen';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalDetailsScreen.styles';

type GoalDetailsScreenProps = {
  goalId: string;
  onBack: () => void;
  successMessage?: string;
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
  ABANDONED: 'Abandoned',
  COMPLETED: 'Completed',
} as const;

export const GoalDetailsScreen = ({
  goalId,
  onBack,
  successMessage,
}: GoalDetailsScreenProps) => {
  const goalQuery = useGoalQuery(goalId);
  const lifecycleMutation = useGoalLifecycleMutation();
  const [confirmationAction, setConfirmationAction] =
    useState<GoalLifecycleAction | null>(null);
  const [isGoalFormVisible, setIsGoalFormVisible] = useState(false);
  const [lifecycleSuccess, setLifecycleSuccess] = useState<string | null>(null);
  const goal = goalQuery.data;
  const errorMessage = goalQuery.error
    ? ApiError.fromUnknown(goalQuery.error).message
    : null;
  const lifecycleError = lifecycleMutation.error
    ? ApiError.fromUnknown(lifecycleMutation.error).message
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
  const runLifecycleAction = (action: GoalLifecycleAction) => {
    setLifecycleSuccess(null);
    lifecycleMutation.mutate(
      { action, goalId },
      {
        onSuccess: () => {
          setConfirmationAction(null);
          setLifecycleSuccess(
            {
              abandon: 'Goal abandoned.',
              archive: 'Goal archived.',
              unarchive: 'Goal restored.',
            }[action],
          );
        },
      },
    );
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.navigationRow}>
        <BackButton onPress={onBack} />
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
      {successMessage || lifecycleSuccess ? (
        <Text accessibilityRole="alert" tone="success">
          {lifecycleSuccess ?? successMessage}
        </Text>
      ) : null}
      {lifecycleError ? (
        <Text accessibilityRole="alert" tone="danger">
          {lifecycleError}
        </Text>
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
          value={goal.targetValue === null ? 'Ongoing' : 'Finite'}
        />
        <DetailRow label="Archived" value={goal.archivedAt ? 'Yes' : 'No'} />
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
      <Card padding="large" style={styles.card}>
        <Text variant="title">Manage Goal</Text>
        <Button
          disabled={lifecycleMutation.isPending}
          label="Edit Goal"
          onPress={() => setIsGoalFormVisible(true)}
          variant="secondary"
        />
        <Button
          disabled={lifecycleMutation.isPending}
          label={goal.archivedAt ? 'Restore from archive' : 'Archive Goal'}
          loading={
            lifecycleMutation.isPending &&
            lifecycleMutation.variables?.action !== 'abandon'
          }
          onPress={() =>
            runLifecycleAction(goal.archivedAt ? 'unarchive' : 'archive')
          }
          variant="ghost"
        />
        {goal.status === 'ACTIVE' ? (
          <Button
            disabled={lifecycleMutation.isPending}
            label="Abandon Goal"
            onPress={() => setConfirmationAction('abandon')}
            variant="danger"
          />
        ) : null}
      </Card>
      {confirmationAction === 'abandon' ? (
        <Card padding="large" style={styles.card} variant="muted">
          <Text variant="title">Abandon this Goal?</Text>
          <Text tone="muted">
            Progress history will be preserved, but no more progress can be
            recorded.
          </Text>
          <Button
            label="Confirm abandonment"
            loading={lifecycleMutation.isPending}
            onPress={() => runLifecycleAction('abandon')}
            variant="danger"
          />
          <Button
            disabled={lifecycleMutation.isPending}
            label="Cancel"
            onPress={() => setConfirmationAction(null)}
            variant="ghost"
          />
        </Card>
      ) : null}
      <GoalFormSheet
        goal={goal}
        onClose={() => setIsGoalFormVisible(false)}
        onSuccess={() => setLifecycleSuccess('Goal updated.')}
        visible={isGoalFormVisible}
      />
    </Screen>
  );
};
