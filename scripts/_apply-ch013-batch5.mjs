#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.013, Dezong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
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
    literal: "Zhaoyi acting commissioner Wang Yangu was made Lu metropolitan senior administrator, Zhaoyi deputy commissioner, knowing commissioner affairs, and commissioner of Lu-Ze-Ci-Xing-Ming observation.",
    idiomatic: "Wang Yangu took full Zhaoyi command at Lu.",
  },
  s0402: {
    literal: "Also Shuofang acting commissioner Li Luan was made Ling metropolitan senior administrator, Shuofang Ling-Salt-Feng-Xia four prefectures' surrender, Dingyuan city, Tiande army deputy commissioner, knowing commissioner affairs, and commissioner of revenue, farming, observation, and barbarian control.",
    idiomatic: "Li Luan was confirmed over Shuofang and the northwest garrisons.",
  },
  s0403: {
    literal: "On jiashen Hedong commissioner, acting War Minister, Taiyuan Intendant Li Ziliang died.",
    idiomatic: "On jiashen Li Ziliang died at Hedong.",
  },
  s0404: {
    literal: "On gengyin envoys were sent to enfeoff the Nine Surnames' Uighur Tengri Bolu Mishi Hehu Liugu Piqie Huaixin Qaghan.",
    idiomatic: "On gengyin the new Uighur qaghan was enfeoffed.",
  },
  s0405: {
    literal: "On guisi Prince of Tong Zhen was made Hedong commissioner; Hedong field staff officer Li Yue was made Hedong revenue-farming observer acting commissioner and Northern Capital deputy regent.",
    idiomatic: "On guisi Li Yue acted for Hedong when Prince Zhen was named.",
  },
  s0406: {
    literal: "On jiawu the Hedong army-supervisor seal was first cast.",
    idiomatic: "On jiawu Hedong's army-supervisor seal was first cast.",
  },
  s0407: {
    literal: "Army supervisors having seals began with Wang Dingyuan.",
    idiomatic: "Army-supervisor seals began with Wang Dingyuan.",
  },
  s0408: {
    literal: "Sixth month: Heyang presented a white crow.",
    idiomatic: "Sixth month: Heyang sent a white crow.",
  },
  s0409: {
    literal: "On jiachen Jin-Ci-Long observer Cui Hanheng died.",
    idiomatic: "On jiachen Cui Hanheng died.",
  },
  s0410: {
    literal: "On guichou Jiang prefect Yao Qiwei was made Jin-Ci-Long overall defense observer.",
    idiomatic: "On guichou Yao Qiwei took Jin-Ci-Long.",
  },
  s0411: {
    literal: "Seventh month, bingyin new moon: Right Remonstrating Censor Yang Cheng was made Court of the Heir Apparent Vice Director.",
    idiomatic: "Seventh month: Yang Cheng entered the heir's court.",
  },
  s0412: {
    literal: "Hedong army supervisor Wang Dingyuan was exiled to Yazhou for unauthorized killing.",
    idiomatic: "Wang Dingyuan was banished for murder in Hedong.",
  },
  s0413: {
    literal: "On xinmao Jiangxi observer, Hong prefect Qi Ying died.",
    idiomatic: "On xinmao Qi Ying died.",
  },
  s0414: {
    literal: "Eighth month, xinhai: Grand Mentor concurrent Palace Attendant, Prince of Beiping Ma Sui died — posthumously Grand Tutor.",
    idiomatic: "Eighth month: Ma Sui died; he was posthumously Grand Tutor.",
  },
  s0415: {
    literal: "On bingchen Chu prefect Lu Huan was made Hong prefect and Jiangxi observer.",
    idiomatic: "On bingchen Lu Huan took Jiangxi.",
  },
  s0416: {
    literal: "Intercalary month, jichou: Court of the Heir Apparent Vice Director Pei Cheng submitted eleven rolls of \"Imperial Carriage Monthly Ordinances\" and twelve rolls of \"Ritual Canon.\"",
    idiomatic: "Intercalary month: Pei Cheng presented ritual compendiums.",
  },
  s0417: {
    literal: "Ninth month, jimao: chancellors and the two departments' supply officials were feasted at Qujiang; a six-rhyme poem was bestowed.",
    idiomatic: "Ninth month: Qujiang feast with imperial verse for the chancellors.",
  },
  s0418: {
    literal: "On dingsi Wei Gao was made overall commissioner pacifying nearby barbarians, the western hills' eight realms, and Yunnan.",
    idiomatic: "On dingsi Wei Gao's western pacification titles expanded.",
  },
  s0419: {
    literal: "Cangzhou great general Cheng Huaixin expelled his commander Cheng Huaizhi.",
    idiomatic: "Cheng Huaixin drove out Cheng Huaizhi at Cang.",
  },
  s0420: {
    literal: "Tenth month, winter, dingchou: Prince of Qian Liang was made Heng-hai army commissioner; army commander Cheng Huaixin was made acting commissioner.",
    idiomatic: "Tenth month: Cheng Huaixin took Heng-hai.",
  },
  s0421: {
    literal: "Eleventh month, bingchen: winter solstice — court congratulations not received because of Grand Tutor Ma Sui's funeral.",
    idiomatic: "Eleventh month: solstice rites were omitted for Ma Sui's funeral.",
  },
  s0422: {
    literal: "On xinchou the Court of Imperial Sacrifices fixed Ma Sui's posthumous title as \"Jingwu\"; the Emperor said: \"Jing was Taizu's posthumous title — change to Zhuangwu.\"",
    idiomatic: "On xinchou Ma Sui's posthumous title was changed from Jingwu to Zhuangwu.",
  },
  s0423: {
    literal: "On jiyou Tan prefecture presented a red crow.",
    idiomatic: "On jiyou Tanzhou sent a red crow.",
  },
  s0424: {
    literal: "Twelfth month, wuchen: the Emperor hunted in the park; many were killed; he stopped at the three-drive rite, comforted the soldiers, and returned.",
    idiomatic: "Twelfth month: a curtailed park hunt honored the troops.",
  },
  s0425: {
    literal: "Twelfth year, first month, jiawu new moon.",
    idiomatic: "Year 12, first month, jiawu new moon.",
  },
  s0426: {
    literal: "On gengzi Yuan Yi and Li Wentong led five thousand Ming troops and fifty thousand households east to Tian Xu.",
    idiomatic: "On gengzi Yuan Yi and Li Wentong fled Ming for Tian Xu.",
  },
  s0427: {
    literal: "On renzi former Cang commissioner Cheng Huaizhi was made Left Dragon Martial commander-in-chief.",
    idiomatic: "On renzi Cheng Huaizhi entered the capital guard.",
  },
  s0428: {
    literal: "On yichou Chengde commissioner, acting Grand Mentor, concurrent Palace Attendant Hun Zhen was made concurrent Secretariat Director;",
    idiomatic: "On yichou Hun Zhen and several frontier lords gained chancellor titles;",
  },
  s0429: {
    literal: "Xingyuan commissioner Yan Zhen, Weibo Tian Xu, and Sword-South West Wei Gao were all made acting Left and Right Vice Directors and Associate Directors.",
    idiomatic: "Yan Zhen, Tian Xu, and Wei Gao joined them as acting chancellors.",
  },
  s0430: {
    literal: "Then regional commanders all reported advanced concurrent posts.",
    idiomatic: "Regional strongmen thereafter piled on honorary chancellor ranks.",
  },
  s0431: {
    literal: "The Emperor composed five hundred eighty-six recipes of \"Zhenyuan Broad Benefit Medicinals\" and distributed them under Heaven.",
    idiomatic: "He issued five hundred eighty-six imperial medical formulas empire-wide.",
  },
  s0432: {
    literal: "Third month, guisi.",
    idiomatic: "Third month, guisi day.",
  },
  s0433: {
    literal: "On jiawu Wei Gao memorialized receiving the surrender of seven thousand barbarian households and fifty-five gold-letter commission documents Tibet had granted.",
    idiomatic: "On jiawu Wei Gao reported seven thousand submits and Tibetan commissions.",
  },
  s0434: {
    literal: "On yisi Revenue Vice Minister Pei Yanling was made Revenue Minister.",
    idiomatic: "On yisi Pei Yanling became Revenue minister.",
  },
  s0435: {
    literal: "On wushen War Minister Dong Jin was made Eastern Capital regent, judge of Eastern Capital Secretariat, and Ji-Ru overall defense commissioner.",
    idiomatic: "On wushen Dong Jin became eastern regent.",
  },
  s0436: {
    literal: "Fourth month, renxu new moon.",
    idiomatic: "The fourth month opened on renxu.",
  },
  s0437: {
    literal: "On wuchen the Left and Right Ten Armies memorialized: last winter when the carriage visited the camps they wished to erect a stele outside the Yintai pavilion gate to record the sage's trace — approved.",
    idiomatic: "On wuchen army steles at Yintai were authorized.",
  },
  s0438: {
    literal: "Approved.",
    idiomatic: "The request was approved.",
  },
  s0439: {
    literal: "On gengwu Wei Bo commissioner, revenue-farming observer, acting Left Vice Director, Associate Director, Wei prefect senior administrator, imperial son-in-law, Prince of Yanmen Tian Xu died.",
    idiomatic: "On gengwu Tian Xu of Weibo died.",
  },
  s0440: {
    literal: "On gengchen the Emperor's birthday — he ordered monks, Daoists, and literati officials to debate the three teachings; the Emperor was greatly pleased.",
    idiomatic: "On gengchen his birthday debate of the three teachings pleased him.",
  },
  s0441: {
    literal: "Fifth month, xinmao new moon.",
    idiomatic: "The fifth month opened on xinmao.",
  },
  s0442: {
    literal: "On bingshen Binning commissioner Zhang Xianfu died.",
    idiomatic: "On bingshen Zhang Xianfu died.",
  },
  s0443: {
    literal: "On jiachen Binning Chief Commandant Yang Chaocheng was made Bin prefect and Binning-Qing commissioner.",
    idiomatic: "On jiachen Yang Chaocheng succeeded at Binning.",
  },
  s0444: {
    literal: "Yin-Xia commissioner Han Tan yielded the newly appointed Minister of Rites post, begging to clear Cui Ning's name — the family was permitted to bury him.",
    idiomatic: "Han Tan gave up Rites to clear Cui Ning for burial.",
  },
  s0445: {
    literal: "On dingsi imperial sons-in-law Guo Ai, Wang Shiping, and Ai's brothers Xu and Xuan, for feasting on Daizong's death anniversary, were demoted and sent to their residences.",
    idiomatic: "On dingsi princesses' husbands were punished for feast on Daizong's death day.",
  },
  s0446: {
    literal: "Sixth month, renxu: former Huan prefecture clerk Dou Can — his family was permitted to bury him.",
    idiomatic: "Sixth month: Dou Can's family might bury him.",
  },
  s0447: {
    literal: "On yichou Left and Right Protecting Army Central Attendant Supervisors and Central Protecting Army Supervisors were first established — to be granted to eunuchs.",
    idiomatic: "On yichou eunuch army-supervisor posts were created.",
  },
  s0448: {
    literal: "Left and Right Divine Strategy army commanders Dou Wenchang and Huo Xianming were made Left and Right Divine Strategy Protecting Army Central Attendant Supervisors; Left and Right Divine Awe army commanders Zhang Shangjin and Jiao Xiwang were made Left and Right Divine Awe Central Protecting Army Supervisors.",
    idiomatic: "Dou Wenchang, Huo Xianming, Zhang Shangjin, and Jiao Xiwang took the new eunuch commands.",
  },
  s0449: {
    literal: "On xinsi Xuan-She observer, Xuan prefect Liu Zan died.",
    idiomatic: "On xinsi Liu Zan died.",
  },
  s0450: {
    literal: "Seventh month, yiwei: Eastern Capital regent, War Minister Dong Jin was made acting Left Vice Director, Associate Director, Bian prefect, Xuanwu commissioner, and Song-Bian-Ying observer.",
    idiomatic: "Seventh month: Dong Jin was sent to quiet Bian after Wanrong's chaos.",
  },
  s0451: {
    literal: "At the time Li Wanrong was ill; Wanrong's son then self-appointed as army commander; the troops again expelled him — Bian chaos; therefore Dong Jin was ordered to command it.",
    idiomatic: "Li Wanrong's son had worsened the Bian mutiny, forcing Dong Jin's appointment.",
  },
  s0452: {
    literal: "Crown Prince Guest Li Chong was made Eastern Capital regent, judge of Eastern Capital Secretariat, and Ji-Ru overall defense commissioner.",
    idiomatic: "Li Chong became Luoyang regent when Dong Jin went to Bian.",
  },
  s0453: {
    literal: "That day Xuanwu commissioner Li Wanrong died.",
    idiomatic: "That day Li Wanrong died.",
  },
  s0454: {
    literal: "Eighth month, xinwei new moon: there was an eclipse of the sun.",
    idiomatic: "Eighth month: solar eclipse.",
  },
  s0455: {
    literal: "On jisi former Weibo deputy Tian Ji'an was made Wei senior administrator and Weibo observer.",
    idiomatic: "On jisi Tian Ji'an inherited Weibo.",
  },
  s0456: {
    literal: "On gengwu Wangxian Gate was enlarged; the flanking city, Ten Princes' Residence, and Six Princes' Residence were expanded.",
    idiomatic: "On gengwu Wangxian Gate and princely quarters were enlarged.",
  },
  s0457: {
    literal: "On guiyou Guo prefect Cui Yan was made Xuan-She-Chi observer; Qiran's son Tang Zhongyi was made Return-to-Righteousness general.",
    idiomatic: "On guiyou Cui Yan and Tang Zhongyi received posts.",
  },
  s0458: {
    literal: "On bingzi Ru prefect Lu Changyuan was made Xuanwu field staff officer.",
    idiomatic: "On bingzi Lu Changyuan became Xuanwu staff officer.",
  },
  s0459: {
    literal: "On bingxu Chancellery Vice Director, Associate Director Zhao Jing died.",
    idiomatic: "On bingxu Zhao Jing died.",
  },
  s0460: {
    literal: "Ninth month, jiawu: Hedong field staff officer Li Jinglue was made Feng prefect and Tiande army Feng western surrender city overall defense commissioner.",
    idiomatic: "Ninth month: Li Jinglue took Tiande at Feng.",
  },
  s0461: {
    literal: "On bingwu Revenue Minister and revenue judge Pei Yanling died.",
    idiomatic: "On bingwu Pei Yanling died.",
  },
  s0462: {
    literal: "On gengxu the Emperor visited Yuzao Palace and the same day returned within.",
    idiomatic: "On gengxu he visited Yuzao Palace briefly.",
  },
  s0463: {
    literal: "On renzi Tibet raided Qing prefecture.",
    idiomatic: "On renzi Tibet raided Qingzhou.",
  },
  s0464: {
    literal: "Tenth month, winter, renxu, edict: because of capital-region drought, land tax was remitted.",
    idiomatic: "Tenth month: drought brought capital tax relief.",
  },
  s0465: {
    literal: "On jiaxu Remonstrating Censor Cui Sun and Drafting Attendant Zhao Zongru were both made Associate Directors — both bestowed gold-purple.",
    idiomatic: "On jiaxu Cui Sun and Zhao Zongru entered the chancellery.",
  },
  s0466: {
    literal: "Court of the Imperial Regalia Director Cui Mu was made Jin prefect and Jin-Ci-Long observer.",
    idiomatic: "Cui Mu took Jin-Ci-Long.",
  },
  s0467: {
    literal: "Eleventh month, xinmao: Zhaoyi's Wang Qianxiu composed \"Birth-of-the-Sage Music\" and presented it.",
    idiomatic: "Eleventh month: Wang Qianxiu presented celebratory music.",
  },
  s0468: {
    literal: "Twelfth month, jiwei: snow level two chi; bamboo and cypress mostly died.",
    idiomatic: "Twelfth month: deep snow killed bamboo and cypress.",
  },
  s0469: {
    literal: "The Huan kingdom's presented rhinoceros, greatly cherished — that winter it also died.",
    idiomatic: "The treasured rhinoceros died that winter.",
  },
  s0470: {
    literal: "The Emperor composed one \"Admonition on Punishments and Government.\"",
    idiomatic: "He wrote an \"Admonition on Punishments and Government.\"",
  },
  s0471: {
    literal: "On guimao Uighur, Nanzhao, and Sword-South western hills Woman Realm queen all came to congratulate.",
    idiomatic: "On guimao Uighur, Nanzhao, and western queens attended court.",
  },
  s0472: {
    literal: "Thirteenth year, first month, wuzi new moon.",
    idiomatic: "Year 13, first month, wuzi new moon.",
  },
  s0473: {
    literal: "On gengyin retired Crown Prince Junior Tutor Guan Bo died.",
    idiomatic: "On gengyin Guan Bo died.",
  },
  s0474: {
    literal: "On renyin the Tibetan qaghan sent envoys seeking good relations; the frontier reported — the Emperor, because the dog barbarians had broken faith, did not receive the envoys.",
    idiomatic: "On renyin Tibetan peace envoys were refused.",
  },
  s0475: {
    literal: "The Eastern Capital Secretariat burned.",
    idiomatic: "Luoyang's Secretariat caught fire.",
  },
  s0476: {
    literal: "Second month, dingsi: chancellors and the two departments' supply officials were feasted at Qujiang.",
    idiomatic: "Second month: Qujiang chancellors' feast.",
  },
  s0477: {
    literal: "On yihai Revenue Bureau director Su Bian was made Revenue Vice Minister and revenue judge; War Bureau director Wang Shao judged Revenue.",
    idiomatic: "On yihai Su Bian and Wang Shao took revenue posts.",
  },
  s0478: {
    literal: "Third month, wuzi: Huiching Pavilion was built before Linde Hall.",
    idiomatic: "Third month: Huiching Pavilion rose before Linde.",
  },
  s0479: {
    literal: "On yisi Fujian united training commissioner Li Ruochu was made Ming prefect and Zhedong observer; Wu prefect Liu Mian was made Fujian observer.",
    idiomatic: "On yisi Li Ruochu and Liu Mian swapped Zhe and Fujian.",
  },
  s0480: {
    literal: "Fourth month, summer, renxu: the Emperor visited Xingqing Palace Dragon Hall to pray for rain.",
    idiomatic: "Fourth month: rain prayer at Xingqing.",
  },
  s0481: {
    literal: "On yichou great snow.",
    idiomatic: "On yichou heavy snow.",
  },
  s0482: {
    literal: "On gengwu Yicheng commissioner, Zheng-Hua observer and farming, acting Left Vice Director, Hua prefect Li Fu died.",
    idiomatic: "On gengwu Li Fu died.",
  },
  s0483: {
    literal: "On jimao Grand Court Judge Yu Di was made Shaan senior administrator and Shaan-Guo observer.",
    idiomatic: "On jimao Yu Di took Shaan-Guo.",
  },
  s0484: {
    literal: "On gengchen Shaan-Guo overall defense observer and transport commissioner Yao Nanzhong was made Hua prefect, Yicheng commissioner, and Zheng-Hua observer.",
    idiomatic: "On gengchen Yao Nanzhong took Yicheng at Hua.",
  },
  s0485: {
    literal: "Fifth month, bingxu new moon: Wei Gao recovered Xi prefecture and sent a map upward.",
    idiomatic: "Fifth month: Wei Gao recovered Xi and sent a map.",
  },
  s0486: {
    literal: "On renzi Treasury Bureau director, Hanlin Academician Zheng Yuqing was made War Vice Minister and knowing Personnel selection.",
    idiomatic: "On renzi Zheng Yuqing took War and Personnel selection.",
  },
  s0487: {
    literal: "Sixth month, jimao new moon: Heng prefect Chen Yun was made Yong pacification commissioner.",
    idiomatic: "Sixth month: Chen Yun took Yong pacification.",
  },
  s0488: {
    literal: "On xinsi Longshou canal water was led from Tonghua Gate to before the Supreme Ultimate Palace.",
    idiomatic: "On xinsi Longshou canal reached the Supreme Ultimate Palace.",
  },
  s0489: {
    literal: "On renwu Wei Gao memorialized breaking Tibet at Xi prefecture — captive great-nest officer and people, horses, tools beyond counting.",
    idiomatic: "On renwu Wei Gao reported a great Xi victory over Tibet.",
  },
  s0490: {
    literal: "Seventh month, bingxu: Chancellor Lu Mai requested leave for many months; four memorials avoided the chancellorship — that day chancellors were ordered to inquire after illness at Lu Mai's private residence.",
    idiomatic: "Seventh month: the court visited the ailing Lu Mai.",
  },
  s0491: {
    literal: "On jichou Right Divine Strategy Central Attendant Supervisor Huo Xianming was ill — ten horses bestowed, ordered to feed monks at various temples.",
    idiomatic: "On jichou the ill Huo Xianming received horses and temple prayers.",
  },
  s0492: {
    literal: "On renchen lake canals and Yuzao Pool were dredged five chi deep.",
    idiomatic: "On renchen lakes and Yuzao Pool were dredged.",
  },
  s0493: {
    literal: "On yiwei earthquake.",
    idiomatic: "On yiwei an earthquake.",
  },
  s0494: {
    literal: "On jiawu War Bureau director, judging Revenue Wang Shao was made Revenue Vice Minister.",
    idiomatic: "On jiawu Wang Shao became Revenue vice minister.",
  },
  s0495: {
    literal: "On yichou an edict: henceforth when enfeoffed imperial sons die and are buried, the relevant office shall supply funeral escort — permanently as precedent.",
    idiomatic: "On yichou enfeoffed princes' funerals were granted full escort.",
  },
  s0496: {
    literal: "Eighth month, dingsi, edict: Capital Intendant Han Gao should repair Kunming Pool's Shitan and Helan two weirs and the lake canals.",
    idiomatic: "Eighth month: Han Gao was ordered to repair Kunming Pool and canals.",
  },
  s0497: {
    literal: "On renwu Rong pacification commissioner Fang Rufu died.",
    idiomatic: "On renwu Fang Rufu died.",
  },
  s0498: {
    literal: "Ninth month, jichou: Lu Mai earnestly yielded the chancellorship — he was made Crown Prince Guest.",
    idiomatic: "Ninth month: Lu Mai left the chancellery for the heir's court.",
  },
  s0499: {
    literal: "On xinmao Double Ninth day: chancellors and the hundred officials were banqueted at Qujiang; the Emperor composed poetry and bestowed it.",
    idiomatic: "On xinmao the Double Ninth Qujiang banquet returned with imperial verse.",
  },
  s0500: {
    literal: "On jiwei Jiangxi observer Lu Huan died.",
    idiomatic: "On jiwei Lu Huan died.",
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
