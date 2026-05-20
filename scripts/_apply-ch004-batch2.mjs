#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/004.json';
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
    literal: 'On jiawu, Peng Prince Yuanze, Prefect of Li Prefecture, died.',
    idiomatic: 'On jiawu Peng Prince Yuanze, governor of Li Prefecture, died.',
  },
  s0102: {
    literal:
      'In the fifth month, on gengchen, an edict ordered that Pei Rong, Director of Baths of Zhou; Cui Jishu, Attendant-in-Ordinary of Qi; Pei Ze, Supervising Secretary of the Yellow Gate; Feng Xiaoyan, Left Assistant of the Masters of Writing; Dou Lu Yu, Section Leader with the Protocol of the Three Excellencies of Sui; You Chuke, Imperial Censor; and the like—all clans renowned for loyal forthrightness—should have their descendants each selected and promoted.',
    idiomatic:
      'On gengchen of the fifth month an edict singled out descendants of Pei Rong of Zhou, Cui Jishu of Qi, Pei Ze, Feng Xiaoyan, Dou Lu Yu of Sui, You Chuke, and other families famed for steadfast loyalty for promotion.',
  },
  s0103: {
    literal:
      'In the seventh month of autumn, on dingsi, Prince Zhong of Chen was established as Crown Prince; a great amnesty was proclaimed for all under Heaven; sons of fifth rank and above who were heirs to their fathers received one turn of merit; a great communal feast lasted three days.',
    idiomatic:
      'On dingsi of the seventh autumn month Prince Zhong of Chen was made crown prince; the court proclaimed a general amnesty, granted one grade of merit to fifth-rank heirs, and feasted the realm for three days.',
  },
  s0104: {
    literal:
      'On yichou, Left Vice Director Yu Zhining was additionally made Junior Tutor of the Crown Prince; Right Vice Director Zhang Xingcheng was additionally Junior Preceptor; Attendant-in-Ordinary Gao Jifu was additionally Junior Guardian; Attendant-in-Ordinary Yuwen Jie was additionally Grand Mentor of the Heir Apparent.',
    idiomatic:
      'On yichou Yu Zhining, left vice director, became junior tutor of the heir; Zhang Xingcheng, right vice director, junior preceptor; Gao Jifu, attendant-in-ordinary, junior guardian; Yuwen Jie, attendant-in-ordinary, grand mentor of the heir.',
  },
  s0105: {
    literal:
      'On dingchou, the emperor questioned Minister of Revenue Gao Lüxing: "How many households were added last year?"',
    idiomatic:
      'On dingchou he asked Gao Lüxing, minister of revenue, "How many households were registered last year?"',
  },
  s0106: {
    literal: '" Lüxing reported: "The total of added households was one hundred fifty thousand."',
    idiomatic: 'Lüxing answered that additions came to one hundred fifty thousand households in all.',
  },
  s0107: {
    literal: '" He also asked: "How many households were there in Sui times?',
    idiomatic: 'He pressed on: "How many did the Sui count?',
  },
  s0108: {
    literal: 'How many are there now on the registers?"',
    idiomatic: 'And how many are on the books today?"',
  },
  s0109: {
    literal:
      '" Lüxing reported: "In Kaihuang of the Sui there were eight million seven hundred thousand households; those now on the registers number three million eight hundred thousand."',
    idiomatic:
      'Lüxing replied: "At Sui Kaihuang, eight million seven hundred thousand; today, three million eight hundred thousand."',
  },
  s0110: {
    literal: '"',
    idiomatic: '[End of the report.]',
  },
  s0111: {
    literal:
      'In the ninth month, on dingsi, Junior Mentor of the Heir Apparent was renamed Inner Mentor, Secretariat Draftsman was renamed Inner Scribe, and Central Guard lieutenants were renamed Brave Guards Commanders, to avoid the heir\'s personal name.',
    idiomatic:
      'On dingsi of the ninth month titles bearing the heir\'s name were changed: crown prince mentor to inner mentor, draftsman to inner scribe, and guard lieutenants to brave guards commanders.',
  },
  s0112: {
    literal:
      'In the tenth month of winter, on wuxu, he visited the residence of the Grand Princess of Tong\'an, then the residence of the Princess of Gaoyang, and returned to the palace the same day.',
    idiomatic:
      'On wuxu of the tenth winter month he called on the Grand Princess of Tong\'an and the Princess of Gaoyang and returned to the palace that day.',
  },
  s0113: {
    literal: 'In the eleventh month, on yihai, Boma sent envoys with tribute.',
    idiomatic: 'On yihai of the eleventh month Boma sent envoys with tribute.',
  },
  s0114: {
    literal: 'On gengyin, the Princess of Honghua came to court from the Tuyuhun.',
    idiomatic: 'On gengyin Princess Honghua came from the Tuyuhun to court.',
  },
  s0115: {
    literal: 'In the twelfth month, on guisi, Pu Prince Tai died.',
    idiomatic: 'On guisi of the twelfth month Pu Prince Tai died.',
  },
  s0116: {
    literal:
      'In the spring of the first month of the fourth year of Yonghui, on guichou, the new year\'s day, the emperor took his seat at the hall but did not receive court, because Pu Prince Tai lay in mourning.',
    idiomatic:
      'On guichou, new year\'s day of the first spring month in Yonghui 4, he held court in the hall but accepted no congratulations while Pu Prince Tai lay in state.',
  },
  s0117: {
    literal:
      'On bingzi, the newly appointed Prefect of Fang Prefecture and Commandant of the Imperial Sons-in-Law Fang Yiai, Minister of Works and Prefect of Qin Prefecture Jing Prince Yuanjing, Minister of State and Prefect of An Prefecture Wu Prince Ke, Prefect of Ning Prefecture and Commandant of the Imperial Sons-in-Law Xue Wanche, and Prefect of Lan Prefecture and Commandant of the Imperial Sons-in-Law Chai Lingwu plotted rebellion.',
    idiomatic:
      'On bingzi Fang Yiai of Fang, Jing Prince Yuanjing of Qin, Wu Prince Ke of An, Xue Wanche of Ning, and Chai Lingwu of Lan were charged with treason.',
  },
  s0118: {
    literal: 'In the second month, on yiyou, Yiai, Wanche, Lingwu, and the rest were all executed.',
    idiomatic: 'On yiyou of the second month Yiai, Wanche, Lingwu, and their accomplices were executed.',
  },
  s0119: {
    literal: 'Yuanjing, Ke, and the Princesses of Baling and Gaoyang were all ordered to take their own lives.',
    idiomatic: 'Yuanjing, Ke, and the princesses of Baling and Gaoyang were forced to suicide.',
  },
  s0120: {
    literal:
      'Left Valiant Cavalry Guard General and Duke of the State of An Zhisi Sili was sentenced to exile in Song Prefecture; Attendant-in-Ordinary and Grand Mentor of the Heir Apparent, Duke of Pingchang, Yuwen Jie was sentenced to exile in Gui Prefecture.',
    idiomatic:
      'Zhisi Sili, left valiant cavalry guard general and Duke of An, was exiled to Song; Yuwen Jie, attendant-in-ordinary and heir\'s grand mentor, Duke of Pingchang, to Gui.',
  },
  s0121: {
    literal:
      'On wuzi, Special Guardian and Minister of Ceremonies Jiangxia Prince Daozong was sentenced to exile in Gui Prefecture; Ke\'s younger brother by the same mother, Shu Prince Yin, was degraded to commoner status.',
    idiomatic:
      'On wuzi Daozong, special guardian and minister of ceremonies, Jiangxia prince, was exiled to Gui, and Ke\'s uterine brother Yin, prince of Shu, was reduced to commoner rank.',
  },
  s0122: {
    literal:
      'On jihai, Xu Prince Yuanli of Jiang Prefecture was additionally made Minister of Works; Kaifu Yitong Sansi and Duke of the State of Ying Ji was made Minister of State.',
    idiomatic:
      'On jihai Xu Prince Yuanli of Jiang was also made minister of works, and Ji, Duke of Ying, was made minister of state.',
  },
  s0123: {
    literal:
      'On the first day of the third month, renzi, Kong Yingda\'s Correct Meaning of the Five Classics was promulgated throughout the realm; candidates in the classics examination were hereafter to be tested by it.',
    idiomatic:
      'On renzi, the first day of the third month, Kong Yingda\'s Correct Meaning of the Five Classics was issued empire-wide as the standard for the classics examination.',
  },
  s0124: {
    literal:
      'On bingchen, the emperor took his seat at Guande Hall; the goods and horses of the traitors Fang Yiai and the rest were arranged in five piles, and princes, imperial kin, foreign guests, and civil and military officials of the ninth rank and above were invited to shoot at them.',
    idiomatic:
      'On bingchen he sat at Guande Hall, piled the traitors\' goods and horses in five stacks, and had princes, kin, foreign guests, and officials down to the ninth rank shoot at them.',
  },
  s0125: {
    literal: 'In the fourth month of summer, on wuzi, the king of Linyi sent envoys to court bearing tribute of tame elephants.',
    idiomatic: 'On wuzi of the fourth summer month the king of Linyi sent envoys with tame elephants.',
  },
  s0126: {
    literal:
      'On renyin, because of drought he avoided the main hall, reduced his meals, personally reviewed prisoners in bonds, sent envoys to inspect wrongful imprisonment throughout the realm, and ordered civil and military officials to speak frankly of gain and loss.',
    idiomatic:
      'On renyin, citing drought, he left the main hall, ate sparingly, reviewed prisoners himself, sent inspectors to review jails empire-wide, and ordered officials to speak plainly of what the court did right and wrong.',
  },
  s0127: {
    literal:
      'In the eighth month, on jihai, eighteen meteorites fell in Fufeng in Tong Prefecture with a sound like thunder.',
    idiomatic: 'On jihai of the eighth month eighteen meteorites fell on Fufeng in Tong Prefecture with a thunderous roar.',
  },
  s0128: {
    literal: 'In the ninth month, on renyin, Right Vice Director and Duke of Beiping Zhang Xingcheng died.',
    idiomatic: 'On renyin of the ninth month Zhang Xingcheng, right vice director and Duke of Beiping, died.',
  },
  s0129: {
    literal:
      'On jiaxu, Minister of Personnel and Duke of Henan Chu Suiliang became Right Vice Director of the Masters of Writing, his other charge in governance remaining as before.',
    idiomatic:
      'On jiaxu Chu Suiliang, minister of personnel and Duke of Henan, became right vice director while retaining his seat in deliberations.',
  },
  s0130: {
    literal: 'In the tenth month of winter, on gengzi, he visited the hot springs at Xinfeng.',
    idiomatic: 'On gengzi of the tenth winter month he went to the Xinfeng hot springs.',
  },
  s0131: {
    literal: 'On jiachen, a partial amnesty was granted to Xinfeng.',
    idiomatic: 'On jiachen he granted a partial amnesty to Xinfeng.',
  },
  s0132: {
    literal: 'On yisi, he returned from the hot springs.',
    idiomatic: 'On yisi he returned from the hot springs.',
  },
  s0133: {
    literal:
      'On wushen, a woman of Muzhou named Chen Shuozhen raised troops in rebellion, styled herself Emperor Wenjia, and seized the subordinate counties of Muzhou.',
    idiomatic:
      'On wushen Chen Shuozhen of Muzhou rebelled, proclaimed herself Emperor Wenjia, and overran the counties of Muzhou.',
  },
  s0134: {
    literal:
      'Prefect of Wuzhou Cui Yixuan and Chief Administrator of the Yangzhou Protectorate Fang Renyu each led troops and pacified her.',
    idiomatic: 'Cui Yixuan of Wuzhou and Fang Renyu of Yangzhou each marched and put down the revolt.',
  },
  s0135: {
    literal: 'In the eleventh month, on guichou, Minister of War and Duke of Gu\'an Cui Dunli became Attendant-in-Ordinary.',
    idiomatic: 'On guichou of the eleventh month Cui Dunli, minister of war and Duke of Gu\'an, became attendant-in-ordinary.',
  },
  s0136: {
    literal: 'The new statutes with commentary were promulgated throughout the realm.',
    idiomatic: 'The revised code with commentary was promulgated empire-wide.',
  },
  s0137: {
    literal:
      'In the twelfth month, on gengzi, Attendant-in-Ordinary and Junior Guardian of the Crown Prince, Duke of Tiao, Gao Jifu died.',
    idiomatic:
      'On gengzi of the twelfth month Gao Jifu, attendant-in-ordinary, junior guardian of the heir, and Duke of Tiao, died.',
  },
  s0138: {
    literal: 'In the spring of the third month of the fifth year of Yonghui, on wuwu, he visited Wannian Palace.',
    idiomatic: 'On wuwu of the third spring month in Yonghui 5 he went to Wannian Palace.',
  },
  s0139: {
    literal: 'On xinwei, a partial amnesty was granted to prisoners in the districts he passed through.',
    idiomatic: 'On xinwei he granted a partial amnesty to prisoners along the route.',
  },
  s0140: {
    literal:
      'Minister of Works Yan Lide was put in charge of forty thousand corvée laborers to build the outer walls of Chang\'an.',
    idiomatic: 'Yan Lide, minister of works, was ordered to raise forty thousand laborers to build Chang\'an\'s outer ramparts.',
  },
  s0141: {
    literal:
      'In the fourth month of summer, Acting Supervising Secretary of the Yellow Gate and Duke of Yingchuan Han Yuan and Acting Vice Director of the Masters of Writing Lai Ji were both additionally made Silver-Gleaming Grand Masters of Splendid Happiness and still deliberated with the Secretariat and Chancellery as if of the third rank.',
    idiomatic:
      'In the fourth summer month Han Yuan of Yingchuan and Lai Ji were both promoted to silver-gleaming grand master while retaining third-rank deliberative rank.',
  },
  s0142: {
    literal:
      'In the intercalary fifth month, on the night of dingchou, great rain fell; the waters rose violently and drowned the people of Linyou County and the guards on rotation, more than three thousand dead.',
    idiomatic:
      'On the night of dingchou in the intercalary fifth month torrential rain burst the rivers; more than three thousand people in Linyou and on guard duty drowned.',
  },
  s0143: {
    literal: 'In the sixth month, Heng Prefecture had great rain; the Hutuo River overflowed and drowned more than five thousand households.',
    idiomatic: 'In the sixth month floods on the Hutuo at Heng Prefecture drowned more than five thousand households.',
  },
  s0144: {
    literal: 'On guichou, Fenyin County in Pu Prefecture had violent rain that drowned the inhabitants and damaged houses.',
    idiomatic: 'On guichou a cloudburst at Fenyin in Pu Prefecture drowned residents and wrecked dwellings.',
  },
  s0145: {
    literal: 'On guihai, Secretariat Director Liu Shi was additionally made Minister of Personnel.',
    idiomatic: 'On guihai Liu Shi, director of the Secretariat, was also made minister of personnel.',
  },
  s0146: {
    literal: 'On bingyin, the districts of Hebei suffered great floods.',
    idiomatic: 'On bingyin great floods struck Hebei.',
  },
  s0147: {
    literal:
      'In the seventh month, on xinsi, small birds like sparrows produced large birds like turtledoves at the emperor\'s former residence in Wannian Palace.',
    idiomatic:
      'On xinsi of the seventh month sparrow-sized birds at Wannian Palace hatched dove-sized young at the emperor\'s old residence.',
  },
  s0148: {
    literal: 'In the eighth month, the Court of Judicial Review reported more than seventy persons sentenced to death.',
    idiomatic: 'In the eighth month the Court of Judicial Review reported more than seventy death sentences.',
  },
  s0149: {
    literal:
      'On xinhai, an edict ordered that from this time forward, when officials of the fifth rank and above died, their fish tally badges need not be recovered.',
    idiomatic:
      'On xinhai he decreed that fifth-rank officials and above would no longer have their rank badges reclaimed at death.',
  },
  s0150: {
    literal:
      'On xinwei, Tibet sent envoys presenting one hundred horses and a great felt hall five zhang high, twenty-seven paces in length and breadth.',
    idiomatic:
      'On xinwei Tibet sent envoys with one hundred horses and a great felt pavilion five zhang high and twenty-seven paces square.',
  },
  s0151: {
    literal: 'In the ninth month, on dingyou, he returned from Wannian Palace.',
    idiomatic: 'On dingyou of the ninth month he returned from Wannian Palace.',
  },
  s0152: {
    literal:
      'In the eleventh month of winter, on guiyou, the outer walls of the capital were built; forty-one thousand commoners of Jingzhao were hired, and rammed earth work ceased after thirty days; each of the nine gates was given a tower.',
    idiomatic:
      'On guiyou of the eleventh winter month the capital\'s outer walls were raised; forty-one thousand Jingzhao households were hired for thirty days of rammed earth, and a watchtower was set on each of the nine gates.',
  },
  s0153: {
    literal:
      'In the twelfth month, on guichou, Wa sent tribute of amber and agate; the amber was as large as a peck-measure and the agate as large as a five-peck vessel.',
    idiomatic:
      'On guichou of the twelfth month Wa sent amber and agate, the amber the size of a peck and the agate of a five-peck jar.',
  },
  s0154: {
    literal: 'On wuwu, he set out from the capital to visit Zhaoling; on the road the prince Xian was born.',
    idiomatic: 'On wuwu he left the capital for Zhaoling; Prince Xian was born on the journey.',
  },
  s0155: {
    literal: 'On jiwei, an edict fixed household registers once every two years.',
    idiomatic: 'On jiwei he decreed a household census every two years.',
  },
  s0156: {
    literal:
      'In the spring of the first month of the sixth year of Yonghui, on renshen, the new year\'s day, he personally visited Zhaoling; a partial amnesty was granted to the people of Liquan County and this year\'s taxes and corvée were remitted.',
    idiomatic:
      'On renshen, new year\'s day of the first spring month in Yonghui 6, he visited Zhaoling in person, pardoned Liquan, and remitted that year\'s taxes and labor.',
  },
  s0157: {
    literal:
      'The generals and commanders who had guarded the tomb were each promoted one grade of nobility; the tomb magistrate and assistant were each raised in rank and given gifts.',
    idiomatic:
      'Tomb guards of general and commander rank were each promoted one noble grade; the tomb magistrate and deputy were raised in rank and rewarded.',
  },
  s0158: {
    literal: 'On jiaxu, he returned from Zhaoling.',
    idiomatic: 'On jiaxu he returned from Zhaoling.',
  },
  s0159: {
    literal: 'A Buddhist temple was built beside the tomb.',
    idiomatic: 'A Buddhist temple was built beside the mausoleum.',
  },
  s0160: {
    literal: 'On gengyin, Prince Hong was enfeoffed as Prince of Dai and Prince Xian as Prince of Lu.',
    idiomatic: 'On gengyin Prince Hong was made Prince of Dai and Prince Xian Prince of Lu.',
  },
  s0161: {
    literal:
      'In the second month, on yisi, Crown Prince Zhong came of age; civil and military officials of the fifth rank and above who were heirs to their fathers received one grade of merit.',
    idiomatic:
      'On yisi of the second month Crown Prince Zhong received the capping rites; fifth-rank heirs among the officials received one grade of merit.',
  },
  s0162: {
    literal: 'A great communal feast lasted three days.',
    idiomatic: 'The court feasted for three days.',
  },
  s0163: {
    literal: 'In the third month, Protector-General of Ying Prefecture Cheng Mingzhen defeated Goguryeo at Guiduan River.',
    idiomatic: 'In the third month Cheng Mingzhen, protector of Ying, routed Goguryeo at Guiduan River.',
  },
  s0164: {
    literal: 'In Jia Prefecture, the wife of Xin Daorang gave birth to four sons at one delivery.',
    idiomatic: 'In Jia Prefecture Xin Daorang\'s wife bore four sons at one birth.',
  },
  s0165: {
    literal: 'On renxu, Consort Wu Zhao composed one chapter of Inner Admonitions.',
    idiomatic: 'On renxu Consort Wu Zhao completed a chapter of Inner Admonitions.',
  },
  s0166: {
    literal:
      'In the fifth month of summer, on guiwei, he ordered Left Guardian of the Left Palace Guard and Duke of the State of Lu Cheng Zhijie and four other generals to lead armies out by the Onion Mountains route to attack Helu.',
    idiomatic:
      'On guiwei of the fifth summer month Cheng Zhijie of Lu and four other generals were ordered to march by the Onion Mountains route against Helu.',
  },
  s0167: {
    literal:
      'Supervising Secretary of the Yellow Gate and Duke of Yingchuan Han Yuan became Attendant-in-Ordinary; Secretariat Draftsman and Baron of Nanyang Lai Ji became Secretariat Director.',
    idiomatic:
      'Han Yuan of Yingchuan became attendant-in-ordinary; Lai Ji of Nanyang became director of the Secretariat.',
  },
  s0168: {
    literal:
      'Liu Shi, additionally Minister of Personnel and Baron of Hedong, was demoted to Prefect of Sui Prefecture.',
    idiomatic: 'Liu Shi of Hedong, who also held the Ministry of Personnel, was demoted to prefect of Sui.',
  },
  s0169: {
    literal: 'In the sixth month, the Arabs sent envoys with tribute.',
    idiomatic: 'In the sixth month the Arabs sent envoys with tribute.',
  },
  s0170: {
    literal: 'In the seventh month of autumn, on yihai, Attendant-in-Ordinary and Duke of Gu\'an Cui Dunli became Secretariat Director.',
    idiomatic: 'On yihai of the seventh autumn month Cui Dunli, attendant-in-ordinary and Duke of Gu\'an, became director of the Secretariat.',
  },
  s0171: {
    literal: 'On yiyou, official residences throughout the districts and prefectures were equalized.',
    idiomatic: 'On yiyou official residences empire-wide were equalized in scale.',
  },
  s0172: {
    literal:
      'In the eighth month, Palace Medical Attendant Jiang Xiaozhang was specially appointed as supernumerary and still treated as regular.',
    idiomatic:
      'In the eighth month palace medical attendant Jiang Xiaozhang was given a special supernumerary appointment with regular standing.',
  },
  s0173: {
    literal: 'Supernumerary with regular standing began with Jiang Xiaozhang.',
    idiomatic: 'The rank of supernumerary with regular standing began with Jiang Xiaozhang.',
  },
  s0174: {
    literal: 'On jiyou, the Court of Judicial Review again established one additional vice director.',
    idiomatic: 'On jiyou the Court of Judicial Review added a second vice director.',
  },
  s0175: {
    literal:
      'Earlier there had been great rain and the roads were impassable; grain prices in the capital soared; grain from the storehouses was sold to the people; and constant granaries were established in the eastern and western markets of the capital.',
    idiomatic:
      'After heavy rains had blocked the roads and driven up grain prices, the court sold storehouse grain and set up relief granaries in the capital\'s eastern and western markets.',
  },
  s0176: {
    literal:
      'In the ninth month, on gengwu, Right Vice Director and Duke of Henan Chu Suiliang, for remonstrating against establishing Consort Wu Zhao, was demoted and made Protector-General of Tan Prefecture.',
    idiomatic:
      'On gengwu of the ninth month Chu Suiliang, right vice director and Duke of Henan, was demoted to protector of Tan for opposing Wu Zhao\'s elevation as empress.',
  },
  s0177: {
    literal: 'On yiyou, Luoyang suffered great floods that destroyed the Tianjin Bridge.',
    idiomatic: 'On yiyou floods at Luoyang destroyed the Tianjin Bridge.',
  },
  s0178: {
    literal:
      'In the tenth month of winter, on jiyou, Empress Wang was deposed to commoner status and Consort Wu Zhao was established as empress; a great amnesty was proclaimed for all under Heaven.',
    idiomatic:
      'On jiyou of the tenth winter month Empress Wang was deposed and Consort Wu Zhao made empress; the court proclaimed a general amnesty.',
  },
  s0179: {
    literal:
      'In the eleventh month, on the dingmao new year\'s day, he took his seat at the hall; he ordered Minister of State Ji and Left Vice Director Yu Zhining to invest the empress; civil and military officials and the chiefs of the foreign tribes attended the empress at Suyi Gate.',
    idiomatic:
      'On dingmao, new year\'s day of the eleventh month, he presided in the hall as Ji and Yu Zhining invested the empress; officials and foreign chiefs received her at Suyi Gate.',
  },
  s0180: {
    literal: 'In the eleventh month, on jisi, the empress was presented at the Ancestral Temple.',
    idiomatic: 'On jisi of the eleventh month the empress was presented at the ancestral temple.',
  },
  s0181: {
    literal:
      'On guiyou, the empress\'s late father, the former Minister of Works, Duke of Ying, posthumously made Protector-General of Bing, Wu Shiyue, was posthumously made Minister of State.',
    idiomatic:
      'On guiyou Wu Shiyue, the empress\'s late father and former minister of works, Duke of Ying, was posthumously made minister of state.',
  },
  s0182: {
    literal:
      'On bingzi, Wei of Gaoyuan County in Zi Prefecture, wife of Wu Wenwei, gave birth to four sons at one delivery, three of whom survived.',
    idiomatic:
      'On bingzi Wei, wife of Wu Wenwei of Gaoyuan in Zi, bore four sons at once; three lived.',
  },
  s0183: {
    literal: 'On guisi, Lady Yang of the State of Ying was re-enfeoffed as Lady of the State of Dai.',
    idiomatic: 'On guisi Lady Yang of Ying was re-enfeoffed as Lady of Dai.',
  },
  s0184: {
    literal:
      'In the twelfth month, Minister of Rites and Baron of Gaoyang Xu Jingzong was ordered to attend daily at the western gate of Wude Hall as Awaiting Imperial Command.',
    idiomatic:
      'In the twelfth month Xu Jingzong, minister of rites and Baron of Gaoyang, was ordered to attend daily at the west gate of Wude Hall.',
  },
  s0185: {
    literal:
      'In the spring of the first month of the seventh year, on xinwei, Crown Prince Zhong was deposed to Prince of Liang and Prince Hong of Dai was established as crown prince.',
    idiomatic:
      'On xinwei of the first spring month in Xianqing 1 Crown Prince Zhong was demoted to Prince of Liang and Dai Prince Hong made heir.',
  },
  s0186: {
    literal: 'On renshen, a great amnesty was proclaimed and the era name was changed to Xianqing.',
    idiomatic: 'On renshen he proclaimed a general amnesty and changed the era name to Xianqing.',
  },
  s0187: {
    literal:
      'Civil and military officials of the ninth rank and above and sons of the fifth rank and below who were heirs to their fathers received one turn of merit.',
    idiomatic:
      'Officials of the ninth rank and above and fifth-rank heirs received one grade of merit.',
  },
  s0188: {
    literal: 'A great communal feast lasted three days.',
    idiomatic: 'The court feasted for three days.',
  },
  s0189: {
    literal:
      'On jiazi, Left Vice Director and Junior Tutor of the Crown Prince, Duke of Yan, Yu Zhining was additionally made Grand Tutor of the Crown Prince; Attendant-in-Ordinary Han Yuan, Secretariat Director Lai Ji, and Minister of Rites Xu Jingzong were all made Guests of the Heir Apparent.',
    idiomatic:
      'On jiazi Yu Zhining, left vice director and junior tutor, Duke of Yan, became grand tutor; Han Yuan, Lai Ji, and Xu Jingzong became guests of the heir.',
  },
  s0190: {
    literal: 'The office of Guest of the Heir Apparent was established for the first time.',
    idiomatic: 'The post of guest of the heir was established for the first time.',
  },
  s0191: {
    literal:
      'He took his seat at the Xuanwu Gate and gave a farewell feast for Cheng Zhijie, supreme commander of the Onion Mountains route.',
    idiomatic: 'He held court at the Xuanwu Gate and feasted Cheng Zhijie, commander of the Onion Mountains campaign, on his departure.',
  },
  s0192: {
    literal: 'In the second month, on gengyin, Battle Array Music was renamed Divine Merit Battle Array Music.',
    idiomatic: 'On gengyin Battle Array Music was renamed Divine Merit Battle Array Music.',
  },
  s0193: {
    literal: 'On xinhai, posthumous Minister of State Wu Shiyue was made Minister of Works and Duke of Zhou.',
    idiomatic: 'On xinhai Wu Shiyue was posthumously made minister of works and Duke of Zhou.',
  },
  s0194: {
    literal: 'In the third month, on xinsi, the empress sacrificed to the Silkworm Ancestor at the northern suburb.',
    idiomatic: 'On xinsi of the third month the empress sacrificed to the silkworm ancestor at the northern suburb.',
  },
  s0195: {
    literal:
      'On bingxu, Vice Director of the Ministry of Revenue Du Zhenlun became Acting Supervising Secretary of the Yellow Gate and deliberated with the Secretariat and Chancellery as if of the third rank.',
    idiomatic:
      'On bingxu Du Zhenlun, vice minister of revenue, became acting supervising secretary with third-rank deliberative standing.',
  },
  s0196: {
    literal:
      'In the fourth month of summer, on wushen, he took his seat at Anfu Gate to watch the monk Xuanzang welcome the imperially composed inscription for Cien Monastery; the procession followed Indian ritual, and his followers were very numerous.',
    idiomatic:
      'On wushen of the fourth summer month he watched from Anfu Gate as Xuanzang led the imperial inscription for Cien Monastery in Indian ceremony, with a vast following.',
  },
  s0197: {
    literal:
      'In the fifth month, on jimao, Grand Mentor Zhangsun Wuji presented the thirty scrolls of the Monographs of the Five Dynasties Histories of Liang, Chen, Zhou, Qi, and Sui compiled by the historiographers.',
    idiomatic:
      'On jimao of the fifth month Zhangsun Wuji presented thirty scrolls of monographs from the Liang, Chen, Zhou, Qi, and Sui histories compiled by the historiographers.',
  },
  s0198: {
    literal:
      'Hongwen Guan academician Xu Jingzong presented the two hundred scrolls of the Eastern Hall New Books he had compiled; the emperor himself composed the preface.',
    idiomatic:
      'Hongwen academician Xu Jingzong presented his Eastern Hall New Books in two hundred scrolls; the emperor wrote the preface himself.',
  },
  s0199: {
    literal: 'In the sixth month, Prefect of Qi Prefecture and Lu Prince Xian became Protector-General of Yong Prefecture.',
    idiomatic: 'In the sixth month Lu Prince Xian of Qi became protector of Yong.',
  },
  s0200: {
    literal:
      'In the seventh month of autumn, on guiwei, Secretariat Director and Inspector of the Heir Apparent\'s Affairs, Duke of Gu\'an, Cui Dunli became Junior Preceptor of the Crown Prince and still deliberated with the Secretariat and Chancellery as if of the third rank.',
    idiomatic:
      'On guiwei of the seventh autumn month Cui Dunli, director of the Secretariat and inspector of the heir\'s affairs, Duke of Gu\'an, became junior preceptor while retaining third-rank deliberative standing.',
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
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s0101–s0200).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '004') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 004; standalone T ready (${Object.keys(T).length} entries).`
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
console.log('Applied', applied, 'translations (s0101–s0200) to', transPath);
