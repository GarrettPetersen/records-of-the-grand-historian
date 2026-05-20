#!/usr/bin/env node
/**
 * Generate liaoshi-038-entries.json from source + translation batches.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadSents() {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/liaoshi/038.json'), 'utf8'));
  const sents = [];
  for (const p of d.content) for (const s of p.sentences) sents.push(s);
  return sents;
}

function loadBatches() {
  const dir = path.join(ROOT, 'translations/patches');
  const files = fs.readdirSync(dir)
    .filter((f) => /^liaoshi-038-batch\d+\.json$/.test(f))
    .sort();
  const map = new Map();
  for (const f of files) {
    const arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const e of arr) map.set(e.id, e);
  }
  return map;
}

const sents = loadSents();
const map = loadBatches();
const out = [];
const missing = [];

for (const s of sents) {
  const t = map.get(s.id);
  if (!t) {
    missing.push(s.id);
    out.push({ id: s.id, literal: '', idiomatic: '' });
  } else {
    out.push({ id: s.id, literal: t.literal, idiomatic: t.idiomatic });
  }
}

const outPath = path.join(ROOT, 'translations/patches/liaoshi-038-entries.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${out.length} entries to ${outPath}`);
if (missing.length) {
  console.error(`Missing ${missing.length}: ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '...' : ''}`);
  process.exit(1);
}
