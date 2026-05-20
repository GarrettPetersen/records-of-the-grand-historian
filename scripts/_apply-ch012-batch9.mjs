#!/usr/bin/env node
/** Batch 9: s0801–s0829 (Jiutangshu ch.012, Dezong 1 — Pingliang debacle, end of volume) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 801;
const END = 829;

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
  s0801: {
    literal: 'Li Bi had newly entered the chancellery and therefore prompted officials to argue the point — only then was this edict issued.',
    idiomatic: 'Li Bi, new to power, had officials protest until this reversal was issued.',
  },
  s0802: {
    literal: 'On bingchen the Pingliang officials lost to Tibet, including Cui Hanheng and those below — each was granted one son a regular-rank office.',
    idiomatic: 'On bingchen each captive from Pingliang, down to Cui Hanheng, received a regular post for a son.',
  },
  s0803: {
    literal: 'Left Feathered Forest grand general Han Tan was made Xiazhou prefect and Xia-Sui-Yin military commissioner.',
    idiomatic: 'Han Tan became Xiazhou commissioner on the northern line.',
  },
  s0804: {
    literal: 'On renshen Luo Yuanguang was granted the surname Li and the name Yuanliang.',
    idiomatic: 'On renshen Luo Yuanguang received the imperial surname Li and the name Yuanliang.',
  },
  s0805: {
    literal: 'Minister of the Left, Grand Secretariat Associate Zhang Yanshang died; posthumously made Grand Preceptor.',
    idiomatic: 'Zhang Yanshang died and was posthumously made grand preceptor.',
  },
  s0806: {
    literal: 'On guiyou the Personnel Ministry\'s minor selection was restored.',
    idiomatic: 'On guiyou junior appointments under the Board of Personnel resumed.',
  },
  s0807: {
    literal: 'Eighth month, xinsi new moon: there was a solar eclipse.',
    idiomatic: 'On the eighth month\'s new moon the sun was eclipsed.',
  },
  s0808: {
    literal: 'On dinghai the captive Minister of War Cui Hanheng was able to return.',
    idiomatic: 'On dinghai Cui Hanheng returned from captivity.',
  },
  s0809: {
    literal: 'On jichou Vice Minister of War and Grand Secretariat Associate Liu Hun was made Regular Attendant and ceased managing government affairs.',
    idiomatic: 'On jichou Liu Hun left the chancellery for a regular attendant\'s post.',
  },
  s0810: {
    literal: 'On renshen Supervising Censor Wang Wei was made Runzhou prefect and Zhexi observation commissioner; Changzhou prefect Liu Zan was made Xuanzhou prefect and Xuan-She-Chi observation commissioner.',
    idiomatic: 'On renshen Wang Wei took Zhexi and Liu Zan the Xuan-She-Chi command.',
  },
  s0811: {
    literal: 'On wuxu former Secretariat Vice Director and Grand Secretariat Associate Xiao Fu was demoted to Left Subordinate Heir Apparent, settled at Raozhou — sitting in the affair of clansmen Wei, Pei, Ru, Si, and Ding connecting with the Princess of Guo in sorcery and poison.',
    idiomatic: 'On wuxu Xiao Fu was exiled to Raozhou for kin tied to the Princess of Guo\'s poisoning plot.',
  },
  s0812: {
    literal: 'On wuchen Tibet raided in cold weather; all armies went on alert.',
    idiomatic: 'On wuchen a winter Tibetan raid put the armies on alert.',
  },
  s0813: {
    literal: 'Ninth month, dingsi: Tibet greatly plundered the people of Qianyang, Wushan, and Huating and moved them west of Anhua Gorge.',
    idiomatic: 'In the ninth month Tibet swept Qianyang, Wushan, and Huating and deported the people beyond Anhua Gorge.',
  },
  s0814: {
    literal: 'On gengshen Left Subordinate Heir Apparent Cui Zao died.',
    idiomatic: 'On gengshen Cui Zao died.',
  },
  s0815: {
    literal: 'On guihai the Uyghur qaghan sent the envoy Heluo General to request marriage; the emperor agreed to marry the Princess of Xian\'an to him.',
    idiomatic: 'On guihai the Uyghur qaghan sought marriage and was promised the Princess of Xian\'an.',
  },
  s0816: {
    literal: 'On bingyin Tibet took Huating and also took Lianyun Fort in Jing Prefecture.',
    idiomatic: 'On bingyin Tibet seized Huating and Jingzhou\'s Lianyun Fort.',
  },
  s0817: {
    literal: 'On jiaxu Tibet withdrew, carrying off the households of Bin, Jing, and Long circuits almost to the last.',
    idiomatic: 'On jiaxu Tibet retreated after emptying Bin, Jing, and Long of people.',
  },
  s0818: {
    literal: 'From this Tibet raided often to Jing and Long.',
    idiomatic: 'Raids on Jing and Long then became routine.',
  },
  s0819: {
    literal: 'Winter, tenth month: Tibet repaired Yuan Prefecture\'s walls and garrisoned them.',
    idiomatic: 'In the tenth month Tibet rebuilt and held Yuanzhou.',
  },
  s0820: {
    literal: 'On dinghai Grand Preceptor to the Heir Apparent Li Shuming died.',
    idiomatic: 'On dinghai Li Shuming died.',
  },
  s0821: {
    literal: 'On bingxu Divine Strategy officer Wei Xun memorialized: "The life-taking officers Han Qinxu and more than ten others together with the sorcerer-monk Li Guanghong of Zijing Temple plotted treason; Guanghong declared he was to become ruler of men, set the tenth day of the tenth month for a great rising, and had already appointed ranks of generals and chancellors."',
    idiomatic: 'On bingxu Wei Xun reported a plot by Han Qinxu and a monk who claimed the throne, set for the tenth of the tenth month.',
  },
  s0822: {
    literal: 'An edict ordered arrest and investigation; those implicated in succession numbered more than a hundred dead;',
    idiomatic: 'Investigation followed; more than a hundred were executed;',
  },
  s0823: {
    literal: 'Qinxu was Yougui\'s son — specially pardoned.',
    idiomatic: 'Han Qinxu, Han Yougui\'s son, alone was spared.',
  },
  s0824: {
    literal: 'That month fish tally was again lowered and prefects\' duties suspended.',
    idiomatic: 'That month imperial tallies again relieved prefects of certain duties.',
  },
  s0825: {
    literal: 'Eleventh month, dingchou: Hunan observation commissioner Zhao Jing was made supervising censor.',
    idiomatic: 'In the eleventh month Zhao Jing of Hunan became a supervising censor.',
  },
  s0826: {
    literal: 'That night the capital quaked three times; birds\' nests scattered and fell.',
    idiomatic: 'That night Chang\'an shook thrice and birds\' nests fell from the eaves.',
  },
  s0827: {
    literal: 'On renshen merchants were forbidden to sell mouths, horses, or weapons to the Tangut.',
    idiomatic: 'On renshen trade in slaves, horses, and arms with the Tangut was banned.',
  },
  s0828: {
    literal: 'On xinchou Yan-Fang military commissioner Lun Weiming died.',
    idiomatic: 'On xinchou Lun Weiming of Yan-Fang died.',
  },
  s0829: {
    literal: 'That year the Xuanying Abbey was built on the northern wall of the Great Bright Palace.',
    idiomatic: 'That year the Xuanying Abbey rose on the north wall of Daming Palace.',
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
if (data.metadata.chapter !== '012') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 012; standalone T ready (${Object.keys(T).length} entries).`
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
