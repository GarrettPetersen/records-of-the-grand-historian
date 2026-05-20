#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.011, Daizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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
  s0401: {
    literal: 'On bingchen the moon violated Bi.',
    idiomatic: 'On bingchen the moon crossed the mansion Bi.',
  },
  s0402: {
    literal:
      'Grand Master of Splendid Happiness and Chief Commandant of the Horse Empress Cadet Jiang Qingchu was guilty of an offense and ordered to take his own life.',
    idiomatic:
      'Jiang Qingchu, the empress\'s son-in-law, was ordered to commit suicide.',
  },
  s0403: {
    literal: 'An order made mausoleum offices again subordinate to the Imperial Clan Court.',
    idiomatic: 'Mausoleum offices were returned to the imperial clan directorate.',
  },
  s0404: {
    literal: 'In the ninth month, on wushen new moon, the Year Star guarded Eastern Well seven days.',
    idiomatic: 'Ninth month: Jupiter lingered seven days in Eastern Well.',
  },
  s0405: {
    literal: 'On jiayin Tibet raided Lingzhou and advanced to raid Binzhou.',
    idiomatic: 'On jiayin Tibet struck Lingzhou and pressed Binzhou.',
  },
  s0406: {
    literal:
      'An edict ordered Ziyi to lead thirty thousand troops from Hezhong to garrison Jingyang; the capital was put on alert.',
    idiomatic:
      'Guo Ziyi was ordered to thirty thousand men at Jingyang; Chang\'an went on alert.',
  },
  s0407: {
    literal: 'At midnight on wuwu white mist rose in the northwest and filled the sky.',
    idiomatic: 'At midnight on wuwu white fog covered the sky from the northwest.',
  },
  s0408: {
    literal: 'Ziyi shifted garrison to Fengtian.',
    idiomatic: 'Guo Ziyi moved his camp to Fengtian.',
  },
  s0409: {
    literal: 'In daytime on yichou a great meteor went out from wu and vanished at hai.',
    idiomatic: 'By day on yichou a great meteor flashed from noon to the twelfth hour.',
  },
  s0410: {
    literal: 'Left Vice Director Li Han was ordered to comfort Hebei.',
    idiomatic: 'Li Han was sent to pacify Hebei.',
  },
  s0411: {
    literal: 'The Spark Star violated Southern Dipper.',
    idiomatic: 'Mars crossed the Southern Dipper.',
  },
  s0412: {
    literal: 'On xinwei Mohe envoys came to court.',
    idiomatic: 'On xinwei Mohe envoys arrived.',
  },
  s0413: {
    literal: 'Guilin mountain barbarians took the prefectural city; prefect Li Liang fled away.',
    idiomatic: 'Guilin tribes seized the prefecture; Li Liang fled.',
  },
  s0414: {
    literal:
      'In the tenth month, on wuyin, Lingzhou memorialized breaking twenty thousand Tibetans; the capital alert was lifted.',
    idiomatic:
      'Tenth month: Lingzhou reported twenty thousand Tibetans defeated and the capital stood down.',
  },
  s0415: {
    literal: 'On jiashen salary fields of capital officials were reduced one-third to supply army grain.',
    idiomatic: 'On jiashen capital officials lost a third of their salary lands for the army.',
  },
  s0416: {
    literal: 'On yiyou a sweet spring appeared at Liyang; drinking it cured illness.',
    idiomatic: 'On yiyou a healing spring appeared at Liyang.',
  },
  s0417: {
    literal: 'Uyghur and Tangut envoys came to court.',
    idiomatic: 'Uyghur and Tangut embassies arrived.',
  },
  s0418: {
    literal: 'On guimao the emperor went to Zichen Hall.',
    idiomatic: 'On guimao he held court at Zichen Hall.',
  },
  s0419: {
    literal:
      'He tested by decree candidates of Outstanding Talent and Unusual Conduct, Content with Poverty and Delighting in the Way, Filial Piety and Diligence in Farming, and Lofty Withdrawal without Office — four categories.',
    idiomatic:
      'He examined four special moral and scholarly degree categories at Zichen Hall.',
  },
  s0420: {
    literal:
      'In the eleventh month, on gengshen, Yellow Gate Vice Director was changed back to Chancellery Vice Director as before.',
    idiomatic:
      'Eleventh month: yellow gate vice directors reverted to chancellery vice directors.',
  },
  s0421: {
    literal:
      'An edict stated: "In Spring and Autumn the nine commands made the upper duke.',
    idiomatic:
      'An edict recalled that Spring and Autumn enfeoffed the three dukes as the highest ministers.',
  },
  s0422: {
    literal: 'Those called chancellor were the office of the Three Dukes.',
    idiomatic: 'The title chancellor belonged to the three dukes.',
  },
  s0423: {
    literal:
      'Han statute: the Secretariat Director issued and received edicts and managed the pivot of secrets;',
    idiomatic:
      'Under Han the director issued edicts and held the secrets of state;',
  },
  s0424: {
    literal:
      'the Palace Attendant ascended the hall and proclaimed regulations, deliberating government affairs.',
    idiomatic:
      'the palace attendant proclaimed policy and debated affairs on the hall.',
  },
  s0425: {
    literal: 'From Wei and Jin onward the post grew heavier.',
    idiomatic: 'Wei and Jin made the post weightier still.',
  },
  s0426: {
    literal:
      'The office concerned the public offices; affairs were not tied to the Imperial Secretariat — though they presented plans of nourishment, they did not yet have the exclusive title of chancellor; therefore trust and encounter were so great while rank and grade were not exalted.',
    idiomatic:
      'Early chancellors advised the throne without yet bearing the full title, so power outran formal rank.',
  },
  s0427: {
    literal:
      'As for Our dynasty, it truly executes their government, bearing the charge of left assistant and right helper, gathering the name of substituting for Heaven and ordering things, directing the hundred officials, molding and assimilating the luminous transformation.',
    idiomatic:
      'In Tang the chancellor truly governed, assisting the throne and shaping the hundred officials.',
  },
  s0428: {
    literal: 'How can the place all gaze upon not have rank and number increased?',
    idiomatic: 'Such a post deserved higher rank.',
  },
  s0429: {
    literal: 'It should properly be advanced in equal majesty to match its office.',
    idiomatic: 'Its dignity should match its burden.',
  },
  s0430: {
    literal:
      'Palace Attendant and Secretariat Director should be advanced to regular second grade; Chancellery and Secretariat Vice Directors to regular third grade.',
    idiomatic:
      'Palace attendant and director were raised to second rank; vice directors to third.',
  },
  s0431: {
    literal:
      'On renxu night the moon haloed the Northern and Southern River and Eastern Well; the Station Star entered Ghost; long afterward it dispersed.',
    idiomatic:
      'On renxu night the moon haloed several mansions until Saturn entered Ghost.',
  },
  s0432: {
    literal: 'On jiazi the moon left Xuanyuan by one chi.',
    idiomatic: 'On jiazi the moon stood a foot from Xuanyuan.',
  },
  s0433: {
    literal:
      'On jichou he led the hundred officials and capital gentry and commoners to contribute cash to aid the army.',
    idiomatic:
      'On jichou the court and city were levied for war funds.',
  },
  s0434: {
    literal: 'On renshen the capital earthquake came from the northeast; its sound was like thunder.',
    idiomatic: 'On renshen an earthquake rolled from the northeast like thunder.',
  },
  s0435: {
    literal: 'In the twelfth month, on jiashen, Fengxiang Li Baoyu came to court.',
    idiomatic: 'Twelfth month: Li Baoyu came to court again.',
  },
  s0436: {
    literal: 'On dingyou Hedong military commissioner Xin Yunjing came to court.',
    idiomatic: 'On dingyou Xin Yunjing came to court.',
  },
  s0437: {
    literal: 'The Spark Star entered the Ramparts.',
    idiomatic: 'Mars entered the celestial ramparts.',
  },
  s0438: {
    literal: 'On wuxu black vapor like dust filled the northern quarter.',
    idiomatic: 'On wuxu black dust-like haze covered the north.',
  },
  s0439: {
    literal:
      'That autumn fifty-five prefectures of Hedong, Henan, Huainan, Zhejiang east and west, and Fujian circuits memorialized flood disaster.',
    idiomatic:
      'Autumn floods were reported from fifty-five prefectures across the east.',
  },
  s0440: {
    literal: 'Dali 3, on bingwu new moon of the first month of spring.',
    idiomatic: 'First month of spring, Dali 3, bingwu new moon.',
  },
  s0441: {
    literal:
      'On xinhai Jiannan West established Qianzhou, administering Zhaowu and Ningyuan two counties.',
    idiomatic:
      'On xinhai Qianzhou was founded in western Sichuan.',
  },
  s0442: {
    literal: 'On renzi night the moon covered Bi.',
    idiomatic: 'On renzi night the moon occulted Bi.',
  },
  s0443: {
    literal: 'On jiazi the mother of Silla King Kim Geonun was enfeoffed Grand Consort.',
    idiomatic: 'On jiazi Silla\'s queen mother was enfeoffed grand consort.',
  },
  s0444: {
    literal:
      'On jiaxu Vice Minister of Works Jiang Huan was made Left Secretariat Vice Director; Zhexi training and observation commissioner and Suzhou prefect Wei Yuanfu was made Right Secretariat Vice Director.',
    idiomatic:
      'On jiaxu Jiang Huan and Wei Yuanfu became left and right vice directors.',
  },
  s0445: {
    literal:
      'Left Vice Director Li Han and Right Vice Director Jia Zhi were both made Vice Ministers of War.',
    idiomatic:
      'Li Han and Jia Zhi became vice ministers of war.',
  },
  s0446: {
    literal: 'On yihai Princess Yonghe died.',
    idiomatic: 'On yihai Princess Yonghe passed away.',
  },
  s0447: {
    literal:
      'On jimao Changzhou prefect Li Qiyun was made Suzhou prefect, concurrent Vice Censor-in-Chief and Zhexi training and observation commissioner.',
    idiomatic:
      'On jimao Li Qiyun became Suzhou prefect and Zhexi commissioner.',
  },
  s0448: {
    literal: 'On renwu Binxia military commissioner Ma Lin came to court.',
    idiomatic: 'On renwu Ma Lin came to court.',
  },
  s0449: {
    literal: 'In the third month, on yisi new moon, there was an eclipse of the sun.',
    idiomatic: 'Third month: solar eclipse.',
  },
  s0450: {
    literal:
      'On renshen Xingtang county of Hengzhou was split to establish Qizhou, with Lingshou and Hengyang subordinate.',
    idiomatic:
      'On renshen Qizhou was carved from Hengzhou.',
  },
  s0451: {
    literal:
      'In the fourth month of summer, on wuyin, Shannan West military commissioner and Duke of Deng Zhang Xianchéng was made acting Minister of Households.',
    idiomatic:
      'Summer fourth month: Zhang Xianchéng became acting minister of households.',
  },
  s0452: {
    literal: 'He resigned the post because of illness.',
    idiomatic: 'He stepped down citing illness.',
  },
  s0453: {
    literal:
      'Right Forest Guard General Zhang Xiangong was made Liangzhou prefect, concurrent Vice Censor-in-Chief, and Shannan West military and observation commissioner.',
    idiomatic:
      'Zhang Xiangong succeeded him in Shannan West at his brother\'s recommendation.',
  },
  s0454: {
    literal: 'His elder brother Xianchéng had recommended him.',
    idiomatic: 'The appointment followed Xianchéng\'s petition.',
  },
  s0455: {
    literal: 'On renyin Hua-Bo military commissioner Linghu Zhang was advanced acting Minister of Works.',
    idiomatic: 'On renyin Linghu Zhang became acting minister of works.',
  },
  s0456: {
    literal:
      'Jiannan West River military commissioner, concurrent Censor-in-Chief Cui Gan came to court.',
    idiomatic:
      'Cui Gan of Sichuan came to court.',
  },
  s0457: {
    literal: 'On wushen Cui Gan was advanced Acting Right Palace Companion.',
    idiomatic: 'On wushen Cui Gan became acting right palace companion.',
  },
  s0458: {
    literal:
      'On yimao the late Prince of Qi Li Tan was posthumously titled Emperor Chengtian; the deceased daughter of Princess Xingxin, née Zhang, was Empress Gongshun — joint burial.',
    idiomatic:
      'On yimao Li Tan was posthumously enthroned as Chengtian; a Zhang consort was buried with him.',
  },
  s0459: {
    literal: 'On xinyou Guilin Linyuan county was renamed Quanyi county.',
    idiomatic: 'On xinyou Linyuan became Quanyi.',
  },
  s0460: {
    literal: 'On guiyou Left Palace Companion Cui Zhao was made Jingzhao prefect.',
    idiomatic: 'On guiyou Cui Zhao became Jingzhao prefect.',
  },
  s0461: {
    literal: 'That day there was an earthquake.',
    idiomatic: 'An earthquake struck that day.',
  },
  s0462: {
    literal:
      'On wuchen Jiannan West River military commissioner Cui Gan was advanced acting Minister of Works and renamed Ning.',
    idiomatic:
      'On wuchen Cui Gan became minister of works and took the name Ning.',
  },
  s0463: {
    literal:
      'Ning was attacked by Bo Maolin and Yang Zilin; Ning having entered court, Zilin seized Chengdu prefecture by surprise.',
    idiomatic:
      'While Cui Ning was at court, Yang Zilin seized Chengdu.',
  },
  s0464: {
    literal: 'The court was anxious; that very day an edict ordered Ning to return to Chengdu.',
    idiomatic: 'The throne immediately ordered him back to Chengdu.',
  },
  s0465: {
    literal:
      'On gengwu Qiongzhou prefect Xianyu Shuming was made Zizhou prefect and Jiannan East River military commissioner.',
    idiomatic:
      'On gengwu Xianyu Shuming was sent east in Sichuan.',
  },
  s0466: {
    literal:
      'In the sixth month, on wuzi, Emperor Chengtian was enshrined in Emperor Fengtian\'s temple, same hall different chamber; on gengyin Heir Apparent Junior Tutor Wang Yu died.',
    idiomatic:
      'Sixth month: Chengtian was enshrined; Wang Yu died on gengyin.',
  },
  s0467: {
    literal:
      'On gengzi Youzhou military commissioner, acting Palace Attendant, chief of Youzhou metropolitan prefecture Li Huaixian was killed by his camp army commissioner Zhu Xicai.',
    idiomatic:
      'On gengzi Li Huaixian was murdered by Zhu Xicai at Youzhou.',
  },
  s0468: {
    literal:
      'On gengzi Huainan military commissioner, acting Left Vice Director of the Imperial Secretariat, knowing ministry affairs, chief of Yangzhou metropolitan prefecture, Duke of Zhao Cui Yuan died.',
    idiomatic:
      'On gengzi Cui Yuan, Duke of Zhao and Huainan commissioner, died.',
  },
  s0469: {
    literal: 'Intercalary month, on jiyou, Guo Ziyi was advanced Grand Mentor.',
    idiomatic: 'Intercalary month: Guo Ziyi became grand mentor.',
  },
  s0470: {
    literal:
      'On gengshen Chancellor and Henan deputy commander-in-chief Wang Jin also took Youzhou military commissioner.',
    idiomatic:
      'On gengshen Wang Jin added the Youzhou command.',
  },
  s0471: {
    literal:
      'Right Secretariat Vice Director Wei Yuanfu was made chief of Yangzhou metropolitan prefecture, concurrent Censor-in-Chief, and Huainan military and observation commissioner.',
    idiomatic:
      'Wei Yuanfu replaced Cui Yuan in Huainan.',
  },
  s0472: {
    literal:
      'On xinmao Youzhou military vice commissioner, acting Grand Master of Splendid Happiness Zhu Xicai was made acting Youzhou regent.',
    idiomatic:
      'On xinmao Zhu Xicai was named acting Youzhou regent.',
  },
  s0473: {
    literal:
      'Vice Minister of War Li Han was made concurrent Censor-in-Chief and sent to comfort Hebei — because of Youzhou\'s disorder.',
    idiomatic:
      'Li Han was sent to Hebei because of the Youzhou chaos.',
  },
  s0474: {
    literal:
      'In the seventh month, on renshen, Xiangzhou Xue Song, Weizhou Tian Chengsi, and Hengzhou Li Baochen were all advanced Left and Right Vice Directors.',
    idiomatic:
      'Seventh month: three Hebei warlords became vice directors.',
  },
  s0475: {
    literal:
      'That month Cui Ning\'s younger brother Kuan broke Yang Zilin and recovered Chengdu prefecture.',
    idiomatic:
      'That month Cui Kuan drove out Yang Zilin and retook Chengdu.',
  },
  s0476: {
    literal:
      'That month the five planets all gathered in Eastern Well; the omen stated: benefit to the Central State.',
    idiomatic:
      'That month five planets gathered in Eastern Well — an omen of favor to China.',
  },
  s0477: {
    literal: 'On yihai Wang Jin went to Zhenzhou.',
    idiomatic: 'On yihai Wang Jin departed for Zhenzhou.',
  },
  s0478: {
    literal: 'In the eighth month, on jiwei, the moon covered Bi.',
    idiomatic: 'Eighth month: lunar occultation of Bi.',
  },
  s0479: {
    literal: 'On xinyou the moon entered Eastern Well.',
    idiomatic: 'On xinyou the moon moved into Eastern Well.',
  },
  s0480: {
    literal: 'On renxu one hundred thousand Tibetans raided Lingwu.',
    idiomatic: 'On renxu a hundred thousand Tibetans struck Lingwu.',
  },
  s0481: {
    literal: 'The Spark Star violated the Taiwei enclosure.',
    idiomatic: 'Mars entered the Taiwei asterism.',
  },
  s0482: {
    literal:
      'On dingmao Tibet raided Binxia; military commissioner Ma Lin broke twenty thousand Tibetans at Binzhou.',
    idiomatic:
      'On dingmao Ma Lin defeated twenty thousand Tibetans at Bin.',
  },
  s0483: {
    literal: 'Censor-in-Chief Cui Huan was made Green-Sprout land-tax commissioner.',
    idiomatic: 'Cui Huan took charge of the green-sprout land tax.',
  },
  s0484: {
    literal:
      'Official salary cash was unequal; an edict ordered Left Secretariat Vice Director Jiang Huan to investigate — Cui Huan was demoted to Daozhou prefect.',
    idiomatic:
      'Jiang Huan\'s inquiry into unequal salaries demoted Cui Huan to Daozhou.',
  },
  s0485: {
    literal:
      'On gengwu Hedong military commissioner, acting Left Vice Director, Taiyuan prefect, Associate Grand Secretariat Xin Yunjing died.',
    idiomatic:
      'On gengwu Xin Yunjing of Hedong died.',
  },
  s0486: {
    literal:
      'Chancellery Vice Director, Associate Grand Secretariat, concurrent Youzhou chief, holding credentials, Henan deputy commander-in-chief, overall commander of Henan, Huai-Xi, and Hedong South campaign circuits, concurrent Youzhou Lulong and other armies military commissioner, Grand Supreme Ultimate Palace commissioner, Hongwen Hall grand academician, concurrent Eastern Capital garrison commander, Duke of Qi Wang Jin also Taiyuan prefect and Northern Capital garrison commander, charged with Hedong army military commission — other offices and commissioners as before.',
    idiomatic:
      'Wang Jin absorbed Taiyuan and Hedong while keeping his eastern commands.',
  },
  s0487: {
    literal:
      'On xinwei Chancellery Vice Director, Associate Grand Secretariat, Mountain-Sword deputy commander-in-chief, Grand Supreme Clarity Palace commissioner, Chongxuan Hall grand academician Du Hongjian was also Eastern Capital garrison commander.',
    idiomatic:
      'On xinwei Du Hongjian also became Luoyang commandant.',
  },
  s0488: {
    literal: 'In the ninth month, on renshen.',
    idiomatic: 'Ninth month, renshen.',
  },
  s0489: {
    literal: 'Guo Ziyi shifted garrison from Hezhong to Fengtian.',
    idiomatic: 'Guo Ziyi moved from Hezhong to Fengtian.',
  },
  s0490: {
    literal: 'The Year Star entered Ghost.',
    idiomatic: 'Jupiter entered the mansion Ghost.',
  },
  s0491: {
    literal: 'On dingchou Prince of Ji Li Huan died.',
    idiomatic: 'On dingchou Li Huan, Prince of Ji, died.',
  },
  s0492: {
    literal: 'The Spark Star entered the Taiwei enclosure.',
    idiomatic: 'Mars again entered Taiwei.',
  },
  s0493: {
    literal: 'On renyang Tibet raided Lingzhou.',
    idiomatic: 'On renyang Tibetans struck Lingzhou again.',
  },
  s0494: {
    literal:
      'On jiashen Left Secretariat Vice Director Jiang Huan was made Huazhou prefect and Zhenguo Army Tong Pass defense commissioner.',
    idiomatic:
      'On jiashen Jiang Huan was sent to guard Tong Pass at Hua.',
  },
  s0495: {
    literal:
      'On bingxu Acting Minister of Households, knowing ministry affairs, Duke of Deng Zhang Xianchéng died.',
    idiomatic:
      'On bingxu Zhang Xianchéng died.',
  },
  s0496: {
    literal: 'On dinghai.',
    idiomatic: 'On dinghai [no further entry].',
  },
  s0497: {
    literal: 'Minister of Works Zhao Guozhen died.',
    idiomatic: 'Zhao Guozhen, Minister of Works, died.',
  },
  s0498: {
    literal: 'On gengyin Huazhou prefect Zhang Chongguang was made Left Secretariat Vice Director.',
    idiomatic: 'On gengyin Zhang Chongguang became left vice director.',
  },
  s0499: {
    literal: 'On renchen Lingzhou general Bai Guangye broke twenty thousand Tibetans at Lingwu.',
    idiomatic: 'On renchen Bai Guangye defeated twenty thousand Tibetans at Lingwu.',
  },
  s0500: {
    literal:
      'On wuxu Lingwu memorialized breaking sixty thousand Tibetans; the hundred officials offered congratulations; the capital alert was lifted.',
    idiomatic:
      'On wuxu sixty thousand Tibetans were reported broken; the court congratulated and stood down.',
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
if (data.metadata.chapter !== '011') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 011; standalone T ready (${Object.keys(T).length} entries).`
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
