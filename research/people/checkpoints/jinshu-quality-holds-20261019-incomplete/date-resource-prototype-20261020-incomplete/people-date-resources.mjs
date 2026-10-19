// Research prototype: this does not change the data, queue, lock or Git root.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const digest = /^[a-f0-9]{64}$/u;

function readRegular(file) {
  if (!fs.lstatSync(file).isFile()) throw new Error(`Resource is not a regular file: ${file}`);
  return fs.readFileSync(file);
}

// Null preserves the current production behavior. The manifest's own digest
// must be supplied out-of-band: a bundle must not choose its own trust anchor.
export function loadPinnedDateResources(env = process.env) {
  const root = env.PEOPLE_DATE_RESOURCE_ROOT;
  const expected = env.PEOPLE_DATE_RESOURCE_MANIFEST_SHA256;
  if (root === undefined && expected === undefined) return null;
  if (!root || !path.isAbsolute(root) || !digest.test(expected ?? '')) {
    throw new Error('Date resource root and manifest SHA-256 are both required; root must be absolute');
  }
  const manifestBytes = readRegular(path.join(root, 'manifest.json'));
  if (sha256(manifestBytes) !== expected) throw new Error('Date resource manifest digest mismatch');
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  if (!manifest || Array.isArray(manifest) || Object.keys(manifest).sort().join(',') !== 'datePromptSha256,schemaVersion,schemas' ||
      manifest.schemaVersion !== 1 || !digest.test(manifest.datePromptSha256 ?? '') || !Array.isArray(manifest.schemas) || !manifest.schemas.length) {
    throw new Error('Invalid date resource manifest');
  }
  const schemaDir = path.join(root, 'schema');
  const expectedNames = new Set();
  for (const item of manifest.schemas) {
    if (!item || Array.isArray(item) || Object.keys(item).sort().join(',') !== 'name,sha256' ||
        !/^[a-z0-9-]+\.schema\.json$/u.test(item.name ?? '') || !digest.test(item.sha256 ?? '') || expectedNames.has(item.name)) {
      throw new Error('Invalid or duplicate schema manifest entry');
    }
    expectedNames.add(item.name);
  }
  const actualNames = fs.readdirSync(schemaDir).filter(name => name.endsWith('.schema.json')).sort();
  if (JSON.stringify(actualNames) !== JSON.stringify([...expectedNames].sort())) throw new Error('Date schema resource set mismatch');
  const schemas = manifest.schemas.map(({ name, sha256: expectedHash }) => {
    const bytes = readRegular(path.join(schemaDir, name));
    if (sha256(bytes) !== expectedHash) throw new Error(`Date schema digest mismatch: ${name}`);
    return { name, document: JSON.parse(bytes.toString('utf8')) };
  });
  const promptBytes = readRegular(path.join(root, 'prompt-people-date-review.txt'));
  if (sha256(promptBytes) !== manifest.datePromptSha256) throw new Error('Date prompt digest mismatch');
  return { schemas, prompt: promptBytes.toString('utf8') };
}

// Both consumers receive the same checked snapshots for the process lifetime.
export const pinnedDateResources = loadPinnedDateResources();
