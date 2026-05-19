#!/usr/bin/env node
import fs from 'node:fs';

const mapFile = process.argv[2];
const targetFile = process.argv[3] || 'translations/current_translation_jinshu.json';
if (!mapFile) {
  console.error('Usage: node apply-translations-map.mjs <map.json> [target.json]');
  process.exit(1);
}

const T = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
const data = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const t = T[s.id];
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
    applied++;
  }
}
fs.writeFileSync(targetFile, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} from ${mapFile}`);
