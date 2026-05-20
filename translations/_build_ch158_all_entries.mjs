#!/usr/bin/env node
/** Build translations/_ch158_all_entries.mjs — 522 entries aligned to ch158_countable.json */
import fs from 'node:fs';
import { batch1 } from './_ch158_b1.mjs';
import { batch2 } from './_ch158_b2.mjs';
import { batch3 } from './_ch158_b3.mjs';
import { batch4 } from './_ch158_b4.mjs';
import { batch5 } from './_ch158_b5.mjs';
import { batch6 } from './_ch158_b6.mjs';

const field = (s) => JSON.stringify(s);

const countable = JSON.parse(
  fs.readFileSync('translations/ch158_countable.json', 'utf8')
);

/** Remove duplicate batch4 lines that throw off alignment (0-based indices). */
function cleanBatch4(b4) {
  const out = [...b4];
  for (const idx of [94, 91, 86, 84, 28, 27].sort((a, b) => b - a)) {
    out.splice(idx, 1);
  }
  return out;
}

const b4clean = cleanBatch4(batch4);

/** Six sentences missing from batch4 after Ruogan/Yuwuhan Hui's retreat. */
const b4Tail = [
  {
    literal:
      'The pursuers suspected an ambush and did not dare press close.',
    idiomatic:
      'The pursuers suspected an ambush and did not dare press close.',
  },
  {
    literal: 'Tai then entered the pass and encamped on the Wei north bank.',
    idiomatic:
      'Yuwen Tai then entered the pass and encamped on the north bank of the Wei.',
  },
  {
    literal:
      'Huan advanced to Shaan; Tai sent Kaifu Yitong Sansi Daxi Wu and others to resist him.',
    idiomatic:
      'Gao Huan advanced to Shaan; Yuwen Tai sent Daxi Wu and others to block him.',
  },
  {
    literal:
      'Mobile Headquarters Director Feng Zihui said to Huan, "To unify east and west—today is the day.',
    idiomatic:
      'Feng Zihui of the mobile headquarters said to Huan, "To unify east and west—the moment is today.',
  },
  {
    literal:
      'In old times Emperor Taizu of Wei pacified Hanzhong but did not press the victory to take Ba and Shu; the loss lay in hesitation, and regret came too late.',
    idiomatic:
      'Long ago Emperor Taizu of Wei took Hanzhong but did not follow up to seize Ba and Shu; hesitation cost him, and he regretted it ever after.',
  },
  {
    literal: 'I beg Your Highness not to regard it with suspicion.',
    idiomatic: 'I beg you, my lord, not to doubt it.',
  },
];

const insertAt =
  b4clean.findIndex((t) => t.literal.includes('returned at leisure')) + 1;
const b4final = [
  ...b4clean.slice(0, insertAt),
  ...b4Tail,
  ...b4clean.slice(insertAt),
];

const missingAt399 = {
  literal:
    '" Huan deeply agreed, gathered his generals to discuss advancing or halting, and all held that with no fresh grass in the fields and men and horses worn thin, they could not pursue far.',
  idiomatic:
    'Huan was deeply persuaded, called his generals to debate whether to advance, and all said, "There is no fresh grass in the fields; men and horses are exhausted—they cannot be chased far."',
};

const translations = [
  ...batch1,
  ...batch2.slice(0, -1),
  ...batch3.slice(1),
  ...b4final,
  missingAt399,
  ...batch5,
  ...batch6,
];

if (translations.length !== countable.length) {
  console.error(
    `Count mismatch: ${translations.length} translations vs ${countable.length} zh`
  );
  process.exit(1);
}

function quoteEntry() {
  return { literal: '"', idiomatic: '"' };
}

const entries = countable.map(({ zh }, i) => {
  if (zh === '」' || zh === '「' || /^[「」]$/.test(zh)) {
    return { zh, ...quoteEntry() };
  }
  const t = translations[i];
  return { zh, literal: t.literal, idiomatic: t.idiomatic };
});

// Spot-check alignment at known anchors
const anchors = [
  [0, '資治通鑑'],
  [197, '庚申'],
  [198, '春，正月'],
  [395, '歡進至陝'],
  [399, '歡深然之'],
  [499, '太師咸陽王'],
  [521, 'category'],
];
for (const [i, pat] of anchors) {
  if (!countable[i].zh.includes(pat)) {
    console.error(`Anchor fail c[${i}]: expected "${pat}" in "${countable[i].zh}"`);
    process.exit(1);
  }
}

const lines = [
  '/** All 522 entries for zizhitongjian ch.158 (apply by zh text) */',
  '/** Translator: Garrett M. Petersen (2026); Model: Composer 2.5 */',
  'export const entries = [',
  ...entries.map(
    (e) =>
      `  { zh: ${field(e.zh)}, literal: ${field(e.literal)}, idiomatic: ${field(e.idiomatic)} },`
  ),
  '];',
  '',
];

fs.writeFileSync('translations/_ch158_all_entries.mjs', lines.join('\n'));
console.log('Wrote', entries.length, 'entries to translations/_ch158_all_entries.mjs');
