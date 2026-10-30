import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { inspectLocalDisk } from '../check-local-disk.mjs';

// Monitor in a separate process so synchronous corpus validation cannot prevent
// the required host measurements. Preserve active work on a resource stop.
export async function runGuardedPeopleScript(script, args) {
  const hostRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  let resourceHold = false;
  const sample = () => {
    const result = inspectLocalDisk(hostRoot);
    if (result.errors.length) { resourceHold = true; console.error(JSON.stringify({ peopleResourceHold: true, errors: result.errors, preserveActiveWork: true })); }
    return result;
  };
  if (sample().errors.length) throw new Error('Host resource guard rejected the new job');
  const child = spawn(process.execPath, ['--max-old-space-size=3072', fileURLToPath(script), ...args], { cwd: hostRoot, stdio: 'inherit' });
  const timer = setInterval(() => { try { sample(); } catch (error) { resourceHold = true; console.error(`Host measurement failed; no new work: ${error.message}`); } }, 45_000);
  try {
    const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', (status, signal) => signal ? reject(new Error(`People job terminated by ${signal}`)) : resolve(status)); });
    sample();
    if (resourceHold) throw new Error('Host resource hold; preserve completed artifacts and do not dispatch more work');
    if (code !== 0) throw new Error(`People job exited with status ${code}`);
  } finally { clearInterval(timer); }
}
