#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isPunctuationOnlySentence } from '../sentence-utils.mjs';

const META = { translator: 'Garrett M. Petersen (2026)', model: 'Composer 2.5' };
const chapterPath = 'data/zizhitongjian/159.json';

function normZh(s) {
  return String(s || '').normalize('NFKC').trim();
}

const entriesPath = path.resolve('translations/_ch159_all_entries.mjs');
const { entries } = await import(pathToFileURL(entriesPath).href);
const byZh = new Map();
for (const e of entries) {
  const key = normZh(e.zh);
  if (!byZh.has(key)) byZh.set(key, []);
  byZh.get(key).push(e);
}

const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
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

for (const block of chapter.content) {
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

chapter.meta.translatedCount = chapter.meta.sentenceCount;
if (!chapter.meta.translators?.length) {
  chapter.meta.translators = [{ name: META.translator, model: META.model }];
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2) + '\n');
fs.copyFileSync(chapterPath, 'public/data/zizhitongjian/159.json');
console.log('Applied', matched, 'translations by zh match');
