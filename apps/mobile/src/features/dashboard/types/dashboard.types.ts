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
