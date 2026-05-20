#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const batches = [];
for (let n = 1; n <= 4; n++) {
  const mod = await import(pathToFileURL(path.resolve(`translations/_ch159_b${n}.mjs`)).href);
  const batch = mod[`batch${n}`];
  if (!Array.isArray(batch)) throw new Error(`batch${n} missing`);
  batches.push(...batch);
}

const countable = JSON.parse(fs.readFileSync('translations/ch159_countable.json', 'utf8'));
if (batches.length !== countable.length) {
  console.error(`Batch ${batches.length} !== countable ${countable.length}`);
  process.exit(1);
}

for (let i = 0; i < countable.length; i++) {
  if (batches[i].zh !== countable[i].zh) {
    console.error(`Mismatch at ${i}:`, countable[i].zh.slice(0, 40), 'vs', (batches[i].zh || '').slice(0, 40));
    process.exit(1);
  }
}

const lines = batches
  .map(
    (e) =>
      `  { zh: ${JSON.stringify(e.zh)}, literal: ${JSON.stringify(e.literal)}, idiomatic: ${JSON.stringify(e.idiomatic)} }`
  )
  .join(',\n');

fs.writeFileSync(
  'translations/_ch159_all_entries.mjs',
  `/** All 350 translations for zizhitongjian ch.159 — Garrett M. Petersen (2026), Composer 2.5 */\nexport const entries = [\n${lines}\n];\n`
);
console.log('Wrote', batches.length, 'entries to _ch159_all_entries.mjs');
