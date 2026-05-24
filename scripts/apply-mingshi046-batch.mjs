#!/usr/bin/env node
import fs from 'fs';

const batch = process.argv[2];
if (!batch) {
  console.error('Usage: node scripts/apply-mingshi046-batch.mjs batch5');
  process.exit(1);
}
const path = `scripts/mingshi046-${batch}.json`;
const translations = JSON.parse(fs.readFileSync(path, 'utf8'));
const file = JSON.parse(fs.readFileSync('translations/current_translation_mingshi.json', 'utf8'));
let missing = 0;
for (const s of file.sentences) {
  const tr = translations[s.id];
  if (!tr) {
    console.error('Missing', s.id);
    missing++;
    continue;
  }
  s.literal = tr.literal;
  s.idiomatic = tr.idiomatic;
}
if (missing) process.exit(1);
const empty = file.sentences.filter((s) => !s.literal || !s.idiomatic);
if (empty.length) {
  console.error('Empty:', empty.map((s) => s.id).join(', '));
  process.exit(1);
}
fs.writeFileSync('translations/current_translation_mingshi.json', `${JSON.stringify(file, null, 2)}\n`);
console.log(`Applied ${file.sentences.length} sentences from ${batch}`);
