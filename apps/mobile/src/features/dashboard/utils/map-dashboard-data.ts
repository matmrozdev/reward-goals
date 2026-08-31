import type {
  DashboardAccent,
  DashboardGoal,
  DashboardGoalIcon,
  DashboardGoalResponse,
  DashboardReward,
  DashboardRewardResponse,
} from '@/features/dashboard/types/dashboard.types';

const goalIcons: DashboardGoalIcon[] = [
  'book-open-page-variant',
  'shoe-sneaker',
  'chat-processing',
  'notebook-outline',
];

export const mapDashboardGoal = (
  goal: DashboardGoalResponse,
  index: number,
): DashboardGoal => {
  const accent: DashboardAccent = index % 3 === 1 ? 'success' : 'primary';
  const scheduledTime =
    goal.scheduledTimeMinutes === null
      ? undefined
      : formatScheduledTime(goal.scheduledTimeMinutes);

  return {
    accent,
    completed: goal.hasProgressToday,
    icon: goalIcons[index % goalIcons.length],
    id: goal.id,
    latestTodayProgressEntryId: goal.latestTodayProgressEntryId,
    metadata: scheduledTime,
    metadataIcon: scheduledTime ? 'clock-outline' : undefined,
    progress:
      goal.targetValue === null
        ? undefined
        : { current: goal.progressCount, target: goal.targetValue },
    scheduleLabel: 'Today',
    title: goal.title,
  };
};

export const mapDashboardReward = (
  reward: DashboardRewardResponse,
): DashboardReward => ({
  currentProgress: reward.currentProgress,
  id: reward.id,
  remainingCopy: `You're ${reward.remainingProgress} ${reward.remainingProgress === 1 ? 'point' : 'points'} away from your next reward!`,
  targetProgress: reward.requiredProgress,
  title: reward.title,
});

export const getDashboardIdentity = (email: string) => {
  const emailName = email.split('@')[0]?.trim() ?? '';
  const words = emailName
    .split(/[._-]+/)
    .map((word) => word.trim())
    .filter(Boolean);
  const name = words.length
    ? words.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(' ')
    : email;

  return {
    avatarLabel: name || email,
    name: name || email,
  };
};

export const getDashboardGreeting = (hour: number) => {
  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
};

function formatScheduledTime(minutesFromMidnight: number): string {
  const hour = Math.floor(minutesFromMidnight / 60);
  const minute = minutesFromMidnight % 60;
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}
