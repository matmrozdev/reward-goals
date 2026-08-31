import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardKeys } from '@/features/dashboard/api/dashboard.queries';
import { goalsApi } from '@/features/goals/api/goals.api';
import { goalKeys } from '@/features/goals/api/goals.queries';

export const useCreateGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.create,
    onSuccess: async ({ goal }) => {
      queryClient.setQueryData(goalKeys.detail(goal.id), goal);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: goalKeys.list() }),
      ]);
    },
  });
};
