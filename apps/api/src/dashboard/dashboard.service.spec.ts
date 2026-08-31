import { GoalStatus, Weekday } from '../generated/prisma/enums';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  const userId = '3dbb1310-59c7-47f6-b22b-bc5ec7185a5a';

  function createService() {
    const prisma = {
      goal: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([
            {
              id: 'b640e655-5f20-4658-ab6f-1dd885957ea8',
              title: 'Read consistently',
              targetValue: 20,
              scheduleDays: [Weekday.MONDAY],
              scheduledTimeMinutes: 420,
              _count: { progressEntries: 12 },
              progressEntries: [{ id: 'dc17c0a0-559d-480c-95eb-1121413e0a78' }],
            },
          ])
          .mockResolvedValueOnce([
            {
              id: 'b640e655-5f20-4658-ab6f-1dd885957ea8',
              reward: {
                id: 'f44d97c0-5f99-4ba9-a8f5-f0bc1fcf08f1',
                title: 'Movie night',
                requiredProgress: 20,
                unlockedAt: null,
              },
              _count: { progressEntries: 12 },
            },
          ]),
      },
    };

    return { prisma, service: new DashboardService(prisma as never) };
  }

  it('returns owned Today goals and the nearest locked Reward', async () => {
    const { prisma, service } = createService();

    const result = await service.getDashboard(
      userId,
      '2026-08-31',
      'Europe/Warsaw',
    );

    expect(result).toEqual({
      today: {
        date: '2026-08-31',
        completedCount: 1,
        totalCount: 1,
        goals: [
          {
            id: 'b640e655-5f20-4658-ab6f-1dd885957ea8',
            title: 'Read consistently',
            progressCount: 12,
            targetValue: 20,
            scheduleDays: [Weekday.MONDAY],
            scheduledTimeMinutes: 420,
            hasProgressToday: true,
            latestTodayProgressEntryId: 'dc17c0a0-559d-480c-95eb-1121413e0a78',
          },
        ],
      },
      rewardPreview: {
        id: 'f44d97c0-5f99-4ba9-a8f5-f0bc1fcf08f1',
        goalId: 'b640e655-5f20-4658-ab6f-1dd885957ea8',
        title: 'Movie night',
        currentProgress: 12,
        requiredProgress: 20,
        remainingProgress: 8,
        unlockedAt: null,
      },
    });
    expect(prisma.goal.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({ userId }),
      }),
    );
    expect(prisma.goal.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({
          userId,
          reward: { is: { unlockedAt: null } },
          status: { not: GoalStatus.ABANDONED },
        }),
      }),
    );
  });

  it('returns a stable empty Dashboard response', async () => {
    const prisma = {
      goal: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const service = new DashboardService(prisma as never);

    await expect(
      service.getDashboard(userId, '2026-08-31', 'UTC'),
    ).resolves.toEqual({
      today: {
        date: '2026-08-31',
        completedCount: 0,
        totalCount: 0,
        goals: [],
      },
      rewardPreview: null,
    });
  });
});
