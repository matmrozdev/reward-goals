import type {
  CreateGoalInput,
  Goal,
  UpdateGoalInput,
} from '@/features/goals/types/goals.types';

import type { GoalFormValues } from './goal-form-schema';

export const getGoalFormValues = (goal?: Goal): GoalFormValues => ({
  description: goal?.description ?? '',
  goalType: goal?.targetValue === null ? 'ONGOING' : 'FINITE',
  rewardEnabled: goal?.reward !== null && goal?.reward !== undefined,
  rewardRequiredProgress: goal?.reward?.requiredProgress.toString() ?? '',
  rewardTitle: goal?.reward?.title ?? '',
  scheduleDays: goal?.scheduleDays ?? [],
  targetValue: goal?.targetValue?.toString() ?? '',
  title: goal?.title ?? '',
});

export function mapGoalFormValues(
  values: GoalFormValues,
  coreSettingsLocked: true,
): UpdateGoalInput;
export function mapGoalFormValues(
  values: GoalFormValues,
  coreSettingsLocked?: false,
): CreateGoalInput;
export function mapGoalFormValues(
  values: GoalFormValues,
  coreSettingsLocked: boolean,
): CreateGoalInput | UpdateGoalInput;
export function mapGoalFormValues(
  values: GoalFormValues,
  coreSettingsLocked = false,
): CreateGoalInput | UpdateGoalInput {
  const input: CreateGoalInput | UpdateGoalInput = {
    description: values.description.trim() || null,
    scheduleDays: values.scheduleDays,
    title: values.title.trim(),
  };

  if (!coreSettingsLocked) {
    input.targetValue =
      values.goalType === 'FINITE' ? Number(values.targetValue) : null;
    input.reward = values.rewardEnabled
      ? {
          requiredProgress: Number(values.rewardRequiredProgress),
          title: values.rewardTitle.trim(),
        }
      : null;
  }

  return input;
}
