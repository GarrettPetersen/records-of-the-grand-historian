#!/usr/bin/env node
/**
 * Usage: node scripts/apply-translation-overlay.mjs <overlay.json> <translation-file.json>
 * overlay.json: { "s0202": { "literal": "...", "idiomatic": "..." }, ... }
 */
import fs from 'node:fs';

const overlayPath = process.argv[2];
const targetPath = process.argv[3];
if (!overlayPath || !targetPath) {
  console.error('Usage: node scripts/apply-translation-overlay.mjs <overlay.json> <translation-file.json>');
  process.exit(1);
}

const overlay = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let n = 0;
for (const s of data.sentences) {
  const tr = overlay[s.id];
  if (tr) {
    s.literal = tr.literal;
    s.idiomatic = tr.idiomatic;
    n++;
  }
}
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', n, 'overlays');
