import { validateEnvironment } from './environment';

describe('validateEnvironment', () => {
  const validEnvironment = {
    NODE_ENV: 'development',
    HOST: '0.0.0.0',
    PORT: '3000',
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/reward_goals',
    ACCESS_TOKEN_SECRET:
      'development-access-token-secret-at-least-32-characters',
    ACCESS_TOKEN_TTL_SECONDS: '900',
    REFRESH_TOKEN_SECRET:
      'development-refresh-token-secret-at-least-32-characters',
    REFRESH_TOKEN_TTL_SECONDS: '2592000',
  };

  it('returns parsed environment values', () => {
    expect(validateEnvironment(validEnvironment)).toEqual({
      nodeEnv: 'development',
      host: '0.0.0.0',
      port: 3000,
      databaseUrl: 'postgresql://postgres:postgres@localhost:5432/reward_goals',
      accessTokenSecret:
        'development-access-token-secret-at-least-32-characters',
      accessTokenTtlSeconds: 900,
      refreshTokenSecret:
        'development-refresh-token-secret-at-least-32-characters',
      refreshTokenTtlSeconds: 2592000,
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
        '- ACCESS_TOKEN_SECRET is required',
        '- ACCESS_TOKEN_TTL_SECONDS is required',
        '- REFRESH_TOKEN_SECRET is required',
        '- REFRESH_TOKEN_TTL_SECONDS is required',
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
    [
      { ACCESS_TOKEN_TTL_SECONDS: '0' },
      'ACCESS_TOKEN_TTL_SECONDS must be a positive integer',
    ],
    [
      { REFRESH_TOKEN_TTL_SECONDS: 'one day' },
      'REFRESH_TOKEN_TTL_SECONDS must be a positive integer',
    ],
    [
      {
        REFRESH_TOKEN_SECRET:
          'development-access-token-secret-at-least-32-characters',
      },
      'ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must differ',
    ],
    [
      { ACCESS_TOKEN_SECRET: 'weak-secret' },
      'ACCESS_TOKEN_SECRET must contain at least 32 characters',
    ],
    [
      {
        REFRESH_TOKEN_SECRET:
          'replace-with-a-different-long-random-refresh-token-secret',
      },
      'REFRESH_TOKEN_SECRET must replace the committed example placeholder',
    ],
  ])('rejects invalid values', (override, message) => {
    expect(() =>
      validateEnvironment({ ...validEnvironment, ...override }),
    ).toThrow(message);
  });
});
