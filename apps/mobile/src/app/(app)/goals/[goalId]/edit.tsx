import { Redirect, type Href, useLocalSearchParams } from 'expo-router';

export default function EditGoalRoute() {
  const { goalId } = useLocalSearchParams<{ goalId?: string | string[] }>();
  const resolvedGoalId = Array.isArray(goalId)
    ? (goalId[0] ?? '')
    : (goalId ?? '');

  const destination = resolvedGoalId
    ? (`/goals/${resolvedGoalId}` as Href)
    : ('/goals' as Href);

  return <Redirect href={destination} />;
}
