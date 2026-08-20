import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import {
  GoalMeasurementType,
  GoalStatus,
  Weekday,
} from '../generated/prisma/enums';
import { GoalsService } from './goals.service';

describe('GoalsService', () => {
  const userId = '3dbb1310-59c7-47f6-b22b-bc5ec7185a5a';
  const goalId = 'b640e655-5f20-4658-ab6f-1dd885957ea8';
  const progressEntryId = 'dc17c0a0-559d-480c-95eb-1121413e0a78';
  const createdAt = new Date('2026-08-20T10:00:00.000Z');
  const updatedAt = new Date('2026-08-20T11:00:00.000Z');
  const selectedGoal = {
    id: goalId,
    title: 'Read consistently',
    description: null,
    measurementType: GoalMeasurementType.COUNT,
    targetValue: 3,
    scheduleDays: [Weekday.MONDAY, Weekday.WEDNESDAY],
    status: GoalStatus.ACTIVE,
    archivedAt: null,
    reward: {
      id: 'f44d97c0-5f99-4ba9-a8f5-f0bc1fcf08f1',
      title: 'Enjoy a new book',
      requiredProgress: 2,
      unlockedAt: null,
    },
    createdAt,
    updatedAt,
    _count: { progressEntries: 0 },
    progressEntries: [],
  };

  function createService() {
    const transaction = {
      goal: {
        create: jest.fn().mockResolvedValue(selectedGoal),
        findFirst: jest.fn().mockResolvedValue(selectedGoal),
        findMany: jest.fn().mockResolvedValue([selectedGoal]),
        update: jest.fn().mockResolvedValue({}),
      },
      goalReward: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        upsert: jest.fn().mockResolvedValue({}),
      },
      goalProgressEntry: {
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue({
          id: progressEntryId,
          createdAt,
          undoneAt: null,
        }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({ createdAt }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const prisma = {
      ...transaction,
      $transaction: jest.fn(async (callback) => callback(transaction)),
    };

    return {
      prisma,
      transaction,
      service: new GoalsService(prisma as never),
    };
  }

  it('creates an owned Goal with canonical weekday order', async () => {
    const { service, prisma } = createService();

    const result = await service.create(userId, {
      title: 'Read consistently',
      targetValue: 3,
      scheduleDays: [Weekday.WEDNESDAY, Weekday.MONDAY],
      reward: { title: 'Enjoy a new book', requiredProgress: 2 },
    });

    expect(prisma.goal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          userId,
          title: 'Read consistently',
          description: null,
          targetValue: 3,
          scheduleDays: [Weekday.MONDAY, Weekday.WEDNESDAY],
          reward: {
            create: {
              title: 'Enjoy a new book',
              requiredProgress: 2,
            },
          },
        },
      }),
    );
    expect(result).not.toHaveProperty('userId');
    expect(result.progressCount).toBe(0);
    expect(result.hasProgressHistory).toBe(false);
  });

  it('rejects an unreachable reward threshold for a finite Goal', async () => {
    const { service, prisma } = createService();

    await expect(
      service.create(userId, {
        title: 'Read consistently',
        targetValue: 3,
        reward: { title: 'Enjoy a new book', requiredProgress: 4 },
      }),
    ).rejects.toEqual(
      new BadRequestException(
        'A finite Goal reward threshold cannot exceed its target',
      ),
    );
    expect(prisma.goal.create).not.toHaveBeenCalled();
  });

  it('scopes retrieval to both Goal and authenticated user identifiers', async () => {
    const { service, prisma } = createService();

    await expect(service.get(userId, goalId)).resolves.toMatchObject({
      id: goalId,
    });
    expect(prisma.goal.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: goalId, userId } }),
    );
  });

  it('reports progress history independently from active progress', async () => {
    const { service, prisma } = createService();
    prisma.goal.findFirst.mockResolvedValue({
      ...selectedGoal,
      progressEntries: [{ id: progressEntryId }],
    });

    await expect(service.get(userId, goalId)).resolves.toMatchObject({
      hasProgressHistory: true,
      progressCount: 0,
    });
  });

  it('returns the same not-found response when an owned Goal is unavailable', async () => {
    const { service, prisma } = createService();
    prisma.goal.findFirst.mockResolvedValue(null);

    await expect(service.get(userId, goalId)).rejects.toEqual(
      new NotFoundException('Goal not found'),
    );
  });

  it('keeps target and reward semantics immutable after progress history exists', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst.mockResolvedValue({
      id: goalId,
      status: GoalStatus.ACTIVE,
      reward: { id: selectedGoal.reward.id },
      _count: { progressEntries: 1 },
    });

    await expect(
      service.update(userId, goalId, { targetValue: 4 }),
    ).rejects.toEqual(
      new BadRequestException(
        'Target and reward settings cannot change after progress exists or the Goal has ended',
      ),
    );
    expect(transaction.goal.update).not.toHaveBeenCalled();
  });

  it('allows presentation and schedule edits without rewriting progress', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst
      .mockResolvedValueOnce({
        id: goalId,
        status: GoalStatus.ACTIVE,
        targetValue: selectedGoal.targetValue,
        reward: {
          id: selectedGoal.reward.id,
          title: selectedGoal.reward.title,
          requiredProgress: selectedGoal.reward.requiredProgress,
        },
        _count: { progressEntries: 2 },
      })
      .mockResolvedValueOnce(selectedGoal);

    await service.update(userId, goalId, {
      title: 'Updated title',
      scheduleDays: [Weekday.SUNDAY, Weekday.TUESDAY],
    });

    expect(transaction.goal.update).toHaveBeenCalledWith({
      where: { id: goalId },
      data: {
        title: 'Updated title',
        description: undefined,
        targetValue: undefined,
        scheduleDays: [Weekday.TUESDAY, Weekday.SUNDAY],
      },
    });
    expect(transaction.goalReward.upsert).not.toHaveBeenCalled();
  });

  it('keeps core settings immutable after an ongoing Goal has ended', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst.mockResolvedValue({
      id: goalId,
      status: GoalStatus.COMPLETED,
      targetValue: null,
      reward: null,
      _count: { progressEntries: 0 },
    });

    await expect(
      service.update(userId, goalId, { targetValue: 3 }),
    ).rejects.toEqual(
      new BadRequestException(
        'Target and reward settings cannot change after progress exists or the Goal has ended',
      ),
    );
    expect(transaction.goal.update).not.toHaveBeenCalled();
  });

  it('completes a finite Goal and unlocks its reward at derived thresholds', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst
      .mockResolvedValueOnce({
        id: goalId,
        status: GoalStatus.ACTIVE,
        targetValue: 3,
        archivedAt: null,
      })
      .mockResolvedValueOnce({
        ...selectedGoal,
        status: GoalStatus.COMPLETED,
        _count: { progressEntries: 3 },
      });
    transaction.goalProgressEntry.count.mockResolvedValue(3);

    const result = await service.addProgress(userId, goalId);

    expect(transaction.goal.update).toHaveBeenCalledWith({
      where: { id: goalId },
      data: { status: GoalStatus.COMPLETED },
    });
    expect(transaction.goalReward.updateMany).toHaveBeenCalledWith({
      where: {
        goalId,
        unlockedAt: null,
        requiredProgress: { lte: 3 },
      },
      data: { unlockedAt: expect.any(Date) },
    });
    expect(result.progressEntry.id).toBe(progressEntryId);
  });

  it('keeps an ongoing Goal active while progress accumulates', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst
      .mockResolvedValueOnce({
        id: goalId,
        status: GoalStatus.ACTIVE,
        targetValue: null,
        archivedAt: null,
      })
      .mockResolvedValueOnce({
        ...selectedGoal,
        targetValue: null,
        _count: { progressEntries: 12 },
      });
    transaction.goalProgressEntry.count.mockResolvedValue(12);

    await service.addProgress(userId, goalId);

    expect(transaction.goal.update).not.toHaveBeenCalled();
  });

  it('reverses derived completion and reward state when progress is undone', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst
      .mockResolvedValueOnce({
        id: goalId,
        status: GoalStatus.COMPLETED,
        targetValue: 3,
      })
      .mockResolvedValueOnce({
        ...selectedGoal,
        _count: { progressEntries: 2 },
      });
    transaction.goalProgressEntry.count.mockResolvedValue(2);

    const result = await service.undoProgress(userId, goalId, progressEntryId);

    expect(transaction.goalProgressEntry.updateMany).toHaveBeenCalledWith({
      where: { id: progressEntryId, goalId, undoneAt: null },
      data: { undoneAt: expect.any(Date) },
    });
    expect(transaction.goal.update).toHaveBeenCalledWith({
      where: { id: goalId },
      data: { status: GoalStatus.ACTIVE },
    });
    expect(transaction.goalReward.updateMany).toHaveBeenCalledWith({
      where: {
        goalId,
        unlockedAt: { not: null },
        requiredProgress: { gt: 2 },
      },
      data: { unlockedAt: null },
    });
    expect(result.progressEntry).toMatchObject({
      id: progressEntryId,
      createdAt,
      undoneAt: expect.any(Date),
    });
  });

  it('only explicitly completes ongoing Goals', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst.mockResolvedValue({
      id: goalId,
      status: GoalStatus.ACTIVE,
      targetValue: 3,
    });

    await expect(service.completeOngoing(userId, goalId)).rejects.toEqual(
      new BadRequestException(
        'Finite Goals complete automatically when their target is reached',
      ),
    );
  });

  it('keeps archival separate from lifecycle state', async () => {
    const { service, transaction } = createService();
    transaction.goal.findFirst
      .mockResolvedValueOnce({
        id: goalId,
        archivedAt: null,
      })
      .mockResolvedValueOnce({
        ...selectedGoal,
        status: GoalStatus.COMPLETED,
        archivedAt: updatedAt,
      });

    const result = await service.archive(userId, goalId);

    expect(transaction.goal.update).toHaveBeenCalledWith({
      where: { id: goalId },
      data: { archivedAt: expect.any(Date) },
    });
    expect(result.status).toBe(GoalStatus.COMPLETED);
  });

  it('retries a serializable domain mutation after a write conflict', async () => {
    const { service, prisma, transaction } = createService();
    prisma.$transaction.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('write conflict', {
        code: 'P2034',
        clientVersion: '7.9.1',
      }),
    );
    transaction.goal.findFirst
      .mockResolvedValueOnce({ id: goalId, archivedAt: null })
      .mockResolvedValueOnce({ ...selectedGoal, archivedAt: updatedAt });

    await expect(service.archive(userId, goalId)).resolves.toMatchObject({
      id: goalId,
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(2);
    expect(prisma.$transaction).toHaveBeenLastCalledWith(expect.any(Function), {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  });
});
