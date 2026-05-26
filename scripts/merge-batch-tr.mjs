#!/usr/bin/env node
/**
 * Merge translations/_batchN_tr.json into translations/current_translation_{book}.json
 * Usage: node scripts/merge-batch-tr.mjs translations/_batch3_tr.json translations/current_translation_mingshi.json
 */
import { readFileSync, writeFileSync } from 'fs';

const [batchPath, targetPath] = process.argv.slice(2);
if (!batchPath || !targetPath) {
  console.error('Usage: node scripts/merge-batch-tr.mjs <batch.json> <current_translation.json>');
  process.exit(1);
}

const batch = JSON.parse(readFileSync(batchPath, 'utf8'));
const cur = JSON.parse(readFileSync(targetPath, 'utf8'));
let merged = 0;

for (const s of cur.sentences) {
  const pair = batch[s.id];
  if (!pair) continue;
  const [literal, idiomatic] = pair;
  if (!literal?.trim() || !idiomatic?.trim()) {
    console.error(`Empty translation for ${s.id}`);
    process.exit(1);
  }
  if (literal.trim() === idiomatic.trim()) {
    console.error(`Identical literal/idiomatic for ${s.id}`);
    process.exit(1);
  }
  s.literal = literal;
  s.idiomatic = idiomatic;
  merged++;
}

writeFileSync(targetPath, `${JSON.stringify(cur, null, 2)}\n`);
console.log(`Merged ${merged} sentences from ${batchPath} into ${targetPath}`);
