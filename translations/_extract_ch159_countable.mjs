#!/usr/bin/env node
import fs from 'node:fs';
import { isPunctuationOnlySentence } from '../sentence-utils.mjs';

const chapter = process.argv[2] || '159';
const ch = JSON.parse(fs.readFileSync(`data/zizhitongjian/${chapter}.json`, 'utf8'));
const out = [];
for (let blockIndex = 0; blockIndex < ch.content.length; blockIndex++) {
  const block = ch.content[blockIndex];
  for (const s of block.sentences || []) {
    const zh = (s.zh || '').trim();
    if (!zh || isPunctuationOnlySentence(zh)) continue;
    out.push({ id: s.id, blockIndex, zh });
  }
}
const outPath = `translations/ch${chapter}_countable.json`;
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log('Wrote', out.length, 'sentences to', outPath);
