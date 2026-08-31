export type GoalMeasurementType = 'COUNT';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'ABANDONED';

export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type GoalReward = {
  id: string;
  requiredProgress: number;
  title: string;
  unlockedAt: string | null;
};

export type Goal = {
  archivedAt: string | null;
  createdAt: string;
  description: string | null;
  id: string;
  hasProgressHistory: boolean;
  measurementType: GoalMeasurementType;
  progressCount: number;
  reward: GoalReward | null;
  scheduleDays: Weekday[];
  scheduledTimeMinutes: number | null;
  status: GoalStatus;
  targetValue: number | null;
  title: string;
  updatedAt: string;
};

export type GoalEnvelope = { goal: Goal };
export type GoalListResponse = { goals: Goal[] };

export type GoalProgressEntry = {
  createdAt: string;
  id: string;
  undoneAt: string | null;
};

export type GoalProgressMutationResponse = GoalEnvelope & {
  progressEntry: GoalProgressEntry;
};

export type GoalRewardInput = {
  requiredProgress: number;
  title: string;
};

export type CreateGoalInput = {
  description?: string | null;
  reward?: GoalRewardInput | null;
  scheduleDays?: Weekday[];
  targetValue?: number | null;
  title: string;
};

export type UpdateGoalInput = Partial<CreateGoalInput>;
