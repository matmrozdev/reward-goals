import type { Goal } from '@/features/goals/types/goals.types';

import { filterGoalsByTab } from './filter-goals-by-tab';

const goal = (overrides: Partial<Goal>): Goal => ({
  archivedAt: null,
  createdAt: '2026-08-31T08:00:00.000Z',
  description: null,
  hasProgressHistory: false,
  id: 'goal-id',
  measurementType: 'COUNT',
  progressCount: 0,
  reward: null,
  scheduleDays: [],
  scheduledTimeMinutes: null,
  status: 'ACTIVE',
  targetValue: null,
  title: 'Goal',
  updatedAt: '2026-08-31T08:00:00.000Z',
  ...overrides,
});

describe('filterGoalsByTab', () => {
  const activeGoal = goal({ id: 'active' });
  const completedGoal = goal({ id: 'completed', status: 'COMPLETED' });
  const abandonedGoal = goal({ id: 'abandoned', status: 'ABANDONED' });
  const archivedGoal = goal({
    archivedAt: '2026-08-31T09:00:00.000Z',
    id: 'archived',
  });
  const goals = [activeGoal, completedGoal, abandonedGoal, archivedGoal];

  it('returns active unarchived Goals for the active tab', () => {
    expect(filterGoalsByTab(goals, 'active')).toEqual([activeGoal]);
  });

  it('returns finished unarchived Goals for the completed tab', () => {
    expect(filterGoalsByTab(goals, 'completed')).toEqual([
      completedGoal,
      abandonedGoal,
    ]);
  });

  it('returns archived Goals regardless of lifecycle status', () => {
    expect(filterGoalsByTab(goals, 'archived')).toEqual([archivedGoal]);
  });
});
