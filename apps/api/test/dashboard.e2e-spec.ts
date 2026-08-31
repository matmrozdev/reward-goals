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

describe('Dashboard API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const password = 'correct horse battery staple';

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

  it('returns owned date-aware Goals and the nearest locked Reward', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');
    const otherUser = await createAuthenticatedUser('other@example.com');
    const mondayGoal = await createGoal(owner.accessToken, {
      title: 'Monday reading',
      targetValue: 20,
      scheduleDays: [Weekday.MONDAY],
      scheduledTimeMinutes: 420,
      reward: { title: 'New book', requiredProgress: 10 },
    });
    const unscheduledGoal = await createGoal(owner.accessToken, {
      title: 'Anytime journal',
      targetValue: 5,
      reward: { title: 'Movie night', requiredProgress: 3 },
    });
    const completedTodayGoal = await createGoal(owner.accessToken, {
      title: 'Tuesday workout completed Monday',
      targetValue: 1,
      scheduleDays: [Weekday.TUESDAY],
    });
    const excludedTuesdayGoal = await createGoal(owner.accessToken, {
      title: 'Tuesday only',
      scheduleDays: [Weekday.TUESDAY],
    });
    const archivedGoal = await createGoal(owner.accessToken, {
      title: 'Archived',
    });
    const abandonedGoal = await createGoal(owner.accessToken, {
      title: 'Abandoned',
    });
    await createGoal(otherUser.accessToken, {
      title: 'Foreign Goal',
      reward: { title: 'Foreign Reward', requiredProgress: 1 },
    });

    const activeMondayProgress = await prisma.goalProgressEntry.create({
      data: {
        goalId: mondayGoal.id,
        createdAt: new Date('2026-08-31T06:00:00.000Z'),
      },
    });
    await prisma.goalProgressEntry.create({
      data: {
        goalId: mondayGoal.id,
        createdAt: new Date('2026-08-31T07:00:00.000Z'),
        undoneAt: new Date('2026-08-31T08:00:00.000Z'),
      },
    });
    await prisma.goalProgressEntry.createMany({
      data: [
        {
          goalId: unscheduledGoal.id,
          createdAt: new Date('2026-08-31T09:00:00.000Z'),
        },
        {
          goalId: unscheduledGoal.id,
          createdAt: new Date('2026-08-31T10:00:00.000Z'),
        },
        {
          goalId: completedTodayGoal.id,
          createdAt: new Date('2026-08-31T11:00:00.000Z'),
        },
      ],
    });
    await prisma.goal.update({
      where: { id: completedTodayGoal.id },
      data: { status: GoalStatus.COMPLETED },
    });
    await request(app.getHttpServer())
      .post(`/goals/${archivedGoal.id}/archive`)
      .set(bearer(owner.accessToken))
      .expect(200);
    await request(app.getHttpServer())
      .post(`/goals/${abandonedGoal.id}/abandon`)
      .set(bearer(owner.accessToken))
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/dashboard')
      .query({ date: '2026-08-31', timeZone: 'Europe/Warsaw' })
      .set(bearer(owner.accessToken))
      .expect(200);

    expect(response.body.today).toMatchObject({
      date: '2026-08-31',
      completedCount: 3,
      totalCount: 3,
    });
    expect(response.body.today.goals).toHaveLength(3);
    expect(response.body.today.goals).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: excludedTuesdayGoal.id }),
        expect.objectContaining({ id: archivedGoal.id }),
        expect.objectContaining({ id: abandonedGoal.id }),
      ]),
    );
    expect(
      response.body.today.goals.find(
        ({ id }: { id: string }) => id === mondayGoal.id,
      ),
    ).toMatchObject({
      progressCount: 1,
      hasProgressToday: true,
      latestTodayProgressEntryId: activeMondayProgress.id,
      scheduledTimeMinutes: 420,
    });
    expect(response.body.rewardPreview).toMatchObject({
      goalId: unscheduledGoal.id,
      title: 'Movie night',
      currentProgress: 2,
      requiredProgress: 3,
      remainingProgress: 1,
      unlockedAt: null,
    });
  });

  it('returns an empty stable response without leaking another user data', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');
    const otherUser = await createAuthenticatedUser('other@example.com');
    await createGoal(otherUser.accessToken, {
      title: 'Foreign Goal',
      reward: { title: 'Foreign Reward', requiredProgress: 1 },
    });

    await request(app.getHttpServer())
      .get('/dashboard')
      .query({ date: '2026-08-31', timeZone: 'UTC' })
      .set(bearer(owner.accessToken))
      .expect(200)
      .expect({
        today: {
          date: '2026-08-31',
          completedCount: 0,
          totalCount: 0,
          goals: [],
        },
        rewardPreview: null,
      });
  });

  it('rejects unauthenticated and invalid Dashboard requests', async () => {
    const owner = await createAuthenticatedUser('owner@example.com');

    await request(app.getHttpServer())
      .get('/dashboard')
      .query({ date: '2026-08-31', timeZone: 'UTC' })
      .expect(401);
    await request(app.getHttpServer())
      .get('/dashboard')
      .query({ date: '2026-02-30', timeZone: 'UTC' })
      .set(bearer(owner.accessToken))
      .expect(400);
    await request(app.getHttpServer())
      .get('/dashboard')
      .query({ date: '2026-08-31', timeZone: 'Not/A_Time_Zone' })
      .set(bearer(owner.accessToken))
      .expect(400);
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
      userId: registration.body.user.id as string,
      accessToken: login.body.accessToken as string,
    };
  }

  async function createGoal(accessToken: string, body: object) {
    const response = await request(app.getHttpServer())
      .post('/goals')
      .set(bearer(accessToken))
      .send(body)
      .expect(201);

    return response.body.goal as { id: string };
  }

  function bearer(accessToken: string) {
    return { Authorization: `Bearer ${accessToken}` };
  }
});
