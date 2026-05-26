#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAIRS } from './weishu116-s1101-1600-pairs.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'data/weishu/116.json');
const outDir = path.join(root, 'translations');

const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
const extracted = [];
let blockIndex = 0;
for (const block of data.content) {
  if (!block.sentences) continue;
  for (const s of block.sentences) {
    const n = parseInt(s.id.slice(1), 10);
    if (n >= 1101 && n <= 1600) {
      extracted.push({ id: s.id, blockIndex, chinese: s.zh });
    }
  }
  blockIndex++;
}

const batches = [
  { file: 'batch12_weishu.json', start: 1101, end: 1200 },
  { file: 'batch13_weishu.json', start: 1201, end: 1300 },
  { file: 'batch14_weishu.json', start: 1301, end: 1400 },
  { file: 'batch15_weishu.json', start: 1401, end: 1500 },
  { file: 'batch16_weishu.json', start: 1501, end: 1600 },
];

const metadata = {
  book: 'weishu',
  chapter: '116',
  file: 'data/weishu/116.json',
};

let errors = [];

for (const { file, start, end } of batches) {
  const sentences = [];
  for (let n = start; n <= end; n++) {
    const id = `s${String(n).padStart(4, '0')}`;
    const row = extracted.find((r) => r.id === id);
    const pair = PAIRS[id];
    if (!row) errors.push(`missing source ${id}`);
    if (!pair) errors.push(`missing translation ${id}`);
    if (!row || !pair) continue;
    const [literal, idiomatic] = pair;
    if (!literal?.trim() || !idiomatic?.trim()) {
      errors.push(`empty field ${id}`);
    }
    if (literal === row.chinese || idiomatic === row.chinese) {
      errors.push(`identical to chinese ${id}: ${row.chinese}`);
    }
    sentences.push({
      id,
      originalId: id,
      blockIndex: row.blockIndex,
      chinese: row.chinese,
      literal,
      idiomatic,
    });
  }
  const out = { metadata, sentences };
  fs.writeFileSync(path.join(outDir, file), JSON.stringify(out, null, 2) + '\n');
  console.log(`${file}: ${sentences.length} sentences`);
}

if (errors.length) {
  console.error('ERRORS:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('OK: all batches written and validated.');
