#!/usr/bin/env node
/** Batch 16: s1501–s1600 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1501;
const END = 1600;

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

const T = {  s1501: {
    literal: 'Zai Zhen is taking responsibility for me, so it is appropriate to express gratitude for the wrongdoing, to show his concern, and to hope to answer his warning.',
    idiomatic: 'Zai Zhen is taking responsibility for me, so it is appropriate to express gratitude for the wrongdoing, to show his concern, and to hope to answer his warning (condensed).',
  },
  s1502: {
    literal: 'The world\'s capital crimes will be punished by Liu, and they will be released after being punished. This does not apply to murder, official crimes, and thieves in charge of money and grain.',
    idiomatic: 'The world\'s capital crimes will be punished by Liu, and they will be released after being punished.',
  },
  s1503: {
    literal: 'The states were hit by floods and droughts and imposed taxes.',
    idiomatic: 'The states were hit by floods and droughts and imposed taxes (condensed).',
  },
  s1504: {
    literal: 'Built and stopped at home and abroad.',
    idiomatic: 'Built and stopped at home and abroad (condensed).',
  },
  s1505: {
    literal: 'The five eagles and falcons are liberated.',
    idiomatic: 'The five eagles and falcons are liberated (condensed).',
  },
  s1506: {
    literal: 'I am now wearing plain clothes and avoiding the palace, and I am happy to eat less.',
    idiomatic: 'I am now wearing plain clothes and avoiding the palace, and I am happy to eat less (condensed).',
  },
  s1507: {
    literal: 'Recently, officials at home and abroad wanted to add emblems following the tribute seal list.',
    idiomatic: 'Recently, officials at home and abroad wanted to add emblems following the tribute seal list (condensed).',
  },
  s1508: {
    literal: 'Hudaoda is the emperor, and I bear this title. I am ashamed of myself. When the stars change, do I dare to discuss the beauty of fame?',
    idiomatic: 'Hudaoda is the emperor, and I bear this title.',
  },
  s1509: {
    literal: 'Not only to punish the past, but also to warn the future, Chinese and foreign officials are not allowed to go to the table to report.',
    idiomatic: 'Not only to punish the past, but also to warn the future, Chinese and foreign officials are not allowed to go to the table to report (condensed).',
  },
  s1510: {
    literal: 'The watch is on its way and should be returned as soon as possible.',
    idiomatic: 'The watch is on its way and should be returned as soon as possible (condensed).',
  },
  s1511: {
    literal: 'The ministers in the dynasty, Fang Yue, and the officials should each go to the official position, talk about the gains and losses, obey the instructions, and show humility to me.',
    idiomatic: 'The ministers in the dynasty, Fang Yue, and the officials should each go to the official position, talk about the gains and losses, obey the instructions, and show humility to me (condensed).',
  },
  s1512: {
    literal: 'Closing quote mark.',
    idiomatic: 'End of quotation.',
  },
  s1513: {
    literal: 'In Jiaxu, Zuo Pushe and Li Cheng were appointed as the governor of Shannan East Road.',
    idiomatic: 'In Jiaxu, Zuo Pushe and Li Cheng were appointed as the governor of Shannan East Road (condensed).',
  },
  s1514: {
    literal: 'In Renwu, Yan Yu, the governor of Chuzhou, was appointed as the observer of Gui Guan.',
    idiomatic: 'In Renwu, Yan Yu, the governor of Chuzhou, was appointed as the observer of Gui Guan (condensed).',
  },
  s1515: {
    literal: 'In Jiashen, Yin You, the envoy of Shannan East Road Jiedu, was the guest branch of the prince.',
    idiomatic: 'In Jiashen, Yin You, the envoy of Shannan East Road Jiedu, was the guest branch of the prince (condensed).',
  },
  s1516: {
    literal: 'Magpies nest in ancient tombs outside Zhenxing Gate.',
    idiomatic: 'Magpies nest in ancient tombs outside Zhenxing Gate (condensed).',
  },
  s1517: {
    literal: 'In Dinghai, Li Yong died, the governor of Xingning.',
    idiomatic: 'In Dinghai, Li Yong died, the governor of Xingning (condensed).',
  },
  s1518: {
    literal: 'Wuzi took Henan Yin Li Jue as the Minister of Household Affairs.',
    idiomatic: 'Wuzi took Henan Yin Li Jue as the Minister of Household Affairs (condensed).',
  },
  s1519: {
    literal: 'Yichou appointed Jinwu General Li Zhichen as the military envoy of Yinning.',
    idiomatic: 'Yichou appointed Jinwu General Li Zhichen as the military envoy of Yinning (condensed).',
  },
  s1520: {
    literal: 'In Renchen, Gui Guan observed that Han Yi died.',
    idiomatic: 'In Renchen, Gui Guan observed that Han Yi died (condensed).',
  },
  s1521: {
    literal: 'Pei Chu, the minister of the Ministry of War, was appointed as the Yin of Henan.',
    idiomatic: 'Pei Chu, the minister of the Ministry of War, was appointed as the Yin of Henan (condensed).',
  },
  s1522: {
    literal: 'Summer is April and Jiawu is the first day of the lunar month.',
    idiomatic: 'Summer is April and Jiawu is the first day of the lunar month (condensed).',
  },
  s1523: {
    literal: 'In the 18th year of the 18th year of the 18th century, he was an official of the imperial edict, a minister of the Ministry of Industry and Commerce, and a scholar of imperial edict.',
    idiomatic: 'In the 18th year of the 18th year of the 18th century, he was an official of the imperial edict, a minister of the Ministry of Industry and Commerce, and a scholar of imperial edict (condensed).',
  },
  s1524: {
    literal: 'In Bingzi, Jingxin from Zhongshushe was appointed Wushen, the Jiangxi observation envoy, and Luo Rang, the former Jiangxi observation envoy, died.',
    idiomatic: 'In Bingzi, Jingxin from Zhongshushe was appointed Wushen, the Jiangxi observation envoy, and Luo Rang, the former Jiangxi observation envoy, died (condensed).',
  },
  s1525: {
    literal: 'In Xinyou, an imperial edict was issued to establish the Zhongnan Mountain Shrine.',
    idiomatic: 'In Xinyou, an imperial edict was issued to establish the Zhongnan Mountain Shrine (condensed).',
  },
  s1526: {
    literal: 'Pengzhou was restored to Pengchi and Langchi counties.',
    idiomatic: 'Pengzhou was restored to Pengchi and Langchi counties (condensed).',
  },
  s1527: {
    literal: 'Guihaishuo in May.',
    idiomatic: 'Guihaishuo in May (condensed).',
  },
  s1528: {
    literal: 'Yichou took Pei Du, who was left in the east capital, as Taiyuan Yin, who was left in the northern capital, and Hedong Jiedushi, who was in charge of Situ and Zhongshu Ling.',
    idiomatic: 'Yichou took Pei Du, who was left in the east capital, as Taiyuan Yin, who was left in the northern capital, and Hedong Jiedushi, who was in charge of Situ and Zhongshu Ling (condensed).',
  },
  s1529: {
    literal: 'In Bingyin, Li Jue, the Minister of Household Affairs, judged this Secretary.',
    idiomatic: 'In Bingyin, Li Jue, the Minister of Household Affairs, judged this Secretary (condensed).',
  },
  s1530: {
    literal: 'Li Deyu, the observation envoy of western Zhejiang Province, inspected the Shangshu of the Ministry of Household Affairs and served as the governor of Yangzhou, and served as the military envoy of Huainan.',
    idiomatic: 'Li Deyu, the observation envoy of western Zhejiang Province, inspected the Shangshu of the Ministry of Household Affairs and served as the governor of Yangzhou, and served as the military envoy of Huainan (condensed).',
  },
  s1531: {
    literal: 'In Xinwei, the former Huainan Jiedushi envoy Niu Sengru was appointed as the inspection envoy to Sikong and the eastern capital was left behind, while Lu Shang, the governor of Suzhou, was appointed as the inspection envoy to western Zhejiang.',
    idiomatic: 'In Xinwei, the former Huainan Jiedushi envoy Niu Sengru was appointed as the inspection envoy to Sikong and the eastern capital was left behind, while Lu Shang, the governor of Suzhou, was appointed as the inspection envoy to western Zhejiang (condensed).',
  },
  s1532: {
    literal: 'Renshen went to the Sixteenth Mansion and had a feast with the kings.',
    idiomatic: 'Renshen went to the Sixteenth Mansion and had a feast with the kings (condensed).',
  },
  s1533: {
    literal: 'Fan Wenxi, the city official, and three other people were killed in the Sixteenth House because the food provided to the kings was not good enough.',
    idiomatic: 'Fan Wenxi, the city official, and three other people were killed in the Sixteenth House because the food provided to the kings was not good enough (condensed).',
  },
  s1534: {
    literal: 'Guisi Shuo in June.',
    idiomatic: 'Guisi Shuo in June (condensed).',
  },
  s1535: {
    literal: 'Ding You made Wang Yuankui, the military commander of the German army, the commander-in-law of the Imperial Consort and Princess Shang Shouan.',
    idiomatic: 'Ding You made Wang Yuankui, the military commander of the German army, the commander-in-law of the Imperial Consort and Princess Shang Shouan (condensed).',
  },
  s1536: {
    literal: 'In Jihai, Hongluqing Li Kui was appointed as the defense envoy of the Tiande army.',
    idiomatic: 'In Jihai, Hongluqing Li Kui was appointed as the defense envoy of the Tiande army (condensed).',
  },
  s1537: {
    literal: 'Gengzi, the chief of the Ministry of Personnel announced the selection. Please add one of Nan Cao\'s doctors, and put a seal on the other side. Please write \'New Nan Cao\'s Seal\' as the text, and follow it.',
    idiomatic: 'Gengzi, the chief of the Ministry of Personnel announced the selection.',
  },
  s1538: {
    literal: 'On Bingwu, the army in Heyang was in chaos, and Li Yong was dispatched one by one.',
    idiomatic: 'On Bingwu, the army in Heyang was in chaos, and Li Yong was dispatched one by one (condensed).',
  },
  s1539: {
    literal: 'In Wushen, Li Zhifang, the general of Zuo Jinwu Guard, was appointed as the military governor of Huaizhou in the three cities of Heyang.',
    idiomatic: 'In Wushen, Li Zhifang, the general of Zuo Jinwu Guard, was appointed as the military governor of Huaizhou in the three cities of Heyang (condensed).',
  },
  s1540: {
    literal: 'In Gengxu, Cui Gong, the right general of Jinwu Guard, was appointed as the capital Zhaoyin.',
    idiomatic: 'In Gengxu, Cui Gong, the right general of Jinwu Guard, was appointed as the capital Zhaoyin (condensed).',
  },
  s1541: {
    literal: 'Wei, Bo, Ze, Lu, Zi, Qing, Cangde, Yan, Hai, Henan and other prefectures also reported locust damage to crops.',
    idiomatic: 'Wei, Bo, Ze, Lu, Zi, Qing, Cangde, Yan, Hai, Henan and other prefectures also reported locust damage to crops (condensed).',
  },
  s1542: {
    literal: 'Yunzhou reported that locusts died when they caught the rain.',
    idiomatic: 'Yunzhou reported that locusts died when they caught the rain (condensed).',
  },
  s1543: {
    literal: 'In Dinghai, Cheng Di Jianmo, the imperial censor, was appointed as the minister of the Ministry of punishment. Yin Guirong, formerly of Jingzhao, was appointed as the secretary supervisor, and Li Yi was appointed as the Hunan observation envoy.',
    idiomatic: 'In Dinghai, Cheng Di Jianmo, the imperial censor, was appointed as the minister of the Ministry of punishment.',
  },
  s1544: {
    literal: 'Autumn, July, Renxu Shuo.',
    idiomatic: 'Autumn, July, Renxu Shuo (condensed).',
  },
  s1545: {
    literal: 'Yihai moved to the city due to a long drought and closed its gates.',
    idiomatic: 'Yihai moved to the city due to a long drought and closed its gates (condensed).',
  },
  s1546: {
    literal: 'In Jiashen, Zhang Jia, the minister of Yitai Prefecture, was the observation envoy to Yanhai.',
    idiomatic: 'In Jiashen, Zhang Jia, the minister of Yitai Prefecture, was the observation envoy to Yanhai (condensed).',
  },
  s1547: {
    literal: 'The edict states that except for the three towns in Hebei Province, all state governments are not allowed to testify for official titles.',
    idiomatic: 'The edict states that except for the three towns in Hebei Province, all state governments are not allowed to testify for official titles (condensed).',
  },
  s1548: {
    literal: 'Yunzhou reported: \'Dangzhou first abolishes Tianping and Pingyin counties, and please restore Pingyin county to control thieves.',
    idiomatic: 'Yunzhou reported: \'Dangzhou first abolishes Tianping and Pingyin counties, and please restore Pingyin county to control thieves (condensed).',
  },
  s1549: {
    literal: '”Follow it.',
    idiomatic: '”Follow it (condensed).',
  },
  s1550: {
    literal: 'Yiyou, because of the locust drought, ordered the officials to be imprisoned.',
    idiomatic: 'Yiyou, because of the locust drought, ordered the officials to be imprisoned (condensed).',
  },
  s1551: {
    literal: 'Ji Chou sent envoys down the road to patrol the locusts.',
    idiomatic: 'Ji Chou sent envoys down the road to patrol the locusts (condensed).',
  },
  s1552: {
    literal: 'On that day, it rained in the capital, and all the ministers expressed their congratulations.',
    idiomatic: 'On that day, it rained in the capital, and all the ministers expressed their congratulations (condensed).',
  },
  s1553: {
    literal: 'Li Shen from another state reported that locusts had entered the country and would not eat the seedlings in the fields. He wrote a praising edict and still carved a stone in Xiangguo Temple.',
    idiomatic: 'Li Shen from another state reported that locusts had entered the country and would not eat the seedlings in the fields.',
  },
  s1554: {
    literal: 'Renchenshuo in August.',
    idiomatic: 'Renchenshuo in August (condensed).',
  },
  s1555: {
    literal: 'Ding You, the comet comes out between the void and danger.',
    idiomatic: 'Ding You, the comet comes out between the void and danger (condensed).',
  },
  s1556: {
    literal: 'Zhenwu played the role of Turks entering the bandit camp.',
    idiomatic: 'Zhenwu played the role of Turks entering the bandit camp (condensed).',
  },
  s1557: {
    literal: 'In the Gengxu period, the imperial concubine Zhaoyi and Wang were ordered to be registered as virtuous concubines, and the Zhaorong and Yang family were appointed as virtuous concubines.',
    idiomatic: 'In the Gengxu period, the imperial concubine Zhaoyi and Wang were ordered to be registered as virtuous concubines, and the Zhaorong and Yang family were appointed as virtuous concubines (condensed).',
  },
  s1558: {
    literal: 'He also issued an edict: \'Emperor Jingzong\'s second son Xiu Fu, his third son Zhi Zhong, his fourth son Yan Yang, his sixth son Cheng Mei, etc., it is appropriate to open the titles of various lands and use the canons to promote the harmony of the clan.',
    idiomatic: 'He also issued an edict: \'Emperor Jingzong\'s second son Xiu Fu, his third son Zhi Zhong, his fourth son Yan Yang, his sixth son Cheng Mei, etc.',
  },
  s1559: {
    literal: 'If you are resting, you can be named the King of Liang, if you are in charge, you can be named the King of Xiang, if you are a good person, you can be named the King of Ji, if you are beautiful, you can be named the King of Chen.',
    idiomatic: 'If you are resting, you can be named the King of Liang, if you are in charge, you can be named the King of Xiang, if you are a good person, you can be named the King of Ji, if you are beautiful, you can be named the King of Chen (condensed).',
  },
  s1560: {
    literal: 'Zong Jian, the second son of the emperor, was granted the title of King of Chiang.',
    idiomatic: 'Zong Jian, the second son of the emperor, was granted the title of King of Chiang (condensed).',
  },
  s1561: {
    literal: '\'Yichou, Lu Xingjian, the governor of Fangzhou, was killed with a stolen stick.',
    idiomatic: '\'Yichou, Lu Xingjian, the governor of Fangzhou, was killed with a stolen stick (condensed).',
  },
  s1562: {
    literal: 'Now, Lu Xingshu, the former Hunan observation envoy, was the Shaanxi and Guo observation envoy.',
    idiomatic: 'Now, Lu Xingshu, the former Hunan observation envoy, was the Shaanxi and Guo observation envoy (condensed).',
  },
  s1563: {
    literal: 'Jiashen, the edict said: \'Celebrating my birthday, the world will have a tin banquet, and the common people will rejoice together.',
    idiomatic: 'Jiashen, the edict said: \'Celebrating my birthday, the world will have a tin banquet, and the common people will rejoice together (condensed).',
  },
  s1564: {
    literal: 'If you don’t want to slaughter, but use your appearance to live well, you are not believing in Buddhism, and you will hope for unreasonable blessings.',
    idiomatic: 'If you don’t want to slaughter, but use your appearance to live well, you are not believing in Buddhism, and you will hope for unreasonable blessings (condensed).',
  },
  s1565: {
    literal: 'I am afraid that the Chinese and foreign ministers will not tell me what to do, so I will hold a large banquet and gather a large number of monks. This will not only waste material resources, but also confuse living beings.',
    idiomatic: 'I am afraid that the Chinese and foreign ministers will not tell me what to do, so I will hold a large banquet and gather a large number of monks.',
  },
  s1566: {
    literal: 'From now on, it will always be a common practice to have vegetarian banquets with fresh preserved meat and minced meat.',
    idiomatic: 'From now on, it will always be a common practice to have vegetarian banquets with fresh preserved meat and minced meat (condensed).',
  },
  s1567: {
    literal: '\'He also ordered: \'On the Qingcheng Festival, it is appropriate to order Jingzhao Yin Zhun to have already, as a rule for the Double Ninth Festival, to gather hundreds of officials in Qujiang.',
    idiomatic: '\'He also ordered: \'On the Qingcheng Festival, it is appropriate to order Jingzhao Yin Zhun to have already, as a rule for the Double Ninth Festival, to gather hundreds of officials in Qujiang (condensed).',
  },
  s1568: {
    literal: 'It is appropriate to stop when Yanying is serving wine.',
    idiomatic: 'It is appropriate to stop when Yanying is serving wine (condensed).',
  },
  s1569: {
    literal: '\'Wuzi took the Minister of Hubu, Shangshu, and Wang Yanwei of Juduzhi as Weiweiqing, who was assigned to the Eastern Capital.',
    idiomatic: '\'Wuzi took the Minister of Hubu, Shangshu, and Wang Yanwei of Juduzhi as Weiweiqing, who was assigned to the Eastern Capital (condensed).',
  },
  s1570: {
    literal: 'On the first day of Xinmao in the tenth month of winter, the imperial edict was issued to change the \'Three Teachings Zhu Ying\' written by the Queen of Heaven into \'Hai Nei Zhu Ying\'.',
    idiomatic: 'On the first day of Xinmao in the tenth month of winter, the imperial edict was issued to change the \'Three Teachings Zhu Ying\' written by the Queen of Heaven into \'Hai Nei Zhu Ying\' (condensed).',
  },
  s1571: {
    literal: 'In the Wuxu period, Wang Yun of Jia, Wang Xun of Xun, Wang Chen of Tong, Ke Guanglu, and Sikong of the school were ordered to be given honors and honors to the Shangzhu Kingdom, and they were still given money according to the regulations of hundreds of officials.',
    idiomatic: 'In the Wuxu period, Wang Yun of Jia, Wang Xun of Xun, Wang Chen of Tong, Ke Guanglu, and Sikong of the school were ordered to be given honors and honors to the Shangzhu Kingdom, and they were still given money according to the regulations of hundreds of officials (condensed).',
  },
  s1572: {
    literal: 'An Wangrong and Ying Wangyi gave them money.',
    idiomatic: 'An Wangrong and Ying Wangyi gave them money (condensed).',
  },
  s1573: {
    literal: 'Gengzi celebrated the festival and gave the ministers a banquet in Qujiang. They went to the Sixteenth Mansion to have fun with the kings.',
    idiomatic: 'Gengzi celebrated the festival and gave the ministers a banquet in Qujiang.',
  },
  s1574: {
    literal: 'On the day of Guimao, the prime minister judged the son of the state to offer wine. Zheng Qin entered the 160 volumes of \'Nine Classics of the Stone Wall\'.',
    idiomatic: 'On the day of Guimao, the prime minister judged the son of the state to offer wine.',
  },
  s1575: {
    literal: 'At that time, there was good literature, and Zheng Qin used the meaning of the classics to enlighten him, and those who had a little bit of writing made a memorial to the Doctor of the Five Classics. Cai Bojie of the later Han Dynasty published a stele in Taixue, and created the \'Nine Classics of Shibi\'. Confucian scholars corrected and corrected the errors.',
    idiomatic: 'At that time, there was good literature, and Zheng Qin used the meaning of the classics to enlighten him, and those who had a little bit of writing made a memorial to the Doctor of the Five Classics.',
  },
  s1576: {
    literal: 'He also ordered Tang Xuandu, the official scribe of Hanlin, to re-calibrate the fonts and follow the example well. Therefore, for decades after the establishment of the Stone Classic, no famous scholars looked at it, thinking it was too tired.',
    idiomatic: 'He also ordered Tang Xuandu, the official scribe of Hanlin, to re-calibrate the fonts and follow the example well.',
  },
  s1577: {
    literal: 'In Wushen, Li Guyan, the minister under the sect and Tongping Zhangshi, was appointed as the governor of Jiannan Xichuan, and he was the minister under the same sect and Pingzhangshi as before.',
    idiomatic: 'In Wushen, Li Guyan, the minister under the sect and Tongping Zhangshi, was appointed as the governor of Jiannan Xichuan, and he was the minister under the same sect and Pingzhangshi as before (condensed).',
  },
  s1578: {
    literal: 'Jiayin ordered the three envoys of Yantie, Hubu and Duzhi to supervise the officials of the hospital, all of whom were Langguan and Yushi.',
    idiomatic: 'Jiayin ordered the three envoys of Yantie, Hubu and Duzhi to supervise the officials of the hospital, all of whom were Langguan and Yushi (condensed).',
  },
  s1579: {
    literal: 'Even if the envoy is changed, the court officials cannot be replaced. If there is obvious failure, the matter will be reported immediately.',
    idiomatic: 'Even if the envoy is changed, the court officials cannot be replaced.',
  },
  s1580: {
    literal: 'Before long, Yang Sifu, the former military envoy of Xichuan Festival, became the Minister of the Ministry of Household Affairs and served as the salt and iron transport envoy for various roads.',
    idiomatic: 'Before long, Yang Sifu, the former military envoy of Xichuan Festival, became the Minister of the Ministry of Household Affairs and served as the salt and iron transport envoy for various roads (condensed).',
  },
  s1581: {
    literal: 'November Xinyoushuo.',
    idiomatic: 'November Xinyoushuo (condensed).',
  },
  s1582: {
    literal: 'In Renxu, Yin You, the prince\'s guest branch in the eastern capital, was appointed as the governor of the Zhongwu Army.',
    idiomatic: 'In Renxu, Yin You, the prince\'s guest branch in the eastern capital, was appointed as the governor of the Zhongwu Army (condensed).',
  },
  s1583: {
    literal: 'In Guihai, Liu Deguang, a mad man, broke into Hanyuan Hall and was killed by Jingzhao Mansion.',
    idiomatic: 'In Guihai, Liu Deguang, a mad man, broke into Hanyuan Hall and was killed by Jingzhao Mansion (condensed).',
  },
  s1584: {
    literal: 'Yichou, there was an earthquake in the capital.',
    idiomatic: 'Yichou, there was an earthquake in the capital (condensed).',
  },
  s1585: {
    literal: 'Ding Chou, Xingyuan Jiedushi envoy Linghu Chu died.',
    idiomatic: 'Ding Chou, Xingyuan Jiedushi envoy Linghu Chu died (condensed).',
  },
  s1586: {
    literal: 'In Dinghai, Zheng Huan, the Minister of Punishment, was appointed as the envoy of Shannan West Road.',
    idiomatic: 'In Dinghai, Zheng Huan, the Minister of Punishment, was appointed as the envoy of Shannan West Road (condensed).',
  },
  s1587: {
    literal: 'Ji Chou, Khitan paid tribute.',
    idiomatic: 'Ji Chou, Khitan paid tribute (condensed).',
  },
  s1588: {
    literal: 'December Gengyin Shuo.',
    idiomatic: 'December Gengyin Shuo (condensed).',
  },
  s1589: {
    literal: 'Bingshen, the cabinet\'s left and right officials, Shi Pei Su, etc.',
    idiomatic: 'Bingshen, the cabinet\'s left and right officials, Shi Pei Su, etc (condensed).',
  },
  s1590: {
    literal: 'Since the beginning of the Kaicheng period, the story has been restored. Every time he entered the cabinet, the left and right historians would write and stand under the head of Chi, and the emperor and ministers would discuss and prepare a book. Therefore, the political affairs of Kaicheng were the most detailed in modern times.',
    idiomatic: 'Since the beginning of the Kaicheng period, the story has been restored.',
  },
  s1591: {
    literal: 'Renyin, Du Tai, the former military governor of the Zhongwu Army, was the minister of the Ministry of Industry and judged the branch.',
    idiomatic: 'Renyin, Du Tai, the former military governor of the Zhongwu Army, was the minister of the Ministry of Industry and judged the branch (condensed).',
  },
  s1592: {
    literal: 'At that time, he was dismissed from his official position and had not thanked her for her kindness for a long time. Li Jue, the Minister of Household Affairs, told Du to serve as Princess Qiyang on leave.',
    idiomatic: 'At that time, he was dismissed from his official position and had not thanked her for her kindness for a long time.',
  },
  s1593: {
    literal: 'Jue Yin said: \'The prince-in-law recently served the princess for three years, so the noble family does not want to be a relative of the country.',
    idiomatic: 'Jue Yin said: \'The prince-in-law recently served the princess for three years, so the noble family does not want to be a relative of the country (condensed).',
  },
  s1594: {
    literal: 'The emperor was greatly shocked by the memorial, and immediately issued an edict: \'The importance of the uniform must be ceremonial. For example, I heard that the prince-in-law has been serving the princess for three years. The meaning of fate is not the original reality, and it violates the rules of the scriptures. I heard it now.\'',
    idiomatic: 'The emperor was greatly shocked by the memorial, and immediately issued an edict: \'The importance of the uniform must be ceremonial.',
  },
  s1595: {
    literal: 'It is advisable to travel every week, and it will always be customized.',
    idiomatic: 'It is advisable to travel every week, and it will always be customized (condensed).',
  },
  s1596: {
    literal: '\'Kaicheng three years, three years in the first month of spring, Geng Shenshuo.',
    idiomatic: '\'Kaicheng three years, three years in the first month of spring, Geng Shenshuo (condensed).',
  },
  s1597: {
    literal: 'In Jiazi, the prime minister Li Shi encountered a robber in Qinrenli. He was hit by a sword, which cut off his horse\'s tail, and was hit by a stray arrow, but he was not seriously injured.',
    idiomatic: 'In Jiazi, the prime minister Li Shi encountered a robber in Qinrenli.',
  },
  s1598: {
    literal: 'At that time, there was great fear in the capital, and the thieves could not be caught. Now it was known that the enemy\'s good deeds were new.',
    idiomatic: 'At that time, there was great fear in the capital, and the thieves could not be caught.',
  },
  s1599: {
    literal: 'Yi Chou, there are only nine people who often serve as officials and enter the court. The rest are all hiding, and they will be safe after many days.',
    idiomatic: 'Yi Chou, there are only nine people who often serve as officials and enter the court.',
  },
  s1600: {
    literal: 'On Ding Mao, the king of Qi ordered him to give a gift to Prince Huaiyi.',
    idiomatic: 'On Ding Mao, the king of Qi ordered him to give a gift to Prince Huaiyi (condensed).',
  },};
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
if (data.metadata.chapter !== '017') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 016; standalone T ready (${Object.keys(T).length} entries).`
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
