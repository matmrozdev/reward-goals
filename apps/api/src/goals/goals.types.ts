import type {
  GoalMeasurementType,
  GoalStatus,
  Weekday,
} from '../generated/prisma/enums';

export interface PublicGoalReward {
  id: string;
  title: string;
  requiredProgress: number;
  unlockedAt: Date | null;
}

export interface PublicGoal {
  id: string;
  title: string;
  description: string | null;
  measurementType: GoalMeasurementType;
  targetValue: number | null;
  scheduleDays: Weekday[];
  scheduledTimeMinutes: number | null;
  status: GoalStatus;
  archivedAt: Date | null;
  hasProgressHistory: boolean;
  progressCount: number;
  reward: PublicGoalReward | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicGoalProgressEntry {
  id: string;
  createdAt: Date;
  undoneAt: Date | null;
}

export interface GoalProgressMutationResult {
  goal: PublicGoal;
  progressEntry: PublicGoalProgressEntry;
}
