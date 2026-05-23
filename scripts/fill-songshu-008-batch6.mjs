#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';

const T = {
  s0501: {
    literal:
      'Right Guard General Zhang Xingshi was made Inspector of Yong: in all editions the character "shi" is omitted.',
    idiomatic:
      'On Zhang Xingshi as Inspector of Yong: all editions omit shi from his name.',
  },
  s0502: {
    literal: 'Supplemented according to the biography of Zhang Xingshi.',
    idiomatic: 'Restored from Zhang Xingshi\'s biography.',
  },
  s0503: {
    literal:
      'At Hualin Park\'s Hanfang Hall he lectured on the Changes: in all editions the character "han" is omitted; supplemented according to Yuan Gui 192.',
    idiomatic:
      'Lectured on the Changes at Hanfang Hall in Hualin Park: all editions omit han; restored from Yuan Gui, juan 192.',
  },
  s0504: {
    literal:
      'Changed gua to mabian gua: the Sanzhao, Beijian, Mao, and Dian editions lack the character "ma"; corrected according to the Bureau edition, the Wei Shu Barbarians of the Isles, and the Nan Shi.',
    idiomatic:
      'Substitution of gua with mabian gua: Sanzhao, Beijian, Mao, and Dian editions lack ma; restored from the Bureau edition, Wei Shu (Barbarians of the Isles), and Nan Shi.',
  },
  s0505: {
    literal:
      'Those in the bureaus punished for it numbered several tens: the Wei Shu Barbarians of the Isles, Nan Shi, and Jiankang Shilu have the character "death" below "punished."',
    idiomatic:
      'Dozens in the bureaus were punished for the offense: Wei Shu, Nan Shi, and Jiankang Shilu add si (put to death) after zuo.',
  },
  s0506: {
    literal: 'Daily ration of salaries: all editions agree.',
    idiomatic: '"Daily ration of salaries": all editions read the same.',
  },
  s0507: {
    literal: 'The Wei Shu Barbarians of the Isles reads "universally cut off salaries."',
    idiomatic: 'Wei Shu has "salaries cut off wholesale."',
  },
  s0508: {
    literal:
      'The Nan Shi and Comprehensive Mirror read "universally cut off salaries" with "bing."',
    idiomatic: 'Nan Shi and Zizhi Tongjian read "salaries cut off in common."',
  },
  s0509: {
    literal: '"Listed in many chapters": the Sanzhao edition reads "lie."',
    idiomatic: '"Listed in the other chapters": the Sanzhao edition reads lie (列).',
  },
  s0510: {
    literal: 'The Beijian, Mao, Dian, and Bureau editions read "bie" (separate).',
    idiomatic: 'Beijian, Mao, Dian, and Bureau editions read bie (別, separately).',
  },
  s0511: {
    literal:
      'Zhang Yuanji\'s Collation Notes says: "The places seen are not limited to one chapter, hence the phrase \'listed in many chapters.\'"',
    idiomatic:
      'Zhang Yuanji\'s Collation Notes explains: "The references appear in more than one chapter, hence liejian zhong pian."',
  },
  s0512: {
    literal:
      '"He lacked outstanding endowment": all editions read "zi" (bearing) for "zi" (endowment); emended according to the Nan Shi.',
    idiomatic:
      '"Lacked talent that stood apart": all editions read zi (bearing) for zi (endowment); corrected to Nan Shi\'s zi (資).',
  },
};

if (!fs.existsSync(path)) {
  console.error(
    `Missing ${path}. Extract batch 6 first, e.g. make start-translation BOOK=songshu CHAPTER=008`,
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const ids = Object.keys(T);
const present = new Set(data.sentences.map((s) => s.id));
const missing = ids.filter((id) => !present.has(id));
if (missing.length) {
  console.error(
    `Missing sentence IDs in ${path}: ${missing.join(', ')}. Extract batch 6 before running this script.`,
  );
  process.exit(1);
}

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) continue;
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Filled', ids.length, 'sentences (s0501–s0512)');
