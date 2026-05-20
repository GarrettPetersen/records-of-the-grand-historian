#!/usr/bin/env node
/** Apply _ch158_b1..b6 to data/zizhitongjian/158.json (522 countable sentences). */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isPunctuationOnlySentence } from '../sentence-utils.mjs';

const META = { translator: 'Garrett M. Petersen (2026)', model: 'Composer 2.5' };
const chapterPath = 'data/zizhitongjian/158.json';

const batches = [];
for (let n = 1; n <= 6; n++) {
  const mod = await import(pathToFileURL(path.resolve(`translations/_ch158_b${n}.mjs`)).href);
  const batch = mod[`batch${n}`];
  if (!Array.isArray(batch)) throw new Error(`batch${n} missing`);
  batches.push(...batch);
}

const chapter = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
let batchIdx = 0;
let translated = 0;

for (const block of chapter.content) {
  for (const s of block.sentences || []) {
    const zh = (s.zh || '').trim();
    if (!zh) continue;

    if (isPunctuationOnlySentence(zh)) {
      s.translations = [{ ...META, literal: '"', idiomatic: '"' }];
      translated++;
      continue;
    }

    if (batchIdx >= batches.length) {
      console.error('Ran out of batch entries at', s.id, zh.slice(0, 40));
      process.exit(1);
    }
    const { literal, idiomatic } = batches[batchIdx++];
    s.translations = [{ ...META, literal, idiomatic }];
    translated++;
  }
  for (const cell of block.cells || []) {
    const zh = (cell.content || '').trim();
    if (!zh) continue;
    if (isPunctuationOnlySentence(zh)) {
      cell.translations = [{ ...META, literal: '"', idiomatic: '"' }];
    } else if (batchIdx < batches.length) {
      const { literal, idiomatic } = batches[batchIdx++];
      cell.translations = [{ ...META, literal, idiomatic }];
    }
    translated++;
  }
}

if (batchIdx !== batches.length) {
  console.error(`Used ${batchIdx} batch entries but had ${batches.length}`);
  process.exit(1);
}

chapter.meta.translatedCount = chapter.meta.sentenceCount;
if (!chapter.meta.translators?.length) {
  chapter.meta.translators = [{ name: META.translator, model: META.model }];
}

fs.writeFileSync(chapterPath, JSON.stringify(chapter, null, 2) + '\n');
fs.copyFileSync(chapterPath, 'public/data/zizhitongjian/158.json');
console.log(`Applied ${batches.length} batch + punctuation entries; translatedCount=${chapter.meta.translatedCount}`);
