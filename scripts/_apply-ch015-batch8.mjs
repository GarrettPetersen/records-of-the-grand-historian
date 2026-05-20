#!/usr/bin/env node
/** Batch 8: s0701–s0737 — 37 sentences (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 737;

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
  s0701: {
    literal: "The Emperor was angry.",
    idiomatic: "Xianzong was enraged.",
  },
  s0702: {
    literal: "jihai — Pei Pei was demoted to Jiangling magistrate.",
    idiomatic: "Pei Pei was exiled to Jiangling on jihai.",
  },
  s0703: {
    literal: "Twelfth month, yisi new moon.",
    idiomatic: "The twelfth month opened on yisi.",
  },
  s0704: {
    literal: "gengxu — National University Chancellor Zheng Yuqing memorialized: current civil officials from first to ninth rank, and outer envoys with concurrent capital regular posts, each month from requested autumn cash ten cash per string were to be drawn to repair the National University — approved.",
    idiomatic: "A levy on officials would fund the university.",
  },
  s0705: {
    literal: "yimao — Remonstrating Doctor, acting Chancellery Vice Director, Grand Councillor, Upper Pillar, granted gold-purple fish bag Cui Qun was made Tan prefect and concurrent Censor-in-Chief, Hunan observation commissioner.",
    idiomatic: "Cui Qun was sent to Hunan on yimao.",
  },
  s0706: {
    literal: "He was slandered by Huangfu Bo.",
    idiomatic: "Huangfu Bo had engineered his fall.",
  },
  s0707: {
    literal: "When Qun was demoted, people gnashed teeth at Bo.",
    idiomatic: "The capital hated Huangfu Bo for it.",
  },
  s0708: {
    literal: "Yuanhe 15 — spring, first month, jiaxu new moon: because the Emperor had taken gold elixir and was slightly unwell, the New Year audience was canceled.",
    idiomatic: "Yuanhe 15 opened without New Year rites because of elixir sickness.",
  },
  s0709: {
    literal: "gengchen — Zhen-Ji observation commissioner Wang Chengzong memorialized that in Zhen, Ji, and Shen prefectures each prefecture should have one recording adjutant and three judge officers, and each county one magistrate — approved.",
    idiomatic: "Wang Chengzong won more civil posts in his circuit on gengchen.",
  },
  s0710: {
    literal: "renwu — former Hunan observation commissioner Cui Qun was made acting Revenue Vice Minister and acting revenue commissioner.",
    idiomatic: "Cui Qun returned to fiscal office on renwu.",
  },
  s0711: {
    literal: "bingxu — the Yi-Hai four-prefecture observation office was moved to Yanzhou; observation commissioner Cao Hua was made Yanzhou prefect; from spring first month onward it was constantly overcast, with light rain and snow, clearing at night — seventeen days before it cleared.",
    idiomatic: "Cao Hua moved the Yi-Hai command to Yanzhou amid seventeen days of gloomy weather.",
  },
  s0712: {
    literal: "bingchen — the moon trespassed the great Heart star, their light touching.",
    idiomatic: "The moon brushed Antares on bingchen.",
  },
  s0713: {
    literal: "Qi prefecture's Fengqi county was abolished into Changqing; Quanjie county into Licheng; Tingshan county into Zhangqiu.",
    idiomatic: "Three Qi counties were merged away.",
  },
  s0714: {
    literal: "Yicheng military commissioner Liu Wu came to court.",
    idiomatic: "Liu Wu presented himself at court.",
  },
  s0715: {
    literal: "wuxu — the Emperor received Wu at Linde Hall.",
    idiomatic: "Xianzong met Liu Wu at Linde on wuxu.",
  },
  s0716: {
    literal: "Since taking medicine the Emperor had been unwell and often did not hold court — popular feeling was fearful; when Wu went out and spoke on the road, the capital gradually calmed.",
    idiomatic: "Liu Wu's appearance eased panic while the emperor stayed ill.",
  },
  s0717: {
    literal: "gengzi — Palace Crafts Director Han Cui was made Yan prefect and Yan-Fang-Dan-Yan military commissioner.",
    idiomatic: "Han Cui took Yan-Fang on gengzi.",
  },
  s0718: {
    literal: "That evening the Emperor died at Zhonghe Hall in Daming Palace, age forty-three.",
    idiomatic: "Xianzong died at forty-three that night in Daming Palace.",
  },
  s0719: {
    literal: "Because the death was sudden, all said the inner eunuch Chen Hongzhi murdered him — the historians avoided writing it.",
    idiomatic: "Rumor blamed eunuch Chen Hongzhi for regicide; annalists kept silent.",
  },
  s0720: {
    literal: "xinchou — the testamentary edict was proclaimed.",
    idiomatic: "The death edict was read on xinchou.",
  },
  s0721: {
    literal: "renyin — the imperial guard shifted to the western inner palace.",
    idiomatic: "The guard moved west on renyin.",
  },
  s0722: {
    literal: "Fifth month, dingyou — the hundred officials offered the posthumous title Sacred, Divine, Accomplished in Culture and War, Filial Emperor; temple name Xianzong.",
    idiomatic: "In the fifth month he received temple name Xianzong.",
  },
  s0723: {
    literal: "gengshen — he was buried at Jing Mausoleum.",
    idiomatic: "He was buried at Jingling on gengshen.",
  },
  s0724: {
    literal: "Historian Jiang Xi said: When Xianzong first succeeded, he read the veritable records of successive sages and, startled and admiring, could not put the scrolls down; he turned to the Chancellor and said: \"Taizong's founding was like this, Xuanzong's ordering the realm was like this — having viewed the national histories, I know I am ten thousandfold inferior to the former sages.",
    idiomatic: "Historian Jiang Xi wrote that young Xianzong devoured Tang exemplars and confessed his inferiority to Taizong and Xuanzong.",
  },
  s0725: {
    literal: "In the former sages' age, still needing chancellors and ministers to assist with one heart — how could I today alone govern?\"",
    idiomatic: "He knew even sage kings needed loyal ministers, not solo rule.\"",
  },
  s0726: {
    literal: "From then at Yanying he discussed government; the day clepsydra usually fell five or six notches before he withdrew.",
    idiomatic: "He held long Yanying sessions until late afternoon.",
  },
  s0727: {
    literal: "From Zhenyuan 10 afterward, court authority daily shrank and regional commissioners grew weighty.",
    idiomatic: "Since Zhenyuan 10 the throne had lost power to the provinces.",
  },
  s0728: {
    literal: "Dezong did not entrust administration to chancellors; petty affairs among the people he often decided himself; treacherous men like Pei Yanling and several others advanced by revenue arithmetic — chancellors merely filled posts.",
    idiomatic: "Dezong bypassed chancellors for fiscal cronies like Pei Yanling.",
  },
  s0729: {
    literal: "When the Emperor from the princely residence supervised the state through accession, until Yuanhe, military and state pivots all returned to the chancellors.",
    idiomatic: "Xianzong restored civil rule to the council after decades of eunuch and fiscal sway.",
  },
  s0730: {
    literal: "Hence inside and outside were all ordered, discipline was raised again, and he truly could cut down rebellious steps and execute the bandit hosts.",
    idiomatic: "Order returned and he crushed the great rebellions.",
  },
  s0731: {
    literal: "Wise counsel and heroic decisiveness — in recent antiquity rarely matched; Tang's mid revival was Zhangwu alone.",
    idiomatic: "Jiang Xi ranked his strategic genius among Tang's rarest restorers.",
  },
  s0732: {
    literal: "Pity that he employed Yi and Bo's revenue extraction and drove Qun and Du to the provinces — state principle did not yet reach decay and disorder.",
    idiomatic: "Yet fiscal hardliners and exiling Pei Du and Cui Qun marred the late reign.",
  },
  s0733: {
    literal: "Alas that he overdosed on elixir; eunuchs stole the moment — had Heaven granted more years, he might nearly have reached good order!",
    idiomatic: "Had he lived longer and avoided elixirs and eunuch murder, fuller order might have followed.",
  },
  s0734: {
    literal: "Appraisal says: Zhenyuan lost the reins; bandits squatted like winnowing baskets.",
    idiomatic: "The eulogy opens: after Zhenyuan, rebels held the realm.",
  },
  s0735: {
    literal: "Zhangwu was majestic; he leveled the roaring gatherings.",
    idiomatic: "Xianzong's majesty crushed their uprising.",
  },
  s0736: {
    literal: "We had chancellors; they displayed virtue and reviewed arms.",
    idiomatic: "His ministers paired virtue with force.",
  },
  s0737: {
    literal: "Yuanhe's government was heard in songs of praise.",
    idiomatic: "Yuanhe rule lived on in praise.",
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
if (data.metadata.chapter !== '015') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 015; standalone T ready (${Object.keys(T).length} entries).`
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
