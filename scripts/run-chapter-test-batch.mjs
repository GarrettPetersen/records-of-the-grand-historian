#!/usr/bin/env node
/**
 * Launch parallel one-shot cloud SDK translations for a fixed chapter list.
 * Usage: node scripts/run-chapter-test-batch.mjs
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOG = process.env.SDK_CHAPTER_TEST_LOG || '/tmp/sdk-chapter-test.log';

/** @type {Array<[string, string, number]>} [book, chapter, sentences] */
const CHAPTERS = [
  ['qingshigao', '120', 17],
  ['suishu', '086', 39],
  ['liaoshi', '063', 42],
  ['yuanshi', '106', 43],
  ['liaoshi', '117', 49],
  ['liaoshi', '106', 50],
  ['liaoshi', '058', 56],
  ['liaoshi', '109', 57],
  ['xintangshu', '064', 58],
  ['liaoshi', '057', 59],
];

function log(line) {
  fs.appendFileSync(LOG, line + '\n');
  console.log(line);
}

function runOne(book, chapter, sentences) {
  return new Promise((resolve) => {
    log(`\n=== START ${book}/${chapter} (${sentences} sentences) ${new Date().toISOString()} ===`);
    const child = spawn(
      process.execPath,
      [path.join(ROOT, 'scripts/sdk-translate-cloud.mjs'), '--book', book, '--chapter', chapter, '--no-stream'],
      { cwd: ROOT, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    child.stdout?.on('data', (d) => fs.appendFileSync(LOG, d));
    child.stderr?.on('data', (d) => fs.appendFileSync(LOG, d));
    child.on('close', (code) => {
      log(`=== END ${book}/${chapter} exit=${code} ===`);
      resolve({ book, chapter, code });
    });
  });
}

async function main() {
  fs.writeFileSync(LOG, `=== chapter test batch ${new Date().toISOString()} ===\n`);
  console.log(`Log: ${LOG}`);
  console.log(`Launching ${CHAPTERS.length} cloud agents in parallel…\n`);
  for (const [book, ch, n] of CHAPTERS) {
    console.log(`  ${book}/${ch} (${n} sentences)`);
  }

  const results = await Promise.all(
    CHAPTERS.map(([book, chapter, sentences]) => runOne(book, chapter, sentences)),
  );

  console.log('\nAll finished:');
  for (const r of results) {
    console.log(`  ${r.book}/${r.chapter}: exit ${r.code}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
