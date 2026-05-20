#!/usr/bin/env node
/** Apply _ch157_b1..b5 to data/zizhitongjian/157.json by sentence order. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const META = { translator: 'Garrett M. Petersen (2026)', model: 'Composer 2.5' };
const chapterPath = 'data/zizhitongjian/157.json';

const batches = [];
for (let n = 1; n <= 5; n++) {
  const mod = await import(pathToFileURL(path.resolve(`translations/_ch157_b${n}.mjs`)).href);
  const batch = mod[`batch${n}`];
  if (!Array.isArray(batch)) throw new Error(`batch${n} missing`);
  batches.push(...batch);
}

const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
const sentences = [];
for (const block of chapter.content) {
  for (const s of block.sentences || []) {
    if ((s.zh || '').trim()) sentences.push(s);
  }
}

if (batches.length !== sentences.length) {
  console.error(`Batch total ${batches.length} !== chapter sentences ${sentences.length}`);
  process.exit(1);
}

for (let i = 0; i < sentences.length; i++) {
  const { literal, idiomatic } = batches[i];
  sentences[i].translations = [{ ...META, literal, idiomatic }];
}

chapter.meta.translatedCount = sentences.length;
if (!chapter.meta.translators?.length) {
  chapter.meta.translators = [{ name: META.translator, model: META.model }];
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2) + '\n');
fs.copyFileSync(chapterPath, 'public/data/zizhitongjian/157.json');
console.log(`Applied ${sentences.length} translations to ${chapterPath}`);
