#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.013, Dezong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

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
  s0301: {
    literal: "Seventh month, jiwei, edict: magistrates with four reviews as limit — those without replacement might go to five reviews.",
    idiomatic: "Seventh month: magistrates might serve five terms if unreplaced.",
  },
  s0302: {
    literal: "On gengzi Xin prefect Sun Gongqi was made Yong circuit pacification commissioner.",
    idiomatic: "On gengzi Sun Gongqi took Yong pacification.",
  },
  s0303: {
    literal: "By precedent chancellors held the brush and decided affairs — each man ten days then changed.",
    idiomatic: "Chancellors had rotated the drafting brush every ten days.",
  },
  s0304: {
    literal: "Now Jia Dan, Zhao Jing, Lu Zhi, and Lu Mai were all Associate Directors; when the hundred officials had business they yielded to one another and did not speak.",
    idiomatic: "Four chancellors now deferred to one another in silence.",
  },
  s0305: {
    literal: "It was first decreed a ten-day turn holding the brush; later decreed daily rotation.",
    idiomatic: "Brush duty shifted from ten-day to daily turns.",
  },
  s0306: {
    literal: "Sword-South western hills — Queen of the Woman State Tang Lizhi, King of Ge Geguo Wang Dongwuting, King of White Dog Luo Tuocong, King of Weak Water Dong Bihe, King of Bozu Wang Di Denggao, King of South Water Wang Zhi Shangxinang, and six other realm kings came themselves to offer tribute.",
    idiomatic: "Six western queens and kings presented tribute in person.",
  },
  s0307: {
    literal: "The six realms had first attached to Tibet; Wei Gao struck the western hills to attack Tibet, so the six barbarians submitted inward, each granted office rank and sent away.",
    idiomatic: "Wei Gao's campaign brought six tribes in from Tibet.",
  },
  s0308: {
    literal: "Eighth month, gengxu: Grand Preceptor, Secretariat Director, Prince of Xiping Li Sheng died — posthumously Grand Preceptor, court mourning five days.",
    idiomatic: "Eighth month: Li Sheng died; five days' mourning.",
  },
  s0309: {
    literal: "On jisi the Crown Prince's eldest son, Prince of Guangling Chun, received Lady Guo as consort.",
    idiomatic: "On jisi Crown Prince Chun married Lady Guo.",
  },
  s0310: {
    literal: "Ninth month, jimao: the Double Ninth banquet was canceled because of Grand Preceptor Sheng's mourning.",
    idiomatic: "Ninth month: Double Ninth feast canceled for Li Sheng's death.",
  },
  s0311: {
    literal: "Tenth month, winter, jiyou: Palace Attendant Ma Sui answered at Yanying.",
    idiomatic: "Tenth month: Ma Sui attended Yanying.",
  },
  s0312: {
    literal: "Sui had foot ailment; an edict ordered no bow; he walked prostrate on the ground; eunuchs were ordered to support him.",
    idiomatic: "Ma Sui, lame, was helped before the throne without bowing.",
  },
  s0313: {
    literal: "The Emperor only said to him: \"Before you came with Grand Preceptor Sheng; now you alone come.\"",
    idiomatic: "The Emperor wept that only Ma Sui remained of the old pair.",
  },
  s0314: {
    literal: "He sighed and wept.",
    idiomatic: "The Emperor broke into sighs and tears.",
  },
  s0315: {
    literal: "When Sui withdrew the Emperor saw him to the steps.",
    idiomatic: "He walked Ma Sui down the steps.",
  },
  s0316: {
    literal: "On guiyou the Huan kingdom presented a rhinoceros; the Emperor ordered it shown at the Imperial Ancestral Temple.",
    idiomatic: "On guiyou a rhinoceros tribute was displayed at the ancestral temple.",
  },
  s0317: {
    literal: "Eleventh month, yiyou: winter solstice; the Emperor personally sacrificed at the round mound.",
    idiomatic: "Eleventh month: solstice sacrifice at the round mound.",
  },
  s0318: {
    literal: "That day returning to the palace, at Danfeng Tower he decreed: \"I with slight virtue have received the great mandate, striving to refine the Way fifteen years.",
    idiomatic: "Returning from the mound he issued a solstice amnesty edict.",
  },
  s0319: {
    literal: "Dawn and dusk reverent, not daring ease; great and small affairs — none not reverently labored.",
    idiomatic: "He claimed fifteen years of unceasing labor.",
  },
  s0320: {
    literal: "The imperial numen cared, the altars aided; years' grain abundant; distant realms assembled; far and near at peace; inside and outside alike.",
    idiomatic: "He credited Heaven with harvest and peace.",
  },
  s0321: {
    literal: "Ever thinking of much blessing — truly bearing mysterious grace.",
    idiomatic: "He felt deep gratitude for divine favor.",
  },
  s0322: {
    literal: "Therefore reverently observing ritual statutes, personally offering at suburb and temple, able to display inward reverence, obtaining to report the threefold sincerity.",
    idiomatic: "The rites expressed his sincerity to Heaven and ancestors.",
  },
  s0323: {
    literal: "Joy and feeling ever deeper, fear and caution ever more urged — the great blessing bestowed cannot rest on me alone; I wish with the myriad regions to share its gracious favor; a great amnesty of the empire is permitted.",
    idiomatic: "He proclaimed a general amnesty to share the blessing.",
  },
  s0324: {
    literal: "On xinmao Hua Tong Pass Zhenguo army, Longyou commissioner Li Yuanliang died at Liangyuan; his officer Ashina Xu led Yuanliang's troops to garrison Liangyuan.",
    idiomatic: "On xinmao Li Yuanliang died; Ashina Xu held Liangyuan.",
  },
  s0325: {
    literal: "On renyin Henan Intendant, Eastern Capital regent Pei Zhu died.",
    idiomatic: "On renyin Pei Zhu died.",
  },
  s0326: {
    literal: "On jiachen an edict for winter recommendation officers: Ministers and bureau directors at the main hall should inquire into governance arts, test current-affairs memoranda, examine competence and prior review records, fix three grades, and list recommender names.",
    idiomatic: "On jiachen winter promotion exams were ordered at the main hall.",
  },
  s0327: {
    literal: "Still order one censor as supervising examiner.",
    idiomatic: "A censor supervised the tests.",
  },
  s0328: {
    literal: "If after appointment administrative ability fails, entrust the Censorate and observers to report — and grade the recommender.",
    idiomatic: "Sponsors would be graded on their nominees' performance.",
  },
  s0329: {
    literal: "Twelfth month, bingwu new moon, edict: \"Henceforth after commissioners' adjutants, deputies, and field staff below end service, if acting or trial fifth rank and above, they do not assemble at Personnel for selection — follow the precedent of ended-service bureau directors and censors: in winter report to court.\"",
    idiomatic: "Twelfth month: ended circuit staff reported in winter, not at Personnel.",
  },
  s0330: {
    literal: "On bingchen Xuanwu army mutinied and expelled commissioner Liu Shining.",
    idiomatic: "On bingchen Xuanwu troops drove out Liu Shining.",
  },
  s0331: {
    literal: "On renxu Prince of Tong Zhen was made Xuanwu commissioner; Xuanwu deputy Li Wanrong was made Bian prefect, Xuanwu commissioner, and Bian-Song acting commissioner.",
    idiomatic: "On renxu Li Wanrong replaced Liu Shining at Xuanwu.",
  },
  s0332: {
    literal: "Shuofang Ling-Salt deputy commissioner, Crown Prince Junior Tutor, acting Left Vice Director, Duke of Yuyao Du Xiquan died.",
    idiomatic: "Du Xiquan died on the Shuofang frontier.",
  },
  s0333: {
    literal: "Tenth year, first month, yihai new moon.",
    idiomatic: "Year 10, first month, yihai new moon.",
  },
  s0334: {
    literal: "On yiyou Prince of Qian Liang was made Shuofang Ling-Salt-Feng commissioner; Shuofang field staff officer Li Luan was made acting commissioner.",
    idiomatic: "On yiyou Li Luan acted for Shuofang.",
  },
  s0335: {
    literal: "On renchen Nanzhao Yimouxun greatly defeated Tibet at Shenchuan and sent envoys presenting victory.",
    idiomatic: "On renchen Nanzhao crushed Tibet and sent news.",
  },
  s0336: {
    literal: "On jihai Zhaoyi commissioner, acting Minister of Works, Associate Director Li Baozhen requested lowered rank — he was made acting Left Vice Director.",
    idiomatic: "On jihai Li Baozhen demoted himself to vice director.",
  },
  s0337: {
    literal: "At the time Baozhen was ill; shamans said he should lower his title — hence the request.",
    idiomatic: "Illness and omens prompted his demotion request.",
  },
  s0338: {
    literal: "Second month, bingwu: Ying prefect Liu Zun was made Qin prefect, Longyou pacification commander, administering Pu-run county, still naming the army Pu-run.",
    idiomatic: "Second month: Liu Zun took Longyou at Pu-run.",
  },
  s0339: {
    literal: "On yimao Drafting Attendant Qi Kang was made Henan Intendant.",
    idiomatic: "On yimao Qi Kang became Henan Intendant.",
  },
  s0340: {
    literal: "On yichou Yicheng commissioner, Zheng-Hua observer Li Rong died.",
    idiomatic: "On yichou Li Rong died.",
  },
  s0341: {
    literal: "On dingmao an edict: \"Between ruler and minister the meaning is nowhere heavier; whenever I hear of death my grief is deep.",
    idiomatic: "On dingmao an edict raised funeral grants for deceased officials.",
  },
  s0342: {
    literal: "For civil and military court officials who die, that month's salary and ration should be paid in full, and still one month's salary and ration at former rank as burial gift.\"",
    idiomatic: "Survivors received full month pay plus a burial month's stipend.",
  },
  s0343: {
    literal: "Third month, yihai: yellow fog filled the four quarters; the sun had no light.",
    idiomatic: "Third month: yellow fog darkened the sky.",
  },
  s0344: {
    literal: "Hua prefect Li Fu was made Hua prefect and Yicheng commissioner.",
    idiomatic: "Li Fu took Yicheng at Hua.",
  },
  s0345: {
    literal: "Cangzhou Cheng Huaizhi came to court; Anye Ward residence, one courtesan, was bestowed; he was ordered back to his command.",
    idiomatic: "Cheng Huaizhi was feasted, gifted, and sent back to Cang.",
  },
  s0346: {
    literal: "On gengchen Nanzhao Yimouxun attacked and recovered sixteen walled places east of Tibet's Iron Bridge, captured five kings, and reduced one hundred thousand of their people.",
    idiomatic: "On gengchen Nanzhao took sixteen forts east of the Iron Bridge.",
  },
  s0347: {
    literal: "On renshen Tong prefect Lu Zheng was made Hua prefect, Tong Pass defense, and Zhenguo army commander.",
    idiomatic: "On renshen Lu Zheng took Tong Pass and Zhenguo.",
  },
  s0348: {
    literal: "On xinchou Yan prefect Li Ruxian's tribal troops were granted the name Anse army; Ruxian was made army commander.",
    idiomatic: "On xinchou Li Ruxian's tribes became the Anse army.",
  },
  s0349: {
    literal: "Fourth month, summer, wuchen: earthquake; on guichou again.",
    idiomatic: "Fourth month: earthquakes on wuchen and guichou.",
  },
  s0350: {
    literal: "Heng prefecture memorialized giant footprints seen.",
    idiomatic: "Hengzhou reported giant footprints.",
  },
  s0351: {
    literal: "The Yunnan victory envoy Gao Xilong was made Left Martial Guard general.",
    idiomatic: "Gao Xilong of the Yunnan mission gained a guard post.",
  },
  s0352: {
    literal: "That month Venus appeared in daytime.",
    idiomatic: "That month Venus shone by day.",
  },
  s0353: {
    literal: "A great bird flew gathering in the palace, eating assorted bones.",
    idiomatic: "A great bird fed on bones within the palace.",
  },
  s0354: {
    literal: "That spring continuous rain — rarely a clear day.",
    idiomatic: "Spring brought endless rain.",
  },
  s0355: {
    literal: "Sixth month, renyin new moon.",
    idiomatic: "The sixth month opened on renyin.",
  },
  s0356: {
    literal: "Zhaoyi commissioner, acting Left Vice Director, Associate Director, Prince of Yiyang Li Baozhen died — an edict ordered his general Wang Yangu to act as Zhaoyi commander.",
    idiomatic: "Li Baozhen died; Wang Yangu acted for Zhaoyi.",
  },
  s0357: {
    literal: "On guichou Sacrifices Bureau director Yuan Zi was made concurrent Vice Censor-in-Chief and envoy to enfeoff Nanzhao.",
    idiomatic: "On guichou Yuan Zi was sent to enfeoff Nanzhao.",
  },
  s0358: {
    literal: "On jiayin Chen prefect Fang Rufu was made Rong circuit pacification commissioner.",
    idiomatic: "On jiayin Fang Rufu took Rong pacification.",
  },
  s0359: {
    literal: "On bingyin Wei Gao memorialized breaking Tibetan walls at western Ehe city — beheaded two thousand eight hundred.",
    idiomatic: "On bingyin Wei Gao reported 2,800 heads at Ehe.",
  },
  s0360: {
    literal: "On gengwu Revenue commissioner Pei Yanling was made concurrent Ling-Salt and other salt ponds and wells monopoly commissioner.",
    idiomatic: "On gengwu Pei Yanling took frontier salt monopoly.",
  },
  s0361: {
    literal: "Last day of the month, xinwei: water birds gathered at the Left Treasury; that night violent rain and great wind broke trees.",
    idiomatic: "Month's end: birds at the treasury, then storm.",
  },
  s0362: {
    literal: "Seventh month, renshen new moon: Prince of Yong Zhen was made Zhaoyi commissioner; Zhaoyi escort officer Wang Yangu was made Lu prefect left staff officer, acting Zhaoyi commissioner, bestowed name Qianxiu.",
    idiomatic: "Seventh month: Prince Zhen took Zhaoyi; Wang Yangu was renamed Qianxiu as acting chief.",
  },
  s0363: {
    literal: "Baozhen's separate general acting Ming prefect Yuan Yi disliked Qianxiu as acting commissioner, held Ming and rebelled, secretly joining Tian Xu.",
    idiomatic: "Yuan Yi rebelled at Ming, rejecting Qianxiu and allying with Tian Xu.",
  },
  s0364: {
    literal: "On gengchen Nanzhao Yimouxun was bestowed a gold seal with silver socket; the inscription read \"Zhenyuan Enfeoffment Nanzhao Seal.\"",
    idiomatic: "On gengchen Nanzhao received the \"Zhenyuan Enfeoffment Nanzhao\" seal.",
  },
  s0365: {
    literal: "Previously Tibet had granted Nanzhao a gold seal; Wei Gao used that precedent to request it.",
    idiomatic: "Wei Gao replaced Tibet's seal with the court's.",
  },
  s0366: {
    literal: "Bianzhou troops mutinied, attacked acting commissioner Li Wanrong, did not win and dispersed; Wanrong captured and executed all their families.",
    idiomatic: "Bian mutineers failed; Wanrong slaughtered their families.",
  },
  s0367: {
    literal: "On jihai former Bian commissioner Liu Shining was to be settled at Chen; Yin prefect Huang Shaoqing rebelled, attacked Yong pacification commissioner Sun Gongqi, and also took Qin, Heng, Xun, and Gui prefectures.",
    idiomatic: "On jihai Liu Shining was exiled to Chen; Huang Shaoqing ravaged the south.",
  },
  s0368: {
    literal: "Tibetan generals Lun Qiran, Yang Meizang, and Xinuo'lu led their households to submit inward — made Return-to-Righteousness generals.",
    idiomatic: "Three Tibetan generals defected with their households.",
  },
  s0369: {
    literal: "Therefore military posts below fourth rank were established to grant the four barbarians who submitted, and salaries were fixed from Huaihua Grand General downward.",
    idiomatic: "New posts and pay were set for barbarian defectors.",
  },
  s0370: {
    literal: "Ninth month, xinwei new moon: Yuan prefect Dong Zhen was made Yong pacification commissioner.",
    idiomatic: "Ninth month: Dong Zhen took Yong pacification.",
  },
  s0371: {
    literal: "On wuzi the hundred officials received the Double Ninth banquet; the Emperor composed poetry and bestowed it.",
    idiomatic: "On wuzi the Double Ninth banquet returned with imperial verse.",
  },
  s0372: {
    literal: "On xinmao.",
    idiomatic: "On xinmao Nanzhao's tribute arrived at court.",
  },
  s0373: {
    literal: "Nanzhao presented iron spears, wave-people swords, and eight Tibetan seals.",
    idiomatic: "Nanzhao sent arms and Tibetan seals.",
  },
  s0374: {
    literal: "On wuxu Ding prefect Zhang Shengyun changed his name to Maozhao.",
    idiomatic: "On wuxu Zhang Shengyun became Zhang Maozhao.",
  },
  s0375: {
    literal: "Tenth month, winter, guimao: at Xuanzheng Hall tested Worthy and Good, Direct Speech, and other candidates.",
    idiomatic: "Tenth month: civil-service candidates were examined at Xuanzheng.",
  },
  s0376: {
    literal: "On renxu Minister of Justice Liu Zi died.",
    idiomatic: "On renxu Liu Zi died.",
  },
  s0377: {
    literal: "Eleventh month, yiyou: salt-iron transport commissioner Zhang Pang was made Court Director; Zhexi observer Wang Wei was made salt-iron transport commissioner.",
    idiomatic: "Eleventh month: Wang Wei replaced Zhang Pang at transport.",
  },
  s0378: {
    literal: "On gengyin retired Secretariat Director Mu Ning died.",
    idiomatic: "On gengyin Mu Ning died.",
  },
  s0379: {
    literal: "Twelfth month, gengzi new moon.",
    idiomatic: "The twelfth month opened on gengzi.",
  },
  s0380: {
    literal: "On renxu Secretariat Vice Director, Associate Director Lu Zhi was demoted to Crown Prince Guest.",
    idiomatic: "On renxu Lu Zhi fell from the chancellery.",
  },
  s0381: {
    literal: "Eleventh year, first month, gengwu new moon.",
    idiomatic: "Year 11, first month, gengwu new moon.",
  },
  s0382: {
    literal: "On yihai Lingnan commissioner Xue Jue died.",
    idiomatic: "On yihai Xue Jue died.",
  },
  s0383: {
    literal: "On yiwei Secretariat Junior Director Wang Chu was made Qianzhong pacification observer; Court Director Junior Director Wu Shaoyi was made Yong pacification commissioner.",
    idiomatic: "On yiwei Wang Chu and Wu Shaoyi took Qianzhong and Yong.",
  },
  s0384: {
    literal: "On bingshen Yong pacification commissioner Wang Gao was made Guangzhou prefect and Lingnan commissioner.",
    idiomatic: "On bingshen Wang Gao took Lingnan.",
  },
  s0385: {
    literal: "Second month, guimao: Quzhou prefect Li Ruochu was made Fujian observer.",
    idiomatic: "Second month: Li Ruochu took Fujian.",
  },
  s0386: {
    literal: "On yisi Bohai Great Khan Qinmao's son Song was made Prince of Bohai and Governor of Hohan prefecture.",
    idiomatic: "On yisi Bohai's heir Song was enfeoffed.",
  },
  s0387: {
    literal: "On yimao at Jing prefecture Zhangxin Fort Pan yuan county was established.",
    idiomatic: "On yimao Pan yuan county was founded at Zhangxin Fort.",
  },
  s0388: {
    literal: "On jiazi the Nine Surnames' Uighur Kutlug Qaghan Chongcheng died.",
    idiomatic: "On jiazi the Uighur qaghan died.",
  },
  s0389: {
    literal: "Third month, gengwu: Grand Mentor concurrent Palace Attendant Ma Sui requested removal of Palace Attendant because of illness — not permitted.",
    idiomatic: "Third month: Ma Sui's resignation as attendant was refused.",
  },
  s0390: {
    literal: "On xinwei chancellors and the two departments' supply officials were feasted at Qujiang.",
    idiomatic: "On xinwei the chancellors banqueted at Qujiang.",
  },
  s0391: {
    literal: "On yichou Personnel Vice Minister Zheng Yu was made Henan and Huainan land-and-water transport commissioner.",
    idiomatic: "On yichou Zheng Yu took Henan-Huainan transport.",
  },
  s0392: {
    literal: "On bingshen nine recluses including Cai Guangcheng of hill and garden not seeking fame were recommended by all prefectures by precedent — each granted trial office, given public carriage, to be ranked by talent on reaching the capital.",
    idiomatic: "On bingshen nine hermits received trial posts and carriages to the capital.",
  },
  s0393: {
    literal: "Fourth month, summer: drought.",
    idiomatic: "Fourth month: drought.",
  },
  s0394: {
    literal: "On renxu Crown Prince Guest Lu Zhi was demoted to Zhongzhou registrar; Capital Intendant Li Chong to Xin senior administrator; Court Director Zhang Pang to Ting senior administrator.",
    idiomatic: "On renxu Lu Zhi, Li Chong, and Zhang Pang were exiled in Pei Yanling's purge.",
  },
  s0395: {
    literal: "On guihai War Vice Minister Han Gao was made Capital Intendant.",
    idiomatic: "On guihai Han Gao became capital intendant.",
  },
  s0396: {
    literal: "On jiazi Nanzhao was granted an imperial letter — for the first time the three Secretariat officials' \"received and promulgated\" line appeared, restoring old regulation.",
    idiomatic: "On jiazi Nanzhao's letter restored the three-drafter promulgation line.",
  },
  s0397: {
    literal: "On bingyin Youzhou Liu Ji memorialized great defeat of Xi king Zhuola and others — more than sixty thousand.",
    idiomatic: "On bingyin Liu Ji crushed the Xi.",
  },
  s0398: {
    literal: "Fifth month, dingmao new moon.",
    idiomatic: "The fifth month opened on dingmao.",
  },
  s0399: {
    literal: "On gengwu the relevant office reviewed prisoners — because of drought.",
    idiomatic: "On gengwu drought prompted a prison review.",
  },
  s0400: {
    literal: "On dingchou Xuanwu acting commissioner Li Wanrong was made Bian prefect, Xuanwu deputy, and knowing commissioner affairs.",
    idiomatic: "On dingchou Li Wanrong was confirmed at Xuanwu.",
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
