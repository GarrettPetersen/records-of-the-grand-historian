import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const LOW_DISK_BYTES = 35n * 1024n ** 3n;
export const RECOVERED_DISK_BYTES = 40n * 1024n ** 3n;

// Completed/failed deletion is one-shot. Temporary busy/absent/pressure deferrals
// may be inspected again, without repeating a successfully delivered notification.
export function maintainDisk({ state, measure, save, clean, notify, now }) {
  const before = measure();
  const available = BigInt(before.availableBytes);
  const deliver = next => {
    if (!next.episode.notificationDeliveredAt) {
      try { notify(next); }
      catch (error) { next.episode.notificationError = error.message; save(next); throw error; }
      next.episode.notificationDeliveredAt = now;
      delete next.episode.notificationError;
      save(next);
    }
    return next;
  };
  if (available >= RECOVERED_DISK_BYTES) {
    const next = { schemaVersion: 1, status: 'healthy', measuredAt: now, measurement: before };
    save(next);
    return next;
  }
  if (state?.episode && (state.status !== 'cleanup-deferred' || available >= LOW_DISK_BYTES)) {
    const next = { ...state, measuredAt: now, measurement: before };
    if (state.status === 'cleanup-started') {
      next.status = 'interrupted-needs-inspection';
    }
    save(next);
    return deliver(next);
  }
  if (available >= LOW_DISK_BYTES) {
    const next = { schemaVersion: 1, status: 'healthy', measuredAt: now, measurement: before };
    save(next);
    return next;
  }
  const next = { schemaVersion: 1, status: 'cleanup-started', measuredAt: now,
    measurement: before, episode: state?.episode ?? { startedAt: now, before } };
  next.episode.inspections = (next.episode.inspections ?? 0) + 1;
  save(next); // Preserve the attempt even if cleanup crashes; never blindly repeat it.
  try {
    next.episode.cleanup = before.memory?.pressureLevel === 1
      ? clean(plan => { next.episode.plan = plan; save(next); })
      : { status: 'skipped', reason: 'Memory pressure is not verified normal; host remediation required.' };
    next.measurement = measure();
    next.episode.observedFreeBytesChange = (BigInt(next.measurement.availableBytes) - available).toString();
    next.status = ['busy', 'absent', 'skipped'].includes(next.episode.cleanup.status)
      ? 'cleanup-deferred' : BigInt(next.measurement.availableBytes) >= LOW_DISK_BYTES ? 'recovered-warning' : 'needs-space';
  } catch (error) {
    next.status = 'cleanup-error';
    next.episode.error = error.message;
    save(next);
    deliver(next);
    throw error;
  }
  save(next);
  return deliver(next);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: 15000, maxBuffer: 8 * 1024 * 1024 });
  if (result.error) throw new Error(`${path.basename(command)} inspection failed: ${result.error.code}`);
  return result;
}

export function hasPackageInstall(output) {
  return output.split('\n').some(line => /(?:^|[\s/])(?:npm(?:-cli)?|pnpm|yarn|bun|npx)(?:\.js|\.cjs)?(?:\s|$)/.test(line));
}

export function cleanNpmDownloads(home, execute = run, beforeRemove = () => {}) {
  const parent = path.join(home, '.npm');
  const cache = path.join(parent, '_cacache');
  try { fs.lstatSync(cache); }
  catch (error) { if (error.code !== 'ENOENT') throw error; return { status: 'absent', path: cache, allocatedBytes: 0 }; }
  for (const entry of [home, parent, cache]) {
    if (fs.lstatSync(entry).isSymbolicLink() || fs.realpathSync(entry) !== entry) throw new Error('Refusing redirected npm cache path');
  }
  const started = Date.now();
  let allocatedBytes = 0, files = 0;
  function inventory(folder) {
    for (const name of fs.readdirSync(folder)) {
      if (++files > 100000 || Date.now() - started > 5000) throw new Error('npm cache inventory exceeds bounded inspection; host review required');
      const entry = path.join(folder, name), stat = fs.lstatSync(entry);
      if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile())) throw new Error('Refusing special file in npm cache');
      allocatedBytes += stat.blocks * 512;
      if (stat.isDirectory()) inventory(entry);
    }
  }
  inventory(cache);
  // Inspect only the allowed download directory. Never log process arguments.
  const opened = execute('/usr/sbin/lsof', ['-nP', '+D', cache, '-F', 'pn']);
  if (opened.status !== 0 && opened.status !== 1) throw new Error('Cannot verify npm cache open files');
  if (opened.status === 1 && opened.stderr?.trim()) throw new Error('npm cache open-file inspection incomplete');
  const pids = [];
  for (const line of opened.stdout.split('\n').filter(Boolean)) {
    if (/^p\d+$/.test(line)) pids.push(Number(line.slice(1)));
    else if (!line.startsWith('n') || !pids.length) throw new Error('Unrecognized npm cache open-file measurement');
  }
  // lsof may report its own directory traversal. Ignore only its exact child PID,
  // not arbitrary other lsof processes, and preserve every other open-file owner.
  if (pids.some(pid => pid !== opened.pid)) return { status: 'busy', path: cache, allocatedBytes, reason: 'Open cache files; preserved' };
  const processes = execute('/bin/ps', ['-axo', 'command=']);
  if (processes.status !== 0) throw new Error('Cannot verify package install activity');
  if (hasPackageInstall(processes.stdout)) return { status: 'busy', path: cache, allocatedBytes, reason: 'Package install/cache activity; preserved' };
  // No app, installed dependency, package config or npm log directory is removed.
  if (fs.realpathSync(cache) !== cache) throw new Error('npm cache path changed during inspection');
  beforeRemove({ path: cache, allocatedBytes, files, kind: 'reproducible-npm-downloads-only' });
  fs.rmSync(cache, { recursive: true });
  return { status: 'removed-download-cache', path: cache, allocatedBytes, files };
}
