export const formatGoalScheduledTime = (minutesFromMidnight: number) => {
  const hour = Math.floor(minutesFromMidnight / 60);
  const minute = minutesFromMidnight % 60;
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};
