export const nodeEnvironments = ['development', 'test', 'production'] as const;

export type NodeEnvironment = (typeof nodeEnvironments)[number];

export interface ApiEnvironment {
  nodeEnv: NodeEnvironment;
  host: string;
  port: number;
  databaseUrl: string;
  accessTokenSecret: string;
  accessTokenTtlSeconds: number;
  refreshTokenSecret: string;
  refreshTokenTtlSeconds: number;
}

type Environment = Record<string, string | undefined>;

const minimumSigningSecretLength = 32;
const exampleSigningSecrets = new Set([
  'replace-with-a-long-random-access-token-secret',
  'replace-with-a-different-long-random-refresh-token-secret',
]);

export function loadEnvironment(): ApiEnvironment {
  try {
    process.loadEnvFile();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  return validateEnvironment(process.env);
}

export function validateEnvironment(environment: Environment): ApiEnvironment {
  const errors: string[] = [];
  const nodeEnv = requiredValue(environment, 'NODE_ENV', errors);
  const host = requiredValue(environment, 'HOST', errors);
  const portValue = requiredValue(environment, 'PORT', errors);
  const databaseUrl = requiredValue(environment, 'DATABASE_URL', errors);
  const accessTokenSecret = requiredValue(
    environment,
    'ACCESS_TOKEN_SECRET',
    errors,
  );
  const accessTokenTtlValue = requiredValue(
    environment,
    'ACCESS_TOKEN_TTL_SECONDS',
    errors,
  );
  const refreshTokenSecret = requiredValue(
    environment,
    'REFRESH_TOKEN_SECRET',
    errors,
  );
  const refreshTokenTtlValue = requiredValue(
    environment,
    'REFRESH_TOKEN_TTL_SECONDS',
    errors,
  );

  if (nodeEnv && !nodeEnvironments.includes(nodeEnv as NodeEnvironment)) {
    errors.push(`NODE_ENV must be one of: ${nodeEnvironments.join(', ')}`);
  }

  const port = Number(portValue);
  if (portValue && (!Number.isInteger(port) || port < 1 || port > 65_535)) {
    errors.push('PORT must be an integer between 1 and 65535');
  }

  if (databaseUrl && !isPostgresUrl(databaseUrl)) {
    errors.push('DATABASE_URL must be a valid PostgreSQL connection URL');
  }

  const accessTokenTtlSeconds = positiveInteger(
    accessTokenTtlValue,
    'ACCESS_TOKEN_TTL_SECONDS',
    errors,
  );
  const refreshTokenTtlSeconds = positiveInteger(
    refreshTokenTtlValue,
    'REFRESH_TOKEN_TTL_SECONDS',
    errors,
  );

  validateSigningSecret(accessTokenSecret, 'ACCESS_TOKEN_SECRET', errors);
  validateSigningSecret(refreshTokenSecret, 'REFRESH_TOKEN_SECRET', errors);

  if (
    accessTokenSecret &&
    refreshTokenSecret &&
    accessTokenSecret === refreshTokenSecret
  ) {
    errors.push('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must differ');
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n- ${errors.join('\n- ')}`,
    );
  }

  return {
    nodeEnv: nodeEnv as NodeEnvironment,
    host,
    port,
    databaseUrl,
    accessTokenSecret,
    accessTokenTtlSeconds,
    refreshTokenSecret,
    refreshTokenTtlSeconds,
  };
}

function validateSigningSecret(
  value: string,
  name: string,
  errors: string[],
): void {
  if (!value) {
    return;
  }

  if (value.length < minimumSigningSecretLength) {
    errors.push(
      `${name} must contain at least ${minimumSigningSecretLength} characters`,
    );
  }

  if (exampleSigningSecrets.has(value)) {
    errors.push(`${name} must replace the committed example placeholder`);
  }
}

function positiveInteger(
  value: string,
  name: string,
  errors: string[],
): number {
  const parsed = Number(value);

  if (value && (!Number.isSafeInteger(parsed) || parsed < 1)) {
    errors.push(`${name} must be a positive integer`);
  }

  return parsed;
}

function requiredValue(
  environment: Environment,
  name: string,
  errors: string[],
): string {
  const value = environment[name]?.trim();

  if (!value) {
    errors.push(`${name} is required`);
    return '';
  }

  return value;
}

function isPostgresUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      (url.protocol === 'postgres:' || url.protocol === 'postgresql:') &&
      Boolean(url.hostname) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}
