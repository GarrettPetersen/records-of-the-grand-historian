#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
const batchPath = process.argv[2];
const targetPath = process.argv[3] || 'translations/current_translation_qingshigao.json';
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));
const target = JSON.parse(readFileSync(targetPath, 'utf8'));
const byId = new Map(batch.map((r) => [r.id, r]));
let n = 0;
for (const s of target.sentences) {
  const t = byId.get(s.id);
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
    n++;
  }
}
writeFileSync(targetPath, JSON.stringify(target, null, 2) + '\n');
console.log(`Applied ${n} translations`);
