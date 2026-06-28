#!/usr/bin/env node
/**
 * Repair mingshi/036 source-correspondence issues.
 */

import fs from 'node:fs';

const CHAPTER_PATH = 'data/mingshi/036.json';
const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-mingshi.json';
const META = { translator: 'Garrett M. Petersen (2026)', model: 'Composer 2.5' };

function tr(literal, idiomatic) {
  return {
    lang: 'en',
    literal,
    idiomatic,
    ...META,
  };
}

function sentence(zh, literal, idiomatic) {
  return {
    zh,
    translations: [tr(literal, idiomatic)],
  };
}

function paragraph(...sentences) {
  return { type: 'paragraph', sentences };
}

function findBlockIndex(chapter, sentenceId) {
  for (let i = 0; i < chapter.content.length; i += 1) {
    const block = chapter.content[i];
    if ((block.sentences || []).some((s) => s.id === sentenceId)) return i;
  }
  throw new Error(`Block not found for ${sentenceId}`);
}

function insertAfter(chapter, sentenceId, ...blocks) {
  const index = findBlockIndex(chapter, sentenceId);
  chapter.content.splice(index + 1, 0, ...blocks);
}

function updateSentence(chapter, sentenceId, zh, literal, idiomatic) {
  for (const block of chapter.content) {
    for (const s of block.sentences || []) {
      if (s.id !== sentenceId) continue;
      s.zh = zh;
      s.translations = [tr(literal, idiomatic)];
      return;
    }
  }
  throw new Error(`Sentence not found: ${sentenceId}`);
}

function renumberChapter(chapter) {
  let n = 0;
  for (const block of chapter.content) {
    for (const s of block.sentences || []) {
      n += 1;
      s.id = `s${String(n).padStart(4, '0')}`;
    }
    for (const cell of block.cells || []) {
      n += 1;
      cell.id = `s${String(n).padStart(4, '0')}`;
    }
  }
  chapter.meta.sentenceCount = n;
  chapter.meta.translatedCount = n;
  if (chapter.meta.translators?.[0]) chapter.meta.translators[0].sentences = n;
}

const chapter = JSON.parse(fs.readFileSync(CHAPTER_PATH, 'utf8'));

// 01a363cc8bba — restore solar-eclipse procedure steps after 推日食用數
insertAfter(
  chapter,
  's0028',
  paragraph(
    sentence(
      '經朔 盈縮歷 盈縮差 遲疾歷 遲疾差 加減差 定朔 入交凡分',
      'Mean new moon; expansion-contraction sequence; expansion-contraction difference; slow-rapid sequence; slow-rapid difference; additive-subtractive difference; true new moon; general nodal-entry parts.',
      'Mean new moon; expansion–contraction sequence; expansion–contraction difference; slow–rapid sequence; slow–rapid difference; additive–subtractive difference; true new moon; general nodal-entry parts.',
    ),
  ),
  paragraph(
    sentence(
      '以上皆全錄之。',
      'All of the above are fully recorded.',
      'All of the above are fully recorded.',
    ),
  ),
  paragraph(
    sentence(
      '定入遲疾歷以加減差，加減遲疾即是。',
      'Fixed entry into slow-rapid sequence uses additive-subtractive difference; adding or subtracting slow-rapid is the method.',
      'For fixed entry into the slow–rapid sequence, apply the additive–subtractive difference; adding or subtracting slow–rapid motion is the method.',
    ),
  ),
  paragraph(
    sentence(
      '遲疾定限置定入遲疾歷，以日轉限一十二限二十分乘之，小余不用。',
      'Slow-rapid fixed limit: set fixed entry into slow-rapid sequence; multiply by day-turn limit twelve limits twenty parts; small remainder not used.',
      'Slow–rapid fixed limit: set the fixed entry into the slow–rapid sequence, multiply by the day-turn limit of 12 limits 20 parts; the small remainder is not used.',
    ),
  ),
  paragraph(
    sentence(
      '定限行度以定限，取立成內行度，遲用遲，疾用疾，內減日行分八分二十秒，得之。',
      'Fixed travel-limit degree: with fixed limit, take travel degree from ready tables; slow use slow, fast use fast; inwardly subtract daily travel parts eight parts twenty seconds—then obtained.',
      'Fixed travel-limit degree: with the fixed limit, take the travel degree from the ready tables—use slow for slow, fast for fast—and inwardly subtract 8 parts 20 seconds from the daily travel parts; the result is obtained.',
    ),
  ),
  paragraph(
    sentence(
      '日出分以盈縮歷，從立成內取之，下同。',
      'Sunrise part: from expansion-contraction sequence, take from ready tables; same below.',
      'Sunrise fraction: from the expansion–contraction sequence, take the value from the ready tables; the same applies below.',
    ),
  ),
  paragraph(
    sentence(
      '日入分半晝分取立成內昏分，減去五千二百五十分，得之。',
      'Sunset part and half-daylight part: take dusk part from ready tables; subtract five thousand two hundred fifty parts—then obtained.',
      'Sunset fraction and half-daylight fraction: take the dusk fraction from the ready tables and subtract 5250 parts; the result is obtained.',
    ),
  ),
  paragraph(
    sentence(
      '歲前冬至時黃道宿次',
      'Winter-solstice-before-year hour ecliptic lodge position',
      'Ecliptic lodge at the pre-year winter solstice hour',
    ),
  ),
);

