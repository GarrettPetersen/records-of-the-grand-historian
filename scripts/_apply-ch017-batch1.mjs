#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
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
    literal: 'Emperor Jingzong, posthumous title Ruiwu Zhaomin Xiaoxiao, taboo name Zhan, was Muzong\'s eldest son; his mother was Empress Dowager Gongyi, née Wang.',
    idiomatic: 'Jingzong—taboo Zhan—was Muzong\'s eldest son, born of Empress Dowager Gongyi Wang.',
  },
  s0002: {
    literal: 'On the seventh day of the sixth month of Yuanhe 4 he was born in a side hall of the inner palace.',
    idiomatic: 'He was born in an inner-palace side hall on the seventh day of Yuanhe 4\'s sixth month.',
  },
  s0003: {
    literal: 'In the third month of Changqing 1 he was enfeoffed as Prince of Jing.',
    idiomatic: 'In Changqing 1\'s third month he became Prince of Jing.',
  },
  s0004: {
    literal: 'In the twelfth month of year 2 he was installed as crown prince.',
    idiomatic: 'In Changqing 2\'s twelfth month he was made heir.',
  },
  s0005: {
    literal: 'In the first month of Changqing 4, on renshen, Muzong died. (The reign year is duplicated in the source.)',
    idiomatic: 'On renshen in Changqing 4\'s first month Muzong died.',
  },
  s0006: {
    literal: 'On guiyou the crown prince took the throne before the coffin; he was sixteen.',
    idiomatic: 'On guiyou the sixteen-year-old heir ascended before the bier.',
  },
  s0007: {
    literal: 'On jiaxu Left Vice Premier Han Gao died.',
    idiomatic: 'On jiaxu Han Gao died.',
  },
  s0008: {
    literal: 'On bingzi, after the ministers had completed the rites of presenting the imperial seal and register according to the testamentary edict, an edict rewarded the Divine Strategy armies with ten bolts of silk and ten thousand cash per man, the capital-area armies and garrisons with ten bolts and five thousand cash, and other commands with graded gifts.',
    idiomatic: 'On bingzi the court finished the succession rites and ordered graded cash-and-silk rewards for the armies.',
  },
  s0009: {
    literal: 'From the inner store three million bolts of damask and silk were issued to help pay the rewards.',
    idiomatic: 'The inner treasury released three million bolts of silk to fund the grants.',
  },
  s0010: {
    literal: 'When Muzong first took the throne, capital soldiers received fifty thousand cash each; outer garrisons received little less.',
    idiomatic: 'At Muzong\'s accession capital troops had received fifty thousand cash each.',
  },
  s0011: {
    literal: 'Now the chief ministers memorialized to scale rewards to state strength, hence the reduction from the prior reign; public opinion approved.',
    idiomatic: 'The premiers now scaled rewards to fiscal capacity, winning public approval.',
  },
  s0012: {
    literal: 'The ministers five times submitted memorials asking him to assume government; he assented.',
    idiomatic: 'After five pleas from the court he agreed to rule in person.',
  },
  s0013: {
    literal: 'Second month, xinsi new moon: in hemp mourning he received the ministers outside Zichen Gate.',
    idiomatic: 'On xinsi he met the court in mourning dress outside Zichen Gate.',
  },
  s0014: {
    literal: 'On renwu Bohai sent fifty men including the palace guard recruit Dacongrui to court.',
    idiomatic: 'On renwu Bohai presented fifty palace guards including Dacongrui.',
  },
  s0015: {
    literal: 'On guiwei Vice Minister of Revenue Li Shen was demoted to Sima of Duanzhou.',
    idiomatic: 'On guiwei Li Shen was banished to Duanzhou.',
  },
  s0016: {
    literal: 'On bingxu Hanlin academician, Bureau of Tributary Vehicles master, edict drafter Pang Yan was demoted to prefect of Xinzhou; Hanlin academician, Bureau of Seals outer section master, edict drafter Jiang Fang to prefect of Tingzhou — all men Li Shen had advanced.',
    idiomatic: 'On bingxu Pang Yan and Jiang Fang, Li Shen\'s protégés, were sent to distant prefectures.',
  },
  s0017: {
    literal: 'Right Reminder Wu Si was made Palace Censor and sent as envoy to announce mourning in the borderlands.',
    idiomatic: 'Wu Si was dispatched to announce the death abroad.',
  },
  s0018: {
    literal: 'When Li Shen was demoted, Li Fengji received congratulations; the officials all came to the Secretariat except Wu Si — Fengji in anger sent him on the distant mission.',
    idiomatic: 'Li Fengji punished Wu Si for refusing to congratulate him on Li Shen\'s fall.',
  },
  s0019: {
    literal: 'On wuzi the Hebei mourning envoy, Remonstrance official Gao Yonggong, died at the eastern capital.',
    idiomatic: 'On wuzi Gao Yonggong died at Luoyang on the Hebei mission.',
  },
  s0020: {
    literal: 'On xinmao an edict: palace women in the Rear Palace and those formerly assigned to the inner gardens were all to be released and allowed to marry as they wished.',
    idiomatic: 'On xinmao thousands of palace women were freed to marry.',
  },
  s0021: {
    literal: 'On jihai the late emperor\'s honored consort was installed as grand empress dowager.',
    idiomatic: 'On jihai Muzong\'s consort became grand empress dowager.',
  },
  s0022: {
    literal: 'On gengzi the Sichuan military commissioner Du Yuanying presented five hundred sets of embroidered polo garments — improper.',
    idiomatic: 'On gengzi Du Yuanying\'s five hundred polo outfits were denounced as improper tribute.',
  },
  s0023: {
    literal: 'On xinchou the Emperor first held court at Zichen Hall.',
    idiomatic: 'On xinchou Jingzong began audiences at Zichen.',
  },
  s0024: {
    literal: 'After retiring he visited Flying Dragon Court and richly rewarded the inner eunuchs in graded amounts.',
    idiomatic: 'That day he lavished gifts on eunuchs at Flying Dragon Court.',
  },
  s0025: {
    literal: 'Because grain was dear, four hundred thousand shi of Ever-Normal granary grain were released to the two markets for cheap sale to aid the poor.',
    idiomatic: 'High grain prices prompted sale of four hundred thousand shi from the Ever-Normal stores.',
  },
  s0026: {
    literal: 'On guiwei night Venus transgressed the northern axle of the Well.',
    idiomatic: 'Venus crossed the Well\'s northern axle that night.',
  },
  s0027: {
    literal: 'On yisi the Emperor led the ministers to Guangshun Gate to install the empress dowager.',
    idiomatic: 'On yisi the court installed the empress dowager at Guangshun Gate.',
  },
  s0028: {
    literal: 'On dingwei he played polo at the Central Harmony Hall and granted the Music Office three thousand five hundred bolts of silk.',
    idiomatic: 'On dingwei polo at Central Harmony Hall brought the musicians three thousand five hundred bolts.',
  },
  s0029: {
    literal: 'On wushen he played polo at Flying Dragon Court.',
    idiomatic: 'On wushen he played polo again at Flying Dragon.',
  },
  s0030: {
    literal: 'On jiyou a great concert was held at Central Harmony Hall; when merriment peaked it ended, and the inner eunuchs received graded gifts.',
    idiomatic: 'On jiyou a riotous concert at Central Harmony ended with eunuch largesse.',
  },
  s0031: {
    literal: 'Third month, gengxu new moon: Vice Minister of Agriculture Li Tong was demoted to Sima of Jizhou — formerly prefect of Dengzhou, he had embezzled a million and even carved his own merit stele.',
    idiomatic: 'On gengxu Li Tong was banished for embezzlement and a self-praise stele.',
  },
  s0032: {
    literal: 'On renzi the Emperor ascended Danfeng Tower and proclaimed a great amnesty for the realm.',
    idiomatic: 'On renzi Jingzong proclaimed universal amnesty from Danfeng Tower.',
  },
  s0033: {
    literal: 'Capital-area summer green-seed tax was remitted; autumn green-seed tax was reduced two hundred cash per string.',
    idiomatic: 'Capital seed taxes were cut: summer remitted, autumn two hundred cash per string off.',
  },
  s0034: {
    literal: 'Beyond regular tribute nothing might be presented.',
    idiomatic: 'Extra tribute presentations were forbidden.',
  },
  s0035: {
    literal: 'Daughters of the Six and Ten Houses princes were to choose husbands each year from the examination candidates.',
    idiomatic: 'Imperial clanswomen were to marry from the civil-service lists yearly.',
  },
  s0036: {
    literal: 'Henceforth household registers and field acreage would be taxed on a fixed schedule every five years.',
    idiomatic: 'Land tax registers were ordered reassessed every five years.',
  },
  s0037: {
    literal: 'That day wind and rain.',
    idiomatic: 'Wind and rain struck that day.',
  },
  s0038: {
    literal: 'On jiayin he first met the chief ministers at Yanying.',
    idiomatic: 'On jiayin he began Yanying audiences with his premiers.',
  },
  s0039: {
    literal: 'On bingchen Right Vice Director Wei Hao was made Vice Minister of Revenue.',
    idiomatic: 'On bingchen Wei Hao took Revenue.',
  },
  s0040: {
    literal: 'On wuwu the Rituals Commissioner memorialized: "Outer titled ladies\' New Year\'s and quarterly attendance rites — we submit that when ritual is excessive it becomes irreverent; please stop them."',
    idiomatic: 'On wuwu the Rituals office asked to end titled ladies\' quarterly court calls as excessive.',
  },
  s0041: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0042: {
    literal: 'On gengshen Minister of Works Hu Zheng was made acting Minister of Revenue and Jingzhao prefect.',
    idiomatic: 'On gengshen Hu Zheng took Revenue and the capital prefecture.',
  },
  s0043: {
    literal: 'On jiazi the household of the late Shannan East military commissioner Niu Yuanyi was murdered by Wang Tingcou; the Emperor grieved long for the injustice, sighing that the chief ministers lacked talent and had indulged rebellious ministers.',
    idiomatic: 'On jiazi Wang Tingcou slaughtered Niu Yuanyi\'s family; Jingzong mourned and blamed weak premiers.',
  },
  s0044: {
    literal: 'Hanlin academician Wei Chuhou memorialized: "The root of order and chaos has no other art: follow the people and there is order; oppose them and chaos."',
    idiomatic: 'Wei Chuhou told the throne: order follows the people\'s will, chaos defies it.',
  },
  s0045: {
    literal: 'Your Majesty often sighs that there are no Xiao He or Cao Shen.',
    idiomatic: '"You lament the lack of a Xiao He or Cao Shen," he said.',
  },
  s0046: {
    literal: 'Yet there is a Pei Du you still will not use — this is why Feng Tang moved Han Wen, though he had Lian Po and Li Mu he could not employ them."',
    idiomatic: '"Yet Pei Du stands unused — like Feng Tang before Han Wen, with generals in reach and none employed." Thus ended the memorial.',
  },
  s0047: {
    literal: 'Heir-apparent Junior Mentor Zhang Hongjing was made heir-apparent Junior Preceptor and assigned to the eastern capital; heir-apparent Guest of Honor Linghu Chu was made Henan prefect.',
    idiomatic: 'Zhang Hongjing went to Luoyang as junior preceptor; Linghu Chu became Henan prefect.',
  },
  s0048: {
    literal: 'On dingmao Minister of Punishments Duan Wenchang was ordered to act as Left Vice Director.',
    idiomatic: 'On dingmao Duan Wenchang acted as left vice director.',
  },
  s0049: {
    literal: 'On wuchen the ministers entered the side hall; the sun was high yet the Emperor had not taken his seat, and some who could not keep standing collapsed.',
    idiomatic: 'On wuchen a tardy audience left ministers fainting in the side hall.',
  },
  s0050: {
    literal: 'Remonstrance official Li Bo stepped out and informed the chief ministers; only then did the Emperor sit.',
    idiomatic: 'Li Bo rebuked the premiers outside until Jingzong finally sat.',
  },
  s0051: {
    literal: 'When the session ended, Left Reminder Liu Qichu remonstrated, beating his head on the imperial steps until blood flowed; the Emperor was moved and granted him a scarlet fish bag.',
    idiomatic: 'Liu Qichu bloodied the steps in remonstrance and won a scarlet fish bag.',
  },
  s0052: {
    literal: 'Commoner Xu Zhongxin forced his way through the bath hall gate; he was beaten forty strokes and exiled to Tiande.',
    idiomatic: 'Intruder Xu Zhongxin was flogged and sent to the frontier.',
  },
  s0053: {
    literal: 'On gengwu ten thousand strings of cash were granted the inner Music Office for excursions.',
    idiomatic: 'On gengwu the inner Music Office received ten thousand strings for tours.',
  },
  s0054: {
    literal: 'That night Venus transgressed the northern axle of the Well.',
    idiomatic: 'Venus crossed the Well again that night.',
  },
  s0055: {
    literal: 'On jiaxu the Xia military commissioner Li You memorialized: beyond the frontier five forts — Wuyan, Youzhou, Linse, Yinhe, and Taozi — were built against the border tribes.',
    idiomatic: 'On jiaxu Li You reported five frontier forts built against nomad raids.',
  },
  s0056: {
    literal: 'Because the Tangut raided, a stockade was also built north of Luziguan at Mugua Ridge to block their route.',
    idiomatic: 'A stockade at Mugua Ridge was added to choke Tangut raids.',
  },
  s0057: {
    literal: 'On yihai he visited the Music Office and granted the performers three thousand five hundred bolts of silk.',
    idiomatic: 'On yihai the Music Office received another three thousand five hundred bolts.',
  },
  s0058: {
    literal: 'Summer, fourth month, gengchen new moon.',
    idiomatic: 'The fourth month opened on gengchen.',
  },
  s0059: {
    literal: 'On jiashen Censor-in-Chief Wang Ya was made Minister of Revenue, still Censor-in-Chief, and salt and transport commissioner.',
    idiomatic: 'On jiashen Wang Ya took Revenue and the salt monopoly.',
  },
  s0060: {
    literal: 'On renchen Vice Minister of War Wu Ruheng died.',
    idiomatic: 'On renchen Wu Ruheng died.',
  },
  s0061: {
    literal: 'On bingshen bandit Zhang Shao and more than a hundred men reached the Right Silver Terrace Gate, killed the gatekeepers, waved weapons and shouted, advanced to Clear Thought Hall, climbed the imperial couch to eat, and attacked the bow and arrow storehouse.',
    idiomatic: 'On bingshen Zhang Shao\'s gang stormed the Silver Terrace Gate and feasted on the imperial couch.',
  },
  s0062: {
    literal: 'Left Divine Strategy army horse commissioner Kang Yiquan led troops into the palace and suppressed them.',
    idiomatic: 'Kang Yiquan of the Left Divine Strategy crushed the intruders.',
  },
  s0063: {
    literal: 'That day, hearing of the disturbance, the Emperor hastily fled to the Left Army.',
    idiomatic: 'Jingzong fled to the Left Army when he heard the alarm.',
  },
  s0064: {
    literal: 'On dingyou he returned to the palace; the ministers congratulated him.',
    idiomatic: 'On dingyou he returned; the court rejoiced.',
  },
  s0065: {
    literal: 'Remonstrance official Li Bo said the Emperor\'s levity had invited thieves; his words were very sharp.',
    idiomatic: 'Li Bo blamed the Emperor\'s recklessness in blunt terms.',
  },
  s0066: {
    literal: 'On jihai thirty-five gate supervisors of Jiuxian Gate and elsewhere were all flogged.',
    idiomatic: 'On jihai thirty-five gate supervisors were beaten.',
  },
  s0067: {
    literal: 'On xinchou dye-house commissioner Tian Sheng and Duan Zheng were exiled to Tiande because Zhang Shao had been a dye-house laborer.',
    idiomatic: 'On xinchou dye-house officials were banished over Zhang Shao\'s origins.',
  },
  s0068: {
    literal: 'An edict cleared Tu Tu Chengcui\'s crimes and ordered his son Shiye to rebury him.',
    idiomatic: 'Tu Tu Chengcui was posthumously rehabilitated and reburied.',
  },
  s0069: {
    literal: 'On bingwu Chief Minister Li Fengji was enfeoffed Duke of Liang; Niu Sengru was enfeoffed Viscount of Qizhang.',
    idiomatic: 'On bingwu Li Fengji became Duke of Liang and Niu Sengru Viscount of Qizhang.',
  },
  s0070: {
    literal: 'Fifth month, jiyou new moon.',
    idiomatic: 'The fifth month opened on jiyou.',
  },
  s0071: {
    literal: 'On yimao an appointment: Senior Remonstrance official, Vice Minister of Personnel, Upper Pillar of State, Baron of Weiyuan with three hundred households, granted purple-gold fish Li Cheng was to keep his posts and become Grand Councillor.',
    idiomatic: 'On yimao Li Cheng joined the Grand Council.',
  },
  s0072: {
    literal: 'Court Gentleman for Discussion, acting Vice Minister of Revenue, concurrent Censor-in-Chief, revenue commissioner, Upper Pillar, granted purple-gold fish Dou Yizhi was made Grand Master for Splendid Happiness, same posts, Grand Councillor.',
    idiomatic: 'Dou Yizhi also became grand councillor.',
  },
  s0073: {
    literal: 'Revenue commissioner and Vice Minister of Revenue Wei Hao was granted gold-purple.',
    idiomatic: 'Wei Hao received gold-purple.',
  },
  s0074: {
    literal: 'On jiwei Fengshui township of Fuping, Zhigong township of Xiaqi, Fudao township of Chengcheng, and Huibin township of Baishui were cut off to supply Jing Mausoleum.',
    idiomatic: 'On jiwei four townships were detached for Jing Mausoleum upkeep.',
  },
  s0075: {
    literal: 'On guihai Salt prefect Fu Liangbi was made Xia military commissioner.',
    idiomatic: 'On guihai Fu Liangbi took Xia.',
  },
  s0076: {
    literal: 'Eastern-capital and Jiangling chief transport deputies were changed to "commissioner of the office" posts, at Wang Ya\'s request.',
    idiomatic: 'Transport deputies at Luoyang and Jiangling were retitled per Wang Ya.',
  },
  s0077: {
    literal: 'Sixth month, jimao new moon: Left Divine Strategy great general Kang Yiquan was made Bian-Fang military commissioner.',
    idiomatic: 'On jimao Kang Yiquan took Bian-Fang.',
  },
  s0078: {
    literal: 'On xinsi an edict ordered release of capital prisoners because of prolonged rain.',
    idiomatic: 'On xinsi heavy rains prompted a prisoner amnesty in the capital.',
  },
  s0079: {
    literal: 'On gengchen great wind destroyed Yanxi and Jingfeng gates.',
    idiomatic: 'On gengchen a gale wrecked Yanxi and Jingfeng gates.',
  },
  s0080: {
    literal: 'Vice Minister of Works Zhang Weisu died.',
    idiomatic: 'Zhang Weisu died.',
  },
  s0081: {
    literal: 'On renchen Left Gold Crow guard great general Li Yuan was made acting Minister of Works, concurrent Hezhong prefect and Censor-in-Chief, and Hezhong-Jiang-Long military commissioner.',
    idiomatic: 'On renchen Li Yuan took Hezhong.',
  },
  s0082: {
    literal: 'On bingshen the Shannan West military commissioner, acting Minister of Works Pei Du was added as Grand Councillor.',
    idiomatic: 'On bingshen Pei Du at last received the Grand Council seal.',
  },
  s0083: {
    literal: 'When Pei Du went to Xingyuan, Chief Minister Li Fengji had pushed him out without the council title; Li Cheng and Wei Chuhou daily argued for him before the throne, hence this order.',
    idiomatic: 'Li Fengji had blocked Pei Du\'s council rank until Li Cheng and Wei Chuhou prevailed.',
  },
  s0084: {
    literal: 'Chen-Xu military commissioner Li Guangyan was advanced to acting Minister of Education.',
    idiomatic: 'Li Guangyan was promoted to acting Minister of Education.',
  },
  s0085: {
    literal: 'On guimao Senior Mentor Zhang Hongjing died.',
    idiomatic: 'On guimao Zhang Hongjing died.',
  },
  s0086: {
    literal: 'On jisi Zhexi floods broke the Taihu dike; water entered the prefectural city and swept away houses.',
    idiomatic: 'On jisi a Taihu breach flooded the Zhexi capital.',
  },
  s0087: {
    literal: 'On dingwei Minister of Personnel Zhao Zongru was made Minister of Rites; Minister of War Zheng Qian was made Minister of Personnel.',
    idiomatic: 'On dingwei Zhao Zongru took Rites and Zheng Qian Personnel.',
  },
  s0088: {
    literal: 'Autumn, seventh month, wushen new moon.',
    idiomatic: 'The seventh month opened on wushen.',
  },
  s0089: {
    literal: 'On jiyou in six counties including Muzhou and Qingxi, mountain torrents flooded cities and houses.',
    idiomatic: 'On jiyou floods ravaged six southeastern counties.',
  },
  s0090: {
    literal: 'On gengchen the former Hezhong military commissioner Guo Zhao was made Minister of War.',
    idiomatic: 'On gengchen Guo Zhao took War.',
  },
  s0091: {
    literal: 'On wuwu Heir-apparent Guest of Honor Xu Jitong died.',
    idiomatic: 'On wuwu Xu Jitong died.',
  },
  s0092: {
    literal: 'On xinyou the Lingzhou special advance canal was dredged and six hundred qing of garrison fields were opened.',
    idiomatic: 'On xinyou Lingzhou opened six hundred qing of canal-fed garrison farms.',
  },
  s0093: {
    literal: 'On yichou Yan, Cao, and Pu were inundated; city walls and houses were destroyed.',
    idiomatic: 'On yichou storms wrecked the eastern plain cities.',
  },
  s0094: {
    literal: 'On dingmao an edict: because grain was dear, half the officials\' salaries payable in cloth were now to be paid in grain at fifty cash per dou.',
    idiomatic: 'On dingmao dear grain forced half of official salaries into grain at fifty cash per dou.',
  },
  s0095: {
    literal: 'On xinwei Court of Judicature Review director Cui Yuanlue was made Jingzhao prefect and concurrent Censor-in-Chief.',
    idiomatic: 'On xinwei Cui Yuanlue took the capital prefecture.',
  },
  s0096: {
    literal: 'On jiaxu Left Gold Crow great general Li You presented two hundred fifty horses.',
    idiomatic: 'On jiaxu Li You presented two hundred fifty horses.',
  },
  s0097: {
    literal: 'Censor Wen Zao in the side hall impeached Li You for presenting horses after dismissal from office in violation of the edict; Li You rushed out to await punishment; he was pardoned by edict.',
    idiomatic: 'Wen Zao impeached Li You for illegal tribute horses; an edict pardoned him.',
  },
  s0098: {
    literal: 'The Han River overflowed at Xiang, Jun, and Fu, sweeping away houses.',
    idiomatic: 'Han River floods destroyed homes across the middle Yangzi.',
  },
  s0099: {
    literal: 'On bingzi the Zhexi observation commissioner Li Deyu memorialized: "The edict ordered this circuit to make twenty covered boxes, reckoned at thirteen thousand taels of silver and one hundred thirty taels of gold.',
    idiomatic: 'On bingzi Li Deyu protested an order for twenty silver-covered tribute boxes:',
  },
  s0100: {
    literal: 'Two have already been presented, using one thousand three hundred taels of silver; the circuit treasury holds scarcely two or three hundred taels of reserve silver — all was scraped together by every means to finish these two."',
    idiomatic: '"Two alone cost thirteen hundred taels; the treasury barely holds two hundred in reserve." Thus began the memorial.',
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
