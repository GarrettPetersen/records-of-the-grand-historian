#!/usr/bin/env node
/**
 * Gracefully stop the sdk-translate orchestrator: finish in-flight agents + merge-wait,
 * then exit without scheduling new books.
 *
 *   node scripts/sdk-translate-drain.mjs
 *
 * Equivalent: kill -USR1 <pid> on the node process running sdk-translate.mjs
 */
import { execSync } from 'node:child_process';

function findOrchestratorPids() {
  try {
    const out = execSync('pgrep -f "scripts/sdk-translate.mjs"', { encoding: 'utf8' }).trim();
    return out ? out.split('\n').map((s) => Number.parseInt(s, 10)).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

const pids = findOrchestratorPids();
if (pids.length === 0) {
  console.error('No sdk-translate orchestrator found (pgrep scripts/sdk-translate.mjs)');
  process.exit(1);
}

for (const pid of pids) {
  process.kill(pid, 'SIGUSR1');
  console.log(`Sent SIGUSR1 (drain) to orchestrator pid ${pid}`);
}

console.log('Watch: tail -f /tmp/sdk-translate-local.log');
console.log('When you see "[orchestrator] drain complete", restart with sdk-translate:local');
