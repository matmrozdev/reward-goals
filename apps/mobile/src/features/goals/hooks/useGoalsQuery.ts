import { useQuery } from '@tanstack/react-query';

import { goalsQueryOptions } from '@/features/goals/api/goals.queries';

export const useGoalsQuery = () => useQuery(goalsQueryOptions());
