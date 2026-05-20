#!/usr/bin/env node
/** Batch 15: s1401–s1463 (Jiutangshu ch.019, Yizong–Xizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1401;
const END = 1463;

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
  s1401: {
    literal: 'On yihai Qin Zongquan personally led troops to reinforce Qin Xian.',
    idiomatic: 'Qin Zongquan reinforced Qin Xian.',
  },
  s1402: {
    literal: 'On renwu Yan, Yan, and Bian forces routed Cai rebels at Bianxiao Village; Zongquan fled.',
    idiomatic: 'Allies routed Cai rebels at Bianxiao Village.',
  },
  s1403: {
    literal: 'Sun Ru, hearing Qin Xian defeated, drove all Heyang people to slaughter, threw corpses in the river, burned wards, and left.',
    idiomatic: 'Sun Ru massacred Heyang and withdrew.',
  },
  s1404: {
    literal: 'Imperial armies recovered Meng, Luo, Xu, Ru, Huai, Zheng, Shan, and Guo prefectures.',
    idiomatic: 'Government troops recovered central prefectures.',
  },
  s1405: {
    literal: 'An edict made escort commander Yang Shouzong acting Xu prefect; Bian officer Meng Congyi acting Zheng prefect.',
    idiomatic: 'Yang Shouzong and Meng Congyi took Xu and Zheng.',
  },
  s1406: {
    literal: 'Zhuge Shuang\'s old officer Li Hanzhi from Zezhou recovered Heyang; Huai prefect Zhang Quanyi recovered Luoyang.',
    idiomatic: 'Li Hanzhi and Zhang Quanyi recovered Heyang and Luoyang.',
  },
  s1407: {
    literal: 'Yangzhou officer Bi Shiduo summoned Xuan observation commissioner Qin Yan into Yangzhou and pushed him as military commissioner.',
    idiomatic: 'Bi Shiduo made Qin Yan Yangzhou commissioner.',
  },
  s1408: {
    literal: 'Sixth month, guimao new moon.',
    idiomatic: 'The sixth month opened on guimao.',
  },
  s1409: {
    literal: 'On wushen Tianwei Army commander Yang Shouli and Li Changfu disputed the road and their followers fought.',
    idiomatic: 'Yang Shouli and Li Changfu\'s men brawled in the street.',
  },
  s1410: {
    literal: 'The emperor sent inner envoys to admonish them; they did not stop; that night troops were arrayed on guard.',
    idiomatic: 'Imperial envoys failed to stop the brawl; troops stood guard.',
  },
  s1411: {
    literal: 'On jiyou Shouli attacked Changfu with troops and fought in the main thoroughfare.',
    idiomatic: 'Shouli attacked Changfu in the avenue.',
  },
  s1412: {
    literal: 'Changfu\'s army was beaten and he fled to hold Long prefecture; the emperor ordered escort general Li Maozhen to attack him.',
    idiomatic: 'Changfu fled to Long; Li Maozhen was sent against him.',
  },
  s1413: {
    literal: 'On jiayin Hezhong garrison officer Chang Xingru killed his commander Wang Chongrong and pushed Chongrong\'s brother Chongying as army acting commander.',
    idiomatic: 'Chang Xingru killed Wang Chongrong and made Chongying commander.',
  },
  s1414: {
    literal: 'On bingchen the Directorate of Sacrifices memorialized: "The Ancestral Temple has eleven chambers, eight distant-ancestor chambers, and three separate chambers for Empress Xiaoming and others; since the train twice went to the south all were burned and spirit tablets lost.',
    idiomatic: 'The Sacrifices Directorate reported burned ancestral temples.',
  },
  s1415: {
    literal: 'Now that the great carriage returns to the capital, ancestral spirit tablets should be repaired first, then return to the palace."',
    idiomatic: '"Repair spirit tablets before the palace return," they urged.',
  },
  s1416: {
    literal: '" An edict ordered chancellor Zheng Yanchang, repair-Ancestral-Temple commissioner, to undertake repairs.',
    idiomatic: 'Zheng Yanchang was ordered to repair the temples.',
  },
  s1417: {
    literal: 'Palaces were still unfinished and state strength was exhausted; old rites could not yet be performed; Yanchang asked temporarily to use the Directorate of the Palace\'s great hall as the Ancestral Temple.',
    idiomatic: 'Yanchang proposed a temporary temple in the palace directorate hall.',
  },
  s1418: {
    literal: 'The Ancestral Temple has eleven chambers in twenty-three bays, eleven purlins per bay; the directorate has five bays—he asked eleven bays added to supply eleven chambers.',
    idiomatic: 'He asked eleven bays built to match eleven chambers.',
  },
  s1419: {
    literal: 'An edict said: "Respectfully follow canonical ritual."',
    idiomatic: '"Follow canonical ritual," the throne replied.',
  },
  s1420: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s1421: {
    literal: 'Seventh month, renshen new moon: Long prefect Xue Zhichou surrendered the city to Li Maozhen; Long was taken, Li Changfu and Changren were beheaded, and heads were sent to court.',
    idiomatic: 'Li Maozhen took Long and sent Changfu\'s head to court.',
  },
  s1422: {
    literal: 'On bingzi an order made Wuding commissioner, Acting Left Vice Premier, concurrent Yang prefect, Censor-in-Chief, Pillar of State, Duke of Longxi with fifteen hundred households Li Maozhen Acting Minister of Works and Grand Councillor, concurrent Fengxiang mayor and Fengxiang-Longyou military commissioner.',
    idiomatic: 'Li Maozhen received Fengxiang command and the council.',
  },
  s1423: {
    literal: 'Ninth month, xinwei new moon: Huainan commissioner Gao Pian was killed by his garrison officer Bi Shiduo.',
    idiomatic: 'Bi Shiduo killed Gao Pian.',
  },
  s1424: {
    literal: 'Yang Xingmi pressed Guangling hard; Cai rebel Qin Zongquan sent Sun Ru with thirty thousand across the Huai to contest Yangzhou; food in the city was gone.',
    idiomatic: 'Sun Ru crossed the Huai as Yangzhou starved.',
  },
  s1425: {
    literal: 'Eleventh month: Qin Yan and Bi Shiduo broke siege and fled to Sun Ru\'s army; Xingmi entered and held Yangzhou.',
    idiomatic: 'Xingmi took Yangzhou as Yan and Bi fled to Sun Ru.',
  },
  s1426: {
    literal: 'Qin Yan led Sun Ru\'s troops to attack Guangling; Xingmi sent envoys begging aid from Zhu Quanzhong.',
    idiomatic: 'Xingmi begged Zhu Quanzhong for aid against Guangling.',
  },
  s1427: {
    literal: 'An order made Quanzhong Acting Grand Preceptor, Attendant-in-ordinary, concurrent Yangzhou grand protector, Huainan observation commissioner, and campaign army overall commander.',
    idiomatic: 'Zhu Quanzhong received Huainan command.',
  },
  s1428: {
    literal: 'Bian officer Li Fan led troops to Huai mouth to aid.',
    idiomatic: 'Li Fan reinforced the Huai mouth.',
  },
  s1429: {
    literal: 'Twelfth month, jisi new moon: Dongchuan commissioner Gu Yanlang and Bibi prefect Wang Jian jointly led fifty thousand to attack Chengdu; Chen Jingxuan reported distress and an edict sent envoys to admonish them.',
    idiomatic: 'Wang Jian and Gu Yanlang besieged Chengdu.',
  },
  s1430: {
    literal: 'Wende 1, spring, first month, jihai new moon: the train was at Fengxiang.',
    idiomatic: 'Wende 1 opened at Fengxiang.',
  },
  s1431: {
    literal: 'An order posthumously made former Fengxiang-Longyou observation commissioner, Acting Minister of Education, Grand Councillor, concurrent Fengxiang mayor, Pillar of State, Duke of Xingyang with three thousand households Zheng Tian Grand Tutor, posthumous title Literary and Illustrious.',
    idiomatic: 'Zheng Tian was posthumously Literary and Illustrious.',
  },
  s1432: {
    literal: 'Cai rebel Sun Ru beheaded Qin Yan and Bi Shiduo at Gaoyou.',
    idiomatic: 'Sun Ru killed Qin Yan and Bi Shiduo.',
  },
  s1433: {
    literal: 'Second month, jisi new moon.',
    idiomatic: 'The second month opened on jisi.',
  },
  s1434: {
    literal: 'On renwu the train went from Fengxiang to the capital.',
    idiomatic: 'On renwu the court entered Chang\'an from Fengxiang.',
  },
  s1435: {
    literal: 'Weibo troops mutinied.',
    idiomatic: 'Weibo mutinied.',
  },
  s1436: {
    literal: 'They expelled commander Yue Yanzhen.',
    idiomatic: 'Yue Yanzhen was expelled.',
  },
  s1437: {
    literal: 'Yanzhen\'s son Xiang prefect Congxun led troops to attack Weizhou; the yamen army made petty officer Luo Zongbian acting commander and marched to resist.',
    idiomatic: 'Congxun attacked Weibo; Luo Zongbian resisted.',
  },
  s1438: {
    literal: 'Congxun sought aid from Bian; Zhu Quanzhong sent Zhu Zhen across the river.',
    idiomatic: 'Zhu Zhen crossed the river to aid Congxun.',
  },
  s1439: {
    literal: 'On wuzi the emperor held Chengtian Gate, great amnesty, and changed the era to Wende.',
    idiomatic: 'On wuzi era Wende was proclaimed.',
  },
  s1440: {
    literal: 'Chancellor Wei Zhaodu was also made Minister of Works; Kong Wei and Du Rangneng were made Left and Right Vice Premiers, advanced Palladium Grand Preceptor, and granted the title "Uphold Crisis, Open Fortune, Guard and Pacify Merit Lord."',
    idiomatic: 'The council received grand honors and merit titles.',
  },
  s1441: {
    literal: 'Zhang Jun was also made Minister of War and advanced Palladium Grand Preceptor.',
    idiomatic: 'Zhang Jun became war minister and Palladium Grand Preceptor.',
  },
  s1442: {
    literal: 'Left and Right Divine Strategy Ten Armies overseer, Left Golden Guard senior general, Left and Right Street merit commissioner, Pillar of State, Duke of Hongnong Yang Fugong was advanced Duke of Wei with seven thousand added households and granted the title "Loyal and True, Opening Sage, Stabilizing Nation Merit Lord."',
    idiomatic: 'Yang Fugong became Duke of Wei with a grand merit title.',
  },
  s1443: {
    literal: '" Imperial Guard general, Qianzhong commissioner Li Qian was made Acting Minister of Education and Grand Councillor; guard general Chen Pei Acting Minister of Works, Guang prefect, and Lingnan East military commissioner.',
    idiomatic: 'Li Qian and Chen Pei received high posts.',
  },
  s1444: {
    literal: 'Frontier lords were advanced in rank by difference.',
    idiomatic: 'Frontier lords were promoted variously.',
  },
  s1445: {
    literal: 'Chancellor Wei Zhaodu led civil and military officials to offer the honorific Sagely Literary, Sagely Virtue, Glorious Martial, Grand Filial Emperor.',
    idiomatic: 'Xizong received the honorific Sagely Literary, Sagely Virtue, Glorious Martial, Grand Filial Emperor.',
  },
  s1446: {
    literal: 'Third month, wuxu new moon: received the seal in the main hall.',
    idiomatic: 'On wuxu the honorific was received in the main hall.',
  },
  s1447: {
    literal: 'On gengzi the emperor fell suddenly ill.',
    idiomatic: 'On gengzi Xizong fell gravely ill.',
  },
  s1448: {
    literal: 'On renyin he approached death.',
    idiomatic: 'On renyin death approached.',
  },
  s1449: {
    literal: 'On guimao an edict installed younger brother Prince of Shou Li Jie as imperial younger brother heir to manage state affairs.',
    idiomatic: 'Prince of Shou Li Jie was named heir to manage affairs.',
  },
  s1450: {
    literal: 'That evening he died in Wude Hall; sacred longevity twenty-seven; ministers gave posthumous title Sagely Filial, Respectful, and Settled Filial Emperor; temple name Xizong.',
    idiomatic: 'That night Xizong died at twenty-seven and was temple-named Xizong.',
  },
  s1451: {
    literal: 'That year\'s twelfth month he was buried at Jing Mausoleum.',
    idiomatic: 'In the twelfth month he was buried at Jing Mausoleum.',
  },
  s1452: {
    literal: '【Historian\'s appraisal】 The historian says: The Respectful Emperor succeeded in tender years; government lay with eunuch officials; he was vigilant, reverent, and deeply cautious in sorrow.',
    idiomatic: '【Historian\'s appraisal】 The historian writes: Xizong reigned young under eunuchs, vigilant and deeply cautious.',
  },
  s1453: {
    literal: 'The age\'s way was exchanged for ruin; seas and counties flowed crosswise; Red Eyebrows shook the central plain and the yellow house wandered to distant borders; the black-headed people were charred and the altars were mounds of rubble.',
    idiomatic: 'The realm collapsed: rebels shook the center and the throne fled far.',
  },
  s1454: {
    literal: 'Yet frontier walls still had righteous lords and the heartland had utterly loyal aides who drove heroes and commanded armies, finally executing the Mang-like band and greatly avenging the lost state.',
    idiomatic: 'Loyal generals still destroyed the rebels and avenged the dynasty.',
  },
  s1455: {
    literal: 'Yet one wrong plan by Lingzi nearly lost the great design; though the thread barely remained, tangled silk could not be saved.',
    idiomatic: 'Tian Lingzi\'s error nearly ended the dynasty beyond saving.',
  },
  s1456: {
    literal: 'Vast is Yu\'s trace—empty grief for the hardship of Wenming\'s mandate;',
    idiomatic: 'Yu\'s realm evokes grief for Wenming\'s toil;',
  },
  s1457: {
    literal: 'glorious was the Zhou house—yet King Wen\'s foundation finally fell.',
    idiomatic: 'King Wen\'s Zhou foundation fell at last.',
  },
  s1458: {
    literal: 'It was not Xizong\'s fault of losing the Way—was it the exhaustion of earth\'s fortune?',
    idiomatic: 'Was collapse fate rather than Xizong\'s personal failing?',
  },
  s1459: {
    literal: 'Alas!',
    idiomatic: 'Alas for the fallen house!',
  },
  s1460: {
    literal: '【Eulogy】 Praise says: The cycles approach their end; the ruler was young.',
    idiomatic: '【Eulogy】 The cycles waned under a child emperor.',
  },
  s1461: {
    literal: 'Dust flew from great bandits; waves terrified rival heroes.',
    idiomatic: 'Great bandits rose and heroes clashed like waves.',
  },
  s1462: {
    literal: 'Heaven had sent mourning; few men offered loyalty.',
    idiomatic: 'Heaven sent mourning and loyalty ran thin.',
  },
  s1463: {
    literal: 'Returning the carriage and restoring order were the merit of the imperial guards.',
    idiomatic: 'Restoring the throne was the imperial guards\' merit.',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
