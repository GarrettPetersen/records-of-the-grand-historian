#!/usr/bin/env node
/** Batch 17: s1601–s1700 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1601;
const END = 1700;

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

const T = {  s1601: {
    literal: 'Wu Shen sent various salt and iron transport envoys, Zhengyi officials, Shangshu of the Ministry of Households, Shangzhu Kingdom, Kaiguobo of Hongnong County, and 700 households in the city. Yang Sifu was given a purple gold fish bag, and Yang Sifu was the official and Zhongshu\'s family.',
    idiomatic: 'Wu Shen sent various salt and iron transport envoys, Zhengyi officials, Shangshu of the Ministry of Households, Shangzhu Kingdom, Kaiguobo of Hongnong County, and 700 households in the city.',
  },
  s1602: {
    literal: 'Bingzi appointed Li Shi, the Minister of Zhongshu and Pingzhangshi under Tongzhongshu\'s family, as the envoy of Jingnan Festival, according to the former Minister of Zhongshu and Pingzhangshi.',
    idiomatic: 'Bingzi appointed Li Shi, the Minister of Zhongshu and Pingzhangshi under Tongzhongshu\'s family, as the envoy of Jingnan Festival, according to the former Minister of Zhongshu and Pingzhangshi (condensed).',
  },
  s1603: {
    literal: 'Ding Chou, Wei Chang, the former Jingnan Jiedu envoy, was Henan Yin.',
    idiomatic: 'Ding Chou, Wei Chang, the former Jingnan Jiedu envoy, was Henan Yin (condensed).',
  },
  s1604: {
    literal: 'At the end of Gui Dynasty, the imperial edict was issued to the place where the autumn locusts had damaged the crops, but the money was still used to provide relief in the Changping warehouse.',
    idiomatic: 'At the end of Gui Dynasty, the imperial edict was issued to the place where the autumn locusts had damaged the crops, but the money was still used to provide relief in the Changping warehouse (condensed).',
  },
  s1605: {
    literal: 'It\'s snowing heavily that day.',
    idiomatic: 'It\'s snowing heavily that day (condensed).',
  },
  s1606: {
    literal: 'February is the first day of the month.',
    idiomatic: 'February is the first day of the month (condensed).',
  },
  s1607: {
    literal: 'At the end of the day, the superior said to the prime minister: \'Li Zongmin has been away for several years, so he can\'t be separated from an official.',
    idiomatic: 'At the end of the day, the superior said to the prime minister: \'Li Zongmin has been away for several years, so he can\'t be separated from an official (condensed).',
  },
  s1608: {
    literal: 'Zheng Tan and Chen Yixing said: \'Zong Min raised Zheng Zhu, and he overthrew the imperial court several times. He was even more treacherous than Li Linfu.\'',
    idiomatic: 'Zheng Tan and Chen Yixing said: \'Zong Min raised Zheng Zhu, and he overthrew the imperial court several times.',
  },
  s1609: {
    literal: '\'Yang Sifu and Li Jue reported: \'At the end of the Great War, Zong Min and Deyu were offended at the same time. Within two years, Deyu was again transferred to Huainan Jiedushi, while Zong Min was still demoted.',
    idiomatic: '\'Yang Sifu and Li Jue reported: \'At the end of the Great War, Zong Min and Deyu were offended at the same time.',
  },
  s1610: {
    literal: 'Everything is worth winning, and you can\'t do it just for selfish reasons.',
    idiomatic: 'Everything is worth winning, and you can\'t do it just for selfish reasons (condensed).',
  },
  s1611: {
    literal: '\'It said: \'It can be compared with a county.',
    idiomatic: '\'It said: \'It can be compared with a county (condensed).',
  },
  s1612: {
    literal: '\'Ding You appointed Li Zongmin, Sima of Hengzhou, as the governor of Hangzhou.',
    idiomatic: '\'Ding You appointed Li Zongmin, Sima of Hengzhou, as the governor of Hangzhou (condensed).',
  },
  s1613: {
    literal: 'Gengzi, the Ministry of Officials reported: \'Last year, the senior monks decided to follow the old pattern, which is quite inconvenient and cannot be used for a long time. Please use the old pattern.\'',
    idiomatic: 'Gengzi, the Ministry of Officials reported: \'Last year, the senior monks decided to follow the old pattern, which is quite inconvenient and cannot be used for a long time.',
  },
  s1614: {
    literal: '”Follow it.',
    idiomatic: '”Follow it (condensed).',
  },
  s1615: {
    literal: 'Yi Si, the imperial minister, the minister, the assistant minister, the left and right prime ministers, and the high officials and supervisors all meet each other on the day of sitting, and they should be ordered to go to each other one by one.',
    idiomatic: 'Yi Si, the imperial minister, the minister, the assistant minister, the left and right prime ministers, and the high officials and supervisors all meet each other on the day of sitting, and they should be ordered to go to each other one by one (condensed).',
  },
  s1616: {
    literal: 'In Ding Wei, Sun Jian, the governor of Tongzhou, was appointed as the observation envoy to Shaanxi and Guozhou to practice martial arts on Lu\'s behalf;',
    idiomatic: 'In Ding Wei, Sun Jian, the governor of Tongzhou, was appointed as the observation envoy to Shaanxi and Guozhou to practi',
  },
  s1617: {
    literal: 'He used his skills as a blessing to the king, and was in charge of the Eastern Capital.',
    idiomatic: 'He used his skills as a blessing to the king, and was in charge of the Eastern Capital (condensed).',
  },
  s1618: {
    literal: 'In Yiyou day, Xu Kangzuo, the Minister of Rites, died.',
    idiomatic: 'In Yiyou day, Xu Kangzuo, the Minister of Rites, died (condensed).',
  },
  s1619: {
    literal: 'In the year of 1911, Zuo Cheng Lu Zai was appointed as the defense envoy of Tongzhou.',
    idiomatic: 'In the year of 1911, Zuo Cheng Lu Zai was appointed as the defense envoy of Tongzhou (condensed).',
  },
  s1620: {
    literal: 'March has not yet begun.',
    idiomatic: 'March has not yet begun (condensed).',
  },
  s1621: {
    literal: 'In Gengwu, the 19th son of King Chen was granted the title of Prince of Xuancheng County, and the third son of King Xiang was granted the title of Prince of Leping County.',
    idiomatic: 'In Gengwu, the 19th son of King Chen was granted the title of Prince of Xuancheng County, and the third son of King Xiang was granted the title of Prince of Leping County (condensed).',
  },
  s1622: {
    literal: 'In the fourth month of summer, Wu Zishuo.',
    idiomatic: 'In the fourth month of summer, Wu Zishuo (condensed).',
  },
  s1623: {
    literal: 'Ji Chou, the Minister of Rites, became an official and Xu Hui died.',
    idiomatic: 'Ji Chou, the Minister of Rites, became an official and Xu Hui died (condensed).',
  },
  s1624: {
    literal: 'In Xinmao, Cui Gui, the Minister of Household Affairs, was judged to be the Secretary.',
    idiomatic: 'In Xinmao, Cui Gui, the Minister of Household Affairs, was judged to be the Secretary (condensed).',
  },
  s1625: {
    literal: 'The edict said: \'The two ministers of the Ministry of Household Affairs, whoever is appointed first from now on, should be ordered to judge the Qiangu of this department;',
    idiomatic: 'The edict said: \'The two ministers of the Ministry of Household Affairs, whoever is appointed first from now on, should',
  },
  s1626: {
    literal: 'For example, if there is a Pingzhang matter, it is judged as salt and tiedu branch, and it is not limited to being a bachelor of Zhongcheng.',
    idiomatic: 'For example, if there is a Pingzhang matter, it is judged as salt and tiedu branch, and it is not limited to being a bachelor of Zhongcheng (condensed).',
  },
  s1627: {
    literal: '\'Renchen sent Pei Gun as the defense envoy to Huazhou.',
    idiomatic: '\'Renchen sent Pei Gun as the defense envoy to Huazhou (condensed).',
  },
  s1628: {
    literal: 'In Yiyou, \'Fa Qu\' was changed to \'Xian Shao Qu\', and the place where Ling Guan was married was still called Xian Shao Yuan.',
    idiomatic: 'In Yiyou, \'Fa Qu\' was changed to \'Xian Shao Qu\', and the place where Ling Guan was married was still called Xian Shao Yuan (condensed).',
  },
  s1629: {
    literal: 'Pei Chu, the minister of the Ministry of War, died.',
    idiomatic: 'Pei Chu, the minister of the Ministry of War, died (condensed).',
  },
  s1630: {
    literal: 'In Guichou, Li Qu, a doctor in the field, and Shi Linzan, the chief minister of Prince Mian, etc., compiled one hundred and fifty volumes of \'The Jade Certificate of the Imperial Tang Dynasty\'.',
    idiomatic: 'In Guichou, Li Qu, a doctor in the field, and Shi Linzan, the chief minister of Prince Mian, etc.',
  },
  s1631: {
    literal: 'On the first day of the fifth month, Ding Sishuo, the Ministry of Rites issued an order: Jinshi and Juren of Gongyuan, and the age limit of thirty people would be released.',
    idiomatic: 'On the first day of the fifth month, Ding Sishuo, the Ministry of Rites issued an order: Jinshi and Juren of Gongyuan, and the age limit of thirty people would be released (condensed).',
  },
  s1632: {
    literal: 'Xin You, the imperial edict: Wu Shigui, the former Jiangxi observation envoy, took advantage of the stolen goods and stayed in Duanzhou.',
    idiomatic: 'Xin You, the imperial edict: Wu Shigui, the former Jiangxi observation envoy, took advantage of the stolen goods and stayed in Duanzhou (condensed).',
  },
  s1633: {
    literal: 'Geng Wu, the moon invades the big star of Tianxin.',
    idiomatic: 'Geng Wu, the moon invades the big star of Tianxin (condensed).',
  },
  s1634: {
    literal: 'In Guiwei, Gao Kai, the minister of the Ministry of Personnel, was appointed as the observation envoy of Eyue, replacing Gao Zhong;',
    idiomatic: 'In Guiwei, Gao Kai, the minister of the Ministry of Personnel, was appointed as the observation envoy of Eyue, replacing',
  },
  s1635: {
    literal: 'Yi Zhong was appointed Minister of the Ministry of War.',
    idiomatic: 'Yi Zhong was appointed Minister of the Ministry of War (condensed).',
  },
  s1636: {
    literal: 'Ding Weishuo in June.',
    idiomatic: 'Ding Weishuo in June (condensed).',
  },
  s1637: {
    literal: 'Xinyou, four hundred and eighty people came out of the palace and were sent to two street temples for resettlement.',
    idiomatic: 'Xinyou, four hundred and eighty people came out of the palace and were sent to two street temples for resettlement (condensed).',
  },
  s1638: {
    literal: 'The alum official of Pingyang Academy in Jinzhou was abolished and returned to the prefecture and county.',
    idiomatic: 'The alum official of Pingyang Academy in Jinzhou was abolished and returned to the prefecture and county (condensed).',
  },
  s1639: {
    literal: 'Guichou, who was in charge of Zichen, said to the prime minister: \'How about a light coin and a heavy coin?\'',
    idiomatic: 'Guichou, who was in charge of Zichen, said to the prime minister: \'How about a light coin and a heavy coin?\' — noted.',
  },
  s1640: {
    literal: 'Yang Sifu said: \'This matter has been going on for a long time. We cannot change the law suddenly. Changes in the law will disturb people.\'',
    idiomatic: 'Yang Sifu said: \'This matter has been going on for a long time.',
  },
  s1641: {
    literal: 'But the prohibition on bronze utensils is exactly what he wants.',
    idiomatic: 'But the prohibition on bronze utensils is exactly what he wants (condensed).',
  },
  s1642: {
    literal: 'Closing quote mark.',
    idiomatic: 'End of quotation.',
  },
  s1643: {
    literal: 'Autumn July Bingchenshuo.',
    idiomatic: 'Autumn July Bingchenshuo (condensed).',
  },
  s1644: {
    literal: 'In Renxu, Chen Xu Jiedu envoy Yin You died.',
    idiomatic: 'In Renxu, Chen Xu Jiedu envoy Yin You died (condensed).',
  },
  s1645: {
    literal: 'In Jiazi, Wang Yanwei, the Weiwei Qing, inspected the Ministry of Etiquette and served as the Zhongwu Army Military Envoy;',
    idiomatic: 'In Jiazi, Wang Yanwei, the Weiwei Qing, inspected the Ministry of Etiquette and served as the Zhongwu Army Military Envo',
  },
  s1646: {
    literal: 'Shi Xiaozhang, the general of Youjin Wuwei, was appointed as the governor of Xingning.',
    idiomatic: 'Shi Xiaozhang, the general of Youjin Wuwei, was appointed as the governor of Xingning (condensed).',
  },
  s1647: {
    literal: 'On Wuchen, Xichuan Jiedushi Li Guyan came to the table again and asked his servants and the right servant of the school to shoot.',
    idiomatic: 'On Wuchen, Xichuan Jiedushi Li Guyan came to the table again and asked his servants and the right servant of the school to shoot (condensed).',
  },
  s1648: {
    literal: 'August Bingxu.',
    idiomatic: 'August Bingxu (condensed).',
  },
  s1649: {
    literal: 'In the Sino-Japanese War of the Sino-Japanese War, there were floods in various states along the east coast of Shannan, and the crops were wiped out.',
    idiomatic: 'In the Sino-Japanese War of the Sino-Japanese War, there were floods in various states along the east coast of Shannan, and the crops were wiped out (condensed).',
  },
  s1650: {
    literal: 'Ding You, the imperial edict: \'To the south of the great river, the territory is thousands of miles, and to the north of Chuze, there are several states.',
    idiomatic: 'Ding You, the imperial edict: \'To the south of the great river, the territory is thousands of miles, and to the north of Chuze, there are several states (condensed).',
  },
  s1651: {
    literal: 'When floods hit, the embankments burst and overflowed, damaging the houses and damaging the fields.',
    idiomatic: 'When floods hit, the embankments burst and overflowed, damaging the houses and damaging the fields (condensed).',
  },
  s1652: {
    literal: 'When I think of Li Yuan, if this disaster continues, my livelihood may be wiped out, my farm work will be in vain, and I will be trapped in poverty. How can I help myself?',
    idiomatic: 'When I think of Li Yuan, if this disaster continues, my livelihood may be wiped out, my farm work will be in vain, and I will be trapped in poverty.',
  },
  s1653: {
    literal: 'It is appropriate to order Lu Hongxuan to go to Chen Xu, Zheng Hua, Cao Pu and other roads to express condolences, and Cui Jin, a doctor in the Ministry of Punishment, to go to Shannan East Road, Eyue and Qihuang Road to express condolences.',
    idiomatic: 'It is appropriate to order Lu Hongxuan to go to Chen Xu, Zheng Hua, Cao Pu and other roads to express condolences, and Cui Jin, a doctor in the Ministry of Punishment, to go to Shannan East Road, Eyue and Qihuang Road to express condolences (condensed).',
  },
  s1654: {
    literal: '\'In Jihai, King Jia died.',
    idiomatic: '\'In Jihai, King Jia died (condensed).',
  },
  s1655: {
    literal: 'In the six states of Weibo, locusts eat all the autumn seedlings.',
    idiomatic: 'In the six states of Weibo, locusts eat all the autumn seedlings (condensed).',
  },
  s1656: {
    literal: 'Bingchenshuo in September.',
    idiomatic: 'Bingchenshuo in September (condensed).',
  },
  s1657: {
    literal: 'Xin You, Jingnan Li Shirang Zhongshu Shilang, was changed to the Minister of Military Affairs of the School.',
    idiomatic: 'Xin You, Jingnan Li Shirang Zhongshu Shilang, was changed to the Minister of Military Affairs of the School (condensed).',
  },
  s1658: {
    literal: 'In Renxu, the crown prince was defeated by a slow tour, and he wanted to abolish him. The prime minister and the emperor also shed tears and remonstrated.',
    idiomatic: 'In Renxu, the crown prince was defeated by a slow tour, and he wanted to abolish him.',
  },
  s1659: {
    literal: 'That night, he moved the prince to Shaoyang Courtyard and killed dozens of the prince\'s concubines.',
    idiomatic: 'That night, he moved the prince to Shaoyang Courtyard and killed dozens of the prince\'s concubines (condensed).',
  },
  s1660: {
    literal: 'In Wuchen, the king of Liang and other five people were ordered to go to Bei Nei first, but they returned to the sixteenth house.',
    idiomatic: 'In Wuchen, the king of Liang and other five people were ordered to go to Bei Nei first, but they returned to the sixteenth house (condensed).',
  },
  s1661: {
    literal: 'At the end of Xin Dynasty, Yi Dingjie made Zhang Fan die.',
    idiomatic: 'At the end of Xin Dynasty, Yi Dingjie made Zhang Fan die (condensed).',
  },
  s1662: {
    literal: 'Renshen appointed Li Zhongqian, the governor of Yizhou, as the governor of Dingzhou and served as the military governor of Yizhou.',
    idiomatic: 'Renshen appointed Li Zhongqian, the governor of Yizhou, as the governor of Dingzhou and served as the military governor of Yizhou (condensed).',
  },
  s1663: {
    literal: 'In Wuyin, Niu Sengru was left in the east capital as Zuopushe.',
    idiomatic: 'In Wuyin, Niu Sengru was left in the east capital as Zuopushe (condensed).',
  },
  s1664: {
    literal: 'Xin Si, the crown prince was ordered to attend Dou Zongzhi to enter Shaoyang courtyard the next day.',
    idiomatic: 'Xin Si, the crown prince was ordered to attend Dou Zongzhi to enter Shaoyang courtyard the next day (condensed).',
  },
  s1665: {
    literal: 'On the first day of the 10th month of winter, Cui Guan, the Minister of the Ministry of Finance, inspected and revised the Minister of the Ministry of Finance, and Chongdongdu stayed behind.',
    idiomatic: 'On the first day of the 10th month of winter, Cui Guan, the Minister of the Ministry of Finance, inspected and revised the Minister of the Ministry of Finance, and Chongdongdu stayed behind (condensed).',
  },
  s1666: {
    literal: 'When Yi Ding\'s army was in chaos, the new envoy Li Zhongqian was not accepted, and Zhang Fan\'s son Yuan Yi was appointed as the remaining queen.',
    idiomatic: 'When Yi Ding\'s army was in chaos, the new envoy Li Zhongqian was not accepted, and Zhang Fan\'s son Yuan Yi was appointed as the remaining queen (condensed).',
  },
  s1667: {
    literal: 'Ji Chou appointed Shaofu prisoner Zhang Bo as the observation envoy in central Guizhou.',
    idiomatic: 'Ji Chou appointed Shaofu prisoner Zhang Bo as the observation envoy in central Guizhou (condensed).',
  },
  s1668: {
    literal: 'In Renchen, General Gao Xiayu of Jinwu Guard on the right was appointed as the envoy of Xia, Sui, Yin and You.',
    idiomatic: 'In Renchen, General Gao Xiayu of Jinwu Guard on the right was appointed as the envoy of Xia, Sui, Yin and You (condensed).',
  },
  s1669: {
    literal: 'In Guisi, Li Jingrang, a native of Zhongshushe, was appointed as the defense envoy of Huazhou.',
    idiomatic: 'In Guisi, Li Jingrang, a native of Zhongshushe, was appointed as the defense envoy of Huazhou (condensed).',
  },
  s1670: {
    literal: 'On the day of Jiawu, celebrating the festival, the ministers were given a banquet in Qujiang Pavilion with wine and \'Xianshao Music\'.',
    idiomatic: 'On the day of Jiawu, celebrating the festival, the ministers were given a banquet in Qujiang Pavilion with wine and \'Xianshao Music\' (condensed).',
  },
  s1671: {
    literal: 'Ding You, Xiazhou Jiedu envoy Liu Yuan died.',
    idiomatic: 'Ding You, Xiazhou Jiedu envoy Liu Yuan died (condensed).',
  },
  s1672: {
    literal: 'Gengzi, the crown prince died in Shaoyangyuan, and his posthumous name was Zhuang Ke.',
    idiomatic: 'Gengzi, the crown prince died in Shaoyangyuan, and his posthumous name was Zhuang Ke (condensed).',
  },
  s1673: {
    literal: 'At Yisi, General Guo Min of Zuo Jinwu was appointed as the envoy of Pi, Ning and Qing.',
    idiomatic: 'At Yisi, General Guo Min of Zuo Jinwu was appointed as the envoy of Pi, Ning and Qing (condensed).',
  },
  s1674: {
    literal: 'That night, a comet arose from Zhen. It was three feet long and pointed east and west.',
    idiomatic: 'That night, a comet arose from Zhen.',
  },
  s1675: {
    literal: 'Yiyou, Shi Xiaozhang, the former military governor of Xingning, died.',
    idiomatic: 'Yiyou, Shi Xiaozhang, the former military governor of Xingning, died (condensed).',
  },
  s1676: {
    literal: 'It\'s the first day of the eleventh month, the first day of the lunar month, and Huibo\'s east and west are in the sky.',
    idiomatic: 'It\'s the first day of the eleventh month, the first day of the lunar month, and Huibo\'s east and west are in the sky (condensed).',
  },
  s1677: {
    literal: 'In Renxu, the edict said: \'The sky is so high that the response must come from human affairs;',
    idiomatic: 'In Renxu, the edict said: \'The sky is so high that the response must come from human affairs; — noted.',
  },
  s1678: {
    literal: 'Although the world is vast, all chaos is tied to your heart.',
    idiomatic: 'Although the world is vast, all chaos is tied to your heart (condensed).',
  },
  s1679: {
    literal: 'It has been an inevitable meaning since ancient times.',
    idiomatic: 'It has been an inevitable meaning since ancient times (condensed).',
  },
  s1680: {
    literal: 'I have been the heir to the throne for ten or three years. I have always restrained myself and been respectful and pious, and I have always shown sincerity to the people.',
    idiomatic: 'I have been the heir to the throne for ten or three years.',
  },
  s1681: {
    literal: 'We will guide you to welcome Xiu Ying, and gradually lead to Xixi. In the future, you will be able to control the burden of Zongzu, and think of Bao Ning in China.',
    idiomatic: 'We will guide you to welcome Xiu Ying, and gradually lead to Xixi.',
  },
  s1682: {
    literal: 'However, virtue has not yet been achieved, and faith has not yet been developed.',
    idiomatic: 'However, virtue has not yet been achieved, and faith has not yet been developed (condensed).',
  },
  s1683: {
    literal: 'Disasters are rising, astronomy is banished, the moon is cycled again, and the stars are disturbed again.',
    idiomatic: 'Disasters are rising, astronomy is banished, the moon is cycled again, and the stars are disturbed again (condensed).',
  },
  s1684: {
    literal: 'When I was asking for clothes, I saw the change of the hanging elephant, and I became frightened and vigilant, just like walking in the valley of springs.',
    idiomatic: 'When I was asking for clothes, I saw the change of the hanging elephant, and I became frightened and vigilant, just like walking in the valley of springs (condensed).',
  },
  s1685: {
    literal: 'This is to use the six things that make the soup, recite one of Song Jing\'s words, ask for the details of the reprimand, and listen to the art of killing.',
    idiomatic: 'This is to use the six things that make the soup, recite one of Song Jing\'s words, ask for the details of the reprimand, and listen to the art of killing (condensed).',
  },
  s1686: {
    literal: 'There must be fine principles, which are rooted in the emotions of the people, hoping to bend the law to bring peace to people, and be willing to forgive the punishment.',
    idiomatic: 'There must be fine principles, which are rooted in the emotions of the people, hoping to bend the law to bring peace to people, and be willing to forgive the punishment (condensed).',
  },
  s1687: {
    literal: 'The people in the capital saw that he was imprisoned. Since December 8th, the death penalty has been reduced by one level, except for the ten evils, murder, robbery, and official crimes.',
    idiomatic: 'The people in the capital saw that he was imprisoned.',
  },
  s1688: {
    literal: 'This year we will be attacked by water locusts, so we should save money to provide relief.',
    idiomatic: 'This year we will be attacked by water locusts, so we should save money to provide relief (condensed).',
  },
  s1689: {
    literal: '\'Li Yanzuo, the military envoy of Cangzhou, was appointed as the military envoy of Yun, Cao and Pu, and Liu Yue, the governor of Dezhou and deputy envoy of Cangjing Military Region, was appointed as the military envoy of Yichang Army.',
    idiomatic: '\'Li Yanzuo, the military envoy of Cangzhou, was appointed as the military envoy of Yun, Cao and Pu, and Liu Yue, the governor of Dezhou and deputy envoy of Cangjing Military Region, was appointed as the military envoy of Yichang Army (condensed).',
  },
  s1690: {
    literal: 'In Guihai, Tang Hongshi, the governor of Songzhou, was appointed as the envoy of Yongguan administration.',
    idiomatic: 'In Guihai, Tang Hongshi, the governor of Songzhou, was appointed as the envoy of Yongguan administration (condensed).',
  },
  s1691: {
    literal: 'In Yichou, Wang Yuan, the commander of the Tianping Army, was killed.',
    idiomatic: 'In Yichou, Wang Yuan, the commander of the Tianping Army, was killed (condensed).',
  },
  s1692: {
    literal: 'In Gengwu, Ding Juhui, a Hanlin scholar, was appointed as the censor Zhongcheng.',
    idiomatic: 'In Gengwu, Ding Juhui, a Hanlin scholar, was appointed as the censor Zhongcheng (condensed).',
  },
  s1693: {
    literal: 'In Renshen, Han Wei, the governor of Caizhou, was appointed as the governor of Dingzhou, Jiedu of the Yiwu Army, and the Peking Army.',
    idiomatic: 'In Renshen, Han Wei, the governor of Caizhou, was appointed as the governor of Dingzhou, Jiedu of the Yiwu Army, and the Peking Army (condensed).',
  },
  s1694: {
    literal: 'December Yiyoushuo.',
    idiomatic: 'December Yiyoushuo (condensed).',
  },
  s1695: {
    literal: 'Xin Chou ordered the governor of Hedong, Kaifu Yitong and the three divisions, Situ and Zhongshu Ling, Taiyuan Yin, Bei Du to stay, Shangzhu State, Jin Guogong, and three thousand households in the city, Pei Duke to guard Situ and Zhongshu Ling.',
    idiomatic: 'Xin Chou ordered the governor of Hedong, Kaifu Yitong and the three divisions, Situ and Zhongshu Ling, Taiyuan Yin, Bei Du to stay, Shangzhu State, Jin Guogong, and three thousand households in the city, Pei Duke to guard Situ and Zhongshu Ling (condensed).',
  },
  s1696: {
    literal: 'Di Jianmo, the minister of the Ministry of War, was appointed as the governor of Hedong.',
    idiomatic: 'Di Jianmo, the minister of the Ministry of War, was appointed as the governor of Hedong (condensed).',
  },
  s1697: {
    literal: 'On Bingwu, the crown prince and grand master were guarded, Shangshu Youpushe, the servant under the door, the prince of the state offered wine, and Tongping Zhangshi Zheng Tan dismissed the crown prince and grand master, and still entered Zhongshu on the 35th.',
    idiomatic: 'On Bingwu, the crown prince and grand master were guarded, Shangshu Youpushe, the servant under the door, the prince of the state offered wine, and Tongping Zhangshi Zheng Tan dismissed the crown prince and grand master, and still entered Zhongshu on the 35th (condensed).',
  },
  s1698: {
    literal: 'Japanese national tribute pearl silk.',
    idiomatic: 'Japanese national tribute pearl silk (condensed).',
  },
  s1699: {
    literal: 'It was the first month of the first month of the fourth year of Kaicheng (Jiayinshuo).',
    idiomatic: 'It was the first month of the first month of the fourth year of Kaicheng (Jiayinshuo) (condensed).',
  },
  s1700: {
    literal: 'Ding Si, Yinghuo Taibaichen gathered in Nandou.',
    idiomatic: 'Ding Si, Yinghuo Taibaichen gathered in Nandou (condensed).',
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
