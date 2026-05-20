#!/usr/bin/env node
/** Batch 3: s0201–s0210 (Jiutangshu ch.026, Rites 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/026.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 210;

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
  s0201: {
    literal: 'For Gaozong\'s temple chamber: Minister of Works, Duke of Ying, Li Ji; Left Vice Director of the Department of State Affairs, Duke of Beiping, Zhang Xingcheng; and Secretariat Director, Duke of Gaotang, Ma Zhou shared sacrifice.',
    idiomatic: 'At Gaozong\'s shrine: Li Ji, Zhang Xingcheng, and Ma Zhou shared sacrifice.',
  },
  s0202: {
    literal: 'For Zhongzong\'s temple chamber: Palace Attendant, Prince of Pingyang, Jing Hui; Palace Attendant, Prince of Fuyang, Huan Yanfan; and Secretariat Director, Prince of Nanyang, Yuan Shuji shared sacrifice.',
    idiomatic: 'At Zhongzong\'s shrine: Jing Hui, Huan Yanfan, and Yuan Shuji shared sacrifice.',
  },
  s0203: {
    literal: 'For Ruizong\'s temple chamber: Grand Tutor of the Heir Apparent, Duke of Xu, Su Gui; and Left Chancellor, Duke of Xu, Liu Youqiu shared sacrifice.',
    idiomatic: 'At Ruizong\'s shrine: Su Gui and Liu Youqiu shared sacrifice.',
  },
  s0204: {
    literal: 'In the first month, an edict stated: In the capital, Crown Princes Zhanghuai, Jiemin, Huizhuang, Huiwen, and Huixuan, together with the Hidden Crown Prince and Crown Princess Yide, were united in one temple, called the Seven Crown Princes\' Temple, for convenience in sacrificial offerings.',
    idiomatic: 'First month, edict: Zhanghuai, Jiemin, Huizhuang, Huiwen, and Huixuan were united with the Hidden Crown Prince and Yide in one shrine, the Seven Crown Princes\' Temple, for easier offerings.',
  },
  s0205: {
    literal: 'At the Grand Temple, meritorious ministers sharing sacrifice: to Gaozu\'s chamber were added Pei Ji and Liu Wenjing; to Taizong\'s, Zhangsun Wuji, Li Jing, and Du Ruhui; to Gaozong\'s, Chu Suiliang, Gao Jifu, and Liu Rengui; to Zhongzong\'s, Di Renjie, Wei Yuanzhong, Wang Tongjiao, and eleven others in all.',
    idiomatic: 'Grand Temple merit-sharing was expanded: Pei Ji and Liu Wenjing for Gaozu; Zhangsun Wuji, Li Jing, and Du Ruhui for Taizong; Chu Suiliang, Gao Jifu, and Liu Rengui for Gaozong; Di Renjie, Wei Yuanzhong, Wang Tongjiao, and eight others for Zhongzong.',
  },
  s0206: {
    literal: 'At great sacrifices, red bullocks were reduced in number.',
    idiomatic: 'Great sacrifices used fewer red bullocks.',
  },
  s0207: {
    literal: 'In the tenth year, inner palace officials were installed at the Grand Temple.',
    idiomatic: 'In year 10, inner-palace officers were assigned to the Grand Temple.',
  },
  s0208: {
    literal: 'In the eleventh year, intercalary third month, a regulation stated: "From this time forward, on the first and fifteenth of each month, the Imperial Kitchen shall prepare food and offer it to the Grand Temple; each chamber one tooth-pattern platter; inner palace officials shall present the offerings. Furthermore, every five days the chamber doors shall be opened for sweeping." Thereafter there were also temples to Xuanzong\'s son the Jingde Crown Prince and to Suzong\'s son the Gongyi Crown Prince.',
    idiomatic: 'Eleventh year, intercalary third month: monthly offerings on the first and fifteenth were ordered—Imperial Kitchen food, one platter per chamber, presented by inner-palace officers; chamber doors opened every five days for sweeping. Later came shrines to Xuanzong\'s son Jingde and Suzong\'s son Gongyi.',
  },
  s0209: {
    literal: 'The Xiaojing Temple was within the Eastern Capital Grand Temple compound; the temples of Empress Zhenshun and Emperor Rang were in the capital.',
    idiomatic: 'The Xiaojing shrine stood in the Eastern Capital temple precinct; Empress Zhenshun and Emperor Rang had shrines in the capital.',
  },
  s0210: {
    literal: 'The rest all received offerings at the four seasons.',
    idiomatic: 'All others received seasonal offerings.',
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
if (data.metadata.chapter !== '026') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 026; standalone T ready (${Object.keys(T).length} entries).`
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
