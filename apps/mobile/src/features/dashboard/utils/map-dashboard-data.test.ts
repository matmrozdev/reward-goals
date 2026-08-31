import type {
  DashboardGoalResponse,
  DashboardRewardResponse,
} from '@/features/dashboard/types/dashboard.types';

import {
  getDashboardGreeting,
  getDashboardIdentity,
  mapDashboardGoal,
  mapDashboardReward,
} from './map-dashboard-data';

describe('mapDashboardGoal', () => {
  const goal: DashboardGoalResponse = {
    hasProgressToday: true,
    id: 'goal-id',
    latestTodayProgressEntryId: 'progress-id',
    progressCount: 12,
    scheduleDays: ['MONDAY'],
    scheduledTimeMinutes: 1140,
    targetValue: 20,
    title: 'Read 20 pages',
  };

  it('maps API progress and local scheduling metadata for presentation', () => {
    expect(mapDashboardGoal(goal, 0)).toMatchObject({
      completed: true,
      latestTodayProgressEntryId: 'progress-id',
      metadata: '7:00 PM',
      progress: { current: 12, target: 20 },
      scheduleLabel: 'Today',
      title: 'Read 20 pages',
    });
  });

  it('omits progress and time metadata when the API has no real value', () => {
    expect(
      mapDashboardGoal(
        { ...goal, scheduledTimeMinutes: null, targetValue: null },
        1,
      ),
    ).toMatchObject({
      metadata: undefined,
      progress: undefined,
    });
  });
});

describe('mapDashboardReward', () => {
  it('derives singular remaining-progress copy', () => {
    const reward: DashboardRewardResponse = {
      currentProgress: 2,
      goalId: 'goal-id',
      id: 'reward-id',
      remainingProgress: 1,
      requiredProgress: 3,
      title: 'Movie night',
      unlockedAt: null,
    };

    expect(mapDashboardReward(reward).remainingCopy).toBe(
      "You're 1 point away from your next reward!",
    );
  });
});

describe('getDashboardIdentity', () => {
  it('derives a readable name from the authenticated email', () => {
    expect(getDashboardIdentity('alex.smith@example.com')).toEqual({
      avatarLabel: 'Alex Smith',
      name: 'Alex Smith',
    });
  });
});

describe('getDashboardGreeting', () => {
  it('selects copy for the local hour', () => {
    expect(getDashboardGreeting(8)).toBe('Good morning');
    expect(getDashboardGreeting(14)).toBe('Good afternoon');
    expect(getDashboardGreeting(20)).toBe('Good evening');
  });
});
