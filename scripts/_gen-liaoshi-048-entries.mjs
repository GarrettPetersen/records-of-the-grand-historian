#!/usr/bin/env node
/** Generate liaoshi-048-entries.json from translation batches. */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'url';
import { T as t1 } from './liaoshi-048-t/s001-135.mjs';
import { T as t2 } from './liaoshi-048-t/s136-270.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const TRANSLATIONS = { ...t1, ...t2 };

const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/liaoshi/048.json'), 'utf8'));
const sents = [];
for (const p of d.content) for (const s of p.sentences) sents.push(s);

const out = [];
const missing = [];

for (const s of sents) {
  const pair = TRANSLATIONS[s.id];
  if (!pair) {
    missing.push(s.id);
    out.push({ id: s.id, literal: '', idiomatic: '' });
  } else {
    out.push({ id: s.id, literal: pair[0], idiomatic: pair[1] });
  }
}

const outPath = path.join(ROOT, 'translations/patches/liaoshi-048-entries.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${out.length} entries to ${outPath}`);
if (missing.length) {
  console.error(`Missing ${missing.length}: ${missing.join(', ')}`);
  process.exit(1);
}

const fixRun = spawnSync('node', ['scripts/fix-liaoshi-048-identical.mjs'], { cwd: ROOT, stdio: 'inherit' });
if (fixRun.status !== 0) process.exit(fixRun.status ?? 1);
