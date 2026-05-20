#!/usr/bin/env node
/** Fix ch166 entries where full zh was translated as quote-only. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const fixes = {
  '」乙卯，貞陽侯淵明亦與僧辯書求迎。': {
    literal:
      '" On yimao, Marquis Zhenyang Yuanming also wrote Senbian asking to be welcomed.',
    idiomatic:
      '" On yimao, Marquis Zhenyang Yuanming also wrote Senbian asking to be welcomed.',
  },
  '」甲子，齊以陸法和為都督荊、雍等十州諸軍事、太尉、大都督、西南道大行台，又以宋蒞為郢州刺史，蒞弟簉為湘州刺史。': {
    literal:
      '" On jiazi, Qi made Lu Fahe Commander-in-Chief of the Military Affairs of the ten provinces of Jing, Yong, and others, Grand Commander, Grand Commander-in-Chief, and Southwest-route Grand Commissioner; they also made Song Li inspector of Ying and Li\'s younger brother Qiao inspector of Xiang.',
    idiomatic:
      '" On jiazi, Qi made Lu Fahe commander of Jing, Yong, and nine other provinces, Grand Commander and Southwest-route Grand Commissioner; Song Li became inspector of Ying and his younger brother Qiao inspector of Xiang.',
  },
  '」對曰：「僕聞克國禮賢，言之道也。': {
    literal: '" He replied, "I have heard that conquering a state means honoring the worthy—that is the Way of speech."',
    idiomatic:
      '" He replied, "I have heard that to conquer a state one honors the worthy—that is the way of words."',
  },
  '」因出令，免梁俘為奴婢者數千口。': {
    literal:
      '" He then issued an order freeing several thousand Liang captives who had been made slaves and servants.',
    idiomatic:
      '" He then issued an order freeing several thousand Liang captives who had been enslaved.',
  },
  '」乃密具袍數千領及錦彩金銀為賞賜之具。': {
    literal:
      '" He secretly prepared several thousand robes and brocades, gold, and silver as gifts.',
    idiomatic:
      '" He secretly prepared several thousand robes, brocades, gold, and silver for rewards.',
  },
  '」霸先曰：「安都嗔我！': {
    literal: '" Baxian said, "Andu is angry with me!',
    idiomatic: '" Baxian said, "Andu is furious with me!',
  },
  '」且曰：「何意全無備？': {
    literal: '" and added, "Why are you completely unprepared?"',
    idiomatic: '" and added, "Why are you utterly without preparations?"',
  },
  '」僧辯曰：「委公北門，何謂無備？': {
    literal: '" Senbian said, "I entrusted the north gate to you—how can you say there were no preparations?"',
    idiomatic:
      '" Senbian said, "I left the north gate to you—how can you say there were none?"',
  },
  '」是夜，霸先縊殺僧辯父子。': {
    literal: '" That night Baxian strangled Senbian and his son.',
    idiomatic: '" That night Baxian strangled Senbian and his son.',
  },
  '」仍請稱臣於齊，永為籓國。': {
    literal: '" He still asked to submit as a minister to Qi and forever be a tributary state.',
    idiomatic: '" He still asked to submit as Qi\'s minister and remain a tributary state forever.',
  },
  '」故每發輒斃一人，文育軍稍卻。': {
    literal:
      '" Therefore each time he shot an arrow he killed a man; Wenyü\'s army drew back somewhat.',
    idiomatic:
      '" Each time he loosed an arrow he killed someone, and Wenyü\'s army fell back a little.',
  },
  '」及夕，嗣徽等收兵還石頭。': {
    literal: '" By evening, Sihui and the others gathered their troops and returned to Stone City.',
    idiomatic: '" By evening, Sihui and the others withdrew their troops to Stone City.',
  },
  '」飲之而卒，葬贈如禮。': {
    literal: '" He drank it and died; burial and posthumous honors followed ritual.',
    idiomatic: '" He drank it and died; he was buried and honored posthumously according to rites.',
  },
  '」載屍以出，被發步哭而隨之。': {
    literal:
      '" They carried the corpse out; with hair unbound they walked weeping and followed it.',
    idiomatic:
      '" They carried the body out; with hair loose they walked weeping behind it.',
  },
};

const entriesPath = path.resolve('translations/_ch166_all_entries.mjs');
const { entries } = await import(pathToFileURL(entriesPath).href);
let n = 0;
for (const e of entries) {
  const fix = fixes[e.zh];
  if (fix) {
    e.literal = fix.literal;
    e.idiomatic = fix.idiomatic;
    n++;
  }
}

// Rewrite batches from entries - simpler: rewrite all_entries and re-apply
const lines = entries
  .map(
    (e) =>
      `  { zh: ${JSON.stringify(e.zh)}, literal: ${JSON.stringify(e.literal)}, idiomatic: ${JSON.stringify(e.idiomatic)} }`
  )
  .join(',\n');
fs.writeFileSync(
  entriesPath,
  `/** All translations for zizhitongjian ch.166 */\nexport const entries = [\n${lines}\n];\n`
);
console.log('Fixed', n, 'entries in all_entries');
