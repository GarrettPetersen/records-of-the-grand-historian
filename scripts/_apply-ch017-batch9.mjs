#!/usr/bin/env node
/** Batch 9: s0801–s0900 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 801;
const END = 900;

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
    literal: 'On dingsi the Cang-De military commissioner was renamed Yichang Army.',
    idiomatic: 'On dingsi Cang-De became Yichang Army.',
  },
  s0802: {
    literal: 'Taiyuan drought; one hundred thousand shi of grain relief-granted.',
    idiomatic: 'Taiyuan drought brought one hundred thousand shi of relief.',
  },
  s0803: {
    literal: 'On jiwei an edict: frontier military commissioners wishing to attend court must first memorialize; when approved they may proceed. On gengshen Youzhou army mutinied, expelled its commander Li Zaiyi, and set rear-gate deputy commander Yang Zhicheng as acting regent.',
    idiomatic: 'On jiwei court visits required prior memorial; on gengshen Youzhou mutinied and made Yang Zhicheng regent.',
  },
  s0804: {
    literal: 'On guihai an edict: at the Dragon Boat festival circuits customarily presented tribute; variegated silk bolts may present only raw white silk.',
    idiomatic: 'On guihai Dragon Boat tribute was limited to raw white silk.',
  },
  s0805: {
    literal: 'On jichou the acting Bohai state affairs minister Da Yizhen was made acting Secretariat Director, Hohan prefect, and king of Bohai.',
    idiomatic: 'On jichou Da Yizhen was confirmed king of Bohai.',
  },
  s0806: {
    literal: 'Second month, gengwu new moon.',
    idiomatic: 'The second month opened on gengwu.',
  },
  s0807: {
    literal: 'On renchen Luzong military commissioner, acting Grand Mentor, Grand Councillor Li Zaiyi was acting Grand Mentor and Grand Councillor.',
    idiomatic: 'On renchen Li Zaiyi kept council rank after losing his post.',
  },
  s0808: {
    literal: 'At the time Zaiyi had lost his territory and entered court; a mansion in Yongning Lane was granted with generous gifts.',
    idiomatic: 'Li Zaiyi received a capital mansion and rich gifts.',
  },
  s0809: {
    literal: 'On bingshen Guiguan observation commissioner Li Liang was made Lingnan military commissioner.',
    idiomatic: 'On bingshen Li Liang took Lingnan.',
  },
  s0810: {
    literal: 'On wuxu Divine Strategy middle commander Wang Shoucheng memorialized obtaining army registrar Dou Luchu\'s deposition accusing Grand Councillor Song Shenxi and the Prince of Zhang of rebellion.',
    idiomatic: 'On wuxu Wang Shoucheng accused Song Shenxi and the Prince of Zhang of treason.',
  },
  s0811: {
    literal: 'Immediately ordered arrest.',
    idiomatic: 'Arrests followed at once.',
  },
  s0812: {
    literal: 'On gengzi an edict demoted Song Shenxi to heir-apparent Right Vice Mentor.',
    idiomatic: 'On gengzi Song Shenxi was demoted.',
  },
  s0813: {
    literal: 'On renyin Left Regular Attendant Cui Xuanliang and remonstrance officials totaling fourteen knelt on the jade steps: "The northern-army accusation — please do not interrogate inside the palace; hand it to the law offices."',
    idiomatic: 'On renyin fourteen remonstrators begged a public trial for Song Shenxi.',
  },
  s0814: {
    literal: 'The Emperor said: "We have already consulted the chief ministers; you may withdraw."',
    idiomatic: 'Wenzong said he had already consulted the premiers.',
  },
  s0815: {
    literal: 'Cui Xuanliang wept and remonstrated long; the Emperor changed expression and comforted him: "We shall at once consult the chief ministers."',
    idiomatic: 'Cui Xuanliang\'s tears moved Wenzong to promise consultation.',
  },
  s0816: {
    literal: 'Xuanliang and the others then withdrew.',
    idiomatic: 'The remonstrators withdrew.',
  },
  s0817: {
    literal: 'On guimao an edict made the Prince of Zhang Prince Chao of Chao county and Right Vice Mentor Song Shenxi Kaizhou registrar on probation.',
    idiomatic: 'On guimao the Prince of Zhang and Song Shenxi were demoted.',
  },
  s0818: {
    literal: 'At first the capital was alarmed, thinking a chief minister truly plotted with a prince; three or four days later they knew it was a fabricated frame.',
    idiomatic: 'The capital first feared a real princely plot, then learned it was framed.',
  },
  s0819: {
    literal: 'Men of culture glared at Shoucheng and Zheng Zhu; hence remonstrators wept and argued.',
    idiomatic: 'Remonstrators wept because the frame came from Shoucheng and Zheng Zhu.',
  },
  s0820: {
    literal: 'Shenxi barely escaped the disaster.',
    idiomatic: 'Song Shenxi barely survived.',
  },
  s0821: {
    literal: 'On jiyou an edict: because Li Zaiyi entered court, a banquet was granted at Qujiang Pavilion and chief ministers and the hundred officials were ordered to attend.',
    idiomatic: 'On jiyou Li Zaiyi was feasted at Qujiang.',
  },
  s0822: {
    literal: 'On xinyou Qianzhong observation commissioner Pei Hongtai was made Guiguan pacification commissioner; former An prefect Chen Zhengyi was made Qianzhong observation commissioner.',
    idiomatic: 'On xinyou Pei Hongtai and Chen Zhengyi exchanged Guiguan and Qianzhong.',
  },
  s0823: {
    literal: 'On dingmao at Zichen audience Grand Councillor Lu Sui reached the dragon steps, fell to the ground; eunuchs were ordered to support him.',
    idiomatic: 'On dingmao Lu Sui collapsed at Zichen.',
  },
  s0824: {
    literal: 'Next day he memorialized to retire; observers praised him.',
    idiomatic: 'Lu Sui retired the next day to praise.',
  },
  s0825: {
    literal: 'Summer, fourth month, jiashen: the new Silla king\'s heir Kim Gyeonghui was made Palace Companion, acting Grand Mentor, envoy holding credentials for Gyeolim military affairs, Gyeolim metropolitan prefect, Ninghai army commissioner, Pillar of State, and king of Silla;',
    idiomatic: 'On jiashen Kim Gyeonghui was invested king of Silla;',
  },
  s0826: {
    literal: 'his mother Lady Pak was made Grand Consort of Silla.',
    idiomatic: 'Lady Pak became Silla grand consort.',
  },
  s0827: {
    literal: 'On dinghai an edict: "Historians record affairs to warn the age; former courts\' old systems all followed the imperial train.',
    idiomatic: 'On dinghai Wenzong restored quarterly political records:',
  },
  s0828: {
    literal: 'Later chief ministers compiled Current-Affairs Records; following custom long, many fell into ruin.',
    idiomatic: '"Current-Affairs Records had fallen into disuse."',
  },
  s0829: {
    literal: 'Henceforth when chief ministers report affairs touching reform or temporary measures in government and punishment, charge one Secretariat or Chancellery aide to record in season each quarter and send to the Historiography Office — to warn Our lapses and restore official routine."',
    idiomatic: '"Quarterly Secretariat records shall return to the Historiography Office."',
  },
  s0830: {
    literal: 'On jichou Li Zaiyi was made Shannan West military commissioner, still acting Grand Mentor and Grand Councillor, replacing Wen Zao;',
    idiomatic: 'On jichou Li Zaiyi replaced Wen Zao at Shannan West;',
  },
  s0831: {
    literal: 'Zao was made Vice Minister of War.',
    idiomatic: 'Wen Zao took War.',
  },
  s0832: {
    literal: 'Youzhou Luzong acting regent Yang Zhicheng was made acting Minister of Works and Luzong military commissioner.',
    idiomatic: 'Yang Zhicheng was confirmed at Luzong.',
  },
  s0833: {
    literal: 'Fifth month, wuxu new moon: the ancestral temple\'s fourth and sixth chambers leaked; the responsible offices did not repair in time and each was fined salary.',
    idiomatic: 'On wuxu temple leaks brought salary fines.',
  },
  s0834: {
    literal: 'The Emperor ordered palace envoys to lead laborers and use inner-palace repair materials to mend them.',
    idiomatic: 'Eunuchs were sent to repair the temple.',
  },
  s0835: {
    literal: 'Right Supplementation Remonstrator Wei Wen memorialized: "The ancestral temple unrepaired — guilt lies in offices\' negligence; heavier punishment is fitting.',
    idiomatic: 'Wei Wen protested eunuch temple repair:',
  },
  s0836: {
    literal: 'Now the offices only fine salary and entrust inner eunuchs — this permits hundred-officer posts openly to abandon duty.',
    idiomatic: '"Salary fines while eunuchs repair abandon official duty."',
  },
  s0837: {
    literal: 'Making the temple\'s weight the Emperor\'s private affair, then the host of offices are cast away — this subject grieves for the holy court.',
    idiomatic: '"The temple must not become a private eunuch task."',
  },
  s0838: {
    literal: 'Affairs touching the temple are all written in histories; if not old statute, they may not be done rashly.',
    idiomatic: '"Histories record temple affairs; follow statute."',
  },
  s0839: {
    literal: 'We beg another edict returning construction to the responsible offices — then institutions are not confused and each office keeps its task."',
    idiomatic: '"Return repair to the proper offices."',
  },
  s0840: {
    literal: 'When the memorial was submitted the Emperor praised it and recalled the envoys, ordering the offices to perform repair.',
    idiomatic: 'Wei Wen won; civil offices regained temple repair.',
  },
  s0841: {
    literal: 'On wuwu western Sichuan\'s Li Deyu memorialized: Nanzhao returned about four thousand previously captured commoners, artisans, monks, and Daoists to the circuit.',
    idiomatic: 'On wuwu Li Deyu reported four thousand captives returned from Nanzhao.',
  },
  s0842: {
    literal: 'On xinyou Luoyang regent and Minister of Punishments Wei Hongjing died.',
    idiomatic: 'On xinyou Wei Hongjing died.',
  },
  s0843: {
    literal: 'On bingyin Jingzhao prefect Cui Guan was made Left Vice Director.',
    idiomatic: 'On bingyin Cui Guan became left vice director.',
  },
  s0844: {
    literal: 'Vice Director of Sacrifices Pang Yan acted as Jingzhao prefect.',
    idiomatic: 'Pang Yan acted for Jingzhao.',
  },
  s0845: {
    literal: 'Sixth month, dingmao new moon.',
    idiomatic: 'The sixth month opened on dingmao.',
  },
  s0846: {
    literal: 'On wuyin because rain lasted ten days, an edict ordered review of prisoners in all offices.',
    idiomatic: 'On wuyin ten days of rain prompted prisoner review.',
  },
  s0847: {
    literal: 'On xinmao Su, Hang, and Hunan floods harmed crops.',
    idiomatic: 'On xinmao Jiangnan floods ruined crops.',
  },
  s0848: {
    literal: 'On jiawu eastern Sichuan memorialized: Xuanwu River rose two zhang; Zi prefecture\'s outer wall floated people\'s houses.',
    idiomatic: 'On jiawu Zi\'s wall was flooded by the Xuanwu River.',
  },
  s0849: {
    literal: 'Autumn, seventh month, dingyou new moon.',
    idiomatic: 'The seventh month opened on dingyou.',
  },
  s0850: {
    literal: 'On gengzi heir-apparent Guest of Honor Li Bo was posthumously made Minister of Rites.',
    idiomatic: 'On gengzi Li Bo was posthumously honored.',
  },
  s0851: {
    literal: 'On xinchou Vice Minister of War Wen Zao was made acting Minister of Revenue and Luoyang regent.',
    idiomatic: 'On xinchou Wen Zao became Luoyang regent.',
  },
  s0852: {
    literal: 'On jiachen Acting Grand Mentor, eastern-capital commissioner, Pillar of State, Duke of Xu Xiao Fu remained Left Vice Director and retired.',
    idiomatic: 'On jiachen Xiao Fu retired.',
  },
  s0853: {
    literal: 'Eastern and western Sichuan flooded; envoys were sent to comfort and relief-grant.',
    idiomatic: 'Shu floods brought comfort envoys and relief.',
  },
  s0854: {
    literal: 'On jiwei Supervising Secretary Luo Rang was made Fujian observation commissioner.',
    idiomatic: 'On jiwei Luo Rang took Fujian.',
  },
  s0855: {
    literal: 'Eighth month, bingyin new moon.',
    idiomatic: 'The eighth month opened on bingyin.',
  },
  s0856: {
    literal: 'On gengwu Wuchang military commissioner and acting Minister of Revenue Yuan Zhen died.',
    idiomatic: 'On gengwu Yuan Zhen died.',
  },
  s0857: {
    literal: 'On xinwei Vice Punishments director Shu Yuanyu was demoted to Drafting Master.',
    idiomatic: 'On xinwei Shu Yuanyu was demoted for ambition.',
  },
  s0858: {
    literal: 'Yuanyu repeatedly memorialized offering service and presented essays; court opinion blamed his rash advance.',
    idiomatic: 'Shu Yuanyu\'s self-promotion drew court censure.',
  },
  s0859: {
    literal: 'On renshen Heyang-Sancheng Huai military commissioner Yang Yuanqing was made Xuanwu military commissioner, replacing Li Fengji;',
    idiomatic: 'On renshen Yang Yuanqing replaced Li Fengji at Xuanwu;',
  },
  s0860: {
    literal: 'Fengji was made acting Minister of Education, heir-apparent Grand Mentor, and Luoyang regent, replacing Wen Zao;',
    idiomatic: 'Li Fengji became Luoyang regent;',
  },
  s0861: {
    literal: 'Zao was made Heyang-Sancheng Huai military commissioner.',
    idiomatic: 'Wen Zao took Heyang.',
  },
  s0862: {
    literal: 'On wuyin Shan-Guo observation commissioner Cui Yan was made E-Yue-An-Huang observation commissioner.',
    idiomatic: 'On wuyin Cui Yan took E-Yue.',
  },
  s0863: {
    literal: 'On jiashen Palace Secretariat drafter Cui Xian was made Shan defense commissioner.',
    idiomatic: 'On jiashen Cui Xian took Shan.',
  },
  s0864: {
    literal: 'An edict: Shan\'s former combined defense-observation title should cease; troops belong to the prefectural defense commissioner.',
    idiomatic: 'Shan\'s combined defense title was abolished.',
  },
  s0865: {
    literal: 'On bingxu Jingzhao prefect Pang Yan died.',
    idiomatic: 'On bingxu Pang Yan died.',
  },
  s0866: {
    literal: 'On gengyin Court of Imperial Sacrifices director and consort\'s kin Du Ti was made Jingzhao prefect.',
    idiomatic: 'On gengyin Du Ti took Jingzhao.',
  },
  s0867: {
    literal: 'Ninth month, bingshen new moon.',
    idiomatic: 'The ninth month opened on bingshen.',
  },
  s0868: {
    literal: 'On jiachen heir-apparent Left Vice Mentor Guo Qiu was demoted to Wuwang mansion registrar for mental illness and quarreling with colleagues.',
    idiomatic: 'On jiachen Guo Qiu was demoted for illness and quarrels.',
  },
  s0869: {
    literal: 'Hanlin academics Xue Tinglao and Li Rangyi were both dismissed to their original posts.',
    idiomatic: 'Xue Tinglao and Li Rangyi left Hanlin.',
  },
  s0870: {
    literal: 'Tinglao in Hanlin was drunk all day without decorum — hence dismissal.',
    idiomatic: 'Xue Tinglao was dismissed for drunkenness.',
  },
  s0871: {
    literal: 'Rangyi often recommended Tinglao — hence guilt by association.',
    idiomatic: 'Li Rangyi fell for backing Xue Tinglao.',
  },
  s0872: {
    literal: 'On jiwei Left Vice Director Dou Yizhi acted as Director of Sacrifices.',
    idiomatic: 'On jiwei Dou Yizhi acted for Sacrifices.',
  },
  s0873: {
    literal: 'Western Sichuan\'s Li Deyu memorialized recovery of Wei prefecture, lost to Tibet, and dispatched troops to garrison it.',
    idiomatic: 'Li Deyu recovered Wei prefecture from Tibet.',
  },
  s0874: {
    literal: 'Winter, tenth month, yichou new moon: former Mian prefect Zheng Chuo was made Annan protector.',
    idiomatic: 'On yichou Zheng Chuo took Annan.',
  },
  s0875: {
    literal: 'On wuyin barbarians raided Juan prefecture and took two counties.',
    idiomatic: 'On wuyin barbarians took two Juan counties.',
  },
  s0876: {
    literal: 'On xinsi Cangzhou moved Qingchi county inside the south Luo wall.',
    idiomatic: 'On xinsi Qingchi moved within Cang\'s south wall.',
  },
  s0877: {
    literal: 'Eleventh month, yiwei new moon.',
    idiomatic: 'The eleventh month opened on yiwei.',
  },
  s0878: {
    literal: 'On gengxu Fengxiang military commissioner Wang Chengyuan came to court.',
    idiomatic: 'On gengxu Wang Chengyuan came to court.',
  },
  s0879: {
    literal: 'On jiwei Chengyuan was made acting Minister of Works and Qing prefect, Pinglu military commissioner.',
    idiomatic: 'On jiwei Wang Chengyuan took Pinglu.',
  },
  s0880: {
    literal: 'On guihai Left Vice Director and acting Sacrifices director Dou Yizhi was made acting Minister of Works and Fengxiang-Longyou military commissioner.',
    idiomatic: 'On guihai Dou Yizhi took Fengxiang.',
  },
  s0881: {
    literal: 'Twelfth month, yichou new moon.',
    idiomatic: 'The twelfth month opened on yichou.',
  },
  s0882: {
    literal: 'On wuyin Left Vice Director Wang Fan also acted as Sacrifices director.',
    idiomatic: 'On wuyin Wang Fan acted for Sacrifices.',
  },
  s0883: {
    literal: 'On jiashen the newly appointed Guiguan observation commissioner Pei Hongtai was demoted to Rao prefect for delaying entry to his post and being impeached by the censorate.',
    idiomatic: 'On jiashen Pei Hongtai was demoted for tardy posting.',
  },
  s0884: {
    literal: 'On guisi Zheng prefect Li Ao was made Guiguan observation commissioner.',
    idiomatic: 'On guisi Li Ao took Guiguan.',
  },
  s0885: {
    literal: 'This year Huainan, Zhejiang east and west, Jing-Xiang, E-Yue, and eastern Sichuan all flooded and harmed crops; autumn tax remission was requested.',
    idiomatic: 'Floods across the southeast brought tax remission pleas.',
  },
  s0886: {
    literal: 'The capital had great rain and snow.',
    idiomatic: 'Heavy snow struck the capital.',
  },
  s0887: {
    literal: 'Dade 6, spring, first month, yiwei new moon: because long snow continued, the New Year audience was canceled.',
    idiomatic: 'Dade 6 opened without New Year audience after long snow.',
  },
  s0888: {
    literal: 'On wuxu Zhenwu\'s Li Yong received four hundred seventy-three tents of Khitan tribes outside Black Mountain.',
    idiomatic: 'On wuxu Li Yong enrolled Black Mountain Khitan tents.',
  },
  s0889: {
    literal: 'On renzi an edict: "We hear that heaven\'s hearing is our people\'s hearing, heaven\'s seeing our people\'s seeing.',
    idiomatic: 'On renzi Wenzong proclaimed a snow-famine edict:',
  },
  s0890: {
    literal: 'Our slight virtue has not yet clarified the Way, cannot harmonize the four seasons, and guide welcoming qi.',
    idiomatic: '"My virtue has not harmonized the seasons."',
  },
  s0891: {
    literal: 'Since last winter, month-long snow and cold winds have especially harmed harmony.',
    idiomatic: '"Month-long snow has harmed harmony."',
  },
  s0892: {
    literal: 'Thinking of the masses, some suffer cold and hunger with nowhere to borrow, unable to preserve themselves.',
    idiomatic: '"Many face cold and hunger."',
  },
  s0893: {
    literal: 'Midnight We carry them; from dawn We sigh at meals, fearful as if facing peril — the season\'s fault is Ours.',
    idiomatic: '"I eat and sleep in fear — the fault is mine."',
  },
  s0894: {
    literal: 'We think to expand gracious favor and accord with the season.',
    idiomatic: '"I seek gracious favor for the season."',
  },
  s0895: {
    literal: 'Death-sentence prisoners under heaven, except official embezzlement and deliberate murder, are all reduced to exile; those already in exile are reduced one grade.',
    idiomatic: '"Death sentences become exile; exile reduced one grade."',
  },
  s0896: {
    literal: 'All capital-area counties should use Ever-Normal and charity granary dou to relief-grant.',
    idiomatic: '"Capital counties shall open granaries."',
  },
  s0897: {
    literal: 'Widowers, orphans, disabled, and destitute in the capital unable to preserve themselves — charge Jingzhao to relief according to circumstance and report numbers.',
    idiomatic: '"Jingzhao shall succor the destitute."',
  },
  s0898: {
    literal: 'Speaking of the infants.',
    idiomatic: '"I think of the people as infants."',
  },
  s0899: {
    literal: 'Viewing them as wounded.',
    idiomatic: '"I view their wounds as my own."',
  },
  s0900: {
    literal: 'Heaven perhaps warns Us, showing this yin bale.',
    idiomatic: '"Heaven warns me with this yin calamity."',
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
