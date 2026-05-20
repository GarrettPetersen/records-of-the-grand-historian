#!/usr/bin/env node
import fs from 'node:fs';
import { isPunctuationOnlySentence } from '../sentence-utils.mjs';

const ch = JSON.parse(fs.readFileSync('data/zizhitongjian/158.json', 'utf8'));
const out = [];
for (let blockIndex = 0; blockIndex < ch.content.length; blockIndex++) {
  const block = ch.content[blockIndex];
  for (const s of block.sentences || []) {
    const zh = (s.zh || '').trim();
    if (!zh || isPunctuationOnlySentence(zh)) continue;
    out.push({ id: s.id, blockIndex, zh });
  }
}
fs.writeFileSync('translations/ch158_countable.json', JSON.stringify(out, null, 2) + '\n');
console.log('Wrote', out.length, 'sentences to translations/ch158_countable.json');
