import { formatGoalSchedule } from './format-goal-schedule';

describe('formatGoalSchedule', () => {
  it('describes a seven-day schedule as every day', () => {
    expect(
      formatGoalSchedule([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ]),
    ).toBe('Every day');
  });

  it('formats selected weekdays in API order', () => {
    expect(formatGoalSchedule(['MONDAY', 'WEDNESDAY', 'FRIDAY'])).toBe(
      'Mon, Wed, Fri',
    );
  });

  it('handles an empty schedule', () => {
    expect(formatGoalSchedule([])).toBe('No schedule');
  });
});
