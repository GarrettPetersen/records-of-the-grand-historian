#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.014, Shunzong, Xianzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
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
    literal: "On xinsi Du Huangxiang was enfeoffed Duke of Bin and Yu Di Duke of Yan.",
    idiomatic: "On xinsi Du Huangxiang became Duke of Bin and Yu Di Duke of Yan.",
  },
  s0402: {
    literal: "More than four hundred fifty monks including Weiliangchan who had been lost in Tibet returned.",
    idiomatic: "Over four hundred monks lost to Tibet, led by Weiliangchan, came home.",
  },
  s0403: {
    literal: "Ninth month, yiyou: Prince Mi Chong died.",
    idiomatic: "In the ninth month, on yiyou, Prince Mi Chong died.",
  },
  s0404: {
    literal: "Tenth month, jiyou: Zhexi circuit commissioner Li Qi was made Left Vice Director;",
    idiomatic: "Tenth month, jiyou: Li Qi of Zhexi became Left Vice Director;",
  },
  s0405: {
    literal: "Censor-in-Chief Li Yuansu was made Run prefect, Zhenhai army and Zhexi circuit commissioner.",
    idiomatic: "Li Yuansu took Runzhou and the Zhenhai–Zhexi command.",
  },
  s0406: {
    literal: "On gengshen Li Qi seized Runzhou in rebellion and killed judge Wang Dan and great general Zhao Qi.",
    idiomatic: "On gengshen Li Qi rebelled at Runzhou, killing Wang Dan and Zhao Qi.",
  },
  s0407: {
    literal: "At the time Qi had falsely requested to enter court; he had appointed Dan acting commissioner, then prompted an edict: \"Li Qi belongs to the imperial clan branch, holds a frontier post, his splendor and favor have been full of cordial grace.",
    idiomatic: "Qi had feigned a court visit and left Dan in charge, then procured an edict denouncing his clan rank and ingratitude.",
  },
  s0408: {
    literal: "Treated as kin and worthy, he answered with treason;",
    idiomatic: "Honored as kin, he answered with treason;",
  },
  s0409: {
    literal: "given armies, he used troops to disturb order.",
    idiomatic: "given troops, he turned them to disorder.",
  },
  s0410: {
    literal: "Again and again he submitted memorials, urgently asking for court audience — first feigning illness, later openly raising troops.",
    idiomatic: "He piled up memorials begging audience, first shamming sickness, then openly mustering troops.",
  },
  s0411: {
    literal: "Staff who offered counsel were slaughtered; court envoys who bore decrees were coerced.",
    idiomatic: "Advisers were killed; imperial messengers were held hostage.",
  },
  s0412: {
    literal: "The Emperor, urgent to swallow disgrace, had not yet wished to expose him, repeatedly sending inner attendants to order compliance with prior intent.",
    idiomatic: "The throne had long swallowed insult, sending eunuchs again and again before breaking silence.",
  },
  s0413: {
    literal: "There was no warning of the carriage's road; baleful vapors filled the sky.",
    idiomatic: "No loyal escort came; rebellion's miasma filled the sky.",
  },
  s0414: {
    literal: "Moreover day by day he practiced cruel punishments and month by month raised violent levies.",
    idiomatic: "Daily tortures and monthly extortions followed.",
  },
  s0415: {
    literal: "As father and mother to the people, hearing this the Emperor was deeply moved; looking to discipline, how dare he let it fall!",
    idiomatic: "As parent of the realm he grieved — yet discipline could not be abandoned.",
  },
  s0416: {
    literal: "Li Qi's personal offices and titles are all to be stripped.",
    idiomatic: "All of Li Qi's ranks were stripped.",
  },
  s0417: {
    literal: "\" Huainan commissioner Wang E was made overall campaign commander of all circuits; inner attendant Xue Shangyan was made army supervisor, leading Bian, Xu, E, Huainan, and Xuan-She forces by the Xuanzhou route to attack.",
    idiomatic: "Wang E of Huainan led a multi-circuit campaign with eunuch Xue Shangyan as supervisor.",
  },
  s0418: {
    literal: "On dingmao Vice Director and Grand Councilor Wu Yuanheng was made acting War Minister, concurrent Vice Director, Grand Councilor, Chengdu Intendant, and Jiannan West circuit commissioner, still enfeoffed Duke of Linhuai.",
    idiomatic: "On dingmao Wu Yuanheng went west as Linhuai duke and Jiannan commissioner.",
  },
  s0419: {
    literal: "As he was to depart, the Emperor came to Anfu Gate to console and send him off.",
    idiomatic: "The Emperor saw him off at Anfu Gate.",
  },
  s0420: {
    literal: "On guiyou Runzhou great generals Zhang Zilang, Li Fengdu, and others seized Li Qi and presented him captive.",
    idiomatic: "On guiyou Runzhou generals seized Qi and sent him captive.",
  },
  s0421: {
    literal: "On xinsi Qi's paternal cousin Song prefect Qian and Herald Qian were both demoted beyond the ranges.",
    idiomatic: "On xinsi Qi's cousins Qian and Qian were exiled to Lingnan.",
  },
  s0422: {
    literal: "Eleventh month, jiashen: Li Qi was beheaded beneath the Lone Willow; Qi's clan register was expunged.",
    idiomatic: "Eleventh month, jiashen: Qi was beheaded at Lone Willow and struck from the clan rolls.",
  },
  s0423: {
    literal: "On bingxu Zhang Ziliang, Runzhou yamen general who captured Qi, was made Left Golden Guards general and enfeoffed Prince of Nanyang;",
    idiomatic: "On bingxu Zhang Ziliang, who took Qi, became a Golden Guards general and Prince of Nanyang;",
  },
  s0424: {
    literal: "Tian Shaoqing, Li Fengxian, and others were made Feathered Forest generals, all enfeoffed dukes.",
    idiomatic: "Tian Shaoqing and Li Fengxian were made Feathered Forest generals and enfeoffed dukes.",
  },
  s0425: {
    literal: "On jiachen an edict: Grand Mentor Du You's strength is not yet spent — henceforth he shall enter the Secretariat daily to handle affairs.",
    idiomatic: "On jiachen Du You was ordered to attend the Secretariat daily.",
  },
  s0426: {
    literal: "Twelfth month, jiayin: Chancellor Li Jifu was enfeoffed Marquis of Zanhuang.",
    idiomatic: "Twelfth month, jiayin: Li Jifu became Marquis of Zanhuang.",
  },
  s0427: {
    literal: "On bingchen the Emperor told the chancellors: \"Reading the national records, I see that in Emperor Wen's conduct there were few faults; remonstrating officials debated back and forth three or four times.",
    idiomatic: "On bingchen he told his chancellors that Taizong welcomed repeated remonstrance — and he wanted the same.",
  },
  s0428: {
    literal: "How much more am I, of scant wisdom, not yet clear on the Way — hereafter if anything is not right, you must debate each matter ten times; you may not stop at one or two.",
    idiomatic: "He asked that every doubtful policy be argued ten times over, not once or twice.",
  },
  s0429: {
    literal: "On dingsi the Eastern Capital Directorate of Education added one hundred students.",
    idiomatic: "On dingsi Luoyang's Directorate added one hundred students.",
  },
  s0430: {
    literal: "On guihai the Censorate memorialized: \"For civil and military regular attendees, per the Zhenyuan 1 third-month fourteenth-day edict, if at court they console one another, kneel, or while awaiting the leak stand out of order, jest and clamor;",
    idiomatic: "On guihai the Censorate proposed fines for disorderly conduct at court under the Zhenyuan rules:",
  },
  s0431: {
    literal: "entering the yamen or entering the pavilion, holding the tablet not upright, walking or standing slowly;",
    idiomatic: "improper tablets, slow movement in the yamen;",
  },
  s0432: {
    literal: "standing in ranks not straight, hurrying and bowing with lost ritual, speech slightly clamorous, cutting through ranks or through the guard formation, leaving the gate without cause;",
    idiomatic: "crooked ranks, loud speech, cutting through guards, leaving post without cause;",
  },
  s0433: {
    literal: "eating and drinking in the corridor, sitting or standing with lost ritual and clamor;",
    idiomatic: "corridor feasting and rowdy sitting;",
  },
  s0434: {
    literal: "entering or leaving court not by the main hall route;",
    idiomatic: "entering or leaving court by side doors;",
  },
  s0435: {
    literal: "entering the Secretariat without public business: each offense deducts one month's salary.",
    idiomatic: "unauthorized entry to the Secretariat: one month's salary lost per offense.",
  },
  s0436: {
    literal: "If ranks are not solemn and the officer pointed out still ornaments wrong, report and memorialize for demotion and censure.",
    idiomatic: "Persistent offenders were to be reported for demotion.",
  },
  s0437: {
    literal: "Your subjects have considered halving each penalty under the old articles, so that if there is an offense it will surely be reported.",
    idiomatic: "They asked to halve the old penalties so violations would surely be cited.",
  },
  s0438: {
    literal: "Approved.",
    idiomatic: "The Emperor approved.",
  },
  s0439: {
    literal: "On bingyin Jiannan West commissioner Gao Chongwen was made acting Minister of Works, Grand Councilor, concurrent Bin prefect and Bin-Ning-Qing commissioner, and commander-in-chief of all Jingxi armies.",
    idiomatic: "On bingyin Gao Chongwen took Binning and command of Jingxi armies.",
  },
  s0440: {
    literal: "On renshen Rites Department candidates: oral examination was abolished; ten written meaning questions — passing five classics for jinshi, six for mingjing — then jinshi was granted.",
    idiomatic: "On renshen the civil exam dropped oral tests for written classics thresholds.",
  },
  s0441: {
    literal: "Candidates once punished by government offices or once county clerks, though possessing literary skill, may not be nominated by senior officials — violators' nominators are suspended from office and examiners demoted.",
    idiomatic: "Punished officials and former clerks could not be nominated; violators faced suspension.",
  },
  s0442: {
    literal: "On bingzi the chancellors were ordered to proclaim an edict: henceforth officials must not memorialize banquets, farewells, and social going among the hundred offices — pursue only glad ease.",
    idiomatic: "On bingzi officials were told not to report one another's banquets — enjoy them privately.",
  },
  s0443: {
    literal: "Baoyi army commissioner Liu Zong died.",
    idiomatic: "Baoyi commissioner Liu Zong died.",
  },
  s0444: {
    literal: "On jimao Historiographer Li Jifu compiled the \"Yuanhe National Accounts Book,\" totaling forty-eight frontier commands, two hundred ninety-five prefectures and circuits, one thousand four hundred fifty-three counties, two million four hundred forty thousand two hundred fifty-four households — of which Fengxiang, Zheng-Fang, Bin-Ning, Zhenwu, Jingyuan, Yin-Xia, Ling-Salt, Hedong, Yiding, Weibo, Zhen-Ji, Fanyang, Cang-Jing, Huaixi, and Zi-Qing fifteen circuits, seventy-one prefectures, did not report households.",
    idiomatic: "On jimao Li Jifu's Yuanhe accounts tallied forty-eight commands — fifteen frontier circuits reported no households.",
  },
  s0445: {
    literal: "Each year's tax revenue relied on only Zhejiang East and West, Xuan-She, Huainan, Jiangxi, E-Yue, Fujian, and Hunan eight circuits — forty-nine prefectures, one million four hundred forty thousand households.",
    idiomatic: "Taxes now rested on eight southeastern circuits and 1.44 million households.",
  },
  s0446: {
    literal: "Compared with Tianbao tax-paying households, it was one in four.",
    idiomatic: "That was a quarter of Tianbao tax households.",
  },
  s0447: {
    literal: "Armies and guards depending on the state numbered more than eight hundred thirty thousand — compared with Tianbao soldiers and horses, three parts plus one; on average two households supported one soldier.",
    idiomatic: "Eight hundred thirty thousand men-at-arms consumed three times Tianbao's armies — two households per soldier.",
  },
  s0448: {
    literal: "Other flood and drought losses, levies and collections, were again beyond regular corvée.",
    idiomatic: "Floods, droughts, and extra levies lay beyond regular corvée.",
  },
  s0449: {
    literal: "Jifu compiled the matter in all and completed a book of ten scrolls.",
    idiomatic: "Jifu finished the work in ten scrolls.",
  },
  s0450: {
    literal: "That year Tibet, Uighur, Xi, Khitan, Bohai, Zangke, and Nanzhao all sent tribute missions.",
    idiomatic: "That year Tibet, Uighurs, Xi, Khitan, Bohai, Zangke, and Nanzhao all paid tribute.",
  },
  s0451: {
    literal: "Third year, spring, first month, guiwei new moon.",
    idiomatic: "Year 3, spring, first month, guiwei new moon.",
  },
  s0452: {
    literal: "On guisi the hundred officials offered the honorific title Sagely Martial Emperor.",
    idiomatic: "On guisi the court offered the title Sagely Martial Emperor.",
  },
  s0453: {
    literal: "He received the seal at Xuanzheng Hall; when ritual ended he moved the guard to Danfeng Tower and proclaimed a great amnesty for all under Heaven.",
    idiomatic: "He took the seal at Xuanzheng, then amnestied the realm from Danfeng Tower.",
  },
  s0454: {
    literal: "On gengzi Jingyuan's Duan You requested repair of Linyuan city, ninety li north of Jing prefecture, choking the Tujue frontier pass — edict approved.",
    idiomatic: "On gengzi Duan You won approval to rebuild Linyuan on the Jing frontier.",
  },
  s0455: {
    literal: "On wushen Left and Right Divine Awe armies were abolished and merged into one, titled Heavenly Awe Army.",
    idiomatic: "On wushen the Divine Awe armies merged into the Heavenly Awe Army.",
  },
  s0456: {
    literal: "Second month, bingshen: Chancellor Li Jifu advanced to Duke of Zhao.",
    idiomatic: "Second month, bingshen: Li Jifu became Duke of Zhao.",
  },
  s0457: {
    literal: "On jichou Wuchang commissioner Han Gao was made Run prefect, Zhenhai army commissioner, and Zhexi observer.",
    idiomatic: "On jichou Han Gao took Run and Zhexi.",
  },
  s0458: {
    literal: "On xinwei the late commoner Cui Shanzhen of Mu prefecture was posthumously made Mu prefecture vice marshal — loyal remonstrance and death at Li Qi's hands.",
    idiomatic: "On xinwei Cui Shanzhen, killed remonstrating against Li Qi, was posthumously honored.",
  },
  s0459: {
    literal: "On guichou Zheng-Fang commissioner Pei Bin was made Xingyuan Intendant and Shannan West commissioner.",
    idiomatic: "On guichou Pei Bin went to Shannan West.",
  },
  s0460: {
    literal: "On bingzi Right Golden Guards great general Lu Shu was made Zheng prefect and Zheng-Fang commissioner.",
    idiomatic: "On bingzi Lu Shu took Zheng-Fang.",
  },
  s0461: {
    literal: "On wuyin Princess Xian'an the Great Long died among the Uighurs.",
    idiomatic: "On wuyin Princess Xian'an died in the Uighur lands.",
  },
  s0462: {
    literal: "Third month, guisi: Prince of Ye Zong died.",
    idiomatic: "Third month, guisi: Prince Ye Zong died.",
  },
  s0463: {
    literal: "On gengzi Dingping garrison commander Zhu Shiming was made commissioner of the Four Garrisons, Northern Court, Jingyuan, and related prefectures.",
    idiomatic: "On gengzi Zhu Shiming took the northwest frontier command.",
  },
  s0464: {
    literal: "On yisi the Emperor at Xuanzheng Hall tested decree-examination candidates.",
    idiomatic: "On yisi decree-examination candidates were tested at Xuanzheng.",
  },
  s0465: {
    literal: "Summer, fourth month, guichou: Inner attendant Guo Limin, drunk, violated the night curfew and was beaten to death; Golden Guards Xue Yi and patrol officer Wei Xi were both demoted and expelled.",
    idiomatic: "Fourth month, guichou: a drunken eunuch was beaten to death; two officers were punished.",
  },
  s0466: {
    literal: "Zhu Shiming was granted the name Zhongliang.",
    idiomatic: "Zhu Shiming received the name Zhongliang.",
  },
  s0467: {
    literal: "On yichou Hanlin academician Wang Ya was demoted to Guo prefecture vice marshal — at the time Ya's nephew Huangfu Shi with Niu Sengru and Li Zongmin all placed third in the Exemplary and Upright examination; the policy language was too cutting and the powerful hated them, so Ya was demoted through kinship.",
    idiomatic: "On yichou Wang Ya fell when his nephew's sharp examination answers angered the powerful.",
  },
  s0468: {
    literal: "On renshen a great wind destroyed twenty-seven bays of Hanyuan Hall's balustrades.",
    idiomatic: "On renshen wind wrecked twenty-seven bays of Hanyuan balustrades.",
  },
  s0469: {
    literal: "On yihai Lingnan commissioner Zhao Chang was made Jiangling Intendant and Jingnan commissioner; Revenue Vice Minister Yang Yuling was made Guangzhou prefect and Lingnan commissioner.",
    idiomatic: "On yihai Zhao Chang and Yang Yuling swapped Jiangnan and Lingnan.",
  },
  s0470: {
    literal: "On dingchou Jingnan commissioner Pei Jun was made Left Vice Director and acting revenue commissioner.",
    idiomatic: "On dingchou Pei Jun became Left Vice Director over revenue.",
  },
  s0471: {
    literal: "An edict: the fifth month's first-day imperial audience congratulatory ritual should cease.",
    idiomatic: "The fifth-month court congratulatory audience was abolished.",
  },
  s0472: {
    literal: "On jimao Pei Jun at the Secretariat's main hall assumed the vice-directorship.",
    idiomatic: "On jimao Pei Jun took the vice-directorship at the Secretariat hall.",
  },
  s0473: {
    literal: "Delivery of the seal and presentation of the roster, announcement, and handing of documents were all done by Secretariat gentlemen; civil and military third rank and above ascended and sat in ranks; fourth and fifth rank, gentlemen, and censors bowed in the hall, then the Vice Censor-in-Chief, Left and Right Vice Directors, and vice ministers were summoned to ascend and return bows.",
    idiomatic: "The elaborate ceremony had secretariat gentlemen handle every step while ranks bowed in sequence.",
  },
  s0474: {
    literal: "Though the old story was followed, critics said it was excessive.",
    idiomatic: "Observers called the ritual excessive.",
  },
  s0475: {
    literal: "Fifth month, renchen: War Department requested restoration of the military examination — approved.",
    idiomatic: "Fifth month, renchen: the military examination was restored.",
  },
  s0476: {
    literal: "On jiawu an edict: Eastern Capital metropolitan Ji and Ruzhou overall defense commissioner and deputy should cease; their three thousand seven hundred thirty troops should be divided between the metropolitan regent and Ruzhou defense commissioner by Ji and Ru boundaries.",
    idiomatic: "On jiawu the Ji-Ru defense post was abolished and its troops split.",
  },
  s0477: {
    literal: "On xinchou Right Vice Director Pei Jun requested ten thousand strings of Jingnan miscellaneous cash to repair the Secretariat — approved.",
    idiomatic: "On xinchou Pei Jun took ten thousand strings from Jingnan to repair the Secretariat.",
  },
  s0478: {
    literal: "On bingwu in the main court the Nine Surnames' Uighur qaghan was enfeoffed Tengri Bolu Mishi Hehu Piqie Huaixin Qaghan.",
    idiomatic: "On bingwu the Uighur qaghan was enfeoffed in the main court.",
  },
  s0479: {
    literal: "Sixth month, wuchen: an edict, because money was scarce, wished to establish a hoarding-money ordinance; first proclaim to all under Heaven that merchants hoarding money must promptly trade at market and may not hoard money.",
    idiomatic: "Sixth month, wuchen: a hoarding-money ban was proclaimed before scarcity measures.",
  },
  s0480: {
    literal: "Silver mines throughout the empire may not be privately mined.",
    idiomatic: "Private silver mining was forbidden empire-wide.",
  },
  s0481: {
    literal: "On guihai Yongguan general Huang Shaoqing was made Guishun prefect; younger brothers Shaogao and Shaowen were also granted office — chiefs of the Western Yuan barbarians who in Zhenyuan had repeatedly raided Yongguan, now submitting.",
    idiomatic: "On guihai Western Yuan chiefs who had raided Yongguan were enfeoffed after submission.",
  },
  s0482: {
    literal: "On yichou twenty-two private Jiang-Huai dams and embankments were abolished — following the transport commissioner's memorial.",
    idiomatic: "On yichou twenty-two private Jiang-Huai dams were torn down on the transport commissioner's advice.",
  },
  s0483: {
    literal: "On jiaxu Henan Intendant Guan Chuqing was made Eastern Capital regent.",
    idiomatic: "On jiaxu Guan Chuqing became Luoyang regent.",
  },
  s0484: {
    literal: "On dingchou seven hundred Shatuo and Tujue brought kin and submitted to Zhenwu commissioner Fan Xichao; their great chief was made Yinshan prefecture protector.",
    idiomatic: "On dingchou seven hundred Shatuo and Turks submitted to Fan Xichao; their chief became Yinshan protector.",
  },
  s0485: {
    literal: "Autumn, seventh month, xinsi new moon: there was a solar eclipse.",
    idiomatic: "Seventh month, xinsi new moon: eclipse.",
  },
  s0486: {
    literal: "On jihai the Anyi and Jie county salt-pool deputies of revenue were again made salt monopoly commissioners.",
    idiomatic: "On jihai Anyi and Jie salt pools regained monopoly commissioners.",
  },
  s0487: {
    literal: "On dingwei Fu prefecture was again placed under Qianzhong circuit.",
    idiomatic: "On dingwei Fu prefecture returned to Qianzhong circuit.",
  },
  s0488: {
    literal: "Eighth month, gengshen: Eastern Capital defense troops of seven hundred were restored.",
    idiomatic: "Eighth month, gengshen: seven hundred Luoyang defense troops were restored.",
  },
  s0489: {
    literal: "Ninth month, jichou: Huainan commissioner Wang E came to court.",
    idiomatic: "Ninth month, jichou: Wang E of Huainan came to court.",
  },
  s0490: {
    literal: "On gengyin Shannan East commissioner Yu Di was made acting Minister of Works and Grand Councilor;",
    idiomatic: "On gengyin Yu Di became acting Works minister and councilor;",
  },
  s0491: {
    literal: "Right Vice Director Pei Jun was made acting Left Vice Director, Grand Councilor, and Xiangzhou senior administrator, Shannan East commissioner;",
    idiomatic: "Pei Jun moved to Shannan East as councilor;",
  },
  s0492: {
    literal: "Xuanwu's Han Hong was advanced to Grand Councilor.",
    idiomatic: "Han Hong of Xuanwu joined the council.",
  },
  s0493: {
    literal: "On bingshen Revenue Vice Minister Pei Ji was made Vice Director and Grand Councilor.",
    idiomatic: "On bingshen Pei Ji entered the council.",
  },
  s0494: {
    literal: "On wuxu Vice Director and Grand Councilor Li Jifu was made acting War Minister, concurrent Vice Director, Grand Councilor, Yangzhou metropolitan senior administrator, and Huainan commissioner.",
    idiomatic: "On wuxu Li Jifu went to Huainan as councilor.",
  },
  s0495: {
    literal: "Huainan commissioner Wang E was made acting Grand Mentor, Hedong Intendant, and Hedong Jin- Jiang- Ci- Long commissioner.",
    idiomatic: "Wang E of Huainan succeeded Du Huangxiang at Hedong.",
  },
  s0496: {
    literal: "Hedong commissioner, acting Minister of Works, Grand Councilor, Duke of Bin Du Huangxiang died.",
    idiomatic: "Du Huangxiang of Hedong died.",
  },
  s0497: {
    literal: "That autumn the capital region had great rain.",
    idiomatic: "That autumn Chang'an saw heavy rains.",
  },
  s0498: {
    literal: "Tenth month, jiyou new moon.",
    idiomatic: "The tenth month opened on jiyou.",
  },
  s0499: {
    literal: "On guihai Acting Court of Imperial Sacrifices Director Gao Ying was made Censor-in-Chief.",
    idiomatic: "On guihai Gao Ying became Censor-in-Chief.",
  },
  s0500: {
    literal: "On jiazi Censor-in-Chief Dou Qun was made Hunan observer; after he had departed he was changed to Qianzhong observer.",
    idiomatic: "On jiazi Dou Qun was sent to Hunan, then reassigned to Qianzhong.",
  },
};const source = loadSentencesFromData();
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
if (data.metadata.chapter !== '014') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 014; standalone T ready (${Object.keys(T).length} entries).`
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
