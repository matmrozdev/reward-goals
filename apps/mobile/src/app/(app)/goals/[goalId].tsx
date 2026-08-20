import { useLocalSearchParams, useRouter } from 'expo-router';

import { GoalDetailsScreen } from '@/features/goals/screens/GoalDetailsScreen';

export default function GoalDetailsRoute() {
  const router = useRouter();
  const { goalId } = useLocalSearchParams<{ goalId?: string | string[] }>();
  const resolvedGoalId = Array.isArray(goalId)
    ? (goalId[0] ?? '')
    : (goalId ?? '');

  return (
    <GoalDetailsScreen
      goalId={resolvedGoalId}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
    />
  );
}
