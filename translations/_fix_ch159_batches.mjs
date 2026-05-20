#!/usr/bin/env node
/** Fix off-by-one overlap between ch159 batch3 and batch4. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function writeBatch(n, batch) {
  const lines = batch
    .map(
      (e) =>
        `  { zh: ${JSON.stringify(e.zh)}, literal: ${JSON.stringify(e.literal)}, idiomatic: ${JSON.stringify(e.idiomatic)} }`
    )
    .join(',\n');
  fs.writeFileSync(
    `translations/_ch159_b${n}.mjs`,
    `/** Batch ${n} translations for zizhitongjian ch.159 */\nexport const batch${n} = [\n${lines}\n];\n`
  );
}

const b3 = (await import(pathToFileURL('./translations/_ch159_b3.mjs'))).batch3;
const b4 = (await import(pathToFileURL('./translations/_ch159_b4.mjs'))).batch4;

const b3fixed = b3.slice(1);
const tail299 = b4[0];
b3fixed.push(tail299);

const b4fixed = b4.slice(1);
const countable = JSON.parse(fs.readFileSync('translations/ch159_countable.json', 'utf8'));
const cat = countable[349];
if (cat.zh.startsWith('category:')) {
  b4fixed.push({
    zh: cat.zh,
    literal: 'category: Comprehensive Mirror in Aid of Governance',
    idiomatic: 'category: Comprehensive Mirror in Aid of Governance',
  });
}

writeBatch(3, b3fixed);
writeBatch(4, b4fixed);
console.log('b3', b3fixed.length, 'b4', b4fixed.length);
