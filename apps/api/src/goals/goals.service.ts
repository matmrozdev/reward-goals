import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { GoalStatus, Weekday } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateGoalDto, UpdateGoalDto } from './dto/goal-input.dto';
import type { GoalProgressMutationResult, PublicGoal } from './goals.types';

const weekdayOrder = [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
  Weekday.SUNDAY,
] as const;

const publicGoalSelect = {
  id: true,
  title: true,
  description: true,
  measurementType: true,
  targetValue: true,
  scheduleDays: true,
  status: true,
  archivedAt: true,
  reward: {
    select: {
      id: true,
      title: true,
      requiredProgress: true,
      unlockedAt: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      progressEntries: { where: { undoneAt: null } },
    },
  },
  progressEntries: {
    select: { id: true },
    take: 1,
  },
} satisfies Prisma.GoalSelect;

type SelectedGoal = Prisma.GoalGetPayload<{ select: typeof publicGoalSelect }>;

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateGoalDto): Promise<PublicGoal> {
    validateRewardThreshold(input.targetValue ?? null, input.reward ?? null);

    const goal = await this.prisma.goal.create({
      data: {
        userId,
        title: input.title,
        description: input.description ?? null,
        targetValue: input.targetValue ?? null,
        scheduleDays: canonicalizeSchedule(input.scheduleDays),
        reward: input.reward
          ? {
              create: {
                title: input.reward.title,
                requiredProgress: input.reward.requiredProgress,
              },
            }
          : undefined,
      },
      select: publicGoalSelect,
    });

    return toPublicGoal(goal);
  }

  async list(userId: string): Promise<PublicGoal[]> {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: [{ archivedAt: 'asc' }, { createdAt: 'desc' }],
      select: publicGoalSelect,
    });

    return goals.map(toPublicGoal);
  }

  async get(userId: string, goalId: string): Promise<PublicGoal> {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
      select: publicGoalSelect,
    });

    if (!goal) {
      throw goalNotFound();
    }

    return toPublicGoal(goal);
  }

  async update(
    userId: string,
    goalId: string,
    input: UpdateGoalDto,
  ): Promise<PublicGoal> {
    return this.withSerializableTransaction(async (transaction) => {
      const existing = await transaction.goal.findFirst({
        where: { id: goalId, userId },
        select: {
          id: true,
          status: true,
          targetValue: true,
          reward: {
            select: { id: true, title: true, requiredProgress: true },
          },
          _count: { select: { progressEntries: true } },
        },
      });

      if (!existing) {
        throw goalNotFound();
      }

      const coreSettingsChanged =
        input.targetValue !== undefined || input.reward !== undefined;

      if (
        coreSettingsChanged &&
        (existing._count.progressEntries > 0 ||
          existing.status !== GoalStatus.ACTIVE)
      ) {
        throw new BadRequestException(
          'Target and reward settings cannot change after progress exists or the Goal has ended',
        );
      }

      const nextTargetValue =
        input.targetValue === undefined
          ? existing.targetValue
          : input.targetValue;
      const nextReward =
        input.reward === undefined ? existing.reward : input.reward;
      validateRewardThreshold(nextTargetValue, nextReward);

      await transaction.goal.update({
        where: { id: existing.id },
        data: {
          title: input.title,
          description: input.description,
          targetValue: input.targetValue,
          scheduleDays:
            input.scheduleDays === undefined
              ? undefined
              : canonicalizeSchedule(input.scheduleDays),
        },
      });

      if (input.reward === null) {
        await transaction.goalReward.deleteMany({ where: { goalId } });
      } else if (input.reward !== undefined) {
        await transaction.goalReward.upsert({
          where: { goalId },
          create: {
            goalId,
            title: input.reward.title,
            requiredProgress: input.reward.requiredProgress,
          },
          update: {
            title: input.reward.title,
            requiredProgress: input.reward.requiredProgress,
          },
        });
      }

      return this.getSelectedGoal(transaction, userId, goalId);
    });
  }

  archive(userId: string, goalId: string): Promise<PublicGoal> {
    return this.setArchived(userId, goalId, true);
  }

  unarchive(userId: string, goalId: string): Promise<PublicGoal> {
    return this.setArchived(userId, goalId, false);
  }

  async abandon(userId: string, goalId: string): Promise<PublicGoal> {
    return this.withSerializableTransaction(async (transaction) => {
      const goal = await transaction.goal.findFirst({
        where: { id: goalId, userId },
        select: { id: true, status: true },
      });

      if (!goal) {
        throw goalNotFound();
      }

      if (goal.status === GoalStatus.COMPLETED) {
        throw new BadRequestException('A completed Goal cannot be abandoned');
      }

      if (goal.status !== GoalStatus.ABANDONED) {
        await transaction.goal.update({
          where: { id: goal.id },
          data: { status: GoalStatus.ABANDONED },
        });
      }

      return this.getSelectedGoal(transaction, userId, goalId);
    });
  }

  async completeOngoing(userId: string, goalId: string): Promise<PublicGoal> {
    return this.withSerializableTransaction(async (transaction) => {
      const goal = await transaction.goal.findFirst({
        where: { id: goalId, userId },
        select: { id: true, status: true, targetValue: true },
      });

      if (!goal) {
        throw goalNotFound();
      }

      if (goal.targetValue !== null) {
        throw new BadRequestException(
          'Finite Goals complete automatically when their target is reached',
        );
      }

      if (goal.status === GoalStatus.ABANDONED) {
        throw new BadRequestException('An abandoned Goal cannot be completed');
      }

      if (goal.status !== GoalStatus.COMPLETED) {
        await transaction.goal.update({
          where: { id: goal.id },
          data: { status: GoalStatus.COMPLETED },
        });
      }

      return this.getSelectedGoal(transaction, userId, goalId);
    });
  }

  async addProgress(
    userId: string,
    goalId: string,
  ): Promise<GoalProgressMutationResult> {
    return this.withSerializableTransaction(async (transaction) => {
      const goal = await transaction.goal.findFirst({
        where: { id: goalId, userId },
        select: {
          id: true,
          status: true,
          targetValue: true,
          archivedAt: true,
        },
      });

      if (!goal) {
        throw goalNotFound();
      }

      if (goal.archivedAt !== null) {
        throw new BadRequestException(
          'An archived Goal must be unarchived before recording progress',
        );
      }

      if (goal.status !== GoalStatus.ACTIVE) {
        throw new BadRequestException(
          'Progress can only be recorded for an active Goal',
        );
      }

      const progressEntry = await transaction.goalProgressEntry.create({
        data: { goalId },
        select: { id: true, createdAt: true, undoneAt: true },
      });
      const progressCount = await transaction.goalProgressEntry.count({
        where: { goalId, undoneAt: null },
      });
      const now = new Date();

      if (goal.targetValue !== null && progressCount >= goal.targetValue) {
        await transaction.goal.update({
          where: { id: goal.id },
          data: { status: GoalStatus.COMPLETED },
        });
      }

      await transaction.goalReward.updateMany({
        where: {
          goalId,
          unlockedAt: null,
          requiredProgress: { lte: progressCount },
        },
        data: { unlockedAt: now },
      });

      return {
        goal: await this.getSelectedGoal(transaction, userId, goalId),
        progressEntry,
      };
    });
  }

  async undoProgress(
    userId: string,
    goalId: string,
    progressEntryId: string,
  ): Promise<GoalProgressMutationResult> {
    return this.withSerializableTransaction(async (transaction) => {
      const goal = await transaction.goal.findFirst({
        where: { id: goalId, userId },
        select: { id: true, status: true, targetValue: true },
      });

      if (!goal) {
        throw goalNotFound();
      }

      const undoneAt = new Date();
      const undone = await transaction.goalProgressEntry.updateMany({
        where: { id: progressEntryId, goalId, undoneAt: null },
        data: { undoneAt },
      });

      if (undone.count !== 1) {
        throw new NotFoundException('Progress entry not found');
      }

      const progressCount = await transaction.goalProgressEntry.count({
        where: { goalId, undoneAt: null },
      });

      if (
        goal.status === GoalStatus.COMPLETED &&
        goal.targetValue !== null &&
        progressCount < goal.targetValue
      ) {
        await transaction.goal.update({
          where: { id: goal.id },
          data: { status: GoalStatus.ACTIVE },
        });
      }

      await transaction.goalReward.updateMany({
        where: {
          goalId,
          unlockedAt: { not: null },
          requiredProgress: { gt: progressCount },
        },
        data: { unlockedAt: null },
      });

      return {
        goal: await this.getSelectedGoal(transaction, userId, goalId),
        progressEntry: {
          id: progressEntryId,
          createdAt: await this.getProgressEntryCreatedAt(
            transaction,
            progressEntryId,
          ),
          undoneAt,
        },
      };
    });
  }

  private async setArchived(
    userId: string,
    goalId: string,
    archived: boolean,
  ): Promise<PublicGoal> {
    return this.withSerializableTransaction(async (transaction) => {
      const goal = await transaction.goal.findFirst({
        where: { id: goalId, userId },
        select: { id: true, archivedAt: true },
      });

      if (!goal) {
        throw goalNotFound();
      }

      if ((goal.archivedAt !== null) !== archived) {
        await transaction.goal.update({
          where: { id: goal.id },
          data: { archivedAt: archived ? new Date() : null },
        });
      }

      return this.getSelectedGoal(transaction, userId, goalId);
    });
  }

  private async withSerializableTransaction<T>(
    operation: (transaction: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    const maximumAttempts = 3;

    for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
      try {
        return await this.prisma.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (error) {
        const canRetry =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2034' &&
          attempt < maximumAttempts;

        if (!canRetry) {
          throw error;
        }
      }
    }

    throw new Error('Serializable transaction retry limit was exhausted');
  }

  private async getSelectedGoal(
    transaction: Prisma.TransactionClient,
    userId: string,
    goalId: string,
  ): Promise<PublicGoal> {
    const goal = await transaction.goal.findFirst({
      where: { id: goalId, userId },
      select: publicGoalSelect,
    });

    if (!goal) {
      throw goalNotFound();
    }

    return toPublicGoal(goal);
  }

  private async getProgressEntryCreatedAt(
    transaction: Prisma.TransactionClient,
    progressEntryId: string,
  ): Promise<Date> {
    const entry = await transaction.goalProgressEntry.findUniqueOrThrow({
      where: { id: progressEntryId },
      select: { createdAt: true },
    });

    return entry.createdAt;
  }
}

function canonicalizeSchedule(scheduleDays: Weekday[] = []): Weekday[] {
  const selected = new Set(scheduleDays);
  return weekdayOrder.filter((weekday) => selected.has(weekday));
}

function toPublicGoal(goal: SelectedGoal): PublicGoal {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    measurementType: goal.measurementType,
    targetValue: goal.targetValue,
    scheduleDays: goal.scheduleDays,
    status: goal.status,
    archivedAt: goal.archivedAt,
    hasProgressHistory: goal.progressEntries.length > 0,
    progressCount: goal._count.progressEntries,
    reward: goal.reward,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}

function goalNotFound(): NotFoundException {
  return new NotFoundException('Goal not found');
}

function validateRewardThreshold(
  targetValue: number | null,
  reward: { requiredProgress: number } | null,
): void {
  if (
    targetValue !== null &&
    reward !== null &&
    reward.requiredProgress > targetValue
  ) {
    throw new BadRequestException(
      'A finite Goal reward threshold cannot exceed its target',
    );
  }
}
