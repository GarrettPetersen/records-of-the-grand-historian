#!/usr/bin/env node
/** Fix batch2 id shift: T[n+1] was applied to sentence n for ~s0164–s0199. */
import { readFileSync, writeFileSync } from 'fs';

const path = 'data/jiutangshu/015.json';
const batchSrc = readFileSync('scripts/_apply-ch015-batch2.mjs', 'utf8');
const tMatch = batchSrc.match(/const T = (\{[\s\S]*?\n\});/);
if (!tMatch) throw new Error('parse T failed');
const T = eval(`(${tMatch[1]})`);

const START = 164;
const END = 199;

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
console.log('Shift-fixed', n, 'sentences', `s${START}–s${END}`);
