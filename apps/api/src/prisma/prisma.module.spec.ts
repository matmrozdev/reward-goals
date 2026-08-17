import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

@Injectable()
class PrismaConsumer {
  constructor(readonly prisma: PrismaService) {}
}

describe('PrismaModule', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(() => {
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/reward_goals';
  });

  afterAll(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
      return;
    }

    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('exports PrismaService for dependency injection', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaConsumer],
    }).compile();

    const consumer = moduleRef.get(PrismaConsumer);

    expect(consumer.prisma).toBe(moduleRef.get(PrismaService));

    await moduleRef.close();
  });
});
