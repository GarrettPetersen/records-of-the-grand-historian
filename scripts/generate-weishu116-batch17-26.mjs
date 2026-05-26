#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAIRS as BASE_PAIRS } from './weishu116-s1601-2587-pairs.mjs';
import { OVERRIDES } from './weishu116-pairs-overrides.mjs';

const PAIRS = { ...BASE_PAIRS, ...OVERRIDES };

function polishPair(id, lit, idm, zh) {
  const fix = (s) => {
    let t = s;
    t = t.replace(/Yangxiao：「/g, 'Yang\'s collation: "');
    t = t.replace(/Wenxiao：「/g, 'Wen\'s collation: "');
    t = t.replace(/Wenxiaogai/g, 'Wen\'s collation changes');
    t = t.replace(/Wenxiaoyin/g, 'Wen cites');
    t = t.replace(/Wenxiaojing/g, 'Wen\'s collation corrects');
    t = t.replace(/Zhuben/g, 'All editions');
    t = t.replace(/Juben/g, 'Bureau edition');
    t = t.replace(/Bainaben/g, 'Bainà edition');
    t = t.replace(/one counties/g, 'one county');
    return t;
  };
  return [fix(lit), fix(idm)];
}

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
    if (n >= 1601 && n <= 2587) {
      extracted.push({ id: s.id, blockIndex, chinese: s.zh });
    }
  }
  blockIndex++;
}

const batches = [
  { file: 'batch17_weishu.json', start: 1601, end: 1700 },
  { file: 'batch18_weishu.json', start: 1701, end: 1800 },
  { file: 'batch19_weishu.json', start: 1801, end: 1900 },
  { file: 'batch20_weishu.json', start: 1901, end: 2000 },
  { file: 'batch21_weishu.json', start: 2001, end: 2100 },
  { file: 'batch22_weishu.json', start: 2101, end: 2200 },
  { file: 'batch23_weishu.json', start: 2201, end: 2300 },
  { file: 'batch24_weishu.json', start: 2301, end: 2400 },
  { file: 'batch25_weishu.json', start: 2401, end: 2500 },
  { file: 'batch26_weishu.json', start: 2501, end: 2587 },
];

const metadata = {
  book: 'weishu',
  chapter: '116',
  file: 'data/weishu/116.json',
};

const stripQuoted = (s) =>
  s
    .replace(/"[^"]*"/g, '')
    .replace(/'[^']*'/g, '')
    .replace(/「[^」]*」/g, '')
    .replace(/『[^』]*』/g, '');
const errors = [];

for (const { file, start, end } of batches) {
  const sentences = [];
  for (let n = start; n <= end; n++) {
    const id = `s${String(n).padStart(4, '0')}`;
    const row = extracted.find((r) => r.id === id);
    const pair = PAIRS[id];
    if (!row) errors.push(`missing source ${id}`);
    if (!pair) errors.push(`missing translation ${id}`);
    if (!row || !pair) continue;
    const [literal, idiomatic] = polishPair(id, pair[0], pair[1], row.chinese);
    if (!literal?.trim() || !idiomatic?.trim()) errors.push(`empty field ${id}`);
    if (literal === row.chinese || idiomatic === row.chinese) {
      errors.push(`identical to chinese ${id}: ${row.chinese}`);
    }
    if (/[\u4e00-\u9fff]/.test(stripQuoted(literal)) || /[\u4e00-\u9fff]/.test(stripQuoted(idiomatic))) {
      errors.push(`cjk outside quotes ${id}`);
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
  fs.writeFileSync(path.join(outDir, file), `${JSON.stringify(out, null, 2)}\n`);
  console.log(
    `${file}: ${sentences.length} sentences (s${String(start).padStart(4, '0')}–s${String(end).padStart(4, '0')})`,
  );
}

if (errors.length) {
  console.error('ERRORS:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('OK: all batches written and validated.');
