import type { Goal } from '@/features/goals/types/goals.types';

import { mapGoalPreview } from './map-goal-preview';

const goal: Goal = {
  archivedAt: null,
  createdAt: '2026-08-31T08:00:00.000Z',
  description: null,
  hasProgressHistory: true,
  id: 'goal-id',
  measurementType: 'COUNT',
  progressCount: 12,
  reward: null,
  scheduleDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
  scheduledTimeMinutes: null,
  status: 'ACTIVE',
  targetValue: 20,
  title: 'Read 20 pages',
  updatedAt: '2026-08-31T08:00:00.000Z',
};

describe('mapGoalPreview', () => {
  it('maps finite progress and schedule into the shared card model', () => {
    expect(mapGoalPreview(goal, 0)).toMatchObject({
      completed: false,
      progress: { current: 12, target: 20 },
      scheduleLabel: 'Mon, Wed, Fri',
      title: 'Read 20 pages',
    });
  });

  it('uses lifecycle state instead of schedule for a completed Goal', () => {
    expect(mapGoalPreview({ ...goal, status: 'COMPLETED' }, 0)).toMatchObject({
      completed: true,
      scheduleLabel: 'Completed',
    });
  });

  it('prioritizes archived state over lifecycle status', () => {
    expect(
      mapGoalPreview(
        {
          ...goal,
          archivedAt: '2026-08-31T09:00:00.000Z',
          status: 'COMPLETED',
        },
        0,
      ),
    ).toMatchObject({ scheduleLabel: 'Archived' });
  });

  it('formats a scheduled time for ongoing Goals', () => {
    expect(
      mapGoalPreview(
        {
          ...goal,
          scheduledTimeMinutes: 19 * 60,
          targetValue: null,
        },
        0,
      ),
    ).toMatchObject({ metadata: '7:00 PM', metadataIcon: 'clock-outline' });
  });
});
