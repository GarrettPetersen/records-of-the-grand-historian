#!/usr/bin/env node
/**
 * Build liaoshi-038-entries.json from embedded translation table.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TRANSLATIONS } from './liaoshi-038-translations.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/liaoshi/038.json'), 'utf8'));
const sents = [];
for (const p of d.content) for (const s of p.sentences) sents.push(s);

const out = [];
const missing = [];
for (const s of sents) {
  const t = TRANSLATIONS[s.id];
  if (!t) {
    missing.push(s.id);
    out.push({ id: s.id, literal: '', idiomatic: '' });
  } else {
    out.push({ id: s.id, literal: t[0], idiomatic: t[1] });
  }
}

const outPath = path.join(ROOT, 'translations/patches/liaoshi-038-entries.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${out.length} entries; missing: ${missing.length}`);
if (missing.length) {
  console.error(missing.join(', '));
  process.exit(1);
}
