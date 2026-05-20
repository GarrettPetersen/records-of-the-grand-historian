#!/usr/bin/env node
/** Batch 15: s1401–s1500 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1401;
const END = 1500;

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

const T = {  s1401: {
    literal: 'Third month, gengzi new moon.',
    idiomatic: 'The third month opened on gengzi.',
  },
  s1402: {
    literal: 'On renyin Yuanzhou senior adjutant Li Deyu was made Chuzhou prefect.',
    idiomatic: 'On renyin Li Deyu was moved to Chuzhou.',
  },
  s1403: {
    literal: 'On gengshen the Emperor visited Longshou Pool to watch palace women praying for rain and composed "Late Spring Joy in Rain."',
    idiomatic: 'On gengshen he watched rain prayers at Longshou and wrote a rain poem.',
  },
  s1404: {
    literal: 'Zhaoyi military commissioner Liu Congjian thrice memorialized asking Wang Ya\'s crimes; Army Commandant Qiu Shiliang heard it with fear.',
    idiomatic: 'Liu Congjian demanded Wang Ya\'s crimes; Qiu Shiliang grew afraid.',
  },
  s1405: {
    literal: 'That day Congjian sent Jiao Chuchang to memorialize, slandering at the guest lodge and asking a face audience.',
    idiomatic: 'He sent Jiao Chuchang to court with sharp complaints.',
  },
  s1406: {
    literal: 'The Emperor summoned Chuchang, comforted him, and sent him away.',
    idiomatic: 'The Emperor comforted Chuchang and dismissed him.',
  },
  s1407: {
    literal: 'Summer, fourth month, gengwu new moon: Henan prefect Zheng Huan was made Left Vice Director; heir-apparent guest at the eastern capital Li Shen was made Henan prefect.',
    idiomatic: 'On gengwu Zheng Huan and Li Shen exchanged Henan posts.',
  },
  s1408: {
    literal: 'On guiyou Bo prefect Pei Hongtai was made Yicheng military commissioner; Remonstrance official Li Rangyi was added acting Diarist of the Bedchamber.',
    idiomatic: 'On guiyou Pei Hongtai took Yicheng; Li Rangyi took the diarist post.',
  },
  s1409: {
    literal: 'On yimao Chaozhou registrar Li Zongmin was made Hengzhou senior adjutant; Jiangzhou prefect Li Jue was made heir-apparent guest at the eastern capital.',
    idiomatic: 'On yimao Li Zongmin and Li Jue were shifted in exile and retirement.',
  },
  s1410: {
    literal: 'On guimao Vice Minister of Personnel Li Yuzhong died.',
    idiomatic: 'On guimao Li Yuzhong died.',
  },
  s1411: {
    literal: 'On xinmao Prince of Zi Xie died.',
    idiomatic: 'On xinmao the Prince of Zi died.',
  },
  s1412: {
    literal: 'On jiawu an edict made Shannan West military commissioner, acting Minister of War Li Guyan Vice Secretariat Director and Grand Councillor;',
    idiomatic: 'On jiawu Li Guyan joined the Grand Council;',
  },
  s1413: {
    literal: 'Left Vice Premier, salt and transport commissioner Linghu Chu was made acting Left Vice Premier and Shannan West military commissioner.',
    idiomatic: 'Linghu Chu took Shannan West.',
  },
  s1414: {
    literal: 'On bingshen Li Guyan was assigned Revenue;',
    idiomatic: 'Li Guyan took Revenue;',
  },
  s1415: {
    literal: 'Li Shi was assigned revenue commission and salt and transport.',
    idiomatic: 'Li Shi took the revenue commission.',
  },
  s1416: {
    literal: 'Fifth month, yihai new moon.',
    idiomatic: 'The fifth month opened on yihai.',
  },
  s1417: {
    literal: 'On guimao Hanlin academician Gui Rong was made Vice Censor-in-Chief.',
    idiomatic: 'On guimao Gui Rong became vice censor-in-chief.',
  },
  s1418: {
    literal: 'On dingwei Supplement Guo Chenggu was made Hua defense commissioner.',
    idiomatic: 'On dingwei Guo Chenggu took Hua.',
  },
  s1419: {
    literal: 'Supplement Lu Zai, saying Chenggu was upright and often sealed and rejected edicts, should not be placed in an outer prefecture, returned the edict.',
    idiomatic: 'Lu Zai returned the edict, praising Guo Chenggu\'s integrity.',
  },
  s1420: {
    literal: 'The next day Chenggu was restored as supplement; Supplement Lu Jun replaced him at Hua.',
    idiomatic: 'Chenggu stayed at court; Lu Jun went to Hua.',
  },
  s1421: {
    literal: 'On yimao at Zichen the Emperor told the premiers: "Governing has been hard since antiquity."',
    idiomatic: 'On yimao he told his premiers that ruling was never easy.',
  },
  s1422: {
    literal: 'Li Shi replied: "If court law is enforced, it is easy."',
    idiomatic: 'Li Shi said enforcement made it easy.',
  },
  s1423: {
    literal: 'On dingsi Right Vice Director Zheng Su was made Shan-Guo metropolitan defense and observation commissioner.',
    idiomatic: 'On dingsi Zheng Su took Shan-Guo.',
  },
  s1424: {
    literal: 'The observation post had been abolished and was restored.',
    idiomatic: 'The Shan-Guo observation post was restored.',
  },
  s1425: {
    literal: 'Secretariat drafter Tang Fu was made Fujian observation commissioner.',
    idiomatic: 'Tang Fu took Fujian.',
  },
  s1426: {
    literal: 'On gengshen Grand Councillor assigned National University chancellor Zheng Tan memorialized: "The newly placed Five Classics doctors should receive salary grain like princely household officers."',
    idiomatic: 'Zheng Tan asked stipends for the new Five Classics doctors.',
  },
  s1427: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s1428: {
    literal: 'On bingyin Zhaoyi reported opening the Yiyi mountain road to Taiyuan and Jinzhou; assented.',
    idiomatic: 'On bingyin Zhaoyi opened a mountain road to Taiyuan.',
  },
  s1429: {
    literal: 'Intercalary fifth month, jisi new moon.',
    idiomatic: 'The intercalary fifth month opened on jisi.',
  },
  s1430: {
    literal: 'On jiashen Hezhong military commissioner Li Cheng was made Left Vice Premier and assigned Grand Master of Splendid Happiness duties.',
    idiomatic: 'On jiashen Li Cheng took the left vice premiership.',
  },
  s1431: {
    literal: 'On yiyou heir-apparent senior mentor at the eastern capital Li Ting was made Hezhong military commissioner.',
    idiomatic: 'On yiyou Li Ting took Hezhong.',
  },
  s1432: {
    literal: 'On bingxu crows gathered at Tang\'an Temple and did not disperse for more than a month.',
    idiomatic: 'Crows haunted Tang\'an Temple for a month.',
  },
  s1433: {
    literal: 'On jichou Divine Strategy great general Wei Zhongqing was made Shuofang-Lingyan military commissioner.',
    idiomatic: 'On jichou Wei Zhongqing took Shuofang-Lingyan.',
  },
  s1434: {
    literal: 'Hunan observation commissioner Lu Zhouren presented twenty thousand strings of surplus cash and eighty thousand bolts of goods;',
    idiomatic: 'Lu Zhouren offered surplus cash and goods;',
  },
  s1435: {
    literal: 'not accepted, returned, and ordered lent to poor households for tax payment.',
    idiomatic: 'the throne refused and lent the cash to poor taxpayers.',
  },
  s1436: {
    literal: 'Sixth month, wuxu new moon.',
    idiomatic: 'The sixth month opened on wuxu.',
  },
  s1437: {
    literal: 'On guihai Henan prefect Li Shen was made acting Minister of Rites, Bian prefect, and Bian military commissioner.',
    idiomatic: 'On guihai Li Shen took Bian and Rites.',
  },
  s1438: {
    literal: 'Autumn, seventh month, wuchen new moon: the Censorate reported: "The Secretariat holds fifty-six thousand four hundred seventy-six volumes of old and new books; before Changqing 2 there are no records.',
    idiomatic: 'On wuchen the Censorate reported chaotic library records.',
  },
  s1439: {
    literal: 'After Dade 5 no new books were received.',
    idiomatic: 'No new books had been logged since Dade 5.',
  },
  s1440: {
    literal: 'We ask to create registers, fill gaps by copying volumes, and report monthly to the Censorate."',
    idiomatic: 'It asked for registers and monthly copying reports.',
  },
  s1441: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s1442: {
    literal: 'On xinwei Left Gold Crow guard general Fu Yi was made Bian-Fang military commissioner.',
    idiomatic: 'On xinwei Fu Yi took Bian-Fang.',
  },
  s1443: {
    literal: 'On guiyou Bian military commissioner Wang Zhixing died.',
    idiomatic: 'On guiyou Wang Zhixing died.',
  },
  s1444: {
    literal: 'On xinmao Vice Minister of Punishments Yin You was made acting Right Vice Premier and Shannan East military commissioner.',
    idiomatic: 'On xinmao Yin You took Shannan East.',
  },
  s1445: {
    literal: 'On renwu Chuzhou prefect Li Deyu was made heir-apparent guest.',
    idiomatic: 'On renwu Li Deyu became heir-apparent guest.',
  },
  s1446: {
    literal: 'On jiawu Gold Crow great general Chen Junshang was made Pinglu military commissioner, replacing Wang Yanwei;',
    idiomatic: 'On jiawu Chen Junshang took Pinglu, replacing Wang Yanwei;',
  },
  s1447: {
    literal: 'Yanwei was made Vice Minister of Revenue and revenue commissioner.',
    idiomatic: 'Wang Yanwei took Revenue.',
  },
  s1448: {
    literal: 'On bingshen Hunan observation commissioner Lu Zhouren presented one hundred thousand strings of surplus cash; Vice Censor-in-Chief Gui Rong impeached the illegal tribute; an edict stored Zhouren\'s cash at Heyin depot.',
    idiomatic: 'On bingshen Lu Zhouren\'s surplus tribute was seized at Heyin.',
  },
  s1449: {
    literal: 'Eighth month, wuxu new moon.',
    idiomatic: 'The eighth month opened on wuxu.',
  },
  s1450: {
    literal: 'On jiachen the false imperial uncle, former Bian-Fang commissioner Xiao Hong, was sentenced to distant exile at Huanzhou.',
    idiomatic: 'On jiachen the impostor Xiao Hong was exiled to Huanzhou.',
  },
  s1451: {
    literal: 'On wushen the empress dowager\'s younger brother Xiao Ben was made Right Companion of the Heir.',
    idiomatic: 'On wushen Xiao Ben became right companion of the heir.',
  },
  s1452: {
    literal: 'Ninth month, dingmao new moon.',
    idiomatic: 'The ninth month opened on dingmao.',
  },
  s1453: {
    literal: 'On gengchen an edict restored the late demoted Kaizhou senior adjutant Song Shenxi to Court Gentleman for Discussion, Right Vice Director, and Grand Councillor, and made his son Shenhui a Chenggu county lieutenant.',
    idiomatic: 'On gengchen Song Shenxi was posthumously rehabilitated; his son received office.',
  },
  s1454: {
    literal: 'Raozhou prefect Ma Zhi was made Protector-General of Annan.',
    idiomatic: 'Ma Zhi took Annan.',
  },
  s1455: {
    literal: 'On xinsi Shouzhou prefect Gao Chenggong was made Yong-Guan frontier commissioner.',
    idiomatic: 'On xinsi Gao Chenggong took Yong-Guan.',
  },
  s1456: {
    literal: 'On xinmao an edict ordered the Secretariat and Academy to copy forty-five thousand two hundred sixty-one missing volumes across the circuits.',
    idiomatic: 'On xinmao the court ordered circuit copying of missing books.',
  },
  s1457: {
    literal: 'Winter, tenth month, dingyou new moon.',
    idiomatic: 'The tenth month opened on dingyou.',
  },
  s1458: {
    literal: 'On jiyou Yangzhou\'s seven Jiangdu counties suffered flood and drought, damaging fields.',
    idiomatic: 'On jiyou Jiangdu counties lost crops to flood and drought.',
  },
  s1459: {
    literal: 'Eleventh month, bingyin new moon.',
    idiomatic: 'The eleventh month opened on bingyin.',
  },
  s1460: {
    literal: 'On gengchen Zhexi observation commissioner Cui Yan died.',
    idiomatic: 'On gengchen Cui Yan died.',
  },
  s1461: {
    literal: 'Heir-apparent guest at the eastern capital Li Deyu was made acting Minister of Revenue and Zhexi observation commissioner.',
    idiomatic: 'Li Deyu returned to Zhexi as acting revenue minister.',
  },
  s1462: {
    literal: 'On renwu Minister of War, heir-apparent tutor Wang Qi was added Grand Master of Splendid Happiness duties.',
    idiomatic: 'On renwu Wang Qi took Splendid Happiness duties.',
  },
  s1463: {
    literal: 'On jiashen Left Vice Premier Li Cheng was added Minister of Personnel.',
    idiomatic: 'On jiashen Li Cheng also took Personnel.',
  },
  s1464: {
    literal: 'Zhongwu commissioner Du Cong and Tianping commissioner Wang Yuanzhong memorialized: within their circuits Ever-Normal charity granary grain, beyond the regular quota, should add one hundred thousand shi.',
    idiomatic: 'Du Cong and Wang Yuanzhong asked to expand charity granaries.',
  },
  s1465: {
    literal: 'Twelfth month, bingshen new moon: Jingzhao prefect, concurrent Censor-in-Chief Xue Yuan shang was made Wuning military commissioner and Xu-Si-Su-Hao observation commissioner; Vice Minister of Revenue, concurrent Vice Censor-in-Chief Gui Rong was made Jingzhao prefect; Supplement Di Jianmo was made Vice Censor-in-Chief.',
    idiomatic: 'On bingshen Xue Yuan shang, Gui Rong, and Di Jianmo were reshuffled.',
  },
  s1466: {
    literal: 'On jiyou Lingnan military commissioner Li Congyi died.',
    idiomatic: 'On jiyou Li Congyi died.',
  },
  s1467: {
    literal: 'On gengxu Hua prefect Lu Jun was made Guangzhou prefect and Lingnan military commissioner;',
    idiomatic: 'On gengxu Lu Jun took Lingnan;',
  },
  s1468: {
    literal: 'Secretariat drafter Cui Guicong was made Hua defense commissioner.',
    idiomatic: 'Cui Guicong took Hua.',
  },
  s1469: {
    literal: 'On xinhai Shannan East military commissioner Feng Su died.',
    idiomatic: 'On xinhai Feng Su died.',
  },
  s1470: {
    literal: 'On renzi Grand Master of the Stud Duan Bolun died; on guichou Vice Minister of War Tang Rushi was made acting Minister of Rites and Shannan East military commissioner.',
    idiomatic: 'Duan Bolun died; Tang Rushi took Shannan East.',
  },
  s1471: {
    literal: 'On jiwei Prince of Xu Zong died.',
    idiomatic: 'On jiwei the Prince of Xu died.',
  },
  s1472: {
    literal: 'Kaicheng 2, spring, first month, yichou new moon.',
    idiomatic: 'Kaicheng 2 opened on yichou.',
  },
  s1473: {
    literal: 'On bingyin Xuanzhou observation commissioner Wang Zhi died.',
    idiomatic: 'On bingyin Wang Zhi died.',
  },
  s1474: {
    literal: 'On yihai Vice Minister of Personnel Cui Ye was made Xuan-She observation commissioner; Right Vice Director Zheng Huan was made Vice Minister of Punishments and acting Left Vice Director.',
    idiomatic: 'On yihai Cui Ye and Zheng Huan were promoted.',
  },
  s1475: {
    literal: 'On gengyin Vice Minister of Revenue and revenue commissioner Wang Yanwei presented his "Army Supply Chart," summarizing: "After Zhide and Qianyuan through Zhenyuan and Yuanhe, the empire had ten observation circuits, twenty-nine military commissions, four defense commands, and three frontier commissions.',
    idiomatic: 'On gengyin Wang Yanwei presented an army supply survey of late Tang forces.',
  },
  s1476: {
    literal: 'Mutual-support armies, dogtooth garrisons, great cities and thoroughfares — all had troops; roughly internal and external military rolls reached eight hundred eighty thousand."',
    idiomatic: 'He reckoned some 880,000 troops under arms.',
  },
  s1477: {
    literal: '"Changqing households totaled three million three hundred fifty thousand, while military rolls were about nine hundred ninety thousand — roughly three households feeding one soldier."',
    idiomatic: 'Three households, he said, supported each soldier.',
  },
  s1478: {
    literal: '"Today yearly tax and corvée income totals little more than thirty-five million, while the central share is one-third."',
    idiomatic: 'Annual revenue barely exceeded 35 million; a third reached the center.',
  },
  s1479: {
    literal: '"Of that third, two parts clothe and reward troops; beyond what prefectures and commissioners keep for soldiers\' food and clothing, the remaining four hundred thousand depend on the revenue commission."',
    idiomatic: 'Most revenue fed armies; 400,000 men relied on the center.',
  },
  s1480: {
    literal: '"',
    idiomatic: 'Thus ended the summary.',
  },
  s1481: {
    literal: 'Second month, yiwei new moon.',
    idiomatic: 'The second month opened on yiwei.',
  },
  s1482: {
    literal: 'On bingshen Vice Minister of Punishments Guo Chenggu died.',
    idiomatic: 'On bingshen Guo Chenggu died.',
  },
  s1483: {
    literal: 'On bingwu night a comet rose in the east, seven feet long, at the start of Wei, pointing west.',
    idiomatic: 'On bingwu a seven-foot comet rose in the east.',
  },
  s1484: {
    literal: 'On wushen Wang Yanwei presented his seventy-volume "Tang Canon," from Wude through Yongzhen.',
    idiomatic: 'On wushen Wang Yanwei presented a seventy-volume Tang chronicle.',
  },
  s1485: {
    literal: 'On gengxu Prince of Jun Wei died.',
    idiomatic: 'On gengxu the Prince of Jun died.',
  },
  s1486: {
    literal: 'On xinyou night the comet was more than a zhang long, traveling straight west, slightly south, at half a degree of Xu.',
    idiomatic: 'On xinyou the comet lengthened toward Xu.',
  },
  s1487: {
    literal: 'On renxu night the comet was more than two zhang long and three feet wide at Woman, nine degrees; thereafter it gradually grew longer and wider.',
    idiomatic: 'On renxu the comet swelled at Woman.',
  },
  s1488: {
    literal: 'Third month, jiazi new moon: forty-eight music-house singing girls were released from the inner palace to go home.',
    idiomatic: 'On jiazi forty-eight palace singers were sent home.',
  },
  s1489: {
    literal: 'On yichou night the comet was five zhang long with two forked tails, one pointing at Di, one covering Fang.',
    idiomatic: 'On yichou a fork-tailed comet blazed.',
  },
  s1490: {
    literal: 'On bingyin the Qujiang feast was stopped.',
    idiomatic: 'On bingyin the Qujiang feast was canceled.',
  },
  s1491: {
    literal: 'That night the comet was six zhang long without forks at Kang, seven degrees. An edict to the Imperial Kitchen: henceforth daily imperial food rations should be divided over ten days; inner construction was stopped.',
    idiomatic: 'A comet crossed Kang; imperial meals were stretched over ten days and inner works halted.',
  },
  s1492: {
    literal: 'On wuchen night the comet was more than eight zhang long, traveling northwest, pointing east, at Zhang, fourteen degrees.',
    idiomatic: 'On wuchen an eight-zhang comet crossed Zhang.',
  },
  s1493: {
    literal: 'On xinwei music officials of the Xuanhui Court\'s "Law Melody" were released.',
    idiomatic: 'On xinwei Xuanhui music officials were freed.',
  },
  s1494: {
    literal: 'On renshen an edict said:',
    idiomatic: 'On renshen the throne proclaimed:',
  },
  s1495: {
    literal: '"I inherit the great structure and face Heaven above, reverent and fearful for a full cycle.',
    idiomatic: '"For twelve years I have ruled in reverent fear of Heaven,"',
  },
  s1496: {
    literal: 'How could I not rise at night thinking of the Way and eat late pondering faults, take King Wen\'s caution and cherish the Change\'s evening vigil, fearing virtue unfit and shaming the former sages?',
    idiomatic: '"Yet virtue has not touched things, and heaven has shown reproof,"',
  },
  s1497: {
    literal: '"Wishing peace without calamity, sincerity has not moved things; reproof appears in heaven; I am ashamed before the spirits and the multitude, seeking a ford without shore."',
    idiomatic: '"I am ashamed before spirits and people, with no shore in sight,"',
  },
  s1498: {
    literal: '"Once Song Jing spoke and the star retreated;',
    idiomatic: '"Song Jing once moved a star by his words;',
  },
  s1499: {
    literal: 'Lu Xi accepted remonstrance and famine did not harm men.',
    idiomatic: '"Lu Xi heeded counsel and famine spared the people."',
  },
  s1500: {
    literal: 'Take past sages as mirrors and deeply examine myself."',
    idiomatic: '"I take past sages as my mirror and reprove myself."',
  },};
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
if (data.metadata.chapter !== '017') {
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
