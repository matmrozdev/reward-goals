import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const testIds = require('@reward-goals/test-ids/test-ids.json');
const maestroBinary = process.env.MAESTRO_BIN ?? 'maestro';
const apiUrl = process.env.MAESTRO_API_URL ?? 'http://localhost:3000';
const expectedVersion = readFileSync(
  new URL('../.maestro-version', import.meta.url),
  'utf8',
).trim();
const workspaceDirectory = fileURLToPath(
  new URL('../maestro', import.meta.url),
);
const configFile = fileURLToPath(
  new URL('../maestro/config.yaml', import.meta.url),
);
const localApiHosts = new Set(['127.0.0.1', '::1', 'localhost']);

if (
  !localApiHosts.has(new URL(apiUrl).hostname) &&
  process.env.MAESTRO_ALLOW_REMOTE_API !== 'true'
) {
  console.error(
    'Refusing to create E2E data on a remote API. Set MAESTRO_ALLOW_REMOTE_API=true only for an approved disposable test or staging environment.',
  );
  process.exit(1);
}

const toEnvironmentName = (path) =>
  `TEST_ID_${path
    .join('_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toUpperCase()}`;

const flattenTestIds = (value, path = []) =>
  Object.entries(value).flatMap(([key, child]) => {
    const childPath = [...path, key];

    return typeof child === 'string'
      ? [[toEnvironmentName(childPath), child]]
      : flattenTestIds(child, childPath);
  });

const versionResult = spawnSync(maestroBinary, ['--version'], {
  encoding: 'utf8',
});

if (versionResult.error?.code === 'ENOENT') {
  console.error(
    'Maestro CLI is not installed. Follow apps/e2e/README.md before running the suite.',
  );
  process.exit(1);
}

if (versionResult.status !== 0) {
  process.stderr.write(
    versionResult.stderr ?? 'Unable to read Maestro version.',
  );
  process.exit(versionResult.status ?? 1);
}

const installedVersion = versionResult.stdout.trim();

if (!installedVersion.includes(expectedVersion)) {
  console.error(
    `Maestro ${expectedVersion} is required, but ${installedVersion || 'an unknown version'} is installed.`,
  );
  process.exit(1);
}

const environmentArguments = flattenTestIds(testIds).flatMap(
  ([name, value]) => ['-e', `${name}=${value}`],
);
const optionalEnvironment = [
  ['APP_ID', process.env.MAESTRO_APP_ID],
  ['API_URL', apiUrl],
  ['E2E_PASSWORD', process.env.MAESTRO_E2E_PASSWORD],
];

for (const [name, value] of optionalEnvironment) {
  if (value) {
    environmentArguments.push('-e', `${name}=${value}`);
  }
}

const result = spawnSync(
  maestroBinary,
  [
    'test',
    '--config',
    configFile,
    ...environmentArguments,
    ...process.argv.slice(2),
    workspaceDirectory,
  ],
  { stdio: 'inherit' },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
