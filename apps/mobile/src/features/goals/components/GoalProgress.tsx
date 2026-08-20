import { View } from 'react-native';

import type { Goal } from '@/features/goals/types/goals.types';
import { getGoalProgress } from '@/features/goals/utils/get-goal-progress';
import { Text } from '@/ui/components/Text';

import { styles } from './GoalProgress.styles';

type GoalProgressProps = {
  goal: Pick<Goal, 'measurementType' | 'progressCount' | 'targetValue'>;
};

export const GoalProgress = ({ goal }: GoalProgressProps) => {
  const progress = getGoalProgress(goal);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text variant="label">Progress</Text>
        <Text tone="muted">{progress.label}</Text>
      </View>
      {progress.fraction !== null ? (
        <View
          accessibilityLabel={`Goal progress: ${progress.label}`}
          accessibilityRole="progressbar"
          accessibilityValue={{
            max: goal.targetValue ?? undefined,
            min: 0,
            now: Math.min(goal.progressCount, goal.targetValue ?? 0),
          }}
          style={styles.track}
        >
          <View style={styles.fill(progress.fraction)} />
        </View>
      ) : null}
    </View>
  );
};
