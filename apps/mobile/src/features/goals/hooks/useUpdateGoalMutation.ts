import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardKeys } from '@/features/dashboard/api/dashboard.queries';
import { goalsApi } from '@/features/goals/api/goals.api';
import { goalKeys } from '@/features/goals/api/goals.queries';
import type { UpdateGoalInput } from '@/features/goals/types/goals.types';

type UpdateGoalVariables = {
  goalId: string;
  input: UpdateGoalInput;
};

export const useUpdateGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, input }: UpdateGoalVariables) =>
      goalsApi.update(goalId, input),
    onSuccess: async ({ goal }) => {
      queryClient.setQueryData(goalKeys.detail(goal.id), goal);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: goalKeys.list() }),
      ]);
    },
  });
};
