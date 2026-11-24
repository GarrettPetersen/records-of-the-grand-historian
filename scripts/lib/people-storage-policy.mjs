import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { peopleGenerationIsRemote } from './people-generation-policy.mjs';

export function inventoryLocalPeopleRegistries(root) {
  const result = []; let visited = 0;
  function visit(directory) {
    if (++visited > 20_000) throw Error('Registry inventory exceeded directory bound; inspect growth before dispatch');
    const manifest = path.join(directory, 'manifest.json');
    if (fs.existsSync(manifest)) {
      const s = fs.lstatSync(manifest);
      if (!s.isFile() || s.isSymbolicLink() || s.size > 1024 * 1024) throw Error('Unverifiable registry manifest: ' + manifest);
      const bytes = fs.readFileSync(manifest), value = JSON.parse(bytes);
      if (value.kind === 'canonical-identity-dossier-store') {
        const files = [];
        for (const key of ['headers', 'metadata']) {
          const part = value[key];
          if (!part || !['dossiers.jsonl', 'index.jsonl'].includes(part.file)) throw Error('Invalid immutable registry file');
          const file = path.join(directory, part.file), stat = fs.lstatSync(file);
          if (!stat.isFile() || stat.isSymbolicLink() || stat.size !== part.bytes) throw Error('Immutable registry changed: ' + file);
          files.push({ file: part.file, bytes: stat.size });
        }
        result.push({ directory: path.relative(root, directory).split(path.sep).join('/'),
          manifestSha256: createHash('sha256').update(bytes).digest('hex'), files });
        return;
      }
    }
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) {
        // Existing sealed code-review packets may link individual source files.
        // Never follow them; a redirected directory could hide another registry.
        if (fs.statSync(path.join(directory, entry.name)).isFile() && entry.name !== 'manifest.json') continue;
        throw Error('Redirected local registry inventory: ' + path.join(directory, entry.name));
      }
      if (entry.isDirectory()) visit(path.join(directory, entry.name));
    }
  }
  for (const relative of ['data/people/generated/identity-dossiers', 'data/people/generated/chapter-owners']) {
    const directory = path.join(root, relative);
    if (fs.existsSync(directory)) visit(directory);
  }
  return result.sort((a, b) => a.directory.localeCompare(b.directory));
}

export function evaluatePeopleRegistryStorage(actual, policy, { allowNewFullRegistries = false } = {}) {
  if (policy.schemaVersion !== 1 || !Array.isArray(policy.retainedFullRegistries)) throw Error('Invalid storage policy');
  const retained = new Map(policy.retainedFullRegistries.map(row => [row.directory, row]));
  if (retained.size !== policy.retainedFullRegistries.length) throw Error('Duplicate storage retention entry');
  const errors = [];
  for (const row of actual) {
    const prior = retained.get(row.directory);
    if (!prior) { if (!allowNewFullRegistries) errors.push('Unbudgeted local full registry; stop new copies and use remote generation: ' + row.directory); }
    else if (prior.manifestSha256 !== row.manifestSha256 || JSON.stringify(prior.files) !== JSON.stringify(row.files))
      errors.push('Retained immutable registry changed: ' + row.directory);
  }
  return { fullRegistries: actual.length, fullRegistryBytes: actual.reduce((n, row) => n + row.files.reduce((s, f) => s + f.bytes, 0), 0), errors };
}

export function inspectPeopleRegistryStorage(root, { env = process.env } = {}) {
  const file = path.join(root, 'data/people/storage-policy.json');
  if (!fs.existsSync(file)) throw Error('Missing explicit people storage policy');
  const remote = peopleGenerationIsRemote(env);
  const result = evaluatePeopleRegistryStorage(inventoryLocalPeopleRegistries(root), JSON.parse(fs.readFileSync(file)), { allowNewFullRegistries: remote });
  const forbiddenAggregatePaths = remote ? [] : ['catalog.json', 'catalog-shards', 'site-index.json', 'site-index-shards']
    .filter(name => fs.existsSync(path.join(root, 'data/people/generated', name)));
  for (const name of forbiddenAggregatePaths) result.errors.push('Local global-derived output is forbidden; preserve source and use remote generation: data/people/generated/' + name);
  return { ...result, forbiddenAggregatePaths };
}