// 6eb7a4943aee — restore lunar-eclipse quantity labels
insertAfter(
  chapter,
  's0082',
  paragraph(
    sentence('經望', 'Mean full moon', 'Mean full moon'),
  ),
);
insertAfter(
  chapter,
  's0087',
  paragraph(
    sentence('定望', 'True full moon', 'True full moon'),
  ),
);
insertAfter(
  chapter,
  's0089',
  paragraph(
    sentence('定限', 'Fixed limit', 'Fixed limit'),
  ),
);
insertAfter(
  chapter,
  's0090',
  paragraph(
    sentence('晨分', 'Morning part', 'Morning fraction'),
  ),
);
insertAfter(
  chapter,
  's0091',
  paragraph(
    sentence('昏分', 'Dusk part', 'Dusk fraction'),
  ),
);
insertAfter(
  chapter,
  's0092',
  paragraph(
    sentence('限數', 'Limit number', 'Limit number'),
  ),
);

// b2ee1489689e — Saturn stationary periods and row labels
updateSentence(
  chapter,
  's0192',
  '合伏 六十九日',
  'Conjunction concealment: 69 days',
  'Conjunction concealment: 69 days',
);
insertAfter(
  chapter,
  's0208',
  paragraph(
    sentence('晨留 八日', 'Morning stationary: 8 days', 'Morning stationary: 8 days'),
  ),
);
updateSentence(
  chapter,
  's0209',
  '晨退 二十八日六九四五 八度六五六七五 六度四六三二五',
  'Morning retrograde: 28 days 6945; 8 degrees 65675; 6 degrees 46325',
  'Morning retrograde: 28 days 6945 parts; 8°65675 parts; 6°46325 parts',
);
updateSentence(
  chapter,
  's0210',
  '夕退 二十八日九六四五 八度六五六七五 六度四六三二五四十四分',
  'Evening retrograde: 28 days 9645; 8 degrees 65675; 6 degrees 46325; 44 parts',
  'Evening retrograde: 28 days 9645 parts; 8°65675 parts; 6°46325 parts; 44 parts',
);
insertAfter(
  chapter,
  's0210',
  paragraph(
    sentence('夕留 八日', 'Evening stationary: 8 days', 'Evening stationary: 8 days'),
  ),
);
updateSentence(
  chapter,
  's0224',
  '夕伏 六十九日',
  'Evening concealment: 69 days',
  'Evening concealment: 69 days',
);

// 562a37d996df — Mercury stationary periods and row labels
updateSentence(
  chapter,
  's0280',
  '合伏 三十九日',
  'Conjunction concealment: 39 days',
  'Conjunction concealment: 39 days',
);
insertAfter(
  chapter,
  's0299',
  paragraph(
    sentence('夕留 五日', 'Evening stationary: 5 days', 'Evening stationary: 5 days'),
  ),
);
updateSentence(
  chapter,
  's0300',
  '夕退 一十日九五三一 三度六九八七 一度五九一三',
  'Evening retrograde: 10 days 9531; 3 degrees 6987; 1 degree 5913',
  'Evening retrograde: 10 days 9531 parts; 3°6987 parts; 1°5913 parts',
);
updateSentence(
  chapter,
  's0309',
  '晨退 一十日九五三一 三度六九八七 一度五九一三 六十一分',
  'Morning retrograde: 10 days 9531; 3 degrees 6987; 1 degree 5913; 61 parts',
  'Morning retrograde: 10 days 9531 parts; 3°6987 parts; 1°5913 parts; 61 parts',
);
insertAfter(
  chapter,
  's0309',
  paragraph(
    sentence('晨留 五日', 'Morning stationary: 5 days', 'Morning stationary: 5 days'),
  ),
);
updateSentence(
  chapter,
  's0327',
  '晨伏 三十九日',
  'Morning concealment: 39 days',
  'Morning concealment: 39 days',
);

