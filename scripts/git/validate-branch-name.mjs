import { spawnSync } from 'node:child_process';

const protectedBranches = new Set(['main', 'master', 'develop']);
const branchPattern =
  /^(feat|fix|chore|refactor|docs|test|ci|perf|build|revert)\/[1-9][0-9]*-[a-z0-9]+(?:-[a-z0-9]+)*$/;

function currentBranch() {
  const result = spawnSync('git', ['branch', '--show-current'], {
    encoding: 'utf8',
  });

  if (result.status !== 0 || (!result.stdout && result.error)) {
    const detail =
      result.stderr?.trim() || result.error?.message || 'unknown error';
    throw new Error(`Unable to read the current Git branch: ${detail}`);
  }

  return result.stdout.trim();
}

const branch = process.argv[2] ?? currentBranch();

if (!branch) {
  console.error(
    'Cannot validate a detached HEAD. Check out a named branch before pushing.',
  );
  process.exit(1);
}

if (protectedBranches.has(branch) || branchPattern.test(branch)) {
  console.log(`Branch name is valid: ${branch}`);
  process.exit(0);
}

console.error(`Invalid branch name: ${branch}`);
console.error('Expected: <type>/<issue-number>-<short-description>');
console.error('Example: chore/4-configure-eslint-and-prettier');
process.exit(1);
