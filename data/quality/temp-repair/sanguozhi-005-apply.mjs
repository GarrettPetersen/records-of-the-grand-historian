#!/usr/bin/env node
import fs from 'fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-sanguozhi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const ITEM_FILES = {
  'source-sanguozhi-005-wikisource-4ed6026f959e': 'data/quality/temp-repair/sanguozhi-005-4ed6026f959e.json',
  'source-sanguozhi-005-wikisource-661465a03181': 'data/quality/temp-repair/sanguozhi-005-661465a03181.json',
  'source-sanguozhi-005-wikisource-ade3ed5473c8': 'data/quality/temp-repair/sanguozhi-005-ade3ed5473c8.json',
  'source-sanguozhi-005-wikisource-4ad2ac800ec0': 'data/quality/temp-repair/sanguozhi-005-4ad2ac800ec0.json',
  'source-sanguozhi-005-wikisource-e657a8e6353b': 'data/quality/temp-repair/sanguozhi-005-e657a8e6353b.json',
};

const SENTENCE_ENDINGS = /([。！？；〈〉()（）])/;
function splitSentences(text) {
  const sentences = [];
  const parts = String(text || '').split(SENTENCE_ENDINGS);
  let current = '';
  for (let i = 0; i < parts.length; i += 1) {
    if (i % 2 === 1) {
      const punctuation = parts[i];
      const isOpeningPunc = /[〈(（]/.test(punctuation);
      if (isOpeningPunc) {
        if (current.trim()) sentences.push(current.trim());
        current = punctuation;
      } else {
        current += punctuation;
        if (current.trim()) { sentences.push(current.trim()); current = ''; }
      }
    } else current += parts[i];
  }
  if (current.trim()) sentences.push(current.trim());
  const merged = [];
  const openingOnly = /^[〈《「『【〔（(\s]+$/;
  const leadingClose = /^([〉》」』】〕）)\]】〉》]+)(.+)$/u;
  for (let sentence of sentences) {
    const m = sentence.match(leadingClose);
    if (m && merged.length > 0) {
      merged[merged.length - 1] += m[1].trimEnd();
      sentence = m[2].trim();
      if (!sentence) continue;
    }
    if (openingOnly.test(sentence)) continue;
    merged.push(sentence);
  }
  return merged;
}

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const applyOrder = [
  'source-sanguozhi-005-wikisource-4ed6026f959e',
  'source-sanguozhi-005-wikisource-661465a03181',
  'source-sanguozhi-005-wikisource-ade3ed5473c8',
  'source-sanguozhi-005-wikisource-4ad2ac800ec0',
  'source-sanguozhi-005-wikisource-e657a8e6353b',
];

for (const id of applyOrder) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing queue item ${id}`);
  const rows = JSON.parse(fs.readFileSync(ITEM_FILES[id], 'utf8'));
  const sourceSents = splitSentences(item.sourceRange.text);
  if (rows.length !== sourceSents.length) {
    throw new Error(`${id}: translation count ${rows.length} != source split ${sourceSents.length}`);
  }
  for (let i = 0; i < sourceSents.length; i += 1) {
    if (rows[i].zh !== sourceSents[i]) {
      throw new Error(`${id} mismatch at ${i}:\n  source: ${sourceSents[i]}\n  row:    ${rows[i].zh}`);
    }
  }
  item.manualTranslations = rows.map((row) => ({
    zh: row.zh,
    literal: row.literal,
    idiomatic: row.idiomatic,
    translator: T,
    model: M,
  }));
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = 'Restored missing Wikisource biography text with manual translations.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}

fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of applyOrder) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied all five source correspondence items for sanguozhi/005.');
