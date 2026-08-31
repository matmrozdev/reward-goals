import type { Weekday } from '@/features/goals/types/goals.types';

export type DashboardAccent = 'primary' | 'success';

export type DashboardGoalIcon =
  | 'book-open-page-variant'
  | 'chat-processing'
  | 'notebook-outline'
  | 'shoe-sneaker';

export type DashboardGoal = {
  accent: DashboardAccent;
  completed: boolean;
  icon: DashboardGoalIcon;
  id: string;
  latestTodayProgressEntryId: string | null;
  metadata?: string;
  metadataIcon?: 'clock-outline' | 'fire';
  progress?: {
    current: number;
    target: number;
  };
  scheduleLabel: string;
  title: string;
};

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
