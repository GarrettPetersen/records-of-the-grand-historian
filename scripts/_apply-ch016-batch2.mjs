#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: "At this time the chief ministers had devised the per-string levy; when the order went down popular feeling was displeased, hence it was abolished.",
    idiomatic: "The ministers' levy proved so unpopular that Muzong repealed it.",
  },
  s0102: {
    literal: "On guisi the empress dowager moved to Xingqing Palace; the Emperor and the six palaces held a great feast in the southern inner palace, then returned to the Right Army and bestowed graded rewards on the commissioners.",
    idiomatic: "On guisi the court feasted the empress dowager at Xingqing and rewarded the eunuch commissioners.",
  },
  s0103: {
    literal: "From then he visited the Left and Right Armies and Yuchenhui, Jiuxian, and other gates every three days to watch wrestling and miscellaneous plays.",
    idiomatic: "Thereafter he toured the armies and palace gates every three days for games.",
  },
  s0104: {
    literal: "Autumn, seventh month, xin day new moon.",
    idiomatic: "The seventh month opened on a xin day.",
  },
  s0105: {
    literal: "On renyin Li Jiang, observer of He-Jin-Min, was made Minister of War.",
    idiomatic: "On renyin Li Jiang became war minister.",
  },
  s0106: {
    literal: "On jiachen Grand Judge of Dali Kong Zhi was made Tan prefect and Hunan observation commissioner.",
    idiomatic: "On jiachen Kong Zhi took Hunan.",
  },
  s0107: {
    literal: "On yisi an edict: \"The empress dowager dwells at peace in Chang-le; morning and evening she receives my face — her kindly instruction adds, and gratitude is utmost.",
    idiomatic: "On yisi an edict ordered birthday homage to the empress dowager:",
  },
  s0108: {
    literal: "The sixth of this month is the day of my birth; I shall welcome the empress dowager into the palace to receive longevity wishes.",
    idiomatic: "\"On my birthday I will bring her into the palace for congratulations.",
  },
  s0109: {
    literal: "I am deeply pleased and wish to share with the ministers.",
    idiomatic: "I wish the whole court to share the joy.",
  },
  s0110: {
    literal: "That day, the hundred officials and titled wives should advance names in congratulation at Guangshun Gate; I shall meet the hundred officials in the inner hall at Guangshun Gate — forever the regular form.\"",
    idiomatic: "Let officials and consorts salute at Guangshun Gate; I will receive them within — as permanent custom.\" Thus ended the edict.",
  },
  s0111: {
    literal: "This was irregular precedent.",
    idiomatic: "Historians noted this birthday ceremony was unprecedented.",
  },
  s0112: {
    literal: "The Yan-Cao-Pu circuit military commissioner was given the title Ping'an Army, following Ma Zong's memorial.",
    idiomatic: "Yan-Cao-Pu was renamed the Ping'an Army at Ma Zong's request.",
  },
  s0113: {
    literal: "On bingwu an order: the yisi edict's birthday congratulations were to stop.",
    idiomatic: "On bingwu the birthday homage edict was rescinded.",
  },
  s0114: {
    literal: "Earlier Left Vice Director Wei Shou had memorialized to carry it out; the chief ministers said antiquity had no birthday congratulations, and memorialized to abolish it.",
    idiomatic: "Wei Shou had proposed it; the premiers cited antiquity and had it canceled.",
  },
  s0115: {
    literal: "On dingwei artificial hills in the park were destroyed.",
    idiomatic: "On dingwei park artificial hills collapsed.",
  },
  s0116: {
    literal: "Seven laborers were crushed to death.",
    idiomatic: "Seven workers died in the collapse.",
  },
  s0117: {
    literal: "From the fifth month's fifth day it rained; only on this month's renzi did rain begin.",
    idiomatic: "Rain that had held since early summer finally came on renzi.",
  },
  s0118: {
    literal: "On jiayin he ascended the newly completed Yong'an Hall to watch a hundred plays, ending in utmost joy.",
    idiomatic: "On jiayin Muzong opened Yong'an Hall with a day of revelry.",
  },
  s0119: {
    literal: "On yimao an order: from now on newly appointed military and observation commissioners, on the day of assuming office, shall itemize present cash, silk, grain, and weapons and report.",
    idiomatic: "On yimao new commissioners had to inventory circuit assets on arrival.",
  },
  s0120: {
    literal: "Annan Protector Xingli died.",
    idiomatic: "Pei Xingli died in Annan.",
  },
  s0121: {
    literal: "That day the Emperor visited Anguo Temple to watch the Ghost Festival rites.",
    idiomatic: "That day he watched Ullambana at Anguo Temple.",
  },
  s0122: {
    literal: "Yong circuit military commissioner Yang Min died.",
    idiomatic: "Yang Min died on the Yong frontier.",
  },
  s0123: {
    literal: "Pinglu Army newly added envoys to Silla and Bohai, granted one seal, and was permitted one touring official.",
    idiomatic: "Pinglu gained Silla and Bohai envoy posts with a seal and touring officer.",
  },
  s0124: {
    literal: "The new Baoxing Hall was built.",
    idiomatic: "Baoxing Hall was completed.",
  },
  s0125: {
    literal: "On gengshen night Mars entered the Feathered Forest.",
    idiomatic: "On gengshen night Mars entered the Feathered Forest guard.",
  },
  s0126: {
    literal: "On renxu Anguo, Cien, Qianfu, Kaiye, Zhangjing, and other temples were lavishly decorated, and Tibet envoys were allowed to watch.",
    idiomatic: "On renxu temples were gilded for Tibet envoys to tour.",
  },
  s0127: {
    literal: "On bingyin, because the new Yong'an Hall was finished, he held a secret feast with the inner palace's noble ladies to celebrate with music; concubines all attended.",
    idiomatic: "On bingyin he feasted consorts privately in the new Yong'an Hall.",
  },
  s0128: {
    literal: "On dingmao Vice Premier Linghu Chu was made Xuan prefect, concurrent Vice Censor-in-Chief, and Xuan-She-Chi observation commissioner.",
    idiomatic: "On dingmao Linghu Chu was demoted to Xuanzhou.",
  },
  s0129: {
    literal: "Chu had been tomb commissioner and let clerks under carving contractors go unpaid, hoarding 150,000 strings as surplus to present — hence the demotion.",
    idiomatic: "He had skimmed 150,000 strings from tomb labor, prompting exile.",
  },
  s0130: {
    literal: "Eighth month, gengwu new moon.",
    idiomatic: "The eighth month opened on gengwu.",
  },
  s0131: {
    literal: "On xinwei War Minister Yang Yuling summarized debate on light and heavy money, taking all two-tax, wine monopoly, and salt profits nationwide and ordering taxes paid in local cloth and goods, not collecting cash, so goods would gradually weigh heavy and cash light, and farmers would be spared selling cheap cloth.",
    idiomatic: "On xinwei Yang Yuling urged tax payment in kind rather than cash.",
  },
  s0132: {
    literal: "He asked Secretariat, Department, and Censorate chiefs to reconsider and implement.",
    idiomatic: "High ministers were told to review the plan.",
  },
  s0133: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0134: {
    literal: "On guiyou retired Crown Prince Junior Tutor Li Yong died.",
    idiomatic: "On guiyou Li Yong died in retirement.",
  },
  s0135: {
    literal: "On jiaxu Annan Protector Gui Zhongwu beheaded rebel general Yang Qing and presented the head, recovering Annan prefecture.",
    idiomatic: "On jiaxu Gui Zhongwu beheaded Yang Qing and recovered Annan.",
  },
  s0136: {
    literal: "On yihai 5,000 strings were granted to the Music Office as capital for interest.",
    idiomatic: "On yihai the Music Office received 5,000 strings capital.",
  },
  s0137: {
    literal: "He ascended Diligence-in-Government Tower and inquired into people's hardships.",
    idiomatic: "He held a public audience on popular hardship.",
  },
  s0138: {
    literal: "Former Jiangxi observation commissioner Pei Ciyuan died.",
    idiomatic: "Pei Ciyuan died.",
  },
  s0139: {
    literal: "On jimao the moon occulted the Ox.",
    idiomatic: "On jimao the moon eclipsed the Ox constellation.",
  },
  s0140: {
    literal: "Tong prefecture had rain and snow, harming autumn crops.",
    idiomatic: "Early snow in Tongzhou damaged the harvest.",
  },
  s0141: {
    literal: "Wei Zhengmu, household section aide of Jingzhao prefecture, solely managed Jingling construction, shaved kitchen provisions for private use, embezzling 8,700 strings;",
    idiomatic: "Wei Zhengmu embezzled 8,700 strings from Jingling works;",
  },
  s0142: {
    literal: "Yu's carving contractor Fengxian magistrate Yu Hui also shaved funds, embezzling 13,000 strings — both were to be beaten to death with heavy rods.",
    idiomatic: "Yu Hui embezzled 13,000 more; both were sentenced to beating death.",
  },
  s0143: {
    literal: "On renchen he visited Fish-Algae Pool; 2,000 Divine Strategy troops were sent to dredge it.",
    idiomatic: "On renchen he toured Fish-Algae Pool and ordered it dredged.",
  },
  s0144: {
    literal: "On wuxu Cui Zhi, Court Gentleman for Discussion, acting Vice Censor-in-Chief, Martial Cavalry Captain, granted purple-gold fish, was made Grand Master for Splendid Happiness, acting Vice Director of the Secretariat, and Grand Councillor.",
    idiomatic: "On wuxu Cui Zhi entered the Grand Council.",
  },
  s0145: {
    literal: "On jihai Xuan-She observer Linghu Chu was demoted again to Heng prefect.",
    idiomatic: "On jihai Linghu Chu was demoted again to Hengzhou.",
  },
  s0146: {
    literal: "Ninth month, gengzi new moon — the Hebei salt-tax commissioner was renamed salt monopoly commissioner.",
    idiomatic: "The ninth month opened with renaming the Hebei salt office.",
  },
  s0147: {
    literal: "On xinchou great music was assembled at Fish-Algae Palace to watch boat racing.",
    idiomatic: "On xinchou the court watched regatta races at Fish-Algae Palace.",
  },
  s0148: {
    literal: "Li Su and Li Guangyan were again summoned to court; the Emperor wished to feast the ministers on Double Yang day.",
    idiomatic: "Li Su and Li Guangyan were recalled for a planned Double Yang feast.",
  },
  s0149: {
    literal: "Remonstrator Li Jue and others memorialized: \"The new reign's calendar is not yet changed; the imperial tomb is still fresh.",
    idiomatic: "Li Jue protested that mourning for Xianzong was not finished:",
  },
  s0150: {
    literal: "Though bending the month's term follows human desire,",
    idiomatic: "\"Though the court might bend ritual deadlines,",
  },
  s0151: {
    literal: "the three-year rule still binds the heart in mourning.",
    idiomatic: "the three-year mourning still binds the heart.",
  },
  s0152: {
    literal: "Stopping music and loosening prohibitions is for comforting the people;",
    idiomatic: "Music in the inner palace before the tomb is closed",
  },
  s0153: {
    literal: "assembling music within the palace is not yet permissible.\"",
    idiomatic: "should not yet be allowed.\"",
  },
  s0154: {
    literal: "He did not listen.",
    idiomatic: "Muzong ignored them.",
  },
  s0155: {
    literal: "On yisi Drafting Bureau director Li Zongmin was made Secretariat drafter.",
    idiomatic: "On yisi Li Zongmin joined the drafting office.",
  },
  s0156: {
    literal: "Song prefecture flooded, damaging 6,000 qing of fields.",
    idiomatic: "Songzhou flood ruined six thousand qing.",
  },
  s0157: {
    literal: "On wushen on Double Yang he held a private feast for Guo Zhao's brothers, noble kin, and imperial sons-in-law at Xuanhe Hall.",
    idiomatic: "On wushen Muzong feasted the Guo clan on Double Yang.",
  },
  s0158: {
    literal: "On jiyou a great carousal lasted three days; by then rain and snow came, and trees without wind collapsed fifteen or sixteen.",
    idiomatic: "A three-day revel ended in snow that felled trees without wind.",
  },
  s0159: {
    literal: "Vice Minister of Personnel Cui Qun was made Censor-in-Chief.",
    idiomatic: "Cui Qun became censor-in-chief.",
  },
  s0160: {
    literal: "Cang and Jing flooded, damaging fields.",
    idiomatic: "Cangzhou and Jingzhou floods damaged crops.",
  },
  s0161: {
    literal: "On wuwu Hedong military commissioner Pei Du, Grand Master of Splendid Happiness, acting Minister of Personnel, concurrent Vice Director of the Secretariat, Grand Councillor, Pillar of State, Duke of Jin with 3,000 households, was made acting Minister of Works, Vice Director of the Secretariat, and Grand Councillor.",
    idiomatic: "On wuwu Pei Du was promoted within the council.",
  },
  s0162: {
    literal: "Bin-Ning military commissioner Li Guangyan was also made Grand Councillor.",
    idiomatic: "Li Guangyan joined the council as well.",
  },
  s0163: {
    literal: "Wuning military commissioner Li Su was made Grand Councillor, chief of Luoyang in Zhaoyi, and Zhaoyi military commissioner.",
    idiomatic: "Li Su was made councilor and sent to Zhaoyi.",
  },
  s0164: {
    literal: "Xia circuit memorialized moving You prefecture to Changze county.",
    idiomatic: "Xiazhou reported relocating You prefecture.",
  },
  s0165: {
    literal: "On xinyou Li Guangyan and Li Su were feasted at Linde Hall with generous gifts.",
    idiomatic: "On xinyou the court feasted Li Guangyan and Li Su at Linde.",
  },
  s0166: {
    literal: "Han Yu, Yuan prefect, was made Grand Master for Splendid Happiness, acting National University Chancellor, and again granted gold-purple.",
    idiomatic: "Han Yu was restored as National University chancellor with gold-purple.",
  },
  s0167: {
    literal: "On bingyin Censor-in-Chief Cui Qun was made acting War Minister and Xu prefect, Wuning military commissioner;",
    idiomatic: "On bingyin Cui Qun took Wuning;",
  },
  s0168: {
    literal: "Director of Palace Construction Cui Neng was made Guang prefect and Lingnan military commissioner.",
    idiomatic: "Cui Neng took Lingnan.",
  },
  s0169: {
    literal: "On dingmao War Minister Li Jiang was made Censor-in-Chief.",
    idiomatic: "On dingmao Li Jiang became censor-in-chief.",
  },
  s0170: {
    literal: "On wuchen former Lingnan military commissioner Kong Zhi was made Vice Minister of Personnel.",
    idiomatic: "On wuchen Kong Zhi returned to Personnel.",
  },
  s0171: {
    literal: "Winter, tenth month, gengwu new moon — Kanchi sent envoys with tribute.",
    idiomatic: "In the tenth month Kanchi presented tribute.",
  },
  s0172: {
    literal: "On gengchen the chief ministers met Tibet envoys at the Secretariat to discuss affairs.",
    idiomatic: "On gengchen premiers met Tibet envoys.",
  },
  s0173: {
    literal: "Capital offices together were granted 10,000 strings; the Censorate was to divide them by office size and business urgency.",
    idiomatic: "Capital offices received 10,000 strings apportioned by the Censorate.",
  },
  s0174: {
    literal: "Chengde military commissioner Wang Chengzong died; his brother Chengyuan memorialized asking the court to appoint a commander, and Attendant Gentleman Bai Qi was sent to comfort.",
    idiomatic: "Wang Chengzong died; Chengyuan asked for a court appointee and Bai Qi was sent.",
  },
  s0175: {
    literal: "On xinsi Jin Gongliang completed the south-pointing carriage and mile-drum carriage.",
    idiomatic: "On xinsi Jin Gongliang presented astronomical carriages.",
  },
  s0176: {
    literal: "On renwu Tibet raided Jing prefecture; Commissioner Liang Shouqian led 4,000 Divine Strategy troops and eight frontier armies to rescue.",
    idiomatic: "On renwu Tibet raided Jingzhou; Liang Shouqian marched to relieve.",
  },
  s0177: {
    literal: "On yiyou Tian Hongzheng, Weibo military commissioner, was made acting Minister of Works, concurrent Secretariat Vice Director, and Chengde military commissioner.",
    idiomatic: "On yiyou Tian Hongzheng took Chengde.",
  },
  s0178: {
    literal: "Wang Chengyuan was made acting Works Minister, Hua prefect, and Yicheng military commissioner.",
    idiomatic: "Wang Chengyuan went to Yicheng on the Yellow River.",
  },
  s0179: {
    literal: "Li Su remained in office as chief of Wei prefecture and Weibo military commissioner.",
    idiomatic: "Li Su was shifted to Weibo.",
  },
  s0180: {
    literal: "Liu Wu, Yicheng military commissioner, was made acting Right Vice Director and chief of Luoyang in Zhaoyi.",
    idiomatic: "Liu Wu took Zhaoyi from Li Su.",
  },
  s0181: {
    literal: "Left Gold Crow general Tian Bu was made acting Left Regular Cavalry Attendant, concurrent Huai prefect, and Heyang-Sancheng-Huai-Meng military commissioner.",
    idiomatic: "Tian Bu received Heyang.",
  },
  s0182: {
    literal: "On yiyou Jing prefecture reported Tibet had withdrawn.",
    idiomatic: "Jingzhou reported the Tibetans had withdrawn.",
  },
  s0183: {
    literal: "At the time Xia military commissioner Tian Ji was greedy and cruel, oppressing Tangut clans; the Tangut brought Western Tibet to raid, but Hao Qi and Li Guangyan fought desperately and they withdrew.",
    idiomatic: "Tian Ji's oppression of Tanguts provoked a raid repelled by Hao Qi and Li Guangyan.",
  },
  s0184: {
    literal: "On dinghai western Sichuan reported Tibet invaded Ya prefecture; troops were ordered to garrison.",
    idiomatic: "On dinghai Ya prefecture was attacked; troops were sent.",
  },
  s0185: {
    literal: "Eastern Sichuan military commissioner Wang Ya proposed a plan to break Tibet by bribing northern Tibet to enter western Tibet and reward land and men seized.",
    idiomatic: "Wang Ya proposed bribing northern Tibet against western Tibet.",
  },
  s0186: {
    literal: "Eleventh month, yihai new moon.",
    idiomatic: "The eleventh month opened on yihai.",
  },
  s0187: {
    literal: "On guimao a decree: \"I hear that emperors grandly dwell over the four seas and nurture the multitude, like heaven covering all, like the sun illuminating all.",
    idiomatic: "On guimao a decree celebrated Chengde's submission:",
  },
  s0188: {
    literal: "Looking to Ji, we first lost the military commander; I think of the three armies' affairs and reach to the four prefectures' people.",
    idiomatic: "\"I mourned the lost commander and the people of four prefectures.",
  },
  s0189: {
    literal: "Some stored loyalty and long sincerity yet had no way to show service;",
    idiomatic: "Loyal men had lacked scope;",
  },
  s0190: {
    literal: "some suffered disaster, famine, and military labor yet had no step for hoped relief.",
    idiomatic: "soldiers and farmers had lacked relief.",
  },
  s0191: {
    literal: "Now fortune opens and sincerity everywhere appears.",
    idiomatic: "Now fortune turns and sincerity shines.",
  },
  s0192: {
    literal: "Wang Chengyuan first submitted a memorial wishing to come to court.",
    idiomatic: "Wang Chengyuan was first to submit and come to court.",
  },
  s0193: {
    literal: "Ever mindful of father and brother's loyalty, he secured ruler-minister righteousness; extraordinary reward was added and a heavy commandery entrusted.",
    idiomatic: "Honoring his family's loyalty, he received a new command.",
  },
  s0194: {
    literal: "Thinking also of Chengde's officers and soldiers, who turned from plots to righteousness and declared red sincerity, all wishing to show ability — each should receive rank.",
    idiomatic: "Chengde troops who turned righteous were to be ranked.",
  },
  s0195: {
    literal: "Great generals Shi Chonggui and Niu Yuanyi already received surpassing honors; now all the more thick gifts.",
    idiomatic: "Generals Shi Chonggui and Niu Yuanyi were doubly rewarded.",
  },
  s0196: {
    literal: "Remonstrance official Zheng Tan should go to Zhen prefecture to proclaim comfort and grant 1,000,000 strings.",
    idiomatic: "Zheng Tan was sent to Zhenzhou with one million strings.",
  },
  s0197: {
    literal: "Where royal grace penetrates, heaven's net is restored; pardon faults and release grievances, giving the people rest.",
    idiomatic: "Amnesty and rest were proclaimed throughout the circuit.",
  },
  s0198: {
    literal: "All prisoners now held in the circuit, regardless of crime's weight, should be released.",
    idiomatic: "All circuit prisoners were to be freed.",
  },
  s0199: {
    literal: "I, because of Wujun's meritorious toil shining on the ritual vessels;",
    idiomatic: "For Wang Wujun's bronze-shining merit",
  },
  s0200: {
    literal: "Shizhen's respectful diligence continuing with the commander's banner —",
    idiomatic: "and Shizhen's loyal succession —",
  },
};;
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
