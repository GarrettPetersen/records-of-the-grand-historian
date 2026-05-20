#!/usr/bin/env node
/** Batch 8: s0701–s0800 (Jiutangshu ch.013, Dezong 2 — Zhenyuan 18–20, court reforms, Dezong's last years) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
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
    literal: 'Winter, tenth month: Wei Gao was advanced to acting Minister of Works, Secretariat Director, enfeoffed Prince of Nankang commandery — rewarding the defeat of Tibet.',
    idiomatic: 'In the tenth month Wei Gao was made prince of Nankang for defeating Tibet.',
  },
  s0702: {
    literal: 'On wuwu Yan Prefecture prefect Du Yanzian abandoned the city and fled to Qingzhou.',
    idiomatic: 'On wuwu Yanzhou\'s Du Yanzian fled to Qingzhou.',
  },
  s0703: {
    literal: 'On xinwei Chancellor Jia Dan presented the "Map of Chinese and Barbarians Within the Seas" and "Account of Ancient and Modern Commanderies, Counties, Roads, and the Four Barbarians" in forty scrolls.',
    idiomatic: 'On xinwei Jia Dan submitted his atlas and geography in forty scrolls.',
  },
  s0704: {
    literal: 'On jiaxu Hanlin attendant drafter Dai Shaoping died sixteen days and came back to life.',
    idiomatic: 'On jiaxu Dai Shaoping revived after sixteen days dead.',
  },
  s0705: {
    literal: 'On gengxu Capital Metropolitan Prefect Gu Shaolian was made Minister of Personnel; Personnel vice minister Wei Xiaqing was made Capital Metropolitan Prefect.',
    idiomatic: 'On gengxu Gu Shaolian and Wei Xiaqing exchanged the capital and personnel posts.',
  },
  s0706: {
    literal: 'Huainan military commissioner Du You presented the "Comprehensive Institutions," nine sections in two hundred scrolls.',
    idiomatic: 'Du You of Huainan presented his Comprehensive Institutions in two hundred scrolls.',
  },
  s0707: {
    literal: 'Eighteenth year, spring, first month, wuwu new moon: great rain and snow — court congratulations were stopped.',
    idiomatic: 'Snow canceled New Year court in the eighteenth year.',
  },
  s0708: {
    literal: 'On yichou the Pyu king sent the envoy Xilijiao to court with tribute, also presenting twelve tunes of his state\'s music and thirty-five musicians.',
    idiomatic: 'On yichou Pyu envoys brought music and musicians.',
  },
  s0709: {
    literal: 'On yihai Wei Gao presented the captured Tibetan minister Lun Mangre.',
    idiomatic: 'On yihai Wei Gao sent the Tibetan minister Lun Mangre as a captive.',
  },
  s0710: {
    literal: 'On gengchen Changzhou prefect Jia Quan was made Yuezhou prefect and Zhedong observer.',
    idiomatic: 'On gengchen Jia Quan became Zhedong observer.',
  },
  s0711: {
    literal: 'Second month, wuzi new moon: ministers were feasted at Ma Lin\'s mountain pool.',
    idiomatic: 'On the second month\'s new moon the court banqueted at Ma Lin\'s estate.',
  },
  s0712: {
    literal: 'Third month, guiwei: Jiannan East campaign marshal Li Kang was made Zizhou prefect, concurrent censor-in-chief, and Jiannan East military commissioner.',
    idiomatic: 'In the third month Li Kang took Jiannan East at Zizhou.',
  },
  s0713: {
    literal: 'On yichou ministers were feasted at Ma Lin\'s mountain pool.',
    idiomatic: 'On yichou another feast was held at Ma Lin\'s pool.',
  },
  s0714: {
    literal: 'On jisi Qizhou prefect Zheng Shen was made Ezhou prefect and E-Yue-Qi-Mian observer.',
    idiomatic: 'On jisi Zheng Shen became E-Yue-Qi-Mian commissioner.',
  },
  s0715: {
    literal: 'On guiyou Zhedong regimental vice commissioner Qi Zong was made Quzhou prefect; Zong advanced excessive levies as tribute seeking favor — Remonstrance Bureau attendant Xu Mengrong returned the sealed edict.',
    idiomatic: 'On guiyou Qi Zong\'s appointment was blocked after Xu Mengrong returned the edict over his levies.',
  },
  s0716: {
    literal: 'On bingxu Hedong campaign marshal Zheng Yuan was made Hezhong prefect, concurrent censor-in-chief, and Hezhong-Jiang military commissioner.',
    idiomatic: 'On bingxu Zheng Yuan became Hezhong commissioner.',
  },
  s0717: {
    literal: 'Fifth month, guihai: Dou Qun was made Left Collector.',
    idiomatic: 'In the fifth month Dou Qun became a left collector.',
  },
  s0718: {
    literal: 'On gengchen Sacrifices Bureau outer-section chief Pei Tai was made acting War Bureau chief, Annan protector, and circuit pacification commissioner.',
    idiomatic: 'On gengchen Pei Tai was sent to Annan as protector.',
  },
  s0719: {
    literal: 'Sixth month, guisi: Minister of Personnel Gu Shaolian was made Minister of War, Luoyang protector, and eastern capital Ji-Ru defense commissioner.',
    idiomatic: 'On guisi Gu Shaolian became Luoyang protector.',
  },
  s0720: {
    literal: 'Former Luoyang protector, acting Minister of Rites Wang Hong died.',
    idiomatic: 'Wang Hong, former Luoyang protector, died.',
  },
  s0721: {
    literal: 'Autumn, seventh month, gengchen: Cai, Shen, and Guang circuits had spring floods and summer drought — fifty thousand bolts of silk, one hundred thousand shi of grain, and three thousand shi of salt were granted.',
    idiomatic: 'In the seventh month Cai, Shen, and Guang received famine relief.',
  },
  s0722: {
    literal: 'Eighth month, renyin: Yongguan pacification commissioner Xu Shen was made Guangzhou prefect and Lingnan military commissioner.',
    idiomatic: 'On renyin Xu Shen became Lingnan commissioner.',
  },
  s0723: {
    literal: 'On jiachen Lingnan military recorder, trial Grand Court reviewer Zhang Zhengyuan was made Yongzhou prefect, vice censor-in-chief, and Yongguan pacification commissioner; Remonstrance Bureau attendant Xu Mengrong, because the appointment was out of turn, returned the sealed edict.',
    idiomatic: 'On jiachen Zhang Zhengyuan\'s Yongguan post was returned by Xu Mengrong as irregular.',
  },
  s0724: {
    literal: 'On dingwei Revenue vice minister and transport controller Wang Shao was made Minister of Revenue, still acting transport controller.',
    idiomatic: 'On dingwei Wang Shao became revenue minister while keeping transport.',
  },
  s0725: {
    literal: 'Ninth month, yimao new moon: Minister of Rites junior vice director Yang Ping was made Tanzhou prefect and Hunan observation commissioner.',
    idiomatic: 'On the ninth month\'s new moon Yang Ping became Hunan commissioner.',
  },
  s0726: {
    literal: 'Ministers were feasted at Ma Lin\'s mountain pool; the emperor composed a six-rhyme "Ninth Day Banquet" and bestowed it.',
    idiomatic: 'The court feasted at Ma Lin\'s pool with a six-line Ninth Day poem.',
  },
  s0727: {
    literal: 'Winter, tenth month, dinghai: Minister of Punishments Wang E was made Huainan deputy military commissioner and campaign marshal.',
    idiomatic: 'In the tenth month Wang E became Huainan deputy commander.',
  },
  s0728: {
    literal: 'On jiyou Yan-Fang-Dan-Yan military commissioner, acting Minister of Rites Wang Qiyao died.',
    idiomatic: 'On jiyou Wang Qiyao of Yan-Fang died.',
  },
  s0729: {
    literal: 'Eleventh month, bingchen: Tongzhou prefect Liu Gongji was made Yan prefect and Yan-Fang-Dan-Yan military commissioner.',
    idiomatic: 'In the eleventh month Liu Gongji became Yan-Fang commissioner.',
  },
  s0730: {
    literal: 'Twelfth month, yisi: Grand Court director Li Zhengchen was demoted to Court of the Imperial Stud junior director — Zhengchen had been impeached by the censorate and imprisoned; unable to bear the shame he died.',
    idiomatic: 'On yisi Li Zhengchen died after demotion and imprisonment.',
  },
  s0731: {
    literal: 'On wushen envoys from Lizhou Man and Zangke came to court.',
    idiomatic: 'On wushen frontier envoys from Lizhou and Zangke arrived.',
  },
  s0732: {
    literal: 'Nineteenth year, spring, first month, guichou new moon.',
    idiomatic: 'The nineteenth year opened on guichou.',
  },
  s0733: {
    literal: 'Second month, renwu new moon: a banquet at Ma Lin\'s mountain pool.',
    idiomatic: 'On renwu the court feasted at Ma Lin\'s pool.',
  },
  s0734: {
    literal: 'On dinghai Hanyuan Hall was repaired.',
    idiomatic: 'On dinghai Hanyuan Hall was restored.',
  },
  s0735: {
    literal: 'The An-Huang command was named the Fengyi Army.',
    idiomatic: 'An-Huang was renamed the Fengyi Army.',
  },
  s0736: {
    literal: 'On bingshen Gui circuit acting chief Wei Wu was made Guizhou prefect and Gui observation commissioner.',
    idiomatic: 'On bingshen Wei Wu became Gui commissioner.',
  },
  s0737: {
    literal: 'On jihai Annan pacification commissioner Pei Tai was driven out by prefectural general Wang Jiyuan.',
    idiomatic: 'On jihai Pei Tai was expelled from Annan by Wang Jiyuan.',
  },
  s0738: {
    literal: 'On jiachen Huainan military commissioner Du You came to court.',
    idiomatic: 'On jiachen Du You of Huainan came to audience.',
  },
  s0739: {
    literal: 'Third month, renzi new moon: Du You was made acting Minister of Works, Concurrent Associate, and Grand Pure Palace commissioner.',
    idiomatic: 'On the third month\'s new moon Du You entered the chancellery.',
  },
  s0740: {
    literal: 'Huainan campaign marshal Wang E was made acting Minister of the Right, concurrent chief administrator of the great metropolitan prefecture of Yangzhou, and Huainan military commissioner.',
    idiomatic: 'Wang E succeeded Du You at Huainan.',
  },
  s0741: {
    literal: 'On dingmao because this year\'s midsummer di sacrifice was held, the prior debate on the positions of the Grand Ancestor, Yi, and Xian had not been settled; now at the di rite the Grand Ancestor\'s east-facing place was fixed, and below him the zhao-mu sequence was set.',
    idiomatic: 'On dingmao the ancestral di rite finally fixed the Grand Ancestor\'s seat and the zhao-mu order.',
  },
  s0742: {
    literal: 'The Offering Ancestor and Resplendent Ancestor were enshrined in the Deming and Xingsheng temples; each di and xia year they were feasted in their own halls.',
    idiomatic: 'Offering and Resplendent ancestors were housed in side temples and honored at the seasonal rites.',
  },
  s0743: {
    literal: 'On yihai Minister of Imperial Granaries Li Shi was made Capital Metropolitan Prefect.',
    idiomatic: 'On yihai Li Shi became metropolitan prefect.',
  },
  s0744: {
    literal: 'Summer, fourth month, yiwei: Jingyuan military commissioner Liu Chang memorialized moving former Yuan Prefecture to Pingliang city — granted.',
    idiomatic: 'On yiwei Liu Chang\'s move of Yuanzhou to Pingliang was approved.',
  },
  s0745: {
    literal: 'On wuxu because enshrinement in the temple was complete, the hundred officials danced in congratulation.',
    idiomatic: 'On wuxu officials danced to celebrate the completed temple rites.',
  },
  s0746: {
    literal: 'Fifth month, xinhai: Jingnan military commissioner, acting Minister of Works, Jiangling prefect Pei Zhou died.',
    idiomatic: 'On xinhai Pei Zhou of Jingnan died.',
  },
  s0747: {
    literal: 'On yiwei Jingnan campaign marshal Pei Yun was made Jiangling prefect, concurrent censor-in-chief, and Jingnan military commissioner.',
    idiomatic: 'On yiwei Pei Yun became Jingnan commissioner.',
  },
  s0748: {
    literal: 'On jiazi Four Garrisons, Beiting campaign, Jingyuan military commissioner, acting Minister of the Right, Jing prefect Liu Chang died.',
    idiomatic: 'On jiazi Liu Chang of Jingyuan died.',
  },
  s0749: {
    literal: 'On jiaxu Jingyuan acting chief Duan You was made Jing prefect, concurrent censor-in-chief, and Four Garrisons–Beiting campaign Jingyuan military commissioner.',
    idiomatic: 'On jiaxu Duan You succeeded Liu Chang at Jingyuan.',
  },
  s0750: {
    literal: 'On yihai Tibet sent the envoy Lun Pinre to court.',
    idiomatic: 'On yihai a Tibetan envoy came to court.',
  },
  s0751: {
    literal: 'On jiachen Chen-Xu campaign marshal Liu Changyi was made acting Minister of Works, concurrent Xuzhou prefect and Chen-Xu military commissioner.',
    idiomatic: 'On jiachen Liu Changyi became Chen-Xu commissioner.',
  },
  s0752: {
    literal: 'From the first month until now no rain had fallen; orders were separately sent to pray at mountains and rivers.',
    idiomatic: 'Since spring drought, prayers were sent to mountains and rivers.',
  },
  s0753: {
    literal: 'Autumn, seventh month, wuwu: because of the Guanzhong region, Personnel selection and Ministry of Rites examinations were stopped.',
    idiomatic: 'In the seventh month drought around the capital halted examinations.',
  },
  s0754: {
    literal: 'On jiwei Secretariat Vice Director and Associate Qi Kang was made heir-apparent guest — illness relieved him.',
    idiomatic: 'On jiwei Qi Kang left the chancellery for illness.',
  },
  s0755: {
    literal: 'On jiaxu rain fell.',
    idiomatic: 'On jiaxu rain came.',
  },
  s0756: {
    literal: 'On yihai Minister of the Right Yao Nanzhong died.',
    idiomatic: 'On yihai Yao Nanzhong died.',
  },
  s0757: {
    literal: 'Wheat seed was lent to the people of the capital districts.',
    idiomatic: 'The capital districts received wheat seed on loan.',
  },
  s0758: {
    literal: 'Eighth month, yiwei: long rains poured.',
    idiomatic: 'In the eighth month rains lingered.',
  },
  s0759: {
    literal: 'Winter, tenth month, yiwei: heir-apparent guest Wei Xiaqing was made Luoyang protector and eastern capital Ji-Ru defense commissioner.',
    idiomatic: 'In the tenth month Wei Xiaqing became Luoyang protector.',
  },
  s0760: {
    literal: 'Intercalary month, dingsi: Secretariat Vice Director and Concurrent Associate Cui Sun died.',
    idiomatic: 'In the intercalary month Cui Sun died.',
  },
  s0761: {
    literal: 'Eleventh month, wuyin new moon: Yanzhou army marshal Li Xinggan was made Yan prefect, permitted direct memorial to the throne, not subordinate to Xia.',
    idiomatic: 'On the eleventh month\'s new moon Li Xinggan became Yanzhou prefect with direct access to the throne.',
  },
  s0762: {
    literal: 'On bingwu Zhen-Wu, Lin, and Sheng military commissioner Fan Xichao came to court.',
    idiomatic: 'On bingwu Fan Xichao of the northern frontier came to audience.',
  },
  s0763: {
    literal: 'On wuwu Zhenwu campaign marshal Yan Juyuan was made acting Minister of Works, concurrent Chanyu great protector, and Zhenwu-Lin-Sheng military commissioner.',
    idiomatic: 'On wuwu Yan Juyuan became Zhenwu commissioner.',
  },
  s0764: {
    literal: 'On gengshen Minister of Rites Gao Ying was made Secretariat Vice Director and Concurrent Associate.',
    idiomatic: 'On gengshen Gao Ying entered the chancellery.',
  },
  s0765: {
    literal: 'On renshen Supervising Censor Cui Yuan had recently entered the censorate, was not versed in precedent, and improperly entered the Right Divine Strategy Army.',
    idiomatic: 'On renshen Cui Yuan, new to the censorate, trespassed into the Right Divine Strategy barracks.',
  },
  s0766: {
    literal: 'The emperor was angry, flogged him forty strokes, and exiled him to Yazhou.',
    idiomatic: 'The emperor had him beaten and sent to Yazhou.',
  },
  s0767: {
    literal: 'Twentieth year, spring, first month, dingchou new moon.',
    idiomatic: 'The twentieth year opened on dingchou.',
  },
  s0768: {
    literal: 'On bingshen Tiande Army defense and training commissioner, Fengzhou prefect Li Jinglüe died; his legal clerk Ren Dijian was ordered to act in his place.',
    idiomatic: 'On bingshen Li Jinglüe died; Ren Dijian succeeded him at Fengzhou.',
  },
  s0769: {
    literal: 'On jihai Yan-Fang-Dan-Yan military commissioner Liu Gongji was made Minister of Works; his campaign marshal Pei Fen was ordered to act in his place.',
    idiomatic: 'On jihai Liu Gongji became minister of works; Pei Fen took his command.',
  },
  s0770: {
    literal: 'Second month, bingwu new moon: the Central Harmony festival banquet was stopped — the year was lean.',
    idiomatic: 'The Central Harmony feast was canceled for scarcity.',
  },
  s0771: {
    literal: 'On gengxu great thunder sounded and hail fell.',
    idiomatic: 'On gengxu thunder brought hail.',
  },
  s0772: {
    literal: 'Third month, jiashen: because the Tibetan qaghan died, court was suspended.',
    idiomatic: 'In the third month court was canceled for the Tibetan qaghan\'s death.',
  },
  s0773: {
    literal: 'On jihai National University director Zhao Chang was made Annan protector, censor-in-chief, and circuit pacification commissioner.',
    idiomatic: 'On jihai Zhao Chang was sent to Annan as protector.',
  },
  s0774: {
    literal: 'Summer, fourth month, xinyou: heir-apparent guest Qi Kang died.',
    idiomatic: 'In the fourth month Qi Kang died.',
  },
  s0775: {
    literal: 'On bingyin Tibetan envoys including Zang Henan observation commissioner Lun Qiran, fifty-four persons, came to court with tribute.',
    idiomatic: 'On bingyin fifty-four Tibetan envoys presented tribute.',
  },
  s0776: {
    literal: 'The Chen-Xu command was granted the name Zhongwu Army.',
    idiomatic: 'Chen-Xu was renamed the Zhongwu Army.',
  },
  s0777: {
    literal: 'Fifth month, jiaxu new moon: holding court at Xuanzheng Hall was stopped.',
    idiomatic: 'Court at Xuanzheng was suspended on the fifth month\'s new moon.',
  },
  s0778: {
    literal: 'On yihai Historiography compiler and Palace Library director Zhang Jiang was made Works vice minister, concurrent censor-in-chief, and envoy to mourn the Tibetan qaghan.',
    idiomatic: 'On yihai Zhang Jiang was sent to Tibet on condolence mission.',
  },
  s0779: {
    literal: 'Seventh month, guiyou new moon: great hail fell.',
    idiomatic: 'On the seventh month\'s new moon hail fell heavily.',
  },
  s0780: {
    literal: 'On xinmao Fujian observation commissioner Liu Mian memorialized establishing the Wan\'an supervisory pasture within Quanzhou\'s border, setting up five herd offices, gathering nearly ten thousand head of horses, cattle, and sheep from within the circuit — overseen by supervisory clerks.',
    idiomatic: 'On xinmao Fujian seized local livestock for a new Wan\'an pasture.',
  },
  s0781: {
    literal: 'Eighth month, wushen: Fangzhou prefect Que Shimei was made Qianzhong observation commissioner.',
    idiomatic: 'On wushen Que Shimei became Qianzhong observer.',
  },
  s0782: {
    literal: 'On jiwei Zhaoyi army marshal Lu Congshi was made acting Minister of Works, concurrent chief administrator of Luzhou, Zhaoyi military commissioner, and Ze-Lu-Ci-Xing-Ming observer.',
    idiomatic: 'On jiwei Lu Congshi took Zhaoyi at Luzhou.',
  },
  s0783: {
    literal: 'Ninth month, gengchen: ministers were feasted at Ma Lin\'s mountain pool.',
    idiomatic: 'In the ninth month the court feasted at Ma Lin\'s pool.',
  },
  s0784: {
    literal: 'Winter, tenth month, jiachen: the Tangchang Army was established at Nanpi County in Jingzhou.',
    idiomatic: 'In the tenth month the Tangchang Army was founded at Nanpi.',
  },
  s0785: {
    literal: 'On xinhai Yiding military commissioner Zhang Maozhao came to court.',
    idiomatic: 'On xinhai Zhang Maozhao of Yiding came to audience.',
  },
  s0786: {
    literal: 'Eleventh month, dingyou: supervising censors Li Cheng, Secretariat regular scribe Zhang Yu, and Lantian county lieutenant Wang Ya were all made Hanlin academicians.',
    idiomatic: 'In the eleventh month Li Cheng, Zhang Yu, and Wang Ya entered the Hanlin.',
  },
  s0787: {
    literal: 'Twelfth month: Tibet, Nanzhao, and Japan all sent envoys with tribute.',
    idiomatic: 'In the twelfth month Tibet, Nanzhao, and Japan sent tribute missions.',
  },
  s0788: {
    literal: 'On gengwu Gui defense commissioner Yan Zheng was made Guizhou prefect and Gui observation commissioner.',
    idiomatic: 'On gengwu Yan Zheng became Gui commissioner.',
  },
  s0789: {
    literal: 'Twenty-first year, spring, first month, xinwei new moon: he attended Hanyuan Hall to receive court congratulations.',
    idiomatic: 'The twenty-first year opened with New Year rites at Hanyuan Hall.',
  },
  s0790: {
    literal: 'That day the emperor was unwell.',
    idiomatic: 'That day the emperor was ill.',
  },
  s0791: {
    literal: 'On bingzi Zhedong observation judge Ling Zhun was made Hanlin academician; on guisi he assembled the commandery ministers at Xuanzheng Hall and proclaimed the testamentary edict: the crown prince should succeed before the coffin.',
    idiomatic: 'On bingzi Ling Zhun entered the Hanlin; on guisi the death edict named the crown prince.',
  },
  s0792: {
    literal: 'That day the emperor died at Huining Hall, age sixty-four.',
    idiomatic: 'That day Dezong died at Huining Hall, aged sixty-four.',
  },
  s0793: {
    literal: 'On jiawu the spirit coffin was moved to Taiji Hall.',
    idiomatic: 'On jiawu the coffin was moved to Taiji Hall.',
  },
  s0794: {
    literal: 'On bingshen mourning began; the ministers wore white hemp.',
    idiomatic: 'On bingshen mourning began in white.',
  },
  s0795: {
    literal: 'The crown prince succeeded.',
    idiomatic: 'The crown prince ascended the throne.',
  },
  s0796: {
    literal: 'Yongzhen first year, ninth month, dingmao: the ministers submitted the posthumous title Divine Martial Filial Literary and temple name Dezong.',
    idiomatic: 'In Yongzhen 9 the court gave the posthumous title Shenwu Xiaowen and temple name Dezong.',
  },
  s0797: {
    literal: 'Tenth month, jiyou: burial at Chongling; Empress Zhaode of the Wang clan was enshrined with him.',
    idiomatic: 'On jiyou he was buried at Chongling with Empress Zhaode.',
  },
  s0798: {
    literal: '【Historian\'s appraisal】 The historian says: When Emperor Dezong first took the reins of government, he strove to refine the way of rule.',
    idiomatic: '【Historian\'s appraisal】 The historian writes: At first Dezong seized the throne and labored to govern well.',
  },
  s0799: {
    literal: 'He thirsted for sound policy as for water, and looked on the people as on a wound.',
    idiomatic: 'He hungered for good counsel and grieved for the people as for an open sore.',
  },
  s0800: {
    literal: 'With lowered tassels he prolonged reception of forthright words; with side seat he longed to seek many worthies.',
    idiomatic: 'He listened for honest speech and searched the realm for talent.',
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
if (data.metadata.chapter !== '013') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 013; standalone T ready (${Object.keys(T).length} entries).`
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
