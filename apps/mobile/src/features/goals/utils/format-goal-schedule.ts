import type { Weekday } from '@/features/goals/types/goals.types';

const weekdayLabels: Record<Weekday, string> = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun',
};

export const formatGoalSchedule = (scheduleDays: Weekday[]) => {
  if (scheduleDays.length === 7) {
    return 'Every day';
  }

  if (scheduleDays.length === 0) {
    return 'No schedule';
  }

  return scheduleDays.map((day) => weekdayLabels[day]).join(', ');
};
