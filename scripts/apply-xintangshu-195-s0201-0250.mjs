#!/usr/bin/env node
import fs from 'node:fs';

const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'Composer 2.5';

const batchPath = 'translations/batch_xintangshu_195_s0201-s0250.json';
const chapterPath = 'data/xintangshu/195.json';
const T = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));
let applied = 0;

for (const para of data.content) {
  if (!para.sentences) continue;
  for (const s of para.sentences) {
    const t = T[s.id];
    if (!t) continue;
    const row = s.translations.find((x) => x.lang === 'en');
    if (!row) throw new Error(`No en row for ${s.id}`);
    row.literal = t.literal;
    row.idiomatic = t.idiomatic;
    row.translator = TRANSLATOR;
    row.model = MODEL;
    applied++;
  }
}

const expected = Object.keys(T).length;
if (applied !== expected) {
  throw new Error(`Applied ${applied}, expected ${expected}`);
}

let translatedCount = 0;
for (const para of data.content) {
  if (!para.sentences) continue;
  for (const s of para.sentences) {
    const row = s.translations?.find((x) => x.lang === 'en');
    if (row?.literal?.trim() && row?.idiomatic?.trim()) translatedCount++;
  }
}
data.meta.translatedCount = translatedCount;
if (!data.meta.translators.includes(TRANSLATOR)) {
  data.meta.translators.push(TRANSLATOR);
}

fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} sentences; translatedCount=${translatedCount}`);
