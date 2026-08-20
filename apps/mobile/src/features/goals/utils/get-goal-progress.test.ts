import { getGoalProgress } from './get-goal-progress';

describe('getGoalProgress', () => {
  it('returns bounded finite progress', () => {
    expect(
      getGoalProgress({
        progressCount: 6,
        targetValue: 4,
      }),
    ).toEqual({ fraction: 1, label: '6 of 4' });
  });

  it('returns a count without a fraction for an ongoing goal', () => {
    expect(
      getGoalProgress({
        progressCount: 3,
        targetValue: null,
      }),
    ).toEqual({ fraction: null, label: '3 completed' });
  });
});
