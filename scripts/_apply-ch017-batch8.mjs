#!/usr/bin/env node
/** Batch 8: s0701–s0800 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 800;

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
    literal: 'Palace Secretariat drafter Li Yuzhong was made Hua prefect, replacing Yan Xiufu;',
    idiomatic: 'Li Yuzhong replaced Yan Xiufu at Hua;',
  },
  s0702: {
    literal: 'Xiufu was made Right Palace Companion.',
    idiomatic: 'Yan Xiufu became right palace companion.',
  },
  s0703: {
    literal: 'Summer, fourth month, yisi new moon.',
    idiomatic: 'The fourth month opened on yisi.',
  },
  s0704: {
    literal: 'On bingwu Right Palace Companion and Hanlin lecture academician Zheng Tan was made Minister of Works.',
    idiomatic: 'On bingwu Zheng Tan took Works.',
  },
  s0705: {
    literal: 'On dingwei retired Minister of War Zhang Jia died.',
    idiomatic: 'On dingwei Zhang Jia died.',
  },
  s0706: {
    literal: 'On dingsi former Qi-De-Cang-Jing military commissioner Li Youyu was demoted to Yong prefect and ordered to post-haste take office.',
    idiomatic: 'On dingsi Li Youyu was rushed to exile at Yong.',
  },
  s0707: {
    literal: 'On gengshen Left Vice Director Wang Qi was made Minister of Revenue and revenue commissioner, replacing Cui Yuanlue;',
    idiomatic: 'On gengshen Wang Qi took Revenue;',
  },
  s0708: {
    literal: 'Yuanlue was made acting Minister of Personnel and eastern-capital regent.',
    idiomatic: 'Cui Yuanlue became Luoyang regent.',
  },
  s0709: {
    literal: 'On xinyou the moon occulted the second star of the Southern Dipper.',
    idiomatic: 'The moon covered the Dipper\'s second star.',
  },
  s0710: {
    literal: 'On renxu an edict said: "Frugality suffices for use; when orders issue they must be carried out — this is written in the former classics.',
    idiomatic: 'On renxu Wenzong proclaimed a frugality edict:',
  },
  s0711: {
    literal: 'It is the root of good government.',
    idiomatic: '"Frugality is the root of rule."',
  },
  s0712: {
    literal: 'Since We took the four seas, pitying the people\'s long distress, from sun to sun We forget food, rising at night with anxious heart.',
    idiomatic: '"I forget meals pitying the people\'s distress."',
  },
  s0713: {
    literal: 'Though We have cut literary embroidery, We still fall short of thatched-hut plainness.',
    idiomatic: '"I still fall short of thatched plainness."',
  },
  s0714: {
    literal: 'We also instruct the ministers, giving form in edict lines.',
    idiomatic: '"I have instructed you in edicts."',
  },
  s0715: {
    literal: 'We hear that accumulated custom flows in abuse and the after-wind is not yet reformed.',
    idiomatic: '"Custom still runs to excess."',
  },
  s0716: {
    literal: 'Carriages, dress, and mansions vie in lavish standards;',
    idiomatic: '"Carriages and mansions vie in splendor;"',
  },
  s0717: {
    literal: 'goods and treasure open the spring of greed.',
    idiomatic: '"treasure opens greed."',
  },
  s0718: {
    literal: 'The offices do not forbid it and extravagant fashion daily spreads.',
    idiomatic: '"Offices do not forbid it."',
  },
  s0719: {
    literal: 'Surely Our teaching has not reached everywhere, making the masses blind to shame.',
    idiomatic: '"My teaching has not reached the people."',
  },
  s0720: {
    literal: 'How may sufficiency, issued orders, and perfect governance be attained!',
    idiomatic: '"How reach sufficiency and perfect rule!"',
  },
  s0721: {
    literal: 'Ever brooding in shame and sighing, We now proclaim anew.',
    idiomatic: '"I proclaim anew in shame."',
  },
  s0722: {
    literal: 'From now, inner and outer officials in office shall each pursue plainness and expand this national style.',
    idiomatic: '"All officials must pursue plainness."',
  },
  s0723: {
    literal: 'Where excess is especially grave, censors memorialize upward.',
    idiomatic: '"Grave excess: censors report."',
  },
  s0724: {
    literal: 'Those in charge shall proclaim inside and outside so all know Our intent."',
    idiomatic: '"Proclaim this throughout the realm."',
  },
  s0725: {
    literal: 'Wenzong inherited Changqing and Baoli extravagant fashion, keen to punish and reform, personally practicing thrift to lead by example.',
    idiomatic: 'Wenzong fought the Changqing-Baoli luxury he inherited.',
  },
  s0726: {
    literal: 'On xinwei former Luoyang regent Cui Hongli was made Minister of Punishments.',
    idiomatic: 'On xinwei Cui Hongli took Punishments.',
  },
  s0727: {
    literal: 'Zhen\'s Wang Tingcou requested to repair the Chuchu and Qiyun imperial tombs; assented.',
    idiomatic: 'Wang Tingcou was allowed to repair two imperial tombs.',
  },
  s0728: {
    literal: 'Fifth month, jiaxu new moon.',
    idiomatic: 'The fifth month opened on jiaxu.',
  },
  s0729: {
    literal: 'On dingchou because of drought the capital offices were ordered to review prisoners.',
    idiomatic: 'On dingchou drought prompted prisoner review.',
  },
  s0730: {
    literal: 'On jimao the north and south locks of Tonghua Gate could not open; when the key entered, it seemed someone held them.',
    idiomatic: 'On jimao Tonghua Gate locks would not open.',
  },
  s0731: {
    literal: 'The Emperor ordered ironworkers to break the locks; the hour had already reached chen.',
    idiomatic: 'Smiths broke the locks past the chen hour.',
  },
  s0732: {
    literal: 'On dinghai Yanzhou\'s Dongping county was renamed Tianping county.',
    idiomatic: 'On dinghai Dongping became Tianping county.',
  },
  s0733: {
    literal: 'On wuzi an edict ordered Revenue\'s annual western Sichuan weaving of eight thousand one hundred sixty-seven bolts of silk to be reduced by two thousand five hundred ten within the quota.',
    idiomatic: 'On wuzi Sichuan silk weaving was cut by two thousand bolts.',
  },
  s0734: {
    literal: 'Sixth month, guimao new moon.',
    idiomatic: 'The sixth month opened on guimao.',
  },
  s0735: {
    literal: 'On dingwei Acting Minister of Education, Secretariat Vice Director, Grand Councillor, Duke of Jin Pei Du was made Acting Minister of Education, Grand Councillor for State and Military Affairs;',
    idiomatic: 'On dingwei Pei Du was named overseer of state and military affairs;',
  },
  s0736: {
    literal: 'when illness eases, enter the Secretariat every three or five days.',
    idiomatic: 'he would enter the Secretariat every few days when well.',
  },
  s0737: {
    literal: 'On xinwei night from the first watch to the fifth, large and small stars streamed crisscross; viewers could not count them.',
    idiomatic: 'That night the sky rained shooting stars beyond counting.',
  },
  s0738: {
    literal: 'On renshen an edict: if we hear that offices\' criminal cases often stall, charge the Left and Right Vice Directors and investigating censors to report.',
    idiomatic: 'On renshen stalled criminal cases were ordered investigated.',
  },
  s0739: {
    literal: 'Autumn, seventh month, guiyou new moon.',
    idiomatic: 'The seventh month opened on guiyou.',
  },
  s0740: {
    literal: 'On guiwei an edict made Court Gentleman for Discussion, Right Vice Director, Pillar of State, granted purple-gold fish Song Shenxi Grand Councillor.',
    idiomatic: 'On guiwei Song Shenxi joined the Grand Council.',
  },
  s0741: {
    literal: 'On yiyou an edict: "Former acting drafting masters of documents, after about one full year, receive regular appointment;',
    idiomatic: 'On yiyou drafting masters were promised regular appointment after one year;',
  },
  s0742: {
    literal: 'those acting from remonstrance officials should follow this too;',
    idiomatic: 'remonstrance acting posts likewise;',
  },
  s0743: {
    literal: 'the rest per the Changqing 2 seventh-month twenty-seventh-day edict."',
    idiomatic: 'the rest per Changqing 2 rules."',
  },
  s0744: {
    literal: 'Zhenwu established Yunjia Pass and added one thousand garrison troops.',
    idiomatic: 'Zhenwu gained Yunjia Pass and a thousand troops.',
  },
  s0745: {
    literal: 'Vice Minister of Personnel Wang Fan was made Jingzhao prefect and concurrent Censor-in-Chief, replacing Li Liang as Guiguan observation commissioner.',
    idiomatic: 'Wang Fan took Jingzhao and Guiguan.',
  },
  s0746: {
    literal: 'Taiyuan suffered famine; one hundred thousand shi of grain were relief-granted.',
    idiomatic: 'Taiyuan received one hundred thousand shi of relief grain.',
  },
  s0747: {
    literal: 'Twenty thousand bolts of silk were granted the Sixteen Mansions princes.',
    idiomatic: 'Imperial princes received twenty thousand bolts of silk.',
  },
  s0748: {
    literal: 'On dingyou Acting Minister of Education Pei Du submitted a memorial declining the investiture, saying: "This office I have already received investiture three times — I am ashamed to show my face."',
    idiomatic: 'On dingyou Pei Du declined a third investiture in shame.',
  },
  s0749: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0750: {
    literal: 'Eighth month, renyin new moon.',
    idiomatic: 'The eighth month opened on renyin.',
  },
  s0751: {
    literal: 'On bingchen Yan prefecture flooded, drowning more than three hundred households.',
    idiomatic: 'On bingchen Yan floods drowned three hundred households.',
  },
  s0752: {
    literal: 'Taiyuan\'s Liu Gongchuo memorialized that in Yun, Dai, and Yu three prefectures stone in mountain valleys turned to flour that people took and ate.',
    idiomatic: 'Liu Gongchuo reported edible stone-flour in north Shanxi.',
  },
  s0753: {
    literal: 'On jiwei Xu-Xuan observation commissioner Yu Ao died.',
    idiomatic: 'On jiwei Yu Ao died.',
  },
  s0754: {
    literal: 'On jiazi thirty thousand bolts of silk issued from the inner palace were given Revenue for harmonizing purchase.',
    idiomatic: 'On jiazi thirty thousand bolts funded harmonizing purchase.',
  },
  s0755: {
    literal: 'On wuchen the Emperor visited Pear Garden Pavilion; Huichang Hall performed new music.',
    idiomatic: 'On wuchen Wenzong heard new music at Pear Garden.',
  },
  s0756: {
    literal: 'Ninth month, renshen new moon.',
    idiomatic: 'The ninth month opened on renshen.',
  },
  s0757: {
    literal: 'On dingchou Court of Judicial Review director Pei Yi was made acting Right Palace Companion and Jiangxi observation commissioner, replacing Shen Chuanshi;',
    idiomatic: 'On dingchou Pei Yi replaced Shen Chuanshi at Jiangxi;',
  },
  s0758: {
    literal: 'Chuanshi was made Xu-Xuan observation commissioner.',
    idiomatic: 'Shen Chuanshi took Xu-Xuan.',
  },
  s0759: {
    literal: 'Three thousand bolts of silk issued from the inner palace were granted You prefect garrison builders.',
    idiomatic: 'You prefect builders received three thousand bolts.',
  },
  s0760: {
    literal: 'On wuyin Shu prefecture\'s Taihu, Susong, and Wangjiang three counties flooded, drowning six hundred eighty households; an edict ordered Ever-Normal granaries to lend relief.',
    idiomatic: 'On wuyin Taihu floods drowned six hundred eighty households.',
  },
  s0761: {
    literal: 'On gengchen Minister of Personnel Wang Ya was made Right Vice Director, still salt commissioner.',
    idiomatic: 'On gengchen Wang Ya became right vice director.',
  },
  s0762: {
    literal: 'On renwu Acting Minister of Education, state-and-military Grand Councillor, Duke of Jin Pei Du was Acting Minister of Education, Palace Companion, Shannan East military commissioner.',
    idiomatic: 'On renwu Pei Du took Shannan East.',
  },
  s0763: {
    literal: 'The surrendered Xi king Rujie was made Right Valiant Guard general on probation.',
    idiomatic: 'Xi king Rujie entered the guard.',
  },
  s0764: {
    literal: 'On bingxu former Shannan East military commissioner Dou Yizhi was made Left Vice Director.',
    idiomatic: 'On bingxu Dou Yizhi became left vice director.',
  },
  s0765: {
    literal: 'On wuzi retired Minister of Personnel Pei Xiang died.',
    idiomatic: 'On wuzi Pei Xiang died.',
  },
  s0766: {
    literal: 'On jichou seven Huainan counties including Tianchang flooded and harmed crops.',
    idiomatic: 'On jichou Huainan floods ruined crops.',
  },
  s0767: {
    literal: 'On dingyou former Feng prefect and Tiande commissioner Hun Tie, guilty of seven thousand strings of embezzlement, was demoted to Ai prefecture registrar.',
    idiomatic: 'On dingyou Hun Tie was exiled for embezzlement.',
  },
  s0768: {
    literal: 'Winter, tenth month, renyin new moon.',
    idiomatic: 'The tenth month opened on renyin.',
  },
  s0769: {
    literal: 'On wushen Luoyang regent Cui Yuanlue was made acting Minister of Personnel, Hua prefect, and Yicheng military commissioner, replacing Li Deyu;',
    idiomatic: 'On wushen Cui Yuanlue replaced Li Deyu at Yicheng;',
  },
  s0770: {
    literal: 'Deyu was made acting Minister of War and Chengdu prefect.',
    idiomatic: 'Li Deyu took western Sichuan.',
  },
  s0771: {
    literal: 'Western Sichuan military commissioner and acting Minister of Works Guo Zhao was made Director of Sacrifices, replacing Cui Qun as Minister of Personnel.',
    idiomatic: 'Guo Zhao and Cui Qun exchanged Sacrifices and Personnel.',
  },
  s0772: {
    literal: 'On dingmao Censor-in-Chief Yuwen Ding memorialized: "On the thirteenth the chief ministers announced that henceforth ministers\' Yanying memorials must be submitted the day before.',
    idiomatic: 'On dingmao Yuwen Ding protested next-day Yanying memorial rules:',
  },
  s0773: {
    literal: 'I hold that routine business need not be argued face to face — memorials suffice.',
    idiomatic: '"Routine matters need only memorials;"',
  },
  s0774: {
    literal: 'If sudden public business arises and text cannot tell all, then within a pace of heaven\'s ear there is no road to be heard.',
    idiomatic: '"sudden crises cannot wait for written form;"',
  },
  s0775: {
    literal: 'Waiting for a later session stretches over many watches; in disposal there is already what cannot be done.',
    idiomatic: '"delay costs urgent business."',
  },
  s0776: {
    literal: 'We beg re-announcement: those submitting memorials must all be before mao;',
    idiomatic: '"Require memorials before mao;"',
  },
  s0777: {
    literal: 'if after mao, do not receive them.',
    idiomatic: '"reject after mao."',
  },
  s0778: {
    literal: 'Naturally each will obey and ritual will be balanced."',
    idiomatic: '"Thus ritual stays balanced."',
  },
  s0779: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0780: {
    literal: 'Eleventh month, xinwei new moon.',
    idiomatic: 'The eleventh month opened on xinwei.',
  },
  s0781: {
    literal: 'That night Mars approached Left Law-Enforcer.',
    idiomatic: 'Mars neared Left Law-Enforcer that night.',
  },
  s0782: {
    literal: 'On guisi Left Vice Director Kang Chengxuan was made Yan-Hai-Yi-Mi military commissioner.',
    idiomatic: 'On guisi Kang Chengxuan took Yan-Hai-Yi-Mi.',
  },
  s0783: {
    literal: 'Huainan great floods and insect frost together harmed crops.',
    idiomatic: 'Huainan floods and frost ruined crops.',
  },
  s0784: {
    literal: 'Twelfth month, xinchou new moon: Cangzhou\'s Yin You requested abolishing Jing prefecture as Jingping county.',
    idiomatic: 'On xinchou Yin You asked to reduce Jing to a county.',
  },
  s0785: {
    literal: 'On jiyou Yicheng military commissioner Cui Yuanlue died.',
    idiomatic: 'On jiyou Cui Yuanlue died.',
  },
  s0786: {
    literal: 'On renzi Left Gold Crow great general Duan Yi was made Yicheng military commissioner.',
    idiomatic: 'On renzi Duan Yi took Yicheng.',
  },
  s0787: {
    literal: 'On guichou Hunan observation commissioner Wei Ci died.',
    idiomatic: 'On guichou Wei Ci died.',
  },
  s0788: {
    literal: 'On bingchen Vice Minister of Works Cui Guan was made Jingzhao prefect, replacing Wang Fan as Left Vice Director.',
    idiomatic: 'On bingchen Cui Guan and Wang Fan exchanged Jingzhao and the left vice directorate.',
  },
  s0789: {
    literal: 'On guihai Luoyang regent Cui Hongli died.',
    idiomatic: 'On guihai Cui Hongli died.',
  },
  s0790: {
    literal: 'Tong prefect Gao Chong was made Tan prefect and concurrent Censor-in-Chief, Hunan observation commissioner.',
    idiomatic: 'Gao Chong took Hunan.',
  },
  s0791: {
    literal: 'On jiazi retired Left Vice Director Yang Yuling died; posthumously made Minister of Works.',
    idiomatic: 'On jiazi Yang Yuling died.',
  },
  s0792: {
    literal: 'On bingyin former Henan prefect Feng Su was made Vice Minister of Works.',
    idiomatic: 'On bingyin Feng Su took Works.',
  },
  s0793: {
    literal: 'On wuchen heir-apparent Guest of Honor Bai Juyi was made Henan prefect, replacing Wei Hongjing;',
    idiomatic: 'On wuchen Bai Juyi took Henan;',
  },
  s0794: {
    literal: 'Hongjing was acting Minister of Punishments and Luoyang regent.',
    idiomatic: 'Wei Hongjing kept Punishments and Luoyang.',
  },
  s0795: {
    literal: 'Intercalary twelfth month, xinwei new moon.',
    idiomatic: 'The intercalary twelfth month opened on xinwei.',
  },
  s0796: {
    literal: 'On renshen Director of Sacrifices Guo Zhao died; posthumously made Minister of Works.',
    idiomatic: 'On renshen Guo Zhao died.',
  },
  s0797: {
    literal: 'On renchen Qi prefecture\'s Guihua county lands were merged into Linyi county.',
    idiomatic: 'On renchen Guihua was merged into Linyi.',
  },
  s0798: {
    literal: 'That prefecture was abolished; its county was subordinate to Cang prefect.',
    idiomatic: 'Qi prefecture was abolished under Cang.',
  },
  s0799: {
    literal: 'This year the capital area, Henan, Jiangnan, Jing-Xiang, E-Yue, Hunan, and other circuits suffered great floods harming crops; official grain was relief-issued.',
    idiomatic: 'Floods across the realm prompted grain relief.',
  },
  s0800: {
    literal: 'Dade 5, spring, first month, gengzi new moon: because overcast rain lasted ten days, the New Year audience was canceled.',
    idiomatic: 'Dade 5 opened without New Year audience after ten days of rain.',
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
