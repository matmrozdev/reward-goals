import { useMutation, useQueryClient } from '@tanstack/react-query';

import { goalsApi } from '@/features/goals/api/goals.api';
import { goalKeys } from '@/features/goals/api/goals.queries';

export const useCreateGoalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.create,
    onSuccess: ({ goal }) => {
      queryClient.setQueryData(goalKeys.detail(goal.id), goal);
      void queryClient.invalidateQueries({ queryKey: goalKeys.list() });
    },
  });
};
