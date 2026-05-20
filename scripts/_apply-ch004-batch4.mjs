#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.004, Gaozong 1 — Longshuo 1–3, Linde 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/004.json';
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
    literal: 'On jimao of the twelfth month he returned from Xuzhou.',
    idiomatic: 'On jimao of the twelfth month he came back from Xuzhou.',
  },
  s0302: {
    literal:
      'In the first year of Longshuo, spring, first month, on yimao, from sixty-seven prefectures in Henan, Hebei, and Huainan forty-four thousand six hundred forty-six men were recruited and sent to the campaigning headquarters on the Pyongyang-Taebong circuit.',
    idiomatic:
      'In Longshuo 1, on yimao of the first spring month, forty-four thousand six hundred forty-six men levied from sixty-seven prefectures across Henan, Hebei, and Huainan were marched to the Pyongyang-Taebong field headquarters.',
  },
  s0303: {
    literal:
      'On yiwei of the second month, because the prefectures of Yi, Mian, and others all reported dragons seen, the reign title was changed.',
    idiomatic:
      'On yiwei in the second month, after Yi, Mian, and other prefectures all reported dragon sightings, he changed the reign title.',
  },
  s0304: {
    literal: 'A selective amnesty was proclaimed for Luozhou.',
    idiomatic: 'He issued a partial amnesty for Luozhou.',
  },
  s0305: {
    literal:
      'On the new moon, bingshen, of the third month of the first year of Longshuo, the reign title was changed again.',
    idiomatic:
      'On bingshen, the new moon of the third month in Longshuo 1, the era name was changed once more.',
  },
  s0306: {
    literal: 'On renxu he proceeded to Hebi Palace.',
    idiomatic: 'On renxu he went to Hebi Palace.',
  },
  s0307: {
    literal:
      'On bingshen of the fifth summer month, Qibi Heli, Great General of the Left Martial Guards and Duke of Liang, was made Grand Commander of the Liaodong Circuit; Su Dingfang, Great General of the Left Martial Guards and Duke of Xing, was made Grand Commander of the Pyongyang Circuit; Ren Yaxiang, Minister of War, Same Rank as the Three Departments of the Secretariat-Chancellery, and Duke of Le\'an, was made Grand Commander of the Peijiang Circuit—all to attack Goguryeo.',
    idiomatic:
      'On bingshen in the fifth summer month Qibi Heli, great general of the left martial guards and Duke of Liang, was named grand commander on the Liaodong front; Su Dingfang, great general of the left martial guards and Duke of Xing, grand commander on the Pyongyang front; and Ren Yaxiang, minister of war with a seat in confidential counsel and Duke of Le\'an, grand commander on the Peijiang front—to strike Goguryeo.',
  },
  s0308: {
    literal:
      'That same day the empress requested that women throughout the realm be forbidden to perform as entertainers; an edict approved it.',
    idiomatic:
      'That day the empress asked that women everywhere be barred from staging comic performances; the emperor assented.',
  },
  s0309: {
    literal: 'On jiazi, the last day of the month, there was a solar eclipse.',
    idiomatic: 'On jiazi, the month\'s last day, the sun was eclipsed.',
  },
  s0310: {
    literal:
      'On gengyin of the sixth month, Palace Attendant Xu Jingzong and others presented Accumulated Jade Walls in six hundred thirty volumes and a catalogue in four volumes.',
    idiomatic:
      'On gengyin of the sixth month Xu Jingzong, palace attendant, and others presented the Accumulated Jade Walls—six hundred thirty juan with a four-juan catalogue.',
  },
  s0311: {
    literal:
      'In the seventh autumn month, on guimao, the imperial carriage returned to the Eastern Capital.',
    idiomatic: 'On guimao in the seventh autumn month the court returned to the eastern capital.',
  },
  s0312: {
    literal:
      'On bingxu of the eighth month, an order was issued for all prefectures to recommend those of outstanding filial conduct and households of righteousness through successive generations who could encourage custom.',
    idiomatic:
      'On bingxu of the eighth month he commanded every prefecture to commend men of exceptional filial piety and clans that had lived in mutual righteousness for generations, as models for the people.',
  },
  s0313: {
    literal:
      'On jiachen of the ninth month, because the elderly woman Zhang of Henan county was one hundred three years old, he personally visited her dwelling.',
    idiomatic:
      'On jiachen of the ninth month, learning that Zhang, an elder of Henan county, was one hundred three, he visited her home in person.',
  },
  s0314: {
    literal: 'He also visited the residence of Li Ji.',
    idiomatic: 'He also called at the house of Li Ji.',
  },
  s0315: {
    literal:
      'Heavenly Palace Monastery had been Gaozu\'s old residence in his days before the throne; the emperor went up and walked through the halls, was moved to grief for a long while, and ordained twenty monks.',
    idiomatic:
      'Heavenly Palace Monastery had been the Gaozu emperor\'s dwelling before he took the dragon seat; the emperor climbed through its halls, lingered long in sorrow, and inducted twenty monks.',
  },
  s0316: {
    literal: 'The empress went to the residence of Xu Yanshi.',
    idiomatic: 'The empress called on Xu Yanshi at his home.',
  },
  s0317: {
    literal: 'On renzi Prince of Lu Xian was transferred and enfeoffed as Prince of Pei.',
    idiomatic: 'On renzi Prince of Lu Li Xian was re-enfeoffed as Prince of Pei.',
  },
  s0318: {
    literal:
      'That same day Prince of Pei Xian, Governor of Yongzhou and military governor of Youzhou, was made military governor of Yangzhou and Great General of the Left Martial Guards, retaining his governorship.',
    idiomatic:
      'That day Prince of Pei Li Xian, who was governor of Yongzhou and military governor of Youzhou, was also appointed military governor of Yangzhou and great general of the left martial guards, keeping his governorship.',
  },
  s0319: {
    literal: 'Prince of Zhou Xian, Governor of Luozhou, was made military governor of Bingzhou.',
    idiomatic: 'Prince of Zhou Li Xian, governor of Luozhou, was made military governor of Bingzhou.',
  },
  s0320: {
    literal:
      'That same day an edict ordered all officials of the fifth rank and above in the Secretariat-Chancellery, heads of various offices, vice-directors of the Ministry of Civil Office, and all kin of the third degree of mourning and above to proceed to the Prince of Pei\'s residence to set out a banquet, and the Nine Section Music was performed.',
    idiomatic:
      'That day he ordered fifth-rank Secretariat-Chancellery officials and above, department chiefs, vice ministers of the civil office, and all relatives within three degrees of mourning to attend a feast at Prince Pei\'s mansion while the Nine Court Suites were played.',
  },
  s0321: {
    literal: 'When the ceremony ended, graded gifts of silks and brocades were bestowed.',
    idiomatic: 'When the rites were finished he gave graded gifts of silks and patterned cloths.',
  },
  s0322: {
    literal: 'In the tenth winter month, on dingmao, he hunted at Luhun.',
    idiomatic: 'On dingmao of the tenth winter month he hunted at Luhun.',
  },
  s0323: {
    literal: 'On guiyou he returned to the palace.',
    idiomatic: 'On guiyou he came back to the palace.',
  },
  s0324: {
    literal: 'That year King Kim Chunchu of Silla died; his son Beopmin succeeded him.',
    idiomatic: 'That year King Kim Chunchu of Silla died and his son Beopmin took the throne.',
  },
  s0325: {
    literal:
      'In the second year of Longshuo, spring, first month, on yisi, the Court of the Treasury was given one additional vice director to divide inspection between the two capitals.',
    idiomatic:
      'In Longshuo 2, on yisi of the first spring month, the Court of the Treasury gained a new vice director to oversee both capitals.',
  },
  s0326: {
    literal:
      'On bingwu the Directorate of Education was first established in the Eastern Capital; student posts and the like were increased and evenly divided between the two capitals for instruction.',
    idiomatic:
      'On bingwu the eastern capital first gained an imperial academy, with added student quotas split between both capitals for teaching.',
  },
  s0327: {
    literal:
      'On jiazi of the second month, the names of offices in the capital and of hundred officials were changed: the Ministry of Civil Office became the Central Terrace, the Chancellery the Eastern Terrace, the Secretariat the Western Terrace, left and right vice premiers became left and right Rectifiers of Government, left and right vice directors became Masters of Protocol, Palace Attendants became left chancellors, Secretariat Directors became right chancellors, and the rest were altered according to analogous meanings.',
    idiomatic:
      'On jiazi in the second month he renamed capital agencies and official titles: the Ministry of Civil Office became the Central Terrace, the Chancellery the Eastern Terrace, the Secretariat the Western Terrace; vice premiers became “rectifiers of government,” vice directors “masters of protocol,” palace attendants “left chancellors,” and secretariat directors “right chancellors”; every other office took a new name along the same lines.',
  },
  s0328: {
    literal: 'The titles of the Six Palaces\' inner offices were also changed.',
    idiomatic: 'He also renamed posts within the Six Palaces.',
  },
  s0329: {
    literal:
      'On jiaxu Ren Yaxiang, Minister of Rites for Military Affairs on the Peijiang Circuit, Duke of Le\'an, died in the army.',
    idiomatic:
      'On jiaxu Ren Yaxiang, circuit commander on the Peijiang front and Duke of Le\'an, died in camp.',
  },
  s0330: {
    literal: 'On jiashen of the third month he returned from the Eastern Capital to the capital.',
    idiomatic: 'On jiashen of the third month he came back to Chang\'an from the eastern capital.',
  },
  s0331: {
    literal: 'On guichou he proceeded to Tongzhou.',
    idiomatic: 'On guichou he went to Tongzhou.',
  },
  s0332: {
    literal:
      'Su Dingfang defeated Goguryeo at Reed Island, then advanced to attack Pyongyang but could not take it and withdrew.',
    idiomatic:
      'Su Dingfang routed the Koreans at Reed Island, then besieged Pyongyang, failed to capture it, and withdrew.',
  },
  s0333: {
    literal: 'On the new moon, gengshen, of the fourth summer month, he arrived from the Eastern Capital.',
    idiomatic: 'On gengshen, the new moon of the fourth summer month, he returned from the eastern capital.',
  },
  s0334: {
    literal: 'On xinsi Penglai Palace, newly built, was completed and he moved his residence there.',
    idiomatic: 'On xinsi the new Penglai Palace was finished and he took up residence there.',
  },
  s0335: {
    literal: 'On bingshen Xu Yanshi, Left Remonstrator, was made Left Chancellor.',
    idiomatic: 'On bingshen Xu Yanshi, left remonstrator, became left chancellor.',
  },
  s0336: {
    literal: 'On yisi the three schools of law, writing, and reckoning were re-established.',
    idiomatic: 'On yisi he restored the schools of law, calligraphy, and arithmetic.',
  },
  s0337: {
    literal: 'On the new moon, jiwei, of the sixth month, the prince Xulun was born.',
    idiomatic: 'On jiwei, the new moon of the sixth month, Prince Xulun was born.',
  },
  s0338: {
    literal:
      'On yichou, for the first time, Daoist priests, female Daoists, monks, and nuns were all ordered to perform full rites and bow to their parents.',
    idiomatic:
      'On yichou he first commanded Daoist priests and nuns and Buddhist monks and nuns to observe full filial obeisance to their parents.',
  },
  s0339: {
    literal:
      'On yihai the names of gates, halls, and pavilions in Penglai Palace were fixed by regulation.',
    idiomatic: 'On yihai he set the names of Penglai Palace\'s gates, halls, and pavilions.',
  },
  s0340: {
    literal:
      'On the new moon, dinghai, of the seventh autumn month, because the Eastern Palace had reached a full month since the birth, a general amnesty was proclaimed and feasting granted for three days.',
    idiomatic:
      'On dinghai, the new moon of the seventh autumn month, he marked the crown prince\'s child reaching one month with a general amnesty and three days of public feasting.',
  },
  s0341: {
    literal: 'On jiawu Right Chancellor Xu Jingzong requested retirement.',
    idiomatic: 'On jiawu Xu Jingzong, right chancellor, asked to retire.',
  },
  s0342: {
    literal:
      'On renyin Xu Jingzong was made Junior Tutor to the Crown Prince, Same Rank as the Three Offices of the Eastern and Western Terraces, and still managed Western Terrace affairs.',
    idiomatic:
      'On renyin Xu Jingzong became junior tutor to the crown prince with third rank at both terraces and kept charge of the western secretariat.',
  },
  s0343: {
    literal:
      'On autumn, ninth month, Sun Maodao, Vice Minister of Rites, memorialized: "For ranks eight and nine the old statute prescribed green, which mingles with purple—not fit for the humblest grades; I ask that they wear blue."',
    idiomatic:
      'In the ninth month Sun Maodao, vice minister of rites, wrote: "Ranks eight and nine were once clad in green, which clashes with purple and does not suit the lowest offices; let them wear blue instead."',
  },
  s0344: {
    literal: 'An edict approved it.',
    idiomatic: 'The emperor assented.',
  },
  s0345: {
    literal:
      'On wuyin Li Yifu, former Minister of Civil Appointments and Duke of Hejian, left mourning and resumed office as Minister of Personnel, Same Rank as the Three Offices of the Eastern and Western Terraces.',
    idiomatic:
      'On wuyin Li Yifu, former minister of civil appointments and Duke of Hejian, left mourning and returned as minister of personnel with third rank at both terraces.',
  },
  s0346: {
    literal:
      'On tenth winter month dingyou he proceeded to the hot springs; Crown Prince Hong acted as regent.',
    idiomatic:
      'On dingyou of the tenth winter month he went to the hot springs while Crown Prince Hong governed the realm.',
  },
  s0347: {
    literal: 'On dingwei he returned from the hot springs.',
    idiomatic: 'On dingwei he came back from the hot springs.',
  },
  s0348: {
    literal:
      'On gengxu Shangguan Yi, Vice Director of the Western Terrace, was made Second Rank at the Eastern and Western Terraces.',
    idiomatic:
      'On gengxu Shangguan Yi, vice director of the western secretariat, was raised to second rank at both terraces.',
  },
  s0349: {
    literal: 'In the eleventh month, on xinwei, Left Chancellor Xu Yanshi was imprisoned.',
    idiomatic: 'On xinwei of the eleventh month Left Chancellor Xu Yanshi was thrown into prison.',
  },
  s0350: {
    literal: 'On guiyou the emperor\'s fourth son Xulun was enfeoffed as Prince of Yin.',
    idiomatic: 'On guiyou the fourth son Xulun was made Prince of Yin.',
  },
  s0351: {
    literal:
      'On xinchou of the twelfth month, Weizhou was changed to the metropolitan area command of Jizhou, and Jizhou was changed to Weizhou.',
    idiomatic:
      'On xinchou of the twelfth month he swapped names: Weizhou became the Jizhou metropolitan command and Jizhou became Weizhou.',
  },
  s0352: {
    literal:
      'The four area commands of Bing, Yang, Jing, and Yi were likewise all made metropolitan area commands.',
    idiomatic:
      'The area commands of Bing, Yang, Jing, and Yi were all elevated to metropolitan commands as well.',
  },
  s0353: {
    literal:
      'Prince of Pei Xian was made metropolitan military governor of Yangzhou; Prince of Zhou Xian of Bingzhou; Prince of Yin Xulun held titular command of the Jizhou metropolitan area.',
    idiomatic:
      'Prince Pei was named metropolitan governor of Yangzhou, Prince Zhou of Bingzhou, and Prince Yin Xulun titular metropolitan governor of Jizhou.',
  },
  s0354: {
    literal: 'Left Chancellor Xu Yanshi was dismissed from his current post.',
    idiomatic: 'Left Chancellor Xu Yanshi was relieved of office.',
  },
  s0355: {
    literal:
      'In the third year of Longshuo, spring, first month, Zheng Rentai, Great General of the Left Martial Guards, and others led troops to subdue the remnant Tiele tribes and pacified them all.',
    idiomatic:
      'In Longshuo 3, in the first spring month, Zheng Rentai, great general of the left martial guards, and others marched against the remaining Tiele and subjugated them completely.',
  },
  s0356: {
    literal: 'On yichou Li Yifu, Minister of Personnel, was made Right Chancellor.',
    idiomatic: 'On yichou Li Yifu, minister of personnel, became right chancellor.',
  },
  s0357: {
    literal:
      'On bingxu household registers of fifteen prefectures including Long, Yong, Tong, and Qi were levied for labor to repair Penglai Palace.',
    idiomatic:
      'On bingxu labor was levied from fifteen prefectures—Long, Yong, Tong, Qi, and others—to repair Penglai Palace.',
  },
  s0358: {
    literal:
      'On guisi the crown prince\'s left and right moral advisers and Gui-Fang grandees and other posts were established; the Bureau of Classics was changed to the Gui-Fang Institute, and the Hall of Honored Worthies ceased to be subordinate to the Left Spring Palace.',
    idiomatic:
      'On guisi he created the crown prince\'s moral advisers and Gui-Fang directors, renamed the classics bureau the Gui-Fang Institute, and detached the Hall of Honored Worthies from the left spring palace.',
  },
  s0359: {
    literal:
      'On dingyou capital officials\' salaries for one month were reduced to assist in repairing Penglai Palace.',
    idiomatic: 'On dingyou he docked one month\'s pay from capital officials to fund Penglai Palace repairs.',
  },
  s0360: {
    literal:
      'On gengxu an edict said: "Heaven\'s virtue brings forth life; the yang harmony rests in the season. My thoughts turn to the dark prisons and sorrow cuts the night in two.',
    idiomatic:
      'On gengxu he decreed: "Heaven\'s virtue quickens life; yang warmth returns to its season. When I think of the jails my heart aches through the watches of the night.',
  },
  s0361: {
    literal: 'Though there is pity time and again, I still fear that injustice has not been avoided.',
    idiomatic: 'Though we often show mercy, I fear the innocent still suffer.',
  },
  s0362: {
    literal: 'Capital prisoners liable to death or exile shall be brought forward twenty each day.',
    idiomatic: 'Let twenty condemned or exiled prisoners in the capital be brought before me each day.',
  },
  s0363: {
    literal:
      '" Thereupon he personally examined them; many were pardoned, and those not completed were ordered recorded by the crown prince.',
    idiomatic:
      'He then questioned them himself, pardoned many, and had the crown prince review those not yet decided.',
  },
  s0364: {
    literal:
      'An edict placed the school of writing under the Orchid Terrace, the school of reckoning under the Secretariat Library, and the school of law under the Court of Detailed Punishments.',
    idiomatic:
      'He ordered the calligraphy school placed under the Orchid Terrace, the arithmetic school under the imperial library, and the law school under the court of detailed punishments.',
  },
  s0365: {
    literal:
      'The Yanran Protectorate was changed to the Hanhai Protectorate, and the Hanhai Protectorate to the Yunzhong Protectorate.',
    idiomatic: 'The Yanran protectorate became Hanhai, and Hanhai became Yunzhong.',
  },
  s0366: {
    literal: 'In the second month, former Left Chancellor Xu Yanshi was demoted to prefect of Qianzhou.',
    idiomatic: 'In the second month former left chancellor Xu Yanshi was demoted to prefect of Qianzhou.',
  },
  s0367: {
    literal:
      'Crown Prince Hong completed composition of Jade Splendor of Mount Yao; the work totaled five hundred volumes.',
    idiomatic: 'Crown Prince Hong finished the Jade Splendor of Mount Yao—five hundred juan in all.',
  },
  s0368: {
    literal: 'On yichou of the fourth summer month, Right Chancellor Li Yifu was imprisoned.',
    idiomatic: 'On yichou of the fourth summer month right chancellor Li Yifu was thrown into prison.',
  },
  s0369: {
    literal: 'On wuzi Li Yifu was struck from the rolls and exiled to Xizhou.',
    idiomatic: 'On wuzi Li Yifu was expelled from office and banished to Xizhou.',
  },
  s0370: {
    literal: 'On bingwu he proceeded to the newly built Hanyuan Hall in Penglai Palace.',
    idiomatic: 'On bingwu he went to the new Hanyuan Hall at Penglai Palace.',
  },
  s0371: {
    literal: 'On guimao of the eighth autumn month a comet appeared at Left Sheti.',
    idiomatic: 'On guimao in the eighth autumn month a comet appeared at Left Sheti.',
  },
  s0372: {
    literal: 'On wushen an edict ordered the hundred officials to speak remonstrance to the utmost.',
    idiomatic: 'On wushen he commanded officials to speak plain counsel without reserve.',
  },
  s0373: {
    literal:
      'Dou Dexuan, Minister of Revenue, Liu Xiangdao, Minister of Justice, and nine others were appointed Credentialled Envoys to tour the realm in separate circuits.',
    idiomatic:
      'He named nine credentialled envoys—including Dou Dexuan, minister of revenue, and Liu Xiangdao, minister of justice—to tour the empire in separate circuits.',
  },
  s0374: {
    literal:
      'Officials within and without the court of the fifth rank and above were further ordered each to recommend those they knew.',
    idiomatic:
      'He also ordered every official inside and outside the court of fifth rank and above to recommend men they knew.',
  },
  s0375: {
    literal: 'On bingshen of the tenth winter month a qilin appeared at Jieshan in Jiangzhou.',
    idiomatic: 'On bingshen of the tenth winter month a qilin was seen on Jieshan in Jiangzhou.',
  },
  s0376: {
    literal: 'On bingwu a qilin\'s hoofprint appeared before Hanyuan Hall.',
    idiomatic: 'On bingwu a qilin hoofprint appeared before Hanyuan Hall.',
  },
  s0377: {
    literal: 'On guiyou of the eleventh month there was freezing rain.',
    idiomatic: 'On guiyou of the eleventh month freezing rain fell.',
  },
  s0378: {
    literal:
      'On gengzi of the twelfth month an edict changed the first day of the first month of the coming year to the first year of Linde.',
    idiomatic: 'On gengzi of the twelfth month he decreed that the new year would open as Linde 1.',
  },
  s0379: {
    literal:
      'In the first year of Linde, spring, first month, on jiazi, the Yunzhong Protectorate was changed to the Chanyu Metropolitan Command, its official grades the same as a metropolitan area command.',
    idiomatic:
      'In Linde 1, on jiazi of the first spring month, the Yunzhong protectorate became the Chanyu metropolitan command with the same rank as other metropolitan commands.',
  },
  s0380: {
    literal: 'On dinghai Prince of Yin Xulun was additionally appointed Chanyu Metropolitan Commander.',
    idiomatic: 'On dinghai Prince Yin Xulun was also named Chanyu metropolitan commander.',
  },
  s0381: {
    literal: 'On wuzi he proceeded to Wannian Palace.',
    idiomatic: 'On wuzi he went to Wannian Palace.',
  },
  s0382: {
    literal: 'On xinhai the great archery ceremony was extended.',
    idiomatic: 'On xinhai he expanded the great archery rites.',
  },
  s0383: {
    literal:
      'On dingmao the eldest daughter was posthumously enfeoffed as Princess of Anding, posthumous name Si, and her guard of honor, musicians, and funeral provisions were all as for a full prince; she was moved from Deyie Monastery to Chongjing Monastery.',
    idiomatic:
      'On dingmao his eldest daughter was posthumously made Princess of Anding, titled Si, with princely funeral honors and escort; her remains were moved from Deyie Monastery to Chongjing Monastery.',
  },
  s0384: {
    literal: 'In the fourth summer month, Prince of Dao Yuan Qing, military governor of Weizhou, died.',
    idiomatic: 'In the fourth summer month Prince of Dao Yuan Qing, governor of Weizhou, died.',
  },
  s0385: {
    literal: 'In the fifth month Prince of Xu Xiao died.',
    idiomatic: 'In the fifth month Prince Xu Xiao died.',
  },
  s0386: {
    literal: 'On yimao the Yaozhou Metropolitan Command was established at Nongdongchuan on Kunming Lake.',
    idiomatic: 'On yimao he set up the Yaozhou metropolitan command at Nongdongchuan on Kunming Lake.',
  },
  s0387: {
    literal:
      'On the new moon, bingzi, of the eighth autumn month, he returned from Wannian Palace and at once visited his old residence.',
    idiomatic:
      'On bingzi, the new moon of the eighth autumn month, he came back from Wannian Palace and went straight to his former home.',
  },
  s0388: {
    literal:
      'On jimao prisoners of Wannian county were pardoned, and he then visited Great Kindness and Grace Monastery.',
    idiomatic:
      'On jimao he pardoned Wannian county prisoners and visited Great Kindness and Grace Monastery.',
  },
  s0389: {
    literal: 'On renwu he returned to Penglai Palace.',
    idiomatic: 'On renwu he went back to Penglai Palace.',
  },
  s0390: {
    literal:
      'On wuzi Liu Xiangdao, Concurrent Minister of Personnel and Inspector of the Prince of Pei\'s Household, Marquis of Chengyang, was made Concurrent Right Chancellor; Dou Dexuan, Grand Censor, was made Concurrent Minister of Revenue and Inspector of the Left Chancellor\'s Office.',
    idiomatic:
      'On wuzi Liu Xiangdao, marquis of Chengyang and inspector of Prince Pei\'s household, also became right chancellor; Dou Dexuan, grand censor, also became minister of revenue and inspector of the left chancellor\'s office.',
  },
  s0391: {
    literal:
      'On jimao an edict said: "Yuwen Xiaobo of the Zhou, Metropolitan Governor of Jingzhao, General of the Left and Right Palace Guards, General-in-Chief of the Guards, Junior Minister of the Royal Tombs, and Duke of Guangling, kept loyalty in his heart and integrity in his bearing.',
    idiomatic:
      'On jimao he decreed: "Yuwen Xiaobo of Zhou—governor of Jingzhao, general of the palace guards, commander of the guards, junior tomb minister, and Duke of Guangling—was loyal in heart and upright in conduct.',
  },
  s0392: {
    literal: 'When cruel punishments were let loose he still sought remonstrance and pursued humanity;',
    idiomatic: 'When torture ran wild he still remonstrated and sought humanity;',
  },
  s0393: {
    literal: 'when jealous harm was about to fall he willingly gave his body to preserve his integrity.',
    idiomatic: 'when malice was aimed at him he gladly gave his life for his duty.',
  },
  s0394: {
    literal:
      'Though years have passed, his fierce honor still lives; he should receive a lofty mark of distinction to glorify his descendants.',
    idiomatic:
      'Years have passed, yet his fierce honor endures; let a lofty mark of distinction glorify his line.',
  },
  s0395: {
    literal:
      'His grandson Sichun, Chief of the Left Majestic Guard, may be additionally granted Gentleman for Dispersed Service.',
    idiomatic:
      'His grandson Sichun, chief of the left majestic guard, shall be further granted Gentleman for Dispersed Service.',
  },
  s0396: {
    literal: 'Thus ended the edict.',
    idiomatic: 'With that the edict closed.',
  },
  s0397: {
    literal: 'On bingxu Shangguan Yi, Vice Director of the Western Terrace, was executed.',
    idiomatic: 'On bingxu Shangguan Yi, vice director of the western secretariat, was put to death.',
  },
  s0398: {
    literal: 'On wuzi the deposed heir Chen, convicted of communicating with Yi, was granted death.',
    idiomatic: 'On wuzi the deposed heir Chen, found in contact with Yi, was granted death.',
  },
  s0399: {
    literal: 'Liu Xiangdao, Right Chancellor and Marquis of Chengyang, was made Minister of Rites.',
    idiomatic: 'Liu Xiangdao, right chancellor and marquis of Chengyang, became minister of rites.',
  },
  s0400: {
    literal:
      'Yue Yanwei, Right Central Guard of the Crown Prince and Inspector of the Western Terrace, and Sun Chuyue, Vice Director of the Western Terrace, were both made to participate in state affairs.',
    idiomatic:
      'Yue Yanwei, crown prince\'s right central guard and inspector of the western secretariat, and Sun Chuyue, vice director of the western secretariat, were both given seats in confidential counsel.',
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
console.log('Applied', applied, 'translations (s0301–s0400) to', transPath);