// 29a6789bb710 — Venus table headers, labels, and fractional corrections
insertAfter(
  chapter,
  's0235',
  paragraph(
    sentence('段目 段日', 'Segment titles; segment days', 'Segment titles; segment days'),
  ),
  paragraph(
    sentence('平度', 'Mean degree', 'Mean degree'),
  ),
  paragraph(
    sentence('限度', 'Limit degree', 'Limit degree'),
  ),
);
updateSentence(
  chapter,
  's0237',
  '合伏 二十日四零',
  'Conjunction concealment: 20 days 40',
  'Conjunction concealment: 20 days 40 parts',
);
updateSentence(
  chapter,
  's0241',
  '晨疾 三十一日',
  'Morning fast: 31 days',
  'Morning fast: 31 days',
);
updateSentence(
  chapter,
  's0249',
  '晨遲 二十六日',
  'Morning slow: 26 days',
  'Morning slow: 26 days',
);
insertAfter(
  chapter,
  's0251',
  paragraph(
    sentence('八分', '8 parts', '8 parts'),
  ),
);
updateSentence(
  chapter,
  's0252',
  '晨留 三十日',
  'Morning stationary: 30 days',
  'Morning stationary: 30 days',
);
updateSentence(
  chapter,
  's0255',
  '夕留 三十日',
  'Evening stationary: 30 days',
  'Evening stationary: 30 days',
);
updateSentence(
  chapter,
  's0256',
  '夕遲 二十六日',
  'Evening slow: 26 days',
  'Evening slow: 26 days',
);
updateSentence(
  chapter,
  's0265',
  '八分',
  '8 parts',
  '8 parts',
);
updateSentence(
  chapter,
  's0262',
  '夕疾 三十一日',
  'Evening fast: 31 days',
  'Evening fast: 31 days',
);
updateSentence(
  chapter,
  's0266',
  '夕伏 二十日四零',
  'Evening concealment: 20 days 40',
  'Evening concealment: 20 days 40 parts',
);

renumberChapter(chapter);
fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
const now = new Date().toISOString();
const appliedIds = [
  'source-mingshi-036-wikisource-01a363cc8bba',
  'source-mingshi-036-wikisource-6eb7a4943aee',
  'source-mingshi-036-wikisource-b2ee1489689e',
  'source-mingshi-036-wikisource-562a37d996df',
  'source-mingshi-036-wikisource-29a6789bb710',
];
const notes = {
  'source-mingshi-036-wikisource-01a363cc8bba': 'Restored missing solar-eclipse quantity labels and procedural steps between 推日食用數 and 推交常度, including 歲前冬至時黃道宿次.',
  'source-mingshi-036-wikisource-6eb7a4943aee': 'Restored missing lunar-eclipse quantity labels: 經望, 定望, 定限, 晨分, 昏分, 限數.',
  'source-mingshi-036-wikisource-b2ee1489689e': 'Restored Saturn table row labels and missing 晨留/夕留 eight-day stationary rows.',
  'source-mingshi-036-wikisource-562a37d996df': 'Restored Mercury table row labels and missing 夕留/晨留 five-day stationary rows.',
  'source-mingshi-036-wikisource-29a6789bb710': 'Restored Venus table headers and row labels; corrected 晨遲/夕次疾 fractional parts to 八分.',
};
for (const item of queue.items) {
  if (!appliedIds.includes(item.id)) continue;
  item.status = 'applied';
  item.decision = 'applied';
  item.notes = notes[item.id];
  item.reviewedAt = now;
  item.reviewer = 'sdk-repair-chapter';
  item.appliedAt = now;
}
queue.updatedAt = now;
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

console.log(`Repaired ${CHAPTER_PATH}; marked ${appliedIds.length} queue item(s) applied.`);
