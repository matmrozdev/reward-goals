import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApplication } from '../src/app.bootstrap';
import { AppModule } from '../src/app.module';
import { GoalStatus, Weekday } from '../src/generated/prisma/enums';
import { PrismaService } from '../src/prisma/prisma.service';
import { clearTestDatabase } from './test-database';

jest.setTimeout(30_000);

describe('Goals API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'correct horse battery staple';
  const missingGoalId = '00000000-0000-4000-8000-000000000001';
  const missingProgressEntryId = '00000000-0000-4000-8000-000000000002';

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await clearTestDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it('persists an owned finite Goal with canonical weekdays and a reward', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');

    const response = await createGoal(owner.accessToken, {
      title: 'Read consistently',
      description: 'Complete focused reading sessions.',
      targetValue: 3,
      scheduleDays: [Weekday.SUNDAY, Weekday.MONDAY, Weekday.WEDNESDAY],
      reward: { title: 'Enjoy a new book', requiredProgress: 2 },
    });

    expect(response.body.goal).toEqual({
      id: expect.any(String),
      title: 'Read consistently',
      description: 'Complete focused reading sessions.',
      measurementType: 'COUNT',
      targetValue: 3,
      scheduleDays: [Weekday.MONDAY, Weekday.WEDNESDAY, Weekday.SUNDAY],
      status: GoalStatus.ACTIVE,
      archivedAt: null,
      progressCount: 0,
      reward: {
        id: expect.any(String),
        title: 'Enjoy a new book',
        requiredProgress: 2,
        unlockedAt: null,
      },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(response.body.goal).not.toHaveProperty('userId');

    const storedGoal = await prisma.goal.findUnique({
      where: { id: response.body.goal.id },
      include: { reward: true },
    });
    expect(storedGoal).toMatchObject({
      userId: owner.userId,
      scheduleDays: [Weekday.MONDAY, Weekday.WEDNESDAY, Weekday.SUNDAY],
      reward: { requiredProgress: 2, unlockedAt: null },
    });
  });

  it('lists and retrieves only the authenticated user’s Goals', async () => {
    const userA = await createAuthenticatedUser('user-a@example.com');
    const userB = await createAuthenticatedUser('user-b@example.com');
    const userAGoal = await createGoal(userA.accessToken, {
      title: 'User A Goal',
    });
    await createGoal(userB.accessToken, { title: 'User B Goal' });

    const listResponse = await request(app.getHttpServer())
      .get('/goals')
      .set(bearer(userA.accessToken))
      .expect(200);
    expect(listResponse.body.goals).toHaveLength(1);
    expect(listResponse.body.goals[0].id).toBe(userAGoal.body.goal.id);

    await request(app.getHttpServer())
      .get(`/goals/${userAGoal.body.goal.id}`)
      .set(bearer(userA.accessToken))
      .expect(200)
      .expect(({ body }) => {
        expect(body.goal.title).toBe('User A Goal');
      });
  });

  it('persists editable presentation fields and freezes core semantics after progress', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');
    const created = await createGoal(owner.accessToken, {
      title: 'Initial title',
      targetValue: 3,
      reward: { title: 'Reward', requiredProgress: 2 },
    });
    const goalId = created.body.goal.id;

    const updated = await request(app.getHttpServer())
      .patch(`/goals/${goalId}`)
      .set(bearer(owner.accessToken))
      .send({
        title: 'Updated title',
        description: 'Updated description',
        scheduleDays: [Weekday.FRIDAY, Weekday.TUESDAY],
      })
      .expect(200);
    expect(updated.body.goal).toMatchObject({
      title: 'Updated title',
      description: 'Updated description',
      scheduleDays: [Weekday.TUESDAY, Weekday.FRIDAY],
    });

    await addProgress(owner.accessToken, goalId);
    await request(app.getHttpServer())
      .patch(`/goals/${goalId}`)
      .set(bearer(owner.accessToken))
      .send({ targetValue: 4 })
      .expect(400);

    const persisted = await prisma.goal.findUniqueOrThrow({
      where: { id: goalId },
    });
    expect(persisted).toMatchObject({
      title: 'Updated title',
      targetValue: 3,
      scheduleDays: [Weekday.TUESDAY, Weekday.FRIDAY],
    });
  });

  it('derives finite completion and reward state from persisted progress and undo', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');
    const created = await createGoal(owner.accessToken, {
      title: 'Read three times',
      targetValue: 3,
      reward: { title: 'New book', requiredProgress: 2 },
    });
    const goalId = created.body.goal.id;

    await addProgress(owner.accessToken, goalId);
    const second = await addProgress(owner.accessToken, goalId);
    expect(second.body.goal).toMatchObject({
      progressCount: 2,
      status: GoalStatus.ACTIVE,
      reward: { unlockedAt: expect.any(String) },
    });

    const third = await addProgress(owner.accessToken, goalId);
    expect(third.body.goal).toMatchObject({
      progressCount: 3,
      status: GoalStatus.COMPLETED,
    });
    await addProgress(owner.accessToken, goalId, 400);

    const reopened = await undoProgress(
      owner.accessToken,
      goalId,
      third.body.progressEntry.id,
    );
    expect(reopened.body.goal).toMatchObject({
      progressCount: 2,
      status: GoalStatus.ACTIVE,
      reward: { unlockedAt: expect.any(String) },
    });

    const relocked = await undoProgress(
      owner.accessToken,
      goalId,
      second.body.progressEntry.id,
    );
    expect(relocked.body.goal).toMatchObject({
      progressCount: 1,
      status: GoalStatus.ACTIVE,
      reward: { unlockedAt: null },
    });

    const entries = await prisma.goalProgressEntry.findMany({
      where: { goalId },
      orderBy: { createdAt: 'asc' },
    });
    expect(entries).toHaveLength(3);
    expect(entries.filter(({ undoneAt }) => undoneAt !== null)).toHaveLength(2);
  });

  it('keeps ongoing Goals active until explicitly completed', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');
    const created = await createGoal(owner.accessToken, {
      title: 'Practice indefinitely',
      targetValue: null,
      reward: { title: 'Celebrate ten sessions', requiredProgress: 10 },
    });
    const goalId = created.body.goal.id;

    const progress = await addProgress(owner.accessToken, goalId);
    expect(progress.body.goal).toMatchObject({
      targetValue: null,
      progressCount: 1,
      status: GoalStatus.ACTIVE,
    });

    const completed = await request(app.getHttpServer())
      .post(`/goals/${goalId}/complete`)
      .set(bearer(owner.accessToken))
      .expect(200);
    expect(completed.body.goal.status).toBe(GoalStatus.COMPLETED);
  });

  it('keeps archival independent and rejects invalid lifecycle operations', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');
    const created = await createGoal(owner.accessToken, {
      title: 'Archive independently',
    });
    const goalId = created.body.goal.id;

    const archived = await request(app.getHttpServer())
      .post(`/goals/${goalId}/archive`)
      .set(bearer(owner.accessToken))
      .expect(200);
    expect(archived.body.goal).toMatchObject({
      status: GoalStatus.ACTIVE,
      archivedAt: expect.any(String),
    });
    await addProgress(owner.accessToken, goalId, 400);

    const unarchived = await request(app.getHttpServer())
      .post(`/goals/${goalId}/unarchive`)
      .set(bearer(owner.accessToken))
      .expect(200);
    expect(unarchived.body.goal.archivedAt).toBeNull();

    const abandoned = await request(app.getHttpServer())
      .post(`/goals/${goalId}/abandon`)
      .set(bearer(owner.accessToken))
      .expect(200);
    expect(abandoned.body.goal.status).toBe(GoalStatus.ABANDONED);
    await addProgress(owner.accessToken, goalId, 400);
    await request(app.getHttpServer())
      .post(`/goals/${goalId}/complete`)
      .set(bearer(owner.accessToken))
      .expect(400);
  });

  it('rejects unauthenticated access to every Goal endpoint', async () => {
    const cases = [
      () => request(app.getHttpServer()).post('/goals').send({ title: 'Goal' }),
      () => request(app.getHttpServer()).get('/goals'),
      () => request(app.getHttpServer()).get(`/goals/${missingGoalId}`),
      () =>
        request(app.getHttpServer())
          .patch(`/goals/${missingGoalId}`)
          .send({ title: 'Updated' }),
      () =>
        request(app.getHttpServer()).post(`/goals/${missingGoalId}/archive`),
      () =>
        request(app.getHttpServer()).post(`/goals/${missingGoalId}/unarchive`),
      () =>
        request(app.getHttpServer()).post(`/goals/${missingGoalId}/abandon`),
      () =>
        request(app.getHttpServer()).post(`/goals/${missingGoalId}/complete`),
      () =>
        request(app.getHttpServer()).post(`/goals/${missingGoalId}/progress`),
      () =>
        request(app.getHttpServer()).post(
          `/goals/${missingGoalId}/progress/${missingProgressEntryId}/undo`,
        ),
    ];

    for (const performRequest of cases) {
      await performRequest().expect(401);
    }
  });

  it('rejects invalid and server-owned input', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');

    for (const body of [
      { title: '   ' },
      { title: 'Goal', targetValue: 0 },
      {
        title: 'Goal',
        scheduleDays: [Weekday.MONDAY, Weekday.MONDAY],
      },
      {
        title: 'Goal',
        targetValue: 2,
        reward: { title: 'R', requiredProgress: 3 },
      },
      { title: 'Goal', userId: owner.userId },
      { title: 'Goal', status: GoalStatus.COMPLETED },
      { title: 'Goal', archivedAt: new Date().toISOString() },
    ]) {
      await request(app.getHttpServer())
        .post('/goals')
        .set(bearer(owner.accessToken))
        .send(body)
        .expect(400);
    }

    await request(app.getHttpServer())
      .get('/goals/not-a-uuid')
      .set(bearer(owner.accessToken))
      .expect(400);
  });

  it('returns identical not-found behavior for missing and foreign-owned Goals', async () => {
    const userA = await createAuthenticatedUser('user-a@example.com');
    const userB = await createAuthenticatedUser('user-b@example.com');
    const foreignGoal = await createGoal(userB.accessToken, {
      title: 'User B Goal',
      targetValue: 3,
    });
    const foreignProgress = await addProgress(
      userB.accessToken,
      foreignGoal.body.goal.id,
    );

    for (const target of [
      {
        goalId: foreignGoal.body.goal.id,
        progressEntryId: foreignProgress.body.progressEntry.id,
      },
      { goalId: missingGoalId, progressEntryId: missingProgressEntryId },
    ]) {
      const cases = [
        () => request(app.getHttpServer()).get(`/goals/${target.goalId}`),
        () =>
          request(app.getHttpServer())
            .patch(`/goals/${target.goalId}`)
            .send({ title: 'Unauthorized update' }),
        () =>
          request(app.getHttpServer()).post(`/goals/${target.goalId}/archive`),
        () =>
          request(app.getHttpServer()).post(
            `/goals/${target.goalId}/unarchive`,
          ),
        () =>
          request(app.getHttpServer()).post(`/goals/${target.goalId}/abandon`),
        () =>
          request(app.getHttpServer()).post(`/goals/${target.goalId}/complete`),
        () =>
          request(app.getHttpServer()).post(`/goals/${target.goalId}/progress`),
        () =>
          request(app.getHttpServer()).post(
            `/goals/${target.goalId}/progress/${target.progressEntryId}/undo`,
          ),
      ];

      for (const performRequest of cases) {
        const response = await performRequest()
          .set(bearer(userA.accessToken))
          .expect(404);
        expect(response.body).toMatchObject({
          statusCode: 404,
          message: 'Goal not found',
        });
      }
    }
  });

  it('clears authentication and Goal relations through the guarded cleanup path', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');
    const goal = await createGoal(owner.accessToken, {
      title: 'Cleanup Goal',
      reward: { title: 'Cleanup reward', requiredProgress: 1 },
    });
    await addProgress(owner.accessToken, goal.body.goal.id);

    await clearTestDatabase(prisma);

    await expect(prisma.user.count()).resolves.toBe(0);
    await expect(prisma.goal.count()).resolves.toBe(0);
    await expect(prisma.goalProgressEntry.count()).resolves.toBe(0);
    await expect(prisma.goalReward.count()).resolves.toBe(0);
  });

  async function createAuthenticatedUser(email: string) {
    const credentials = { email, password };
    const registration = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(200);

    return {
      userId: registration.body.user.id,
      accessToken: login.body.accessToken as string,
    };
  }

  function createGoal(accessToken: string, body: object) {
    return request(app.getHttpServer())
      .post('/goals')
      .set(bearer(accessToken))
      .send(body)
      .expect(201);
  }

  function addProgress(
    accessToken: string,
    goalId: string,
    expectedStatus = 201,
  ) {
    return request(app.getHttpServer())
      .post(`/goals/${goalId}/progress`)
      .set(bearer(accessToken))
      .expect(expectedStatus);
  }

  function undoProgress(
    accessToken: string,
    goalId: string,
    progressEntryId: string,
  ) {
    return request(app.getHttpServer())
      .post(`/goals/${goalId}/progress/${progressEntryId}/undo`)
      .set(bearer(accessToken))
      .expect(200);
  }

  function bearer(accessToken: string) {
    return { Authorization: `Bearer ${accessToken}` };
  }
});
