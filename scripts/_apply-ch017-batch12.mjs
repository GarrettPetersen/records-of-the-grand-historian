#!/usr/bin/env node
/** Batch 12: s1101–s1200 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1101;
const END = 1200;

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
  s1101: {
    literal: 'Chief ministers Lu Sui and others memorialized: "Birthday vegetarian feasts truly seek blessing; they are not native Chinese teaching.',
    idiomatic: 'Lu Sui called birthday feasts un-Chinese:',
  },
  s1102: {
    literal: 'Your subject sees that in Kaiyuan 17 Zhang Yue and Qian Yuanzhen made the birthday Thousand-Autumn festival with inner and outer feasting to celebrate the glorious term — quite proper ritual."',
    idiomatic: '"Zhang Yue\'s Thousand-Autumn festival was proper ritual."',
  },
  s1103: {
    literal: 'The Emperor deeply approved; the chief ministers therefore requested the tenth day of the tenth month as Celebration-Complete festival for the imperial birthday.',
    idiomatic: 'Wenzong approved a tenth-month Celebration-Complete festival.',
  },
  s1104: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s1105: {
    literal: 'On xinyou Run, Chang, Su, and Hu four prefectures flooded and harmed crops.',
    idiomatic: 'On xinyou four Jiangnan prefectures flooded.',
  },
  s1106: {
    literal: 'Eleventh month, guichou new moon.',
    idiomatic: 'The eleventh month opened on guichou.',
  },
  s1107: {
    literal: 'On yihai Jingyuan military commissioner Kang Zhimu died.',
    idiomatic: 'On yihai Kang Zhimu died.',
  },
  s1108: {
    literal: 'On jimao Left Divine Strategy Changwu city commander Zhu Shuye was made Jing prefect and Jingyuan military commissioner.',
    idiomatic: 'On jimao Zhu Shuye took Jingyuan.',
  },
  s1109: {
    literal: 'On renwu a stud farm was established at Yin prefecture.',
    idiomatic: 'On renwu Yin gained a stud farm.',
  },
  s1110: {
    literal: 'Twelfth month, guiwei new moon.',
    idiomatic: 'The twelfth month opened on guiwei.',
  },
  s1111: {
    literal: 'On jihai Punishments Office finalized Court of Judicial Review director Xie Deng\'s newly compiled sixty fascicles of Statutes-after-Edicts; ordered deletion and revision to fifty fascicles.',
    idiomatic: 'On jihai fifty fascicles of revised statutes were approved.',
  },
  s1112: {
    literal: 'On gengzi the Emperor visited Wangchun Palace; his sacred person was unwell.',
    idiomatic: 'On gengzi Wenzong fell ill at Wangchun.',
  },
  s1113: {
    literal: 'On guimao Pinglu military commissioner and acting Minister of Works Wang Chengyuan died.',
    idiomatic: 'On guimao Wang Chengyuan died.',
  },
  s1114: {
    literal: 'On dingwei Henan prefect Yan Xiufu was made acting Minister of Rites and Pinglu military commissioner and Zi-Qing-Deng-Lai-Lai observer.',
    idiomatic: 'On dingwei Yan Xiufu took Pinglu.',
  },
  s1115: {
    literal: 'On wujia Supervising Secretary Wang Zhi acted as Henan prefect.',
    idiomatic: 'On wujia Wang Zhi acted for Henan.',
  },
  s1116: {
    literal: 'Hedong deputy military commissioner Li Shi was made Supervising Secretary.',
    idiomatic: 'Li Shi became supervising secretary.',
  },
  s1117: {
    literal: 'Dade 8, spring, first month, guichou new moon.',
    idiomatic: 'Dade 8 opened on guichou.',
  },
  s1118: {
    literal: 'On dingsi the sacred person recovered; the Emperor held audience at Taihe Hall for inner eunuchs.',
    idiomatic: 'On dingsi Wenzong recovered and saw eunuchs at Taihe.',
  },
  s1119: {
    literal: 'On jiazi held audience at Zichen Hall for the host of officials.',
    idiomatic: 'On jiazi Wenzong received officials at Zichen.',
  },
  s1120: {
    literal: 'On bingyin repaired the ancestral temple.',
    idiomatic: 'On bingyin the ancestral temple was repaired.',
  },
  s1121: {
    literal: 'Ordered Director of Sacrifices Yu Chengxuan to act as Grand Master of Sacrifices, announce to all nine chambers, and move spirit tablets to the side hall.',
    idiomatic: 'Spirit tablets moved to a side hall during repairs.',
  },
  s1122: {
    literal: 'On guiyou seven prefectures including Yang, Chu, Shu, Lu, Shou, Chu, and He last year\'s floods damaged more than forty thousand qing of fields.',
    idiomatic: 'On guiyou seven Huai circuits reported forty thousand qing lost to flood.',
  },
  s1123: {
    literal: 'Second month, renwu new moon: there was a solar eclipse.',
    idiomatic: 'A solar eclipse fell on renwu.',
  },
  s1124: {
    literal: 'On gengyin because the sacred person had recovered, prisoners were amnestied, overdue taxes remitted, and exiles transferred.',
    idiomatic: 'On gengyin recovery brought amnesty and tax relief.',
  },
  s1125: {
    literal: 'On jihai Feihu town in Wei prefecture established a coin-casting office.',
    idiomatic: 'On jihai Feihu gained a mint.',
  },
  s1126: {
    literal: 'Third month, renzi new moon.',
    idiomatic: 'The third month opened on renzi.',
  },
  s1127: {
    literal: 'On jiayin Upper Si day: granted ministers a feast at Qujiang Pavilion.',
    idiomatic: 'On jiayin ministers feasted at Qujiang.',
  },
  s1128: {
    literal: 'On gengwu Shannan East military commissioner Pei Du was made Luoyang regent, still acting Minister of Education and Palace Companion;',
    idiomatic: 'On gengwu Pei Du became Luoyang regent;',
  },
  s1129: {
    literal: 'Luoyang regent Li Fengji was made acting Minister of Education and Right Vice Director.',
    idiomatic: 'Li Fengji became right vice director.',
  },
  s1130: {
    literal: 'On guiyou Yan-Hai military commissioner Li Wenyue died.',
    idiomatic: 'On guiyou Li Wenyue died.',
  },
  s1131: {
    literal: 'On bingzi Right Vice Director Li Guyuan was made Hua prefect, replacing Cui Rong;',
    idiomatic: 'On bingzi Li Guyuan replaced Cui Rong at Hua;',
  },
  s1132: {
    literal: 'Rong was made Yan-Hai observation commissioner.',
    idiomatic: 'Cui Rong took Yan-Hai.',
  },
  s1133: {
    literal: 'Fourth month, renwu new moon.',
    idiomatic: 'The fourth month opened on renwu.',
  },
  s1134: {
    literal: 'On renchen Academician Pei Pei compiled thirty fascicles of Comprehensive Selection, modeled on Crown Prince Zhaoming\'s Selection of Literature — Pei\'s choices were eccentric and won no praise from contemporaries.',
    idiomatic: 'On renchen Pei Pei\'s Comprehensive Selection won no praise.',
  },
  s1135: {
    literal: 'On jiawu Suo prefect Wu Lizhen was made Yongguan pacification commissioner; on yisi Hanlin academician and Vice Minister of War Wang Yuanzhong resigned inner posts and Yuanzhong was made Minister of Rites.',
    idiomatic: 'On jiawu Wu Lizhen took Yongguan; Wang Yuanzhong took Rites.',
  },
  s1136: {
    literal: 'Fifth month, xinhai new moon.',
    idiomatic: 'The fifth month opened on xinhai.',
  },
  s1137: {
    literal: 'On jisi ancestral temple repair finished; Minister of Personnel Linghu Chu acted as Grand Master of Sacrifices, announced spirit tablets, and restored the main hall.',
    idiomatic: 'On jisi Linghu Chu restored the ancestral temple.',
  },
  s1138: {
    literal: 'Fire at Flying Dragon divine horses middle stable.',
    idiomatic: 'Flying Dragon stables burned.',
  },
  s1139: {
    literal: 'Sixth month, gengchen new moon.',
    idiomatic: 'The sixth month opened on gengchen.',
  },
  s1140: {
    literal: 'On xinsi the market was moved.',
    idiomatic: 'On xinsi drought again forced relocation of the market.',
  },
  s1141: {
    literal: 'On renwu Court of Judicial Review director Liu Zungu died.',
    idiomatic: 'On renwu Liu Zungu died.',
  },
  s1142: {
    literal: 'On renchen Chen-Xu military commissioner Gao Yu died.',
    idiomatic: 'On renchen Gao Yu died at Chen-Xu.',
  },
  s1143: {
    literal: 'On jiawu because of drought an edict ordered all offices to review prisoners.',
    idiomatic: 'On jiawu drought prompted prisoner review.',
  },
  s1144: {
    literal: 'On bingshen former Fengxiang military commissioner and consort\'s kin Du Ti was recalled to acting Minister of Revenue and Zhongwu military commissioner.',
    idiomatic: 'On bingshen Du Ti returned to Zhongwu.',
  },
  s1145: {
    literal: 'On wuxu chief ministers Wang Ya and Lu Sui memorialized requesting to read seasonal ordinances by old system.',
    idiomatic: 'On wuxu Wang Ya and Lu Sui restored seasonal readings.',
  },
  s1146: {
    literal: 'On gengzi Yan-Hai observation commissioner Cui Rong died.',
    idiomatic: 'On gengzi Cui Rong died.',
  },
  s1147: {
    literal: 'On xinchou Tong prefect Gao Xia died.',
    idiomatic: 'On xinchou Gao Xia died.',
  },
  s1148: {
    literal: 'On wushen Director of Works and consort\'s kin Cui Qi was made Yan-Hai-Yi-Mi observation commissioner.',
    idiomatic: 'On wushen Cui Qi took Yan-Hai-Yi-Mi.',
  },
  s1149: {
    literal: 'Autumn, seventh month, gengxu new moon.',
    idiomatic: 'The seventh month opened on gengxu.',
  },
  s1150: {
    literal: 'On bingchen Vice Minister of Works Yang Rushi was made Tong prefect.',
    idiomatic: 'On bingchen Yang Rushi took Tong.',
  },
  s1151: {
    literal: 'On wuwu Fengyi, Meiyuan, and Liyang rained and damaged summer wheat.',
    idiomatic: 'On wuwu rains ruined summer wheat in three counties.',
  },
  s1152: {
    literal: 'On xinyou great rain at Dingling terrace; lightning shook the east corridor lang below ground, cracking one hundred thirty chi; ordered Imperial Clan director Li Rengshu to announce and repair.',
    idiomatic: 'On xinyou Dingling terrace cracked one hundred thirty chi in lightning.',
  },
  s1153: {
    literal: 'On guihai Prince of Tan Wang Jing died.',
    idiomatic: 'On guihai Prince Jing died.',
  },
  s1154: {
    literal: 'On jisi night the moon transgressed the Pleiades.',
    idiomatic: 'The moon crossed the Pleiades that night.',
  },
  s1155: {
    literal: 'On renshen Right Gold Crow great general Duan Bailun was made acting Minister of Works and Fujian observation commissioner.',
    idiomatic: 'On renshen Duan Bailun took Fujian.',
  },
  s1156: {
    literal: 'Court notices to inner and outer officials: each recommend scholars skilled in the Book of Changes.',
    idiomatic: 'Officials were asked to recommend Yijing scholars.',
  },
  s1157: {
    literal: 'Eighth month, jimao new moon: Right Longwu commander Dong Chongzhi died.',
    idiomatic: 'The eighth month opened as Dong Chongzhi died.',
  },
  s1158: {
    literal: 'On gengyin White Star transgressed Mars.',
    idiomatic: 'Venus crossed Mars.',
  },
  s1159: {
    literal: 'On xinmao an edict: the late Prince of Li Wang Han\'s eldest son Han could be enfeoffed Prince of Dongyang; second son Yuan Prince of Anlu; third son Yan Prince of Lin\'an;',
    idiomatic: 'On xinmao Wenzong enfeoffed the late princes\' sons:',
  },
  s1160: {
    literal: 'the late Prince of Shen Wang Tan\'s eldest son Tan Prince of Henei; second son Shu Prince of Wuxing;',
    idiomatic: 'Shen and Shen princes\' sons were enfeoffed;',
  },
  s1161: {
    literal: 'the late Prince of Jiang Wang Zhu\'s eldest son Zhu Prince of Xin\'an; second son Pang Prince of Gaoping;',
    idiomatic: 'Jiang and Jiang princes\' sons likewise;',
  },
  s1162: {
    literal: 'the late Prince of Yang Wang Pei Prince of Yingchuan;',
    idiomatic: 'Yang\'s son became Prince of Yingchuan;',
  },
  s1163: {
    literal: 'Prince of Zi Wang Huan Prince of Xuchang;',
    idiomatic: 'Zi\'s son became Prince of Xuchang;',
  },
  s1164: {
    literal: 'Prince of Mian Wang Ying Prince of Jinling;',
    idiomatic: 'Mian\'s son became Prince of Jinling;',
  },
  s1165: {
    literal: 'Prince of Fen Wang Pu Prince of Pingyang: all also granted Glory Grandee.',
    idiomatic: 'Fen\'s son became Prince of Pingyang — all with Glory Grandee.',
  },
  s1166: {
    literal: 'On bingshen all colored selection examinations were suspended because of yearly drought.',
    idiomatic: 'On bingshen drought suspended selection exams.',
  },
  s1167: {
    literal: 'On jihai the Emperor copied five passages of Changes meaning to show ministers; whoever understood might report within three days.',
    idiomatic: 'On jihai Wenzong displayed his Changes glosses.',
  },
  s1168: {
    literal: 'At the time Li Zhongyan used the Changes to bewitch the Emperor; when the meaning was issued, men secretly laughed — in the end none reported.',
    idiomatic: 'Li Zhongyan\'s Changes cult drew secret laughter; no one answered.',
  },
  s1169: {
    literal: 'Ninth month, yiyou new moon.',
    idiomatic: 'The ninth month opened on yiyou.',
  },
  s1170: {
    literal: 'On xinhai night a comet rose in Supreme Palace near the Gentleman rank, pointing west, more than one zhang long, traveling northwest nine nights, extinguishing five chi northwest of Gentleman rank.',
    idiomatic: 'A comet crossed Supreme Palace for nine nights.',
  },
  s1171: {
    literal: 'On guichou the moon entered the Southern Dipper.',
    idiomatic: 'The moon entered the Southern Dipper.',
  },
  s1172: {
    literal: 'On yihai Xu-Xuan observation commissioner Lu Gen died.',
    idiomatic: 'On yihai Lu Gen died.',
  },
  s1173: {
    literal: 'On jiwei Grand Councillor Li Deyu presented Essentials for Rulers and three fascicles of Old Tales of the Liu Clan.',
    idiomatic: 'On jiwei Li Deyu presented two books to the throne.',
  },
  s1174: {
    literal: 'Sui prefect Du Shiren had formerly governed Ji and was guilty of embezzlement reckoned at thirty thousand bolts of silk — ordered executed at home.',
    idiomatic: 'Du Shiren was executed at home for vast embezzlement.',
  },
  s1175: {
    literal: 'Former Jiangxi observation commissioner Pei Yi failed integrity review; the posthumous Minister of Works was stripped.',
    idiomatic: 'Pei Yi lost his posthumous Works title for corruption.',
  },
  s1176: {
    literal: 'On gengshen Right Army middle commander Wang Shoucheng summoned Zheng Zhu for audience at the Bath Hall gate and granted brocade and silver.',
    idiomatic: 'On gengshen Wang Shoucheng favored Zheng Zhu at the Bath Hall.',
  },
  s1177: {
    literal: 'That night a comet appeared in the east, three chi long, radiance very grand.',
    idiomatic: 'A grand eastern comet appeared that night.',
  },
  s1178: {
    literal: 'On xinyou acting Henan prefect Wang Zhi was made Xu-Xuan observation commissioner.',
    idiomatic: 'On xinyou Wang Zhi took Xu-Xuan.',
  },
  s1179: {
    literal: 'Retired Vice Minister of Personnel Zhang Zhengfu died.',
    idiomatic: 'Zhang Zhengfu died.',
  },
  s1180: {
    literal: 'On guihai Vice Minister of Personnel Zheng Huan was made Henan prefect.',
    idiomatic: 'On guihai Zheng Huan took Henan.',
  },
  s1181: {
    literal: 'On jiazi Zheng Zhu presented one fascicle of Medical Formulas.',
    idiomatic: 'On jiazi Zheng Zhu offered medical formulas.',
  },
  s1182: {
    literal: 'On gengwu Prince of An Wang Rong and Prince of Ying Wang Chan were both made acting Ministers of War.',
    idiomatic: 'On gengwu two princes took acting War posts.',
  },
  s1183: {
    literal: 'Grand Councillor Lu Sui performed investiture rites as heir-apparent Grand Mentor.',
    idiomatic: 'Lu Sui invested the crown prince\'s grand mentor.',
  },
  s1184: {
    literal: 'On xinsi Luzong military commissioner Yang Zhicheng and army supervisor Li Huaiwu were both expelled by the three armies; their officer Shi Yuanzhong was set as acting regent.',
    idiomatic: 'On xinsi Yang Zhicheng was expelled; Shi Yuanzhong became regent.',
  },
  s1185: {
    literal: 'Shan and Jiangxi suffered drought with no crops.',
    idiomatic: 'Shan and Jiangxi drought brought crop failure.',
  },
  s1186: {
    literal: 'On jichou Secretariat Director Cui Wei died.',
    idiomatic: 'On jichou Cui Wei died.',
  },
  s1187: {
    literal: 'On gengyin Shannan West military commissioner, acting Minister of Rites, Grand Councillor, Pillar of State, Marquis of Xiangwu Li Zongmin was made Secretariat Vice Director and Grand Councillor.',
    idiomatic: 'On gengyin Li Zongmin returned to the Secretariat.',
  },
  s1188: {
    literal: 'On xinmao palace envoy Tian Quancao was made crown prince\'s mentor-audience envoy.',
    idiomatic: 'On xinmao Tian Quancao arranged the mentor audience.',
  },
  s1189: {
    literal: 'On renchen National University Four Gates aide Li Zhongyan was summoned to audience at Sizheng Hall and granted scarlet.',
    idiomatic: 'On renchen Li Zhongyan entered Sizheng in scarlet.',
  },
  s1190: {
    literal: 'Henan, Deng, Tong, and Yangzhou all memorialized drought and insects harming autumn crops.',
    idiomatic: 'Drought and insects ravaged crops across the middle plain.',
  },
  s1191: {
    literal: 'On jiawu Silver-Green Glory Grandee, acting Secretariat Vice Director, Grand Councillor Li Deyu was made acting Minister of War, Grand Councillor, Xingyuan prefect, and Shannan West military commissioner.',
    idiomatic: 'On jiawu Li Deyu took Shannan West.',
  },
  s1192: {
    literal: 'Aide Li Zhongyan was made National University Book of Changes doctorate and Hanlin lecture academician.',
    idiomatic: 'Li Zhongyan became Changes doctorate and Hanlin lecturer.',
  },
  s1193: {
    literal: 'The crown prince met Grand Mentor Lu Sui at Bright Gate.',
    idiomatic: 'Crown Prince Yong met Lu Sui at Bright Gate.',
  },
  s1194: {
    literal: 'On bingshen remonstrance officials memorialized that Li Zhongyan was unfit for reward; the Emperor ordered a palace envoy to tell the remonstrators: "We keep Zhongyan in the inner palace to consult on classics; the order is already issued and cannot be suddenly changed."',
    idiomatic: 'On bingshen Wenzong overruled protests against Li Zhongyan.',
  },
  s1195: {
    literal: 'Huainan, two Zhe circuits, and Qianzhong suffered flood disasters; households fled; capital prices soared.',
    idiomatic: 'Floods and exile drove capital prices up.',
  },
  s1196: {
    literal: 'On gengzi an edict ordered Zheng Zhu to audience at Taihe Hall.',
    idiomatic: 'On gengzi Zheng Zhu was summoned to Taihe.',
  },
  s1197: {
    literal: 'Censor-in-Chief Zheng Tan was made Minister of Revenue.',
    idiomatic: 'Zheng Tan took Revenue.',
  },
  s1198: {
    literal: 'On renyin Hanlin Academy feasted Li Zhongyan, granting twenty Law Tune courtesans to perform music in his honor.',
    idiomatic: 'On renyin Hanlin feasted Li Zhongyan with twenty musicians.',
  },
  s1199: {
    literal: 'On bingwu the newly appointed Shannan West military commissioner Li Deyu was made Minister of War.',
    idiomatic: 'On bingwu Li Deyu took War before leaving for Xingyuan.',
  },
  s1200: {
    literal: 'Eleventh month, dingwei new moon.',
    idiomatic: 'The eleventh month opened on dingwei.',
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
