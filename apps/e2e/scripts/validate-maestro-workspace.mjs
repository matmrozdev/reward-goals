import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAllDocuments } from 'yaml';

const require = createRequire(import.meta.url);
const testIds = require('@reward-goals/test-ids/test-ids.json');
const workspaceDirectory = fileURLToPath(
  new URL('../maestro', import.meta.url),
);
const flowDirectory = join(workspaceDirectory, 'flows');
const testIdPattern = /\$\{(TEST_ID_[A-Z0-9_]+)\}/g;

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

const listYamlFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listYamlFiles(path);
    }

    return ['.yaml', '.yml'].includes(extname(entry.name)) ? [path] : [];
  });

const testIdEntries = flattenTestIds(testIds);
const testIdEnvironmentNames = new Set(testIdEntries.map(([name]) => name));
const testIdValues = testIdEntries.map(([, value]) => value);

if (new Set(testIdValues).size !== testIdValues.length) {
  throw new Error('Every E2E test ID must be unique.');
}

for (const file of listYamlFiles(workspaceDirectory)) {
  const source = readFileSync(file, 'utf8');
  const documents = parseAllDocuments(source);
  const errors = documents.flatMap((document) => document.errors);

  if (errors.length > 0) {
    throw new Error(
      `${relative(workspaceDirectory, file)} contains invalid YAML: ${errors.join(', ')}`,
    );
  }

  for (const match of source.matchAll(testIdPattern)) {
    if (!testIdEnvironmentNames.has(match[1])) {
      throw new Error(
        `${relative(workspaceDirectory, file)} references unknown ${match[1]}.`,
      );
    }
  }
}

const flowFiles = listYamlFiles(flowDirectory);

for (const file of flowFiles) {
  const [metadataDocument, commandsDocument] = parseAllDocuments(
    readFileSync(file, 'utf8'),
  );
  const metadata = metadataDocument?.toJS();
  const commands = commandsDocument?.toJS();
  const relativePath = relative(workspaceDirectory, file);

  if (!metadata?.appId || !metadata?.name) {
    throw new Error(`${relativePath} must define appId and name metadata.`);
  }

  if (!metadata.tags?.includes('critical')) {
    throw new Error(`${relativePath} must keep the critical-flow tag.`);
  }

  if (!Array.isArray(commands) || commands.length === 0) {
    throw new Error(`${relativePath} must contain Maestro commands.`);
  }

  const launchCommand = commands.find((command) => command.launchApp);

  if (launchCommand?.launchApp?.clearState !== true) {
    throw new Error(`${relativePath} must launch with clearState: true.`);
  }
}

console.log(
  `Validated ${flowFiles.length} Maestro flows and ${testIdEntries.length} test IDs.`,
);
