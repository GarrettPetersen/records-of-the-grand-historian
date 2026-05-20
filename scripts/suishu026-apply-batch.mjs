#!/usr/bin/env node
/** Apply suishu026 translation batch to current_translation_suishu.json */
import fs from 'node:fs';

const batchNum = parseInt(process.argv[2], 10);
const targetPath = process.argv[3] || 'translations/current_translation_suishu.json';

if (!batchNum || batchNum < 1 || batchNum > 8) {
  console.error('Usage: node scripts/suishu026-apply-batch.mjs <1-8> [translation-file]');
  process.exit(1);
}

const { default: T } = await import(`./suishu026-translations-b${batchNum}.mjs`);
const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  if (T[s.id]) {
    s.literal = T[s.id][0];
    s.idiomatic = T[s.id][1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Batch ${batchNum}: patched ${patched} sentences`);

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Still missing in file: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}
