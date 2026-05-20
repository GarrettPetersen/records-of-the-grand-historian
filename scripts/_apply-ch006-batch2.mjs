#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.006, Empress Wu — Zhou founding through early reign) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/006.json';
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
    literal: 'On bingxu, the Wu clan ancestral temple was first established at the Divine Capital.',
    idiomatic:
      'On bingxu the Wu ancestral shrine was founded in the Divine Capital for the first time.',
  },
  s0102: {
    literal:
      'Posthumously honored the Divine Sovereign\'s father, the late Grand Marshal and Prince of Taiyuan Shi Yue, as Emperor Xiaoming.',
    idiomatic:
      'She posthumously ennobled her father Shi Yue—late grand marshal and Prince of Taiyuan—as Emperor Xiaoming.',
  },
  s0103: {
    literal:
      'Nephew Chengsi, left chancellor of the Secretariat, was made Prince of Wei; Sizan, minister of celestial offices, Prince of Liang; twelve clansmen including Yizong were made commandery princes.',
    idiomatic:
      'Her nephew Chengsi became Prince of Wei; Sizan, minister of celestial offices, Prince of Liang; and twelve kinsmen including Yizong were enfeoffed as commandery princes.',
  },
  s0104: {
    literal:
      'Shi Wuzi, director of ceremonial guests, became chief counselor; Zong Qinke, vice minister of Fengge, became Secretariat Director.',
    idiomatic:
      'Shi Wuzi, director of ceremonial guests, was made chief counselor; Zong Qinke, Fengge vice minister, Secretariat Director.',
  },
  s0105: {
    literal:
      'Fu Youyi, palace attendant, became vice minister of Luantai and retained his associate councilorship of Fengge-Luantai.',
    idiomatic:
      'Fu Youyi, palace attendant, became Luantai vice minister while keeping his Fengge-Luantai associate councilorship.',
  },
  s0106: {
    literal: 'Ordered Shi Wuzi and ten others to travel separate circuits comforting and reviewing the realm.',
    idiomatic:
      'She dispatched Shi Wuzi and ten others on separate circuits to comfort and inspect the realm.',
  },
  s0107: {
    literal: 'Changed the fish tally badges worn by inner and outer officials to turtle badges.',
    idiomatic: 'Court tally badges—fish for all inner and outer officials—were changed to turtles.',
  },
  s0108: {
    literal:
      'In the tenth winter month, Bingzhou\'s Wenshui County was renamed Wuxing County; following the Han precedents of Feng and Pei, descendants of its people received hereditary tax exemptions.',
    idiomatic:
      'In the tenth winter month Wenshui in Bingzhou became Wuxing County; like Han Feng and Pei, its people\'s descendants received hereditary tax relief.',
  },
  s0109: {
    literal: 'In the first month of year 2, she personally sacrificed at the Bright Hall.',
    idiomatic: 'In the first month of her second year she personally sacrificed at the Bright Hall.',
  },
  s0110: {
    literal: 'In the third spring month, the Tang ancestral temple was renamed the Temple of Honored Virtue.',
    idiomatic:
      'In the third spring month the Tang ancestral temple was retitled the Temple of Honored Virtue.',
  },
  s0111: {
    literal:
      'In the fourth summer month, Buddhism was ranked above Daoism, monks and nuns taking precedence over Daoist clergy.',
    idiomatic:
      'In the fourth summer month Buddhism was placed above the Way: monks and nuns took rank before Daoist priests and nuns.',
  },
  s0112: {
    literal: 'In the sixth month, Cen Changqian was ordered to lead the armies against Tibet.',
    idiomatic: 'In the sixth month Cen Changqian was ordered to lead the armies against Tibet.',
  },
  s0113: {
    literal:
      'Ge Fuyuan, left censor-in-chief, became minister of terrestrial offices; Yue Sihui, Luantai vice minister, became Fengge-Luantai associate councilor.',
    idiomatic:
      'Ge Fuyuan, left censor-in-chief, became minister of terrestrial offices; Yue Sihui, Luantai vice minister, joined the Fengge-Luantai council.',
  },
  s0114: {
    literal:
      'In the seventh autumn month, a hundred thousand households from seven Guanzhong prefectures including Yong and Tong were moved to populate Luoyang.',
    idiomatic:
      'In the seventh autumn month a hundred thousand households from seven Guanzhong circuits including Yong and Tong were relocated to swell Luoyang.',
  },
  s0115: {
    literal: 'Jingzhao was divided to establish the four prefectures Ding, Ji, Hong, and Yi.',
    idiomatic: 'Jingzhao was split into the four prefectures Ding, Ji, Hong, and Yi.',
  },
  s0116: {
    literal: 'Ouyang Tong, minister of summer offices, was given charge of chief counselor duties.',
    idiomatic: 'Ouyang Tong, minister of summer offices, was assigned to handle chief counselor affairs.',
  },
  s0117: {
    literal: 'In the ninth month, Fu Youyi was imprisoned and died.',
    idiomatic: 'In the ninth month Fu Youyi was thrown into prison and died there.',
  },
  s0118: {
    literal:
      'You Ning, right general of the Feathered Forest Guards and Prince of Jianchang, became chief counselor; Di Renjie, Luozhou vice prefect, became vice minister of terrestrial offices and Fengge-Luantai associate councilor.',
    idiomatic:
      'You Ning, right general of the Feathered Forest and Prince of Jianchang, became chief counselor; Di Renjie, Luozhou vice prefect, became terrestrial vice minister and Fengge-Luantai associate councilor.',
  },
  s0119: {
    literal: 'In the tenth winter month, an edict ordered that all officeholders must nominate themselves.',
    idiomatic:
      'In the tenth winter month an edict required every officeholder to nominate himself for appointment.',
  },
  s0120: {
    literal:
      'Cen Changqian, left chancellor, Ouyang Tong, chief counselor, and Ge Fuyuan, minister of terrestrial offices, were executed.',
    idiomatic:
      'Cen Changqian, left chancellor, Ouyang Tong, chief counselor, and Ge Fuyuan, minister of terrestrial offices, were put to death.',
  },
  s0121: {
    literal: 'In the first month of year 3, she personally sacrificed at the Bright Hall.',
    idiomatic: 'In the first month of the third year she again sacrificed at the Bright Hall in person.',
  },
  s0122: {
    literal: 'In the first spring month, Yang Zhirou, minister of winter offices, became Fengge-Luantai associate councilor.',
    idiomatic:
      'In the first spring month Yang Zhirou, minister of winter offices, joined the Fengge-Luantai council.',
  },
  s0123: {
    literal: 'In the third month, all five Indic realms sent envoys bearing tribute.',
    idiomatic: 'In the third month all five Indic realms sent envoys to court with tribute.',
  },
  s0124: {
    literal:
      'In the fourth month, a general amnesty was proclaimed, the era name changed to Ruyi, and slaughter throughout the realm was forbidden.',
    idiomatic:
      'In the fourth month she proclaimed a general amnesty, changed the era to Ruyi, and forbade slaughter throughout the realm.',
  },
  s0125: {
    literal:
      'In the seventh autumn month torrential rain flooded the Luo; more than five thousand households were swept away, and envoys were sent to inquire after them and grant relief.',
    idiomatic:
      'In the seventh autumn month heavy rains made the Luo overflow and swept away more than five thousand households; envoys were sent to inquire and grant relief.',
  },
  s0126: {
    literal:
      'In the eighth month, Prince of Wei Chengsi became special advance; Prince of Jianchang You Ning, minister of winter offices; Yang Zhirou, minister of terrestrial offices—all were removed from council affairs.',
    idiomatic:
      'In the eighth month Prince of Wei Chengsi became special advance; Prince of Jianchang You Ning, minister of winter offices; Yang Zhirou, minister of terrestrial offices—all left the council.',
  },
  s0127: {
    literal:
      'Cui Yuanzong, autumn offices vice minister, became Luantai vice minister; Li Zhaode, summer offices vice minister, Fengge vice minister; Yao Shuo, acting celestial offices vice minister, left secretariat aide; Li Yuansu, terrestrial offices vice minister, right secretariat aide—all became Fengge-Luantai associate councilors.',
    idiomatic:
      'Cui Yuanzong became Luantai vice minister; Li Zhaode, Fengge vice minister; Yao Shuo, left secretariat aide; Li Yuansu, right secretariat aide—all joined the Fengge-Luantai council.',
  },
  s0128: {
    literal: 'In the ninth month, general amnesty; era changed to Longevity.',
    idiomatic: 'In the ninth month she proclaimed a general amnesty and changed the era to Longevity.',
  },
  s0129: {
    literal: 'The she harvest rite was moved to the ninth month, with a seven-day court feast.',
    idiomatic: 'The autumn she rite was fixed in the ninth month, and the court feasted for seven days.',
  },
  s0130: {
    literal: 'Bingzhou was re-established as Northern Capital.',
    idiomatic: 'Bingzhou was re-established as the Northern Capital.',
  },
  s0131: {
    literal:
      'In the tenth winter month Wang Xiaojie, protector-general of Wuwei Army, routed Tibet and recovered the garrisons of Kucha, Khotan, Kashgar, and Suyab.',
    idiomatic:
      'In the tenth winter month Wang Xiaojie, Wuwei protector-general, crushed Tibet and recovered Kucha, Khotan, Kashgar, and Suyab.',
  },
  s0132: {
    literal: 'In the first spring month of year 2, she personally offered at the Bright Hall.',
    idiomatic: 'In the first spring month of the second year she personally offered at the Bright Hall.',
  },
  s0133: {
    literal: 'On guihai, the Imperial Heir\'s consorts Lady Liu and Lady Dou were executed.',
    idiomatic:
      'On guihai the Imperial Heir\'s consorts, the Ladies Liu and Dou, were executed.',
  },
  s0134: {
    literal:
      'In the twelfth month, imperial grandsons were re-enfeoffed: Chengi as Prince of Shouchun commandery, Chengyi as Hengyang, Longji as Linzi, Longfan as Baling, Longye as Pengcheng.',
    idiomatic:
      'In the twelfth month her grandsons were re-enfeoffed: Chengi Prince of Shouchun, Chengyi of Hengyang, Longji of Linzi, Longfan of Baling, Longye of Pengcheng.',
  },
  s0135: {
    literal:
      'In the second spring month, Pei Feigong, director of imperial manufactories, was bisected at the waist in the marketplace for secretly visiting the Imperial Heir.',
    idiomatic:
      'In the second spring month Pei Feigong, director of imperial manufactories, was cut in two at the waist in the marketplace for secretly visiting the Imperial Heir.',
  },
  s0136: {
    literal:
      'In the ninth autumn month the sovereign added the title Golden Wheel Sage Spirit Emperor, proclaimed amnesty, and feasted seven days.',
    idiomatic:
      'In the ninth autumn month she took the added title Golden Wheel Sage Spirit Emperor, proclaimed amnesty, and feasted for seven days.',
  },
  s0137: {
    literal:
      'On xinchou, Doulu Qinwang, ceremonial guests director, became Secretariat Director; Wei Juyuan, right secretariat aide, and Lu Yuanfang, autumn offices vice minister and Luantai vice minister, became associate councilors.',
    idiomatic:
      'On xinchou Doulu Qinwang became Secretariat Director; Wei Juyuan and Lu Yuanfang joined the Fengge-Luantai council.',
  },
  s0138: {
    literal: 'In the first spring month of year 3, she personally offered at the Bright Hall.',
    idiomatic: 'Again in the first spring month of the third year she sacrificed at the Bright Hall in person.',
  },
  s0139: {
    literal:
      'Third month: Li Zhaode acting neishi; Su Weidao associate councilor.',
    idiomatic:
      'In the third month Li Zhaode became acting Secretariat Director; Su Weidao joined the Fengge-Luantai council.',
  },
  s0140: {
    literal: 'Wei Juyuan summer offices vice minister, retained council duties.',
    idiomatic: 'Wei Juyuan became summer offices vice minister while retaining his seat on the council.',
  },
  s0141: {
    literal: 'Fourth month: Wang Xiaojie third rank deliberative.',
    idiomatic:
      'In the fourth month Wang Xiaojie, minister of summer offices, was made deliberative third rank with Fengge-Luantai.',
  },
  s0142: {
    literal:
      'Fifth month: added title Transcendent Golden Wheel Sage Spirit Emperor, amnesty, Yanzai era, seven-day feast.',
    idiomatic:
      'In the fifth month she added the title Transcendent Golden Wheel Sage Spirit Emperor, proclaimed amnesty, changed the era to Extended Reign, and feasted seven days.',
  },
  s0143: {
    literal: 'Eighth autumn month: Yao Shuo chief counselor.',
    idiomatic: 'In the eighth autumn month Yao Shuo, vice director of ceremonial guests, became chief counselor.',
  },
  s0144: {
    literal:
      'Yang Zaisi Luantai vice minister; Du Jingjian Fengge vice minister; both associate councilors.',
    idiomatic:
      'Yang Zaisi became Luantai vice minister and Du Jingjian Fengge vice minister; both joined the Fengge-Luantai council.',
  },
  s0145: {
    literal:
      'Prince of Liang Wu Sizan urged tribal chiefs to petition for levying copper and iron in the eastern capital to cast the Celestial Axis outside the Vermilion Gate and erect a monument praising the sovereign\'s achievements.',
    idiomatic:
      'Prince of Liang Wu Sizan urged the frontier chiefs to petition for a great levy of copper and iron in the eastern capital to cast the Celestial Axis outside the Vermilion Gate and raise a monument to her achievements.',
  },
  s0146: {
    literal: 'Ninth month: Li Zhaode demoted to Qinzhou Nanbin county captain.',
    idiomatic:
      'In the ninth month Li Zhaode was demoted to captain of Nanbin County in Qin Prefecture.',
  },
  s0147: {
    literal: 'Tenth winter month: Li Yuansu associate councilor.',
    idiomatic:
      'In the tenth winter month Li Yuansu, right secretariat aide, joined the Fengge-Luantai council.',
  },
  s0148: {
    literal:
      'Zhengsheng year 1 first month: added Maitreya Transcendent Golden Wheel title, amnesty, era change, seven-day feast.',
    idiomatic:
      'In the first month of Proof of Sagacity 1 she added the title Maitreya Transcendent Golden Wheel Sage Spirit Emperor, proclaimed amnesty, changed the era, and feasted seven days.',
  },
  s0149: {
    literal:
      'On wuzi, Doulu Qinwang, Wei Juyuan, Du Jingjian, Su Weidao, Lu Yuanfang were all demoted to prefects of Zhao, Fu, Ji, Sui, etc.',
    idiomatic:
      'On wuzi Doulu Qinwang, Wei Juyuan, Du Jingjian, Su Weidao, and Lu Yuanfang were all demoted to prefects of Zhao, Fu, Ji, Sui, and the like.',
  },
  s0150: {
    literal: 'On bingshen night the Bright Hall burned; by dawn it was ashes.',
    idiomatic: 'On bingshen night the Bright Hall caught fire; by dawn it was nothing but ash.',
  },
  s0151: {
    literal:
      'On gengzi, reported the fire to the ancestral temple, self-reproach edict, ordered all officials rank 9+ to submit sealed memorials with frank remonstrance.',
    idiomatic:
      'On gengzi she reported the blaze to the ancestral temple, issued a hand-edict blaming herself, and ordered civil and military officials of the ninth rank and above to submit sealed memorials with the frankest remonstrance.',
  },
  s0152: {
    literal: 'Second spring month: removed Maitreya Transcendent parts of title.',
    idiomatic: 'In the second spring month she dropped the Maitreya and Transcendent portions of her title.',
  },
  s0153: {
    literal:
      'Ninth autumn month: southern suburb sacrifice, added Tianceshan Golden Wheel title, amnesty including capital crimes and ten abominations, Tianceshanwansui era, nine-day feast.',
    idiomatic:
      'In the ninth autumn month she sacrificed at the southern suburb, added the title Heaven-Enregistered Golden Wheel Sage Spirit Emperor, proclaimed amnesty even for capital crimes and the ten abominations, changed the era to Heaven-Enregistered Ten Thousand Years, and feasted nine days.',
  },
  s0154: {
    literal:
      'Wansui Dengfeng year 1 twelfth month jiashen: feng on Mount Song, amnesty, era change, nine-day feast.',
    idiomatic:
      'On jiashen of the twelfth month in Ten Thousand Years Ascent-Feng 1 she performed the feng rite on Mount Song, proclaimed amnesty, changed the era, and feasted nine days.',
  },
  s0155: {
    literal: 'Dinghai: shan at Mount Shaoshi.',
    idiomatic: 'On dinghai she performed the shan rite at Mount Shaoshi.',
  },
  s0156: {
    literal:
      'Jichou: third rank+ given two noble ranks counting prior service, fourth rank and below two rank steps.',
    idiomatic:
      'On jichou she decreed that officials of the third rank and above receive two noble ranks counting prior honors, and those of the fourth rank and below two steps in rank.',
  },
  s0157: {
    literal: 'Luozhou people tax exemption 2 years, Dengfeng and Gaocheng counties 3 years.',
    idiomatic:
      'The people of Luozhou received two years\' tax relief; Dengfeng and Gaocheng counties, three.',
  },
  s0158: {
    literal: 'Guisi: returned from Mount Song.',
    idiomatic: 'On guisi she returned from Mount Song.',
  },
  s0159: {
    literal: 'Jiawu: personally visited ancestral temple.',
    idiomatic: 'On jiawu she personally visited the ancestral temple.',
  },
  s0160: {
    literal: 'Third spring month: Bright Hall rebuilt.',
    idiomatic: 'In the third spring month the Bright Hall was rebuilt.',
  },
  s0161: {
    literal:
      'Fourth summer month: offered at Bright Hall, amnesty, Wansui Tongtian era, seven-day feast.',
    idiomatic:
      'In the fourth summer month she offered at the Bright Hall, proclaimed amnesty, changed the era to Ten Thousand Years Penetrating Heaven, and feasted seven days.',
  },
  s0162: {
    literal: 'Great drought: ordered officials rank 9+ to speak frankly on government faults.',
    idiomatic:
      'Because of a great drought throughout the realm, she ordered civil and military officials of the ninth rank and above to speak frankly on the gains and losses of current policy.',
  },
  s0163: {
    literal:
      'Fifth month: Khitan leader Li Jinzhong and brother-in-law Sun Wanrong killed Zhao Wenshui, rebelled, took Yingzhou.',
    idiomatic:
      'In the fifth month the Khitan leader Li Jinzhong and his brother-in-law Sun Wanrong, governor of Guicheng, killed the protector Zhao Wenshui, rose in revolt, and seized Ying Prefecture.',
  },
  s0164: {
    literal: 'Jinzhong styled himself khan.',
    idiomatic: 'He proclaimed himself khan.',
  },
  s0165: {
    literal:
      'Yichou: 28 generals including Cao Renshi ordered to campaign.',
    idiomatic:
      'On yichou she ordered twenty-eight generals, including Cao Renshi, Zhang Xuanyu, Li Duozuo, and Ma Renjie, to campaign against them.',
  },
  s0166: {
    literal: 'Seventh month: Wu Sizan pacification commissioner, Yao Shuo deputy.',
    idiomatic:
      'In the seventh autumn month Prince of Liang Wu Sizan was made pacification commissioner and Yao Shuo chief counselor his deputy.',
  },
  s0167: {
    literal:
      'Edict changed Li Jinzhong\'s name to Jinmie (exterminate-all) and Sun Wanrong to Wanzhan (ten-thousand-beheadings).',
    idiomatic:
      'An edict changed Li Jinzhong\'s name to Li Exterminate-All and Sun Wanrong\'s to Sun Ten-Thousand-Beheadings.',
  },
  s0168: {
    literal:
      'Eighth month: defeat at Xixiashi Huangzhang Valley, Zhang and Ma captured.',
    idiomatic:
      'In the eighth autumn month Zhang Xuanyu, Cao Renshi, and Ma Renjie fought Li Exterminate-All at Huangzhang Valley west of Xiashi Pass; the government army was routed and Zhang and Ma were captured.',
  },
  s0169: {
    literal: 'Ninth month: Prince of Jian\'an You Yi grand commander against Khitan.',
    idiomatic:
      'In the ninth month Prince of Jian\'an You Yi, right general of the Martial Guard, was made grand commander to campaign against the Khitan.',
  },
  s0170: {
    literal: 'Wang Fangqing Luantai vice minister; Li Daoguang associate councilor.',
    idiomatic:
      'Wang Fangqing, Bingzhou chief administrator, became Luantai vice minister; Li Daoguang, palace director, joined the Fengge-Luantai council.',
  },
  s0171: {
    literal: 'Tibet raided Liangzhou; Xu Qinming captured.',
    idiomatic: 'Tibet raided Liang Prefecture and captured its protector Xu Qinming.',
  },
  s0172: {
    literal: 'Gengshen: Wang Fangqing Fengge vice minister, retained council.',
    idiomatic:
      'On gengshen Wang Fangqing became Fengge vice minister while retaining his seat on the council.',
  },
  s0173: {
    literal: 'Li Jinmie died; Sun Wanzhan led the band.',
    idiomatic: 'Li Exterminate-All died, and Sun Ten-Thousand-Beheadings took command of the rebels.',
  },
  s0174: {
    literal: 'Tenth winter month: Sun took Ji Prefecture; Lu Baoji killed.',
    idiomatic:
      'In the tenth winter month Sun Ten-Thousand-Beheadings seized Ji Prefecture and killed its governor Lu Baoji.',
  },
  s0175: {
    literal: 'Eleventh month: also took Yingzhou subordinate counties.',
    idiomatic: 'In the eleventh month he also overran the counties subordinate to Ying Prefecture.',
  },
  s0176: {
    literal: 'Year 2 first month: Bright Hall offering.',
    idiomatic: 'In the first month of the second year she personally offered at the Bright Hall.',
  },
  s0177: {
    literal: 'Li Yuansu and Sun Yuanheng executed for plotting with Qilian Yao.',
    idiomatic:
      'Li Yuansu, Fengge vice minister, and Sun Yuanheng, summer offices vice minister, were executed for plotting rebellion with Qilian Yao.',
  },
  s0178: {
    literal: 'Lou Shide associate councilor.',
    idiomatic:
      'Lou Shide, Bingzhou protector staff officer, became Fengge vice minister and Fengge-Luantai associate councilor.',
  },
  s0179: {
    literal:
      'Second spring month: 180,000 troops under Wang Xiaojie defeated at Xiashi Valley; Wang died in battle, Su Honghui fled.',
    idiomatic:
      'In the second spring month Wang Xiaojie and Su Honghui led a hundred and eighty thousand men against Sun Ten-Thousand-Beheadings at Xiashi Valley; the imperial army was crushed, Wang Xiaojie fell in battle, and Su Honghui fled without his armor.',
  },
  s0180: {
    literal:
      'Fourth summer month: Nine Cauldrons cast and placed in Bright Hall court; Wang Jishan neishi.',
    idiomatic:
      'In the fourth summer month the Nine Cauldrons were cast and set up in the Bright Hall courtyard; Wang Jishan, former chief administrator of Yizhou, became Secretariat Director.',
  },
  s0181: {
    literal:
      'Fifth month: Wu Yizong grand commander, Lou Shide deputy, Shazha Zhongyi vanguard, 200,000 to campaign against Sun.',
    idiomatic:
      'In the fifth month Prince of Henei Wu Yizong was made grand commander, Lou Shide deputy grand commander, and Shazha Zhongyi vanguard commander, with two hundred thousand men to campaign against Sun Ten-Thousand-Beheadings.',
  },
  s0182: {
    literal:
      'Eighth month: Turkic khan Mojie detained Yanxiu as not a Tang prince, invaded with Yan Zhiwei.',
    idiomatic:
      'In the eighth month the Turkic khan Mojie, holding that Wu Yanxiu was no prince of the Tang house, imprisoned him separately and led his horde with Yan Zhiwei to raid Gui and Tan and other prefectures.',
  },
  s0183: {
    literal: '200,000 under Chonggui etc. counterattacked; Yanxiu released.',
    idiomatic:
      'She ordered Prince of Gaoping Chonggui, Shazha Zhongyi, Zhang Renyan, and Li Duozuo and others to lead two hundred thousand men against them, whereupon Yanxiu was released.',
  },
  s0184: {
    literal: 'Jichou: Mojie took Dingzhou; Sun Yan\'gao killed; thousands dead.',
    idiomatic:
      'On jichou Mojie seized Ding Prefecture; Governor Sun Yan\'gao was killed, commoners\' houses burned, and thousands perished.',
  },
  s0185: {
    literal: 'Prince of Wei Chengsi died.',
    idiomatic: 'Prince of Wei Chengsi passed away.',
  },
  s0186: {
    literal: 'Gengzi: Wu Sizan neishi, Di Renjie chief counselor.',
    idiomatic: 'On gengzi Wu Sizan became Secretariat Director and Di Renjie chief counselor.',
  },
  s0187: {
    literal: 'September: You Ning associate councilor.',
    idiomatic: 'In the ninth month Prince of Jianchang You Ning joined the Fengge-Luantai council.',
  },
  s0188: {
    literal: 'Mojie took Zhaozhou; Gao Rui killed.',
    idiomatic: 'Mojie seized Zhao Prefecture and killed its governor Gao Rui.',
  },
  s0189: {
    literal:
      'Bingzi: Prince of Luling Zhe made crown prince, restored name Xian, amnesty, five-day feast.',
    idiomatic:
      'On bingzi Prince of Luling Zhe was made crown prince and ordered to resume his former name Xian; amnesty was proclaimed and the court feasted five days.',
  },
  s0190: {
    literal: 'Di Renjie ordered as Hebei campaign marshal.',
    idiomatic: 'Di Renjie was ordered to serve as Hebei campaign marshal.',
  },
  s0191: {
    literal: 'Xinsi: crown prince visited ancestral temple.',
    idiomatic: 'On xinsi the crown prince visited the ancestral temple.',
  },
  s0192: {
    literal: 'Su Weidao associate councilor.',
    idiomatic:
      'Su Weidao, celestial offices vice minister, became Fengge vice minister and Fengge-Luantai associate councilor.',
  },
  s0193: {
    literal:
      'Guiwei: Mojie slaughtered 10,000+ captives from Zhao and Ding, withdrew via Wuhui road.',
    idiomatic:
      'On guiwei Mojie slaughtered more than ten thousand men and women he had seized in Zhao and Ding and withdrew by the Five-Turns road, ravaging everywhere he passed beyond count.',
  },
  s0194: {
    literal: 'Yao Yuanchong and Li Qiao associate councilors.',
    idiomatic:
      'In the tenth winter month Yao Yuanchong, summer offices vice minister, and Li Qiao, vice director of the Forest Terrace, joined the Fengge-Luantai council.',
  },
  s0195: {
    literal: 'That month Yan Zhiwei fled back from Turks; entire clan executed.',
    idiomatic:
      'That same month Yan Zhiwei fled back from the Turks; his entire clan was executed to the last man.',
  },
  s0196: {
    literal: 'Year 2 second spring month: Imperial Heir Dan enfeoffed Prince of Xiang.',
    idiomatic:
      'In the second spring month of the second year the Imperial Heir Dan was enfeoffed as Prince of Xiang.',
  },
  s0197: {
    literal:
      'First established Control-Crane Bureau for Zhang Yizhi and Zhang Changzong; renamed Attendant-Court Bureau, ranked below censor-in-chief.',
    idiomatic:
      'She first established the Control-Crane Bureau for her favorites Zhang Yizhi and Zhang Changzong; it was soon renamed the Attendant-Court Bureau, ranking just below the censor-in-chief.',
  },
  s0198: {
    literal: 'Wei Yuanzhong and Ji Xu associate councilors.',
    idiomatic:
      'Wei Yuanzhong, left censor, became Fengge vice minister, and Ji Xu celestial vice minister; both joined the Fengge-Luantai council.',
  },
  s0199: {
    literal: 'Wuzi: visited Mount Song, passed Prince Zijin\'s shrine.',
    idiomatic: 'On wuzi she went to Mount Song and passed the shrine of Prince Zijin.',
  },
  s0200: {
    literal: 'Bingshen: visited Mount Gou.',
    idiomatic: 'On bingshen she visited Mount Gou.',
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
if (data.metadata.chapter !== '006') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 006; standalone T ready (${Object.keys(T).length} entries).`
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
