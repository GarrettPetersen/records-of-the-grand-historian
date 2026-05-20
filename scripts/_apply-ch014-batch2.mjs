#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.014, Shunzong, Xianzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
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
    literal: "Yet Heaven's blessing does not descend; illness is not cured — how shall I serve the ancestral temple's spirits, or perform suburban and border sacrifices!",
    idiomatic: "He asked how he could sacrifice while still gravely ill.",
  },
  s0102: {
    literal: "I consult the many directors and face the Supreme Heaven; inwardly I am ashamed in heart, upward I fear Heaven's mandate.",
    idiomatic: "He professed shame before Heaven and the ministers.",
  },
  s0103: {
    literal: "Morning and night reverent fear, deeply pondering the long plan.",
    idiomatic: "He spoke of sleepless dread for the realm's future.",
  },
  s0104: {
    literal: "Ten thousand affairs in a day cannot long be vacant;",
    idiomatic: "The throne could not stay empty, he said;",
  },
  s0105: {
    literal: "Heaven's work and man's replacement cannot long be violated.",
    idiomatic: "nor could the mandate wait on his recovery.",
  },
  s0106: {
    literal: "The crown prince Chun is wise and perspicacious, warm in culture, broad and harmonious, benevolent and kind; filial and brotherly virtue, loving and reverent sincerity, penetrate the spirits and reach above and below.",
    idiomatic: "He praised Prince Chun's virtue as fit for rule.",
  },
  s0107: {
    literal: "Therefore I use the imperial king's utmost public Way, follow father-and-son transmission's system, entrust the great vessel, to comfort the trillion people.",
    idiomatic: "He would abdicate by the ancient public transfer of the vessel.",
  },
  s0108: {
    literal: "He will surely be able to proclaim the ancestors' heavy radiance, bear Heaven-and-earth's fine mandate, follow and accord with the completed statutes, and forever pacify the four quarters.",
    idiomatic: "Chun, he vowed, would restore Tang glory and pacify the realm.",
  },
  s0109: {
    literal: "It is fitting to order the crown prince immediately to take the imperial throne; I shall be called Retired Emperor, dwelling in Xingqing Palace; my documents shall be called Proclamations.\"",
    idiomatic: "He ordered Chun enthroned and himself retired to Xingqing as Taishang Huang. Thus ended the edict.",
  },
  s0110: {
    literal: "On xinchou a proclamation: \"Having the realm and transmitting it to one's son is the former kings' system.",
    idiomatic: "On xinchou a proclamation framed abdication as ancient custom:",
  },
  s0111: {
    literal: "Reverently according with the great canon, this is utmost publicness; thereby to raise bright glory and embody civil virtue.",
    idiomatic: "it cast the transfer as supreme public duty.",
  },
  s0112: {
    literal: "I have obtained service to the ancestral temple and face and rule ten thousand regions; descending illness is not cured; many ordinary affairs are lacking.",
    idiomatic: "Illness, he said, had left government in disarray.",
  },
  s0113: {
    literal: "Therefore I order the eldest son to guard the state in my stead; on this honored day he brightly receives the investiture rites — on the ninth of this month the Emperor is to be enfeoffed at Xuanzheng Hall.",
    idiomatic: "Chun's enthronement was set for the ninth at Xuanzheng Hall.",
  },
  s0114: {
    literal: "The state has a great mandate; grace should renew all — it is fitting, because of the rejoicing in changing the era, to extend the mercy of release within the four seas.",
    idiomatic: "A new reign would bring a general pardon.",
  },
  s0115: {
    literal: "Zhenyuan 21 should be changed to Yongzhen 1.",
    idiomatic: "The era name became Yongzhen.",
  },
  s0116: {
    literal: "From before the fifth day of the eighth month of Zhenyuan 21, empire-wide death sentences were reduced to exile; exile and below were reduced one grade in succession.",
    idiomatic: "Capital crimes were commuted in the abdication amnesty. Thus ended the proclamation.",
  },
  s0117: {
    literal: "A proclamation installed Lady Wang, Senior Consort, as Retired Empress, and Lady Dong, Junior Consort, as Retired Emperor's Virtuous Consort.",
    idiomatic: "Wang and Dong received retired-harem ranks.",
  },
  s0118: {
    literal: "On renyin Right Regular Cavalry Attendant Wang Pi was demoted to staff officer of Kaizhou; former Vice Minister of Revenue and revenue, salt, iron, and transport commissioner Wang Shuwen was demoted to census officer of Yuzhou.",
    idiomatic: "Wang Pi and Wang Shuwen were exiled on renyin.",
  },
  s0119: {
    literal: "First month, bingyin new moon — the Emperor led the hundred officials to present to the Retired Emperor the honorific title Responding to Heaven, Sagely Longevity.",
    idiomatic: "Xianzong offered his father the honorific Responding to Heaven, Sagely Longevity.",
  },
  s0120: {
    literal: "On jiashen the Retired Emperor died in Xianning Hall of Xingqing Palace, aged forty-six.",
    idiomatic: "Shunzong died at forty-six in Xingqing Palace on jiashen.",
  },
  s0121: {
    literal: "Sixth month, yimao — the Emperor led the ministers to present on the late Retired Emperor the posthumous title To the Utmost Virtue Great Sage Great Peace Filial; temple name Shunzong.",
    idiomatic: "In the sixth month the court fixed Shunzong's posthumous name and temple title.",
  },
  s0122: {
    literal: "Autumn, seventh month, renshen — buried at Feng Mausoleum.",
    idiomatic: "He was buried at Fengling in the seventh month.",
  },
  s0123: {
    literal: "Historian Han Yu said: In Shunzong's time as heir he devoted his heart to the arts and was skilled at clerical script.",
    idiomatic: "【Historian's appraisal】 Han Yu wrote that as heir Shunzong cultivated the arts and excelled at clerical script.",
  },
  s0124: {
    literal: "Dezong was skilled at composing poetry; whenever he bestowed poems and orders on great ministers and frontier commissioners, he always ordered the heir to write them out.",
    idiomatic: "Dezong had him copy every poem sent to ministers and generals.",
  },
  s0125: {
    literal: "His nature was broad and benevolent yet decisive; he honored teachers with ritual and always bowed first.",
    idiomatic: "He was gentle but firm and ceremoniously honored his tutors.",
  },
  s0126: {
    literal: "Following the fortune to Fengtian, when rebel Zhu pressed close, he often personally led the palace guard, mounted the wall to repel battle, and urged the officers and soldiers — none did not strive fiercely.",
    idiomatic: "At Fengtian he fought on the walls and roused the guards against Zhu Ci.",
  },
  s0127: {
    literal: "Dezong's years on the throne were long; gradually he did not lend authority to chancellors.",
    idiomatic: "Late in Dezong's reign chancellors held little real power.",
  },
  s0128: {
    literal: "Favored attendants at his side such as Pei Yanling, Li Qiyun, and Wei Qumou, exploiting intervals, wielded affairs, carved the lower to win merit, and drove out Lu Zhi, Zhang Pang, and their kind — men did not dare speak; the heir calmly argued and debated — therefore in the end Yanling and Qumou were not made chancellors.",
    idiomatic: "He alone spoke against favorites who ruined Lu Zhi and blocked their rise to the council.",
  },
  s0129: {
    literal: "He once attended a banquet at Fish-Algae Palace.",
    idiomatic: "Once at Fish-Algae Palace he attended a banquet.",
  },
  s0130: {
    literal: "They spread water games; colored ships carved and lavish; palace women drew boats and made oar-songs; silk and bamboo sounded between — Dezong was very pleased; the heir cited the poet's \"love pleasure but do not waste\" in reply.",
    idiomatic: "When Dezong reveled at water games, the heir quoted the Odes on restraint.",
  },
  s0131: {
    literal: "Whenever in memorials to the throne, he never lent his countenance to eunuchs.",
    idiomatic: "In audience he never showed eunuchs a compliant face.",
  },
  s0132: {
    literal: "Dwelling in the stored position twenty years, the realm in secret received his bounty.",
    idiomatic: "Twenty years as heir, the empire quietly benefited from him.",
  },
  s0133: {
    literal: "Alas — he fell ill upon taking the throne; close attendants played with power;",
    idiomatic: "Alas, sickness at accession let intimates seize power;",
  },
  s0134: {
    literal: "yet he could transmit rule to the primary heir and splendidly continue the mandate — how worthy!",
    idiomatic: "yet he passed the throne to a worthy son and saved the dynasty — how worthy a ruler!",
  },
  s0135: {
    literal: "Xianzong — Emperor Xianzong, Sagely Spirit Manifest Martial Filial, taboo name Chun, eldest son of Shunzong; mother the Honored Empress Zhuangxian Wang.",
    idiomatic: "Xianzong, the Filial Emperor Chun, was Shunzong's eldest son; his mother was Empress Zhuangxian.",
  },
  s0136: {
    literal: "Second month, Dali 13, born in the Eastern Inner Palace at Chang'an.",
    idiomatic: "He was born in Chang'an's eastern palace in Dali 13.",
  },
  s0137: {
    literal: "When six or seven years old, Dezong held him on his knee and asked: \"Whose child are you, in my embrace?",
    idiomatic: "At six or seven Dezong set him on his knee and asked whose child he was.",
  },
  s0138: {
    literal: "\"He replied: \"I am the third Son of Heaven.\"",
    idiomatic: "He answered, \"The third Son of Heaven.\"",
  },
  s0139: {
    literal: "Dezong marveled and pitied him.",
    idiomatic: "Dezong was struck and fond of the boy.",
  },
  s0140: {
    literal: "Sixth month, Zhenyuan 4 — enfeoffed Prince of Guangling.",
    idiomatic: "He became Prince of Guangling in Zhenyuan 4.",
  },
  s0141: {
    literal: "In the fourth month of the year Shunzong took the throne, he was enfeoffed crown prince.",
    idiomatic: "He was made crown prince in Shunzong's fourth month.",
  },
  s0142: {
    literal: "Seventh month, yiwei — provisionally handled military and civil affairs.",
    idiomatic: "In the seventh month he was regent for state affairs.",
  },
  s0143: {
    literal: "Eighth month, dingyou new moon — received the inner abdication.",
    idiomatic: "He received the inner abdication at the eighth-month new moon.",
  },
  s0144: {
    literal: "On yisi he took the imperial throne at Xuanzheng Hall.",
    idiomatic: "He ascended at Xuanzheng Hall on yisi.",
  },
  s0145: {
    literal: "Earlier, for months it had rained; on the day the Emperor took the throne the sky cleared — people's hearts were glad.",
    idiomatic: "Rain had drenched the capital for months; his accession day dawned clear, to popular joy.",
  },
  s0146: {
    literal: "On bingwu Princess Shengping presented fifteen female attendants; the Emperor said: \"The Retired Emperor did not accept presentations — how dare I disobey!",
    idiomatic: "He refused fifteen women from Princess Shengping, citing his father's example:",
  },
  s0147: {
    literal: "Return them to the Guo clan.\"",
    idiomatic: "Send them back to the Guo family. Thus ended the edict.",
  },
  s0148: {
    literal: "On dingwei he first took Zichen and faced the hundred officials.",
    idiomatic: "On dingwei he held his first audience at Zichen Hall.",
  },
  s0149: {
    literal: "On jiyou Lu Nu, prefect of Daozhou, was made Yongguan pacification commissioner.",
    idiomatic: "Lu Nu became Yongguan commissioner on jiyou.",
  },
  s0150: {
    literal: "On gengxu Jingnan presented two tortoises; an edict said: \"I with slight understanding inherit the great enterprise; forever thinking of governance's root, what I treasure is only the worthy.",
    idiomatic: "On gengxu he rejected tortoise omens, declaring he valued men over prodigies:",
  },
  s0151: {
    literal: "As for fine grain and divine fungus, strange birds and exotic beasts — these are empty adornments of kingly transformation.",
    idiomatic: "Auspicious grain and beasts were empty pageantry, he said.",
  },
  s0152: {
    literal: "Therefore Guangwu set it forth in edicts; the Spring and Autumn Annals do not record auspicious omens — I truly have thin virtue and think of former men.",
    idiomatic: "He cited Guangwu and the Spring and Autumn to shun flattery by omens.",
  },
  s0153: {
    literal: "From now onward, all auspicious omens are only to be reported by standard form to the relevant offices; they must not be reported upward;",
    idiomatic: "Hereafter omens were to be filed with local offices only, not announced to the throne;",
  },
  s0154: {
    literal: "strange birds and exotic beasts should also cease being presented.",
    idiomatic: "and exotic animals were barred from court. Thus ended the edict.",
  },
  s0155: {
    literal: "On guichou Wei Gao, military commissioner of southwestern Sichuan, acting Grand General, Grand Preceptor, and Prince of Nankang, died.",
    idiomatic: "Wei Gao, the great western commander, died on guichou.",
  },
  s0156: {
    literal: "On jiayin Mu Zan, prefect of Changzhou, was made Xuanchi-Chi observer; former Xuanchi-Chi observer Cui Yan was made Minister of Works.",
    idiomatic: "Mu Zan and Cui Yan changed Huai-nan posts on jiayin.",
  },
  s0157: {
    literal: "On jiwei Yuan Zi, Vice Director of the Secretariat and Grand Councillor, was made pacification grand commissioner of eastern and western Sichuan and southwestern Shannan — at the time because Wei Gao had died and Liu Pi held Shu and sought the commander's seal.",
    idiomatic: "Yuan Zi was sent west because Liu Pi seized Sichuan after Wei Gao's death.",
  },
  s0158: {
    literal: "On xinyou the Retired Emperor's proclamation enfeoffed Senior Consort Lady Wang as Retired Empress.",
    idiomatic: "Lady Wang was made retired empress by proclamation on xinyou.",
  },
  s0159: {
    literal: "On guihai Zheng Yuqing, Grand Master for Court Audience, acting Left Vice Director, Light-Carriage Commandant, and bearer of the purple-gold fish bag, was made Grand Councillor.",
    idiomatic: "Zheng Yuqing entered the council on guihai.",
  },
  s0160: {
    literal: "On bingyin Li Jifu, prefect of Raozhou, was made bureau director in the Ministry of Personnel; Tang Ci, prefect of Kuizhou, was made bureau director in the Ministry of Personnel.",
    idiomatic: "Li Jifu and Tang Ci became personnel directors on bingyin.",
  },
  s0161: {
    literal: "Both were also drafters of edicts.",
    idiomatic: "Both also drafted imperial prose.",
  },
  s0162: {
    literal: "Ninth month, dingmao new moon.",
    idiomatic: "The ninth month opened on dingmao.",
  },
  s0163: {
    literal: "On jisi the practice of granting regular-rank offices to music girls of the teaching workshops was abolished.",
    idiomatic: "Court musicians lost the right to regular civil rank on jisi.",
  },
  s0164: {
    literal: "On xinwei Yuan Shao, military commissioner of the Three Cities of Heyang, died.",
    idiomatic: "Yuan Shao of Heyang died on xinwei.",
  },
  s0165: {
    literal: "On guiyou Meng Yuanyang, prefect of Chen, was made prefect of Huai and military commissioner of the Three Cities of Meng-Huai.",
    idiomatic: "Meng Yuanyang succeeded the Heyang command on guiyou.",
  },
  s0166: {
    literal: "On bingzi an order: Shen-Guang-Cai and Chen-Xu circuits had lately suffered severe drought — relief should be increased; Shen, Guang, and Cai were given 100,000 piculs of relief grain; Chen and Xu 50,000.",
    idiomatic: "Drought relief grain was allotted to central circuits on bingzi.",
  },
  s0167: {
    literal: "On dingchou former Vice Minister of Revenue Cai Bian died.",
    idiomatic: "Cai Bian died on dingchou.",
  },
  s0168: {
    literal: "Yu Di of Xiangzhou presented hawks; an edict returned them.",
    idiomatic: "Yu Di's hawk tribute was sent back.",
  },
  s0169: {
    literal: "On jimao Han Tai, staff officer of the Jingxi Shence campaign command, was demoted to prefect of Fu; Han Ye, bureau director in the Ministry of Rites, to Chi; Liu Zongyuan, outer bureau director in the Ministry of Rites, to Shao; Liu Yuxi, outer bureau director in the Ministry of Revenue, to Lian — all for associating with Wang Shuwen.",
    idiomatic: "Four Wang Shuwen allies were exiled to prefectures on jimao.",
  },
  s0170: {
    literal: "On xinsi Supervisor of Attendants Lu Zhi died.",
    idiomatic: "Lu Zhi died on xinsi.",
  },
  s0171: {
    literal: "Winter, tenth month, bingshen new moon.",
    idiomatic: "The tenth month opened on bingshen.",
  },
  s0172: {
    literal: "On dingyou the hundred officials were assembled to begin mourning for the late Grand Empress Dowager Shen outside Suzhang Gate.",
    idiomatic: "Court mourning for Empress Shen began outside Suzhang Gate on dingyou.",
  },
  s0173: {
    literal: "Acting Master of Works and concurrent Right Vice Director, Grand Councillor, Duke of Wei Jia Dan died.",
    idiomatic: "Grand Councillor Jia Dan died.",
  },
  s0174: {
    literal: "On wuxu Councillor and Sichuan pacification commissioner Yuan Zi was made acting Minister of Personnel, Grand Councillor, Governor of Chengdu, and Sichuan observation commissioner; Sichuan campaign staff officer Liu Pi was made Supervisor of Attendants.",
    idiomatic: "Yuan Zi took Sichuan; Liu Pi was promoted on wuxu.",
  },
  s0175: {
    literal: "Prince of Shu Yi died.",
    idiomatic: "Prince Yi of Shu died.",
  },
  s0176: {
    literal: "On gengzi the Nanzhao envoy Zhao Jiakuan came to attend the mountain tomb.",
    idiomatic: "A Nanzhao envoy came for the imperial funeral on gengzi.",
  },
  s0177: {
    literal: "Zhedong observer Jia Quan died.",
    idiomatic: "Jia Quan, Zhedong observer, died.",
  },
  s0178: {
    literal: "On xinchou the Tibetan envoy Lun Qilü presented gold, silver, and clothing to assist the mountain tomb.",
    idiomatic: "Tibet sent funeral gifts on xinchou.",
  },
  s0179: {
    literal: "The Court of Imperial Sacrifices presented on the late Grand Empress Dowager Shen the posthumous title Empress Ruizhen.",
    idiomatic: "Shen received the posthumous title Empress Ruizhen.",
  },
  s0180: {
    literal: "On bingwu Yang Yuling, prefect of Hua, was made prefect of Yue and Zhedong observer.",
    idiomatic: "Yang Yuling went to Zhedong on bingwu.",
  },
  s0181: {
    literal: "On dingwei Chunhua county of Guizhou was renamed Muhua county; Chunyi county of Mengzhou was renamed Zhengyi county.",
    idiomatic: "Two counties were renamed on dingwei.",
  },
  s0182: {
    literal: "On yiyou Emperor Dezong was buried at Chong Mausoleum.",
    idiomatic: "Dezong was buried at Chongling on yiyou.",
  },
  s0183: {
    literal: "On jiayin Gao Ying, Minister of Justice, was made prefect of Hua, Tongguan defender, and Zhenguo army commissioner; Vice Censor-in-Chief Li Yong was made Metropolitan Governor.",
    idiomatic: "Gao Ying and Li Yong took western posts on jiayin.",
  },
  s0184: {
    literal: "Metropolitan Governor Wang Quan was demoted to tutor of the Prince of Ya.",
    idiomatic: "Wang Quan was demoted from the capital magistracy.",
  },
  s0185: {
    literal: "Long rain — salt in the capital was dear; 20,000 piculs were taken from the storehouses and sold cheap to benefit the people.",
    idiomatic: "The court sold reserve salt cheaply after prolonged rain inflated prices.",
  },
  s0186: {
    literal: "On yisi the spirit tablets of Empress Ruizhen and Emperor Dezong were enshrined in the Imperial Ancestral Temple.",
    idiomatic: "Ruizhen and Dezong entered the ancestral temple on yisi.",
  },
  s0187: {
    literal: "On renshen Wei Zhiyi, Grand Master of Correct Counsel, Vice Director of the Secretariat and Grand Councillor, was demoted to staff officer of Yazhou — for associating with Wang Shuwen.",
    idiomatic: "Wei Zhiyi was exiled to Yazhou on renshen for the Shuwen faction.",
  },
  s0188: {
    literal: "Run, Chi, Yang, Chu, Hu, Hang, Mu, Jiang, and other prefectures suffered drought.",
    idiomatic: "Drought struck the lower Yangzi region.",
  },
  s0189: {
    literal: "Sichuan military commissioner Yuan Zi was demoted to prefect of Ji — because in comforting the Three Gorges he lingered and did not advance.",
    idiomatic: "Yuan Zi was punished for stalling against Liu Pi.",
  },
  s0190: {
    literal: "Left General of the Left Valiant Guard Li Yan was made prefect of Xia and commissioner of Xia, Sui, and Yin; Right Subordinate Heir-Apparent Wu Yuanheng was made Vice Censor-in-Chief.",
    idiomatic: "Li Yan and Wu Yuanheng received frontier and censor posts.",
  },
  s0191: {
    literal: "On jimao Han Tai, demoted from prefect of Fu, was again demoted to staff officer of Qian; Chen Jian, Vice Governor of Hezhong, to Taizhou; Liu Zongyuan, prefect of Shao, to Yongzhou; Liu Yuxi, prefect of Lian, to Langzhou; Han Ye, prefect of Chi, to Raozhou; Ling Zhun, prefect of He, to Lianzhou; Cheng Yi, prefect of Yue, to Chenzhou — all for associating with Wang Shuwen.",
    idiomatic: "Eight Shuwen allies were demoted again from prefect to staff officer on jimao.",
  },
  s0192: {
    literal: "At first they were demoted to prefects; public opinion blamed this — therefore they were again demoted and cast out.",
    idiomatic: "Public outcry forced a harsher second exile.",
  },
  s0193: {
    literal: "On xinsi Xuan, Fu, He, Chen, E, Yuan, and Qu seven prefectures suffered drought.",
    idiomatic: "Seven more circuits reported drought on xinsi.",
  },
  s0194: {
    literal: "On renwu Minister of Personnel Zheng Qionyu died.",
    idiomatic: "Zheng Qionyu died on renwu.",
  },
  s0195: {
    literal: "On jiashen Yang Ping, Hunan observer, was made prefect of Hong and Jiangxi observer; Xue Pin, prefect of Guo, was made prefect of Tan and Hunan observer.",
    idiomatic: "Yang Ping and Xue Pin changed southern commands on jiashen.",
  },
  s0196: {
    literal: "E, Yue, Wu, and Heng prefectures suffered drought.",
    idiomatic: "More drought in the middle Yangzi.",
  },
  s0197: {
    literal: "On guisi Xuanchi observer Mu Zan died.",
    idiomatic: "Mu Zan died on guisi.",
  },
  s0198: {
    literal: "Twelfth month, bingshen new moon.",
    idiomatic: "The twelfth month opened on bingshen.",
  },
  s0199: {
    literal: "On gengzi Wei Xiaqing, eastern capital regent, was made Junior Tutor of the Heir; Wang Shao, Minister of War, was made eastern capital regent.",
    idiomatic: "Wei Xiaqing and Wang Shao exchanged eastern capital posts on gengzi.",
  },
  s0200: {
    literal: "On renyin Chun county was renamed Qingxi county; those surnamed Chunyu changed their surname to Yu.",
    idiomatic: "Chun county became Qingxi and the Chunyu clan changed their name on renyin.",
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
if (data.metadata.chapter !== '014') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 014; standalone T ready (${Object.keys(T).length} entries).`
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
