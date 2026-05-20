#!/usr/bin/env node
/** Fix batch3 id shift: apply T[n+1] to sentence n for s0230–s0255. */
import { readFileSync, writeFileSync } from 'fs';

const path = 'data/jiutangshu/016.json';
const batchSrc = readFileSync('scripts/_apply-ch016-batch3.mjs', 'utf8');
const T = eval(`(${batchSrc.match(/const T = (\{[\s\S]*?\n\});/)[1]})`);

const START = 230;
const END = 255;

const data = JSON.parse(readFileSync(path, 'utf8'));
let n = 0;
for (const block of data.content) {
  for (const s of block.sentences || []) {
    const num = parseInt(s.id.slice(1), 10);
    if (num < START || num > END) continue;
    const srcId = `s${String(num + 1).padStart(4, '0')}`;
    const pair = T[srcId];
    if (!pair) throw new Error(`Missing ${srcId} for ${s.id}`);
    if (pair.literal === pair.idiomatic) throw new Error(`${s.id}: literal === idiomatic`);
    s.translations[0].literal = pair.literal;
    s.translations[0].idiomatic = pair.idiomatic;
    n++;
  }
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Shift-fixed', n, 'sentences');
