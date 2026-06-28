#!/usr/bin/env node
/**
 * Patch manualTranslations for mingshi/017 source-correspondence queue items.
 */

import fs from 'node:fs';

const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-mingshi.json';
const META = {
  translator: 'Garrett M. Petersen (2026)',
  model: 'Composer 2.5',
};

function withMeta(rows) {
  return rows.map((row) => ({ ...row, ...META }));
}

const YEAR_TWO_OMISSION = withMeta([
  {
    zh: '二年春正月乙卯，大祀天地於南郊。',
    literal: 'In spring of Jiajing year two, first month, day yimao, Heaven and Earth were greatly sacrificed to at the Southern Suburb.',
    idiomatic: 'In the first month of spring in Jiajing two, on yimao, he performed the great suburban sacrifice to Heaven and Earth.',
  },
  {
    zh: '丁卯，小王子犯沙河堡，總兵官杭雄戰卻之。',
    literal: 'On dingmao the Little Prince raided Shahe Fort; Regional Commander Hang Xiong fought them off.',
    idiomatic: 'On dingmao the Little Prince attacked Shahe Fort, and Regional Commander Hang Xiong drove him back in battle.',
  },
  {
    zh: '二月癸未，振遼東饑。',
    literal: 'In the second month, on guiwei, relief was extended for famine in Liaodong.',
    idiomatic: 'In the second month, on guiwei, famine relief was sent to Liaodong.',
  },
  {
    zh: '壬辰，總督軍務右都御史俞諫、總兵官魯綱討平河南、山東賊。',
    literal: 'On renchen Right Censor-in-Chief Yu Jian, supervising military affairs, and Regional Commander Lu Gang suppressed the bandits in Henan and Shandong.',
    idiomatic: 'On renchen Yu Jian, right censor-in-chief supervising military affairs, and Regional Commander Lu Gang pacified the bandits in Henan and Shandong.',
  },
  {
    zh: '三月乙巳，俺答寇大同。',
    literal: 'In the third month, on yisi, Altan raided Datong.',
    idiomatic: 'In the third month, on yisi, Altan raided Datong.',
  },
  {
    zh: '甲寅，武宗神主祔太廟。',
    literal: 'On jiayin the spirit tablet of Wuzong was enshrined in the Imperial Ancestral Temple.',
    idiomatic: 'On jiayin Wuzong\'s spirit tablet was enshrined in the Imperial Ancestral Temple.',
  },
  {
    zh: '戊午，賜姚淶等進士及第、出身有差。',
    literal: 'On wuwu Yao Lai and other metropolitan graduates were granted ranks as jinshi or chushen according to merit.',
    idiomatic: 'On wuwu Yao Lai and other metropolitan graduates were granted jinshi and chushen ranks according to merit.',
  },
  {
    zh: '夏四月壬申，以災異敕羣臣修省。',
    literal: 'In summer, the fourth month, on renshen, because of ominous portents ministers were commanded to practice self-examination.',
    idiomatic: 'In the fourth month of summer, on renshen, the emperor ordered his ministers to examine themselves in the wake of ominous portents.',
  },
  {
    zh: '癸未，以宋朱熹裔孫墅為五經博士。',
    literal: 'On guiwei Shu, a descendant of the Song Confucian Zhu Xi, was appointed Five Classics Doctor.',
    idiomatic: 'On guiwei Shu, a descendant of the Song Confucian Zhu Xi, was made Five Classics Doctor.',
  },
  {
    zh: '癸巳，命兩京三品以上及撫、按官舉堪任守令者。',
    literal: 'On guisi officials of third rank and above in both capitals and grand coordinators and surveillance commissioners were ordered to recommend those fit to serve as prefects and magistrates.',
    idiomatic: 'On guisi officials of third rank and above in both capitals, together with grand coordinators and surveillance commissioners, were ordered to recommend candidates fit for prefect and magistrate posts.',
  },
  {
    zh: '五月庚午，小王子犯密雲石塘嶺，殺指揮使殷隆。',
    literal: 'In the fifth month, on gengwu, the Little Prince raided Shitang Ridge in Miyun and killed Commander Yin Long.',
    idiomatic: 'In the fifth month, on gengwu, the Little Prince attacked Shitang Ridge in Miyun and killed Commander Yin Long.',
  },
  {
    zh: '六月癸丑，以災傷免嘉靖元年天下稅糧之半。',
    literal: 'In the sixth month, on guichou, because of disaster and damage half of the empire\'s tax grain for Jiajing year one was remitted.',
    idiomatic: 'In the sixth month, on guichou, half of the empire\'s tax grain levies for Jiajing one were forgiven because of natural disaster.',
  },
  {
    zh: '秋八月辛酉，小王子犯丁字堡，都指揮王綱戰死。',
    literal: 'In autumn, the eighth month, on xinyou, the Little Prince raided Dingzi Fort; Regional Commander Wang Gang died in battle.',
    idiomatic: 'In the eighth month of autumn, on xinyou, the Little Prince attacked Dingzi Fort; Regional Commander Wang Gang was killed in battle.',
  },
  {
    zh: '冬十一月丁卯，免南畿被災稅糧。',
    literal: 'In winter, the eleventh month, on dingmao, tax and grain levies were remitted in disaster-stricken areas of the Southern Metropolitan Region.',
    idiomatic: 'In the eleventh month of winter, on dingmao, tax and grain levies were forgiven in disaster-stricken parts of the Southern Metropolitan Region.',
  },
  {
    zh: '己丑，振河南饑。',
    literal: 'On jichou relief was extended for famine in Henan.',
    idiomatic: 'On jichou famine relief was sent to Henan.',
  },
  {
    zh: '是年，撒馬兒罕、土魯番、天方入貢。',
    literal: 'That year Samarkand, Turfan, and Tianfang sent tribute.',
    idiomatic: 'That year envoys came with tribute from Samarkand, Turfan, and Tianfang.',
  },
]);

const patches = {
  'source-mingshi-017-wikisource-1f8db810bcf6': {
    manualTranslations: withMeta([
      {
        zh: '壬申，錢寧伏誅。',
        literal: 'On renshen, Qian Ning was executed.',
        idiomatic: 'On renshen Qian Ning was put to death.',
      },
    ]),
  },
  'source-mingshi-017-wikisource-a7dd0e361971': {
    manualTranslations: withMeta([
      {
        zh: '辛卯，祀天於南郊。',
        literal: 'Day xinmao: Heaven was worshipped at the Southern Suburb.',
        idiomatic: 'On xinmao Heaven was worshipped at the Southern Suburb.',
      },
    ]),
    preserveExistingTranslations: true,
  },
  'source-mingshi-017-wikisource-c714f792c05e': {
    manualTranslations: YEAR_TWO_OMISSION,
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
let patched = 0;

for (const item of queue.items) {
  const patch = patches[item.id];
  if (!patch) continue;
  if (patch.manualTranslations) item.manualTranslations = patch.manualTranslations;
  if (patch.preserveExistingTranslations) item.preserveExistingTranslations = true;
  patched += 1;
}

fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Patched manualTranslations for ${patched} mingshi/017 source item(s).`);
