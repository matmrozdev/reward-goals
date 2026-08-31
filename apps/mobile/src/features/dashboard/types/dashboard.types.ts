import type { Weekday } from '@/features/goals/types/goals.types';

export type DashboardReward = {
  currentProgress: number;
  id: string;
  remainingCopy: string;
  targetProgress: number;
  title: string;
};

export type DashboardRequest = {
  date: string;
  timeZone: string;
};

export type DashboardGoalResponse = {
  hasProgressToday: boolean;
  id: string;
  latestTodayProgressEntryId: string | null;
  progressCount: number;
  scheduleDays: Weekday[];
  scheduledTimeMinutes: number | null;
  targetValue: number | null;
  title: string;
};

export type DashboardRewardResponse = {
  currentProgress: number;
  goalId: string;
  id: string;
  remainingProgress: number;
  requiredProgress: number;
  title: string;
  unlockedAt: string | null;
};

export type DashboardResponse = {
  rewardPreview: DashboardRewardResponse | null;
  today: {
    completedCount: number;
    date: string;
    goals: DashboardGoalResponse[];
    totalCount: number;
  };
};
