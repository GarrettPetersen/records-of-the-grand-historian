#!/usr/bin/env node
/**
 * Local editorial review: extract → agent edits review JSON → apply-review → update.
 *
 *   node scripts/sdk-review-local.mjs
 *   node scripts/sdk-review-local.mjs --book liaoshi --direct-to-master
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORCHESTRATOR = path.join(REPO_ROOT, 'scripts', 'sdk-review.mjs');

const child = spawn(
  process.execPath,
  [ORCHESTRATOR, '--runtime', 'local', '--no-stream', ...process.argv.slice(2)],
  {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    env: process.env,
  },
);

child.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 1));
});
