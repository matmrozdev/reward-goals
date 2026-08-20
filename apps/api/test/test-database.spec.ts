import { assertSafeTestDatabase } from './test-database';

describe('assertSafeTestDatabase', () => {
  const originalNodeEnvironment = process.env.NODE_ENV;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnvironment;
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('accepts an explicitly named test database in test mode', () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/reward_goals_test';

    expect(() => assertSafeTestDatabase()).not.toThrow();
  });

  it.each([
    [
      'development mode',
      'development',
      'postgresql://localhost/reward_goals_test',
    ],
    ['a development database', 'test', 'postgresql://localhost/reward_goals'],
    [
      'a production database',
      'test',
      'postgresql://localhost/reward_goals_prod',
    ],
  ])('refuses cleanup in %s', (_case, nodeEnvironment, databaseUrl) => {
    process.env.NODE_ENV = nodeEnvironment;
    process.env.DATABASE_URL = databaseUrl;

    expect(() => assertSafeTestDatabase()).toThrow();
  });
});
