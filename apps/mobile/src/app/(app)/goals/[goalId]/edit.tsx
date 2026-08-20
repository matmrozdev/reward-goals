import { useLocalSearchParams } from 'expo-router';

import { GoalFormScreen } from '@/features/goals/screens/GoalFormScreen';

export default function EditGoalRoute() {
  const { goalId } = useLocalSearchParams<{ goalId?: string | string[] }>();
  const resolvedGoalId = Array.isArray(goalId)
    ? (goalId[0] ?? '')
    : (goalId ?? '');

  return <GoalFormScreen goalId={resolvedGoalId} />;
}
