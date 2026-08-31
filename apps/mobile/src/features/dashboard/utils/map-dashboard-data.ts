import type {
  DashboardGoalResponse,
  DashboardReward,
  DashboardRewardResponse,
} from '@/features/dashboard/types/dashboard.types';
import type { GoalPreview } from '@/features/goals/types/goal-preview.types';
import { formatGoalScheduledTime } from '@/features/goals/utils/format-goal-scheduled-time';
import { getGoalPreviewAppearance } from '@/features/goals/utils/map-goal-preview';

export const mapDashboardGoal = (
  goal: DashboardGoalResponse,
  index: number,
): GoalPreview => {
  const { accent, icon } = getGoalPreviewAppearance(index);
  const scheduledTime =
    goal.scheduledTimeMinutes === null
      ? undefined
      : formatGoalScheduledTime(goal.scheduledTimeMinutes);

  return {
    accent,
    completed: goal.hasProgressToday,
    icon,
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
