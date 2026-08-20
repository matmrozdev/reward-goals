import { mapGoalFormValues } from './map-goal-form-values';
import type { GoalFormValues } from './goal-form-schema';

const values: GoalFormValues = {
  description: '  Build a reading habit.  ',
  goalType: 'FINITE' as const,
  rewardEnabled: true,
  rewardRequiredProgress: '4',
  rewardTitle: '  New book  ',
  scheduleDays: ['MONDAY', 'FRIDAY'],
  targetValue: '5',
  title: '  Read  ',
};

describe('mapGoalFormValues', () => {
  it('maps finite Goal fields to the API contract', () => {
    expect(mapGoalFormValues(values)).toEqual({
      description: 'Build a reading habit.',
      reward: { requiredProgress: 4, title: 'New book' },
      scheduleDays: ['MONDAY', 'FRIDAY'],
      targetValue: 5,
      title: 'Read',
    });
  });

  it('omits immutable core settings when they are locked', () => {
    expect(mapGoalFormValues(values, true)).toEqual({
      description: 'Build a reading habit.',
      scheduleDays: ['MONDAY', 'FRIDAY'],
      title: 'Read',
    });
  });
});
