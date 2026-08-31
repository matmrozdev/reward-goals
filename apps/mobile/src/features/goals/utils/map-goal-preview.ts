import type {
  GoalAccent,
  GoalPreview,
  GoalPreviewIcon,
} from '@/features/goals/types/goal-preview.types';
import type { Goal } from '@/features/goals/types/goals.types';
import { formatGoalScheduledTime } from '@/features/goals/utils/format-goal-scheduled-time';
import { formatGoalSchedule } from '@/features/goals/utils/format-goal-schedule';

const goalIcons: GoalPreviewIcon[] = [
  'book-open-page-variant',
  'shoe-sneaker',
  'chat-processing',
  'notebook-outline',
];

export const mapGoalPreview = (goal: Goal, index: number): GoalPreview => {
  const { accent, icon } = getGoalPreviewAppearance(index);
  const scheduledTime =
    goal.scheduledTimeMinutes === null
      ? undefined
      : formatGoalScheduledTime(goal.scheduledTimeMinutes);

  return {
    accent,
    completed: goal.status === 'COMPLETED',
    icon,
    id: goal.id,
    metadata: scheduledTime,
    metadataIcon: scheduledTime ? 'clock-outline' : undefined,
    progress:
      goal.targetValue === null
        ? undefined
        : { current: goal.progressCount, target: goal.targetValue },
    scheduleLabel: getScheduleLabel(goal),
    title: goal.title,
  };
};

export const getGoalPreviewAppearance = (
  index: number,
): { accent: GoalAccent; icon: GoalPreviewIcon } => ({
  accent: index % 3 === 1 ? 'success' : 'primary',
  icon: goalIcons[index % goalIcons.length],
});

const getScheduleLabel = (goal: Goal) => {
  if (goal.archivedAt) {
    return 'Archived';
  }

  if (goal.status === 'COMPLETED') {
    return 'Completed';
  }

  if (goal.status === 'ABANDONED') {
    return 'Abandoned';
  }

  return formatGoalSchedule(goal.scheduleDays);
};
