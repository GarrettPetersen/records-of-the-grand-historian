import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { Transform } from 'node:stream';
import { createHash } from 'node:crypto';

const need = (value, message) => { if (!value) throw new Error(message); };
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const maxLineBytes = 16 * 1024 * 1024;
function regularFile(file) {
  const stat = fs.lstatSync(file);
  need(stat.isFile() && !stat.isSymbolicLink(), `Expected a regular dossier artifact: ${file}`);
  return stat;
}
function writer(file) {
  const fd = fs.openSync(file, 'wx', 0o600), digest = createHash('sha256'); let bytes = 0, pending = [], pendingBytes = 0, closed = false;
  const flush = () => { if (pendingBytes) fs.writeSync(fd, Buffer.concat(pending, pendingBytes)); pending = []; pendingBytes = 0; };
  return {
    row(value) { const b = Buffer.from(JSON.stringify(value) + '\n'); need(b.length <= maxLineBytes, 'Dossier row exceeds the sealed storage bound');
      const location = { offset: bytes, bytes: b.length, sha256: hash(b) }; digest.update(b); bytes += b.length;
      pending.push(b); pendingBytes += b.length; if (pendingBytes >= 64 * 1024) flush(); return location; },
    close() { if (!closed) { fs.closeSync(fd); closed = true; } },
    finish() { flush(); fs.fsyncSync(fd); need(fs.fstatSync(fd).size === bytes, 'Incomplete dossier artifact write'); fs.closeSync(fd); closed = true;
      return { file: path.basename(file), bytes, sha256: digest.digest('hex') }; },
  };
}

// A new immutable generation is published by its manifest last. An interrupted
// generation is kept for recovery and is never mistaken for a usable registry.
export function writeIdentityDossierStore(directory, index, provenance) {
  need(/^[a-f0-9]{40}$/u.test(provenance?.revision ?? ''), 'Pinned source revision required');
  fs.mkdirSync(directory, { recursive: false, mode: 0o700 });
  let headers, metadata;
  try {
  headers = writer(path.join(directory, 'dossiers.jsonl')); metadata = writer(path.join(directory, 'index.jsonl'));
  let dossierCount = 0;
  for (const [id, dossier] of index.dossiers) {
    need(dossier.id === id && /^sha256:[a-f0-9]{64}$/u.test(dossier.version), 'Dossier index identity/version mismatch'); const location = headers.row(dossier);
    metadata.row(['dossier', id, { ...location, version: dossier.version }]); dossierCount += 1;
  }
  for (const kind of ['postings', 'englishUnknownPostings', 'localPersonMap', 'memberVersions', 'canonicalByKnownId', 'chapters']) {
    for (const [key, value] of index[kind]) metadata.row([kind, key, kind === 'chapters' ? [...value] : value]);
  }
  const manifest = { schemaVersion: 1, kind: 'canonical-identity-dossier-store', dossierCount,
    headers: headers.finish(), metadata: metadata.finish(), provenance,
    sourceEditorialApproval: false, chronologyApproval: false, publicationApproval: false };
  fs.writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  return manifest;
  } finally { headers?.close(); metadata?.close(); }
}

export async function readIdentityDossierStore(directory, localPeople) {
  need(localPeople instanceof Map, 'Explicit current source-person materialization is required');
  const manifestFile = path.join(directory, 'manifest.json'); regularFile(manifestFile);
  const manifest = JSON.parse(fs.readFileSync(manifestFile));
  need(manifest.schemaVersion === 1 && manifest.kind === 'canonical-identity-dossier-store' &&
    manifest.headers?.file === 'dossiers.jsonl' && manifest.metadata?.file === 'index.jsonl' &&
    Number.isSafeInteger(manifest.dossierCount) && manifest.dossierCount > 0, 'Invalid dossier generation manifest');
  const headerPath = path.join(directory, manifest.headers.file), metadataPath = path.join(directory, manifest.metadata.file);
  need(regularFile(headerPath).size === manifest.headers.bytes && regularFile(metadataPath).size === manifest.metadata.bytes, 'Truncated dossier generation');
  const locations = new Map(), index = { schemaVersion: 1, localPeople, dossierVersions: new Map() };
  for (const kind of ['postings', 'englishUnknownPostings', 'localPersonMap', 'memberVersions', 'canonicalByKnownId', 'chapters']) index[kind] = new Map();
  const digest = createHash('sha256'), stream = fs.createReadStream(metadataPath);
  const hashing = new Transform({ transform(chunk, _encoding, done) { digest.update(chunk); done(null, chunk); } });
  const lines = readline.createInterface({ input: hashing, crlfDelay: Infinity }); let readError = null;
  stream.on('error', error => hashing.destroy(error)); hashing.on('error', error => { readError = error; lines.close(); });
  stream.pipe(hashing);
  try { for await (const line of lines) {
    need(Buffer.byteLength(line) < maxLineBytes, 'Oversized dossier index row');
    const row = JSON.parse(line); need(Array.isArray(row) && row.length === 3 && typeof row[1] === 'string', 'Invalid dossier index row');
    const [kind, key, value] = row, map = kind === 'dossier' ? locations :
      ['postings', 'englishUnknownPostings', 'localPersonMap', 'memberVersions', 'canonicalByKnownId', 'chapters'].includes(kind) ? index[kind] : null;
    need(map instanceof Map && !map.has(key), 'Unknown or duplicate dossier index key');
    if (kind === 'dossier') need(Number.isSafeInteger(value.offset) && value.offset >= 0 && Number.isSafeInteger(value.bytes) && value.bytes > 0 &&
      value.bytes <= maxLineBytes && value.offset + value.bytes <= manifest.headers.bytes && /^[a-f0-9]{64}$/u.test(value.sha256), 'Invalid dossier byte locator');
    map.set(key, kind === 'chapters' ? new Map(value) : value);
    if (kind === 'dossier') index.dossierVersions.set(key, value.version);
  } } finally { lines.close(); stream.destroy(); hashing.destroy(); }
  if (readError) throw readError;
  need(digest.digest('hex') === manifest.metadata.sha256 && locations.size === manifest.dossierCount, 'Dossier metadata fingerprint/coverage mismatch');
  const fd = fs.openSync(headerPath, 'r'), cache = new Map(); let closed = false, cachedBytes = 0;
  index.dossiers = { size: locations.size, get(id) {
    need(!closed, 'Dossier reader is closed'); if (cache.has(id)) return cache.get(id).dossier;
    const location = locations.get(id); if (!location) return undefined;
    const b = Buffer.alloc(location.bytes); need(fs.readSync(fd, b, 0, b.length, location.offset) === b.length && hash(b) === location.sha256, 'Dossier bytes changed');
    const dossier = JSON.parse(b); need(dossier.id === id && dossier.version === location.version, 'Dossier identity/version mismatch');
    if (b.length <= 32 * 1024 * 1024) {
      while (cache.size >= 256 || cachedBytes + b.length > 32 * 1024 * 1024) {
        const first = cache.keys().next().value; cachedBytes -= cache.get(first).bytes; cache.delete(first);
      }
      cache.set(id, { dossier, bytes: b.length }); cachedBytes += b.length;
    }
    return dossier;
  } };
  index.close = () => { if (!closed) { fs.closeSync(fd); cache.clear(); closed = true; } };
  index.provenance = manifest.provenance;
  return index;
}
