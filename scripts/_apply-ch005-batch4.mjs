#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.005, Gaozong 2 — Tiaolu through Yongchun) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/005.json';
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
    literal: 'On gengxu, Dai Zhide, Right Vice Director of the Secretariat and Duke of Daoguo, died.',
    idiomatic: 'On gengxu, Dai Zhide, right vice director of the secretariat and Duke of Daoguo, died.',
  },
  s0302: {
    literal: 'Second month, renxu: the Tufan zanpu died; envoys were sent to mourn him.',
    idiomatic: 'In the second month, on renxu, the Tibetan king died; the court sent envoys to mourn him.',
  },
  s0303: {
    literal:
      'On yichou, famine struck the eastern capital; the government issued husked rice to feed the hungry.',
    idiomatic:
      'On yichou, with famine in the eastern capital, officials issued husked rice to the starving.',
  },
  s0304: {
    literal: 'Fourth month, summer, wuwu: Mars entered the Feathered Forest constellation.',
    idiomatic: 'On wuwu in the fourth summer month, Mars entered the Feathered Forest.',
  },
  s0305: {
    literal:
      'Left Assistant Cui Zhiti became Minister of Revenue; Palace Secretariat Director Hao Chujun became Palace Attendant.',
    idiomatic:
      'Left assistant Cui Zhiti became minister of revenue; secretariat director Hao Chujun became palace attendant.',
  },
  s0306: {
    literal: 'Fifth month, renwu: the Remonstrator of the Left Ming Chongyan was murdered by bandits.',
    idiomatic: 'On renwu in the fifth month, bandits killed left remonstrator Ming Chongyan.',
  },
  s0307: {
    literal: 'On bingxu the crown prince Xian acted as regent.',
    idiomatic: 'On bingxu Crown Prince Xian took up regency.',
  },
  s0308: {
    literal: 'On wuxu the Purple Cassia Palace was built west of Mian Pool.',
    idiomatic: 'On wuxu he built Purple Cassia Palace west of Mian Pool.',
  },
  s0309: {
    literal:
      'Sixth month, xinhai: a great amnesty was proclaimed for all under Heaven; the fourth year of Yifeng was changed to the first year of Tiaolu.',
    idiomatic:
      'On xinhai in the sixth month he proclaimed a general amnesty and renamed Yifeng 4 as Tiaolu 1.',
  },
  s0310: {
    literal:
      'Seventh month, autumn, on the yimao new moon: an edict ordered the winter solstice of this year to hold rites at Mount Song; ritual officers and academicians were to fix the protocol in detail.',
    idiomatic:
      'On the yimao new moon of the seventh autumn month he decreed winter solstice rites at Mount Song and told ritual officers and scholars to draft the protocol.',
  },
  s0311: {
    literal:
      'Eighth month, dingsi: Palace Attendant Hao Chujun, Left Heir-Apparent Tutor Gao Zhizhou, Vice Director of the Secretariat Cui Zhiwen, and Drafting Attendant Liu Jingxian were additionally ordered to compile the national history.',
    idiomatic:
      'On dingsi in the eighth month, Hao Chujun, Gao Zhizhou, Cui Zhiwen, and Liu Jingxian were also assigned to compile the national history.',
  },
  s0312: {
    literal:
      'Ninth month, renwu: Vice Director of the Ministry of Personnel Pei Xingjian campaigned against the Western Turks and brought back the ten-clan qaghan Ashina Duzhi and the subordinate chief Li Zhebi.',
    idiomatic:
      'On renwu in the ninth month, vice minister Pei Xingjian defeated the Western Turks and returned with qaghan Ashina Duzhi of the ten clans and subordinate chief Li Zhebi.',
  },
  s0313: {
    literal:
      'Tenth month, winter: Wen Fu of the Ashide clan and Fengzhi of the two tribes under the Protectorate General of the Pacified North rebelled together, enthroning Ashina Nishufu as qaghan; chieftains of twenty-four prefectures all rose.',
    idiomatic:
      'In the tenth winter month, Ashide Wen Fu and Fengzhi rebelled in the pacified north, set up Ashina Nishufu as qaghan, and twenty-four prefectural chiefs joined them.',
  },
  s0314: {
    literal:
      'Chief Secretary of the Protectorate Xiao Siye and Generals Hua Dazhi and Li Jingjia were sent to attack them.',
    idiomatic:
      'Chief secretary Xiao Siye and generals Hua Dazhi and Li Jingjia were dispatched against them.',
  },
  s0315: {
    literal: 'They fought the Turks and were defeated by the rebels.',
    idiomatic: 'In battle with the Turks they were beaten.',
  },
  s0316: {
    literal: 'Siye was banished to Guizhou.',
    idiomatic: 'Siye was exiled to Guizhou.',
  },
  s0317: {
    literal:
      'On renzi Generals Cao Huai-shun and Cui Xian were ordered to hold Hengzhou at Jingxing and Jiangzhou at Longmen against the Turks.',
    idiomatic:
      'On renzi he sent Cao Huai-shun to guard Jingxing at Hengzhou and Cui Xian Longmen at Jiangzhou against the Turks.',
  },
  s0318: {
    literal: 'On gengshen the earlier edict for fengshan at Mount Song was halted.',
    idiomatic: 'On gengshen he suspended the planned fengshan at Mount Song.',
  },
  s0319: {
    literal:
      'On guihai Princess Wencheng of Tufan sent her minister Lun Sai-diao-pang to announce mourning and request a marriage alliance; it was refused.',
    idiomatic:
      'On guihai Tibetan envoys came mourning Princess Wencheng and seeking a marriage alliance; the court refused.',
  },
  s0320: {
    literal: 'Commandant Song Lingwen was sent to Tufan to attend the zanpu\'s funeral.',
    idiomatic: 'Commandant Song Lingwen was sent to Tibet for the king\'s funeral.',
  },
  s0321: {
    literal:
      'Eleventh month, on the wuyin new moon: Left Heir-Apparent Tutor and Same Rank as the Three Offices Gao Zhizhou left confidential counsel.',
    idiomatic:
      'On the wuyin new moon of the eleventh month, Gao Zhizhou, left heir tutor and third rank, left confidential counsel.',
  },
  s0322: {
    literal:
      'On guiwei Vice Director of Personnel Pei Xingjian was made Minister of Rites, rewarding the capture of Duzhi and Zhebi.',
    idiomatic:
      'On guiwei Pei Xingjian became minister of rites, rewarded for capturing Duzhi and Zhebi.',
  },
  s0323: {
    literal:
      'On jiachen Pei Xingjian became Grand General of the Dingxiang Circuit with one hundred eighty thousand men under Yingzhou Governor Zhou Daowu, together with Western Army Cheng Wuting and Eastern Army Li Wenhan—three hundred thousand in all—to campaign against the Turks.',
    idiomatic:
      'On jiachen Pei Xingjian took the Dingxiang command with one hundred eighty thousand men, joined by Cheng Wuting in the west and Li Wenhan in the east—three hundred thousand in all—to crush the Turks.',
  },
  s0324: {
    literal:
      'On jiayin he held the palace examination for candidates nominated by prefects and governors.',
    idiomatic:
      'On jiayin he examined at the palace candidates put forward by prefects and governors.',
  },
  s0325: {
    literal:
      'First year of Yonglong, second year, spring, first month, yiyou: he feasted princes, all offices of third rank and above, and prefectural governors at the south gate tower of Luoyang and had the newly composed dance "Six Harmonies Return to Purity" performed.',
    idiomatic:
      'Yonglong 2, on yiyou of the first spring month, he feasted princes, third-rank officials, and governors at Luoyang\'s south gate and watched the new dance "Six Harmonies Return to Purity."',
  },
  s0326: {
    literal:
      'Second month, bingwu, edict: "Former Seal Clerk Li Yanshou compiled one work, the Correct Canon; the language exhausts elegance and rectitude. Though it is lost, the merit may still be recorded—fifty bolts of silk should be granted to his household."',
    idiomatic:
      'On bingwu in the second month he decreed: "The late seal clerk Li Yanshou\'s Correct Canon, though lost, was written in refined language; grant his family fifty bolts of silk."',
  },
  s0327: {
    literal:
      'On renzi Prince Huo Yuan Gui led civil and military officials of every rank to offer one month\'s salary to aid the army campaigning against the Turks.',
    idiomatic:
      'On renzi Prince Huo Yuan Gui and the hundred officials offered one month\'s pay to support the anti-Turk campaign.',
  },
  s0328: {
    literal: 'On guichou he visited the hot springs of Ruzhou.',
    idiomatic: 'On guichou he went to the hot springs at Ruzhou.',
  },
  s0329: {
    literal: 'On dingsi he arrived at Mount Shaoshi.',
    idiomatic: 'On dingsi he reached Mount Shaoshi.',
  },
  s0330: {
    literal: 'On wuwu he personally sacrificed at the Shrine of the Young Consort.',
    idiomatic: 'On wuwu he sacrificed in person at the Young Consort Shrine.',
  },
  s0331: {
    literal:
      'The late Daoist of Yujing Abbey Wang Yuanzhi was posthumously titled True Gentleman of Ascension and given the late rank of Grand Master for Palace Counsel.',
    idiomatic:
      'The late Daoist Wang Yuanzhi of Yujing Abbey was posthumously styled True Gentleman of Ascension and made grand master for palace counsel.',
  },
  s0332: {
    literal: 'He also visited the dwelling of the recluse Tian Youyan.',
    idiomatic: 'He also called on the recluse Tian Youyan.',
  },
  s0333: {
    literal:
      'On jiwei he visited Songyang Abbey and the Shrine of Qimu and ordered steles erected at both.',
    idiomatic:
      'On jiwei he visited Songyang Abbey and the Qimu Shrine and ordered monuments raised.',
  },
  s0334: {
    literal: 'He also visited the dwelling of the wandering Daoist Pan Shizheng at Carefree Valley.',
    idiomatic: 'He also visited the Daoist Pan Shizheng at Carefree Valley.',
  },
  s0335: {
    literal: 'On jiazi he returned from the hot springs to the eastern capital.',
    idiomatic: 'On jiazi he came back from the hot springs to the eastern capital.',
  },
  s0336: {
    literal:
      'Third month: Pei Xingjian routed the Turks at Black Mountain and captured their leader Fengzhi.',
    idiomatic:
      'In the third month Pei Xingjian smashed the Turks at Black Mountain and took their leader Fengzhi.',
  },
  s0337: {
    literal: 'The false qaghan Nishufu was killed by his own men; his head was sent in surrender.',
    idiomatic: 'The puppet qaghan Nishufu was killed by his followers and his head sent in.',
  },
  s0338: {
    literal: 'Fourth month, summer, yichou: he visited Purple Cassia Palace.',
    idiomatic: 'On yichou in the fourth summer month he went to Purple Cassia Palace.',
  },
  s0339: {
    literal:
      'On wuchen Vice Directors Pei Yan and Cui Zhiwen and Secretariat Vice Director Wang Dezhen were all made Fellows of the Secretariat-Chancellery of the Third Rank.',
    idiomatic:
      'On wuchen Pei Yan, Cui Zhiwen, and Wang Dezhen all became third-rank fellows of the secretariat-chancellery.',
  },
  s0340: {
    literal: 'Fifth month, guiwei: Mars trespassed against the Ghost constellation.',
    idiomatic: 'On guiwei in the fifth month Mars crossed the Ghost Lodge.',
  },
  s0341: {
    literal: 'On dingyou the Great White star crossed the sky.',
    idiomatic: 'On dingyou Venus crossed the heavens.',
  },
  s0342: {
    literal: 'Seventh month, autumn: Tufan raided Heyuan and encamped on the Liangfei River.',
    idiomatic: 'In the seventh autumn month Tibet raided Heyuan and camped on the Liangfei River.',
  },
  s0343: {
    literal:
      'Pacification Commissioner of Hexi Li Jingxuan fought the Tufan general Zanpo in Huangzhong; the government army was defeated.',
    idiomatic:
      'Li Jingxuan, pacification commissioner of Hexi, fought the Tibetan general Zanpo at Huangzhong and was beaten.',
  },
  s0344: {
    literal:
      'At the time Left Martial Guard General Heichi Changzhi fought fiercely and routed the barbarian army; he was promoted to Commissioner of the Heyuan Army;',
    idiomatic:
      'Left guard general Heichi Changzhi fought hard, routed the Tibetans, and was made commissioner of the Heyuan army;',
  },
  s0345: {
    literal: 'Li Jingxuan was ordered to hold Qinzhou in support.',
    idiomatic: 'while Li Jingxuan held Qinzhou to back him.',
  },
  s0346: {
    literal: 'On bingshen Prince Jiang Yuan Xiang died.',
    idiomatic: 'On bingshen Prince Jiang of Jiang died.',
  },
  s0347: {
    literal: 'That month the Turk remnant besieged Yunzhou; Commandant Cheng Wuting broke them.',
    idiomatic: 'That month Turk remnants besieged Yunzhou; commandant Cheng Wuting drove them off.',
  },
  s0348: {
    literal: 'Eighth month, dingwei: he returned from Purple Cassia Palace to the eastern capital.',
    idiomatic: 'On dingwei in the eighth month he returned from Purple Cassia Palace to the eastern capital.',
  },
  s0349: {
    literal: 'On dingsi Qinzhou Governor Li Jingxuan was demoted to prefect of Hengzhou.',
    idiomatic: 'On dingsi Li Jingxuan, governor of Qinzhou, was demoted to prefect of Heng.',
  },
  s0350: {
    literal:
      'On jiazi the crown prince Xian was deposed as commoner and confined in a separate dwelling.',
    idiomatic:
      'On jiazi Crown Prince Xian was deposed to commoner rank and shut away.',
  },
  s0351: {
    literal: 'On yichou Prince Ying Zhe was installed as crown prince.',
    idiomatic: 'On yichou Prince Ying Zhe was made crown prince.',
  },
  s0352: {
    literal:
      'The second year of Tiaolu was changed to the first year of Yonglong; all under Heaven was pardoned and great feasting lasted three days.',
    idiomatic:
      'Tiaolu 2 became Yonglong 1; he pardoned the realm and held three days of public feasting.',
  },
  s0353: {
    literal:
      'Left Heir-Apparent Tutor and Fellow of the Secretariat-Chancellery Zhang Da\'an, implicated with the deposed man, was demoted to prefect of Pu.',
    idiomatic:
      'Zhang Da\'an, left heir tutor and chancellery fellow, was demoted to Pu for ties to the deposed prince.',
  },
  s0354: {
    literal:
      'Ninth month: great floods in Henan and Hebei; envoys were sent to relieve distress; the drowned were given coffins by the state and their families seven lengths of goods.',
    idiomatic:
      'In the ninth month floods ravaged Henan and Hebei; envoys brought relief, state coffins for the drowned, and seven lengths of goods to each family.',
  },
  s0355: {
    literal:
      'Tenth month, winter, renyin: Cao Wang Ming of Suzhou was enfeoffed Prince of Lingling and settled at Qianzhou for adhering to the deposed Xian.',
    idiomatic:
      'On renyin in the tenth winter month Prince Cao Ming of Suzhou was made Prince of Lingling and sent to Qianzhou for siding with the deposed prince.',
  },
  s0356: {
    literal: 'On jiwei he returned from the eastern capital to the capital.',
    idiomatic: 'On jiwei he came back from the eastern capital to Chang\'an.',
  },
  s0357: {
    literal: 'Eleventh month, new moon: there was a solar eclipse.',
    idiomatic: 'On the eleventh-month new moon the sun was eclipsed.',
  },
  s0358: {
    literal: 'Famine in Luozhou; the government sold grain at reduced price to feed the hungry.',
    idiomatic: 'Luozhou starved; officials sold grain cheap to feed the people.',
  },
  s0359: {
    literal:
      'First year of Kaiyao, second year, spring, first month: the Turks raided Yuan and Qing prefectures.',
    idiomatic:
      'Kaiyao 2, first spring month: Turks raided Yuan and Qing.',
  },
  s0360: {
    literal: 'On yihai Generals Li Zhishi and Wang Gao were ordered to meet them with divided forces.',
    idiomatic: 'On yihai he sent Li Zhishi and Wang Gao against them with separate columns.',
  },
  s0361: {
    literal:
      'On guisi Minister of Rites Pei Xingjian was made Grand General of the Dingxiang Circuit to lead troops against the Turk Wen Fu tribe.',
    idiomatic:
      'On guisi Pei Xingjian took the Dingxiang command to campaign against the Turk Wen Fu.',
  },
  s0362: {
    literal:
      'On jihai an edict exempted households of Yong, Qi, Hua, and Tong from land tax for two years, and those in flood-struck Henan and Hebei for one.',
    idiomatic:
      'On jihai he exempted Yong, Qi, Hua, and Tong from land tax for two years and flood-hit Henan and Hebei for one.',
  },
  s0363: {
    literal:
      'He addressed Yongzhou Governor Li Yixuan: "I wish to return to purity and show the realm plain substance."',
    idiomatic:
      'He told Yongzhou governor Li Yixuan: "I mean to return the realm to plain ways and show it simplicity."',
  },
  s0364: {
    literal:
      'I hear idlers abandon their trades—such people are very many; when harvests fail slightly, famine follows.',
    idiomatic:
      'I hear too many leave honest work; a thin harvest brings hunger.',
  },
  s0365: {
    literal: 'Variegated silks and flowered skirts and coats waste much and harm women\'s labor.',
    idiomatic: 'Bright silks and flowered skirts waste cloth and steal from women\'s looms.',
  },
  s0366: {
    literal:
      'The Heavenly Empress is my equal; she often wears the seven-panel slit skirt—does she not know there are still more lavish garments?',
    idiomatic:
      'The empress is my match; she still wears the seven-panel skirt—surely she knows costlier dress exists?',
  },
  s0367: {
    literal: 'Let thrift be observed.',
    idiomatic: 'See that you keep to thrift.',
  },
  s0368: {
    literal: 'Purple robes and red garments are openly worn in the lanes.',
    idiomatic: 'Purple and scarlet are worn openly in the streets.',
  },
  s0369: {
    literal: 'Rich merchants too bury their dead beyond ritual.',
    idiomatic: 'Merchants and the rich bury beyond what rites allow.',
  },
  s0370: {
    literal: 'You must seize them strictly and not let it happen again.',
    idiomatic: 'Seize offenders strictly and stop this.',
  },
  s0371: {
    literal: 'Thus ended the edict.',
    idiomatic: 'With that the edict closed.',
  },
  s0372: {
    literal:
      'Second month, bingwu: the crown prince personally performed the libation-and-offering rite.',
    idiomatic:
      'On bingwu in the second month the crown prince performed the libation rite in person.',
  },
  s0373: {
    literal:
      'Third month, xinmao: Left Vice Director and Same Rank as the Three Offices Liu Ren\'gui was additionally made Junior Tutor of the Heir Apparent.',
    idiomatic:
      'On xinmao Liu Ren\'gui, left vice director and third rank, was also made junior tutor to the heir.',
  },
  s0374: {
    literal:
      'Palace Attendant Hao Chujun became Junior Tutor of the Heir Apparent and left confidential counsel.',
    idiomatic:
      'Hao Chujun became junior heir tutor and left confidential counsel.',
  },
  s0375: {
    literal:
      'Fifth month, bingxu: Dingxiang Circuit Commander Cao Huai-shun fought the Turk Shi Funian at Hengshui; the government army was routed.',
    idiomatic:
      'On bingxu in the fifth month Cao Huai-shun fought the Turk Shi Funian at Hengshui and was crushed.',
  },
  s0376: {
    literal: 'Huai-shun\'s sentence was reduced from death; he was banished to Lingnan.',
    idiomatic: 'Huai-shun was spared death and exiled to Lingnan.',
  },
  s0377: {
    literal:
      'Sixth month, renzi: Zhao, son of the late Prince Jiang Yuan Xiang, was beheaded in the rear garden of the Court of Judicial Review for violating name-and-teaching.',
    idiomatic:
      'On renzi in the sixth month Zhao, son of the late Prince Jiang, was beheaded behind the review court for violating moral law.',
  },
  s0378: {
    literal: 'Seventh month: Princess Taiping married Xue Shao; prisoners in the capital were pardoned.',
    idiomatic: 'In the seventh month Princess Taiping wed Xue Shao and capital prisoners were freed.',
  },
  s0379: {
    literal:
      'Intercalary seventh month, dingwei: Vice Director Pei Yan became Palace Attendant; Vice Directors Cui Zhiwen and Secretariat Vice Director Xue Yuanchao became Directors of the Secretariat.',
    idiomatic:
      'On dingwei in the intercalary seventh month Pei Yan became palace attendant and Cui Zhiwen and Xue Yuanchao became secretariat directors.',
  },
  s0380: {
    literal: 'On gengshen, because of elixirs he took, he ordered the crown prince to act as regent.',
    idiomatic: 'On gengshen, ill from elixirs, he put the crown prince in charge.',
  },
  s0381: {
    literal: 'On bingyin a great wind in Yongzhou damaged the crops and grain prices soared.',
    idiomatic: 'On bingyin a gale in Yong Prefecture ruined the harvest and grain prices spiked.',
  },
  s0382: {
    literal:
      'That month Pei Xingjian routed the horde of the Turk Shi Funian; Funian, pressed by Cheng Wuting, seized Wen Fu and came to surrender; Xingjian then pacified all Turk remnants.',
    idiomatic:
      'That month Pei Xingjian shattered Shi Funian\'s horde; pressed by Cheng Wuting, Funian seized Wen Fu and surrendered, and Xingjian cleared the last Turks.',
  },
  s0383: {
    literal: 'Xingjian brought in Funian and Wen Fu and returned in triumph.',
    idiomatic: 'Xingjian brought Funian and Wen Fu home in triumph.',
  },
  s0384: {
    literal:
      'Eighth month, on the dingmao new moon: great floods in Henan and Hebei; those in flooded areas were allowed to go south of the Yangtze and Huai to find food.',
    idiomatic:
      'On the dingmao new moon in the eighth month floods hit Henan and Hebei; the flooded were sent south of the Yangtze and Huai for grain.',
  },
  s0385: {
    literal: 'On dinghai Minister of Revenue Cui Zhiti died.',
    idiomatic: 'On dinghai minister of revenue Cui Zhiti died.',
  },
  s0386: {
    literal: 'On xinmao Jiaozhou was changed to the Protectorate General of Annan.',
    idiomatic: 'On xinmao Jiaozhou became the protectorate of Annan.',
  },
  s0387: {
    literal: 'Ninth month, bingshen: a comet appeared in the Celestial Market, five chi long.',
    idiomatic: 'On bingshen in the ninth month a comet five chi long appeared in the Celestial Market.',
  },
  s0388: {
    literal: 'Tenth month, winter, on the bingyin new moon: there was a solar eclipse.',
    idiomatic: 'On the bingyin new moon of the tenth winter month the sun was eclipsed.',
  },
  s0389: {
    literal: 'On yichou the second year of Yonglong was changed to the first year of Kaiyao.',
    idiomatic: 'On yichou Yonglong 2 became Kaiyao 1.',
  },
  s0390: {
    literal:
      'A selective pardon was proclaimed for the Dingxiang army and officials, soldiers, and recruits along the Turk campaign.',
    idiomatic:
      'He issued a partial pardon for the Dingxiang army and everyone on the Turk campaign.',
  },
  s0391: {
    literal:
      'On bingyin Ashina Funian and Wen Fu and fifty-four others were executed in the marketplace.',
    idiomatic:
      'On bingyin Ashina Funian, Wen Fu, and fifty-four others were beheaded in the market.',
  },
  s0392: {
    literal: 'On dinghai King Kim Popsin of Silla died; his son Chong was still allowed to succeed.',
    idiomatic: 'On dinghai King Popsin of Silla died; his son Chong succeeded him.',
  },
  s0393: {
    literal: 'Eleventh month, guimao: the deposed Xian was moved to Bazhou.',
    idiomatic: 'On guimao in the eleventh month the deposed Xian was sent to Ba.',
  },
  s0394: {
    literal: 'Twelfth month: Tokhara presented a golden robe; the emperor did not accept it.',
    idiomatic: 'In the twelfth month Tokhara offered a gold robe; he refused it.',
  },
  s0395: {
    literal: 'On xinwei Junior Tutor of the Heir Apparent and Duke of Zengshan Hao Chujun died.',
    idiomatic: 'On xinwei junior heir tutor Hao Chujun, Duke of Zengshan, died.',
  },
  s0396: {
    literal:
      'First year of Yongchun, on the yimao new moon of the first month, because of famine the court assembly was suspended.',
    idiomatic:
      'Yongchun 1, on the yimao new moon of the first month: famine halted the court assembly.',
  },
  s0397: {
    literal:
      'Fubing of the interior circuits were ordered to draw grain in Deng, Sui, and other prefectures.',
    idiomatic:
      'Interior fubing were sent to draw rations in Deng, Sui, and other prefectures.',
  },
  s0398: {
    literal:
      'Second month, guiwei: because the crown prince\'s grandson had completed his first month, a great amnesty was proclaimed.',
    idiomatic:
      'On guiwei in the second month, when the crown prince\'s grandson completed his first month, he proclaimed a general amnesty.',
  },
  s0399: {
    literal:
      'The second year of Kaiyao was changed to the first year of Yongchun; great public feasting lasted three days.',
    idiomatic:
      'Kaiyao 2 became Yongchun 1; public feasting lasted three days.',
  },
  s0400: {
    literal:
      'On wuwu the emperor\'s grandson Chongzhao was installed as Imperial Grandson; he wished to open a bureau and appoint staff.',
    idiomatic:
      'On wuwu he made his grandson Chongzhao imperial grandson and planned a bureau with staff.',
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
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s0301–s0400).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '005') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 005; standalone T ready (${Object.keys(T).length} entries).`
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
console.log('Applied', applied, 'translations (s0301–s0400) to', transPath);
