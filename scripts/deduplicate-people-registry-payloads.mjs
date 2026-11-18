#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const pin = s => `${s.dev}:${s.ino}:${s.size}:${s.mtimeMs}`;
function checksum(file) {
  const fd = fs.openSync(file, 'r'), b = Buffer.alloc(1024 * 1024), h = createHash('sha256');
  try { for (let n; (n = fs.readSync(fd, b)) > 0;) h.update(b.subarray(0, n)); } finally { fs.closeSync(fd); }
  return h.digest('hex');
}
export function deduplicateRegistryPayloads({ root, registries, receipt, apply = false, checkIdle }) {
  const groups = new Map();
  for (const relative of registries) {
    const directory = path.resolve(root, relative);
    if (!directory.startsWith(path.resolve(root) + path.sep)) throw Error('Registry escapes host root');
    const real = fs.realpathSync(directory);
    if (real !== directory) throw Error('Redirected registry directory');
    const manifestPath = path.join(directory, 'manifest.json'), bytes = fs.readFileSync(manifestPath);
    const manifest = JSON.parse(bytes);
    if (manifest.kind !== 'canonical-identity-dossier-store') throw Error('Only immutable full registry payloads can be deduplicated');
    for (const role of ['headers', 'metadata']) {
      const part = manifest[role];
      if (!part || !['dossiers.jsonl', 'index.jsonl'].includes(part.file) || !/^[a-f0-9]{64}$/.test(part.sha256)) throw Error('Invalid sealed registry payload');
      const file = path.join(directory, part.file), s = fs.lstatSync(file);
      if (!s.isFile() || s.isSymbolicLink() || s.size !== part.bytes) throw Error('Registry payload changed');
      const key = part.sha256 + ':' + part.bytes;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ file, sha256: part.sha256, bytes: part.bytes, allocated: s.blocks * 512,
        identity: pin(s), manifestPath, manifestBytes: bytes });
    }
  }
  const changes = [];
  for (const values of groups.values()) {
    values.sort((a, b) => a.allocated - b.allocated);
    const first = values[0];
    for (const other of values.slice(1)) if (other.identity.split(':').slice(0, 2).join(':') !== first.identity.split(':').slice(0, 2).join(':'))
      changes.push({ canonical: first, duplicate: other });
  }
  const plan = { schemaVersion: 1, kind: 'immutable-registry-byte-deduplication', duplicateFiles: changes.length,
    logicalDuplicateBytes: changes.reduce((n, r) => n + r.duplicate.bytes, 0), applied: false };
  if (!apply || !changes.length) return plan;
  if (!path.isAbsolute(receipt ?? '') || fs.existsSync(receipt) || typeof checkIdle !== 'function') throw Error('New absolute receipt and ownership check required');
  const files = [...new Map(changes.flatMap(c => [c.canonical, c.duplicate]).map(r => [r.file, r])).values()];
  checkIdle(files.map(r => r.file));
  // Hash ALL candidates before changing any path. Original manifest bytes,
  // offsets, hashes and filenames remain exactly as independently reviewed.
  for (const row of files) if (checksum(row.file) !== row.sha256 || pin(fs.lstatSync(row.file)) !== row.identity ||
    !fs.readFileSync(row.manifestPath).equals(row.manifestBytes)) throw Error('Changed/corrupt immutable payload; originals preserved');
  const before = fs.statfsSync(root, { bigint: true });
  const report = { ...plan, startedAt: new Date().toISOString(), status: 'verified-before-sharing',
    freeBytesBefore: String(before.bavail * before.bsize), changes: changes.map(c => ({
      canonical: c.canonical.file, duplicate: c.duplicate.file, sha256: c.canonical.sha256, bytes: c.canonical.bytes })) };
  fs.writeFileSync(receipt, JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  for (const { canonical, duplicate } of changes) {
    checkIdle([canonical.file, duplicate.file]);
    if (pin(fs.lstatSync(canonical.file)) !== canonical.identity || pin(fs.lstatSync(duplicate.file)) !== duplicate.identity ||
      !fs.readFileSync(duplicate.manifestPath).equals(duplicate.manifestBytes)) throw Error('Concurrent registry writer; remaining paths preserved');
    // These files are immutable. Never use shared inodes for mutable source,
    // responses, receipts or manifests. Make both names read-only first.
    fs.chmodSync(canonical.file, 0o400); fs.chmodSync(duplicate.file, 0o400);
    const temporary = duplicate.file + '.deduplicate-' + process.pid;
    fs.linkSync(canonical.file, temporary);
    fs.renameSync(temporary, duplicate.file);
  }
  const after = fs.statfsSync(root, { bigint: true });
  Object.assign(report, { status: 'complete', applied: true, freeBytesAfter: String(after.bavail * after.bsize) });
  fs.writeFileSync(receipt, JSON.stringify(report, null, 2) + '\n');
  return { ...plan, applied: true, receipt, freeBytesBefore: report.freeBytesBefore, freeBytesAfter: report.freeBytesAfter };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2), root = fs.realpathSync(process.cwd());
  if (args.length && (args.length !== 3 || args[0] !== '--apply' || args[1] !== '--receipt')) throw Error('Usage: [--apply --receipt NEW_ABSOLUTE_PATH]');
  if (fs.existsSync(path.join(root, '.git/people-storage-compaction.lock'))) throw Error('Serialize cleanup after Git compaction');
  const policy = JSON.parse(fs.readFileSync(path.join(root, 'data/people/storage-policy.json')));
  const checkIdle = files => {
    const r = spawnSync('/usr/sbin/lsof', ['-nP', '-Fpn', '--', ...files], { encoding: 'utf8', timeout: 15000 });
    if (r.error || r.status !== 1 || r.stdout || r.stderr) throw Error('Registry is open or ownership unverifiable; preserve it');
  };
  console.log(JSON.stringify(deduplicateRegistryPayloads({ root, registries: policy.retainedFullRegistries.map(r => r.directory),
    apply: args.length > 0, receipt: args[2], checkIdle }), null, 2));
}
