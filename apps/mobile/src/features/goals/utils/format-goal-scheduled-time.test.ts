import { formatGoalScheduledTime } from './format-goal-scheduled-time';

describe('formatGoalScheduledTime', () => {
  it('formats midnight', () => {
    expect(formatGoalScheduledTime(0)).toBe('12:00 AM');
  });

  it('formats an evening time', () => {
    expect(formatGoalScheduledTime(19 * 60)).toBe('7:00 PM');
  });

  it('pads minutes with a leading zero', () => {
    expect(formatGoalScheduledTime(8 * 60 + 5)).toBe('8:05 AM');
  });
});
