import fs from 'node:fs';
import path from 'node:path';
import { batch2 } from '../translations/_batch2_songshu070.mjs';

const outPath = 'translations/current_translation_songshu.json';
const sourcePath = 'data/songshu/070.json';
const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const byId = new Map(data.sentences.map((row) => [row.id, row]));

let blockIndex = 0;
for (const block of source.content) {
  if (block.type !== 'paragraph') continue;
  for (const sentence of block.sentences || []) {
    const t = batch2[sentence.id];
    if (!t) continue;
    let row = byId.get(sentence.id);
    if (!row) {
      row = {
        id: sentence.id,
        originalId: sentence.id,
        blockIndex,
        chinese: sentence.zh,
        literal: '',
        idiomatic: '',
      };
      data.sentences.push(row);
      byId.set(sentence.id, row);
    }
    row.chinese = sentence.zh;
    row.blockIndex = blockIndex;
    row.literal = t.literal;
    row.idiomatic = t.idiomatic;
  }
  blockIndex++;
}

data.sentences.sort((a, b) => {
  const na = Number(a.id.slice(1));
  const nb = Number(b.id.slice(1));
  return na - nb;
});

fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated ${Object.keys(batch2).length} sentences; total ${data.sentences.length}`);
