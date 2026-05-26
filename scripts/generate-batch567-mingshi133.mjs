#!/usr/bin/env node
/**
 * Generate translations/batch567_translations.json for mingshi ch.133 s0401–s0660.
 * Run: node scripts/generate-batch567-mingshi133.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { TRANSLATIONS } from './batch567-mingshi133-translations.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CHAPTER_PATH = join(ROOT, 'data/mingshi/133.json');
const OUT_PATH = join(ROOT, 'translations/batch567_translations.json');

const START = 401;
const END = 660;

const chapter = JSON.parse(readFileSync(CHAPTER_PATH, 'utf8'));
const expected = [];
for (const para of chapter.content) {
  for (const s of para.sentences) {
    const n = Number(s.id.slice(1));
    if (n >= START && n <= END) expected.push(s.id);
  }
}

const out = {};
const missing = [];
for (const id of expected) {
  const pair = TRANSLATIONS[id];
  if (!pair || pair.length !== 2 || !pair[0]?.trim() || !pair[1]?.trim()) {
    missing.push(id);
    continue;
  }
  out[id] = pair;
}

if (missing.length) {
  console.error('Missing or empty translations:', missing.join(', '));
  process.exit(1);
}

if (Object.keys(out).length !== expected.length) {
  const extra = Object.keys(TRANSLATIONS).filter(
    (id) => Number(id.slice(1)) >= START && Number(id.slice(1)) <= END && !expected.includes(id)
  );
  if (extra.length) console.error('Extra translation keys:', extra.join(', '));
  console.error(`Expected ${expected.length}, got ${Object.keys(out).length}`);
  process.exit(1);
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(out, null, 2)}\n`);

const ids = Object.keys(out).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
console.log(`Wrote ${ids.length} sentences to ${OUT_PATH}`);
console.log(`First: ${ids[0]}, last: ${ids[ids.length - 1]}`);
