import { resolve } from 'node:path';
import type { PrismaService } from '../src/prisma/prisma.service';

export function prepareTestEnvironment(): void {
  try {
    process.loadEnvFile(resolve(__dirname, '..', '.env.test'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  const testDatabaseUrl = process.env.TEST_DATABASE_URL;

  if (!testDatabaseUrl) {
    throw new Error(
      'TEST_DATABASE_URL is required; copy apps/api/test.env.example to apps/api/.env.test',
    );
  }

  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = testDatabaseUrl;
  process.env.HOST ??= '127.0.0.1';
  process.env.PORT ??= '3001';
  process.env.ACCESS_TOKEN_SECRET ??=
    'test-only-access-token-secret-at-least-32-characters';
  process.env.ACCESS_TOKEN_TTL_SECONDS ??= '900';
  process.env.REFRESH_TOKEN_SECRET ??=
    'test-only-refresh-token-secret-at-least-32-characters';
  process.env.REFRESH_TOKEN_TTL_SECONDS ??= '2592000';

  assertSafeTestDatabase();
}

export function assertSafeTestDatabase(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Database cleanup is allowed only when NODE_ENV=test');
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for authentication E2E tests');
  }

  const databaseName = decodeURIComponent(new URL(databaseUrl).pathname)
    .replace(/^\//, '')
    .toLowerCase();

  if (!/(^|[-_])test($|[-_])/.test(databaseName)) {
    throw new Error(
      `Refusing to use non-test database "${databaseName}" for authentication E2E tests`,
    );
  }
}

export async function clearTestDatabase(prisma: PrismaService): Promise<void> {
  assertSafeTestDatabase();
  await prisma.user.deleteMany();
}
