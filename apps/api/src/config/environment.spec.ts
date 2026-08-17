import { validateEnvironment } from './environment';

describe('validateEnvironment', () => {
  const validEnvironment = {
    NODE_ENV: 'development',
    HOST: '0.0.0.0',
    PORT: '3000',
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/reward_goals',
  };

  it('returns parsed environment values', () => {
    expect(validateEnvironment(validEnvironment)).toEqual({
      nodeEnv: 'development',
      host: '0.0.0.0',
      port: 3000,
      databaseUrl: 'postgresql://postgres:postgres@localhost:5432/reward_goals',
    });
  });

  it('reports all missing required variables', () => {
    expect(() => validateEnvironment({})).toThrow(
      [
        'Invalid environment configuration:',
        '- NODE_ENV is required',
        '- HOST is required',
        '- PORT is required',
        '- DATABASE_URL is required',
      ].join('\n'),
    );
  });

  it.each([
    [
      { NODE_ENV: 'staging' },
      'NODE_ENV must be one of: development, test, production',
    ],
    [{ PORT: '70000' }, 'PORT must be an integer between 1 and 65535'],
    [
      { DATABASE_URL: 'https://localhost/reward_goals' },
      'DATABASE_URL must be a valid PostgreSQL connection URL',
    ],
  ])('rejects invalid values', (override, message) => {
    expect(() =>
      validateEnvironment({ ...validEnvironment, ...override }),
    ).toThrow(message);
  });
});
