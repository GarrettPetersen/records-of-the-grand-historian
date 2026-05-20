#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.012, Dezong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
  s0201: {
    literal: "On yisi Gate Department Vice Director Yang Yan was made Secretariat Vice Director and associate; Censor-in-Chief Lu Qi was made Gate Department Vice Director and associate.",
    idiomatic: "On yisi Yang Yan and Lu Qi traded chancellor posts.",
  },
  s0202: {
    literal: "On bingwu the Song-Bo circuit was renamed the Xuanwu army.",
    idiomatic: "On bingwu Song-Bo became the Xuanwu army.",
  },
  s0203: {
    literal: "On dingwei Censor-in-Chief Yuan Gao was made capital-region observer.",
    idiomatic: "On dingwei Yuan Gao became capital-region observer.",
  },
  s0204: {
    literal: "On yimao Zhenwu army mutinied, killing its commander Peng Lingfang and army monitor Liu Huiguang.",
    idiomatic: "On yimao Zhenwu troops killed Peng Lingfang and Liu Huiguang.",
  },
  s0205: {
    literal: "Third month, gengshen new moon: Bianzhou city was fortified.",
    idiomatic: "Third month: they walled Bianzhou.",
  },
  s0206: {
    literal: "At first in Dali, Li Zhengji held fifteen prefectures from Zi to Yan; Li Baochen seven from Heng to Cang; Tian Chengsi seven from Wei to Cao; Liang Chongyi six from Xiang to Ying — each mustered tens of thousands.",
    idiomatic: "In Dali four warlords held vast domains and huge armies.",
  },
  s0207: {
    literal: "They had first won office through rebellion; though the court heaped favor on them, their hearts remained doubtful and they allied to secure themselves.",
    idiomatic: "Rebel-born commanders stayed allied against the court despite imperial favors.",
  },
  s0208: {
    literal: "If the court added a city or dredged a moat, rumor flew; the bandits repaired walls and armor — scarcely a peaceful day.",
    idiomatic: "Every court fortification provoked warlord armament and rumor.",
  },
  s0209: {
    literal: "Now Tian Yue first submitted, Liu Wenxi was destroyed, and the ringleaders were terrified.",
    idiomatic: "Tian Yue's submission and Wenxi's fall terrified the warlords.",
  },
  s0210: {
    literal: "When account envoys returned without gifts, they all nursed grievances.",
    idiomatic: "Account envoys returned empty-handed and bred resentment.",
  },
  s0211: {
    literal: "Earlier Bianzhou, cramped for troops, had asked to expand the walls.",
    idiomatic: "Bianzhou had long sought a larger wall.",
  },
  s0212: {
    literal: "Now as the wall was built, Zhengji and Yue moved troops to the border; hence Bian, Song, and Hua were split into three commands and ninety-two thousand western autumn-defense troops were shifted to guard the east.",
    idiomatic: "The Bianzhou wall provoked Zhengji and Yue; the court split Henan commands and moved ninety-two thousand western troops east.",
  },
  s0213: {
    literal: "Yin prefecture was also established at Yancheng.",
    idiomatic: "Yin prefecture was created at Yancheng.",
  },
  s0214: {
    literal: "On xinsi Fenzhou prefect Wang Hong was made Zhenwu commissioner and rear commander of the eastern surrender cities and Sui-Yin-Lin-Sheng.",
    idiomatic: "On xinsi Wang Hong took Zhenwu and the eastern garrisons.",
  },
  s0215: {
    literal: "Wannian magistrate Cui Hanheng was made Palace Aide and sent to Tibet.",
    idiomatic: "Cui Hanheng went to Tibet as palace aide.",
  },
  s0216: {
    literal: "Summer, fourth month, jiyou new moon: Qian prefecture was abolished.",
    idiomatic: "Fourth month: Qian prefecture was abolished.",
  },
  s0217: {
    literal: "On gengyin Xiangzhou's Liang Chongyi was made associate chancellor.",
    idiomatic: "On gengyin Liang Chongyi became chancellor.",
  },
  s0218: {
    literal: "On jihai Yan and Shunhua prefectures were abolished.",
    idiomatic: "On jihai Yan and Shunhua were abolished.",
  },
  s0219: {
    literal: "On yimao Pingqin was merged into Dang prefecture.",
    idiomatic: "On yimao Pingqin was merged into Dang.",
  },
  s0220: {
    literal: "On dingsi Rites Vice Minister Yu Zhao was demoted to Guizhou prefect; Censor-in-Chief Yuan Gao to Shaozhou chief administrator.",
    idiomatic: "On dingsi Yu Zhao and Yuan Gao were exiled south.",
  },
  s0221: {
    literal: "Fifth month, bingyin: a military-exigency tax of one in eleven was levied.",
    idiomatic: "Fifth month: a one-eleventh war tax was imposed.",
  },
  s0222: {
    literal: "On jisi Huaining commissioner Li Xilie was made commander of all Han-north routes for pacification and disposal, enfeoffed Prince of Nanping.",
    idiomatic: "On jisi Li Xilie was named southern-pacification commander and Prince of Nanping.",
  },
  s0223: {
    literal: "On gengyin Zhejiang West circuit became the Zhenhai army.",
    idiomatic: "On gengyin Zhejiang West became Zhenhai.",
  },
  s0224: {
    literal: "Suzhou prefect Han Huang was made acting Rites Minister and Runzhou prefect, Zhenhai commissioner and Zhejiang East-West observer.",
    idiomatic: "Han Huang became Zhenhai commissioner from Suzhou.",
  },
  s0225: {
    literal: "One censor-in-chief was made Petition-Box commissioner; one remonstrance grand master supervised the boxes.",
    idiomatic: "A censor-in-chief and remonstrance officer oversaw the petition boxes.",
  },
  s0226: {
    literal: "Drafting Section attendants and secretariat drafters were made examination supervisors.",
    idiomatic: "Drafters supervised the civil examinations.",
  },
  s0227: {
    literal: "On xinchou Exalted Father, Grand Secretariat Director, Prince of Fenyang Guo Ziyi died.",
    idiomatic: "On xinchou Guo Ziyi died.",
  },
  s0228: {
    literal: "On bingwu acting Secretariat Junior Director Zheng Shuzhe was made censor-in-chief and eastern-capital capital-region observer.",
    idiomatic: "On bingwu Zheng Shuzhe became eastern-capital observer.",
  },
  s0229: {
    literal: "On renzi Heyang deputy Li Qi was made Heyang Three Cities and Huai commissioner; five eastern-capital counties were detached to him.",
    idiomatic: "On renzi Li Qi gained Heyang command and five counties.",
  },
  s0230: {
    literal: "Seventh month, wuzi new moon, an edict stated: \"The Two Courts and Four Garrisons oversee fifty-seven western tribes and ten surname groups; since the dynasty they have served in duty.\"",
    idiomatic: "Seventh month: an edict praised the western garrisons' loyalty since the fall of Longyou.",
  },
  s0231: {
    literal: "\"Since Tong and Long were lost and east and west cut off, loyal men have wept blood holding the frontier, guarding borders and rites — all from mutual governance by frontier lords.\"",
    idiomatic: "The edict hailed frontier lords who kept the western passes under siege.",
  },
  s0232: {
    literal: "\"Western Garrisons observer Li Yuanzhong may be Beiting grand protector; Four Garrisons rear commander Guo Xin may be Anxi grand protector and Four Garrisons observer.\"",
    idiomatic: "Li Yuanzhong and Guo Xin were named Beiting and Anxi protectors.",
  },
  s0233: {
    literal: "Thus ended the edict. Since He-Long fell, Yixi and Beiting were cut off; Li Siye, Li Feiyuanli, Sun Zhizhi, and Ma Lin had only held the titles remotely.",
    idiomatic: "Thus ended the edict. Western commands had been titular since Longyou's fall.",
  },
  s0234: {
    literal: "At first Yuanzhong and Xin had been Yixi-Beiting rear commanders; after isolation their fate was unknown — now envoys through the Uyghurs reported them alive and the emperor rejoiced.",
    idiomatic: "Envoys through the Uyghurs proved Yuanzhong and Xin still held the west.",
  },
  s0235: {
    literal: "Yixi-Beiting officers were ranked in office, advanced seven grades beyond norm.",
    idiomatic: "Western officers received extraordinary promotions.",
  },
  s0236: {
    literal: "On gengshen Secretariat Vice Director Yang Yan was made Left Vice Director; former Yongping commissioner Zhang Yi was made Secretariat Vice Director and associate.",
    idiomatic: "On gengshen Yang Yan became left director; Zhang Yi joined the chancellery.",
  },
  s0237: {
    literal: "Minister of Works, Prince of Huaiyang Hou Xiyi died; on dingchou Hezhong prefect Guan Bo was made Drafting attendant; Tongzhou prefect Li Cheng was made Hezhong prefect and Jin-Jiang defense observer.",
    idiomatic: "Hou Xiyi died; Guan Bo and Li Cheng took Hezhong posts.",
  },
  s0238: {
    literal: "On xinsi Binning commissioner Li Huai'guang was made concurrent Lingzhou grand protector, Shanyu grand protector, and Shuofang commissioner.",
    idiomatic: "On xinsi Li Huai'guang took Shuofang and Lingzhou.",
  },
  s0239: {
    literal: "Bian-Fang-Dan-Yan rear commander Li Jianhui was made Fangzhou prefect and Bian-Fang-Dan-Yan united training observer.",
    idiomatic: "Li Jianhui became Bian-Fang observer.",
  },
  s0240: {
    literal: "On renwu Youzhou-Longyou commissioner Zhu Ci was made Grand Preceptor.",
    idiomatic: "On renwu Zhu Ci became grand preceptor.",
  },
  s0241: {
    literal: "Tian Yue attacked Linming; defender Zhang Pi held the city.",
    idiomatic: "Tian Yue besieged Linming; Zhang Pi held out.",
  },
  s0242: {
    literal: "Eighth month, xinmao: Pinglu-Zi-Qing commissioner Li Zhengji died.",
    idiomatic: "Eighth month: Li Zhengji died.",
  },
  s0243: {
    literal: "On gengxu Secretariat Drafter Wei Yan was made censor-in-chief and capital-region observer.",
    idiomatic: "On gengxu Wei Yan became capital observer.",
  },
  s0244: {
    literal: "On renzi Huaining commissioner Li Xilie attacked Xiangyang, executed Liang Chongyi, and beheaded more than thirty accomplices.",
    idiomatic: "On renzi Xilie seized Xiangyang and killed Liang Chongyi and thirty followers.",
  },
  s0245: {
    literal: "Ninth month, xinyou: Yizhou prefect Zhang Xiaozhong was made Hengzhou prefect and Chengdé commissioner.",
    idiomatic: "Ninth month: Zhang Xiaozhong became Chengdé commissioner.",
  },
  s0246: {
    literal: "On renxu Li Xilie was made associate chancellor.",
    idiomatic: "On renxu Li Xilie became chancellor.",
  },
  s0247: {
    literal: "On guihai War Minister, Prince of Yiguo Lu Sijing died.",
    idiomatic: "On guihai Lu Sijing died.",
  },
  s0248: {
    literal: "On jiazi Jin-Jiang observer Li Cheng was made Xiangzhou prefect and Shannan East commissioner.",
    idiomatic: "On jiazi Li Cheng became Shannan East commissioner.",
  },
  s0249: {
    literal: "On wuchen Hangzhou prefect Yuan Quanrou was made Qianzhong pacification commissioner.",
    idiomatic: "On wuchen Yuan Quanrou became Qianzhong commissioner.",
  },
  s0250: {
    literal: "Tenth month of winter, yiyou: Left Vice Director Yang Yan was demoted to Yazhou aide and soon ordered to die.",
    idiomatic: "Tenth month: Yang Yan was exiled to Yazhou and forced to suicide.",
  },
  s0251: {
    literal: "On wushen Xuanwu commissioner Liu Xia was made censor-in-chief.",
    idiomatic: "On wushen Liu Xia became censor-in-chief.",
  },
  s0252: {
    literal: "Xuzhou prefect Li Wei abandoned his commander Li Na and surrendered the prefecture.",
    idiomatic: "Li Wei surrendered Xuzhou to the court.",
  },
  s0253: {
    literal: "Eleventh month, xinwei: Xuanwu commissioner Liu Xia and Shence general Qu Huan crushed Li Na at Xuzhou.",
    idiomatic: "Eleventh month: Liu Xia and Qu Huan shattered Li Na at Xuzhou.",
  },
  s0254: {
    literal: "On jisi an edict stated: \"Chengdé army commander, Hengzhou prefect, Heir of Longxi Li Weiyue — though his father Baochen served the throne, Weiyue ruins his father's work, scorns imperial grace, and in mourning usurps command.\"",
    idiomatic: "On jisi an edict condemned Li Weiyue for seizing command during mourning.",
  },
  s0255: {
    literal: "\"He allies with criminals and deepens treason — unfilial and disloyal — fit to be exposed in the wild.\"",
    idiomatic: "The edict called him unfilial and disloyal.",
  },
  s0256: {
    literal: "\"Strip your personal ranks and titles.\"",
    idiomatic: "\"Your ranks are revoked.\"",
  },
  s0257: {
    literal: "Thus ended the edict. On yihai Households Vice Minister Han Hui was demoted to Shuzhou prefect; Jiang-Huai transport director Du You replaced him judging revenue and households.",
    idiomatic: "Thus ended the edict. Han Hui fell; Du You took revenue.",
  },
  s0258: {
    literal: "On dingchou Shaan chief administrator Li Qi was made Hezhong prefect and Jin-Jiang defense observer.",
    idiomatic: "On dingchou Li Qi took Hezhong.",
  },
  s0259: {
    literal: "Shangzhou prefect Yao Mingyang was made Shaan chief administrator, Shaan defense commissioner, and land transport commissioner.",
    idiomatic: "Yao Mingyang took Shaan and land transport.",
  },
  s0260: {
    literal: "Acting salt commissioner Bao Ji was made Jiang-Huai land-and-water transport commissioner.",
    idiomatic: "Bao Ji became Jiang-Huai transport commissioner.",
  },
  s0261: {
    literal: "Li Na's officer Wang She surrendered Haizhou.",
    idiomatic: "Wang She surrendered Haizhou to the court.",
  },
  s0262: {
    literal: "Twelfth month, gengyin: Hezhong commissioner Ma Sui was made acting Left Vice Director; Zelu commissioner Li Baozhen acting War Minister — reward for defeating Tian Yue.",
    idiomatic: "Twelfth month: Ma Sui and Li Baozhen were promoted for beating Tian Yue.",
  },
  s0263: {
    literal: "On bingshen Grand Mentor to the Heir Wang Jin died.",
    idiomatic: "On bingshen Wang Jin died.",
  },
  s0264: {
    literal: "Jianzhong 3 — first month, yimao new moon. (The source repeats the year numeral.)",
    idiomatic: "Jianzhong 3 opened on yimao.",
  },
  s0265: {
    literal: "On bingyin Zhu Tao and Zhang Xiaozhong defeated Weiyue at Shulu.",
    idiomatic: "On bingyin Zhu Tao and Zhang Xiaozhong won at Shulu.",
  },
  s0266: {
    literal: "On xinwei an edict ordered reduced imperial and princely kitchens; the chancellors asked to cut palace and official salaries by one-third for the army — granted.",
    idiomatic: "On xinwei court kitchens and salaries were cut a third for the war effort.",
  },
  s0267: {
    literal: "On gengchen the emperor's uncle Xi was posthumously made Prince of Song; younger brother Xuan Prince of Jing.",
    idiomatic: "On gengchen two kinsmen received posthumous princely titles.",
  },
  s0268: {
    literal: "Intercalary month, bingshen: the thirty-seventh-generation descendant of Confucius Qixian was made Yanzhou registrar, inheriting Duke of Literary Glory.",
    idiomatic: "Intercalary month: Confucius's heir received Yanzhou office.",
  },
  s0269: {
    literal: "On xinchou the full-strength register was restored.",
    idiomatic: "On xinchou the full-strength register returned.",
  },
  s0270: {
    literal: "On jiachen Chengdé officer Wang Wujun killed Li Weiyue and sent his head to the capital.",
    idiomatic: "On jiachen Wang Wujun killed Weiyue and sent his head to Chang'an.",
  },
  s0271: {
    literal: "On gengxu Ma Sui and Li Qi defeated Tian Yue at Huan River and advanced on Weizhou.",
    idiomatic: "On gengxu Ma Sui and Li Qi beat Tian Yue at Huan River.",
  },
  s0272: {
    literal: "Second month, wuwu: Weiyue's Dingzhou officer Yang Zhengyi surrendered his prefecture.",
    idiomatic: "Second month: Yang Zhengyi surrendered Dingzhou.",
  },
  s0273: {
    literal: "Zhu Tao was made acting Grand Mentor; Zhang Xiaozhong acting War Minister over Yi-Ding-Cang; Wang Wujun acting Secretariat Director and Hengzhou prefect; Kang Rizhi Zhao prefect and Shen-Zhao observer.",
    idiomatic: "Tang generals and turncoats received new Hebei commands.",
  },
  s0274: {
    literal: "Third month, dinghai: posthumous honors for Yan Gaoqing, Yuan Lüqian, Pang Jian, and Jiang Qing.",
    idiomatic: "Third month: martyrs of the An Lushan war were enfeoffed posthumously.",
  },
  s0275: {
    literal: "Posthumous honors for An Jinzang, Minister of War; his son Chengen was made Luzhou chief administrator.",
    idiomatic: "An Jinzang was honored; his son received office.",
  },
  s0276: {
    literal: "On yiwei Xuzhou prefect Li Wei was made Xu-Yi-Hai training observer.",
    idiomatic: "On yiwei Li Wei became Xu-Yi-Hai observer.",
  },
  s0277: {
    literal: "On wuxu Tian Yue and Luozhou prefect Tian Ang surrendered their city.",
    idiomatic: "On wuxu Tian Yue and Tian Ang surrendered.",
  },
  s0278: {
    literal: "Lingnan commissioner Zhang Boyi was made acting War Minister, Jiangling prefect, censor-in-chief, and Jingnan commissioner.",
    idiomatic: "Zhang Boyi took Jingnan from Lingnan.",
  },
  s0279: {
    literal: "Rong-guan commissioner Yuan Xiu was made Guangzhou prefect and Lingnan commissioner.",
    idiomatic: "Yuan Xiu became Lingnan commissioner.",
  },
  s0280: {
    literal: "On bingwu Jingzhao prefect Lu Ji was demoted to Fuzhou chief administrator.",
    idiomatic: "On bingwu Lu Ji was exiled to Fuzhou.",
  },
  s0281: {
    literal: "Summer, fourth month: Li Na's Dezhou officer Li Shizhen and Di prefecture officer Li Changqing surrendered their cities.",
    idiomatic: "Fourth month: two of Li Na's officers surrendered De and Di.",
  },
  s0282: {
    literal: "On gengshen eight hundred monks, nuns, soldiers, and officials long captive in Tibet returned.",
    idiomatic: "On gengshen eight hundred captives returned from Tibet.",
  },
  s0283: {
    literal: "On renxu Zhu Tao was enfeoffed Prince of Tongyi commandery.",
    idiomatic: "On renxu Zhu Tao became Prince of Tongyi.",
  },
  s0284: {
    literal: "Zhu Tao, Wang Wujun, and Tian Yue allied in rebellion.",
    idiomatic: "Zhu Tao, Wang Wujun, and Tian Yue rebelled together.",
  },
  s0285: {
    literal: "Court of Sacrifices doctors Wei Dubin and Chen Jing, citing insufficient war corvée funds, asked to borrow money from Chang'an merchants — roughly ten thousand strings left per merchant, the rest to the state; a dozen great merchants would fund the treasury.",
    idiomatic: "Wei Dubin and Chen Jing proposed seizing merchant wealth for the war.",
  },
  s0286: {
    literal: "Revenue judge Du You said: \"Armies now cost over a million strings monthly; five million would last only months.\"",
    idiomatic: "Du You noted a million strings a month in war costs.",
  },
  s0287: {
    literal: "Thus ended the memorial. On jiazi an edict ordered the Jingzhao prefect and Chang'an-Wannian magistrates to hunt wealthy households; punishments were harsh — Wannian magistrate Xue Ping was cangued and carted through markets until men hanged themselves.",
    idiomatic: "Thus ended the memorial. The court squeezed Chang'an merchants with torture.",
  },
  s0288: {
    literal: "The capital seethed as if plundered.",
    idiomatic: "Chang'an panicked like a sacked city.",
  },
  s0289: {
    literal: "When the search ended only eight hundred thousand strings were gained; Vice Prefect Wei Zhen squeezed pawnshops for two million more.",
    idiomatic: "The squeeze yielded under three million strings.",
  },
  s0290: {
    literal: "On dingchou Prince of Peng tutor Xu Hao died, posthumously Junior Tutor to the Heir.",
    idiomatic: "On dingchou Xu Hao died.",
  },
  s0291: {
    literal: "On wuyin Associate Zhang Yi was made Fengxiang prefect and Longyou commissioner to replace Zhu Ci.",
    idiomatic: "On wuyin Zhang Yi replaced Zhu Ci in the northwest.",
  },
  s0292: {
    literal: "Ci gained five hundred households' fief, Dou clan gardens, fertile Jing lands, and brocade and gold — to soothe him while Tao rebelled.",
    idiomatic: "Zhu Ci was bribed with fiefs and gardens while Tao rebelled.",
  },
  s0293: {
    literal: "On renwu Censor-in-Chief Yan Yi was demoted to Fei chief administrator; Left Patrol Commissioner Zheng Zhan was beaten to death.",
    idiomatic: "On renwu Yan Yi was exiled; Zheng Zhan was flogged to death.",
  },
  s0294: {
    literal: "Yi died after a year.",
    idiomatic: "Yan Yi died within the year.",
  },
  s0295: {
    literal: "Fifth month, bingxu: the two taxes and salt monopoly were raised — two hundred cash per string on taxes, one hundred per dou of salt.",
    idiomatic: "Fifth month: taxes and salt surcharges rose.",
  },
  s0296: {
    literal: "On dinghai Grand Mentor to the Heir Shao Yue was demoted to Guizhou prefect and died in exile.",
    idiomatic: "On dinghai Shao Yue was exiled to Guizhou and died on the way.",
  },
  s0297: {
    literal: "On xinmao an edict ordered Shuofang commissioner Li Huai'guang to lead Shence and Shuofang troops east.",
    idiomatic: "On xinmao Li Huai'guang marched east.",
  },
  s0298: {
    literal: "On bingshen an edict stated: \"Former Yixi-Beiting commissioners Yang Xiuming, Zhou Ding, Xizhou prefect Li Xiuzhang, Guazhou prefect Zhang Xuan, and others, posted to distant commands in Our deep grief, held the western border against the barbarians.\"",
    idiomatic: "On bingshen an edict praised western martyrs lost in Tibet.",
  },
  s0299: {
    literal: "\"They died in foreign lands across many years; now their coffins return — We mourn deeply and grant posthumous honors to enrich the underworld.\"",
    idiomatic: "The edict mourned officers whose bones were only now returning.",
  },
  s0300: {
    literal: "Xiuming may be posthumously Grand Mentor; Ding Grand Preceptor; Xiuzhang Households Minister; Xuan War Vice Minister.\"",
    idiomatic: "Yang Xiuming, Zhou Ding, Li Xiuzhang, and Zhang Xuan received posthumous ranks.",
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
