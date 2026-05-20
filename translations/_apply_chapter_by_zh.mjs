#!/usr/bin/env node
/** Apply _chNNN_all_entries.mjs by Chinese text (usage: node ... 160) */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isPunctuationOnlySentence } from '../sentence-utils.mjs';

const chapter = process.argv[2];
if (!chapter) {
  console.error('Usage: node _apply_chapter_by_zh.mjs <chapter>');
  process.exit(1);
}

const META = { translator: 'Garrett M. Petersen (2026)', model: 'Composer 2.5' };
const chapterPath = `data/zizhitongjian/${chapter}.json`;

function normZh(s) {
  return String(s || '').normalize('NFKC').trim();
}

const entriesPath = path.resolve(`translations/_ch${chapter}_all_entries.mjs`);
const { entries } = await import(pathToFileURL(entriesPath).href);
const byZh = new Map();
for (const e of entries) {
  const key = normZh(e.zh);
  if (!byZh.has(key)) byZh.set(key, []);
  byZh.get(key).push(e);
}

const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
let matched = 0;
let missing = 0;

function applyTo(zh, target) {
  const key = normZh(zh);
  const pool = byZh.get(key);
  if (!pool?.length) {
    missing++;
    return;
  }
  const e = pool.shift();
  target.translations = [{ ...META, literal: e.literal, idiomatic: e.idiomatic }];
  matched++;
}

for (const block of data.content) {
  for (const s of block.sentences || []) {
    const zh = (s.zh || '').trim();
    if (!zh) continue;
    if (isPunctuationOnlySentence(zh)) {
      s.translations = [{ ...META, literal: '"', idiomatic: '"' }];
      continue;
    }
    applyTo(zh, s);
  }
  for (const cell of block.cells || []) {
    const zh = (cell.content || '').trim();
    if (!zh) continue;
    if (isPunctuationOnlySentence(zh)) {
      cell.translations = [{ ...META, literal: '"', idiomatic: '"' }];
      continue;
    }
    applyTo(zh, cell);
  }
}

if (missing) {
  console.error('Missing translations for', missing, 'sentences');
  process.exit(1);
}

data.meta.translatedCount = data.meta.sentenceCount;
if (!data.meta.translators?.length) {
  data.meta.translators = [{ name: META.translator, model: META.model }];
}

fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2) + '\n');
fs.copyFileSync(chapterPath, `public/data/zizhitongjian/${chapter}.json`);
console.log(`Applied ${matched} translations to ${chapterPath}`);
