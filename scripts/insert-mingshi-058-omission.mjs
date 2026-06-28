#!/usr/bin/env node
/**
 * Insert omitted mingshi/058 tomb-register sentences after the ○山陵 heading.
 */
import fs from 'node:fs';

const CHAPTER_PATH = 'data/mingshi/058.json';
const META = {
  translator: 'Garrett M. Petersen (2026)',
  model: 'Composer 2.5',
};

const SENTENCES = [
  {
    zh: '太祖即位，追上四世帝號。',
    literal:
      'When Taizu took the throne, he posthumously honored four generations of imperial titles.',
    idiomatic:
      'When Taizu took the throne, he posthumously honored four generations of imperial ancestors.',
  },
  {
    zh: '皇祖考熙祖，墓在鳳陽府泗州蠙城北，薦號曰祖陵。',
    literal:
      "The imperial grandfather, posthumous name Xizu, was buried north of Pingcheng in Sizhou, Fengyang Prefecture; the recommended title was Zuling.",
    idiomatic:
      "Taizu's grandfather, posthumously titled Xizu, was buried north of Pingcheng in Sizhou, Fengyang Prefecture; the tomb was given the title Zuling.",
  },
  {
    zh: '設祠祭署，置奉祀一員，陵戶二百九十三。',
    literal:
      'A sacrificial office was established, with one chief sacrificiant appointed and two hundred ninety-three tomb households.',
    idiomatic:
      'A sacrificial office was set up, with one chief sacrificiant and two hundred ninety-three tomb households.',
  },
  {
    zh: '皇考仁祖，墓在鳳陽府太平鄉。',
    literal: "The imperial father, posthumous name Renzu, was buried in Taiping Township, Fengyang Prefecture.",
    idiomatic: "Taizu's father, posthumously titled Renzu, was buried in Taiping Township, Fengyang Prefecture.",
  },
  {
    zh: '太祖至濠，嘗議改葬，不果。',
    literal: 'When Taizu reached Hao, he once deliberated moving the burial, but it was not carried out.',
    idiomatic: 'When Taizu reached Hao, he once considered reinterring the tomb, but the plan was not carried out.',
  },
  {
    zh: '因增土以培其封，令陵旁故人汪文、劉英等二十家守視。',
    literal:
      'He therefore added earth to build up the mound and ordered twenty households of old acquaintances near the tomb, including Wang Wen and Liu Ying, to guard and tend it.',
    idiomatic:
      'He therefore added earth to build up the mound and assigned twenty households of old acquaintances near the tomb, including Wang Wen and Liu Ying, to guard and tend it.',
  },
  {
    zh: '洪武二年薦號曰英陵，後改稱皇陵。',
    literal:
      'In the second year of Hongwu the recommended title was Ying Mausoleum; it was later renamed the imperial mausoleum.',
    idiomatic:
      'In Hongwu year 2 the tomb received the recommended title Ying Mausoleum; it was later renamed the imperial mausoleum.',
  },
  {
    zh: '設皇陵衛並祠祭署，奉祀一員、祀丞三員，俱勳舊世襲。',
    literal:
      'The imperial mausoleum guard and sacrificial office were established, with one chief sacrificiant and three assistant sacrificiants, all hereditary posts held by meritorious old retainers.',
    idiomatic:
      'An imperial mausoleum guard and sacrificial office were established, with one chief sacrificiant and three assistant sacrificiants, all hereditary posts held by meritorious old retainers.',
  },
  {
    zh: '陵戶三千三百四十二，直宿灑掃。',
    literal: 'Tomb households numbered three thousand three hundred forty-two, stationed on duty to sweep and clean.',
    idiomatic: 'There were three thousand three hundred forty-two tomb households, stationed on duty to sweep and clean.',
  },
  {
    zh: '禮生二十四人。',
    literal: 'There were twenty-four ritual officers.',
    idiomatic: 'Twenty-four ritual officers were assigned.',
  },
  {
    zh: '四年，建祖陵廟。',
    literal: 'In the fourth year, the Zuling temple was built.',
    idiomatic: 'In year 4, the Zuling temple was built.',
  },
  {
    zh: '仿唐、宋同堂異室之制，前殿寢殿俱十五楹，東西旁各二，爲夾室，如晉王肅所議。',
    literal:
      'Following the Tang and Song system of one hall with separate chambers, the front hall and sleeping hall each had fifteen bays; on the east and west sides were two each, serving as side chambers, as Wang Su of Jin had proposed.',
    idiomatic:
      'Following the Tang and Song system of one hall with separate chambers, the front hall and sleeping hall each had fifteen bays, with two side chambers on the east and west, as Wang Su of Jin had proposed.',
  },
  {
    zh: '中三楹通爲一室，奉德祖神位，以備袷祭。',
    literal:
      'The central three bays were joined into one chamber to enshrine the spirit tablet of Dezu, to provide for the combined seasonal sacrifice.',
    idiomatic:
      'The central three bays were joined into one chamber for the spirit tablet of Dezu, to provide for the combined seasonal sacrifice.',
  },
  {
    zh: '東一楹奉懿祖，西一楹奉熙祖。',
    literal: 'The eastern bay enshrined Yizu; the western bay enshrined Xizu.',
    idiomatic: 'The eastern bay enshrined Yizu, and the western bay enshrined Xizu.',
  },
  {
    zh: '十九年，命皇太子往泗州修繕祖陵，葬三祖帝后冠服。',
    literal:
      'In the nineteenth year, the crown prince was ordered to go to Sizhou to repair Zuling and bury the crowns and robes of the three ancestral emperors and empresses.',
    idiomatic:
      'In year 19, the crown prince was ordered to go to Sizhou to repair Zuling and bury the crowns and robes of the three ancestral emperors and empresses.',
  },
];

const chapter = JSON.parse(fs.readFileSync(CHAPTER_PATH, 'utf8'));
const headingIndex = chapter.content.findIndex(
  (block) => block.type === 'paragraph' && block.sentences?.some((sentence) => sentence.id === 's0008'),
);
if (headingIndex < 0) {
  console.error('Could not find s0008 heading paragraph.');
  process.exit(1);
}

const nextIdStart = 220;
const newParagraph = {
  type: 'paragraph',
  sentences: SENTENCES.map((row, index) => ({
    id: `s${String(nextIdStart + index).padStart(4, '0')}`,
    zh: row.zh,
    translations: [
      {
        lang: 'en',
        literal: row.literal,
        idiomatic: row.idiomatic,
        ...META,
      },
    ],
  })),
};

chapter.content.splice(headingIndex + 1, 0, newParagraph);
chapter.meta.sentenceCount += SENTENCES.length;
chapter.meta.translatedCount += SENTENCES.length;
chapter.meta.translators[0].sentences += SENTENCES.length;

fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);
console.log(`Inserted ${SENTENCES.length} sentences after s0008 in ${CHAPTER_PATH}.`);
