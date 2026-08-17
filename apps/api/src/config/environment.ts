export const nodeEnvironments = ['development', 'test', 'production'] as const;

export type NodeEnvironment = (typeof nodeEnvironments)[number];

export interface ApiEnvironment {
  nodeEnv: NodeEnvironment;
  host: string;
  port: number;
  databaseUrl: string;
}

type Environment = Record<string, string | undefined>;

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
  };
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
