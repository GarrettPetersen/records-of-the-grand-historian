#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const pairsPath = process.argv[2];
const targetPath = process.argv[3];
if (!pairsPath || !targetPath) {
  console.error('Usage: node apply-batch-translations.mjs <pairs.json> <translation-file>');
  process.exit(1);
}

const pairs = JSON.parse(readFileSync(pairsPath, 'utf8'));
const data = JSON.parse(readFileSync(targetPath, 'utf8'));
const map = new Map(pairs.map((p) => [p.id, p]));

for (const s of data.sentences) {
  const p = map.get(s.id);
  if (!p) continue;
  s.literal = p.literal;
  s.idiomatic = p.idiomatic;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${pairs.length} translations`);
