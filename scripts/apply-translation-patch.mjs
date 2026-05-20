#!/usr/bin/env node
/** Apply { s0001: { literal, idiomatic }, ... } patch to current_translation JSON */
import fs from 'node:fs';

const patchPath = process.argv[2];
const targetPath = process.argv[3] || 'translations/current_translation_nanqishu.json';
const patch = (await import(new URL(`file://${process.cwd()}/${patchPath}`))).default;
const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let n = 0;
for (const s of data.sentences) {
  const p = patch[s.id];
  if (p?.literal && p?.idiomatic) {
    s.literal = p.literal;
    s.idiomatic = p.idiomatic;
    n++;
  }
}
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${n} sentences from ${patchPath}`);
