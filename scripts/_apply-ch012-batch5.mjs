#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.012, Dezong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
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
    literal: "On guisi Li Huai'guang's army reached Liquan; that night the rebels lifted the siege.",
    idiomatic: "On guisi Huai'guang reached Liquan and the rebels abandoned the siege.",
  },
  s0402: {
    literal: "Shence commander Li Sheng led troops from Dingzhou to the rescue and camped at Wei Bridge.",
    idiomatic: "Li Sheng marched from Dingzhou and camped at Wei Bridge.",
  },
  s0403: {
    literal: "On jiawu Shangzhou deputy commander Wang Xianhe was made acting Shangzhou defense commissioner.",
    idiomatic: "On jiawu Wang Xianhe became acting Shangzhou defender.",
  },
  s0404: {
    literal: "Twelfth month, renxu: Gate Department Vice Director Lu Qi was demoted to Xinzhou aide; camp marshal Bai Zhizhen to Enzhou aide; revenue judge Zhao Zan to Bozhou aide.",
    idiomatic: "Twelfth month: Lu Qi, Bai Zhizhen, and Zhao Zan were exiled.",
  },
  s0405: {
    literal: "On guihai Jingzhao Vice Prefect Pei Tian was made revenue judge.",
    idiomatic: "On guihai Pei Tian took over revenue.",
  },
  s0406: {
    literal: "On jiazi Hunan acting observer Zhao Jing was made Hunan observer.",
    idiomatic: "On jiazi Zhao Jing became Hunan observer.",
  },
  s0407: {
    literal: "On yichou Court of Sacrifices aide Lu Zhi was made Merit Evaluation Bureau director; Revenue Bureau aide Wu Tongwei Personnel Bureau director — both Hanlin academicians as before.",
    idiomatic: "On yichou Lu Zhi and Wu Tongwei gained bureau posts while keeping Hanlin posts.",
  },
  s0408: {
    literal: "Palace Aide Wu Tongxuan was made Recorder of the Left and Hanlin academician.",
    idiomatic: "Wu Tongxuan joined the Hanlin as recorder.",
  },
  s0409: {
    literal: "On jisi Hezhong prefect Li Qiyun was made Director of the Imperial Clan.",
    idiomatic: "On jisi Li Qiyun became director of the imperial clan.",
  },
  s0410: {
    literal: "On gengwu Li Xilie took Bianzhou.",
    idiomatic: "On gengwu Li Xilie seized Bianzhou.",
  },
  s0411: {
    literal: "Right Subaltern Cui Zong was made Jingzhao prefect.",
    idiomatic: "Cui Zong became Jingzhao prefect.",
  },
  s0412: {
    literal: "On guiyou Secretariat Vice Director Guan Bo was made Punishments Minister; Personnel Bureau Director Du Huangshang Drafting attendant.",
    idiomatic: "On guiyou Guan Bo and Du Huangshang changed posts.",
  },
  s0413: {
    literal: "Drafting attendant Kong Chaofu was ordered to reassure Zi-Qing; Huazhou prefect Dong Jin to reassure Hebei.",
    idiomatic: "Kong Chaofu and Dong Jin were sent to pacify the east.",
  },
  s0414: {
    literal: "Xingyuan 1 — first month, guiyou new moon: at the Fengtian traveling palace the emperor received New Year's congratulations. (The source repeats the reign year.)",
    idiomatic: "In the first month of Xingyuan, on guiyou, the court celebrated New Year at Fengtian.",
  },
  s0415: {
    literal: "An edict stated:",
    idiomatic: "An edict opened:",
  },
  s0416: {
    literal: "Senior courtiers were dispatched to announce reassurance in all circuits.",
    idiomatic: "Courtiers were sent to reassure the provinces.",
  },
  s0417: {
    literal: "Fengtian camp united training commissioner Yang Huiyuan was made acting Works Minister.",
    idiomatic: "Yang Huiyuan became acting works minister.",
  },
  s0418: {
    literal: "On bingxu Civil Offices Vice Minister Xiao Fu was made Gate Department Vice Director and associate; Civil Offices Vice Minister Lu Han War Vice Minister and associate.",
    idiomatic: "On bingxu Xiao Fu and Lu Han entered the chancellery.",
  },
  s0419: {
    literal: "On wuzi Chancellor Xiao Fu was ordered to reassure Shannan, Jingnan, Hunan, Jiangxi, E-Yue, Zhejiang East-West, Fujian, and other circuits.",
    idiomatic: "On wuzi Xiao Fu toured the southern and eastern circuits.",
  },
  s0420: {
    literal: "On jichou Jingzhao Prefect Pei Tian was made Households Vice Minister and revenue judge.",
    idiomatic: "On jichou Pei Tian became revenue judge.",
  },
  s0421: {
    literal: "On bingshen Shannan East staff officer Fan Ze was made Xiangzhou prefect and Shannan East commissioner.",
    idiomatic: "On bingshen Fan Ze became Shannan East commissioner.",
  },
  s0422: {
    literal: "Hun Jian was made camp marshal.",
    idiomatic: "Hun Jian became camp marshal.",
  },
  s0423: {
    literal: "Former Zhao observer Kang Rizhi was made concurrent Tongzhou prefect and Fengyi army commissioner.",
    idiomatic: "Kang Rizhi became Fengyi commissioner.",
  },
  s0424: {
    literal: "On xinchou an edict: each of the Six Armies was to have one army commander of second rank.",
    idiomatic: "On xinchou the Six Armies each gained a second-rank commander.",
  },
  s0425: {
    literal: "Left and Right Palace Attendants each gained one additional post.",
    idiomatic: "Palace attendant posts were increased.",
  },
  s0426: {
    literal: "Grand mentors to the heir gained four additional posts.",
    idiomatic: "Four more heir mentors were authorized.",
  },
  s0427: {
    literal: "Second month, wuyin: former Minister of Agriculture, Prince of Zhangye Duan Xiushi was posthumously made Grand Preceptor, styled Loyal and Stern, with five hundred households' fief.",
    idiomatic: "Second month: Duan Xiushi was posthumously honored.",
  },
  s0428: {
    literal: "Slipzhou officer Jia Yinlin was posthumously Left Vice Director; Slip prefect Li Cheng was made concurrent Bianzhou prefect and Bian-Slip commissioner.",
    idiomatic: "Jia Yinlin was honored; Li Cheng took Bian-Slip.",
  },
  s0429: {
    literal: "That day Li Sheng moved his army from Xianyang to East Wei Bridge to avoid Huai'guang.",
    idiomatic: "That day Li Sheng shifted east to avoid Huai'guang.",
  },
  s0430: {
    literal: "Sheng saw Huai'guang's rebellion plain and urged the emperor to go to Shu.",
    idiomatic: "Li Sheng urged flight to Shu once Huai'guang's treason was clear.",
  },
  s0431: {
    literal: "Wang Wujun submitted; he was made associate chancellor and Youzhou commissioner and ordered to attack Zhu Tao.",
    idiomatic: "Wang Wujun turned loyal and was sent against Zhu Tao.",
  },
  s0432: {
    literal: "Tibet sent envoys offering troops to help suppress rebellion; Censor-in-Chief Yu Yi was sent to announce the court's thanks.",
    idiomatic: "Tibet offered aid; Yu Yi was sent in reply.",
  },
  s0433: {
    literal: "On jiazi Li Huai'guang was made Grand Preceptor and given an iron tally forgiving three capital crimes.",
    idiomatic: "On jiazi Huai'guang received an iron tally and three pardons.",
  },
  s0434: {
    literal: "Huai'guang raged: \"When a minister rebels he is given an iron tally — giving one to Huai'guang means rebellion is certain!\"",
    idiomatic: "Huai'guang raged that an iron tally marked him a rebel.",
  },
  s0435: {
    literal: "He threw it to the ground.",
    idiomatic: "He threw the tally down.",
  },
  s0436: {
    literal: "The emperor ordered Hanlin academician Lu Zhi to explain.",
    idiomatic: "The emperor sent Lu Zhi to reassure him.",
  },
  s0437: {
    literal: "That day hearts were terrified.",
    idiomatic: "Panic spread through the court.",
  },
  s0438: {
    literal: "Huai'guang seized the troops of Yang Huiyuan and Li Jianhui; Huiyuan was killed.",
    idiomatic: "Huai'guang seized Yang Huiyuan's and Li Jianhui's troops and killed Huiyuan.",
  },
  s0439: {
    literal: "On dingmao the imperial carriage went to Liangzhou; Dai Xiuyan was left to guard Fengtian; Censor-in-Chief Qi Ying was made transit commissioner along the route.",
    idiomatic: "On dingmao the court fled to Liangzhou, leaving Dai Xiuyan at Fengtian.",
  },
  s0440: {
    literal: "Li Sheng gathered troops and supplies, taking recovery as his personal charge.",
    idiomatic: "Li Sheng massed forces to retake Chang'an.",
  },
  s0441: {
    literal: "Li Huai'guang resented it, moved to Jingyang, joined Zhu Ci, and wished to destroy Sheng together.",
    idiomatic: "Huai'guang allied with Zhu Ci to destroy Li Sheng.",
  },
  s0442: {
    literal: "Sheng wrote with humble courtesy, hoping to move him; Huai'guang grew somewhat ashamed and afraid.",
    idiomatic: "Li Sheng's courteous letters briefly shamed Huai'guang.",
  },
  s0443: {
    literal: "Third month, jiashen: Secretariat Director Cui Hanheng was made upper-capital commandant; Right Palace Attendant Yu Yi Jingzhao prefect.",
    idiomatic: "Third month: Cui Hanheng and Yu Yi took capital posts.",
  },
  s0444: {
    literal: "That day Huai'guang burned his camp and fled back to Hezhong.",
    idiomatic: "That day Huai'guang burned his camp and fled to Hezhong.",
  },
  s0445: {
    literal: "His officers Meng She, Duan Weiyong, and a thousand others defected to Li Sheng.",
    idiomatic: "A thousand of his officers defected to Li Sheng.",
  },
  s0446: {
    literal: "On bingxu former Raozhou prefect Du You was made Guangzhou prefect and Lingnan commissioner; Shence commissioner Li Sheng was made concurrent capital-region and Weinan-Bian-Fang-Dan-Yan observer.",
    idiomatic: "On bingxu Du You went south; Li Sheng gained the capital region.",
  },
  s0447: {
    literal: "On gengyin the imperial carriage paused at Chenggu.",
    idiomatic: "On gengyin the court halted at Chenggu.",
  },
  s0448: {
    literal: "Princess Tang'an died — the emperor's beloved daughter; he grieved deeply.",
    idiomatic: "Princess Tang'an died and the emperor mourned deeply.",
  },
  s0449: {
    literal: "On renshen they reached Liangzhou.",
    idiomatic: "On renshen the court reached Liangzhou.",
  },
  s0450: {
    literal: "On dingchou Xuanwu commissioner Liu Xia was advanced to enfeoffed associate.",
    idiomatic: "On dingchou Liu Xia became an enfeoffed chancellor.",
  },
  s0451: {
    literal: "On jihai camp marshal Hun Jian was made acting Left Vice Director, associate, Lingzhou grand protector, Shuofang commissioner, and deputy commander of Binning, Zhenwu, Yongping, and Fengtian camps.",
    idiomatic: "On jihai Hun Jian became deputy supreme commander with Shuofang.",
  },
  s0452: {
    literal: "That day an edict made Li Huai'guang Grand Preceptor to the Heir; all other posts were removed.",
    idiomatic: "That day Huai'guang was stripped to heir grand preceptor only.",
  },
  s0453: {
    literal: "Jingzhou mutinied; officer Tian Xijian killed commander Feng Heqing and styled himself rear commander.",
    idiomatic: "Jingzhou troops killed Feng Heqing; Tian Xijian seized power.",
  },
  s0454: {
    literal: "Fourth month, xinchou new moon.",
    idiomatic: "Fourth month, new moon on xinchou.",
  },
  s0455: {
    literal: "Troops had not yet received spring uniforms; the emperor still wore layered dress. Hanzhong was hot early; attendants asked him to wear summer clothes. The emperor said: \"The soldiers have not changed to winter dress — may We alone wear spring silk?\"",
    idiomatic: "The emperor refused summer silks until the army had winter coats.",
  },
  s0456: {
    literal: "Soon tribute arrived; he gave the armies first and only then changed his own dress.",
    idiomatic: "Supplies went to the troops before the emperor changed clothes.",
  },
  s0457: {
    literal: "On renyin an edict granted all Fengtian followers the title \"Original Followers Merit Lords.\"",
    idiomatic: "On renyin Fengtian veterans became Original Followers merit lords.",
  },
  s0458: {
    literal: "Thus ended the edict. Binning officer Han Yougui was made Binning commissioner. (Source reads 伎 for 使.)",
    idiomatic: "Thus ended the edict. Han Yougui became Binning commissioner.",
  },
  s0459: {
    literal: "Left Secretariat Director Zhao Juan died.",
    idiomatic: "Zhao Juan died.",
  },
  s0460: {
    literal: "On jisi Shaan-Guo defense commissioner Tang Zhaochen was made Hezhong prefect and Hezhong-Tong-Jin-Jiang commissioner; Censor-in-Chief Li Qiyun was made concurrent Jingzhao prefect.",
    idiomatic: "On jisi Tang Zhaochen and Li Qiyun took Hezhong and Jingzhao.",
  },
  s0461: {
    literal: "Weibo staff officer Tian Xu killed commander Tian Yue; an edict posthumously made Yue Grand Preceptor and made Xu Weizhou chief administrator and Weibo commissioner.",
    idiomatic: "Tian Xu killed Tian Yue and took Weibo.",
  },
  s0462: {
    literal: "On jiayin Remonstrance Grand Master Jiang Gongfu was made Left Subaltern; Sword-South commissioner Zhang Yanshang associate; former Shannan East commissioner Jia Dan Works Minister.",
    idiomatic: "On jiayin Jiang Gongfu, Zhang Yanshang, and Jia Dan were reshuffled.",
  },
  s0463: {
    literal: "On jiazi Tibet envoy Left Vice Director Li Hui died at Fengzhou.",
    idiomatic: "On jiazi Li Hui died at Feng on his Tibetan mission.",
  },
  s0464: {
    literal: "On yichou Hun Jian with Tibetan general Lun Mangluo's host defeated rebel officer Han Min at Wugong — ten thousand heads.",
    idiomatic: "On yichou Hun Jian and Tibet crushed Han Min at Wugong.",
  },
  s0465: {
    literal: "On bingyin Li Na was made associate.",
    idiomatic: "On bingyin Li Na became associate.",
  },
  s0466: {
    literal: "On dingmao Prince of Yi Bin died.",
    idiomatic: "On dingmao the Prince of Yi, Bin, died.",
  },
  s0467: {
    literal: "Fifth month: Huainan commissioner Chen Shaoyou was made acting Grand Mentor; East Chuan Li Shuming Grand Preceptor to the Heir; Zhenhai Han Huang acting Right Vice Director.",
    idiomatic: "Fifth month: Chen Shaoyou, Li Shuming, and Han Huang were promoted.",
  },
  s0468: {
    literal: "On guiyou Prince of Jing Yun died.",
    idiomatic: "On guiyou Prince of Jing Yun died at court.",
  },
  s0469: {
    literal: "Xu-Yi-Hai trainer Gao Chengzong died; his son Mingying was left in charge of Xuzhou.",
    idiomatic: "Gao Chengzong died; his son held Xuzhou.",
  },
  s0470: {
    literal: "On bingzi Li Baozhen and Wang Wujun defeated Zhu Tao southeast of Jingcheng — thirty thousand heads; false chancellors Zhu Liangyou and Li Jun were captured and presented.",
    idiomatic: "On bingzi Baozhen and Wujun shattered Zhu Tao and sent captives to court.",
  },
  s0471: {
    literal: "Zhu Tao fled back to Youzhou.",
    idiomatic: "Zhu Tao fled to Youzhou.",
  },
  s0472: {
    literal: "On guiwei Yuezhou Li Jian, Qiannan Yuan Quanrou, and Gui-guan Lu Yue were made censor-in-chief; Yue also censor-in-chief.",
    idiomatic: "On guiwei three southern commissioners gained censor titles.",
  },
  s0473: {
    literal: "On gengyin Li Na submitted a loyal memorial; Li Zhengji was posthumously made Grand Preceptor.",
    idiomatic: "On gengyin Li Na submitted; Zhengji was honored posthumously.",
  },
  s0474: {
    literal: "On renchen Shangzhou Shang Keji defeated rebels at Lantian.",
    idiomatic: "On renchen Shang Keji won at Lantian.",
  },
  s0475: {
    literal: "On yiwei Anxi Four Garrisons commissioner Guo Xin and Beiting protector Li Yuanzhong were made Left and Right Vice Directors.",
    idiomatic: "On yiwei Guo Xin and Li Yuanzhong were promoted for holding the west.",
  },
  s0476: {
    literal: "That night Li Sheng moved his army from north of Wei to outside Guangtai Gate.",
    idiomatic: "That night Li Sheng advanced to Guangtai Gate.",
  },
  s0477: {
    literal: "Rebels pressed close; our troops fought to strike them, inflicting a great defeat, driving them into Guangtai Gate — several thousand slain; rebel ranks wailed as they entered Baihua.",
    idiomatic: "Li Sheng drove rebels through Guangtai Gate into Baihua.",
  },
  s0478: {
    literal: "On wuchen he formed battle lines outside Guangtai Gate.",
    idiomatic: "On wuchen he drew up outside Guangtai Gate.",
  },
  s0479: {
    literal: "Cavalry commander Shi Wanqing was sent to Shenli village to breach two hundred paces of park wall; rebels palisaded against it.",
    idiomatic: "Shi Wanqing breached the park wall at Shenli.",
  },
  s0480: {
    literal: "Our troops seized the palisade in furious battle; rebels were crushed, pursued to Baihua — Zhu Ci and Yao Lingyan fled with more than ten thousand.",
    idiomatic: "Imperial troops stormed the palisade and chased Ci and Yao to Baihua.",
  },
  s0481: {
    literal: "Sheng recovered the capital.",
    idiomatic: "Li Sheng retook Chang'an.",
  },
  s0482: {
    literal: "That day Hun Jian and Dai Xiuyan also defeated three thousand rebels at Xianyang; Han Yougui pursued Zhu Ci in Jing prefecture.",
    idiomatic: "The same day Hun Jian and Dai Xiuyan won at Xianyang while Han Yougui pursued Ci.",
  },
  s0483: {
    literal: "Sixth month, gengzi new moon: Hengzhou was elevated to a metropolitan prefecture.",
    idiomatic: "Sixth month: Hengzhou became a metropolitan prefecture.",
  },
  s0484: {
    literal: "On guimao posthumous honors were granted Shence officer Yang Huiyuan, Right Vice Director.",
    idiomatic: "On guimao Yang Huiyuan was honored posthumously.",
  },
  s0485: {
    literal: "That day Li Sheng submitted the \"Bulletin on Recovering the Capital\"; reading it, the emperor's tears soaked his robe.",
    idiomatic: "The emperor wept over Li Sheng's victory bulletin.",
  },
  s0486: {
    literal: "Jingzhou's Tian Xijian beheaded Yao Lingyan; Youzhou soldier Han Min beheaded Zhu Ci at Pengyuan — both heads reached the traveling court.",
    idiomatic: "Ci and Yao's heads reached Liangzhou.",
  },
  s0487: {
    literal: "On yisi Civil Offices Vice Minister Ban Hong entered the capital to announce reassurance.",
    idiomatic: "On yisi Ban Hong entered Chang'an to proclaim order.",
  },
  s0488: {
    literal: "On jiyou Li Sheng was made Grand Mentor, concurrent Grand Secretariat Director, substantive fief one thousand households.",
    idiomatic: "On jiyou Li Sheng became grand mentor and chancellor with a thousand households.",
  },
  s0489: {
    literal: "Luo Yuanguang and Shang Keji were made acting Left and Right Vice Directors, each five hundred households' fief.",
    idiomatic: "Luo Yuanguang and Shang Keji gained vice-director honors.",
  },
  s0490: {
    literal: "Jingzhou officer Tian Xijian was made Jing prefect and Jingyuan commissioner.",
    idiomatic: "Tian Xijian became Jingyuan commissioner.",
  },
  s0491: {
    literal: "On guichou an edict made Liangzhou Xingyuan prefecture; Nanzheng a crimson metropolitan county — offices and ranks like Jingzhao and Henan; commoners tax-exempt two years; incumbents two grades; elders placard-appointed; Nanzheng magistrate granted crimson.",
    idiomatic: "On guichou Liangzhou became Xingyuan fu with Nanzheng as a capital county.",
  },
  s0492: {
    literal: "Xingyuan prefect Yan Zhen was made acting Right Vice Director, substantive fief one hundred households.",
    idiomatic: "Yan Zhen became acting right vice director.",
  },
  s0493: {
    literal: "Hun Jian was made Palace Attendant, substantive fief eight hundred households. (Source reads 待中 for 侍中.)",
    idiomatic: "Hun Jian became palace attendant with eight hundred households.",
  },
  s0494: {
    literal: "Han Yougui was made acting Left Vice Director, substantive fief four hundred households.",
    idiomatic: "Han Yougui became acting left vice director with four hundred households.",
  },
  s0495: {
    literal: "Dai Xiuyan was made acting Right Vice Director, substantive fief two hundred households.",
    idiomatic: "Dai Xiuyan became acting right vice director with two hundred households.",
  },
  s0496: {
    literal: "Merit Evaluation director and edict drafter Lu Zhi and Personnel Bureau director and review edict drafter Ji Zhongfu were both made Remonstrance Grand Masters — still Hanlin academicians.",
    idiomatic: "Lu Zhi and Ji Zhongfu became remonstrance grand masters while keeping Hanlin posts.",
  },
  s0497: {
    literal: "Waterways Bureau aide Gu Shaolian was made Rites Bureau director — still Hanlin academician.",
    idiomatic: "Gu Shaolian became rites director while keeping Hanlin rank.",
  },
  s0498: {
    literal: "Camp left and right wing marshals Linghu Jian and Shi Changchun were both made acting Palace Attendants.",
    idiomatic: "Linghu Jian and Shi Changchun became acting palace attendants.",
  },
  s0499: {
    literal: "On bingchen the false chancellor Li Zhongchen was beheaded and his property confiscated.",
    idiomatic: "On bingchen Li Zhongchen was executed and his estate seized.",
  },
  s0500: {
    literal: "Li Sheng memorialized that property, cattle, and slaves confiscated from households punished for accepting rebel appointments should reward the soldiers.",
    idiomatic: "Li Sheng asked that rebel collaborators' seized goods pay the troops.",
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
if (data.metadata.chapter !== '012') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 012; standalone T ready (${Object.keys(T).length} entries).`
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
