import fs from 'node:fs';
import path from 'node:path';

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid < 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error?.code === 'EPERM') return true;
    if (error?.code === 'ESRCH') return false;
    throw error;
  }
}

export function acquireProcessRunLock(lockFile, options = {}) {
  const label = options.label ?? 'Process';
  fs.mkdirSync(path.dirname(lockFile), { recursive: true });
  const owner = {
    schemaVersion: 1,
    pid: process.pid,
    token: `${process.pid}:${Date.now()}:${Math.random().toString(16).slice(2)}`,
    startedAt: new Date().toISOString(),
    argv: process.argv.slice(2),
  };
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const descriptor = fs.openSync(lockFile, 'wx', 0o600);
      try {
        fs.writeFileSync(descriptor, `${JSON.stringify(owner, null, 2)}\n`);
      } finally {
        fs.closeSync(descriptor);
      }
      return () => {
        if (!fs.existsSync(lockFile)) return;
        let current;
        try {
          current = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
        } catch {
          return;
        }
        if (current.token === owner.token) fs.unlinkSync(lockFile);
      };
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      let current;
      try {
        current = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
      } catch (readError) {
        throw new Error(`${label} run lock is unreadable: ${lockFile}: ${readError.message}`);
      }
      if (processIsAlive(current.pid)) {
        throw new Error(
          `Another ${label.toLowerCase()} is already running as PID ${current.pid} ` +
          `(started ${current.startedAt ?? 'at an unknown time'}).`,
        );
      }
      fs.unlinkSync(lockFile);
    }
  }
  throw new Error(`Could not acquire ${label.toLowerCase()} run lock: ${lockFile}`);
}
