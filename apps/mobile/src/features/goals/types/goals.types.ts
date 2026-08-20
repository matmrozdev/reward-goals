export type GoalMeasurementType = 'FINITE' | 'ONGOING';

export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

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
  measurementType: GoalMeasurementType;
  progressCount: number;
  reward: GoalReward | null;
  scheduleDays: Weekday[];
  status: GoalStatus;
  targetValue: number | null;
  title: string;
  updatedAt: string;
};

export type GoalEnvelope = { goal: Goal };
export type GoalListResponse = { goals: Goal[] };
