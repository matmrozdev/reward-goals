import { type Href, useLocalSearchParams, useRouter } from 'expo-router';

import { GoalDetailsScreen } from '@/features/goals/screens/GoalDetailsScreen';

export default function GoalDetailsRoute() {
  const router = useRouter();
  const { created, goalId, updated } = useLocalSearchParams<{
    created?: string;
    goalId?: string | string[];
    updated?: string;
  }>();
  const resolvedGoalId = Array.isArray(goalId)
    ? (goalId[0] ?? '')
    : (goalId ?? '');

  return (
    <GoalDetailsScreen
      goalId={resolvedGoalId}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      onEdit={() => router.push(`/goals/${resolvedGoalId}/edit` as Href)}
      successMessage={
        created ? 'Goal created.' : updated ? 'Goal updated.' : undefined
      }
    />
  );
}
