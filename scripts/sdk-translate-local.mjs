#!/usr/bin/env node
/**
 * Local parallel translation runner: economy Composer (fast off), direct push to master.
 *
 * Usage:
 *   node scripts/sdk-translate-local.mjs --list-books
 *   node scripts/sdk-translate-local.mjs --book zhoushu
 *   node scripts/sdk-translate-local.mjs --all-untranslated --concurrency 4 --until-complete
 *
 * Passes through all sdk-translate.mjs flags; always adds --runtime local --direct-to-master --no-stream.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORCHESTRATOR = path.join(REPO_ROOT, 'scripts', 'sdk-translate.mjs');

const passthrough = process.argv.slice(2);
const fixed = ['--runtime', 'local', '--direct-to-master', '--no-stream'];

const child = spawn(process.execPath, [ORCHESTRATOR, ...fixed, ...passthrough], {
  cwd: REPO_ROOT,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 1);
});
