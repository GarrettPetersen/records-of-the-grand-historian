#!/usr/bin/env node
/** Batch 11: s1001–s1100 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1001;
const END = 1100;

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
  s1001: {
    literal: 'On jisi Vice Minister of Personnel Yu Chengxuan was made Director of Sacrifices.',
    idiomatic: 'On jisi Yu Chengxuan took Sacrifices.',
  },
  s1002: {
    literal: 'On guiyou Director of the Imperial Clan Li Shen was made Shan defense commissioner, replacing Cui Xian;',
    idiomatic: 'On guiyou Li Shen replaced Cui Xian at Shan;',
  },
  s1003: {
    literal: 'Xian was made Right Palace Companion.',
    idiomatic: 'Cui Xian became right palace companion.',
  },
  s1004: {
    literal: 'On jimao audience at Linde Hall for Tibetan, Bohai, Zangke, and Kunming envoys.',
    idiomatic: 'On jimao foreign envoys were received at Linde.',
  },
  s1005: {
    literal: 'On xinsi the Censorate memorialized: Prince of Jun\'s tutor Wang Kan\'s son Zhen on a national mourning day punished people at a private residence.',
    idiomatic: 'On xinsi Wang Zhen was reported for beating men on a mourning day.',
  },
  s1006: {
    literal: 'An edict said: "By statute, on national mourning days drinking wine and music are forbidden.',
    idiomatic: 'The throne ruled:',
  },
  s1007: {
    literal: 'Punishing people and clerks has no explicit text.',
    idiomatic: '"Mourning-day punishments lack explicit statute;"',
  },
  s1008: {
    literal: 'Henceforth when such cases occur, do not memorialize.',
    idiomatic: '"do not memorialize such cases hereafter."',
  },
  s1009: {
    literal: 'Wang Zhen should be released."',
    idiomatic: '"Wang Zhen is released."',
  },
  s1010: {
    literal: 'On bingxu Silver-Green Glory Grandee, acting Minister of War, Pillar of State, Baron of Zanhuang Li Deyu was made Grand Councillor in his current office.',
    idiomatic: 'On bingxu Li Deyu joined the Grand Council.',
  },
  s1011: {
    literal: 'Third month, wuzi new moon.',
    idiomatic: 'The third month opened on wuzi.',
  },
  s1012: {
    literal: 'On gengyin former Vice Minister of Revenue Yang Sifu was made Left Vice Director.',
    idiomatic: 'On gengyin Yang Sifu became left vice director.',
  },
  s1013: {
    literal: 'On renchen Left Palace Companion Zhang Zhongfang was made heir-apparent Guest of Honor at eastern capital.',
    idiomatic: 'On renchen Zhang Zhongfang went to Luoyang.',
  },
  s1014: {
    literal: 'When Zhongfang was a bureau director he often opposed former chief minister Li Jifu\'s posthumous title; with Deyu in power Zhongfang requested leave and was given the post.',
    idiomatic: 'Zhang Zhongfang\'s feud with Li Jifu\'s title sent him to Luoyang.',
  },
  s1015: {
    literal: 'On jihai Lingnan military commissioner Li Liang died.',
    idiomatic: 'On jihai Li Liang died.',
  },
  s1016: {
    literal: 'On xinchou Prince of He Wang Qi died.',
    idiomatic: 'On xinchou Prince Qi died.',
  },
  s1017: {
    literal: 'Suzhou was again established at Yongqiao; Xuzhou\'s Fuli and Qi counties and Sizhou\'s Hong county were detached to it; eastern-capital salt commissioner Wu Jizhen was made Su prefect.',
    idiomatic: 'On guimao Suzhou was restored at Yongqiao.',
  },
  s1018: {
    literal: 'On guimao Jingzhao prefect and consort\'s kin Du Ti was made acting Minister of Rites and Fengxiang-Longyou military commissioner.',
    idiomatic: 'On guimao Du Ti took Fengxiang.',
  },
  s1019: {
    literal: 'On jiyou Annan memorialized: barbarians raided Jinlong prefecture; local Sheng Liao and Chizhuoluo states jointly sent troops and defeated the barbarians.',
    idiomatic: 'On jiyou Annan allies defeated a barbarian raid.',
  },
  s1020: {
    literal: 'On gengxu Supervising Secretary Yang Yuqing was sent out as Chang prefect; Palace Secretariat drafter Zhang Yuanfu as Ru prefect.',
    idiomatic: 'On gengxu Yang Yuqing and Zhang Yuanfu were sent to prefectures.',
  },
  s1021: {
    literal: 'Acting Court of Imperial Treasury director Wei Chang was made Jingzhao prefect.',
    idiomatic: 'Wei Chang took Jingzhao.',
  },
  s1022: {
    literal: 'On bingchen Right Palace Companion Yan Xiufu was made Henan prefect.',
    idiomatic: 'On bingchen Yan Xiufu took Henan.',
  },
  s1023: {
    literal: 'On dingsi Supervising Secretary Xiao Huan was made Zheng prefect.',
    idiomatic: 'On dingsi Xiao Huan took Zheng.',
  },
  s1024: {
    literal: 'Summer, fourth month, wuwu new moon.',
    idiomatic: 'The fourth month opened on wuwu.',
  },
  s1025: {
    literal: 'On xinyou the Nine Surnames Uyghur qaghan died.',
    idiomatic: 'On xinyou the Uyghur qaghan died.',
  },
  s1026: {
    literal: 'On guihai former Fengxiang military commissioner and acting Minister of Works Dou Yizhi died.',
    idiomatic: 'On guihai Dou Yizhi died.',
  },
  s1027: {
    literal: 'On guiyou Tong prefect Wu Shizhi was made Jiangxi observation commissioner.',
    idiomatic: 'On guiyou Wu Shizhi took Jiangxi.',
  },
  s1028: {
    literal: 'Vice Minister of Personnel Gao Xia was made Tong prefect.',
    idiomatic: 'Gao Xia took Tong.',
  },
  s1029: {
    literal: 'On gengchen Vice Minister of Works Li Guyuan was made Right Vice Director; Palace Secretariat drafter Yang Rushi was made Vice Minister of Works.',
    idiomatic: 'On gengchen Li Guyuan and Yang Rushi exchanged posts.',
  },
  s1030: {
    literal: 'On jiazi Henan prefect Bai Juyi was made heir-apparent Guest of Honor at eastern capital.',
    idiomatic: 'On jiazi Bai Juyi retired to Luoyang.',
  },
  s1031: {
    literal: 'On jiashen Jiangxi observation commissioner Pei Yi was made Xu-Chi observation commissioner, replacing Shen Chuanshi;',
    idiomatic: 'On jiashen Pei Yi replaced Shen Chuanshi at Xu-Chi;',
  },
  s1032: {
    literal: 'Chuanshi was made Vice Minister of Personnel.',
    idiomatic: 'Shen Chuanshi took Personnel.',
  },
  s1033: {
    literal: 'Right Gold Crow guard general Tang Hongshi was envoy to the Uyghurs to invest Nine Surnames Uyghur Aidengli Luomi Moshi Geju Zhangxin qaghan.',
    idiomatic: 'Tang Hongshi invested the new Uyghur qaghan.',
  },
  s1034: {
    literal: 'Fifth month, dinghai new moon.',
    idiomatic: 'The fifth month opened on dinghai.',
  },
  s1035: {
    literal: 'On dingyou Li Ting was made Fengxiang-Longyou military commissioner, still acting Minister of Education and heir-apparent Grand Mentor.',
    idiomatic: 'On dingyou Li Ting took Fengxiang.',
  },
  s1036: {
    literal: 'On guimao Shannan West military commissioner Li Zaiyi came to court.',
    idiomatic: 'On guimao Li Zaiyi came to court.',
  },
  s1037: {
    literal: 'On guichou former Qiong prefect Liu Min was made Annan protector.',
    idiomatic: 'On guichou Liu Min took Annan.',
  },
  s1038: {
    literal: 'Sixth month, dingsi new moon.',
    idiomatic: 'The sixth month opened on dingsi.',
  },
  s1039: {
    literal: 'On yisi Shannan West military commissioner Li Zaiyi was made Taiyuan prefect, northern-capital regent, and Hedong military commissioner, still acting Grand Mentor and Grand Councillor.',
    idiomatic: 'On yisi Li Zaiyi took Hedong.',
  },
  s1040: {
    literal: 'On renshen Censor-in-Chief Li Han was made Vice Minister of Rites; Minister of Works and Hanlin lecture academician Zheng Tan was made Censor-in-Chief.',
    idiomatic: 'On renshen Li Han and Zheng Tan exchanged Rites and the censorate.',
  },
  s1041: {
    literal: 'On jiaxu Minister of Punishments Gao Yu was made eastern-capital Grand Mentor.',
    idiomatic: 'On jiaxu Gao Yu retired to Luoyang.',
  },
  s1042: {
    literal: 'On yihai Secretariat Vice Director and Grand Councillor Li Zongmin was made acting Minister of Rites, Grand Councillor, Xingyuan prefect, and Shannan West military commissioner.',
    idiomatic: 'On yihai Li Zongmin took Shannan West.',
  },
  s1043: {
    literal: 'On dingchou Left Gold Crow guard general Li Congyi was made Guiguan observation commissioner.',
    idiomatic: 'On dingchou Li Congyi took Guiguan.',
  },
  s1044: {
    literal: 'On jimao Right Divine Strategy great general Li Yong was made Binning military commissioner.',
    idiomatic: 'On jimao Li Yong took Binning.',
  },
  s1045: {
    literal: 'Heyang repaired the flood barrier dyke; forty thousand laborers irrigated more than five thousand qing in Jiyuan, Heyang, Wen, Wude, and Wuzhi five counties.',
    idiomatic: 'Heyang\'s dyke irrigated five thousand qing for forty thousand workers.',
  },
  s1046: {
    literal: 'On guiwei Jingyuan military commissioner Zhang Weiqing died.',
    idiomatic: 'On guiwei Zhang Weiqing died.',
  },
  s1047: {
    literal: 'On yiyou former Hedong military commissioner Linghu Chu was made acting Right Vice Director and Minister of Personnel.',
    idiomatic: 'On yiyou Linghu Chu took Personnel.',
  },
  s1048: {
    literal: 'Autumn, seventh month, bingxu new moon.',
    idiomatic: 'The seventh month opened on bingxu.',
  },
  s1049: {
    literal: 'On dinghai Right Longwu commander Kang Zhimu was made Four Garrisons-North Court field commander and Jingyuan military commissioner.',
    idiomatic: 'On dinghai Kang Zhimu took Jingyuan.',
  },
  s1050: {
    literal: 'On renyin Silver-Green Glory Grandee, acting Right Vice Director, salt commissioner, Pillar of State, Duke of Dai Wang Ya was made Grand Councillor, retaining the commission.',
    idiomatic: 'On renyin Wang Ya joined the Grand Council.',
  },
  s1051: {
    literal: 'On jiachen Right Vice Director Li Guyuan and others memorialized that vice directors in the ministry should not receive bows from fourth rank and below.',
    idiomatic: 'On jiachen Li Guyuan renewed the bowing protest.',
  },
  s1052: {
    literal: 'The edict followed the Dade 4 eleventh-month sixteenth-day edict.',
    idiomatic: 'The Dade 4 bowing rule was upheld again.',
  },
  s1053: {
    literal: 'On yisi Guo prefect Cui Xuanliang died.',
    idiomatic: 'On yisi Cui Xuanliang died.',
  },
  s1054: {
    literal: 'Left Vice Director Yang Sifu was made acting Minister of Rites and eastern Sichuan military commissioner;',
    idiomatic: 'Yang Sifu took eastern Sichuan;',
  },
  s1055: {
    literal: 'Vice Minister of Revenue Yu Jingxiu was made Left Vice Director.',
    idiomatic: 'Yu Jingxiu became left vice director.',
  },
  s1056: {
    literal: 'On jiyou because of drought the capital offices were ordered to review prisoners.',
    idiomatic: 'On jiyou drought prompted prisoner review.',
  },
  s1057: {
    literal: 'On renzi an edict: officials serving outside with first-rank capital concurrent posts, though not handling government, should still receive both salaries.',
    idiomatic: 'On renzi concurrent capital salaries were ordered paid.',
  },
  s1058: {
    literal: 'On guichou Left Vice Director Li Cheng was made acting Minister of Works, Bian prefect, and Xuanwu military commissioner.',
    idiomatic: 'On guichou Li Cheng took Xuanwu.',
  },
  s1059: {
    literal: 'On jiayin because of drought the market was moved.',
    idiomatic: 'On jiayin drought moved the market.',
  },
  s1060: {
    literal: 'Demoted official Kaizhou registrar Song Shenxi died; an edict permitted return for burial.',
    idiomatic: 'Song Shenxi died in exile; burial at home was allowed.',
  },
  s1061: {
    literal: 'Intercalary seventh month, yimao new moon, an edict said: "We inherit the great design and cover the living kind, striving in reverent fear, receiving heaven\'s blessing.',
    idiomatic: 'On yimao Wenzong proclaimed a drought penance edict:',
  },
  s1062: {
    literal: 'Yet yin and yang are not in harmony and sweet rain is delayed, harming Our grain and baling the black-headed people.',
    idiomatic: '"Rain fails and the people suffer."',
  },
  s1063: {
    literal: 'The fault lies in Us — how dare We forget self-blame.',
    idiomatic: '"The fault is mine."',
  },
  s1064: {
    literal: 'Henceforth avoid the main hall, reduce meals, stop Music Office performances, reduce fodder for stable horses by measure, and temporarily cut hundred-office kitchens.',
    idiomatic: '"I cut meals, music, and palace expense."',
  },
  s1065: {
    literal: 'Yin depression harms harmony — release one thousand palace women.',
    idiomatic: '"Release one thousand palace women."',
  },
  s1066: {
    literal: 'Five-Direction hawks and dogs should be reduced and released by measure.',
    idiomatic: '"Reduce imperial hawks and dogs."',
  },
  s1067: {
    literal: 'Inner and outer construction not urgent — all stop."',
    idiomatic: '"Halt non-urgent construction."',
  },
  s1068: {
    literal: 'Rain had long failed and the Emperor\'s heart was deeply troubled.',
    idiomatic: 'Long drought troubled Wenzong.',
  },
  s1069: {
    literal: 'Several days after the edict rain moistened thoroughly and hearts were greatly pleased.',
    idiomatic: 'Rain followed within days to public joy.',
  },
  s1070: {
    literal: 'On yichou former Xuanwu military commissioner Yang Yuanqing was made heir-apparent Grand Mentor.',
    idiomatic: 'On yichou Yang Yuanqing became grand mentor.',
  },
  s1071: {
    literal: 'On wuxu Supervising Secretary Cui Rong was made Hua prefect.',
    idiomatic: 'On wuxu Cui Rong took Hua.',
  },
  s1072: {
    literal: 'On guiwei heir-apparent Guest of Honor Li Shen was made acting Left Palace Companion and Yue prefect, Zhedong observation commissioner, replacing Lu Gen;',
    idiomatic: 'On guiwei Li Shen replaced Lu Gen at Zhedong;',
  },
  s1073: {
    literal: 'Gen was made Xu-Xuan observation commissioner.',
    idiomatic: 'Lu Gen took Xu-Xuan.',
  },
  s1074: {
    literal: 'Eighth month, jiashen new moon: held investiture of crown prince Yong at Xuanzheng Hall.',
    idiomatic: 'On jiashen Crown Prince Yong was invested at Xuanzheng.',
  },
  s1075: {
    literal: 'That day a descent edict: "Death sentences become exile; exile and below each reduced one grade.',
    idiomatic: 'Investiture day brought amnesty:',
  },
  s1076: {
    literal: 'Imperial princes henceforth leave the palace in sequence, receiving tight-watched prefectural aide posts.',
    idiomatic: '"Princes shall take prefectural posts;"',
  },
  s1077: {
    literal: 'The Sixteen Mansions county princesses — charge Personnel to choose husbands from the selection lists and report names.',
    idiomatic: '"Princesses shall marry from selection lists."',
  },
  s1078: {
    literal: 'The crown prince is now studying the Six Classics with tutors; in one or two years he should enter the Imperial College to revive fallen rites.',
    idiomatic: '"The crown prince shall soon enter the Imperial College."',
  },
  s1079: {
    literal: 'Charge the Directorate of Education to select famous Confucians and establish one Five Classics doctorate each.',
    idiomatic: '"Establish Five Classics doctorates."',
  },
  s1080: {
    literal: 'Sons of dukes, ministers, and clans from next year onward must first study in the Imperial College and may not face the Mingjing examination without it.',
    idiomatic: '"Clan sons must study before Mingjing exams."',
  },
  s1081: {
    literal: 'Jinshi candidates should first sit the text-excerpt test and briefly answer great meaning — release those who master canonical meaning.',
    idiomatic: '"Jinshi requires text mastery first."',
  },
  s1082: {
    literal: 'Ministers and grandees are what inferiors watch and distant regions imitate — if not respectful, frugal, and upright in appointing men, how may obedience be hoped for?',
    idiomatic: '"Ministers must model frugality for the realm."',
  },
  s1083: {
    literal: 'Moreover We do not treasure pearls and jade, do not wear fine ornament — even the six palaces all pursue thrift.',
    idiomatic: '"Even the inner palaces are thrifty."',
  },
  s1084: {
    literal: 'Can ministers not abandon this intent and lead the masses?',
    idiomatic: '"Will you not lead the people in my thrift?"',
  },
  s1085: {
    literal: 'In recent years issued regulations all approximate national statutes, removing the worst — somewhat balanced.',
    idiomatic: '"Recent sumptuary rules approached balance."',
  },
  s1086: {
    literal: 'Yet scholar-officials indulge convenience, rest in custom, follow without reform until today.',
    idiomatic: '"Officials still cling to old luxury."',
  },
  s1087: {
    literal: 'Civil and military regular officials and all prefectural chiefs\' heirs from this year\'s tenth month — dress and carriages should follow the Dade 6 tenth-month seventh-day edict; where deliberately violated, heavier demotion and censure.',
    idiomatic: '"From the tenth month, enforce Dade 6 dress rules."',
  },
  s1088: {
    literal: 'Civil and military regular officials and all prefectural chiefs\' sons mourning fathers receive two merit rotations."',
    idiomatic: '"Mourning sons of officials receive two merit rotations."',
  },
  s1089: {
    literal: 'On guisi heir-apparent Grand Mentor Yang Yuanqing died.',
    idiomatic: 'On guisi Yang Yuanqing died.',
  },
  s1090: {
    literal: 'On wushen Jingzhao prefect Wei Chang was also Censor-in-Chief; Minister of Punishments Gao Yu was made Zhongwu military commissioner.',
    idiomatic: 'On wushen Wei Chang gained the censorate and Gao Yu took Zhongwu.',
  },
  s1091: {
    literal: 'Ninth month, jiayin new moon.',
    idiomatic: 'The ninth month opened on jiayin.',
  },
  s1092: {
    literal: 'On bingyin Attending Censor Li Kuan memorialized in the inner court impeaching former Binning field marshal Zheng Zhu, saying: "Zhu communicates inside with edict envoys and outside with court officials, shuttling between two realms, divining to seize wealth, active by night and hidden by day, stealing transforming power.',
    idiomatic: 'On bingyin Li Kuan impeached Zheng Zhu for corruption and intrigue:',
  },
  s1093: {
    literal: 'Men dare not speak; the road is watched by eyes — please hand to the law offices to investigate the facts."',
    idiomatic: '"Hand Zhu to the law offices."',
  },
  s1094: {
    literal: 'Within ten days remonstrance memorials piled up dozens; therefore Zhu was appointed Tongwang mansion registrar, concurrent Attending Censor, and Divine Strategy army judge — inside and outside were appalled.',
    idiomatic: 'Zheng Zhu was instead promoted to Divine Strategy judge, appalling the court.',
  },
  s1095: {
    literal: 'On jiayin former Zhongwu military commissioner Wang Zhixing remained acting Grand Mentor, Palace Companion, Hezhong prefect, and Hezhong-Jin-Jiang-Ci military commissioner, replacing Wang Qi;',
    idiomatic: 'On jiayin Wang Zhixing replaced Wang Qi at Hezhong;',
  },
  s1096: {
    literal: 'Qi was made Minister of War.',
    idiomatic: 'Wang Qi took War.',
  },
  s1097: {
    literal: 'Winter, tenth month, guiwei new moon: seven Yangzhou counties including Jiangdu flooded and harmed crops.',
    idiomatic: 'On guiwei Yangzhou floods ruined crops.',
  },
  s1098: {
    literal: 'On renchen on the Emperor\'s birthday monks and Daoists lectured at Linde Hall.',
    idiomatic: 'On renchen monks lectured at Linde on Wenzong\'s birthday.',
  },
  s1099: {
    literal: 'Next day at Yanying the Emperor told the chief ministers: "Birthday vegetarian feasts began in recent times.',
    idiomatic: 'At Yanying Wenzong called birthday feasts a recent custom:',
  },
  s1100: {
    literal: 'We follow it long and cannot abruptly abolish it; though a feast is set, only Wang Yuanzhong and a few briefly enter the hall — as for monk and Daoist lectures, We do not listen at all."',
    idiomatic: '"I keep the feast but will not hear the monks."',
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
