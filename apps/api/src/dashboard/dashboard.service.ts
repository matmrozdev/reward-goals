import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { GoalStatus } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { createDashboardDateWindow } from './dashboard-date';
import type { DashboardResponseDto } from './dto/dashboard-response.dto';

const dashboardGoalSelect = {
  id: true,
  title: true,
  targetValue: true,
  scheduleDays: true,
  scheduledTimeMinutes: true,
  _count: {
    select: {
      progressEntries: { where: { undoneAt: null } },
    },
  },
} satisfies Prisma.GoalSelect;

const rewardCandidateSelect = {
  id: true,
  reward: {
    select: {
      id: true,
      title: true,
      requiredProgress: true,
      unlockedAt: true,
    },
  },
  _count: {
    select: {
      progressEntries: { where: { undoneAt: null } },
    },
  },
} satisfies Prisma.GoalSelect;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(
    userId: string,
    date: string,
    timeZone: string,
  ): Promise<DashboardResponseDto> {
    const window = createDashboardDateWindow(date, timeZone);
    const activeProgressToday = {
      createdAt: { gte: window.start, lt: window.end },
      undoneAt: null,
    } satisfies Prisma.GoalProgressEntryWhereInput;

    const [selectedGoals, rewardCandidates] = await Promise.all([
      this.prisma.goal.findMany({
        where: {
          userId,
          archivedAt: null,
          status: { not: GoalStatus.ABANDONED },
          OR: [
            {
              status: GoalStatus.ACTIVE,
              OR: [
                { scheduleDays: { isEmpty: true } },
                { scheduleDays: { has: window.weekday } },
              ],
            },
            {
              status: GoalStatus.COMPLETED,
              progressEntries: { some: activeProgressToday },
            },
          ],
        },
        orderBy: [
          { scheduledTimeMinutes: { nulls: 'last', sort: 'asc' } },
          { createdAt: 'asc' },
        ],
        select: {
          ...dashboardGoalSelect,
          progressEntries: {
            where: activeProgressToday,
            orderBy: { createdAt: 'desc' },
            select: { id: true },
            take: 1,
          },
        },
      }),
      this.prisma.goal.findMany({
        where: {
          userId,
          archivedAt: null,
          status: { not: GoalStatus.ABANDONED },
          reward: { is: { unlockedAt: null } },
        },
        select: rewardCandidateSelect,
      }),
    ]);

    const goals = selectedGoals.map((goal) => {
      const latestTodayProgressEntryId = goal.progressEntries[0]?.id ?? null;

      return {
        id: goal.id,
        title: goal.title,
        progressCount: goal._count.progressEntries,
        targetValue: goal.targetValue,
        scheduleDays: goal.scheduleDays,
        scheduledTimeMinutes: goal.scheduledTimeMinutes,
        hasProgressToday: latestTodayProgressEntryId !== null,
        latestTodayProgressEntryId,
      };
    });
    const rewardPreview = rewardCandidates
      .flatMap((goal) => {
        if (!goal.reward) {
          return [];
        }

        const currentProgress = goal._count.progressEntries;

        return [
          {
            id: goal.reward.id,
            goalId: goal.id,
            title: goal.reward.title,
            currentProgress,
            requiredProgress: goal.reward.requiredProgress,
            remainingProgress: Math.max(
              goal.reward.requiredProgress - currentProgress,
              0,
            ),
            unlockedAt: goal.reward.unlockedAt,
          },
        ];
      })
      .sort(
        (left, right) =>
          left.remainingProgress - right.remainingProgress ||
          left.id.localeCompare(right.id),
      )[0];

    return {
      today: {
        date: window.date,
        completedCount: goals.filter((goal) => goal.hasProgressToday).length,
        totalCount: goals.length,
        goals,
      },
      rewardPreview: rewardPreview ?? null,
    };
  }
}
