import type { GoalListTab } from '@/features/goals/types/goal-list.types';
import type { Goal } from '@/features/goals/types/goals.types';

export const filterGoalsByTab = (goals: Goal[], tab: GoalListTab) =>
  goals.filter((goal) => {
    if (tab === 'archived') {
      return goal.archivedAt !== null;
    }

    if (goal.archivedAt !== null) {
      return false;
    }

    if (tab === 'completed') {
      return goal.status !== 'ACTIVE';
    }

    return goal.status === 'ACTIVE';
  });
