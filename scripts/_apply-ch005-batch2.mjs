#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.005, Gaozong 2 — Xianheng through Shangyuan) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/005.json';
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
    literal:
      'On xinhai, Right Majestic Guard General Xue Rengui was made Grand Commander of the Campaign on the Luosa Route; Right Guard Assistant General Ashina Daozhen and Left Guard General Guo Daifeng were made his deputies, leading fifty thousand troops to attack Tibet.',
    idiomatic:
      'On xinhai Xue Rengui, right majestic guard general, was made grand commander of the Luosa campaign; Ashina Daozhen and Guo Daifeng were his deputies, with fifty thousand men to strike Tibet.',
  },
  s0102: {
    literal: 'On gengwu, he visited Jiucheng Palace.',
    idiomatic: 'On gengwu he went to Jiucheng Palace.',
  },
  s0103: {
    literal: 'Yong Prefecture had great hail.',
    idiomatic: 'Yong Prefecture was struck by heavy hail.',
  },
  s0104: {
    literal:
      'On bingxu of the fifth month, an edict said: "Confucius temples and academies in districts and counties that are damaged or were never built leave students without places to study and the Former Master without sacrificial rites, long exposed to wind and rain—far from honoring the root of learning."',
    idiomatic:
      'On bingxu of the fifth month an edict lamented that broken or never-built Confucian temples and schools left students nowhere to study and the Master without rites, long rotting in the weather—far from honoring learning\'s root.',
  },
  s0105: {
    literal: '"Let the relevant offices speedily undertake repairs and construction."',
    idiomatic: '"Let the responsible offices repair and build them at once."',
  },
  s0106: {
    literal: '"',
    idiomatic: '[End of edict.]',
  },
  s0107: {
    literal: 'On renyin, the first day of the sixth month, there was an eclipse of the sun.',
    idiomatic: 'On renyin, new moon of the sixth month, the sun was eclipsed.',
  },
  s0108: {
    literal:
      'In the seventh month of autumn, on wuzi, former Vice Director of the Western Terrace Li Jingxuan was recalled to his former post and still deliberated with the Eastern and Western Terraces as third rank.',
    idiomatic:
      'On wuzi of the seventh autumn month Li Jingxuan, former vice director of the western terrace, was recalled and again deliberated with both terraces at third rank.',
  },
  s0109: {
    literal:
      'Xue Rengui and Guo Daifeng reached the Dafei River and were ambushed by the Tibetan general Lun Qinling; they suffered a great defeat, and Rengui and the others were all stripped of office.',
    idiomatic:
      'At the Dafei River Xue Rengui and Guo Daifeng were ambushed by the Tibetan general Lun Qinling and routed; Rengui and his colleagues were all dismissed.',
  },
  s0110: {
    literal:
      'The Tuyuhun kingdom was entirely lost; only Murong Nuohebo and several thousand tents of his close followers submitted and were relocated within Lingzhou.',
    idiomatic:
      'The Tuyuhun state perished; only Murong Nuohebo and a few thousand tents of his kin submitted and were resettled within Lingzhou.',
  },
  s0111: {
    literal: 'On jiazi of the eighth month, he returned from Jiucheng Palace.',
    idiomatic: 'On jiazi of the eighth month he returned from Jiucheng Palace.',
  },
  s0112: {
    literal: 'Liangzhou Military Governor Prince Zhao Fu died.',
    idiomatic: 'Prince Zhao Fu, military governor of Liang, died.',
  },
  s0113: {
    literal: 'On bingyin, citing long drought, he avoided the main hall and reduced his meals.',
    idiomatic: 'On bingyin, citing drought, he left the main hall and ate sparingly.',
  },
  s0114: {
    literal:
      'On jiashen of the ninth month, Lady of the State of Wei Yang died; she was posthumously made Lady of the State of Lu with the posthumous title Loyal and Ardent.',
    idiomatic:
      'On jiashen of the ninth month Lady Yang of Wei died; she was posthumously made Lady of Lu with the title Loyal and Ardent.',
  },
  s0115: {
    literal:
      'On renzi of the intercalary month, the late Grand Tutor Zhou Duke of Loyal Filial Piety Shiyu was posthumously made Grand Preceptor and Prince of Taiyuan; the late Lady of Loyal Ardency of Lu was posthumously made Princess of Taiyuan.',
    idiomatic:
      'On renzi of the intercalary month the late Grand Tutor Shiyu, Duke of Zhou, was posthumously made grand preceptor and Prince of Taiyuan, and the late Lady of Loyal Ardency of Lu was made Princess of Taiyuan.',
  },
  s0116: {
    literal:
      'On jiayin, the Princess of Taiyuan was buried; civil and military officials of the ninth rank and above in the capital and outer-order consorts escorted her to the lodging at Bian Bridge.',
    idiomatic:
      'On jiayin the Princess of Taiyuan was buried; capital officials of the ninth rank and above and outer-order consorts escorted her to the lodge at Bian Bridge.',
  },
  s0117: {
    literal:
      'In the tenth winter month, on guiyou, great snow piled more than three chi on level ground; those who froze to death on the roads were given silk for coffins.',
    idiomatic:
      'On guiyou of the tenth winter month snow lay more than three feet deep on level ground; those who froze on the roads were given silk for coffins.',
  },
  s0118: {
    literal:
      'An order to Yong, Tong, and Hua: poor households with children under fifteen unable to survive might give them to anyone to raise as sons or daughters for service—they must not be made slaves.',
    idiomatic:
      'Yong, Tong, and Hua were ordered: poor families with children under fifteen who could not be kept might place them with anyone as sons or daughters for service—but not as slaves.',
  },
  s0119: {
    literal:
      'On bingshen, Right Protector of the Heir and Acting Rectifier of Remonstrance Zhao Renben was made Left Secretariat Director and removed from deliberations.',
    idiomatic:
      'On bingshen Zhao Renben, right protector of the heir and acting rectifier, became left secretariat director and left the council.',
  },
  s0120: {
    literal: 'On gengyin of the twelfth month, all offices and officials reverted to their former names.',
    idiomatic: 'On gengyin of the twelfth month every office and title reverted to its former name.',
  },
  s0121: {
    literal:
      'This year more than forty districts suffered drought, frost, and insects; the people were hungry, especially in Guanzhong.',
    idiomatic:
      'That year more than forty prefectures suffered drought, frost, and locusts; the people went hungry, worst of all in Guanzhong.',
  },
  s0122: {
    literal:
      'An edict allowed people to go to any district to seek food, and southern Jiang grain tax was diverted for relief.',
    idiomatic:
      'An edict let people travel to any prefecture for food and diverted Jiangnan rent grain for relief.',
  },
  s0123: {
    literal: 'In the spring first month of the second year of Xianheng, on yisi, he went to the eastern capital.',
    idiomatic: 'On yisi of the first spring month in Xianheng 2 he went to the eastern capital.',
  },
  s0124: {
    literal:
      'He left Crown Prince Hong in the capital to oversee the state and ordered Attendant-in-Ordinary Dai Zhide, Zhang Wenguan, Li Jingxuan, and others to assist him.',
    idiomatic:
      'He left Crown Prince Hong in Chang\'an to oversee the realm and ordered Dai Zhide, Zhang Wenguan, Li Jingxuan, and others to assist him.',
  },
  s0125: {
    literal: 'Only Yan Liben and Hao Chujun accompanied him.',
    idiomatic: 'Only Yan Liben and Hao Chujun went with him.',
  },
  s0126: {
    literal: 'On jiazi, he arrived at the eastern capital.',
    idiomatic: 'On jiazi he reached the eastern capital.',
  },
  s0127: {
    literal:
      'On dinghai of the second month, Liang Jinzhu of Yong Prefecture offered three thousand strings of cash to relieve the poor.',
    idiomatic:
      'On dinghai of the second month Liang Jinzhu of Yong offered three thousand strings of cash to feed the poor.',
  },
  s0128: {
    literal: 'On wuzi of the fourth summer month, great wind broke trees.',
    idiomatic: 'On wuzi of the fourth summer month a great wind snapped trees.',
  },
  s0129: {
    literal:
      'On wuyin of the sixth month, Left Attendant-in-Ordinary, concurrent Inspector of the Secretariat, Guest of the Heir, Duke of Zhou Wu Minzhi was restored to his original surname Helan for his crime, dismissed, and exiled to Leizhou.',
    idiomatic:
      'On wuyin of the sixth month Wu Minzhi, left attendant-in-ordinary, secretariat inspector, and heir\'s guest, Duke of Zhou, was stripped of the Wu surname, dismissed, and exiled to Lei for his crimes.',
  },
  s0130: {
    literal: 'On dinghai, citing drought, he personally reviewed prisoners.',
    idiomatic: 'On dinghai, citing drought, he reviewed prisoners in person.',
  },
  s0131: {
    literal: 'In the autumn ninth month, there was an earthquake.',
    idiomatic: 'In the ninth autumn month the earth quaked.',
  },
  s0132: {
    literal: 'Grand Tutor, Governor of Lu, Prince Xu Yuanli died.',
    idiomatic: 'Yuanli, Prince Xu, grand tutor and governor of Lu, died.',
  },
  s0133: {
    literal: 'In the tenth winter month, search was made for persons accomplished in ritual and music.',
    idiomatic: 'In the tenth winter month the court sought men skilled in ritual and music.',
  },
  s0134: {
    literal: 'On jiawu, new moon of the eleventh month, there was an eclipse of the sun.',
    idiomatic: 'On jiawu, new moon of the eleventh month, the sun was eclipsed.',
  },
  s0135: {
    literal: 'On gengxu, he visited Xu, Ru, and other districts for military drill.',
    idiomatic: 'On gengxu he toured Xu, Ru, and neighboring prefectures to review troops.',
  },
  s0136: {
    literal:
      'On guiyou, winter hunt; he inspected game on the south bank of the Kun River in Ye County, Xu Prefecture.',
    idiomatic:
      'On guiyou he held the winter hunt and coursed game on the south bank of the Kun in Ye, Xu Prefecture.',
  },
  s0137: {
    literal: 'On bingxu of the twelfth month, he returned to the eastern capital.',
    idiomatic: 'On bingxu of the twelfth month he returned to the eastern capital.',
  },
  s0138: {
    literal:
      'In the spring first month of the third year of Xianheng, on xinchou, troops were raised from eighteen districts including Liang and Yi, five thousand three hundred men were recruited, and Right Guard Vice Commander Liang Jishou was sent to Yaozhou to attack rebel barbarians.',
    idiomatic:
      'On xinchou of the first spring month in Xianheng 3 the court raised troops from eighteen circuits including Liang and Yi, enlisted five thousand three hundred men, and sent Liang Jishou, vice commander of the right guard, against the rebel tribes in Yaozhou.',
  },
  s0139: {
    literal: 'On xinwei, the people of Yong and Luo were allowed to serve officials of their home prefectures.',
    idiomatic: 'On xinwei the people of Yong and Luo were permitted to take office in their home prefectures.',
  },
  s0140: {
    literal: 'On jimao, Attendant-in-Ordinary and Duke of Yong\'an Jiang Ke died at the Hexi garrison.',
    idiomatic: 'On jimao Jiang Ke, attendant-in-ordinary and Duke of Yong\'an, died on the Hexi frontier.',
  },
  s0141: {
    literal: 'On wuyin of the fourth summer month, he visited Hebi Palace.',
    idiomatic: 'On wuyin of the fourth summer month he went to Hebi Palace.',
  },
  s0142: {
    literal: 'On renwu, he trained banners south of the water.',
    idiomatic: 'On renwu he drilled the banners south of the river.',
  },
  s0143: {
    literal:
      'The emperor asked Secretariat Director Yan Liben and Vice Director of the Yellow Gate Hao Chujun: "When Yi Yin carried the tripod and meat board to Tang, was that to repair government at a time of disorder—and where was the tripod cast, in what state?',
    idiomatic:
      'He asked Yan Liben and Hao Chujun: "When Yi Yin carried the cauldron and offering board to Tang, was he mending government in crisis—and where was that cauldron cast, in which realm?',
  },
  s0144: {
    literal: 'Was it to be the state\'s great vessel, handed down through generations as treasure?"',
    idiomatic: 'Was it meant as the realm\'s great treasure, passed down through the ages?"',
  },
  s0145: {
    literal: 'Yan Liben answered from ancient lore.',
    idiomatic: 'Yan Liben answered from the ancient precedents.',
  },
  s0146: {
    literal:
      'On yiwei of the fifth month, fifth rank and above were given new fish tally bags trimmed with silver;',
    idiomatic:
      'On yiwei of the fifth month officials of the fifth rank and above received new fish tally badges edged in silver;',
  },
  s0147: {
    literal: 'third rank and above each received a gold-mounted knife and whetstone.',
    idiomatic: 'those of the third rank and above each received a gold-mounted knife and whetstone.',
  },
  s0148: {
    literal: 'On bingzi of the sixth month, a granary was established at Boya in Luozhou.',
    idiomatic: 'On bingzi of the sixth month a granary was set up at Boya in Luozhou.',
  },
  s0149: {
    literal: 'On renzi of the eighth month, Special Grand Master and Duke of Gaoyang Xu Jingzong died.',
    idiomatic: 'On renzi of the eighth month Xu Jingzong, special grand master and Duke of Gaoyang, died.',
  },
  s0150: {
    literal:
      'On maoyin of the ninth month, the Great Protectorate of Ji was restored to Weizhou, and Weizhou to Jizhou.',
    idiomatic:
      'On maoyin of the ninth month the Ji protectorate was restored to Weizhou and Weizhou to Jizhou.',
  },
  s0151: {
    literal: 'On renyin, Prince Xian of Pei was transferred to Prince of Yong.',
    idiomatic: 'On renyin Prince Xian of Pei was reassigned as Prince of Yong.',
  },
  s0152: {
    literal: 'On jiwei of the tenth month, the crown prince oversaw the state.',
    idiomatic: 'On jiwei of the tenth month the crown prince oversaw the realm.',
  },
  s0153: {
    literal: 'On renxu, the imperial carriage returned to the capital.',
    idiomatic: 'On renxu the emperor returned to Chang\'an.',
  },
  s0154: {
    literal:
      'On yihai, Vice Director of the Masters of Writing and Duke of Daoguo Dai Zhide was additionally made Minister of Revenue; Vice Director of the Yellow Gate Zhang Wenguan was made Acting Director of the Court of Judicial Review; Vice Director of the Yellow Gate and Baron of Zhenshan Hao Chujun became Vice Director of the Masters of Writing; Vice Director of the Masters of Writing and Baron of Zhenshan Li Jingxuan became Vice Minister of Personnel—all still deliberated with the Secretariat and Chancellery as third rank.',
    idiomatic:
      'On yihai Dai Zhide, vice director and Duke of Daoguo, was also made minister of revenue; Zhang Wenguan, vice director of the yellow gate, acting director of judicial review; Hao Chujun, baron of Zhenshan, vice director of the masters of writing; Li Jingxuan, baron of Zhenshan, vice minister of personnel—all retaining third-rank deliberative standing.',
  },
  s0155: {
    literal: 'On wuzi, new moon of the eleventh month, there was an eclipse of the sun.',
    idiomatic: 'On wuzi, new moon of the eleventh month, the sun was eclipsed.',
  },
  s0156: {
    literal: 'On jiachen, he returned from the eastern capital.',
    idiomatic: 'On jiachen he returned from the eastern capital.',
  },
  s0157: {
    literal: 'On guimao, Left Chancellery Aide Liu Ren\'gui was made third rank with the Secretariat and Chancellery.',
    idiomatic: 'On guimao Liu Ren\'gui, left chancellery aide, joined deliberations at third rank.',
  },
  s0158: {
    literal: 'This winter Left Gate Guard General Gao Kan routed the Silla army at Hengshui.',
    idiomatic: 'That winter Gao Kan, left gate guard general, crushed the Silla host at Hengshui.',
  },
  s0159: {
    literal:
      'In the spring first month of the fourth year of Xianheng, on jiawu, an edict said: "Those taken in as sons, daughters, or servants under the Xianheng 1 relief policy may be paid the cost of food and clothing and released to their home districts."',
    idiomatic:
      'On jiawu of the first spring month in Xianheng 4 an edict ruled that children taken in for service under the Xianheng 1 famine policy might be redeemed for the cost of their keep and sent home.',
  },
  s0160: {
    literal: 'On bingchen, Governor of Jiang and Prince of Zheng Yuanyi died.',
    idiomatic: 'On bingchen Yuanyi, Prince of Zheng and governor of Jiang, died.',
  },
  s0161: {
    literal:
      'On renwu of the second month, the daughter of Left Golden Guard General Pei Judao was made consort to Crown Prince Hong.',
    idiomatic:
      'On renwu of the second month Pei Judao\'s daughter, of the left golden guard, became Crown Prince Hong\'s consort.',
  },
  s0162: {
    literal: 'On bingzi of the fourth summer month, he visited Jiucheng Palace.',
    idiomatic: 'On bingzi of the fourth summer month he went to Jiucheng Palace.',
  },
  s0163: {
    literal:
      'On dingmao of the intercalary fifth month, Yanshan Route Commander Li Jinxing defeated Goguryeo rebels west of the Hulu River; the remaining forces of Pyongyang fled into Silla.',
    idiomatic:
      'On dingmao of the intercalary fifth month Li Jinxing, commander of the Yanshan route, routed Goguryeo rebels west of the Hulu; Pyongyang\'s remnant forces fled into Silla.',
  },
  s0164: {
    literal:
      'On gengwu of the seventh month, the crown prince\'s new palace at Jiucheng was completed; the emperor summoned fifth-rank kin and above to feast in the prince\'s palace and rejoiced until night.',
    idiomatic:
      'On gengwu of the seventh month the heir\'s new palace at Jiucheng was finished; he summoned fifth-rank kin and above to feast there and caroused until night.',
  },
  s0165: {
    literal:
      'On xinsi, Wuzhou was struck by violent rain and flooding; six hundred households were drowned; an edict ordered relief.',
    idiomatic:
      'On xinsi cloudbursts at Wuzhou drowned six hundred households; the court ordered relief.',
  },
  s0166: {
    literal:
      'On xinchou of the eighth month, the emperor fell ill with malaria and ordered the crown prince to receive memorials from all offices.',
    idiomatic:
      'On xinchou of the eighth month the emperor took to his bed with malaria and had the heir receive memorials from every office.',
  },
  s0167: {
    literal: 'On jiwei, a great wind destroyed the ridge ornaments of the Ancestral Temple.',
    idiomatic: 'On jiwei a gale tore the Ancestral Temple\'s ridge ornaments from the roof.',
  },
  s0168: {
    literal: 'On renwu of the tenth month, Secretariat Director and Baron of Boling Yan Liben died.',
    idiomatic: 'On renwu of the tenth month Yan Liben, secretariat director and Baron of Boling, died.',
  },
  s0169: {
    literal:
      'On yiwei, when the crown prince\'s wedding rites were complete, a partial amnesty was granted to Qi Prefecture and a great feast lasted three days.',
    idiomatic:
      'On yiwei, when the heir\'s wedding was complete, the court pardoned Qi and feasted for three days.',
  },
  s0170: {
    literal: 'On gengzi, he returned to the capital.',
    idiomatic: 'On gengzi he returned to Chang\'an.',
  },
  s0171: {
    literal: 'On yisi, he returned from Jiucheng Palace.',
    idiomatic: 'On yisi he came back from Jiucheng Palace.',
  },
  s0172: {
    literal:
      'On bingyin of the eleventh month, the emperor composed musical pieces including "Supreme Origin," "Two Modes," "Three Powers," "Four Seasons," "Five Phases," "Six Tones," "Seven Regulators," "Eight Winds," "Nine Palaces," "Ten Isles," "Attaining Unity," and "Auspicious Clouds," and ordered them played at all great sacrifices.',
    idiomatic:
      'On bingyin of the eleventh month he composed twelve suite pieces—from "Supreme Origin" through "Auspicious Clouds"—and ordered them played at every great sacrifice.',
  },
  s0173: {
    literal: 'On bingwu of the twelfth month, the kings of Gongyue and Shule came to court to submit.',
    idiomatic: 'On bingwu of the twelfth month the kings of Gongyue and Shule came to submit.',
  },
  s0174: {
    literal:
      'In the spring second month of the first year of Shangyuan, on renwu, Left Chancellery Aide Liu Ren\'gui was made Grand Commander of the Jilin Route to attack Silla, with Commandant of the Court of Imperial Sacrifices Li Bi and Right Collar Guard General Li Jinxing as his deputies.',
    idiomatic:
      'On renwu of the second spring month in Shangyuan 1 Liu Ren\'gui, left chancellery aide, was made grand commander of the Jilin campaign against Silla, with Li Bi and Li Jinxing as deputies.',
  },
  s0175: {
    literal: 'On xinhai, new moon of the third month, there was an eclipse of the sun.',
    idiomatic: 'On xinhai, new moon of the third month, the sun was eclipsed.',
  },
  s0176: {
    literal: 'On jisi, the empress sacrificed to the Silkworm Ancestor.',
    idiomatic: 'On jisi the empress sacrificed to the silkworm ancestor.',
  },
  s0177: {
    literal:
      'On xinmao of the fourth summer month, Palace Chariot Attendant and Duke of Zhou Wu Chengsi was made Director of the Imperial Clan.',
    idiomatic:
      'On xinmao of the fourth summer month Wu Chengsi, palace chariot attendant and Duke of Zhou, became director of the imperial clan.',
  },
  s0178: {
    literal:
      'On jiwei of the fifth month, an edict said: "The spring and autumn she sacrifices were instituted to pray for the harvest; we hear that apart from these, separate village gatherings are held.',
    idiomatic:
      'On jiwei of the fifth month an edict said: "The spring and autumn she rites exist to pray for the harvest, yet apart from them villages hold their own gatherings.',
  },
  s0179: {
    literal:
      'Henceforth, apart from the two she days, no gatherings are permitted; the relevant offices are strictly to forbid them."',
    idiomatic:
      'From now on, save the two she days, no such assemblies are allowed; the offices must forbid them strictly."',
  },
  s0180: {
    literal: '"',
    idiomatic: '[End of edict.]',
  },
  s0181: {
    literal: 'On renyin of the sixth month, the White Planet entered the Eastern Well.',
    idiomatic: 'On renyin of the sixth month Venus entered the Well mansion.',
  },
  s0182: {
    literal:
      'On renchen of the eighth month, Duke of Manifest Simplicity was posthumously honored as Manifest Emperor, Prince of Manifest Virtue as Radiant Emperor, Martial Emperor the Founding Ancestor as High Ancestor Divine Yao Emperor, Literary Emperor the Founding Ancestor as Civil and Martial Sage Emperor, Grand Empress of Grand Tranquility as Grand Tranquility Divine Empress, and Empress of Literary Virtue as Literary Virtue Sage Empress; the emperor was styled Heavenly Sovereign and the empress Heavenly Empress.',
    idiomatic:
      'On renchen of the eighth month the court raised posthumous imperial titles for the founders through Taizong and their consorts, styled the emperor Heavenly Sovereign and the empress Heavenly Empress.',
  },
  s0183: {
    literal: 'Xianheng 5 was changed to Shangyuan 1, and a great amnesty was proclaimed.',
    idiomatic: 'The era was changed from Xianheng 5 to Shangyuan 1 and a general amnesty was proclaimed.',
  },
  s0184: {
    literal:
      'On wuxu, an edict ordered that civil and military officials of the third rank and above wear purple with jade belts;',
    idiomatic:
      'On wuxu an edict fixed court dress: third rank and above wore purple with jade belts;',
  },
  s0185: {
    literal: 'fourth rank deep scarlet, fifth rank pale scarlet, all with gold belts;',
    idiomatic: 'fourth rank deep scarlet, fifth pale scarlet, both with gold belts;',
  },
  s0186: {
    literal: 'sixth rank deep green, seventh rank pale green, all with silver belts;',
    idiomatic: 'sixth deep green, seventh pale green, both with silver belts;',
  },
  s0187: {
    literal: 'eighth rank deep blue, ninth rank pale blue, with pewter belts;',
    idiomatic: 'eighth deep blue, ninth pale blue, with pewter belts;',
  },
  s0188: {
    literal: 'commoners wore yellow with copper and iron belts.',
    idiomatic: 'commoners wore yellow with copper or iron belts.',
  },
  s0189: {
    literal:
      'Civil officials of the first rank and below all carried hand towels, counting bags, knives, and whetstones; military officials might carry them if they wished.',
    idiomatic:
      'Civil officials through the first rank carried hand towels, counting bags, knives, and whetstones; military men might do the same if they chose.',
  },
  s0190: {
    literal: 'On xinhai of the ninth month, the hundred officials wore the new robes and the emperor feasted them at Lindde Hall.',
    idiomatic: 'On xinhai of the ninth month the bureaucracy donned the new robes and he feasted them at Lindde Hall.',
  },
  s0191: {
    literal:
      'On guichou, Zhangsun Wuji\'s offices and titles were posthumously restored; his great-grandson Yi was enfeoffed Duke of Zhao and permitted burial in the tomb prepared for him at Zhaoling.',
    idiomatic:
      'On guichou Zhangsun Wuji\'s rank was posthumously restored; his great-grandson Yi inherited the Dukedom of Zhao and was allowed burial in the grave prepared for him at Zhaoling.',
  },
  s0192: {
    literal: 'On bingwu, new moon of the eleventh month, he went to the eastern capital.',
    idiomatic: 'On bingwu, the new moon of the eleventh month, he set out for the eastern capital.',
  },
  s0193: {
    literal: 'On jiyou, he hunted at Quwuyuan on Mount Hua.',
    idiomatic: 'On jiyou he hunted at Quwuyuan on Mount Hua.',
  },
  s0194: {
    literal: 'On wuchen, he arrived at the eastern capital.',
    idiomatic: 'On wuchen he reached the eastern capital.',
  },
  s0195: {
    literal: 'In the twelfth month, Prince Jiang Yun died.',
    idiomatic: 'In the twelfth month Prince Jiang of Jiang died.',
  },
  s0196: {
    literal: 'On wuzi, the king of Khotan, Fuzhan Xiong, came to court.',
    idiomatic: 'On wuzi Fuzhan Xiong, king of Khotan, came to court.',
  },
  s0197: {
    literal: 'On xinmao, the king of Persia, Peroz, came to court.',
    idiomatic: 'On xinmao Peroz, king of Persia, came to court.',
  },
  s0198: {
    literal: 'On xinmao, the king of Persia, Peroz, came to court.',
    idiomatic: 'On xinmao Peroz, king of Persia, came to court.',
  },
  s0199: {
    literal:
      'On renyin, the Heavenly Empress presented twelve proposals: she asked that princes, dukes, and the hundred officials all study the Laozi, and that each year one classics candidate be examined on the Classic of Filial Piety and Analects by the same rule as the classics examination.',
    idiomatic:
      'On renyin the Heavenly Empress submitted twelve proposals: that the nobility and bureaucracy study the Laozi, and that each year one classics candidate be tested on the Classic of Filial Piety and the Analects under the same rule as the regular examination.',
  },
  s0200: {
    literal: 'She also asked that when father and son were both alive, one serve one\'s mother in mourning for three years.',
    idiomatic: 'She also asked that while father and son both lived, a son mourn his mother for three years.',
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
console.log('Applied', applied, 'translations (s0101–s0200) to', transPath);
