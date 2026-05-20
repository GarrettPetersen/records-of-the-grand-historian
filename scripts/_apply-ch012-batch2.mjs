#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.012, Dezong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
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
    literal: "Jingnan commissioner, acting Rites Minister, concurrent Jiangling prefect and censor-in-chief Zhang Yanshang was made acting War Minister, concurrent Chengdu prefect, censor-in-chief, and Sword-South West commissioner for revenue, garrison-farming, and observation.",
    idiomatic: "Zhang Yanshang left Jingnan to become Chengdu prefect and Sword-South West commissioner.",
  },
  s0102: {
    literal: "Shuofang deputy Du Xiquan was made Lingzhou acting commissioner.",
    idiomatic: "Du Xiquan became acting commissioner at Lingzhou.",
  },
  s0103: {
    literal: "Bian prefect Zhang Guangsheng was made Shanyu Zhenwu commissioner and rear commander of the two eastern surrender cities and Sui-Yin-Bian-Sheng.",
    idiomatic: "Zhang Guangsheng took Shanyu, Zhenwu, and the eastern surrender cities.",
  },
  s0104: {
    literal: "Yanzhou prefect Li Jian was made Bian-Fang-Qing-Yan rear commander.",
    idiomatic: "Li Jian became rear commander of Bian, Fang, Qing, and Yan.",
  },
  s0105: {
    literal: "Yang Yan had long hated Cui Ning; though Ning was given three commands, Yan still appointed these three as rear commanders to strip his power — all were indignant.",
    idiomatic: "Yang Yan stripped Cui Ning by posting three rear commanders despite Ning's triple command; the court seethed.",
  },
  s0106: {
    literal: "Twelfth month, jihai: southern selection envoys might report directly without censors again overseeing them.",
    idiomatic: "Southern selection envoys could report directly, without censor escorts.",
  },
  s0107: {
    literal: "On yimao an edict stated: the Prince of Xuan may be established as crown prince.",
    idiomatic: "On yimao the Prince of Xuan was named heir.",
  },
  s0108: {
    literal: "On the last day of bingyin there was an eclipse of the sun.",
    idiomatic: "At month-end on bingyin the sun was eclipsed.",
  },
  s0109: {
    literal: "An edict forbade presenting auspicious omens at the New Year's audience.",
    idiomatic: "New Year's court was barred from auspicious-omen memorials.",
  },
  s0110: {
    literal: "Jianzhong 1 — first month, dingmao new moon: he held court at Hanyuan Hall, changed the era name to Jianzhong, and the ministers offered the honorific Sagacious Divine Martial Emperor. (The source repeats the reign year.)",
    idiomatic: "In the first month of Jianzhong, on dingmao, he took the era name Jianzhong and received the title Sagacious Divine Martial Emperor.",
  },
  s0111: {
    literal: "On jisi he attended court at the Grand Supreme Sovereign Temple.",
    idiomatic: "On jisi he worshipped at the Grand Supreme Sovereign Temple.",
  },
  s0112: {
    literal: "On gengwu he visited the Imperial Ancestral Temple.",
    idiomatic: "On gengwu he visited the ancestral temple.",
  },
  s0113: {
    literal: "On xinwei he performed the suburban sacrifice.",
    idiomatic: "On xinwei he offered at the suburban altar.",
  },
  s0114: {
    literal: "That day he returned to the palace and held court at Danfeng Gate, proclaiming a great amnesty.",
    idiomatic: "The same day he proclaimed amnesty from Danfeng Gate.",
  },
  s0115: {
    literal: "Since the times of hardship, tax items had multiplied.",
    idiomatic: "Since the rebellion, tax categories had proliferated.",
  },
  s0116: {
    literal: "Henceforth aside from the two taxes, to levy one cash more was to be prosecuted as violating the law.",
    idiomatic: "After this, any levy beyond the two taxes was a capital crime.",
  },
  s0117: {
    literal: "Regular-attendance officials, circuit commissioners, army commanders, prefects, capital magistrates, and Grand Court reviewers, within three days of appointment, were to submit at the Four Directions Lodge a memorial yielding the post to one other.",
    idiomatic: "New appointees had three days to nominate a substitute at the Four Directions Lodge.",
  },
  s0118: {
    literal: "Outer officials were to have their superiors forward the memorial to the Secretariat and Gate Department.",
    idiomatic: "Provincial superiors forwarded the same memorials to the chancellery.",
  },
  s0119: {
    literal: "When a post fell vacant, the man with the most nominations received it.",
    idiomatic: "Vacancies went to the candidate with the most nominations.",
  },
  s0120: {
    literal: "Sixth-rank princely officials and reducible posts in prefectures and counties were to be abolished as circumstances required.",
    idiomatic: "Princely and county posts were cut wherever possible.",
  },
  s0121: {
    literal: "All who succeeded fathers as household heirs received two merit rotations.",
    idiomatic: "Heirs who succeeded their fathers gained two merit steps.",
  },
  s0122: {
    literal: "On jisi Fujian observer Bao Fang and Hunan observer Xiao Fu yielded their censorial concurrent posts — it was granted.",
    idiomatic: "On jisi Bao Fang and Xiao Fu gave up concurrent censor titles.",
  },
  s0123: {
    literal: "Since the wars, heavy frontier posts had routinely carried capital bureau titles, down to outer staff.",
    idiomatic: "Since the wars, frontier posts had hoarded capital bureau titles.",
  },
  s0124: {
    literal: "Now Han Huang was made Suzhou prefect and Du Ya Hezhong vice prefect while holding united training observation commands, without capital bureau concurrent posts.",
    idiomatic: "Han Huang and Du Ya took observation commands without capital concurrents.",
  },
  s0125: {
    literal: "Thereafter all circuits not under military commissioners who held censor posts yielded them.",
    idiomatic: "Other non-commissioners holding censor titles followed suit.",
  },
  s0126: {
    literal: "On jiawu an edict stated: \"Eastern Capital, Henan, Huai-Hai, Jiang-Huai, Shannan East circuit transport, corvée, green-sprout, salt, and iron commissioner, Left Vice Director Liu Yan — when chariots of war had not ceased, the commission was set up provisionally; long he toiled as an elder, gathering Our affairs, heart and strength worn, nearly twenty years. We hear in council that many tax gates exhaust the districts; We seek change toward timely harmony and restore the ministries' system.\"",
    idiomatic: "On jiawu an edict ended Liu Yan's transport monopoly after twenty years, citing tax exhaustion.",
  },
  s0127: {
    literal: "Yan's commission was halted; empire-wide funds were entrusted to the Revenue and Granaries bureaus, the Secretariat and Gate Department to select bureau directors per statute.",
    idiomatic: "Revenue returned to the ministries under chancellery-selected directors.",
  },
  s0128: {
    literal: "Thus ended the edict. That month the Lingyang canal at Feng prefecture was dredged.",
    idiomatic: "Thus ended the edict. That month Feng's Lingyang canal was dredged.",
  },
  s0129: {
    literal: "Second month, bingshen: eleven promotion-and-demotion envoys were dispatched through the empire.",
    idiomatic: "Second month: eleven inspection envoys fanned out across the empire.",
  },
  s0130: {
    literal: "On guimao Households Bureau Director Han Hui was made Remonstrance and Review Grand Master; Jingyuan commissioner Duan Xiushi was made Minister of Agriculture.",
    idiomatic: "On guimao Han Hui became remonstrance grand master; Duan Xiushi minister of agriculture.",
  },
  s0131: {
    literal: "On jiyou Left Vice Director Liu Yan was demoted to Zhongzhou prefect.",
    idiomatic: "On jiyou Liu Yan was demoted to Zhongzhou.",
  },
  s0132: {
    literal: "On guichou Zhaoyi army acting commissioner Li Baozhen became full commissioner of the circuit.",
    idiomatic: "On guichou Li Baozhen became Zhaoyi's commissioner.",
  },
  s0133: {
    literal: "On jiayin History Bureau compiler and Rites Vice Minister Linghu Yan was demoted to Chenzhou aide; Right Supplementation Officer Liu Mian to Bazhou registrar.",
    idiomatic: "On jiayin Linghu Yan and Liu Mian were exiled to the south.",
  },
  s0134: {
    literal: "Japan presented tribute at court.",
    idiomatic: "Japan sent tribute.",
  },
  s0135: {
    literal: "On guihai Zhu Ci was made concurrent Four Garrisons Northern Court campaign commander and Jingyuan commissioner.",
    idiomatic: "On guihai Zhu Ci added Four Garrisons and Jingyuan commands.",
  },
  s0136: {
    literal: "Third month, bingyin: the Rites commissioner memorialized that the Eastern Capital temple lacked wooden spirit tablets and requested they be made.",
    idiomatic: "Third month: rites officials sought new spirit tablets for Luoyang's temple.",
  },
  s0137: {
    literal: "The edict was sent down for discussion; no decision was reached.",
    idiomatic: "Debate produced no decision.",
  },
  s0138: {
    literal: "On gengwu Investigating Censor Zhang Zhu, wearing the law cap, impeached Censor-in-Chief Yan Yi for dredging Lingyang canal while concealing the edict and not executing it — Yi's office was struck; Zhu was granted crimson and fish.",
    idiomatic: "On gengwu Zhang Zhu impeached Yan Yi for ignoring an edict on the Lingyang canal; Zhu won crimson robes.",
  },
  s0139: {
    literal: "On xinwei Left Palace Attendant and Hanlin academician Zhang She was sent home to his district.",
    idiomatic: "On xinwei Zhang She left the Hanlin for retirement.",
  },
  s0140: {
    literal: "On jiaxu former Minister of Agriculture Yu Zhun was made Jiangling prefect, concurrent censor-in-chief, and Jingnan commissioner.",
    idiomatic: "On jiaxu Yu Zhun became Jingnan commissioner from agriculture minister.",
  },
  s0141: {
    literal: "On guisi Remonstrance Grand Master Han Hui was made Households Vice Minister and revenue judge.",
    idiomatic: "On guisi Han Hui became revenue judge.",
  },
  s0142: {
    literal: "At that time Liu Yan was about to be demoted; the commission name was abolished and affairs returned to the ministry's home bureau.",
    idiomatic: "Liu Yan's fall abolished the transport commission.",
  },
  s0143: {
    literal: "Now Hui was ordered to judge revenue and Revenue Bureau Director Du You was made acting Jiang-Huai land-and-water transport commissioner, on the model of Liu Yan and Han Huang — Yang Yan's purge of Yan.",
    idiomatic: "Han Hui and Du You replaced Yan's transport system at Yang Yan's instigation.",
  },
  s0144: {
    literal: "Summer, fourth month, yiwei new moon: Jingyuan lieutenant Liu Wenxi seized the city in rebellion.",
    idiomatic: "Fourth month: Liu Wenxi rebelled at Jingyuan.",
  },
  s0145: {
    literal: "On jihai there was an earthquake.",
    idiomatic: "On jihai the earth quaked.",
  },
  s0146: {
    literal: "On xinwei Jiangxi observer Cui Zhao was ordered to invest the Uyghur qaghan.",
    idiomatic: "On xinwei Cui Zhao was sent to invest the Uyghur qaghan.",
  },
  s0147: {
    literal: "On wushen Fujian observer Bao Fang was made Hongzhou prefect and Jiangxi united training observer.",
    idiomatic: "On wushen Bao Fang moved to Jiangxi from Fujian.",
  },
  s0148: {
    literal: "On guichou on the emperor's birthday he did not accept gifts from inside or outside — only Li Zhengji and Tian Yue each presented thirty thousand bolts of silk; an edict sent them to the revenue office.",
    idiomatic: "On guichou the emperor refused birthday gifts except silk from Zhengji and Yue, sent to revenue.",
  },
  s0149: {
    literal: "The consort's father Wang Jingxian and the emperor's son-in-law Gao Yi presented gold and bronze images. The emperor said: \"What merit is there? It is not what We did.\"",
    idiomatic: "The consort's father and a son-in-law offered golden images; the emperor refused them.",
  },
  s0150: {
    literal: "It is not what We did.",
    idiomatic: "\"That was not Our doing.\"",
  },
  s0151: {
    literal: "They were returned.",
    idiomatic: "The gifts were sent back.",
  },
  s0152: {
    literal: "On renxu Hengzhou prefect, Heir of Prince of Cao Li Gao was made Tanzhou prefect and Hunan united training observer; Censor-in-Chief Yuan Quanrou was made Hangzhou prefect.",
    idiomatic: "On renxu Li Gao became Hunan commissioner; Yuan Quanrou Hangzhou prefect.",
  },
  s0153: {
    literal: "Fifth month, jiazi new moon.",
    idiomatic: "Fifth month, new moon on jiazi.",
  },
  s0154: {
    literal: "On wuchen Grand Master of the Court of Imperial Sacrifices Wei Lun was made Grand Minister of Sacrifices and again sent to Tibet.",
    idiomatic: "On wuchen Wei Lun returned to Tibet as grand minister of sacrifices.",
  },
  s0155: {
    literal: "On jimao Right General of the Golden Guard Li Tong was made Qianzhou prefect and Qianzhong pacification, suppression, observation, and salt-iron commissioner.",
    idiomatic: "On jimao Li Tong became Qianzhong commissioner.",
  },
  s0156: {
    literal: "Chaozhou prefect Chang Gun was made Fujian observer.",
    idiomatic: "Chang Gun became Fujian observer.",
  },
  s0157: {
    literal: "Jingyuan officer Liu Guangguo killed Liu Wenxi and surrendered; Jingyuan was pacified.",
    idiomatic: "Liu Guangguo killed Wenxi and Jingyuan submitted.",
  },
  s0158: {
    literal: "Sixth month, jiawu new moon: Secretariat Vice Director and Associate Cui Youfu died.",
    idiomatic: "Sixth month: Chancellor Cui Youfu died.",
  },
  s0159: {
    literal: "On xinchou Fengtian city was built.",
    idiomatic: "On xinchou they fortified Fengtian.",
  },
  s0160: {
    literal: "Acting Palace Aide Liu Haibin was made concurrent censor-in-chief and enfeoffed Prince of Bingbing pacification.",
    idiomatic: "Liu Haibin, rewarded for killing Wenxi, became a pacification prince.",
  },
  s0161: {
    literal: "Haibin was a Jingyuan officer — rewarded for killing Liu Wenxi.",
    idiomatic: "He was a Jingyuan officer honored for slaying Wenxi.",
  },
  s0162: {
    literal: "On yimao Jingzhao prefect Yuan Xiu was sent to the Uyghurs to invest the Martial-Righteous Successful Qaghan.",
    idiomatic: "On yimao Yuan Xiu invested the Uyghur qaghan.",
  },
  s0163: {
    literal: "Autumn, seventh month, dingchou: the palace Ullambana offering was abolished; monks were not ordered to perform inner chapels.",
    idiomatic: "Seventh month: palace Ullambana rites and inner chapels were ended.",
  },
  s0164: {
    literal: "On renshen the Court of Imperial Entertainments' Left and Right Majestic Far Camps were placed under the Golden Guard.",
    idiomatic: "On renshen the Majestic Far Camps joined the Golden Guard.",
  },
  s0165: {
    literal: "On jichou (source corrupt: 醜惡 for 丑), Loyalty Prefecture prefect Liu Yan was ordered to commit suicide.",
    idiomatic: "On jichou Liu Yan was ordered to kill himself at Zhongzhou.",
  },
  s0166: {
    literal: "Eighth month, jiawu: Zhenwu commissioner Zhang Guangsheng killed more than a thousand Uyghur leaders led by Tudu Tong and others, seizing over a thousand camels and horses and one hundred thousand bolts of brocade.",
    idiomatic: "On jiawu Zhang Guangsheng massacred Uyghur leaders and seized vast booty.",
  },
  s0167: {
    literal: "Guangsheng was then summoned to court; Peng Lingfang replaced him.",
    idiomatic: "Guangsheng was recalled; Peng Lingfang replaced him.",
  },
  s0168: {
    literal: "On yiwei Hezhong-Jin-Jiang observer Du Ya was made Muzhou prefect.",
    idiomatic: "On yiwei Du Ya was demoted to Muzhou.",
  },
  s0169: {
    literal: "On dingwei Zhu Ci was advanced to Grand Secretariat Director; other posts unchanged.",
    idiomatic: "On dingwei Zhu Ci became grand secretariat director.",
  },
  s0170: {
    literal: "Prince of Shu Mo was made Jingyuan commissioner-in-chief; Right Vice Director Meng Hao was made Jing prefect and acting rear commander.",
    idiomatic: "Prince of Shu Mo headed Jingyuan; Meng Hao held Jingzhou.",
  },
  s0171: {
    literal: "Eastern Bo Wuman chieftains came to court with tribute.",
    idiomatic: "Eastern Bo chieftains presented tribute.",
  },
  s0172: {
    literal: "On dingsi the emperor's mother Lady Shen was honored as empress dowager from afar.",
    idiomatic: "On dingsi Empress Shen was proclaimed from afar.",
  },
  s0173: {
    literal: "On wuwu Minister of Civil Offices Yan Zhenqing was made Junior Tutor to the Heir, still Rites commissioner.",
    idiomatic: "On wuwu Yan Zhenqing became junior tutor while keeping rites duties.",
  },
  s0174: {
    literal: "Heir of Prince of Shu Zao was re-enfeoffed Heir of Prince of Ying.",
    idiomatic: "The heir of Shu was re-titled heir of Ying.",
  },
  s0175: {
    literal: "Ninth month, wuchen: revenue judge Han Hui memorialized to set up ten furnaces casting coin at Shangzhou Hongya, Luoyuan, and supervisory smelters.",
    idiomatic: "Ninth month: Han Hui sought ten new mints in Shangzhou.",
  },
  s0176: {
    literal: "The seven Jiang-Huai mints cost two thousand cash per thousand cast — all were requested abolished; it was granted.",
    idiomatic: "Jiang-Huai mints, too costly, were abolished.",
  },
  s0177: {
    literal: "On jimao there was thunder.",
    idiomatic: "On jimao thunder sounded.",
  },
  s0178: {
    literal: "Tenth month of winter, jiawu: Left Secretariat Director Xue Yong was demoted to Lianshan district magistrate for corruption.",
    idiomatic: "Tenth month: Xue Yong was exiled for graft.",
  },
  s0179: {
    literal: "On yisi Junior Tutor to the Heir, Prince of Changhua Bai Xiaode died.",
    idiomatic: "On yisi Bai Xiaode died.",
  },
  s0180: {
    literal: "On gengyin Prince of Mu Shu was made commissioner to welcome the empress dowager; Works Minister Qiao Lin was deputy.",
    idiomatic: "On gengyin Prince of Mu led the mission to welcome Empress Shen.",
  },
  s0181: {
    literal: "Eleventh month, xinyou new moon: assembly envoys and tribute envoys were received at Xuanzheng Hall — since the wars, circuits had not filed accounts nor had inside and outside attended court for twenty-five years; now the old system was restored.",
    idiomatic: "Eleventh month: after twenty-five years, provincial assemblies and tribute audiences returned.",
  },
  s0182: {
    literal: "One hundred seventy-three circuits attended; an edict ordered two waiting on rotation at court.",
    idiomatic: "One hundred seventy-three delegations came; two at a time waited on the emperor.",
  },
  s0183: {
    literal: "On yichou the five kings including Jing Hui were posthumously enfeoffed; Zhang Jiuling was posthumously made Grand Mentor; Zhong Shaojing Grand Preceptor to the Heir.",
    idiomatic: "On yichou loyal Tang princes and Zhang Jiuling received posthumous honors.",
  },
  s0184: {
    literal: "On wuyin princes who held office were first ordered to leave the palace and take court ranks.",
    idiomatic: "On wuyin titled princes began attending court outside the palace.",
  },
  s0185: {
    literal: "Ten county princesses of Yueyang and others, long unmarried in the princes' hostel, were all ordered married by ritual.",
    idiomatic: "Ten long-unwed princesses were married off by imperial order.",
  },
  s0186: {
    literal: "Twelfth month, xinmao: Wei Lun returned from mission with fifty-five Tibetans including the minister Lun Qinmingsi, presenting gifts — relations were restored.",
    idiomatic: "Twelfth month: Wei Lun returned with Tibetan envoys bearing gifts.",
  },
  s0187: {
    literal: "On dingyou an order was given to classify one hundred eighty-seven founding ministers from Fang Xuanling onward into three grades of merit.",
    idiomatic: "On dingyou founding ministers were ranked in three grades of merit.",
  },
  s0188: {
    literal: "That year the Households account: households totaled 3,085,076; tax revenue 13,056,070 strings — salt profits not included.",
    idiomatic: "That year the census counted 3,085,076 households and 13.06 million strings in tax.",
  },
  s0189: {
    literal: "Jianzhong 2 — first month, gengshen new moon. (The source repeats the year numeral.)",
    idiomatic: "Jianzhong 2 opened on gengshen, first month.",
  },
  s0190: {
    literal: "On wuchen Chengdé commissioner, Heng-Ding observer, Minister of Works, Grand Preceptor to the Heir, associate, Hengzhou prefect, Prince of Longxi Li Baochen died.",
    idiomatic: "On wuchen Li Baochen of Chengdé died.",
  },
  s0191: {
    literal: "On bingzi Bian-Song-Slip-Chen commissioner Li Mian was made Yongping commissioner over Bian, Slip, and Chen.",
    idiomatic: "On bingzi Li Mian became Yongping commissioner.",
  },
  s0192: {
    literal: "War Minister and Luoyang commandant Lu Sijing was made Zheng-Ru-Shaan-Heyang commissioner and eastern-capital observer.",
    idiomatic: "Lu Sijing became eastern-capital observer over Zheng-Ru-Shaan-Heyang.",
  },
  s0193: {
    literal: "Songzhou prefect Liu Xia was made Song-Bo-Ying commissioner.",
    idiomatic: "Liu Xia became Song-Bo-Ying commissioner.",
  },
  s0194: {
    literal: "Zhengzhou was placed under Yongping army.",
    idiomatic: "Zhengzhou joined Yongping.",
  },
  s0195: {
    literal: "From last year's tenth month there was no snow until jiashen when snow and rain fell.",
    idiomatic: "Snow finally fell on jiashen after a snowless year.",
  },
  s0196: {
    literal: "On dinghai acting Households Minister Zhang Xiangong was made Luoyang commandant.",
    idiomatic: "On dinghai Zhang Xiangong became Luoyang commandant.",
  },
  s0197: {
    literal: "Henan prefect Zhao Huibo was made Hezhong prefect and Hezhong-Jin-Jiang-Ci-Xi defense observer; former Zhengzhou prefect Yu Yi was made Henan prefect.",
    idiomatic: "Zhao Huibo and Yu Yi swapped Hezhong and Henan.",
  },
  s0198: {
    literal: "Second month, yiwei: Censor-in-Chief Lu Qi was made censor-in-chief and capital-region observer; Gui-guan observer Li Changqi was made Jiangling prefect, concurrent censor-in-chief, and Jingnan commissioner.",
    idiomatic: "Second month: Lu Qi and Li Changqi took capital and Jingnan posts.",
  },
  s0199: {
    literal: "Former Jingnan commissioner Yu Zhun was made Left Secretariat Director.",
    idiomatic: "Yu Zhun became left director.",
  },
  s0200: {
    literal: "On jiachen Rongzhou prefect Lu Yue was made Gui prefect and Gui-guan defense observer.",
    idiomatic: "On jiachen Lu Yue became Gui-guan observer.",
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
