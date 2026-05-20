#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.007, Zhongzong & Ruizong annals — Shenlong 2 through Jinglong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/007.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: 'An edict restored Zhou and Sui as the two former dynasties, as of old.',
    idiomatic: 'An edict restored Zhou and Sui as the two former dynasties, as before.',
  },
  s0102: {
    literal: 'On renchen Prince Qianli of Chengji commandery was enfeoffed as Prince of Cheng.',
    idiomatic: 'On renchen Prince Qianli of Chengji was made Prince of Cheng.',
  },
  s0103: {
    literal: 'On guisi Attendant-in-Chief Jing Hui was enfeoffed as Prince of Pingyang commandery;',
    idiomatic: 'On guisi Jing Hui, attendant-in-chief, was made Prince of Pingyang;',
  },
  s0104: {
    literal: 'Attendant-in-Chief Huan Yanfan as Prince of Fuyang commandery, granted the surname Wei;',
    idiomatic: 'Huan Yanfan as Prince of Fuyang, granted the Wei surname;',
  },
  s0105: {
    literal: 'Secretariat Director Zhang Jianzhi as Prince of Hanyang commandery;',
    idiomatic: 'Zhang Jianzhi as Prince of Hanyang;',
  },
  s0106: {
    literal: 'Secretariat Director Yuan Shuji as Prince of Nanyang commandery;',
    idiomatic: 'Yuan Shuji as Prince of Nanyang;',
  },
  s0107: {
    literal: 'Special Advance Cui Xuanwei as Prince of Hailing commandery;',
    idiomatic: 'Cui Xuanwei as Prince of Hailing;',
  },
  s0108: {
    literal: 'all were given the special advance rank and ceased participation in government.',
    idiomatic: 'all were made special advance and left the council.',
  },
  s0109: {
    literal: 'Wei Anshi, Minister of Personnel, became concurrent Secretariat Director; Wei Yuanzhong, Minister of War, became concurrent Attendant-in-Chief.',
    idiomatic: 'Wei Anshi, minister of personnel, became concurrent secretariat director; Wei Yuanzhong, minister of war, concurrent attendant-in-chief.',
  },
  s0110: {
    literal: 'The empress memorialized requesting that all commoners throughout the realm observe three years\' mourning for a stepmother, that adulthood be fixed at twenty-two, and that corvée end at fifty-nine.',
    idiomatic: 'The empress asked that commoners mourn a stepmother three years, that adulthood begin at twenty-two, and corvée end at fifty-nine.',
  },
  s0111: {
    literal: 'On guimao Prince Sansi of Liang was demoted to Prince of Dejing commandery; Prince Youji of Ding to Prince of Leshou commandery; Prince Yizong of Henei and more than ten others were all demoted to dukes of states.',
    idiomatic: 'On guimao Wu Sansi was demoted to Prince of Dejing; Wu Youji to Prince of Leshou; Wu Yizong of Henei and a dozen others to state dukes.',
  },
  s0112: {
    literal: 'On jiachen Special Advance Dou Lu Qinwang became Left Vice Director of the Department of State Affairs; Pacifying-the-State Grand General Tang Xiujing became Right Vice Director—both equal in rank to the Three Offices at the Secretariat Chancellery, as before.',
    idiomatic: 'On jiachen Dou Lu Qinwang became left vice minister of state and Tang Xiujing right vice minister, each of third rank at the Secretariat Chancellery.',
  },
  s0113: {
    literal: 'An edict granted a hundred households in the lands of Zou and Lu as a fief for the Grand Master and Duke of Sagely Way Confucius to supply sacrifices,',
    idiomatic: 'An edict set aside a hundred households in Zou and Lu to supply sacrifices for Confucius, grand master and duke of the sagely way,',
  },
  s0114: {
    literal: 'and also appointed his descendant Chongji, Marquis Who Honors the Sage, as Palace Gentleman for Promotion of Virtue, with permission for his descendants to inherit in perpetuity.',
    idiomatic: 'and made his descendant Chongji, marquis who honors the sage, a palace gentleman for promotion of virtue, inheritable in perpetuity.',
  },
  s0115: {
    literal: 'In the sixth month, on dingsi, seventeen Hebei prefectures suffered great floods that drowned the people\'s dwellings.',
    idiomatic: 'In the sixth month, on dingsi, seventeen Hebei prefectures flooded and drowned countless homes.',
  },
  s0116: {
    literal: 'On guihai Left Vice Director of the Department of State Affairs Dou Lu Qinwang—on weighty matters of state the Secretariat and Chancellery may jointly deliberate;',
    idiomatic: 'On guihai Dou Lu Qinwang, left vice minister—on weighty affairs the secretariat and chancellery might jointly deliberate;',
  },
  s0117: {
    literal: 'Acting Secretariat Director Wei Anshi became Secretariat Director and concurrent Minister of Personnel;',
    idiomatic: 'acting director Wei Anshi became secretariat director and concurrent minister of personnel;',
  },
  s0118: {
    literal: 'Acting Attendant-in-Chief Wei Yuanzhong became concurrent Minister of War;',
    idiomatic: 'acting attendant Wei Yuanzhong became concurrent minister of war;',
  },
  s0119: {
    literal: 'Yang Zaisi became concurrent Minister of Revenue and Acting Secretariat Director.',
    idiomatic: 'Yang Zaisi became concurrent minister of revenue and acting secretariat director.',
  },
  s0120: {
    literal: 'On dingmao the spirit tablet of the Filial and Respectful Emperor was placed in the ancestral temple.',
    idiomatic: 'On dingmao the tablet of the Filial and Respectful Emperor entered the ancestral temple.',
  },
  s0121: {
    literal: 'The temple name Yizong was contrary to ritual.',
    idiomatic: 'The temple name Yizong violated ritual.',
  },
  s0122: {
    literal: 'On wuchen the Luo River rose in flood and destroyed more than two thousand houses; the drowned were very many.',
    idiomatic: 'On wuchen the Luo burst its banks, wrecked more than two thousand houses, and drowned a great multitude.',
  },
  s0123: {
    literal: 'In the seventh month, on xinsi, Crown Prince Mentor Wei Juyuan became equal in rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic: 'In the seventh month, on xinsi, Wei Juyuan, crown prince mentor, joined the third rank at the Secretariat Chancellery.',
  },
  s0124: {
    literal: 'On yiwei Special Advance Zhang Jianzhi, Duke of Hanyang, was made prefect of Xiangzhou, still without charge of prefectural affairs.',
    idiomatic: 'On yiwei Zhang Jianzhi, special advance and Duke of Hanyang, was sent to Xiangzhou as nominal prefect without governing authority.',
  },
  s0125: {
    literal: 'In the eighth month, on wushen, because of the flood disaster, civil and military officials of the ninth rank and above were ordered to remonstrate with utmost frankness.',
    idiomatic: 'In the eighth month, on wushen, after the floods the emperor ordered officials of the ninth rank and above to remonstrate without reserve.',
  },
  s0126: {
    literal: 'The people of Henan and Luoyang who suffered flood damage were granted tax relief for one year.',
    idiomatic: 'Henan and Luoyang flood victims received one year\'s tax relief.',
  },
  s0127: {
    literal: 'On jiazi the late consort Zhao was posthumously created Respectful Empress, and the Filial and Respectful Consort Pei was honored as Lamenting Empress.',
    idiomatic: 'On jiazi the late Consort Zhao was made Respectful Empress and Consort Pei, mother of the Filial and Respectful Emperor, Lamenting Empress.',
  },
  s0128: {
    literal: 'On yihai the emperor personally placed in the temple the spirit tablets of the Founding Ancestor, the Radiant Ancestor, the Primordial Ancestor, the Divine Yao Ancestor, the Literary and Martial Ancestor Taizong, the Filial and High Ancestor, and the Filial and Respectful Emperor.',
    idiomatic: 'On yihai the emperor personally enshrined the tablets from the founding ancestor through Gaozong and the Filial and Respectful Emperor.',
  },
  s0129: {
    literal: 'The empress visited the empresses\' temple.',
    idiomatic: 'The empress visited the temple of empresses.',
  },
  s0130: {
    literal: 'On dingchou he viewed the Dipper and constellations at the south gate of Luoyang.',
    idiomatic: 'On dingchou he watched the stars at Luoyang\'s south gate.',
  },
  s0131: {
    literal: 'In the ninth month, on renwu, he personally sacrificed at the Bright Hall and proclaimed a general amnesty.',
    idiomatic: 'In the ninth month, on renwu, he sacrificed at the Bright Hall in person and proclaimed amnesty.',
  },
  s0132: {
    literal: 'The Conversion of the Barbarians Sutra was forbidden, and among families marrying it was forbidden to suspend mourning when parents or parents-in-law died.',
    idiomatic: 'The Conversion of the Barbarians Sutra was banned, and families were forbidden to skip mourning rites when parents or parents-in-law died.',
  },
  s0133: {
    literal: 'Public feasting throughout the realm for three days.',
    idiomatic: 'The realm feasted for three days.',
  },
  s0134: {
    literal: 'On wuxu Crown Prince Mentor Wei Juyuan became Minister of Rites, retaining participation in government.',
    idiomatic: 'On wuxu Wei Juyuan became minister of rites while keeping his seat on the council.',
  },
  s0135: {
    literal: 'In the tenth winter month, on guihai, he visited Longmen Xiangshan Monastery.',
    idiomatic: 'In the tenth winter month, on guihai, he went to Longmen Xiangshan Monastery.',
  },
  s0136: {
    literal: 'On yichou he visited Xin\'an.',
    idiomatic: 'On yichou he went to Xin\'an.',
  },
  s0137: {
    literal: 'The Hongwen Institute was changed to the Cultivated Literature Institute.',
    idiomatic: 'The Hongwen Institute was renamed the Cultivated Literature Institute.',
  },
  s0138: {
    literal: 'On xinwei Wei Yuanzhong became Secretariat Director; Yang Zaisi became Attendant-in-Chief.',
    idiomatic: 'On xinwei Wei Yuanzhong became secretariat director and Yang Zaisi attendant-in-chief.',
  },
  s0139: {
    literal: 'In the eleventh month, on wuyin, the emperor\'s honorific was extended to Responsive-to-Heaven; the empress\'s to Obedient-to-Heaven.',
    idiomatic: 'In the eleventh month, on wuyin, the emperor took the added title Responsive-to-Heaven and the empress Obedient-to-Heaven.',
  },
  s0140: {
    literal: 'On renwu the emperor and empress personally visited the ancestral temple to announce the receipt of the honorifics; a general amnesty was proclaimed and feasting granted for three days.',
    idiomatic: 'On renwu the emperor and empress announced their new titles at the ancestral temple, proclaimed amnesty, and feasted three days.',
  },
  s0141: {
    literal: 'On jichou he viewed the Cold-Dispelling Hu play from the south gate tower of Luoyang.',
    idiomatic: 'On jichou he watched the Cold-Dispelling Hu play from Luoyang\'s south gate tower.',
  },
  s0142: {
    literal: 'On xinchou Prince Chongjun of Wei became left guard general and from afar military governor of Yangzhou;',
    idiomatic: 'On xinchou Prince Chongjun of Wei became left guard general and titular governor of Yangzhou;',
  },
  s0143: {
    literal: 'Prince Chongmao of Wen became right guard general and from afar military governor of Bingzhou.',
    idiomatic: 'Prince Chongmao of Wen became right guard general and titular governor of Bingzhou.',
  },
  s0144: {
    literal: 'On renyin the Great Sage Emperor Zetian died.',
    idiomatic: 'On renyin Empress Zetian died.',
  },
  s0145: {
    literal: 'In the first spring month of Shenlong 2, on bingchen, the late empress\'s coffin was escorted back to the capital.',
    idiomatic: 'In the first spring month of Shenlong 2, on bingchen, Zetian\'s coffin was escorted back to Chang\'an.',
  },
  s0146: {
    literal: 'On wuxu Li Qiao, Minister of Personnel, became equal in rank to the Three Offices at the Secretariat Chancellery; Vice Minister of the Secretariat Yu Weiqian became equal in rank to the Three Offices at the Secretariat Chancellery as associate councilor.',
    idiomatic: 'On wuxu Li Qiao, minister of personnel, and Yu Weiqian, secretariat vice minister, joined the third rank at the Secretariat Chancellery.',
  },
  s0147: {
    literal: 'In the intercalary month, on bingwu, the new moon, staff were established for princesses\' households.',
    idiomatic: 'In the intercalary month, on bingwu at the new moon, princesses\' households were given official staffs.',
  },
  s0148: {
    literal: 'On yimao Special Advances Jing Hui, Huan Yanfan, and Yuan Shuji were made prefects of Hua, Ming, and Yu.',
    idiomatic: 'On yimao Jing Hui, Huan Yanfan, and Yuan Shuji were sent out as prefects of Hua, Ming, and Yu.',
  },
  s0149: {
    literal: 'In the second month, on yiwei, Wei Juyuan, Minister of Punishments, became equal in rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic: 'In the second month, on yiwei, Wei Juyuan, minister of punishments, joined the third rank at the Secretariat Chancellery.',
  },
  s0150: {
    literal: 'Ten envoys were dispatched to inspect customs throughout the realm.',
    idiomatic: 'Ten envoys were sent to inspect customs empire-wide.',
  },
  s0151: {
    literal: 'On bingchen more than ten monks including Huifan and Daoist Shi Chongxuan were granted offices and enfeoffed as dukes, as a routine reward for work on the Sagely Goodness Monastery.',
    idiomatic: 'On bingchen the monk Huifan, the Daoist Shi Chongxuan, and more than ten others were given offices and dukedoms for routine work on the Sagely Goodness Monastery.',
  },
  s0152: {
    literal: 'In the third month, on jiachen, Wei Anshi, Secretariat Director, became Minister of Revenue and ceased participation in government.',
    idiomatic: 'In the third month, on jiachen, Wei Anshi left the council to become minister of revenue.',
  },
  s0153: {
    literal: 'Su Gui, Minister of Revenue, became Attendant-in-Chief and Capital Intendant.',
    idiomatic: 'Su Gui, minister of revenue, became attendant-in-chief and capital intendant.',
  },
  s0154: {
    literal: 'On yisi yellow fog filled the four quarters.',
    idiomatic: 'On yisi yellow fog shrouded the horizon.',
  },
  s0155: {
    literal: 'Tang Xiujing requested retirement; permission was granted.',
    idiomatic: 'Tang Xiujing asked to retire and was allowed.',
  },
  s0156: {
    literal: 'On gengxu Wang Tongjiao, Director of the Office of the Imperial Sons-in-Law and commandant-consort, was executed.',
    idiomatic: 'On gengxu Wang Tongjiao, director of the office of imperial sons-in-law, was executed.',
  },
  s0157: {
    literal: 'On renzi, about seven li east of Luoyang city, the ground had the color of water; nearby trees and passing carriages and horses cast clear reflections in it as in water; after more than a month it vanished.',
    idiomatic: 'On renzi, seven li east of Luoyang, the earth shone like water and trees and carts cast mirror-clear reflections for more than a month.',
  },
  s0158: {
    literal: 'That month supernumerary officials were greatly increased: from capital offices and all prefectural aides more than two thousand in all; more than a thousand eunuchs of the seventh rank and above and supernumeraries were abruptly promoted.',
    idiomatic: 'That month the court flooded the ranks with more than two thousand supernumeraries from capital and provinces and abruptly promoted more than a thousand eunuchs of the seventh rank and above.',
  },
  s0159: {
    literal: 'On renxu the empress\'s late father Xuanzhen was posthumously made Grand Preceptor and military governor of Yizhou.',
    idiomatic: 'On renxu the empress\'s father Xuanzhen was posthumously made grand preceptor and governor of Yizhou.',
  },
  s0160: {
    literal: 'In the fourth summer month, on jiaxu, Xuanzhen was again posthumously made Prince of Feng; his four younger brothers were all posthumously made commandery princes.',
    idiomatic: 'In the fourth summer month, on jiaxu, Xuanzhen was made posthumous Prince of Feng and four younger brothers posthumous commandery princes.',
  },
  s0161: {
    literal: 'On jimao Zuo Sanqi Changshi Li Huaiyuan requested retirement; permission was granted.',
    idiomatic: 'On jimao Li Huaiyuan, left sanqi attendant, retired with permission.',
  },
  s0162: {
    literal: 'On xinsi the Luo River rose in flood and destroyed the Tianjin Bridge.',
    idiomatic: 'On xinsi the Luo in flood wrecked the Tianjin Bridge.',
  },
  s0163: {
    literal: 'In the sixth month, on wuyin, Special Advance Jing Hui, Duke of Pingyang and prefect of Lang, was demoted to military affairs officer of Yazhou; Special Advance Huan Yanfan, Duke of Fuyang and prefect of Bozhou, to military affairs officer of Longzhou; Special Advance Yuan Shuji, prefect of E, to military affairs officer of Douzhou; Special Advance Cui Xuanwei, Duke of Boling and prefect of Jun, to military affairs officer of Baizhou; Special Advance Zhang Jianzhi, Duke of Hanyang and prefect of Xiang, to military affairs officer of Xin—all supernumerary appointments, long tenure, and former offices, titles, and fiefs were posthumously stripped.',
    idiomatic: 'In the sixth month, on wuyin, the five restoration heroes—Jing Hui, Huan Yanfan, Yuan Shuji, Cui Xuanwei, and Zhang Jianzhi—were demoted to petty frontier posts as supernumeraries for life, and their old honors and fiefs were stripped.',
  },
  s0164: {
    literal: 'In the seventh month, on bingwu, Prince Chongjun of Wei was installed as crown prince.',
    idiomatic: 'In the seventh month, on bingwu, Prince Chongjun of Wei was made crown prince.',
  },
  s0165: {
    literal: 'On bingyin Secretariat Director and concurrent Minister of War Wei Yuanzhong, Duke of Qi, became Right Vice Director of the Department of State Affairs and concurrent Secretariat Director, still in charge of war;',
    idiomatic: 'On bingyin Wei Yuanzhong, secretariat director and Duke of Qi, became right vice minister of state and kept the secretariat and war portfolios;',
  },
  s0166: {
    literal: 'Li Qiao, Minister of Personnel, became Secretariat Director;',
    idiomatic: 'Li Qiao became secretariat director;',
  },
  s0167: {
    literal: 'Wei Juyuan, Minister of Punishments, became Minister of Personnel, retaining equal rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic: 'Wei Juyuan became minister of personnel while keeping his third rank at the Secretariat Chancellery.',
  },
  s0168: {
    literal: 'On gengwu Zhu Qinming, Minister of Rites, was impeached by Censor-in-Chief Xiao Zhizhong.',
    idiomatic: 'On gengwu Zhu Qinming, minister of rites, was impeached by Xiao Zhizhong, censor-in-chief.',
  },
  s0169: {
    literal: 'The former Left Sanqi Changshi Li Huaiyuan became Left Sanqi Changshi, equal in rank to the Three Offices at the Secretariat Chancellery, and Eastern Capital Intendant.',
    idiomatic: 'Li Huaiyuan returned as left sanqi attendant of third rank and eastern capital intendant.',
  },
  s0170: {
    literal: 'In the ninth month Zhu Qinming was demoted to prefect of Qingzhou.',
    idiomatic: 'In the ninth month Zhu Qinming was demoted to Qingzhou.',
  },
  s0171: {
    literal: 'On renyin he visited Baima Monastery.',
    idiomatic: 'On renyin he went to Baima Monastery.',
  },
  s0172: {
    literal: 'On wuwu Left Sanqi Changshi Li Huaiyuan died.',
    idiomatic: 'On wuwu Li Huaiyuan died.',
  },
  s0173: {
    literal: 'On renyin one post of Vice Minister of Revenue was established.',
    idiomatic: 'On renyin a second vice minister of revenue was established.',
  },
  s0174: {
    literal: 'In the tenth winter month, on jimao, the imperial carriage returned to the capital.',
    idiomatic: 'In the tenth winter month, on jimao, the court returned to Chang\'an.',
  },
  s0175: {
    literal: 'On wuxu he arrived from the eastern capital.',
    idiomatic: 'On wuxu he arrived from Luoyang.',
  },
  s0176: {
    literal: 'In the eleventh month, on yisi, a general amnesty was proclaimed; civil and military officials in the procession received one turn on the merit roll.',
    idiomatic: 'In the eleventh month, on yisi, the court proclaimed amnesty and granted one merit turn to officials in the cortège.',
  },
  s0177: {
    literal: 'Henan was renamed Hegong, Luoyang Yongchang, Songyang Dengfeng, and Yangcheng Gaocheng.',
    idiomatic: 'Henan became Hegong, Luoyang Yongchang, Songyang Dengfeng, and Yangcheng Gaocheng.',
  },
  s0178: {
    literal: 'On wuwu Zheng Pusi, concurrent secretary of the Secretariat, was banished to Danzhou for sorcery and treason; his faction was all executed.',
    idiomatic: 'On wuwu Zheng Pusi, acting secretariat secretary, was exiled to Danzhou for sorcery; his faction was executed to the last man.',
  },
  s0179: {
    literal: 'On jimao the Turkic khan Mojilie raided Mingsha County in Ling Prefecture; Shazha Zhongyi, grand general of the Lingwu Army, met him in battle; the government army was defeated and thirty thousand died.',
    idiomatic: 'On jimao the Turk Mojilie raided Mingsha in Ling; Shazha Zhongyi of the Lingwu army met him and lost thirty thousand men.',
  },
  s0180: {
    literal: 'On dingsi the Turks advanced to raid Yuan and Hui and other prefectures, seizing more than ten thousand horses from the Longyou stud farms before withdrawing.',
    idiomatic: 'On dingsi the Turks raided Yuan, Hui, and neighboring prefectures and drove off more than ten thousand Longyou horses.',
  },
  s0181: {
    literal: 'On jiashen anyone who could slay Mojilie was to be enfeoffed and granted the rank of great general of the various guards.',
    idiomatic: 'On jiashen the throne promised enfeoffment and guard general rank to whoever could kill Mojilie.',
  },
  s0182: {
    literal: 'On bingxu, because the Turks violated the frontier and the capital suffered severe drought, the court ordered reduced meals and suspended music.',
    idiomatic: 'On bingxu, with Turks on the border and Chang\'an in drought, the court ate sparingly and silenced the music.',
  },
  s0183: {
    literal: 'In Hebei great floods brought famine; Attendant-in-Chief Su Gui was ordered to comfort and grant relief.',
    idiomatic: 'Hebei flooded and starved; Su Gui, attendant-in-chief, was sent to comfort and relieve.',
  },
  s0184: {
    literal: 'On bingchen Special Advance Dou Lu Qinwang, Left Vice Director of the Department of State Affairs and concurrent chief administrator of the Pacifying-the-State Prince of Xiang\'s household and Duke of Ruiguo, became Palace Minister of the First Rank, retaining deliberation on weighty military and state affairs;',
    idiomatic: 'On bingchen Dou Lu Qinwang became palace minister of the first rank while still deliberating weighty state affairs;',
  },
  s0185: {
    literal: 'Wei Yuanzhong, Right Vice Director of the Department of State Affairs and concurrent Secretariat Director, in charge of war, Duke of Qi, became Left Vice Director of the Department of State Affairs and concurrent Secretariat Director, still in charge of war.',
    idiomatic: 'Wei Yuanzhong moved to left vice minister of state while keeping the secretariat and war portfolios.',
  },
  s0186: {
    literal: 'That winter cattle suffered a great epidemic.',
    idiomatic: 'That winter a plague killed cattle across the realm.',
  },
  s0187: {
    literal: 'In the first year of Jinglong, on gengzi, the new moon, he did not hold court; mourning had not yet reached the second anniversary.',
    idiomatic: 'In Jinglong 1, on the gengzi new moon of the first spring month, he held no audience; mourning for Zetian had not yet completed two years.',
  },
  s0188: {
    literal: 'On gengxu, because Mojilie raided the frontier, an edict recruited men of surpassing martial skill to nominate themselves, and civil and military officials within and without were each to submit plans for destroying the Turks.',
    idiomatic: 'On gengxu, with Mojilie raiding, the throne called for self-nominated warriors and asked every official for plans to crush the Turks.',
  },
  s0189: {
    literal: 'On bingchen, because of drought, he personally reviewed prisoners.',
    idiomatic: 'On bingchen, in drought, he reviewed prisoners in person.',
  },
  s0190: {
    literal: 'On jisi Wu Youji and Wu Sansi were sent to Qianling to pray for rain at the tomb of Empress Zetian; rain then fell, and the emperor was deeply moved.',
    idiomatic: 'On jisi Wu Youji and Wu Sansi prayed for rain at Zetian\'s tomb at Qianling; when rain fell the emperor was deeply moved.',
  },
  s0191: {
    literal: 'In the second month, on xinwei, an edict restored sacrifices at the Wu Chong\'en Temple as of old, with fifth-rank directors and seventh-rank aides; the Hao and Shun tombs likewise received directors and aides as at a temple.',
    idiomatic: 'In the second month, on xinwei, the Wu Chong\'en Temple sacrifices were restored with fifth-rank directors and seventh-rank aides, and the Hao and Shun tombs staffed likewise.',
  },
  s0192: {
    literal: 'On renwu the late Grand Preceptor and Prince of Feng was given the temple name Lauding Virtue and the tomb name Glorious Ancestor, with sixth-rank directors and eighth-rank aides.',
    idiomatic: 'On renwu the late Prince of Feng was temple-named Lauding Virtue and tomb-named Glorious Ancestor, with sixth-rank directors and eighth-rank aides.',
  },
  s0193: {
    literal: 'On gengyin monasteries and abbeys named Restoration were changed to Dragon Rise; within and without it was forbidden to speak of "restoration."',
    idiomatic: 'On gengyin Restoration monasteries and abbeys were renamed Dragon Rise, and the word restoration was banned.',
  },
  s0194: {
    literal: 'On xinmao he visited Princess Anle\'s residence.',
    idiomatic: 'On xinmao he visited Princess Anle\'s mansion.',
  },
  s0195: {
    literal: 'In the third month, on bingzi, the Tibetan king sent the minister Xidongre with tribute.',
    idiomatic: 'In the third month, on bingzi, Tibet sent the minister Xidongre with tribute.',
  },
  s0196: {
    literal: 'That spring, from the capital to Shandong pestilence raged and the people died in great numbers.',
    idiomatic: 'That spring plague swept from Chang\'an to Shandong and killed multitudes.',
  },
  s0197: {
    literal: 'In Hebei and Henan there was great drought.',
    idiomatic: 'Hebei and Henan suffered severe drought.',
  },
  s0198: {
    literal: 'In the fourth summer month, on xinsi, the daughter of the Prince of Yong, heir of the deposed line, was made Princess Jincheng and sent to marry the Tibetan king.',
    idiomatic: 'In the fourth summer month, on xinsi, Prince Shouli\'s daughter was made Princess Jincheng and sent to marry the Tibetan king.',
  },
  s0199: {
    literal: 'On gengyin he visited Jianfu Monastery and granted a special amnesty to Yong Prefecture.',
    idiomatic: 'On gengyin he went to Jianfu Monastery and granted a special amnesty to Yong Prefecture.',
  },
  s0200: {
    literal: 'In the fifth month, on wuxu, Zhang Renbian, left general of the Left Garrison Guard and concurrent acting prefect of Luozhou, became grand general of the Shuofang circuit to guard against the Turks.',
    idiomatic: 'In the fifth month, on wuxu, Zhang Renbian, left garrison general and acting Luozhou prefect, became Shuofang grand general against the Turks.',
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
if (data.metadata.chapter !== '007') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 007; standalone T ready (${Object.keys(T).length} entries).`
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
