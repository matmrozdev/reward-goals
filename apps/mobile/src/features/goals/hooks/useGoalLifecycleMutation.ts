import { useMutation, useQueryClient } from '@tanstack/react-query';

import { goalsApi } from '@/features/goals/api/goals.api';
import { goalKeys } from '@/features/goals/api/goals.queries';

export type GoalLifecycleAction = 'abandon' | 'archive' | 'unarchive';

type GoalLifecycleVariables = {
  action: GoalLifecycleAction;
  goalId: string;
};

export const useGoalLifecycleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, goalId }: GoalLifecycleVariables) =>
      goalsApi[action](goalId),
    onSuccess: ({ goal }) => {
      queryClient.setQueryData(goalKeys.detail(goal.id), goal);
      void queryClient.invalidateQueries({ queryKey: goalKeys.list() });
    },
  });
};
