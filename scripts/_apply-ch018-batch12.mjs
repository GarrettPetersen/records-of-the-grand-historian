#!/usr/bin/env node
/** Batch 12: s1101–s1133 (Jiutangshu ch.018, Wenzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1101;
const END = 1133;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    for (const s of block.sentences || []) {
      out.set(s.id, { chinese: s.zh, blockIndex });
    }
    blockIndex++;
  }
  return out;
}

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}

const T = {
  s1101: {
    literal: 'Dazhong 13, first month: Shaan-Guo observation commissioner Du Shenquan was made Vice Minister of Revenue and acting revenue commissioner.',
    idiomatic: 'In Dazhong 13\'s first month Du Shenquan took Revenue.',
  },
  s1102: {
    literal: 'Third month: Grand Councillor Xiao Ye left council affairs and kept the post of Minister of Personnel.',
    idiomatic: 'In the third month Xiao Ye left the council but kept Personnel.',
  },
  s1103: {
    literal: 'Fourth month: Hanlin academician-director, Vice Minister of War, edict drafter Jiang Shen was made Grand Councillor at his present rank.',
    idiomatic: 'In the fourth month Jiang Shen joined the Grand Council.',
  },
  s1104: {
    literal: 'Fifth month: the Emperor was unwell; for more than a month he could not hold court.',
    idiomatic: 'In the fifth month Xuanzong fell ill and skipped court for over a month.',
  },
  s1105: {
    literal: 'On the seventh day of the eighth month the testamentary edict installed Prince of Yun as heir apparent to manage state affairs.',
    idiomatic: 'On the eighth month\'s seventh day Prince of Yun was made heir and regent.',
  },
  s1106: {
    literal: 'That day he died at Daming Palace; sacred longevity fifty.',
    idiomatic: 'That day Xuanzong died at Daming Palace at fifty.',
  },
  s1107: {
    literal: 'An edict ordered Vice Director of the Secretariat, Grand Councillor Linghu Tao to act as chief mourner.',
    idiomatic: 'Linghu Tao was ordered to oversee the funeral rites.',
  },
  s1108: {
    literal: 'The ministers gave the posthumous title Sacred Martial Literary Filial Emperor; temple name Xuanzong.',
    idiomatic: 'The court named him Xuanzong, posthumous title Sacred Martial Literary Filial Emperor.',
  },
  s1109: {
    literal: 'Second month of year 14: buried at Zhen Mausoleum.',
    idiomatic: 'In the fourteenth year\'s second month he was buried at Zhen Mausoleum.',
  },
  s1110: {
    literal: '【Historian\'s appraisal】 The historian says: I have heard elders speak of Dazhong times — the Literary Filial Emperor\'s capacity and insight were far-reaching; long tested by hardship, he fully knew the people\'s suffering.',
    idiomatic: '【Historian\'s appraisal】 Elders recalled Dazhong: Xuanzong\'s insight ran deep and hardship had taught him the people\'s pain.',
  },
  s1111: {
    literal: 'From Baoli onward eunuchs usurped power; affairs were often done in their name; capital magnates greatly harassed the poor.',
    idiomatic: 'Since Baoli eunuchs and capital bullies had preyed on commoners.',
  },
  s1112: {
    literal: 'When Dazhong came to rule: on the first day powerful families shrank back; on the second day wicked ministers feared the law; on the third day palace eunuchs trembled.',
    idiomatic: 'Under Xuanzong magnates shrank, corrupt ministers feared law, and eunuchs quailed.',
  },
  s1113: {
    literal: 'Hence punishments were not excessive, the worthy served effectively, the hundred offices and four peaks were calm as a clear breeze; for more than ten years praise filled the roads.',
    idiomatic: 'Justice held, talent served, and for a decade praise filled the roads.',
  },
  s1114: {
    literal: 'In the palace he wore washed clothes; regular meals were no more than a few vessels; unless the empress dowager shared the meal, music was not raised; in years of slight famine worry showed on his face.',
    idiomatic: 'He wore washed palace robes, ate frugally, shunned music except at the empress dowager\'s table, and showed famine on his face.',
  },
  s1115: {
    literal: 'Even close attendants never saw a lazy countenance.',
    idiomatic: 'Even intimates never saw idleness in him.',
  },
  s1116: {
    literal: 'Speaking with ministers, he was solemn yet warm as if receiving guests; when they offered remonstrance he listened with an open breast.',
    idiomatic: 'With ministers he was solemn yet welcoming and heard remonstrance openly.',
  },
  s1117: {
    literal: 'Formerly when emperors walked, eunuchs first spread borneol and turmeric on the ground — he ordered all that removed.',
    idiomatic: 'He abolished the eunuchs\' custom of perfuming the ground before him.',
  },
  s1118: {
    literal: 'When palace women fell ill and physicians cured them, he would slip gold into his sleeve to reward them, admonishing: "Do not let edict envoys know — lest they think I favor attendants privately."',
    idiomatic: 'He secretly rewarded physicians who cured palace women, lest envoys think he played favorites.',
  },
  s1119: {
    literal: 'Such was his respectful thrift and love of goodness.',
    idiomatic: 'Such was his frugal, good-hearted rule.',
  },
  s1120: {
    literal: 'In his late years wind toxins afflicted him; he summoned the Luofu Mountain man Xuanyuan Ji and asked essentials of ordering state and self; of freak arts and deceitful ways he never spoke.',
    idiomatic: 'Late in life he summoned Xuanyuan Ji of Luofu for statecraft and self-cultivation, never for occult tricks.',
  },
  s1121: {
    literal: 'Ji too was a man of the Way.',
    idiomatic: 'Ji himself was a man of the Way.',
  },
  s1122: {
    literal: 'In the spring of year 13 he firmly begged to return to the mountains.',
    idiomatic: 'In Dazhong 13\'s spring Ji begged to return to the mountains.',
  },
  s1123: {
    literal: 'The Emperor said: "Master, stay one more year — We shall build a separate lodge for you on Luofu Mountain."',
    idiomatic: 'Xuanzong asked him to stay a year while a Luofu lodge was built.',
  },
  s1124: {
    literal: 'Ji had no mind to linger; the Emperor said: "Master leaves Us so quickly — does the state have disaster?',
    idiomatic: 'When Ji would not stay, Xuanzong asked whether disaster followed his departure.',
  },
  s1125: {
    literal: 'We hold all under Heaven — how many years may We have?"',
    idiomatic: '"How many years remain to my reign?" he asked.',
  },
  s1126: {
    literal: 'Ji took a brush and wrote the character "forty"; crossing out the middle ten strokes left fourteen — thus fourteen years.',
    idiomatic: 'Ji wrote "forty" and crossed the middle stroke — fourteen years remained.',
  },
  s1127: {
    literal: 'Rise and fall have their number — was it not so!',
    idiomatic: 'Dynastic fortune had its numbered span.',
  },
  s1128: {
    literal: 'Yet the imperial Way and royal plan from start to finish had no flaw; even Han Wendi and Jingdi do not surpass it.',
    idiomatic: 'Yet his reign from first to last had no flaw — even Han Wen and Jing pale beside it.',
  },
  s1129: {
    literal: 'Alas that brief records are lost — old affairs are three or four in ten; sucking ink and wielding the brush, one still feels regret.',
    idiomatic: 'Alas, records are lost and the historian can recover only scraps.',
  },
  s1130: {
    literal: '【Eulogy】 The brilliant lord of Li — truly the Literary Filial One.',
    idiomatic: '【Eulogy】 Tang\'s brilliant lord was the Literary Filial Emperor.',
  },
  s1131: {
    literal: 'Chaff and poison are wholly swept away; the good and wicked are sorted apart.',
    idiomatic: 'Chaff and poison were swept away; good and wicked were sorted.',
  },
  s1132: {
    literal: 'He and Long returned to the realm; the northern deserts lost their miasma.',
    idiomatic: 'Hexi returned and the northern frontier cleared.',
  },
  s1133: {
    literal: 'To this day old folk sing of the enlightened ruler.',
    idiomatic: 'Old folk still sing of the enlightened ruler.',
  },
};
const source = loadSentencesFromData();
for (let n = START; n <= END; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!source.has(id)) throw new Error(`Missing ${id} in ${dataPath}`);
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  const pair = T[id];
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${id}: literal and idiomatic must differ`);
  }
}

if (!existsSync(transPath)) {
  console.log(
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')}).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
  );
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
const hasRange = [...expectedIds].every((id) => sessionIds.has(id));

if (!hasRange) {
  const extracted = extractRange(dataPath, START, END);
  for (const row of extracted) {
    const key = row.originalId;
    if (!sessionIds.has(key)) {
      data.sentences.push(row);
      sessionIds.add(key);
    }
  }
  const stillMissing = [...expectedIds].filter((id) => !sessionIds.has(id));
  if (stillMissing.length) {
    console.log(
      `Session lacks ${stillMissing.join(', ')}; standalone T ready (${Object.keys(T).length} entries). Re-run after the next start-translation batch.`
    );
    process.exit(0);
  }
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src.chinese && row.chinese !== src.chinese) {
    row.chinese = src.chinese;
  } else if (!row.chinese) {
    row.chinese = src.chinese;
  }
}

let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing applied translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ') to', transPath);
