import { useMutation, useQueryClient } from '@tanstack/react-query';

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
    onSuccess: ({ goal }) => {
      queryClient.setQueryData(goalKeys.detail(goal.id), goal);
      void queryClient.invalidateQueries({ queryKey: goalKeys.list() });
    },
  });
};
