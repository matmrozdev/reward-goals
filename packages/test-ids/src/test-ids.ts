import testIds from './test-ids.json';

export { testIds };

export const createScopedTestId = (baseId: string, scope: string) =>
  `${baseId}.${scope}`;
