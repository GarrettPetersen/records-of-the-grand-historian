#!/usr/bin/env node
/**
 * Spawn cloud translators for every chapter in shortest-untranslated-batch-plan.json launch[].
 * Does not wait for agents to finish — only records START lines.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDotenv } from './load-dotenv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv(ROOT);

const PLAN = path.join(ROOT, 'data', 'shortest-untranslated-batch-plan.json');
const LOG = process.env.SDK_TAIL_LAUNCH_LOG || path.join(ROOT, 'data', 'batch-tail-launches.log');

const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
const launch = plan.launch ?? [];
if (launch.length === 0) {
  console.error('No launch[] in plan — run batch dry-run first or pass a plan path.');
  process.exit(1);
}

fs.mkdirSync(path.dirname(LOG), { recursive: true });
fs.writeFileSync(
  LOG,
  `=== fire-and-forget ${new Date().toISOString()} count=${launch.length} ===\n`,
);

let n = 0;
for (const { book, chapter } of launch) {
  fs.appendFileSync(LOG, `=== START ${book}/${chapter} ${new Date().toISOString()} ===\n`);
  const child = spawn(
    process.execPath,
    [
      path.join(ROOT, 'scripts/sdk-translate-cloud.mjs'),
      '--book',
      book,
      '--chapter',
      chapter,
      '--no-stream',
    ],
    { cwd: ROOT, env: process.env, detached: true, stdio: 'ignore' },
  );
  child.unref();
  n++;
  if (n % 50 === 0) console.log(`spawned ${n}/${launch.length}…`);
}

console.log(`Done: spawned ${n} agents. Log: ${LOG}`);
