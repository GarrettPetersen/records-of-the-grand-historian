#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1;
const END = 100;

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
  s0001: {
    literal: "Emperor Muzong, posthumous title Ruisheng Wenhuixiao, taboo name Heng, was Xianzong's third son; his mother was Empress Dowager Guo of Yi'an.",
    idiomatic: "Muzong—taboo Heng—was Xianzong's third son, born of Empress Dowager Guo.",
  },
  s0002: {
    literal: "In the seventh month of Zhenyuan 11 he was born in a side hall of Daming Palace.",
    idiomatic: "He was born at Daming Palace in Zhenyuan 11's seventh month.",
  },
  s0003: {
    literal: "His first name was You; in the eighth month of Yuanhe 1 he was advanced to Prince of Suí.",
    idiomatic: "First named You, he became Prince of Suí in Yuanhe 1.",
  },
  s0004: {
    literal: "In the third month of year 5 he served as Zhangyi army military commissioner.",
    idiomatic: "In Yuanhe 5's third month he took the Zhangyi command.",
  },
  s0005: {
    literal: "In the tenth month of year 7 he was installed as crown prince and received his present taboo name.",
    idiomatic: "In Yuanhe 7's tenth month he was made heir and renamed Heng.",
  },
  s0006: {
    literal: "In the first month of Yuanhe 15, on gengzi, Xianzong died.",
    idiomatic: "On gengzi in Yuanhe 15's first month Xianzong died.",
  },
  s0007: {
    literal: "On bingwu he took the throne in the eastern wing of Taiji Hall.",
    idiomatic: "On bingwu he ascended at Taiji Hall's east wing.",
  },
  s0008: {
    literal: "That day he summoned Hanlin academicians Duan Wenchang, Du Yuanying, Shen Chuanshi, and Li Zhao, and readers Xue Fang and Ding Gongzhu, to audience at Sizheng Hall, all granted gold-purple.",
    idiomatic: "That day he called six scholars to Sizheng Hall and gave them gold-purple.",
  },
  s0009: {
    literal: "On dingwei he assembled the ministers in ranks outside Yuehua Gate.",
    idiomatic: "On dingwei the court lined up outside Yuehua Gate.",
  },
  s0010: {
    literal: "Vice premier Huangfu Bo was demoted to clerk of Yazhou.",
    idiomatic: "Huangfu Bo was banished to Yazhou as a clerk.",
  },
  s0011: {
    literal: "On wushen the Emperor received the chief ministers outside Zichen Gate.",
    idiomatic: "On wushen Muzong met his premiers at Zichen Gate.",
  },
  s0012: {
    literal: "On xinhai Xiao Mian, Court Gentleman for Discussion, acting Vice Censor-in-Chief, Flying Cavalry Captain, heir to Duke of Xu, granted scarlet fish bag, was made Grand Master for Splendid Happiness, acting Secretariat Director;",
    idiomatic: "On xinhai Xiao Mian was made acting Secretariat director;",
  },
  s0013: {
    literal: "Duan Wenchang, Secretariat drafter, Hanlin academician, Martial Cavalry Captain, granted purple-gold fish, was made Vice Director of the Secretariat and Grand Councillor.",
    idiomatic: "and Duan Wenchang became vice premier.",
  },
  s0014: {
    literal: "The Emperor first held court at Yanying to face the chief ministers.",
    idiomatic: "Muzong began regular audiences at Yanying.",
  },
  s0015: {
    literal: "An edict said: \"The mountain man Liu Bi lightly harbored heterodox ways.",
    idiomatic: "An edict condemned Liu Bi:",
  },
  s0016: {
    literal: "He deluded the late emperor.",
    idiomatic: "\"He had deluded Xianzong.",
  },
  s0017: {
    literal: "He stubbornly sought to shepherd the people, prized casting doubt on the multitude, knew himself false, yet fled again.",
    idiomatic: "He posed as a people's savior while knowing his fraud, then fled again.",
  },
  s0018: {
    literal: "The monk Da Tong's medical formulas were unskilled; all his drug arts were false.",
    idiomatic: "The monk Da Tong's medicine was worthless.",
  },
  s0019: {
    literal: "Having drawn calamity, both were wicked.",
    idiomatic: "Both had brought disaster and were traitors.",
  },
  s0020: {
    literal: "The state has fixed punishments; gods and men alike should cast them out — deliver them to Jingzhao prefecture for beating to death.\"",
    idiomatic: "Let Jingzhao beat them to death.\" Thus ended the edict.",
  },
  s0021: {
    literal: "Gold Crow guard general Li Daogu was demoted to Sima of Xunzhou.",
    idiomatic: "Li Daogu was demoted to Xunzhou.",
  },
  s0022: {
    literal: "In Xianzong's last years he was keen on elixirs; Huangfu Bo and Li Daogu recommended the adept Liu Bi and monk Da Tong as Hanlin awaiting edicts.",
    idiomatic: "Late in his reign Xianzong took elixirs pushed by Huangfu Bo, Li Daogu, Liu Bi, and Da Tong.",
  },
  s0023: {
    literal: "Liu Bi refined an immortal pill for the Emperor at Taizhou; after the Emperor took it daily thirst and frenzy grew, and he suddenly abandoned the realm.",
    idiomatic: "Liu Bi's Taizhou elixir drove Xianzong to fevered thirst and sudden death.",
  },
  s0024: {
    literal: "On jiayin the second-rank heir to the state of Ji, Duke of Jie, Yuwen Zhongda, died; the offices buried and sacrificed by old precedent.",
    idiomatic: "On jiayin Yuwen Zhongda died and received state rites.",
  },
  s0025: {
    literal: "Supervising censor Li Deyu, Right Reminder Li Shen, and Rituals Bureau vice director Yu Jingxiu were all ordered to keep their posts and serve as Hanlin academicians.",
    idiomatic: "Li Deyu, Li Shen, and Yu Jingxiu joined the Hanlin.",
  },
  s0026: {
    literal: "On dingsi Li Fengji, military commissioner of eastern Sichuan, was made Yan prefect and Shannan East military commissioner;",
    idiomatic: "On dingsi Li Fengji took Shannan East;",
  },
  s0027: {
    literal: "Wang Ya, Vice Minister of Personnel, was made acting Minister of Rites and Zi prefect, eastern Sichuan military commissioner.",
    idiomatic: "and Wang Ya took eastern Sichuan.",
  },
  s0028: {
    literal: "On jiwei Heng Mountain was renamed Zhen Mountain, Heng prefecture came under Zhen prefecture, and Hengyang county of Ding prefecture became Quyang county.",
    idiomatic: "On jiwei taboo names and toponyms around Heng were revised.",
  },
  s0029: {
    literal: "The house of Prince Heng was renamed the house of Prince Zhi.",
    idiomatic: "Prince Heng's lineage was renamed for Zhi.",
  },
  s0030: {
    literal: "On bingyin Right Divine Strategy Grand General Zhang Weiqing was made Protector-General of the Xiongnu and Zhensheng military commissioner of Zhenwu.",
    idiomatic: "On bingyin Zhang Weiqing took Zhenwu.",
  },
  s0031: {
    literal: "On dingmao the Emperor and all ministers put off mourning and followed auspicious rites.",
    idiomatic: "On dingmao court mourning ended.",
  },
  s0032: {
    literal: "On wuchen the ministers first attended court at Xuanzheng yamen.",
    idiomatic: "On wuchen regular audiences resumed.",
  },
  s0033: {
    literal: "That night there was an earthquake.",
    idiomatic: "That night the earth shook.",
  },
  s0034: {
    literal: "On gengwu the late emperor's honored consort Guo was installed as empress dowager.",
    idiomatic: "On gengwu Guo became empress dowager.",
  },
  s0035: {
    literal: "Remonstrance official Li Jingjian was demoted to prefect of Jianzhou.",
    idiomatic: "Li Jingjian was sent to Jianzhou.",
  },
  s0036: {
    literal: "Second month, guiyou new moon.",
    idiomatic: "The second month opened on guiyou.",
  },
  s0037: {
    literal: "On dingchou he ascended Danfeng Tower and proclaimed a great amnesty for the realm.",
    idiomatic: "On dingchou Muzong proclaimed universal amnesty from Danfeng Tower.",
  },
  s0038: {
    literal: "When the proclamation ended, jesters and a hundred entertainments were arrayed inside Danfeng Gate; the Emperor watched freely.",
    idiomatic: "After the amnesty he watched jesters inside Danfeng Gate.",
  },
  s0039: {
    literal: "On dinghai he visited the Left Divine Strategy Army to watch wrestling and miscellaneous plays, stopping at sunset.",
    idiomatic: "On dinghai he spent the day at the Left Divine Strategy Army watching games.",
  },
  s0040: {
    literal: "On guisi the Yong circuit military commissioner was abolished; its prefectures and counties were placed under Yong prefecture.",
    idiomatic: "On guisi the Yong commissioner post was abolished.",
  },
  s0041: {
    literal: "On jiawu Gui observation commissioner Pei Xingli was made Protector of Annan and military commissioner of that circuit.",
    idiomatic: "On jiawu Pei Xingli took Annan.",
  },
  s0042: {
    literal: "On yiwei Grand Master of the Stud Du Shifang was made Gui prefect and Gui observation commissioner.",
    idiomatic: "On yiwei Du Shifang took Gui circuit.",
  },
  s0043: {
    literal: "On bingshen Prince Dan died.",
    idiomatic: "Prince Dan died on bingshen.",
  },
  s0044: {
    literal: "On dingyou.",
    idiomatic: "The annal records dingyou without further entry.",
  },
  s0045: {
    literal: "An order: Uighur envoys were to receive private audiences with thirteen regular officials; Tibet envoys with eight.",
    idiomatic: "Uighur and Tibet envoys were allotted fixed numbers of private audience partners.",
  },
  s0046: {
    literal: "On gengzi Crown Prince Mentor Lü Yuanying died.",
    idiomatic: "On gengzi Lü Yuanying died.",
  },
  s0047: {
    literal: "On xinchou Vice Minister of Revenue Yang Yuling was made Minister of Revenue.",
    idiomatic: "On xinchou Yang Yuling became revenue minister.",
  },
  s0048: {
    literal: "On renyin an edict: candidates for Worthy and Upright, Direct Remonstrance, and similar degrees were to be examined jointly at the Ministry of Personnel by Secretariat and Department chiefs of fourth rank and above.",
    idiomatic: "On renyin an edict required high ministers to co-examine special-degree candidates at Personnel.",
  },
  s0049: {
    literal: "Third month, guimao new moon — the empress dowager's father Guo Ai was posthumously made Grand Tutor; her mother, Grand Princess of Guo, was posthumously made Grand Princess of Qi.",
    idiomatic: "The third month opened with posthumous honors for the Guo clan.",
  },
  s0050: {
    literal: "On renzi lecture masters Wei Chuhou and Lu Sui were summoned to Taiye Pavilion to lecture on \"Guanju\" from the Book of Odes and the \"Hongfan\" chapter of the Documents.",
    idiomatic: "On renzi Wei Chuhou and Lu Sui lectured the heir on Odes and Documents.",
  },
  s0051: {
    literal: "When finished, both were granted scarlet fish bags.",
    idiomatic: "Both received scarlet fish bags.",
  },
  s0052: {
    literal: "Left and Right Army commissioners Ma Jintan, Liang Shouqian, Wei Hongjian, and others requested gate halberds — approved.",
    idiomatic: "The eunuch army commissioners received gate halberds.",
  },
  s0053: {
    literal: "Wei Guanzhi, crown prince mentor at eastern Luoyang, was made Henan intendant.",
    idiomatic: "Wei Guanzhi became Henan intendant.",
  },
  s0054: {
    literal: "On dingsi Vice Censor-in-Chief Cui Zhi memorialized: \"The Yuanhe 12 edict set Censorate thirds by the day of appointment, not counting months before reporting;",
    idiomatic: "On dingsi Cui Zhi asked to fix censor seniority by appointment date alone;",
  },
  s0055: {
    literal: "also per the ninth-month seventeenth-day edict of that year, beyond one month was not within the limit — standing order should follow the edict's sequence.",
    idiomatic: "arguing later rules conflicted with the Yuanhe 12 rule.",
  },
  s0056: {
    literal: "I see the later edict is inconvenient; from now on all censorial standing and duty shall follow the edict sequence, and the appointment day counts as the month.\"",
    idiomatic: "He asked that standing order follow original appointment order.\"",
  },
  s0057: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0058: {
    literal: "On wuwu Personnel Minister Zhao Zongru memorialized: \"We earlier received an edict that special-degree candidates released by the late reign should test with Secretariat and Department chiefs of fourth rank and above at the Ministry.",
    idiomatic: "On wuwu Zhao Zongru asked to cancel the joint special-degree examination;",
  },
  s0059: {
    literal: "I submit that special degrees were instituted for the ruler's personal presence; southern-examination testing is not old precedent.",
    idiomatic: "saying the emperor should examine them in person, not at Personnel.",
  },
  s0060: {
    literal: "Now grace is complete and government renewed; moreover the imperial tomb nears and public business presses — candidates to be questioned are not many.",
    idiomatic: "With the tomb approaching and few candidates ready,",
  },
  s0061: {
    literal: "We have discussed and fear it should be suspended.\"",
    idiomatic: "the joint exam should be halted.\"",
  },
  s0062: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0063: {
    literal: "Shen prefecture's annual tea tribute was abolished.",
    idiomatic: "Shenzhou's tea tribute ended.",
  },
  s0064: {
    literal: "On yichou the empress dowager's brother Guo Zhao, Minister of Agriculture, was made Minister of Justice while retaining Agriculture; Guo Cong, grand general of the Right Gold Crow Guard, was made acting Minister of Works.",
    idiomatic: "On yichou Guo Zhao and Guo Cong were promoted.",
  },
  s0065: {
    literal: "On dingmao crown prince mentor Meng Jian, retained at eastern Luoyang, was demoted to external Sima of Jizhou.",
    idiomatic: "On dingmao Meng Jian was banished to Jizhou.",
  },
  s0066: {
    literal: "On wuchen night a great wind and hail.",
    idiomatic: "That night wind and hail struck.",
  },
  s0067: {
    literal: "Summer, fourth month, renshen new moon.",
    idiomatic: "The fourth month opened on renshen.",
  },
  s0068: {
    literal: "On dingchou Prince Li died.",
    idiomatic: "Prince Li died on dingchou.",
  },
  s0069: {
    literal: "On yiyou the third-rank heir of the House of Zhou, Duke of Ye, Yang Zao, died.",
    idiomatic: "On yiyou Yang Zao died.",
  },
  s0070: {
    literal: "On dinghai an edict: \"The Palace Domestic Service now supervises 4,618 high-rank white-body eunuchs; apart from 1,696 with offices, the rest are destitute without dwellings — each should receive an extra half-share of clothing grain.\"",
    idiomatic: "On dinghai an edict increased grain for destitute palace eunuchs.",
  },
  s0071: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0072: {
    literal: "Fifth month, renyin new moon.",
    idiomatic: "The fifth month opened on renyin.",
  },
  s0073: {
    literal: "On guimao an edict: \"Because state revenue is insufficient, on all two-tax, salt-profit, wine monopoly, tea tax, Ministry vacancies, removal-fee, and miscellaneous circuit levies due to the capital or retained in prefectures, commissioners' salaries, and the like — beyond the old cushion fee per string, fifty cash are to be drawn;",
    idiomatic: "On guimao an edict levied fifty cash per string on major taxes and levies;",
  },
  s0074: {
    literal: "each circuit, office, and commissioner is to collect and account quarterly.",
    idiomatic: "with quarterly collection and accounting.",
  },
  s0075: {
    literal: "Circuit funds are to be sent by transport to Revenue for custody; when state use is somewhat ample, the old system returns.",
    idiomatic: "Funds went to Revenue until finances recovered.",
  },
  s0076: {
    literal: "Capital offices' salaries — civil officials already taxed for the National University cannot be taxed again;",
    idiomatic: "Civil salaries already tapped for the university were exempt;",
  },
  s0077: {
    literal: "military pay, being thin, is also outside the levy.\"",
    idiomatic: "military pay was exempt as well.\" Thus ended the edict.",
  },
  s0078: {
    literal: "On renzi an edict: \"For the thousand flavors offered in Jingling's spirit vault, fish and rich meat may cause foul vapors — the Imperial Pharmacy should substitute fragrant drugs for food.\"",
    idiomatic: "On renzi the court ordered fragrant substitutes for meat at Jingling.",
  },
  s0079: {
    literal: "On gengshen Xianzong was buried at Jingling.",
    idiomatic: "Xianzong entered Jingling tomb on gengshen.",
  },
  s0080: {
    literal: "Sixth month, xinwei new moon.",
    idiomatic: "The sixth month opened on xinwei.",
  },
  s0081: {
    literal: "On dingchou Han Hong, Grand Mentor and concurrent Grand Councillor, was made Hezhong intendant and He-Jin-Min-Ci military commissioner.",
    idiomatic: "On dingchou Han Hong took the Hezhong command.",
  },
  s0082: {
    literal: "Annan Protector Gui Zhongwu memorialized that rebel chief Yang Qing was executed and Annan prefecture recovered; on wuyin Li You, Gold Crow guard general, was made acting Left Regular Cavalry Attendant, concurrent Xia prefect, and Xia-Sui-Yin-You military commissioner, replacing Li Ting.",
    idiomatic: "Gui Zhongwu recovered Annan; on wuyin Li You replaced Li Ting on the northwest frontier.",
  },
  s0083: {
    literal: "Li Ting was made chief of Ling prefecture and Shuofang-Ling-Salt military commissioner.",
    idiomatic: "Li Ting took Shuofang.",
  },
  s0084: {
    literal: "Wang Zhongshu, Secretariat drafter, was made Hong prefect, Vice Censor-in-Chief, and Jiangxi observation commissioner.",
    idiomatic: "Wang Zhongshu took Jiangxi.",
  },
  s0085: {
    literal: "On jimao 83,560 strings of capital summer green-seed tax were remitted; Linghu Chu was ordered to pay the capital with surplus tomb silks at fair value in place of the remitted tax.",
    idiomatic: "On jimao the capital's summer seed tax was remitted via Linghu Chu's tomb surplus.",
  },
  s0086: {
    literal: "On gengchen Bin-Ning-Qing military commissioner Li Guangyan was given special advancement for building Salt prefecture.",
    idiomatic: "On gengchen Li Guangyan was promoted for fortifying Saltzhou.",
  },
  s0087: {
    literal: "Li Ao, Director of Merit in the Bureau of Personnel and History Office compiler, was made Lang prefect for friendship with Li Jingjian.",
    idiomatic: "Li Ao was exiled to Langzhou for siding with Li Jingjian.",
  },
  s0088: {
    literal: "On guiwei Laiwu county of Yan prefecture was merged into Qianfeng county.",
    idiomatic: "On guiwei Laiwu was abolished into Qianfeng.",
  },
  s0089: {
    literal: "On jichou Minister of Works Gui Deng died.",
    idiomatic: "On jichou Gui Deng died.",
  },
  s0090: {
    literal: "On renchen an edict: \"What emperors weight is the state's body; what they cut to is human feeling.",
    idiomatic: "On renchen Muzong revoked the fifty-cash levy:",
  },
  s0091: {
    literal: "If the body is secured, great harmony is reached;",
    idiomatic: "\"A ruler who keeps the state's body attains great harmony;",
  },
  s0092: {
    literal: "if feeling is lost, it is from small profit.",
    idiomatic: "but small profit betrays the people's feeling.",
  },
  s0093: {
    literal: "Moreover offices are set to seek order and salaries issued to demand achievement — instruction has its constants; how should it be reduced?",
    idiomatic: "Salaries reward service and must not be casually stripped.",
  },
  s0094: {
    literal: "Recently yearly outlays were measured and receipts few; outer officials' salaries were taxed per string.",
    idiomatic: "The new per-string tax on outer salaries troubled me.",
  },
  s0095: {
    literal: "I thought again and again and was never at ease.",
    idiomatic: "I could not accept it.",
  },
  s0096: {
    literal: "Now the year is abundant and arms rest — one should restrain oneself to suffice; how take from below for schemes?",
    idiomatic: "In a year of peace the throne should tighten its belt, not peel the provinces.",
  },
  s0097: {
    literal: "Facing the hall I carry shame.",
    idiomatic: "I am ashamed before the court.",
  },
  s0098: {
    literal: "This year's fifth-month edict drawing fifty cash per string, totaling 1,500,000 strings, is entirely to cease.\"",
    idiomatic: "Cancel the 1,500,000-string levy entirely.\" Thus ended the edict.",
  },
  s0099: {
    literal: "Still 375,000 strings from the inner treasury were issued to Revenue for use.",
    idiomatic: "Revenue also received 375,000 strings from the inner treasury.",
  },
  s0100: {
    literal: "Earlier, when Xianzong used troops, Huangfu Bo was raised to premier and harshly taxed the people — all blamed him, hence his banishment.",
    idiomatic: "The levy had echoed Huangfu Bo's hated exactions; popular anger forced its repeal.",
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
if (data.metadata.chapter !== '016') {
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
