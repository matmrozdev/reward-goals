import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardKeys } from '@/features/dashboard/api/dashboard.queries';
import { goalKeys } from '@/features/goals/api/goals.queries';
import { goalsApi } from '@/features/goals/api/goals.api';

export type DashboardGoalProgressVariables =
  | { action: 'add'; goalId: string }
  | { action: 'undo'; goalId: string; progressEntryId: string };

export const useDashboardGoalProgressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DashboardGoalProgressVariables) =>
      variables.action === 'add'
        ? goalsApi.addProgress(variables.goalId)
        : goalsApi.undoProgress(variables.goalId, variables.progressEntryId),
    onSuccess: async ({ goal }) => {
      queryClient.setQueryData(goalKeys.detail(goal.id), goal);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: goalKeys.list() }),
      ]);
    },
  });
};
