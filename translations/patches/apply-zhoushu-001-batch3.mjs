#!/usr/bin/env node
/** Apply zhoushu-001-batch3 to translations/current_translation_zhoushu.json */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const batchMod = await import(path.join(here, 'zhoushu-001-batch3.mjs'));
const batch = batchMod.default;

const file = path.resolve('translations/current_translation_zhoushu.json');
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
