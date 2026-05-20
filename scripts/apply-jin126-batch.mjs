#!/usr/bin/env node
/** Apply a batch object to translations/current_translation_jinshu.json */
import fs from 'node:fs';
import path from 'node:path';

const batchPath = process.argv[2];
if (!batchPath) {
  console.error('Usage: node apply-jin126-batch.mjs <batch-module.mjs>');
  process.exit(1);
}

const batchMod = await import(path.resolve(batchPath));
const batch = batchMod.batch1 ?? batchMod.batch2 ?? batchMod.batch3 ?? batchMod.batch4 ?? batchMod.batch5 ?? batchMod.default ?? batchMod;

const file = path.resolve('translations/current_translation_jinshu.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const t = batch[s.id];
  if (t?.literal && t?.idiomatic) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
    applied++;
  }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} translations to ${file}`);
