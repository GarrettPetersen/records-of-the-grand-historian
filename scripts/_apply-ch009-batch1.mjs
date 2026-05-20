#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.009, Xuanzong 2 — Kaiyuan 25 through Kaiyuan 28) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/009.json';
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
    literal: 'In Kaiyuan 25, first spring month, on renwu, an edict: "I have undeservedly gathered the fortune of peace and owe much to the sage kings; yet my compassion for suffering, great and small, must ever be careful.',
    idiomatic: 'In the first month of Kaiyuan 25, on renwu, the emperor issued an edict: "Fortune has favored me beyond merit, and I stand in debt to the sage kings of old; yet pity for the suffering—great and small—must govern every judgment."',
  },
  s0002: {
    literal: 'Since I ascended to rule the realm and nourish the people, I have never imposed extreme punishments or launched great persecutions.',
    idiomatic: 'Since taking the throne to nurture the realm, I have never imposed extreme punishments or opened great persecutions.',
  },
  s0003: {
    literal: 'Heaven above has sent down its mirror; the response should be harmony and auspice. I wish to harmonize the norms of a tranquil state and bring the people into the domain of benevolence and longevity.',
    idiomatic: 'Heaven has shown its sign; the answer must be harmony. I mean to align the state with tranquil rule and lead the people toward benevolence and long life.',
  },
  s0004: {
    literal: 'From now on, when anyone is guilty of death, except for the Ten Abominations, the Secretariat-Chancellery and the judges shall together weigh the gravity of the offense, prepare a full report, and memorialize.',
    idiomatic: 'Henceforth all capital cases, save the Ten Abominations, shall be reviewed by the Secretariat-Chancellery and the judges, who must weigh the offense and memorialize with a full report.',
  },
  s0005: {
    literal: 'Honoring virtue and respecting age were the great righteousness of the Three Dynasties;',
    idiomatic: 'To honor virtue and respect age was the great righteousness of the Three Dynasties;',
  },
  s0006: {
    literal: 'to strengthen custom and encourage folkways, the Five Teachings come first.',
    idiomatic: 'to strengthen custom and guide the people, the Five Teachings come first.',
  },
  s0007: {
    literal: 'Those who once held fifth rank or higher as pure-capital officials and left office by ritual propriety—the relevant offices shall compile their names and memorialize; those aged or ill and unable to manage affairs shall be granted retirement.',
    idiomatic: 'Former pure-capital officials of fifth rank or above who left office with propriety shall be listed and reported; those aged or ill and unfit for duty shall receive retirement.',
  },
  s0008: {
    literal: 'Daoist priests and female Daoists should be placed under the Court of the Imperial Clan; Buddhist monks and nuns shall be inspected by the Ministry of Rites.',
    idiomatic: 'Daoist priests and nuns shall fall under the Court of the Imperial Clan; Buddhist monks and nuns shall be overseen by the Ministry of Rites.',
  },
  s0009: {
    literal: 'On each ten-day festival holiday all offices need not enter their bureaus; officials may seek scenic pleasure as they wish.',
    idiomatic: 'On the ten-day festival holidays no office need keep bureau hours; officials may seek their pleasure where they will.',
  },
  s0010: {
    literal: 'Let this be proclaimed within and without, that all may know my intent."',
    idiomatic: 'Let this be proclaimed at court and in the provinces, that all may know my mind."',
  },
  s0011: {
    literal: '" On guimao the Daoist Yin Yin became Remonstrance Grandee, Academician of the Hall of Assembled Worthies, and concurrent director of the History Office.',
    idiomatic: 'On guimao the Daoist Yin Yin was made remonstrance grandee, academy scholar, and concurrent director of the History Office.',
  },
  s0012: {
    literal: 'In the second month King Hingwang of Silla died; his son Seonggyeong succeeded. The court sent Goodwill Commissioner Xing Shuo acting as vice director of the Court of Imperial Entertainments to mourn, perform sacrifices, and invest the new king.',
    idiomatic: 'In the second month King Hingwang of Silla died and his son Seonggyeong succeeded. Xing Shuo, goodwill commissioner acting as vice director of imperial entertainments, was sent to mourn, sacrifice, and invest him.',
  },
  s0013: {
    literal: 'On renzi one additional vice director of the Court of the Imperial Clan was added.',
    idiomatic: 'On renzi the Court of the Imperial Clan gained one vice director.',
  },
  s0014: {
    literal: 'On wuwu transport on the Jiang-Huai circuit was abolished and transport on the Hebei circuit suspended.',
    idiomatic: 'On wuwu Jiang-Huai transport was abolished and Hebei transport suspended.',
  },
  s0015: {
    literal: 'On guiyou Zhang Shougui crushed the remaining Khitan at Mount Zelu, killing and capturing a great host.',
    idiomatic: 'On guiyou Zhang Shougui routed the remaining Khitan at Mount Zelu with heavy slaughter.',
  },
  s0016: {
    literal: 'In the third month, on yimao, Hexi military commissioner Cui Xiyi led troops south from Liang Prefecture more than two thousand li into Tibetan territory.',
    idiomatic: 'On yimao of the third month Hexi commissioner Cui Xiyi marched south from Liang Prefecture more than two thousand li into Tibetan lands.',
  },
  s0017: {
    literal: 'On jihai Xiyi reached Langzuo Suwenzi Mouth west of Qinghai Lake, met the enemy, and routed them, beheading more than two thousand.',
    idiomatic: 'On jihai Xiyi reached Langzuo Suwenzi Mouth west of Qinghai Lake, met the enemy, and took more than two thousand heads.',
  },
  s0018: {
    literal: 'In the fourth summer month, on gengxu, Chen, Xu, Yu, and Shou prefectures opened paddy fields.',
    idiomatic: 'In the fourth summer month Chen, Xu, Yu, and Shou opened new paddy fields.',
  },
  s0019: {
    literal: 'On xinyou Supervising Censor Zhou Ziliang memorialized in offense to the throne; he was dragged through the palace court and beaten to death with the court staff.',
    idiomatic: 'On xinyou censor Zhou Ziliang offended the throne in a memorial; he was dragged through the palace court and beaten to death with the court staff.',
  },
  s0020: {
    literal: 'On jiazi Right Secretariat Director Zhang Jiuling, for having once recommended Ziliang, was demoted to prefect of Jing Prefecture.',
    idiomatic: 'On jiazi Zhang Jiuling, right secretariat director, was demoted to Jing prefect for having once recommended Ziliang.',
  },
  s0021: {
    literal: 'On yichou Crown Prince Ying, Prince of E Yao, and Prince of Guang Ju were all deposed as commoners.',
    idiomatic: 'On yichou Crown Prince Ying and Princes Yao of E and Ju of Guang were deposed as commoners.',
  },
  s0022: {
    literal: 'The crown prince\'s brother-in-law, Commandant of Horse Xue Chuo, was exiled in long transport to Rang Prefecture and, at Lantian post station, ordered to die.',
    idiomatic: 'The crown prince\'s brother-in-law Xue Chuo, commandant of horse, was exiled toward Rang and ordered to die at Lantian post.',
  },
  s0023: {
    literal: 'In the sixth month, on renxu, Mars invaded the Room mansion, crossed the Heart star, and passed beyond.',
    idiomatic: 'In the sixth month Mars invaded the Room mansion, crossed the Heart star, and passed on.',
  },
  s0024: {
    literal: 'In the seventh autumn month, on jimao, Vice Director of the Court of Judicial Review Xu Kun memorialized: "Under Heaven this year fifty-eight death sentences were pronounced—nearly attaining the era when punishments need not be used—the case of Bird Nest Temple."',
    idiomatic: 'In the seventh month Xu Kun, vice director of judicial review, reported that the realm had seen only fifty-eight executions this year—nearly the age when punishments fall unused—and cited the Bird Nest Temple case.',
  },
  s0025: {
    literal: '" The emperor specially attributed the merit to his chief ministers; on gengchen Li Linfu was enfeoffed Duke of Jin and Niu Xianke Duke of Bin.',
    idiomatic: 'The emperor credited his chief ministers; on gengchen Li Linfu became Duke of Jin and Niu Xianke Duke of Bin.',
  },
  s0026: {
    literal: 'On jimao an edict placed all imperial tombs and temples under the Court of the Imperial Clan; from now its officials shall all be drawn from the imperial clan.',
    idiomatic: 'On jimao an edict placed all imperial tombs and temples under the Court of the Imperial Clan, whose officers would hereafter be clan members.',
  },
  s0027: {
    literal: 'In the ninth month, on renshen, the newly revised Statutes, Regulations, Codes, and Categories in one hundred thirty juan were promulgated throughout the realm.',
    idiomatic: 'In the ninth month the newly revised statutes, regulations, codes, and categories—one hundred thirty juan—were promulgated empire-wide.',
  },
  s0028: {
    literal: 'In the tenth winter month an edict ordered that from this year each spring, on the day the year begins, the court welcome spring at the eastern suburb; summer, autumn, and winter would follow custom.',
    idiomatic: 'That winter an edict ordered annual spring rites at the eastern suburb on New Year\'s day; summer, autumn, and winter would follow custom.',
  },
  s0029: {
    literal: 'On the first day of the twelfth month the emperor received court at the main hall and had the seasonal ordinances read.',
    idiomatic: 'On the twelfth month\'s first day he received court at the main hall and had the seasonal ordinances read.',
  },
  s0030: {
    literal: 'In the eleventh month, on renshen, he visited the Hot Springs Palace.',
    idiomatic: 'In the eleventh month he visited the Hot Springs Palace.',
  },
  s0031: {
    literal: 'On dingchou Grand Preceptor of Honor, Duke of Guangping Song Jing died.',
    idiomatic: 'On dingchou Song Jing, grand preceptor of honor and Duke of Guangping, died.',
  },
  s0032: {
    literal: 'On bingwu Consort Wu died; she was posthumously styled Empress Zhenshun and buried at Jing Mausoleum.',
    idiomatic: 'On bingwu Consort Wu died, was posthumously styled Empress Zhenshun, and was buried at Jing Mausoleum.',
  },
  s0033: {
    literal: 'Tibet sent its minister Shulun Mangzang to court with tribute.',
    idiomatic: 'Tibet sent Minister Shulun Mangzang with tribute.',
  },
  s0034: {
    literal: 'Kaiyuan 26, first spring month, on yihai, Minister of Works Niu Xianke became Palace Attendant.',
    idiomatic: 'In the first month of Kaiyuan 26, on yihai, Niu Xianke, minister of works, became palace attendant.',
  },
  s0035: {
    literal: 'On dingchou he personally welcomed the qi at the eastern suburb and sacrificed to the Green Emperor.',
    idiomatic: 'On dingchou he welcomed the qi at the eastern suburb and sacrificed to the Green Emperor.',
  },
  s0036: {
    literal: 'An edict ordered that prisoners under death sentence be exiled to Lingnan and all others released.',
    idiomatic: 'An edict exiled death-row prisoners to Lingnan and released the rest.',
  },
  s0037: {
    literal: 'Garrison troops returned home.',
    idiomatic: 'Garrison troops were sent home.',
  },
  s0038: {
    literal: 'New paddy fields opened in the metropolitan prefecture were distributed to the poor.',
    idiomatic: 'New metropolitan paddy was distributed to the poor.',
  },
  s0039: {
    literal: 'The hundred officials were granted merit silk.',
    idiomatic: 'Court officials received merit silk.',
  },
  s0040: {
    literal: 'Chang\'an and Wannian counties each received one thousand strings of cash principal to collect interest for post-horses, still assigned to miscellaneous courier duty.',
    idiomatic: 'Chang\'an and Wannian each received a thousand strings of principal to fund post-horses by interest, still assigned to courier duty.',
  },
  s0041: {
    literal: 'Every district in the realm was to have one school per township, with teachers chosen to instruct.',
    idiomatic: 'Every township in the realm was to have a school with appointed teachers.',
  },
  s0042: {
    literal: 'Each year local candidates were to visit the Directorate of Education to pay respects to the former master; candidates in the Classics Examination received an oral test.',
    idiomatic: 'Each year local candidates were to visit the directorate to honor the former master; classics candidates faced an oral examination.',
  },
  s0043: {
    literal: 'Those below eighth rank inside and outside the court, and commoners of broad learning and literary excellence, were to be recommended by their offices and prefectures.',
    idiomatic: 'Officials below eighth rank and learned commoners were to be recommended by their offices and prefectures.',
  },
  s0044: {
    literal: 'In the second month, on xinmao, Li Linfu was made concurrent Longyou military commissioner.',
    idiomatic: 'In the second month Li Linfu became concurrent Longyou commissioner.',
  },
  s0045: {
    literal: 'On jiachen the Great Cold Food Festival gift of eggs was forbidden.',
    idiomatic: 'On jiachen exchanging eggs at the Great Cold Food Festival was forbidden.',
  },
  s0046: {
    literal: 'On gengshen Empress Zhenshun was buried at Jing Mausoleum.',
    idiomatic: 'On gengshen the court buried Empress Zhenshun at Jing Mausoleum.',
  },
  s0047: {
    literal: 'On yimao Niu Xianke was made concurrent Hedong circuit military commissioner.',
    idiomatic: 'On yimao Niu Xianke became concurrent Hedong commissioner.',
  },
  s0048: {
    literal: 'On xinyou Xian Prefecture was abolished; its counties were attached to Xu, Ru, and other prefectures.',
    idiomatic: 'On xinyou Xian Prefecture was abolished and its counties reassigned.',
  },
  s0049: {
    literal: 'On the third month, jisi new moon, proofreaders and rectifiers of the Secretariat were reduced.',
    idiomatic: 'On the third month\'s new moon secretariat proofreaders and rectifiers were reduced.',
  },
  s0050: {
    literal: 'On bingzi a comet appeared within the Purple Forbidden Enclosure, traversing the Dipper for more than ten days; clouds hid it.',
    idiomatic: 'On bingzi a comet crossed the Purple Forbidden Enclosure and the Dipper for ten days before clouds hid it.',
  },
  s0051: {
    literal: 'On jiyou Henan and Luoyang counties also borrowed a thousand strings of principal, interest to cover clerks\' corvée.',
    idiomatic: 'On jiyou Henan and Luoyang borrowed a thousand strings each to fund clerks\' corvée by interest.',
  },
  s0052: {
    literal: 'On guiwei the metropolitan prefecture suffered an earthquake.',
    idiomatic: 'On guiwei the capital region shook.',
  },
  s0053: {
    literal: 'Tibet raided Hexi; Left Regular Attendant Cui Xiyi defeated them;',
    idiomatic: 'Tibet raided Hexi and Cui Xiyi, left regular attendant, drove them off;',
  },
  s0054: {
    literal: 'Zongzhou prefect Du Xiwang also stormed and took Xinluo city; an edict made that place Weirong Army.',
    idiomatic: 'Zong prefect Du Xiwang stormed Xinluo city, which was made Weirong Army.',
  },
  s0055: {
    literal: 'In the fourth summer month, on jihai new moon, the Grand Minister of Sacrifices Wei Jiang first read the seasonal ordinances in the Xuanzheng Hall while the hundred officials sat in ranks on the hall to listen.',
    idiomatic: 'On the fourth month\'s new moon Wei Jiang first read the seasonal ordinances in the Xuanzheng Hall as officials sat ranked to listen.',
  },
  s0056: {
    literal: 'In the fifth month, on yiyou, Li Linfu was made concurrent Hexi military commissioner and also judged Liang Prefecture affairs.',
    idiomatic: 'In the fifth month Li Linfu became concurrent Hexi commissioner and judged Liang affairs.',
  },
  s0057: {
    literal: 'On gengyin he visited Princess Xianyi\'s residence.',
    idiomatic: 'On gengyin he visited Princess Xianyi.',
  },
  s0058: {
    literal: 'In the sixth month, on gengzi, Prince Zhong Yu was installed as crown prince.',
    idiomatic: 'In the sixth month Prince Zhong Yu was made crown prince.',
  },
  s0059: {
    literal: 'In the seventh autumn month, on jisi, the crown prince was invested; a great amnesty was proclaimed throughout the realm, and even those normally excluded were pardoned.',
    idiomatic: 'In the seventh month the crown prince was invested; the realm was amnestied, even those usually excluded.',
  },
  s0060: {
    literal: 'Civil and military officials inside and outside the court, and those of fifth rank and above who were heirs to fathers, each received one turn of merit.',
    idiomatic: 'Civil and military officials of fifth rank and above who were heirs each gained one merit turn.',
  },
  s0061: {
    literal: 'Crown prince household officers and lecturers each gained one rank.',
    idiomatic: 'The crown prince\'s household officers and lecturers each gained one rank.',
  },
  s0062: {
    literal: 'Feasting was granted for three days.',
    idiomatic: 'The court feasted for three days.',
  },
  s0063: {
    literal: 'On gengchen Yue Prefecture was split to establish Ming Prefecture.',
    idiomatic: 'On gengchen Ming Prefecture was carved from Yue.',
  },
  s0064: {
    literal: 'In the ninth month, on bingshen new moon, there was a solar eclipse.',
    idiomatic: 'In the ninth month the sun was eclipsed on the new moon.',
  },
  s0065: {
    literal: 'On gengzi You Prefecture was established on the old territory of the Six Hu prefectures.',
    idiomatic: 'On gengzi You Prefecture was established on the old Six Hu lands.',
  },
  s0066: {
    literal: 'Yizhou prefect Wang Yu led troops to storm the Tibetan fortress of Anrong; the enemy held it, the army was utterly defeated, Yu cast off his armor and fled, and several thousand soldiers died.',
    idiomatic: 'Wang Yu of Yizhou stormed Tibetan Anrong, was routed, fled without armor, and lost thousands.',
  },
  s0067: {
    literal: 'In the tenth winter month, on wuyin, he visited the Hot Springs Palace.',
    idiomatic: 'In the tenth winter month he visited the Hot Springs Palace.',
  },
  s0068: {
    literal: 'That year King Muye of Parhae died; his son Chinmok succeeded. Envoys were sent to mourn and invest him.',
    idiomatic: 'That year King Muye of Parhae died; envoys mourned and invested his son Chinmok.',
  },
  s0069: {
    literal: 'That winter traveling palaces were built in the two capitals, with more than a thousand chambers each.',
    idiomatic: 'That winter traveling palaces rose in both capitals, a thousand chambers apiece.',
  },
  s0070: {
    literal: 'Run Prefecture prefect Qi Huan opened the Yilou River at Nanguazhou Ford in Yang Prefecture.',
    idiomatic: 'Qi Huan of Runzhou opened the Yilou River at Nanguazhou ford.',
  },
  s0071: {
    literal: 'The Left and Right Forest Armies were split to form the Left and Right Dragon Martial Armies, with the Left and Right Ten Thousand Riders camps placed under them.',
    idiomatic: 'The Forest Armies were split into Left and Right Dragon Martial Armies subordinating the Ten Thousand Riders camps.',
  },
  s0072: {
    literal: 'Kaiyuan 27, first spring month, on yisi, heavy rain and snow fell.',
    idiomatic: 'In the first month of Kaiyuan 27 heavy snow fell.',
  },
  s0073: {
    literal: 'In the second month, on jisi, the honorific Kaiyuan Sage Literary Divine Martial Emperor was added; a great amnesty was proclaimed, even those normally excluded were pardoned, all branded persons since Kaiyuan were washed clean, and demoted officials were moved nearer.',
    idiomatic: 'In the second month the emperor took the added title Kaiyuan Sage Literary Divine Martial Emperor, amnestied the realm including the usually excluded, cleared Kaiyuan-era brands, and moved demoted officials nearer.',
  },
  s0074: {
    literal: 'The people were exempted from this year\'s land tax and levies.',
    idiomatic: 'This year\'s taxes were remitted.',
  },
  s0075: {
    literal: 'Those of third rank and above received one noble rank; fourth rank and below one grade.',
    idiomatic: 'Third rank and above gained a noble rank; fourth and below one grade.',
  },
  s0076: {
    literal: 'For imperial temple offerings, from now on imperial sons would be used.',
    idiomatic: 'Imperial temple offerings would hereafter use imperial sons.',
  },
  s0077: {
    literal: 'Feasting was granted for five days.',
    idiomatic: 'Feasting lasted five days.',
  },
  s0078: {
    literal: 'In the fourth summer month, on dingchou, Tao Prefecture was abolished and attached to Lan; Lin Prefecture was renamed Tao.',
    idiomatic: 'In the fourth summer month Tao was attached to Lan and Lin renamed Tao.',
  },
  s0079: {
    literal: 'On yiyou Heir Apparent Junior Tutor Dou Dan became Grand Preceptor of Honor; Minister of Personnel Li Hao became heir apparent junior tutor.',
    idiomatic: 'On yiyou Dou Dan became grand preceptor of honor and Li Hao heir apparent junior tutor.',
  },
  s0080: {
    literal: 'On dingyou Palace Attendant Niu Xianke became Minister of War and still Palace Attendant;',
    idiomatic: 'On dingyou Niu Xianke became minister of war while remaining palace attendant;',
  },
  s0081: {
    literal: 'Minister of War and concurrent Secretariat Director Li Linfu became Minister of Personnel, still concurrent Secretariat Director.',
    idiomatic: 'Li Linfu became minister of personnel while remaining secretariat director.',
  },
  s0082: {
    literal: 'Eastern Palace inner attendants were placed under the Directorate of Palace Attendants as a bureau.',
    idiomatic: 'Eastern Palace inner attendants were placed under the palace directorate.',
  },
  s0083: {
    literal: 'In the fifth month, on guimao, Dragon Martial Army posts were established.',
    idiomatic: 'In the fifth month Dragon Martial Army posts were established.',
  },
  s0084: {
    literal: 'Earlier, Princess Zheng\'s son Xue Shen and his gang Li Tan, Cui Qia, and Shi Ruyan had murdered people in the capital—sometimes for wealth, sometimes when crossed—and in broad daylight would bludgeon victims, boil, and eat them.',
    idiomatic: 'Earlier Princess Zheng\'s son Xue Shen and accomplices Li Tan, Cui Qia, and Shi Ruyan had murdered in the capital by day, sometimes boiling the dead.',
  },
  s0085: {
    literal: 'When the affair broke that summer, all were executed at the metropolitan government gate; Shen, as imperial kin, was exiled in transport to Rang and ordered to die at the eastern post station.',
    idiomatic: 'When the plot broke they were executed at the capital gate; Shen, as kin, was exiled and ordered to die at the eastern post.',
  },
  s0086: {
    literal: 'In the sixth month, on jiaxu, Inner Regular Attendant Niu Xiantong was executed for bribery.',
    idiomatic: 'In the sixth month Niu Xiantong, inner regular attendant, was executed for bribery.',
  },
  s0087: {
    literal: 'Youzhou military commissioner and concurrent censor-in-chief Zhang Shougui was demoted to prefect of Kuo for bribery.',
    idiomatic: 'Zhang Shougui, Youzhou commissioner, was demoted to Kuo prefect for bribery.',
  },
  s0088: {
    literal: 'Heir Apparent Grand Tutor and Duke of Xu Xiao Song, for having once bribed Xiantong, was demoted to prefect of Qing.',
    idiomatic: 'Xiao Song, heir apparent grand tutor and Duke of Xu, was demoted to Qing prefect for bribing Xiantong.',
  },
  s0089: {
    literal: 'In the seventh autumn month, on xinchou, Mars invaded the Southern Dipper.',
    idiomatic: 'In the seventh month Mars invaded the Southern Dipper.',
  },
  s0090: {
    literal: 'Beiting protector-general Gai Jiayun with light cavalry raided and crushed the Turgesh at Suyab, killed Suolu, and his prestige shook the western marches.',
    idiomatic: 'Gai Jiayun of Beiting raided the Turgesh at Suyab, killed Suolu, and shook the west.',
  },
  s0091: {
    literal: 'In the eighth month Tibet raided Baicao, Anren, and other posts.',
    idiomatic: 'In the eighth month Tibet raided Baicao and Anren.',
  },
  s0092: {
    literal: 'On jiashen an edict posthumously enfeoffed Confucius as King Wenxuan; Yan Hui as Duke of Yan; the other Ten Sages as marquises, seated on either side.',
    idiomatic: 'On jiashen Confucius was posthumously styled King Wenxuan, Yan Hui Duke of Yan, and the Ten Sages marquises flanking him.',
  },
  s0093: {
    literal: 'The heir of the enfeoffed Sage was changed to Duke Wenxuan.',
    idiomatic: 'Confucius\'s enfeoffed heir was restyled Duke Wenxuan.',
  },
  s0094: {
    literal: 'In the ninth month the crown prince changed his name to Shao.',
    idiomatic: 'In the ninth month the crown prince took the name Shao.',
  },
  s0095: {
    literal: 'Bian Prefecture prefect Qi Huan requested opening the lower Bian River from Hong County to north of Huaiyin to join the Huai; in time the work was finished.',
    idiomatic: 'Qi Huan of Bian opened the lower Bian from Hong to Huaiyin; the work finished on schedule.',
  },
  s0096: {
    literal: 'The old course, choked by silt, wearied travelers; soon the new channel ran swift and silted shut again.',
    idiomatic: 'The old silt-choked route wearied travelers; soon the swift new channel silted shut.',
  },
  s0097: {
    literal: 'Former Minister of Punishments in retirement Cui Yinpu died.',
    idiomatic: 'Cui Yinpu, retired minister of punishments, died.',
  },
  s0098: {
    literal: 'In the tenth winter month the Bright Hall was to be rebuilt.',
    idiomatic: 'That winter the Bright Hall was to be rebuilt.',
  },
  s0099: {
    literal: 'False reports said officials were taking children to bury beneath the Bright Hall for apotropaic magic.',
    idiomatic: 'Rumors spread that officials buried children under the Bright Hall for apotropaic magic.',
  },
  s0100: {
    literal: 'Country children hid in valleys; the capital was alarmed, all saying troops were coming.',
    idiomatic: 'Children hid in the hills; the capital panicked, crying that soldiers were coming.',
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
if (data.metadata.chapter !== '009') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 009; standalone T ready (${Object.keys(T).length} entries).`
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

