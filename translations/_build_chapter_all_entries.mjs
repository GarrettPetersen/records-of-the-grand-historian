#!/usr/bin/env node
/** Merge _chNNN_b*.mjs into _chNNN_all_entries.mjs (usage: node ... 160 [numBatches=4]) */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const chapter = process.argv[2];
const numBatches = Number(process.argv[3] || 4);
if (!chapter) {
  console.error('Usage: node _build_chapter_all_entries.mjs <chapter> [numBatches]');
  process.exit(1);
}

const batches = [];
for (let n = 1; n <= numBatches; n++) {
  const mod = await import(
    pathToFileURL(path.resolve(`translations/_ch${chapter}_b${n}.mjs`)).href
  );
  const batch = mod[`batch${n}`];
  if (!Array.isArray(batch)) throw new Error(`batch${n} missing`);
  batches.push(...batch);
}

const countable = JSON.parse(
  fs.readFileSync(`translations/ch${chapter}_countable.json`, 'utf8')
);
if (batches.length !== countable.length) {
  console.error(`Batch ${batches.length} !== countable ${countable.length}`);
  process.exit(1);
}

for (let i = 0; i < countable.length; i++) {
  if (batches[i].zh !== countable[i].zh) {
    console.error(
      `Mismatch at ${i}:`,
      countable[i].zh.slice(0, 40),
      'vs',
      (batches[i].zh || '').slice(0, 40)
    );
    process.exit(1);
  }
}

const lines = batches
  .map(
    (e) =>
      `  { zh: ${JSON.stringify(e.zh)}, literal: ${JSON.stringify(e.literal)}, idiomatic: ${JSON.stringify(e.idiomatic)} }`
  )
  .join(',\n');

const out = `translations/_ch${chapter}_all_entries.mjs`;
fs.writeFileSync(
  out,
  `/** All translations for zizhitongjian ch.${chapter} — Garrett M. Petersen (2026), Composer 2.5 */\nexport const entries = [\n${lines}\n];\n`
);
console.log('Wrote', batches.length, 'entries to', out);
