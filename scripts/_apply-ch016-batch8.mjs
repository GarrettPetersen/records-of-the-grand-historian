#!/usr/bin/env node
/** Batch 8: s0701–s0754 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 754;

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
    literal: "Seventh month — National University Chancellor Wei Qianqing died.",
    idiomatic: "In the seventh month Wei Qianqing died.",
  },
  s0702: {
    literal: "Eighth month — Zheng-Hua military commissioner Cao Hua died.",
    idiomatic: "In the eighth month Cao Hua died.",
  },
  s0703: {
    literal: "Acting Right Vice Director and Minister of Revenue Ma Zong died.",
    idiomatic: "Ma Zong died.",
  },
  s0704: {
    literal: "Xingyuan military commissioner Wei Shou died.",
    idiomatic: "Wei Shou died.",
  },
  s0705: {
    literal: "The Emperor by the covered way went to Xingqing Palace; reaching Tonghua Gate he bestowed two hundred bolts of silk on the alms-bowl monk.",
    idiomatic: "The emperor visited Xingqing and gifted a monk at Tonghua Gate.",
  },
  s0706: {
    literal: "He then visited the Five Directions and bestowed gold and silver ingots to followers in graded amounts.",
    idiomatic: "He then toured the Five Directions and rewarded followers.",
  },
  s0707: {
    literal: "Ninth month — Zelu military commissioner Liu Wu was promoted to Grand Councillor.",
    idiomatic: "In the ninth month Liu Wu entered the council.",
  },
  s0708: {
    literal: "Chief ministers and the hundred officials were granted Double Ninth feast at Qujiang Pavilion.",
    idiomatic: "The court held the Double Ninth feast at Qujiang.",
  },
  s0709: {
    literal: "Nanzhao King Qiu Xian presented sixteen kinds of gold, jade, brocade, and patterned silk.",
    idiomatic: "Nanzhao sent sixteen kinds of treasure and silk.",
  },
  s0710: {
    literal: "Tenth month — Jingzhao intendant Han Yu was made Vice Minister of War; Censor-in-Chief Li Shen was made Jiangxi observation commissioner.",
    idiomatic: "In the tenth month Han Yu took War and Li Shen went to Jiangxi.",
  },
  s0711: {
    literal: "Chief Minister Li Fengji was at odds with Li Shen; Shen had contemporary reputation — Fengji feared he would be used as chief minister.",
    idiomatic: "Li Fengji feared Li Shen's reputation would bring him to the council.",
  },
  s0712: {
    literal: "When Shen became censor-in-chief, Han Yu was then made Jingzhao intendant and concurrent Censor-in-Chief, still released from Secretariat audience.",
    idiomatic: "Fengji named Han Yu Jingzhao intendant to block Shen.",
  },
  s0713: {
    literal: "Shen's nature was stern and upright; he repeatedly submitted memorials debating the matter — thus he and Yu argued back and forth, and Fengji then dismissed both.",
    idiomatic: "Li Shen's protests led Fengji to remove both men.",
  },
  s0714: {
    literal: "Yet Shen went out while Yu remained.",
    idiomatic: "Li Shen left the capital while Han Yu stayed.",
  },
  s0715: {
    literal: "Chief Minister Du Yuanying ceased governing affairs and was made Chengdu intendant and Jiannan West military commissioner.",
    idiomatic: "Du Yuanying left the council for Sichuan.",
  },
  s0716: {
    literal: "Dragon Martial commander-in-chief Chen Chu died.",
    idiomatic: "Chen Chu died.",
  },
  s0717: {
    literal: "Vice Minister of War Han Yu was made Vice Minister of Personnel; newly appointed Jiangxi observation commissioner Li Shen was made Vice Minister of Revenue.",
    idiomatic: "Han Yu took Personnel and Li Shen Revenue.",
  },
  s0718: {
    literal: "Shen, having been removed from Jiangxi, was ordered by palace envoy to his residence to bestow jade belt; Shen, citing removal, wept and requested to remain — the palace envoy fully reported — hence together with Yu his office was changed.",
    idiomatic: "Li Shen wept and begged to stay; both men were reassigned.",
  },
  s0719: {
    literal: "Hanlin academician Pang Yan was summoned to answer; he was then granted gold-purple.",
    idiomatic: "Pang Yan was summoned and honored with gold-purple.",
  },
  s0720: {
    literal: "Ten thousand strings capital were granted the Inner Gardens Office and three thousand to the Armory Office.",
    idiomatic: "Inner offices received capital grants.",
  },
  s0721: {
    literal: "Du Yuanying departed to govern Shu; the Emperor at Anfu Gate saw him off and bestowed silk in graded amounts to the Imperial City intendant and Golden Guard commanders.",
    idiomatic: "The emperor farewelled Du Yuanying at Anfu Gate.",
  },
  s0722: {
    literal: "Eleventh month — the Emperor went to Tonghua Gate to watch construction of the Vaisravana image and bestowed five hundred bolts of silk.",
    idiomatic: "In the eleventh month the emperor watched the Vaisravana statue raised.",
  },
  s0723: {
    literal: "Zhedong tribute of sweet vegetables and sea clams was stopped.",
    idiomatic: "Zhedong's sweet vegetable and clam tribute ended.",
  },
  s0724: {
    literal: "Twelfth month — Zhexi observation commissioner Li Deyu memorialized removing 1,015 illicit shrines within his circuit.",
    idiomatic: "Li Deyu tore down 1,015 illicit shrines in Zhexi.",
  },
  s0725: {
    literal: "Changqing 4 — In the first month of Changqing 4, xinhai new moon — the Emperor attended the hall and received audience as normal ritual.",
    idiomatic: "Changqing 4 opened with normal New Year audience.",
  },
  s0726: {
    literal: "The Emperor took metal-and-stone elixir medicine; Recluse Zhang Gao submitted a memorial sharply remonstrating — the Emperor was pleased and summoned him, but Gao could not be found.",
    idiomatic: "A recluse warned against elixirs; the emperor sought him in vain.",
  },
  s0727: {
    literal: "Zelu administrative aide Jia Zhiyan, newly appointed Remonstrating Doctor, Liu Wu submitted a memorial begging to retain him — approved.",
    idiomatic: "Liu Wu kept his aide Jia Zhiyan at court.",
  },
  s0728: {
    literal: "Retired Minister of Rites Kong Die died.",
    idiomatic: "Kong Die died in retirement.",
  },
  s0729: {
    literal: "On xinwei, the Emperor grew gravely ill; an edict ordered the crown prince to supervise the state.",
    idiomatic: "On xinwei Muzong ordered the crown prince to rule in his stead.",
  },
  s0730: {
    literal: "On renshen, the Emperor died in the bedchamber — he was thirty years old.",
    idiomatic: "On renshen Muzong died at thirty.",
  },
  s0731: {
    literal: "The hundred officials submitted posthumous title Sagacious, Cultured, Gracious, Filial Emperor; temple name Muzong.",
    idiomatic: "He was posthumously named Sagacious Cultured Gracious Filial Emperor, temple name Muzong.",
  },
  s0732: {
    literal: "On gengshen of the eleventh month he was buried at Guang Mausoleum.",
    idiomatic: "He was buried at Guang Mausoleum in the eleventh month.",
  },
  s0733: {
    literal: "【Appraisal】 The history officer says: Your servant observes the five phases' shifting and the hundred kings' rise and fall — there is no constant order, no constant chaos; it lies in men, not sent down from Heaven.",
    idiomatic: "The appraisal opens: order and chaos depend on men, not Heaven.",
  },
  s0734: {
    literal: "In the years when the Yellow Emperor held the realm, a hundred years passed without incident;",
    idiomatic: "Under a sage founder, centuries could pass in peace;",
  },
  s0735: {
    literal: "when Shang Xin grasped the map, the four seas flowed in turmoil.",
    idiomatic: "under a tyrant the realm drowned in chaos.",
  },
  s0736: {
    literal: "Formerly when Emperor Zhangwu saw the state's commands not obeyed and grieved that court discipline was about to fall, he then sought worthy men and gathered heroes — and truly was able to seize the great robber's throat and control treacherous ministers' lives.",
    idiomatic: "Xianzong, seeing discipline fail, gathered heroes and throttled rebellion.",
  },
  s0737: {
    literal: "Fifty years of ended soil returned within the tribute borders;",
    idiomatic: "Fifty years of lost territory returned to the map;",
  },
  s0738: {
    literal: "a million households of suffering commoners revived under enlightened transformation.",
    idiomatic: "millions of the afflicted breathed again under his rule.",
  },
  s0739: {
    literal: "Yuanhe government nearly reached full peace.",
    idiomatic: "Yuanhe rule nearly reached peace.",
  },
  s0740: {
    literal: "The owl and kite had just changed to good music when the dragon cauldron was soon wounded by brief fortune.",
    idiomatic: "Just as harmony returned, brief reign shattered it.",
  },
  s0741: {
    literal: "If at the time there had been Ping and Bo as assistants, followed by Wen and Jing's talents, then Tingcou and Kerong would themselves have drawn in the mantis's arms;",
    idiomatic: "With worthy successors like Wen and Jing, Wang Tingcou and Zhu Kerong would have shrunk back;",
  },
  s0742: {
    literal: "would Zhixing and Li You have dared sprout dog-and-rat plots?",
    idiomatic: "Wang Zhixing and Li You would never have dared mutiny.",
  },
  s0743: {
    literal: "Strong robbers would not have eyed Meng Ben's gold; starving servants would not have picked an infant's bait.",
    idiomatic: "Rebels would not have looted the treasury; the desperate would not have stolen even crumbs.",
  },
  s0744: {
    literal: "Observing this feeble lord, one may say it pains the heart — he did not know founding's hardship, did not pity the people's suffering.",
    idiomatic: "This weak sovereign broke the heart: he forgot founding's cost and ignored the people's pain.",
  },
  s0745: {
    literal: "He thought authority in hand could by force control the ten thousand directions;",
    idiomatic: "He thought power in his fist could command the realm;",
  },
  s0746: {
    literal: "he thought the imperial cap on his person could by sitting drive the nine domains.",
    idiomatic: "he thought the crown on his brow could rule while seated.",
  },
  s0747: {
    literal: "He never knew gathered is ten thousand chariots, scattered is a lone man — morning as arms and legs, evening as enemies.",
    idiomatic: "He never saw that unity makes an empire and division makes a lone man, ministers become enemies overnight.",
  },
  s0748: {
    literal: "What Zhongchangzi called \"when fortune shifts and power departs, alone without awakening — is it not that wealth and rank breed inhumanity, indulgence breeds foolish sickness?",
    idiomatic: "As Zhongchangzi wrote, when fortune turns the indulgent ruler never awakens:",
  },
  s0749: {
    literal: "Survival and destruction iterate by it; order and chaos cycle through it.",
    idiomatic: "wealth breeds cruelty and indulgence breeds folly;",
  },
  s0750: {
    literal: 'Thus the appraisal concluded: "Truly this saying!"',
    idiomatic: 'So ends the appraisal: "How true that saying is!"',
  },
  s0751: {
    literal: "Eulogy says: The gracious king was not virtuous; he destroyed measure and overturned government.",
    idiomatic: "The eulogy says: Muzong lacked virtue and wrecked the laws.",
  },
  s0752: {
    literal: "Arrogance and perversity by chance intact — truly relying on leftover blessing.",
    idiomatic: "His reign survived only by his father's legacy.",
  },
  s0753: {
    literal: "Solemn High God, for the people establishing rectitude.",
    idiomatic: "Heaven sets right for the people —",
  },
  s0754: {
    literal: "What sort of man is this, to hastily master the cauldron mandate?",
    idiomatic: "what man was this to seize the throne so rashly?",
  }
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
if (data.metadata.chapter !== '016') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 016; standalone T ready (${Object.keys(T).length} entries).`
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
