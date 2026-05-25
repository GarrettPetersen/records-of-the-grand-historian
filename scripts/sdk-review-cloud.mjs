#!/usr/bin/env node
/**
 * Cloud editorial review: Composer (fast off), PR → master.
 *
 *   node scripts/sdk-review-cloud.mjs
 *   node scripts/sdk-review-cloud.mjs --book songshi
 *   node scripts/sdk-review-cloud.mjs --until-complete
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORCHESTRATOR = path.join(REPO_ROOT, 'scripts', 'sdk-review.mjs');

const child = spawn(process.execPath, [ORCHESTRATOR, '--runtime', 'cloud', '--no-stream', ...process.argv.slice(2)], {
  cwd: REPO_ROOT,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 1));
});
