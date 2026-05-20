#!/usr/bin/env node
import fs from 'node:fs';

const patchPath = process.argv[2];
const targetPath = process.argv[3] || 'translations/current_translation_beishi.json';

const raw = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
const patch = Array.isArray(raw)
  ? Object.fromEntries(raw.map((e) => [e.id, { literal: e.literal, idiomatic: e.idiomatic }]))
  : raw;

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const p = patch[s.id];
  if (!p) continue;
  s.literal = p.literal;
  s.idiomatic = p.idiomatic;
  applied++;
}
fs.writeFileSync(targetPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Applied ${applied} translations to ${targetPath}`);
