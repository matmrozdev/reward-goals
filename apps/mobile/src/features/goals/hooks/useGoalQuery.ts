import { useQuery } from '@tanstack/react-query';

import { goalQueryOptions } from '@/features/goals/api/goals.queries';

export const useGoalQuery = (goalId: string) =>
  useQuery({
    ...goalQueryOptions(goalId),
    enabled: goalId.length > 0,
  });
