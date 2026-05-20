#!/usr/bin/env node
/** Batch 13: s1201–s1300 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1201;
const END = 1300;

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

const T = {  s1201: {
    literal: 'On gengxu the retired Left Vice Premier Xiao Fu was made Junior Tutor of the Heir.',
    idiomatic: 'On gengxu Xiao Fu became heir-apparent junior tutor.',
  },
  s1202: {
    literal: 'On xinhai Left Gold Crow guard great general Xiao Hong was made Heyang-Sancheng military commissioner.',
    idiomatic: 'On xinhai Xiao Hong took Heyang-Sancheng.',
  },
  s1203: {
    literal: 'Xiangzhou flooded, damaging fields.',
    idiomatic: 'Floods ruined Xiangzhou crops.',
  },
  s1204: {
    literal: 'On renzi Chuzhou reported that in Qingliu and three other counties rain from the fourth month through the sixth month brought mountain floods that drowned thirteen thousand eight hundred households.',
    idiomatic: 'On renzi Chuzhou reported spring floods that drowned 13,800 households.',
  },
  s1205: {
    literal: 'On guichou Minister of Rites Wang Yuanzhong was made acting Minister of Revenue and Shannan West military commissioner;',
    idiomatic: 'On guichou Wang Yuanzhong took Revenue and Shannan West;',
  },
  s1206: {
    literal: 'Vice Minister of Revenue Li Han was made Hua prefect and Zhenguo army Tong Pass defense commissioner.',
    idiomatic: 'Li Han took Hua and the Tong Pass defense.',
  },
  s1207: {
    literal: 'Chengde military commissioner Wang Tingcou died.',
    idiomatic: 'Wang Tingcou died.',
  },
  s1208: {
    literal: 'Former Heyang military commissioner Wen Zao was made Censor-in-Chief.',
    idiomatic: 'Wen Zao became censor-in-chief.',
  },
  s1209: {
    literal: 'On jimao Youzhou military commissioner Yang Zhicheng, expelled and brought to court, was placed under Censorate investigation.',
    idiomatic: 'On jimao Yang Zhicheng of Youzhou was hauled to court for investigation.',
  },
  s1210: {
    literal: 'In Youzhou Zhicheng had worn dragon-and-phoenix garb; he was exiled beyond the mountains and killed at Shangzhou.',
    idiomatic: 'His imperial robes earned exile; he was killed at Shangzhou.',
  },
  s1211: {
    literal: 'On yihai Minister of War Li Deyu was made acting Right Vice Premier and Zhenhai military commissioner and Zhexi observation commissioner.',
    idiomatic: 'On yihai Li Deyu took Zhexi and an acting right vice premiership.',
  },
  s1212: {
    literal: 'On bingzi Li Zhongyan memorialized to change his name to Xun; assented.',
    idiomatic: 'On bingzi Li Zhongyan became Li Xun.',
  },
  s1213: {
    literal: 'Twelfth month, dingchou new moon.',
    idiomatic: 'The twelfth month opened on dingchou.',
  },
  s1214: {
    literal: 'On jimao Zhaoyi vice commissioner, acting Director of the Palace Treasury registrar, granted purple-gold fish Zheng Zhu was made Grand Master of the Stud.',
    idiomatic: 'On jimao Zheng Zhu became Grand Master of the Stud.',
  },
  s1215: {
    literal: 'On xinsi Di prefect Han Wei was made Protector-General of Annan.',
    idiomatic: 'On xinsi Han Wei took Annan.',
  },
  s1216: {
    literal: 'On guimao the Prince of Tong was made Youzhou Lulong military commissioner; acting Youzhou military regent Shi Yuanzhong was made regent.',
    idiomatic: 'On guimao the Prince of Tong took Lulong; Shi Yuanzhong remained regent.',
  },
  s1217: {
    literal: 'On jiashen the heir-apparent junior tutor Xiao Fu was permitted to retire.',
    idiomatic: 'On jiashen Xiao Fu retired.',
  },
  s1218: {
    literal: 'That night the moon occulted Mao.',
    idiomatic: 'The moon covered Mao that night.',
  },
  s1219: {
    literal: 'On jichou heir-apparent guest of honor at the eastern capital Zhang Zhongfang was made Left Regular Cavalry Attendant; Changzhou prefect Yang Yuqing was made Vice Minister of Works.',
    idiomatic: 'On jichou Zhang Zhongfang and Yang Yuqing received new posts.',
  },
  s1220: {
    literal: 'On jihai Left Vice Premier Li Fengji was made acting Minister of Education and retired.',
    idiomatic: 'On jihai Li Fengji retired as acting Minister of Education.',
  },
  s1221: {
    literal: 'Director of the Imperial Clan Li Ningshu was made Hunan observation commissioner, replacing Li Ao;',
    idiomatic: 'Li Ningshu took Hunan, replacing Li Ao;',
  },
  s1222: {
    literal: 'Ao was made Vice Minister of Punishments, replacing Pei Pei;',
    idiomatic: 'Li Ao took Punishments, replacing Pei Pei;',
  },
  s1223: {
    literal: 'Pei was made Hua Zhenguo army Tong Pass defense commissioner.',
    idiomatic: 'Pei Pei took Hua and the Tong Pass defense.',
  },
  s1224: {
    literal: 'Zhaocheng Temple burned.',
    idiomatic: 'Fire destroyed Zhaocheng Temple.',
  },
  s1225: {
    literal: 'Dade 9, spring, first month, dingwei new moon.',
    idiomatic: 'Dade 9 opened on dingwei.',
  },
  s1226: {
    literal: 'On yimao Zhenzhou Left Secretariat aide Wang Yuankui was recalled to acting Dingyuan general, acting Left Gold Crow great general, acting Minister of Works, and Chengde military commissioner and Zhen-Ji-Shen-Zhao observation commissioner.',
    idiomatic: 'On yimao Wang Yuankui took Chengde.',
  },
  s1227: {
    literal: 'Grand Master of Splendid Happiness Yu Cheng xuan was made acting Minister of Personnel and Tianping military commissioner, replacing Yin You;',
    idiomatic: 'Yu Cheng xuan took Tianping, replacing Yin You;',
  },
  s1228: {
    literal: 'You was made Vice Minister of Punishments.',
    idiomatic: 'Yin You took Punishments.',
  },
  s1229: {
    literal: 'On guihai Duke of Chao county Gong Cou died; posthumously enfeoffed Prince of Qi.',
    idiomatic: 'On guihai Gong Cou died and was posthumously made Prince of Qi.',
  },
  s1230: {
    literal: 'On renshen retired Minister of Education Li Fengji died.',
    idiomatic: 'On renshen Li Fengji died.',
  },
  s1231: {
    literal: 'On guiyou Right Regular Cavalry Attendant Shu Yuanyu was made Shanzhou defense and observation commissioner.',
    idiomatic: 'On guiyou Shu Yuanyu took Shanzhou.',
  },
  s1232: {
    literal: 'Former Di prefect Tian Zao was made Protector-General of Annan.',
    idiomatic: 'Tian Zao took Annan.',
  },
  s1233: {
    literal: 'Second month, bingzi new moon.',
    idiomatic: 'The second month opened on bingzi.',
  },
  s1234: {
    literal: 'On jiashen Director of Imperial Sacrifices Wang Yanwei was added Censor-in-Chief and made Pinglu military commissioner.',
    idiomatic: 'On jiashen Wang Yanwei took Pinglu.',
  },
  s1235: {
    literal: 'On dinghai fifteen hundred Divine Strategy troops were sent to dredge Qujiang.',
    idiomatic: 'On dinghai fifteen hundred troops dredged Qujiang.',
  },
  s1236: {
    literal: 'If other offices had means and wished to build pavilions at Qujiang, idle land should be granted.',
    idiomatic: 'Offices that could afford Qujiang pavilions might receive land.',
  },
  s1237: {
    literal: 'On xinchou Prince of Ji Gao died.',
    idiomatic: 'On xinchou Prince of Ji Gao died at court.',
  },
  s1238: {
    literal: 'On guimao the capital quaked.',
    idiomatic: 'On guimao the capital shook.',
  },
  s1239: {
    literal: 'On jiachen Youzhou regent Shi Yuanzhong was made Lulong military commissioner.',
    idiomatic: 'On jiachen Shi Yuanzhong took Lulong.',
  },
  s1240: {
    literal: 'On yisi Shannan West military commissioner, acting Left Vice Premier, Grand Councillor Duan Wenchang died.',
    idiomatic: 'On yisi Duan Wenchang died.',
  },
  s1241: {
    literal: 'On gengshen Shannan East military commissioner Yang Sifu was made acting Minister of Revenue, concurrent Chengdu prefect, and West Sichuan military commissioner.',
    idiomatic: 'On gengshen Yang Sifu took West Sichuan.',
  },
  s1242: {
    literal: 'On yichou because of famine, worst in Hebei, fifty thousand shi of grain were granted the six Weibo prefectures; Chen-Xu, Yan, Cao, and Pu circuits each received twenty thousand shi of husked rice.',
    idiomatic: 'On yichou famine relief went to Hebei and four eastern circuits.',
  },
  s1243: {
    literal: 'On gengwu Left Vice Director Yu Jingxiu died; court mourned one day.',
    idiomatic: 'On gengwu Yu Jingxiu died; the court mourned one day.',
  },
  s1244: {
    literal: 'An edict said: "When directors and bureau heads whom I personally trust die untimely, court should mourn them.',
    idiomatic: 'An edict ordered mourning for trusted directors and bureau heads who died.',
  },
  s1245: {
    literal: 'Henceforth directors and bureau heads should follow the third-rank precedent of one day\'s court suspension."',
    idiomatic: 'Directors and bureau heads would henceforth get one court holiday.',
  },
  s1246: {
    literal: '"',
    idiomatic: 'Thus ended the edict.',
  },
  s1247: {
    literal: 'Summer, fourth month, bingzi new moon.',
    idiomatic: 'The fourth month opened on bingzi.',
  },
  s1248: {
    literal: 'On bingxu Gui observation commissioner Li Congyi was made Guangzhou prefect and Lingnan military commissioner.',
    idiomatic: 'On bingxu Li Congyi took Lingnan.',
  },
  s1249: {
    literal: 'Zhenhai military commissioner and Zhexi observation commissioner Li Deyu was made heir-apparent guest of honor at the eastern capital.',
    idiomatic: 'Li Deyu was sent to Luoyang as heir-apparent guest.',
  },
  s1250: {
    literal: 'On xinmao Jingzhao prefect Jia Su was made Zhexi observation commissioner;',
    idiomatic: 'On xinmao Jia Su took Zhexi;',
  },
  s1251: {
    literal: 'Vice Minister of Works Yang Yuqing was made Jingzhao prefect and granted gold-purple.',
    idiomatic: 'Yang Yuqing became Jingzhao prefect with gold-purple.',
  },
  s1252: {
    literal: 'Supplement Li Yi was made Gui observation commissioner.',
    idiomatic: 'Li Yi took Gui circuit.',
  },
  s1253: {
    literal: 'On bingshen heir-apparent junior mentor, Vice Secretariat Director, Grand Councillor Lu Sui was made Zhenhai military commissioner and Zhexi observation commissioner.',
    idiomatic: 'On bingshen Lu Sui took Zhexi.',
  },
  s1254: {
    literal: 'On wuxu an edict made the new Zhexi observation commissioner Jia Su Secretariat Director and Grand Councillor.',
    idiomatic: 'On wuxu Jia Su joined the Grand Council.',
  },
  s1255: {
    literal: 'On gengzi an edict demoted Silver-Green Grand Master, acting heir-apparent guest at the eastern capital, Upper Pillar, Baron of Zanhuang with seven hundred households Li Deyu to Yuanzhou senior adjutant.',
    idiomatic: 'On gengzi Li Deyu was banished to Yuanzhou.',
  },
  s1256: {
    literal: 'On xinchou a great wind knocked all four owl-tailed ridge ornaments from Hanyuan Hall.',
    idiomatic: 'On xinchou a gale tore the ridge beasts from Hanyuan Hall.',
  },
  s1257: {
    literal: 'The Gold Crow guard barracks were wrecked.',
    idiomatic: 'The Gold Crow barracks collapsed.',
  },
  s1258: {
    literal: 'More than forty Louguan city monasteries were abolished.',
    idiomatic: 'Over forty Louguan monasteries were shut.',
  },
  s1259: {
    literal: 'On renyin Vice Minister of Personnel Shen Chuanshi died.',
    idiomatic: 'On renyin Shen Chuanshi died.',
  },
  s1260: {
    literal: 'Fifth month, yisi new moon.',
    idiomatic: 'The fifth month opened on yisi.',
  },
  s1261: {
    literal: 'On dingwei Zhedong observation commissioner Li Shen was made heir-apparent guest of honor at the eastern capital.',
    idiomatic: 'On dingwei Li Shen went to Luoyang as heir-apparent guest.',
  },
  s1262: {
    literal: 'On yimao Supplement Gao Zhu was made Zhedong observation commissioner.',
    idiomatic: 'On yimao Gao Zhu took Zhedong.',
  },
  s1263: {
    literal: 'On wuwu Censor-in-Chief Wen Zao was made Minister of Rites; Vice Minister of Personnel Li Guyan was made Censor-in-Chief.',
    idiomatic: 'On wuwu Wen Zao took Rites and Li Guyan the censorate.',
  },
  s1264: {
    literal: 'On xinyou Princess of Taihe presented seven female horse-archers and two Shatuo boys.',
    idiomatic: 'On xinyou the Princess of Taihe presented archer-girls and Shatuo youths.',
  },
  s1265: {
    literal: 'On wuchen Gold Crow great general Li Pei was made Qianzhong observation commissioner; Right Vice Director Wang Fan was made Minister of Revenue and revenue commissioner.',
    idiomatic: 'On wuchen Li Pei took Qianzhong and Wang Fan took Revenue.',
  },
  s1266: {
    literal: 'On jisi Minister of Revenue Zheng Tan was made Secretary Supervisor.',
    idiomatic: 'On jisi Zheng Tan became secretary supervisor.',
  },
  s1267: {
    literal: 'On xinwei Grand Councillor Wang Ya received investiture as Minister of Works.',
    idiomatic: 'On xinwei Wang Ya was invested Minister of Works.',
  },
  s1268: {
    literal: 'On guiyou Hezhong military commissioner Wang Zhixing was made Bian military commissioner, still acting Minister of Education and Palace Censor.',
    idiomatic: 'On guiyou Wang Zhixing took Bian.',
  },
  s1269: {
    literal: 'Sixth month, yihai new moon: the western market burned.',
    idiomatic: 'On yihai the western market burned.',
  },
  s1270: {
    literal: 'Former Bian military commissioner Li Cheng was made Hezhong military commissioner.',
    idiomatic: 'Li Cheng took Hezhong.',
  },
  s1271: {
    literal: 'On gengyin night the moon occulted Jupiter.',
    idiomatic: 'The moon covered Jupiter that night.',
  },
  s1272: {
    literal: 'On guisi Minister of Personnel Linghu Chu was made Grand Master of Splendid Happiness.',
    idiomatic: 'On guisi Linghu Chu took Splendid Happiness.',
  },
  s1273: {
    literal: 'On dingyou Minister of Rites Wen Zao died.',
    idiomatic: 'On dingyou Wen Zao died.',
  },
  s1274: {
    literal: 'Jingzhao prefect Yang Yuqing\'s household spread sorcery talk; the case went to the Censorate.',
    idiomatic: 'Yang Yuqing\'s household was accused of spreading sorcery.',
  },
  s1275: {
    literal: 'Yuqing\'s younger brother Director of the Court of Imperial Seals Han Gong and eight others including his son Zhijin beat the Palace Memorial Drum claiming injustice; an edict sent Yuqing home.',
    idiomatic: 'His kin beat the Memorial Drum; Yang Yuqing was sent home.',
  },
  s1276: {
    literal: 'On jihai Right Divine Strategy great general Liu Mian was made Jingyuan military commissioner.',
    idiomatic: 'On jihai Liu Mian took Jingyuan.',
  },
  s1277: {
    literal: 'On renchen an edict demoted Silver-Green Grand Master, acting Secretariat Director, Grand Councillor, Marquis of Xiangwu with one thousand households Li Zongmin to Mingzhou prefect; when Yang Yuqing was sent home on sorcery charges the court thought it unjust; Zongmin argued fiercely before the throne; the Emperor in anger counted his crimes and drove him out, hence the demotion.',
    idiomatic: 'On renchen Li Zongmin was banished to Mingzhou for defending Yang Yuqing.',
  },
  s1278: {
    literal: 'Autumn, seventh month, jiashen new moon: Jingzhao prefect Yang Yuqing was demoted to Qianzhou senior adjutant titular.',
    idiomatic: 'On jiashen Yang Yuqing was banished to Qianzhou.',
  },
  s1279: {
    literal: 'On bingwu Supplement Li Shi was made acting Jingzhao prefect.',
    idiomatic: 'On bingwu Li Shi acted as Jingzhao prefect.',
  },
  s1280: {
    literal: 'On wushen Longshou Pool was filled to make a polo ground; Ziyun Tower was built at Qujiang.',
    idiomatic: 'On wushen Longshou Pool became a polo ground and Ziyun Tower rose at Qujiang.',
  },
  s1281: {
    literal: 'On xinhai an edict made Censor-in-Chief Li Guyan Vice Secretariat Director and Grand Councillor.',
    idiomatic: 'On xinhai Li Guyan joined the Grand Council.',
  },
  s1282: {
    literal: 'On renzi Li Zongmin was demoted again to Chuzhou senior adjutant.',
    idiomatic: 'On renzi Li Zongmin was banished farther to Chuzhou.',
  },
  s1283: {
    literal: 'On guichou Right Bureau director, concurrent Attendant Censor, handling miscellaneous matters Shu Yuanyu was made Vice Censor-in-Chief.',
    idiomatic: 'On guichou Shu Yuanyu became vice censor-in-chief.',
  },
  s1284: {
    literal: 'Vice Minister of Personnel Li Han was demoted to Fenzhou prefect; Vice Minister of Punishments Xiao Huan to Suizhou prefect.',
    idiomatic: 'Li Han and Xiao Huan were sent to distant prefectures.',
  },
  s1285: {
    literal: 'On dingsi an edict forbade ordaining people as monks or nuns.',
    idiomatic: 'On dingsi private ordinations were forbidden.',
  },
  s1286: {
    literal: 'On wuwu Vice Minister of Works, heir-apparent tutor Cui You was demoted to Yangzhou prefect; Personnel Bureau director Zhang Feng to Kuizhou prefect; Examination Bureau director, heir-apparent tutor Su Di to Zhongzhou prefect; Households Bureau director Yang Jingzhi to Lianzhou prefect.',
    idiomatic: 'On wuwu Cui You, Zhang Feng, Su Di, and Yang Jingzhi were banished.',
  },
  s1287: {
    literal: 'On xinyou E-Yue observation commissioner Cui Yan took Zhexi; National University chancellor Gao Chong took E-Yue.',
    idiomatic: 'On xinyou Cui Yan took Zhexi and Gao Chong E-Yue.',
  },
  s1288: {
    literal: 'On renxu Zhenhai military commissioner Lu Sui died.',
    idiomatic: 'On renxu Lu Sui died.',
  },
  s1289: {
    literal: 'On guihai Attendant Censor Li Gan was demoted to Fengzhou senior adjutant; Palace Censor Su Te to Panzhou registrar.',
    idiomatic: 'On guihai Li Gan and Su Te were banished.',
  },
  s1290: {
    literal: 'On jiazi Book of Changes doctor Li Xun was made War Bureau director and edict drafter, still Hanlin lecture academician.',
    idiomatic: 'On jiazi Li Xun became war director and edict drafter.',
  },
  s1291: {
    literal: 'On dingmao Tianping military commissioner Yu Cheng xuan died.',
    idiomatic: 'On dingmao Yu Cheng xuan died.',
  },
  s1292: {
    literal: 'Court of Judicature Review director Luo Rang was made Regular Cavalry Attendant; Ru prefect Guo Xingyu was made review director.',
    idiomatic: 'Luo Rang and Guo Xingyu exchanged posts.',
  },
  s1293: {
    literal: 'On wuchen Vice Minister of Punishments Yin You was made Tianping military commissioner; Ji prefect Pei Tai was made Yong-Guan frontier commissioner.',
    idiomatic: 'On wuchen Yin You took Tianping and Pei Tai Yong-Guan.',
  },
  s1294: {
    literal: 'Eighth month, jiaxu new moon: Vice Minister of Revenue Li Ao was made acting Minister of Rites and Shannan East military commissioner, replacing Wang Qi;',
    idiomatic: 'On jiaxu Li Ao took Shannan East, replacing Wang Qi;',
  },
  s1295: {
    literal: 'Qi was made Minister of War and revenue commissioner.',
    idiomatic: 'Wang Qi took War and the revenue commission.',
  },
  s1296: {
    literal: 'On bingzi Chuzhou senior adjutant Li Zongmin was demoted again to Chaozhou registrar.',
    idiomatic: 'On bingzi Li Zongmin was sent to Chaozhou.',
  },
  s1297: {
    literal: 'On dingchou Grand Master of the Stud Zheng Zhu was made Minister of Works and Hanlin lecture academician.',
    idiomatic: 'On dingchou Zheng Zhu took Works and a Hanlin lecture post.',
  },
  s1298: {
    literal: 'The Emperor visited the Left Army Longshou Hall, then the Pear Garden; great music was performed at Hanyuan Hall.',
    idiomatic: 'He visited Longshou and the Pear Garden, then held a riotous concert at Hanyuan.',
  },
  s1299: {
    literal: 'On wuyin Secretary Supervisor Zheng Tan was made Vice Minister of Punishments.',
    idiomatic: 'On wuyin Zheng Tan took Punishments.',
  },
  s1300: {
    literal: 'Hanlin academician, acting Minister of Revenue, edict drafter Li Jue was demoted to Jiangzhou prefect; Bian-Fang military commissioner Shi Xiaozhang was made Yicheng military commissioner.',
    idiomatic: 'Li Jue was banished to Jiangzhou; Shi Xiaozhang took Yicheng.',
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
