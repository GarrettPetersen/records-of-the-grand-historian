#!/usr/bin/env node
/** Batch 18: s1701–s1800 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1701;
const END = 1800;

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

const T = {  s1701: {
    literal: 'On the night of Dingmao, we watched lanterns and had fun in the Weitai Hall. The Queen Mother and other princesses of the Three Palaces were waiting for the meeting.',
    idiomatic: 'On the night of Dingmao, we watched lanterns and had fun in the Weitai Hall.',
  },
  s1702: {
    literal: 'The princess of Yan\'an was frugal by nature, and her clothes were wide, so she was immediately dismissed and her consort Dou Huan was punished.',
    idiomatic: 'The princess of Yan\'an was frugal by nature, and her clothes were wide, so she was immediately dismissed and her consort Dou Huan was punished (condensed).',
  },
  s1703: {
    literal: 'The edict said: \'When the princess enters the ginseng and her clothes exceed the standard, she must obey her husband\'s righteousness and have her faults repaid.',
    idiomatic: 'The edict said: \'When the princess enters the ginseng and her clothes exceed the standard, she must obey her husband\'s righteousness and have her faults repaid (condensed).',
  },
  s1704: {
    literal: 'Huanyi took away two months\' salary.',
    idiomatic: 'Huanyi took away two months\' salary (condensed).',
  },
  s1705: {
    literal: 'Closing quote mark.',
    idiomatic: 'End of quotation.',
  },
  s1706: {
    literal: 'In the leap month of Jia Shenshuo, Zheng Su, the minister of the Ministry of official affairs, inspected the Minister of Rites, Hezhong Jin Jiang Cixi and other state envoys, Li Daoshu, the governor of Suzhou, was the observation envoy for eastern Zhejiang, and Gao Yuanyu, the admonishing official, was the censor Zhongcheng.',
    idiomatic: 'In the leap month of Jia Shenshuo, Zheng Su, the minister of the Ministry of official affairs, inspected the Minister of Rites, Hezhong Jin Jiang Cixi and other state envoys, Li Daoshu, the governor of Suzhou, was the observation envoy for eastern Zhejiang, and Gao Yuanyu, the admonishing official, was the censor Zhongcheng (condensed).',
  },
  s1707: {
    literal: 'Bingshen, Li Ting, the former Hezhong Jiedu envoy, was the crown prince\'s chief protector.',
    idiomatic: 'Bingshen, Li Ting, the former Hezhong Jiedu envoy, was the crown prince\'s chief protector (condensed).',
  },
  s1708: {
    literal: 'In Jihai, Pei Du arrived from Taiyuan and ordered the people to ask about his illness.',
    idiomatic: 'In Jihai, Pei Du arrived from Taiyuan and ordered the people to ask about his illness (condensed).',
  },
  s1709: {
    literal: 'Xin Chou appointed Si Nongqing Li Li as the observation envoy to Fujian. He admonished the officials and dismissed him because he was not good enough.',
    idiomatic: 'Xin Chou appointed Si Nongqing Li Li as the observation envoy to Fujian.',
  },
  s1710: {
    literal: 'In Bingwu, Dali Qing Lu Zhen was appointed as the observation envoy to Fujian.',
    idiomatic: 'In Bingwu, Dali Qing Lu Zhen was appointed as the observation envoy to Fujian (condensed).',
  },
  s1711: {
    literal: 'At the end of Ding Dynasty, Zheng Huan, the envoy of Xingyuan Festival, died.',
    idiomatic: 'At the end of Ding Dynasty, Zheng Huan, the envoy of Xingyuan Festival, died (condensed).',
  },
  s1712: {
    literal: 'Wushen, Chapo Kingdom paid tribute.',
    idiomatic: 'Wushen, Chapo Kingdom paid tribute (condensed).',
  },
  s1713: {
    literal: 'February Guiyoushuo.',
    idiomatic: 'February Guiyoushuo (condensed).',
  },
  s1714: {
    literal: 'Xin You served as the Minister of the Ministry of Personnel, Guirong, the Minister of the Ministry of Etiquette, and served as the envoy of Shannan West Road.',
    idiomatic: 'Xin You served as the Minister of the Ministry of Personnel, Guirong, the Minister of the Ministry of Etiquette, and served as the envoy of Shannan West Road (condensed).',
  },
  s1715: {
    literal: 'On Bingyin, the Cold Food Festival, I went up to Tonghua Gate to watch the tourists.',
    idiomatic: 'On Bingyin, the Cold Food Festival, I went up to Tonghua Gate to watch the tourists (condensed).',
  },
  s1716: {
    literal: 'On Wuchen, I was lucky enough to arrive at the corner of the Qinzheng Building and play Cuju.',
    idiomatic: 'On Wuchen, I was lucky enough to arrive at the corner of the Qinzheng Building and play Cuju (condensed).',
  },
  s1717: {
    literal: 'Gui Wei Shuo in March.',
    idiomatic: 'Gui Wei Shuo in March (condensed).',
  },
  s1718: {
    literal: 'Yiyou gave the ministers a banquet in Qujiang.',
    idiomatic: 'Yiyou gave the ministers a banquet in Qujiang (condensed).',
  },
  s1719: {
    literal: 'It was night, and the moon covered the third star in Dongjing.',
    idiomatic: 'It was night, and the moon covered the third star in Dongjing (condensed).',
  },
  s1720: {
    literal: 'In Bingshen, Situ and Zhongshu ordered Pei Du to die.',
    idiomatic: 'In Bingshen, Situ and Zhongshu ordered Pei Du to die (condensed).',
  },
  s1721: {
    literal: 'In Guiyou, Li Daoshu, the observation envoy in eastern Zhejiang, died.',
    idiomatic: 'In Guiyou, Li Daoshu, the observation envoy in eastern Zhejiang, died (condensed).',
  },
  s1722: {
    literal: 'Cui Guicong, the minister of household affairs, was appointed as the observation envoy of Xuan She, replacing Cui Dan;',
    idiomatic: 'Cui Guicong, the minister of household affairs, was appointed as the observation envoy of Xuan She, replacing Cui Dan; — noted.',
  },
  s1723: {
    literal: 'Take Dan as Taichang Qing.',
    idiomatic: 'Take Dan as Taichang Qing (condensed).',
  },
  s1724: {
    literal: 'Xiao Chu, the governor of Chuzhou, was appointed as the observation envoy to eastern Zhejiang.',
    idiomatic: 'Xiao Chu, the governor of Chuzhou, was appointed as the observation envoy to eastern Zhejiang (condensed).',
  },
  s1725: {
    literal: 'In the fourth month of the summer, Ren Zishuo appointed Li Changyan, the commander of the army of Lin Youyu, as the governor of Yifang.',
    idiomatic: 'In the fourth month of the summer, Ren Zishuo appointed Li Changyan, the commander of the army of Lin Youyu, as the governor of Yifang (condensed).',
  },
  s1726: {
    literal: 'In Renxu, a deer came out of the Ancestral Temple.',
    idiomatic: 'In Renxu, a deer came out of the Ancestral Temple (condensed).',
  },
  s1727: {
    literal: 'The Xin Chou lunar month in May.',
    idiomatic: 'The Xin Chou lunar month in May (condensed).',
  },
  s1728: {
    literal: 'Dinghai, in the cabinet, he addressed the prime minister and said, \'How about the newly revised \'Kaiyuan Zhengyao\'?',
    idiomatic: 'Dinghai, in the cabinet, he addressed the prime minister and said, \'How about the newly revised \'Kaiyuan Zhengyao\'? — noted.',
  },
  s1729: {
    literal: 'Yang Sifu said, \'I haven\'t seen you yet.\'',
    idiomatic: 'Yang Sifu said, \'I haven\'t seen you yet.\' — noted.',
  },
  s1730: {
    literal: 'If your Majesty wishes to pass this book on to his descendants, he will announce it to his ministers and wait for their approval.',
    idiomatic: 'If your Majesty wishes to pass this book on to his descendants, he will announce it to his ministers and wait for their approval (condensed).',
  },
  s1731: {
    literal: 'The political affairs of the Kaiyuan Dynasty were different from those of the Zhenguan Dynasty. Xuanzong was either fond of traveling or sensual.',
    idiomatic: 'The political affairs of the Kaiyuan Dynasty were different from those of the Zhenguan Dynasty.',
  },
  s1732: {
    literal: 'After writing the description, how can it not be easy to do all the hard work!',
    idiomatic: 'After writing the description, how can it not be easy to do all the hard work! — noted.',
  },
  s1733: {
    literal: '\'In Bingshen, Zheng Tan and Chen Yixing stopped to know the political affairs. Tan guard Zuopushe, and Yi Xing was the minister of the Ministry of official affairs.',
    idiomatic: '\'In Bingshen, Zheng Tan and Chen Yixing stopped to know the political affairs.',
  },
  s1734: {
    literal: 'On Bingwu, Guo Min, the envoy of Xingning Festival, died.',
    idiomatic: 'On Bingwu, Guo Min, the envoy of Xingning Festival, died (condensed).',
  },
  s1735: {
    literal: 'Locusts in Tianping, Weibo, Yiding and other areas eat autumn crops.',
    idiomatic: 'Locusts in Tianping, Weibo, Yiding and other areas eat autumn crops (condensed).',
  },
  s1736: {
    literal: 'On the first day of Xinhai in the sixth month of the lunar month, Fu Che, the envoy of Changwucheng, was appointed as the governor of Xinhai.',
    idiomatic: 'On the first day of Xinhai in the sixth month of the lunar month, Fu Che, the envoy of Changwucheng, was appointed as the governor of Xinhai (condensed).',
  },
  s1737: {
    literal: 'Gengshen, I was fortunate enough to have a banquet in the courtyard of King An and King Ying in the Sixteenth House, and I gave him a lot of money.',
    idiomatic: 'Gengshen, I was fortunate enough to have a banquet in the courtyard of King An and King Ying in the Sixteenth House, and I gave him a lot of money (condensed).',
  },
  s1738: {
    literal: 'On Wuchen, due to a long drought, I prayed in the temple, and every worry moved me.',
    idiomatic: 'On Wuchen, due to a long drought, I prayed in the temple, and every worry moved me (condensed).',
  },
  s1739: {
    literal: 'The prime minister and others reported: \'The floods and droughts are due to the time, and begging is not enough to trouble the saints.',
    idiomatic: 'The prime minister and others reported: \'The floods and droughts are due to the time, and begging is not enough to trouble the saints (condensed).',
  },
  s1740: {
    literal: '\'The superior changed his appearance and said: \'I am the master of human beings, and I have no virtue to bring to the world. I have caused disasters and droughts, and I have been banished to heaven.',
    idiomatic: '\'The superior changed his appearance and said: \'I am the master of human beings, and I have no virtue to bring to the world.',
  },
  s1741: {
    literal: 'If there is no rain for three days, we should retreat to the south and choose wise men to rule the world.',
    idiomatic: 'If there is no rain for three days, we should retreat to the south and choose wise men to rule the world (condensed).',
  },
  s1742: {
    literal: '\'The ministers sobbed and shed tears, and asked for help.',
    idiomatic: '\'The ministers sobbed and shed tears, and asked for help (condensed).',
  },
  s1743: {
    literal: 'It\'s night, and it\'s raining heavily.',
    idiomatic: 'It\'s night, and it\'s raining heavily (condensed).',
  },
  s1744: {
    literal: 'Ding Chou, Xiangyang mangosteen is strong and its rice is edible.',
    idiomatic: 'Ding Chou, Xiangyang mangosteen is strong and its rice is edible (condensed).',
  },
  s1745: {
    literal: 'On the first day of the seventh month in autumn, Gengchen and Shuo are flooded in Western Sichuan, which harms the crops.',
    idiomatic: 'On the first day of the seventh month in autumn, Gengchen and Shuo are flooded in Western Sichuan, which harms the crops (condensed).',
  },
  s1746: {
    literal: 'It\'s midnight, and the moon is confused.',
    idiomatic: 'It\'s midnight, and the moon is confused (condensed).',
  },
  s1747: {
    literal: 'In Renyin, Yin Weichang of Henan was appointed as the governor of Pinglu Army, and Gao Kai, the Minister of Punishment, was appointed as Yin of Henan.',
    idiomatic: 'In Renyin, Yin Weichang of Henan was appointed as the governor of Pinglu Army, and Gao Kai, the Minister of Punishment, was appointed as Yin of Henan (condensed).',
  },
  s1748: {
    literal: 'On the day of Jiachen, the great and middle-ranking official, the chief minister of Tai Changqing, Shangzhuguo, was given a purple gold fish bag to Cui Danke, who was the official and the official of Zhongshu\'s family.',
    idiomatic: 'On the day of Jiachen, the great and middle-ranking official, the chief minister of Tai Changqing, Shangzhuguo, was given a purple gold fish bag to Cui Danke, who was the official and the official of Zhongshu\'s family (condensed).',
  },
  s1749: {
    literal: 'Cangjing, Ziqing Dashui.',
    idiomatic: 'Cangjing, Ziqing Dashui (condensed).',
  },
  s1750: {
    literal: 'On the first day of August, Gengxu, Yao He was appointed as the observation envoy of Shaanxi and Guozhou.',
    idiomatic: 'On the first day of August, Gengxu, Yao He was appointed as the observation envoy of Shaanxi and Guozhou (condensed).',
  },
  s1751: {
    literal: 'In the year of 1911, King Xiao passed away.',
    idiomatic: 'In the year of 1911, King Xiao passed away (condensed).',
  },
  s1752: {
    literal: 'In Bingchen, Xingzhou abolished Qingshan County, and Cizhou moved to Zhaoyi County and Guzhenyi.',
    idiomatic: 'In Bingchen, Xingzhou abolished Qingshan County, and Cizhou moved to Zhaoyi County and Guzhenyi (condensed).',
  },
  s1753: {
    literal: 'In Guihai, Zuo Pu Sheniu Sengru inspected Sikong and Tongping Zhangshi, served as the governor of Xiangzhou, and served as the military envoy of Shannan East Road.',
    idiomatic: 'In Guihai, Zuo Pu Sheniu Sengru inspected Sikong and Tongping Zhangshi, served as the governor of Xiangzhou, and served as the military envoy of Shannan East Road (condensed).',
  },
  s1754: {
    literal: 'On the night of Xin Wei, a shooting star came out of the Yulin Forest. Its tail was more than eighty feet long. After it died, it made a sound like thunder.',
    idiomatic: 'On the night of Xin Wei, a shooting star came out of the Yulin Forest.',
  },
  s1755: {
    literal: 'In Renshen, the locusts in the four prefectures of Zhen and Hebei ate the crops, and all the weeds and leaves were gone.',
    idiomatic: 'In Renshen, the locusts in the four prefectures of Zhen and Hebei ate the crops, and all the weeds and leaves were gone (condensed).',
  },
  s1756: {
    literal: 'Ji Mao Shuo in September.',
    idiomatic: 'Ji Mao Shuo in September (condensed).',
  },
  s1757: {
    literal: 'In Xinmao, Yang Rushi, who was in Jiannan Dongchuan Festival, was appointed as the minister of the Ministry of official affairs.',
    idiomatic: 'In Xinmao, Yang Rushi, who was in Jiannan Dongchuan Festival, was appointed as the minister of the Ministry of official affairs (condensed).',
  },
  s1758: {
    literal: 'On Dingyou night, the moon covered the third star in Dongjing.',
    idiomatic: 'On Dingyou night, the moon covered the third star in Dongjing (condensed).',
  },
  s1759: {
    literal: 'Xin Chou appointed Chen Yi, the minister of the Ministry of Civil Affairs, as the defense envoy of the Huazhou Zhenguo army, Li Ying, the governor of Suzhou, as the observation envoy of Jiangxi, and Feng Ding, the admonishing official, as the observation envoy of Guiguan.',
    idiomatic: 'Xin Chou appointed Chen Yi, the minister of the Ministry of Civil Affairs, as the defense envoy of the Huazhou Zhenguo army, Li Ying, the governor of Suzhou, as the observation envoy of Jiangxi, and Feng Ding, the admonishing official, as the observation envoy of Guiguan (condensed).',
  },
  s1760: {
    literal: 'In Jiachen, Jingzhao Yin Zhengfu was appointed as the governor of Dongchuan in Jiannan.',
    idiomatic: 'In Jiachen, Jingzhao Yin Zhengfu was appointed as the governor of Dongchuan in Jiannan (condensed).',
  },
  s1761: {
    literal: 'In Bingwu, Jingxin, the former Jiangxi observation envoy, was appointed as Jing Zhaoyin.',
    idiomatic: 'In Bingwu, Jingxin, the former Jiangxi observation envoy, was appointed as Jing Zhaoyin (condensed).',
  },
  s1762: {
    literal: 'In the tenth month of winter, Youshuo comes.',
    idiomatic: 'In the tenth month of winter, Youshuo comes (condensed).',
  },
  s1763: {
    literal: 'On Wuwu day, to celebrate the festival, a banquet was given to all the ministers in Qujiang Pavilion.',
    idiomatic: 'On Wuwu day, to celebrate the festival, a banquet was given to all the ministers in Qujiang Pavilion (condensed).',
  },
  s1764: {
    literal: 'On Xinyou night, the star enters Doukui.',
    idiomatic: 'On Xinyou night, the star enters Doukui (condensed).',
  },
  s1765: {
    literal: 'The former Gui Guan observed and ordered Yan Jian to die.',
    idiomatic: 'The former Gui Guan observed and ordered Yan Jian to die (condensed).',
  },
  s1766: {
    literal: 'Bingyin made Chen Wang Chengmei, the sixth son of Jingzong, the crown prince.',
    idiomatic: 'Bingyin made Chen Wang Chengmei, the sixth son of Jingzong, the crown prince (condensed).',
  },
  s1767: {
    literal: 'Ding Chou, Prince Taibao Li Tingzu.',
    idiomatic: 'Ding Chou, Prince Taibao Li Tingzu (condensed).',
  },
  s1768: {
    literal: 'November is the first day of the lunar month.',
    idiomatic: 'November is the first day of the lunar month (condensed).',
  },
  s1769: {
    literal: 'Renshen, former Fujian observation envoy Tang Fuzu.',
    idiomatic: 'Renshen, former Fujian observation envoy Tang Fuzu (condensed).',
  },
  s1770: {
    literal: 'In Jihai, Qu pardoned the prisoners in the capital.',
    idiomatic: 'In Jihai, Qu pardoned the prisoners in the capital (condensed).',
  },
  s1771: {
    literal: 'December Jiyoushuo.',
    idiomatic: 'December Jiyoushuo (condensed).',
  },
  s1772: {
    literal: 'Guichou demoted Guang Luqing and Prince Consort Wei Rang to be governors of Li.',
    idiomatic: 'Guichou demoted Guang Luqing and Prince Consort Wei Rang to be governors of Li (condensed).',
  },
  s1773: {
    literal: 'Yimao, Qianling Fire.',
    idiomatic: 'Yimao, Qianling Fire (condensed).',
  },
  s1774: {
    literal: 'With Li Zongmin, the governor of Hangzhou, as the prince\'s guest, he was divided into the eastern capital.',
    idiomatic: 'With Li Zongmin, the governor of Hangzhou, as the prince\'s guest, he was divided into the eastern capital (condensed).',
  },
  s1775: {
    literal: 'Xinyou was not in good health, and hundreds of officials went to live in Yanying.',
    idiomatic: 'Xinyou was not in good health, and hundreds of officials went to live in Yanying (condensed).',
  },
  s1776: {
    literal: 'On Yihai, the prime minister came to pay homage and met in the Hall of Supreme Harmony.',
    idiomatic: 'On Yihai, the prime minister came to pay homage and met in the Hall of Supreme Harmony (condensed).',
  },
  s1777: {
    literal: 'This year, the Ministry of Households calculated that there were 4,996,752 households in charge.',
    idiomatic: 'This year, the Ministry of Households calculated that there were 4,996,752 households in charge (condensed).',
  },
  s1778: {
    literal: 'In the fifth year of Kaicheng\'s reign, in the spring of the first month of the fifth year, Wu Yin Shuo, he was not in good health and received no congratulations from the court.',
    idiomatic: 'In the fifth year of Kaicheng\'s reign, in the spring of the first month of the fifth year, Wu Yin Shuo, he was not in good health and received no congratulations from the court (condensed).',
  },
  s1779: {
    literal: 'In Ji Mao\'s reign, he issued an edict to appoint his younger brother, King Ying, as the emperor\'s younger brother, with the power to handle military and state affairs.',
    idiomatic: 'In Ji Mao\'s reign, he issued an edict to appoint his younger brother, King Ying, as the emperor\'s younger brother, with the power to handle military and state affairs (condensed).',
  },
  s1780: {
    literal: 'The crown prince Cheng Mei regained the title of King Chen.',
    idiomatic: 'The crown prince Cheng Mei regained the title of King Chen (condensed).',
  },
  s1781: {
    literal: 'Xin Si died in the Taihe Hall of the Daming Palace and lived to be thirty-three years old.',
    idiomatic: 'Xin Si died in the Taihe Hall of the Daming Palace and lived to be thirty-three years old (condensed).',
  },
  s1782: {
    literal: 'The posthumous title of the ministers is Emperor Yuan Sheng Zhaoxian, and the temple name is Wenzong.',
    idiomatic: 'The posthumous title of the ministers is Emperor Yuan Sheng Zhaoxian, and the temple name is Wenzong (condensed).',
  },
  s1783: {
    literal: 'He was buried in Zhangling on August 17th of that year.',
    idiomatic: 'He was buried in Zhangling on August 17th of that year (condensed).',
  },
  s1784: {
    literal: '[On] Shi Chen said: Emperor Zhaoxian was thrifty and elegant, out of nature, inheriting the extravagance and disadvantages of his father and elder brothers. When Yansi interfered with his power, he was able to manage chaos and replace danger with peace.',
    idiomatic: '[On] Shi Chen said: Emperor Zhaoxian was thrifty and elegant, out of nature, inheriting the extravagance and disadvantages of his father and elder brothers.',
  },
  s1785: {
    literal: 'At the beginning of the Yamato period, it was clear.',
    idiomatic: 'At the beginning of the Yamato period, it was clear (condensed).',
  },
  s1786: {
    literal: 'At the beginning, when the emperor was in Hui, he liked to read \'Zhenguan Zhengyao\'. Every time he saw Taizong\'s diligent political approach, he was interested in it.',
    idiomatic: 'At the beginning, when the emperor was in Hui, he liked to read \'Zhenguan Zhengyao\'.',
  },
  s1787: {
    literal: 'After he came to the throne, every time Yan Ying met with his ministers, he would miss eleven quarters of time.',
    idiomatic: 'After he came to the throne, every time Yan Ying met with his ministers, he would miss eleven quarters of time (condensed).',
  },
  s1788: {
    literal: 'According to the story, the emperor took matters into his own hands on two days. The emperor said to his prime minister, \'I want to see you and your ministers every day. I can use two days to stop the dynasty or leave the dynasty.\'',
    idiomatic: 'According to the story, the emperor took matters into his own hands on two days.',
  },
  s1789: {
    literal: '\'At that time, Empress Guo of Xianzong lived in Xingqing Palace, and she was called the Empress Dowager. The Empress Dowager Baoli of Jingzong and her mother, Empress Dowager Xiao, were called \'The Empress Dowager of the Three Palaces\'.',
    idiomatic: '\'At that time, Empress Guo of Xianzong lived in Xingqing Palace, and she was called the Empress Dowager.',
  },
  s1790: {
    literal: 'The emperor is benevolent and filial, and the three palaces greet him with the same affection.',
    idiomatic: 'The emperor is benevolent and filial, and the three palaces greet him with the same affection (condensed).',
  },
  s1791: {
    literal: 'After tasting the cherries in the inner garden, the director said: \'Don\'t give it to the Queen Mother of the Third Palace.',
    idiomatic: 'After tasting the cherries in the inner garden, the director said: \'Don\'t give it to the Queen Mother of the Third Palace (condensed).',
  },
  s1792: {
    literal: 'The emperor said, \'How can I get a gift from the Empress Dowager\'s palace?\'',
    idiomatic: 'The emperor said, \'How can I get a gift from the Empress Dowager\'s palace?\' — noted.',
  },
  s1793: {
    literal: '” He suddenly took the pen and gave it to him as a gift.',
    idiomatic: '” He suddenly took the pen and gave it to him as a gift (condensed).',
  },
  s1794: {
    literal: 'Zongzheng Temple destroyed the sacrificial utensils and asked for them to be changed. When a minister came in, they ordered them to be displayed in a separate hall and read them with a crown and face, looking sad.',
    idiomatic: 'Zongzheng Temple destroyed the sacrificial utensils and asked for them to be changed.',
  },
  s1795: {
    literal: 'When Yule selects internal and external officials in the political affairs, and names are promoted in the government, the emperor will interview them for their performance, and then make up for them.',
    idiomatic: 'When Yule selects internal and external officials in the political affairs, and names are promoted in the government, the emperor will interview them for their performance, and then make up for them (condensed).',
  },
  s1796: {
    literal: 'Zhongshu appointed Zhang Jia, the minister of Honglu, as the governor of Quzhou. Jia was a good scholar. On the day of his resignation, the emperor said to him: \'I heard that Qing was good at long-term conduct.',
    idiomatic: 'Zhongshu appointed Zhang Jia, the minister of Honglu, as the governor of Quzhou.',
  },
  s1797: {
    literal: 'He replied: \'Besides political affairs, there is nothing wrong with chatting and playing with guests.\'',
    idiomatic: 'He replied: \'Besides political affairs, there is nothing wrong with chatting and playing with guests.',
  },
  s1798: {
    literal: 'The emperor said: \'How can there be no harm in doing anything good?\'',
    idiomatic: 'The emperor said: \'How can there be no harm in doing anything good?\' — noted.',
  },
  s1799: {
    literal: '” The terrifying breath heard inside and outside.',
    idiomatic: '” The terrifying breath heard inside and outside (condensed).',
  },
  s1800: {
    literal: 'However, the emperor has banned the imperial palace for many generations, especially looking at the middle officials, and wants to get rid of it.',
    idiomatic: 'However, the emperor has banned the imperial palace for many generations, especially looking at the middle officials, and wants to get rid of it (condensed).',
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
