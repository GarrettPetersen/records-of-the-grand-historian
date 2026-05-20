#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const patchPath = process.argv[2];
const targetPath = process.argv[3] || 'translations/current_translation_songshi.json';

if (!patchPath) {
  console.error('Usage: node scripts/apply-translation-patch.mjs <patch.mjs> [target.json]');
  process.exit(1);
}

const patch = (await import(path.resolve(patchPath))).default;
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
