#!/usr/bin/env node
/** Apply translations for suishu 015 batches 03-10. Usage: node apply_suishu015_batches.mjs <batch> <translation.json> */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const batch = process.argv[2];
const targetPath = process.argv[3];
if (!batch || !targetPath) {
  console.error('Usage: node apply_suishu015_batches.mjs <03-10> <translation.json>');
  process.exit(1);
}

const mod = await import(`./suishu015_translations_b${batch}.mjs`);
const T = mod.default;
const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}
const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences (batch ${batch})`);
