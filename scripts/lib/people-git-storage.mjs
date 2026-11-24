import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { inflateSync } from 'node:zlib';

const GiB = 1024 ** 3;
function git(root, args, input) {
  const r = spawnSync('git', ['-C', root, ...args], { input, encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
  if (r.error || r.status !== 0) throw Error(`git ${args[0]} failed: ${r.error?.message ?? r.stderr}`);
  return r.stdout;
}
const identity = s => `${s.dev}:${s.ino}:${s.size}:${s.mtimeMs}`;
const digest = b => createHash('sha256').update(b).digest('hex');
function state(root, common) {
  return digest(git(root, ['for-each-ref', '--format=%(refname) %(objectname)']) +
    git(root, ['rev-parse', 'HEAD']) + git(root, ['ls-files', '--stage', '-z']));
}
function unlocked(common) {
  for (const name of ['index.lock', 'packed-refs.lock', 'shallow.lock', 'gc.pid']) {
    if (fs.existsSync(path.join(common, name))) throw Error(`Preserve active Git operation: ${name}`);
  }
}
function currentLooseIdentity(row) {
  let s;
  try { s = fs.lstatSync(row.file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; } // Verified pack still retains it.
  if (!s.isFile() || s.isSymbolicLink()) throw Error('Redirected loose object; preserve it');
  const actual = identity(s);
  if (actual !== row.identity) {
    // Git legitimately freshens timestamps of existing objects. Verify the
    // ACTUAL loose representation, not cat-file (which might select the pack).
    const raw = inflateSync(fs.readFileSync(row.file), { maxOutputLength: 256 * 1024 * 1024 });
    if (createHash('sha1').update(raw).digest('hex') !== row.oid || identity(fs.lstatSync(row.file)) !== actual)
      throw Error('Loose object content changed; preserve it');
  }
  return actual;
}
export function inspectPeopleGitStorage(root) {
  const common = fs.realpathSync(git(root, ['rev-parse', '--path-format=absolute', '--git-common-dir']).trim());
  const objects = path.join(common, 'objects');
  if (fs.lstatSync(objects).isSymbolicLink()) throw Error('Redirected Git object store is unsupported');
  const files = [];
  for (const d of fs.readdirSync(objects, { withFileTypes: true })) {
    if (!/^[a-f0-9]{2}$/.test(d.name)) continue;
    if (!d.isDirectory() || d.isSymbolicLink()) throw Error('Redirected Git object directory');
    for (const n of fs.readdirSync(path.join(objects, d.name))) {
      if (!/^[a-f0-9]{38}$/.test(n)) continue;
      const file = path.join(objects, d.name, n), s = fs.lstatSync(file);
      if (!s.isFile() || s.isSymbolicLink()) throw Error('Expected regular loose Git object');
      files.push({ oid: d.name + n, file, bytes: s.size, allocatedBytes: s.blocks * 512, identity: identity(s) });
    }
  }
  return { common, files, looseBytes: files.reduce((n, f) => n + f.allocatedBytes, 0) };
}
export function peopleLooseObjectNames(root) {
  const names = new Map();
  for (const line of git(root, ['rev-list', '--objects', '--all', '--reflog', '--unpacked']).split('\n')) {
    if (!line) continue;
    const m = /^([a-f0-9]{40})(?: (.*))?$/.exec(line);
    if (!m) throw Error('Unverifiable Git object-name inventory');
    if (m[2]) names.set(m[1], m[2]);
  }
  return names;
}

// Unlike GC, this packs EVERY selected loose object, including unreachable and
// recovery-only objects. No ref, reflog, existing pack or historical object expires.
// Removal is limited to logically identical loose copies proven present in a verified pack.
export function compactPeopleGitStorage({ root, receipt, maxInputBytes = 3 * GiB, apply = false, resumeReceipt, existingPack, objectNames }) {
  if (Boolean(resumeReceipt) !== Boolean(existingPack)) throw Error('Resume requires both the preserved receipt and completed pack hash');
  if (!Number.isSafeInteger(maxInputBytes) || maxInputBytes <= 0 || maxInputBytes > 3 * GiB) throw Error('Compaction batch must be at most 3 GiB');
  const inventory = inspectPeopleGitStorage(root), selected = []; let bytes = 0, rawBytes = 0;
  if (resumeReceipt) {
    if (!/^[a-f0-9]{40}$/.test(existingPack ?? '') || !apply) throw Error('Explicit completed pack hash and --apply required for resume');
    const prior = JSON.parse(fs.readFileSync(resumeReceipt));
    if (prior.kind !== 'lossless-loose-git-compaction' || !Array.isArray(prior.selected) || !prior.selected.length) throw Error('Invalid preserved compaction receipt');
    for (const row of prior.selected) {
      if (!/^[a-f0-9]{40}$/.test(row.oid) || typeof row.identity !== 'string' || !Number.isSafeInteger(row.bytes)) throw Error('Invalid preserved object identity');
      selected.push({ ...row, file: path.join(inventory.common, 'objects', row.oid.slice(0, 2), row.oid.slice(2)) });
    }
    bytes = prior.selectedAllocatedBytes; rawBytes = prior.selectedRawBytes ?? 0;
  } else {
  objectNames ??= peopleLooseObjectNames(root);
  // Group versions of the same real Git path. Sorting only by object hash mixes
  // unrelated JSON blobs, wastes delta CPU and misses the duplicated snapshots.
  inventory.files.sort((a, b) => (objectNames.get(a.oid) ?? a.oid).localeCompare(objectNames.get(b.oid) ?? b.oid));
  // Bound UNCOMPRESSED input too: old JSON objects can inflate many times beyond
  // their loose-file size. Level-one compression avoids pathological CPU cost.
  selection: for (let start = 0; start < inventory.files.length; start += 1000) {
    const batch = inventory.files.slice(start, start + 1000);
    const sizes = git(root, ['cat-file', '--batch-check=%(objectname) %(objectsize)'], batch.map(f => f.oid).join('\n') + '\n').trim().split('\n');
    if (sizes.length !== batch.length) throw Error('Incomplete object size inventory');
    for (let i = 0; i < batch.length; i++) {
      const f = batch[i], match = /^([a-f0-9]{40}) (\d+)$/.exec(sizes[i]);
      if (!match || match[1] !== f.oid || !Number.isSafeInteger(Number(match[2]))) throw Error('Unverifiable Git object size; preserve loose originals');
      const raw = Number(match[2]);
      if (f.allocatedBytes > maxInputBytes || raw > 6 * GiB) throw Error('Single object exceeds bounded compaction batch');
      if (bytes + f.allocatedBytes > maxInputBytes || rawBytes + raw > 6 * GiB) break selection;
      selected.push(f); bytes += f.allocatedBytes; rawBytes += raw;
    }
  }
  }
  const plan = { schemaVersion: 1, kind: 'lossless-loose-git-compaction', looseObjects: inventory.files.length,
    looseAllocatedBytes: inventory.looseBytes, selectedObjects: selected.length, selectedAllocatedBytes: bytes,
    selectedRawBytes: rawBytes, allObjectsRetained: true, refsChanged: false, applied: false };
  if (!apply || !selected.length) return plan;
  if (!path.isAbsolute(receipt ?? '') || fs.existsSync(receipt)) throw Error('New absolute receipt path required');
  const { common } = inventory, lock = path.join(common, 'people-storage-compaction.lock');
  unlocked(common);
  const fd = fs.openSync(lock, 'wx', 0o600); fs.writeSync(fd, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
  try {
    const pinned = state(root, common), before = fs.statfsSync(common, { bigint: true });
    const free = Number(before.bavail * before.bsize);
    // Remediation may run below the 30 GiB dispatch reserve; its bounded temporary
    // pack must fit while leaving 6 GiB untouched. This does not admit model/build work.
    if (!resumeReceipt && free < rawBytes + selected.length * 64 + 4 * 1024 ** 2 + 6 * GiB) throw Error('Insufficient temporary headroom for lossless compaction');
    const report = { ...plan, startedAt: new Date().toISOString(), status: 'packing', freeBytesBefore: free,
      resumedFrom: resumeReceipt ?? null, selected: selected.map(({ oid, bytes, identity }) => ({ oid, bytes, identity })) };
    fs.writeFileSync(receipt, JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    const packHash = existingPack ?? git(root, ['pack-objects', '--threads=1', '--window=1', '--depth=10', '--compression=1',
      '--window-memory=64m', '--delta-base-offset', path.join(common, 'objects/pack/pack')],
    selected.map(f => f.oid + (objectNames?.has(f.oid) ? ' ' + objectNames.get(f.oid) : '')).join('\n') + '\n').trim();
    if (!/^[a-f0-9]{40}$/.test(packHash)) throw Error('Invalid new pack identity; loose objects preserved');
    const prefix = path.join(common, 'objects/pack/pack-' + packHash);
    git(root, ['verify-pack', prefix + '.idx']);
    const rows = git(root, ['show-index'], fs.readFileSync(prefix + '.idx')).trim().split('\n');
    const packed = new Set(rows.filter(Boolean).map(row => row.split(/\s+/)[1]));
    if (packed.size !== selected.length || selected.some(f => !packed.has(f.oid))) throw Error('New pack does not preserve every selected object');
    const packPin = identity(fs.statSync(prefix + '.pack')), indexPin = identity(fs.statSync(prefix + '.idx'));
    unlocked(common);
    report.externalGitStateChanged = state(root, common) !== pinned;
    // Ref/index updates do not authorize dropping an object. All selected
    // objects, including unreachable ones, are retained in the verified pack.
    // This tool never writes refs/index and need not invalidate a completed pack
    // because the desktop refreshed its index or another ref legitimately moved.
    for (const f of selected) f.currentIdentity = currentLooseIdentity(f);
    Object.assign(report, { status: 'verified-before-loose-removal', packHash, packPin, indexPin });
    fs.writeFileSync(receipt, JSON.stringify(report, null, 2) + '\n');
    for (const f of selected) {
      if (identity(fs.statSync(prefix + '.pack')) !== packPin || identity(fs.statSync(prefix + '.idx')) !== indexPin)
        throw Error('Verified pack changed during compaction');
      const current = currentLooseIdentity(f);
      if (current !== null) fs.unlinkSync(f.file);
    }
    const after = fs.statfsSync(common, { bigint: true });
    Object.assign(report, { status: 'complete', applied: true, finishedAt: new Date().toISOString(),
      freeBytesAfter: Number(after.bavail * after.bsize), refsAndIndexUnchanged: state(root, common) === pinned,
      refsOrIndexWrittenByCompactor: false });
    fs.writeFileSync(receipt, JSON.stringify(report, null, 2) + '\n');
    return { ...plan, applied: true, packHash, receipt, freeBytesBefore: report.freeBytesBefore, freeBytesAfter: report.freeBytesAfter };
  } catch (error) {
    if (fs.existsSync(receipt)) {
      const report = JSON.parse(fs.readFileSync(receipt));
      report.status = 'failed-preserve-all-remaining-objects'; report.error = error.message;
      fs.writeFileSync(receipt, JSON.stringify(report, null, 2) + '\n');
    }
    throw error;
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
