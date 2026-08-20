import type { Goal } from '@/features/goals/types/goals.types';

type GoalProgress = {
  fraction: number | null;
  label: string;
};

export const getGoalProgress = (
  goal: Pick<Goal, 'progressCount' | 'targetValue'>,
): GoalProgress => {
  if (goal.targetValue === null) {
    return {
      fraction: null,
      label: `${goal.progressCount} completed`,
    };
  }

  return {
    fraction: Math.min(goal.progressCount / goal.targetValue, 1),
    label: `${goal.progressCount} of ${goal.targetValue}`,
  };
};
