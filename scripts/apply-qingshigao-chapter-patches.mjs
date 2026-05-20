#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const chapterNum = process.argv[2];
const batchCount = Number(process.argv[3]);
if (!chapterNum || !batchCount) {
  console.error('Usage: node apply-qingshigao-chapter-patches.mjs <chapter> <batchCount>');
  process.exit(1);
}

const chapterPath = `data/qingshigao/${chapterNum}.json`;
const chapter = JSON.parse(readFileSync(chapterPath, 'utf8'));
const sentences = [];
for (const block of chapter.content) {
  for (const s of block.sentences || []) {
    sentences.push({
      id: s.id,
      originalId: s.id,
      blockIndex: chapter.content.indexOf(block),
      chinese: s.zh,
      literal: '',
      idiomatic: '',
    });
  }
}

const targetPath = 'translations/current_translation_qingshigao.json';
const data = {
  metadata: {
    book: 'qingshigao',
    chapter: chapterNum,
    file: chapterPath,
  },
  sentences,
};

writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');

for (let i = 1; i <= batchCount; i++) {
  const n = String(i).padStart(2, '0');
  const patchPath = `translations/patches/patch_qingshigao_${chapterNum}_b${n}.mjs`;
  const start = (i - 1) * 100;
  const end = i === batchCount ? sentences.length : i * 100;
  const batch = data.sentences.slice(start, end);
  const batchPath = `translations/.ch${chapterNum}_batch_${n}.json`;
  writeFileSync(
    batchPath,
    JSON.stringify({ metadata: data.metadata, sentences: batch }, null, 2) + '\n'
  );
  execSync(`node ${patchPath} ${batchPath}`, { stdio: 'inherit' });
  const patched = JSON.parse(readFileSync(batchPath, 'utf8'));
  const map = new Map(patched.sentences.map((s) => [s.id, s]));
  for (const s of data.sentences) {
    const p = map.get(s.id);
    if (p?.literal && p?.idiomatic) {
      s.literal = p.literal;
      s.idiomatic = p.idiomatic;
    }
  }
  writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`Batch ${n}: applied ${patched.sentences.length} sentences`);
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Still missing ${missing.length}: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}
console.log(`All ${data.sentences.length} sentences translated in ${targetPath}`);
