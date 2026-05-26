#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { PAIRS } from './weishu116-batch4-7-data.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE = path.join(ROOT, 'data/weishu/116.json');
const OUT_DIR = path.join(ROOT, 'translations');

const META = {
  book: 'weishu',
  chapter: '116',
  file: 'data/weishu/116.json',
};

const BATCHES = [
  { file: 'batch4_weishu.json', start: 301, end: 400 },
  { file: 'batch5_weishu.json', start: 401, end: 500 },
  { file: 'batch6_weishu.json', start: 501, end: 600 },
  { file: 'batch7_weishu.json', start: 601, end: 700 },
];

const data = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const byId = new Map();
data.content.forEach((block, blockIndex) => {
  for (const s of block.sentences || []) {
    byId.set(s.id, { zh: s.zh, blockIndex });
  }
});

for (const { file, start, end } of BATCHES) {
  const sentences = [];
  for (let n = start; n <= end; n++) {
    const id = `s${String(n).padStart(4, '0')}`;
    const row = byId.get(id);
    if (!row) throw new Error(`Missing ${id} in source`);
    const pair = PAIRS[id];
    if (!pair) throw new Error(`Missing translation for ${id}`);
    const [literal, idiomatic] = pair;
    if (!literal?.trim() || !idiomatic?.trim()) {
      throw new Error(`Empty translation for ${id}`);
    }
    sentences.push({
      id,
      originalId: id,
      blockIndex: row.blockIndex,
      chinese: row.zh,
      literal,
      idiomatic,
    });
  }
  const out = { metadata: { ...META }, sentences };
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote ${file}: ${sentences.length} sentences`);
}

const missing = Object.keys(PAIRS).filter((id) => {
  const n = +id.slice(1);
  return n < 301 || n > 700;
});
if (missing.length) console.warn('Extra PAIRS keys:', missing);

const needed = [];
for (let n = 301; n <= 700; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!PAIRS[id]) needed.push(id);
}
if (needed.length) {
  console.error('Missing PAIRS:', needed);
  process.exit(1);
}
console.log('All 400 sentences covered.');
