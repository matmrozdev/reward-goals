import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { prepareTestEnvironment } from './test-database';

export default function globalSetup(): void {
  prepareTestEnvironment();
  execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
    cwd: resolve(__dirname, '..'),
    env: process.env,
    stdio: 'inherit',
  });
}
