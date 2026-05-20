#!/usr/bin/env node
/** Batch 5: s0401–s0423 (Jiutangshu ch.004, Gaozong 1 — Linde 2, fengshan departure; no historian comment in range) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter no snow fell.',
  },
  s0402: {
    literal:
      'In the second year of Linde, spring, first month, on renwu, he proceeded to the Eastern Capital.',
    idiomatic: 'In Linde 2, on renwu of the first spring month, he went to the eastern capital.',
  },
  s0403: {
    literal: 'On dingyou he proceeded to Hebi Palace.',
    idiomatic: 'On dingyou he went to Hebi Palace.',
  },
  s0404: {
    literal: 'On wuzi he reviewed prisoners in Yong and Luo prefectures and various offices.',
    idiomatic: 'On wuzi he reviewed prisoners in Yong, Luo, and the central offices.',
  },
  s0405: {
    literal:
      'On jiazi, because the procession toward Mount Tai had begun, civil-service selection was suspended.',
    idiomatic: 'On jiazi, with the fengshan procession under way, civil examinations were suspended.',
  },
  s0406: {
    literal:
      'On jiayin Jiang Ke, Concurrent Minister of Military Affairs and Duke of Yong\'an, was made Same Rank as the Three Offices of the Eastern and Western Terraces.',
    idiomatic:
      'On jiayin Jiang Ke, minister of military affairs and Duke of Yong\'an, was given third rank at both terraces.',
  },
  s0407: {
    literal: 'On xinwei the Qianyuan Hall in the Eastern Capital was completed.',
    idiomatic: 'On xinwei the Qianyuan Hall in the eastern capital was finished.',
  },
  s0408: {
    literal: 'On the intercalary month, guiyou, there was a solar eclipse.',
    idiomatic: 'On guiyou in the intercalary month the sun was eclipsed.',
  },
  s0409: {
    literal:
      'On bingwu a selective amnesty was proclaimed within the three area commands of Gui, Guang, and Qian for great felonies and above.',
    idiomatic:
      'On bingwu he issued a partial amnesty in the Gui, Guang, and Qian commands for capital crimes and above.',
  },
  s0410: {
    literal:
      'On bingyin military exercises were held on the south slope of Mount Mang; he watched from the northern city tower.',
    idiomatic:
      'On bingyin he held a military review on the south slope of Mount Mang and watched from the north city tower.',
  },
  s0411: {
    literal:
      'On wuchen Lu Dunxin, Left Remonstrator and still Inspector-General of the Great Academy, Baron of Jiaxing, was made Inspector of the Right Chancellor\'s Office; his post as Inspector-General of the Great Academy was discontinued.',
    idiomatic:
      'On wuchen Lu Dunxin, left remonstrator and inspector-general of the great academy, Baron of Jiaxing, became inspector of the right chancellor\'s office; his academy post was abolished.',
  },
  s0412: {
    literal:
      'Sun Chuyue and Yue Yanwei, Vice Directors of the Western Terrace, both ceased participating in state affairs.',
    idiomatic:
      'Sun Chuyue and Yue Yanwei, vice directors of the western secretariat, both left confidential counsel.',
  },
  s0413: {
    literal:
      'On xinmao Li Chunfeng of the Secretariat Library completed a calendar, named the Linde Calendar, and it was promulgated.',
    idiomatic:
      'On xinmao Li Chunfeng of the imperial library finished a calendar called the Linde Calendar and it was issued.',
  },
  s0414: {
    literal:
      'Li Ji, Minister of Works and Duke of Ying, Xu Jingzong, Junior Tutor and Duke of Gaoyang, Lu Dunxin, Right Chancellor and Baron of Jiaxing, and Dou Dexuan, Left Chancellor and Baron of Julu, were made Inspectors of the Fengshan Mission.',
    idiomatic:
      'Li Ji, minister of works and Duke of Ying; Xu Jingzong, junior tutor and Duke of Gaoyang; Lu Dunxin, right chancellor and Baron of Jiaxing; and Dou Dexuan, left chancellor and Baron of Julu were named inspectors of the fengshan mission.',
  },
  s0415: {
    literal: 'In the sixth month great floods in Fuzhou destroyed cities and towns.',
    idiomatic: 'In the sixth month flooding in Fuzhou wrecked cities and towns.',
  },
  s0416: {
    literal: 'In the seventh autumn month Prince of Deng Yuan Yu died.',
    idiomatic: 'In the seventh autumn month Prince Deng Yuan Yu died.',
  },
  s0417: {
    literal:
      'On wuwu of the tenth winter month the empress requested the fengshan ceremony; Liu Xiangdao, Minister of Rites, memorialized requesting the fengshan.',
    idiomatic:
      'On wuwu of the tenth winter month the empress asked for fengshan; Liu Xiangdao, minister of rites, memorialized in support.',
  },
  s0418: {
    literal: 'On guihai King Gao Zang of Goguryeo sent his son Funan to court.',
    idiomatic: 'On guihai Goguryeo\'s King Gao Zang sent Prince Funan to court.',
  },
  s0419: {
    literal: 'On dingmao, about to perform fengshan at Mount Tai, he set out from the Eastern Capital.',
    idiomatic: 'On dingmao, bound for fengshan at Mount Tai, he departed the eastern capital.',
  },
  s0420: {
    literal:
      'That year the harvest was abundant; rice was five cash per dou, and wheat and barley did not even reach the markets.',
    idiomatic:
      'That year the harvest overflowed: rice sold for five cash a dou, and wheat and barley scarcely reached the markets.',
  },
  s0421: {
    literal:
      'On bingzi of the eleventh month he halted at Yuanwu, sacrificed with the lesser tai-lao at the tomb of the Han general Ji Xin, and posthumously enfeoffed him as General of Agile Cavalry.',
    idiomatic:
      'On bingzi of the eleventh month he stopped at Yuanwu, offered the lesser tai-lao at the tomb of the Han general Ji Xin, and posthumously made him General of Agile Cavalry.',
  },
  s0422: {
    literal: 'On gengyin Yu Zhining, military governor of Huazhou and Duke of Yan, died.',
    idiomatic: 'On gengyin Yu Zhining, governor of Huazhou and Duke of Yan, died.',
  },
  s0423: {
    literal: 'On bingwu of the twelfth month he held great public feasting at Qizhou.',
    idiomatic: 'On bingwu of the twelfth month he presided over great public feasting at Qizhou.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/004.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 423;

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

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '004') {
  throw new Error(`Expected chapter 004, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(
  trans.sentences.map((s) => [s.originalId || s.id, s])
);

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

let applied = 0;
for (const s of trans.sentences) {
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

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s0401–s0423)`);
