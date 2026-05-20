#!/usr/bin/env node
/** Apply id/literal patches to translations/current_translation_songshu.json */
import fs from 'node:fs';

const patchFile = process.argv[2];
if (!patchFile) {
  console.error('Usage: node translations/apply-songshu005-patch.mjs <patch.json|patch.mjs>');
  process.exit(1);
}

let patches;
if (patchFile.endsWith('.mjs')) {
  patches = (await import(new URL(`file://${process.cwd()}/${patchFile}`, import.meta.url))).default;
} else {
  const arr = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
  patches = Object.fromEntries(arr.map((p) => [p.id, { literal: p.literal, idiomatic: p.idiomatic }]));
}

const file = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const t = patches[s.id];
  if (!t?.literal?.trim() || !t?.idiomatic?.trim()) continue;
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
  applied++;
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} patches to ${file}`);
