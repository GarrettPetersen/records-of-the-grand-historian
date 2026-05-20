#!/usr/bin/env node
import fs from 'node:fs';

const patchPath = process.argv[2];
const targetPath = process.argv[3] || 'translations/current_translation_yuanshi.json';

if (!patchPath) {
  console.error('Usage: node scripts/apply-json-translation-patch.mjs <patch.json> [target.json]');
  process.exit(1);
}

const patch = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
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
