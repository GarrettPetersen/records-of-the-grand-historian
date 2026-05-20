#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.013, Dezong 2 — Zhenyuan 14–15, Wu Shaocheng campaign opens) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: 'On jiachen Ding Prefecture was elevated to a great metropolitan prefecture.',
    idiomatic: 'On jiachen Dingzhou became a great metropolitan prefecture.',
  },
  s0502: {
    literal: 'Hunan observation commissioner Li Xun was made Jiangzhou prefect and Jiangxi observation commissioner; Libu vice minister Lü Wei was made Tanzhou prefect and Hunan observation commissioner.',
    idiomatic: 'Li Xun moved from Hunan to Jiangxi; Lü Wei became Hunan commissioner at Tanzhou.',
  },
  s0503: {
    literal: 'Winter, tenth month, guichou new moon: former Chuzhou prefect Fang Ji was made Rongguan pacification commissioner.',
    idiomatic: 'On the tenth month\'s new moon Fang Ji became Rongguan pacification commissioner.',
  },
  s0504: {
    literal: 'On bingchen the Qianzhong observation commissioner memorialized: "Xizhou households petition that the former prefect Wei Congju, beyond the two taxes, each year added tribute of one thousand jin of cinnabar and two hundred loads of mercury — the people suffer; we ask that it stop.',
    idiomatic: 'The Qianzhong commissioner reported Xizhou\'s plea: ex-prefect Wei Congju had levied cinnabar and mercury beyond the two-tax quota.',
  },
  s0505: {
    literal: 'It was granted.',
    idiomatic: 'The emperor granted the request.',
  },
  s0506: {
    literal: 'Huai-Xi Wu Shaocheng on his own authority opened the Taodiao and Ru rivers; imperial envoys could not forbid it.',
    idiomatic: 'Wu Shaocheng of Huai-Xi dredged the Taodiao and Ru rivers despite imperial orders.',
  },
  s0507: {
    literal: 'On guiyou Chancellor Jia Dan, ill, sought to avoid the chancellorship — not permitted.',
    idiomatic: 'On guiyou Jia Dan, ill, asked to leave the chancellery and was refused.',
  },
  s0508: {
    literal: 'On dingchou Xu-Si military commissioner Zhang Jianfeng came to court; the emperor praised him, and the next day summoned him for discussion at Yanying.',
    idiomatic: 'On dingchou Zhang Jianfeng of Xu-Si was received at court and praised; the next day he was questioned at Yanying.',
  },
  s0509: {
    literal: 'On guisi posthumous Grand Tutor Ma Sui was enshrined in the ancestral temple; the authorities were ordered to supply a lesser offering, and still to provide funeral regalia from his residence to the temple.',
    idiomatic: 'On guisi Ma Sui entered the ancestral temple with full rites and escort from his house.',
  },
  s0510: {
    literal: 'Twelfth month, gengchen: Right Dragon Martial commanding general Han Yougui died.',
    idiomatic: 'In the twelfth month Han Yougui died.',
  },
  s0511: {
    literal: 'Fourteenth year, spring, first month, renwu new moon.',
    idiomatic: 'Spring of the fourteenth year opened on renwu.',
  },
  s0512: {
    literal: 'On gengyin an edict: all circuit and prefectural two-tax levies and monopoly wine monies from Zhenyuan years eight through eleven still owed by the people — in all 5,607,000 strings — were all remitted.',
    idiomatic: 'On gengyin the court remitted 5,607,000 strings of back taxes and wine levies from Zhenyuan 8–11.',
  },
  s0513: {
    literal: 'On jiawu an edict: "Of late when court officials visit one another, the Golden Guards report all of it.',
    idiomatic: 'On jiawu an edict said: "The Golden Guards have been reporting every visit among court officials.',
  },
  s0514: {
    literal: 'Among them, if they are kin or former colleagues, at solstice seasons there must be exchanges — this too is human custom; hereafter it need not be reported."',
    idiomatic: 'Kin and former colleagues may visit at the seasons — that is ordinary courtesy; no more reports are required."',
  },
  s0515: {
    literal: 'This followed a memorial from Zhang Jianfeng.',
    idiomatic: 'The change followed Zhang Jianfeng\'s advice.',
  },
  s0516: {
    literal: 'Second month, renzi new moon.',
    idiomatic: 'The second month opened on renzi.',
  },
  s0517: {
    literal: 'On wuwu the emperor attended Lindé Hall and feasted civil and military officials; first the "Breaking Chen" music was played, then the Nine Sections through, and more than ten palace singing girls and dancers were ranged in the courtyard.',
    idiomatic: 'On wuwu he banqueted officials at Lindé Hall with the "Breaking Chen" suite, the Nine Sections, and palace dancers.',
  },
  s0518: {
    literal: 'Earlier the emperor had composed the "Central Harmony" dance tune; that day it was performed, and only at sunset did it end.',
    idiomatic: 'He had composed the "Central Harmony" dance, performed that day until dusk.',
  },
  s0519: {
    literal: 'The prior edict had set the first day of the second month for the Central Harmony festival feast; because of rain and snow, this day was used instead.',
    idiomatic: 'Rain had forced the Central Harmony feast from its usual date to this day.',
  },
  s0520: {
    literal: 'The emperor also composed an eight-rhyme poem, "Midspring Banquet for Officials at Lindé Hall," and distributed gifts to the ministers in graded amounts.',
    idiomatic: 'He gave an eight-line banquet poem and graded gifts to the assembly.',
  },
  s0521: {
    literal: 'On yihai the Guang-Cai command was named the Zhangyi Army.',
    idiomatic: 'On yihai Guang-Cai was renamed the Zhangyi Army.',
  },
  s0522: {
    literal: 'Third month, bingshen: Right Divine Strategy campaign commissioner, Fengxiang-Longyou observation commissioner, acting Minister of the Right, Fengxiang prefect Xing Junya died.',
    idiomatic: 'In the third month Xing Junya of Fengxiang died.',
  },
  s0523: {
    literal: 'Right Divine Strategy general Zhang Chang was made Fengxiang prefect, Right Divine Strategy campaign commissioner, and Fengxiang-Longyou military commissioner, and his name was changed to Jingze.',
    idiomatic: 'Zhang Chang became Fengxiang commissioner as Jingze.',
  },
  s0524: {
    literal: 'Summer, fourth month, yichou: Left Remonstrance Bureau grandee and Grand Secretariat Associate Cui Sun was made commissioner for repairing the eight imperial tombs.',
    idiomatic: 'On yichou Cui Sun was charged with restoring the eight mausoleums.',
  },
  s0525: {
    literal: 'Earlier the Zhaoling sleeping hall had been burned; now Xian, Zhao, Qian, Ding, and Tai tombs each received three hundred eighty new rooms, while Qiao, Yuan, and Jian tombs were patched where lacking.',
    idiomatic: 'After Zhaoling burned, five tombs gained new halls and three were repaired where damaged.',
  },
  s0526: {
    literal: 'Fifth month, gengchen new moon.',
    idiomatic: 'The fifth month opened on gengchen.',
  },
  s0527: {
    literal: 'On jiawu former Luoyang protector, eastern capital Ji-Ru defense commissioner, acting Minister of Personnel Du Ya died.',
    idiomatic: 'On jiawu Du Ya died.',
  },
  s0528: {
    literal: 'On bingwu Revenue vice minister and acting transport controller Su Bian was made heir-apparent household steward.',
    idiomatic: 'On bingwu Su Bian became steward of the heir\'s household.',
  },
  s0529: {
    literal: 'The emperor specially summoned Revenue section chief Yu Mian to Yanying, concurrently made him vice censor-in-chief, granted gold and purple, and ordered him to act as transport controller.',
    idiomatic: 'Yu Mian was summoned to Yanying, made vice censor-in-chief, and put in charge of revenue.',
  },
  s0530: {
    literal: 'Intercalary month, gengshen: Left Divine Strategy campaign commissioner Han Quanyi was made Xiazhou prefect and concurrent Yan, Xia, Sui, and Yin military commissioner, replacing Han Tan.',
    idiomatic: 'In the intercalary month Han Quanyi took the Yan-Xia-Sui-Yin command from Han Tan.',
  },
  s0531: {
    literal: 'On jiazi heir-apparent household steward Su Bian was demoted to Tingzhou registrar; elder brother senior aide to the heir Gun to Yongzhou registrar; elder brother senior aide to the heir Gun to Yongzhou registrar; former Capital Metropolitan Prefecture legal clerk Mian to Xinzhou registrar.',
    idiomatic: 'On jiazi Su Bian and his brothers were demoted to distant registrarships, with Mian sent to Xinzhou.',
  },
  s0532: {
    literal: 'Sixth month, guimao: heir-apparent guest Lu Mai died.',
    idiomatic: 'In the sixth month Lu Mai died.',
  },
  s0533: {
    literal: 'On yisi because of drought and famine, grain from the great storehouse was issued for relief loans.',
    idiomatic: 'On yisi famine grain was lent from the imperial granary.',
  },
  s0534: {
    literal: 'Autumn, seventh month: Jizhou prefect Du Chun was made Yongguan pacification commissioner.',
    idiomatic: 'In the seventh month Du Chun became Yongguan commissioner.',
  },
  s0535: {
    literal: 'On maomao Capital Metropolitan Prefect Han Gao was demoted to Fuzhou vice-prefect.',
    idiomatic: 'On maomao Han Gao was exiled to Fuzhou.',
  },
  s0536: {
    literal: 'Right Golden Guards general Wu Cou was summoned to Yanying, personally appointed Capital Metropolitan Prefect, and at once ordered to enter the prefecture and assume duties.',
    idiomatic: 'Wu Cou was named metropolitan prefect at audience and sent straight to his post.',
  },
  s0537: {
    literal: 'That summer was extremely hot.',
    idiomatic: 'That summer was fiercely hot.',
  },
  s0538: {
    literal: 'On renshen Remonstrance Bureau attendant and Grand Secretariat Associate Zhao Zongru was made heir-apparent left senior aide; Left Remonstrance Bureau grandee and Associate Cui Sun was made Secretariat Vice Director and Associate; Works vice minister Zheng Yuqing was made Secretariat Vice Director and Concurrent Associate.',
    idiomatic: 'On renshen Zhao Zongru left the chancellery for the heir\'s staff; Cui Sun and Zheng Yuqing entered the chancellery.',
  },
  s0539: {
    literal: 'Left Divine Strategy protector-army vice commissioner Huo Xianming died.',
    idiomatic: 'Huo Xianming, protector of the Left Divine Strategy Army, died.',
  },
  s0540: {
    literal: 'On dingchou the eunuch Diwu Shouliang replaced Xianming as vice commissioner.',
    idiomatic: 'On dingchou Diwu Shouliang became Left Divine Strategy protector.',
  },
  s0541: {
    literal: 'On jimao the Left and Right Divine Strategy armies established army commanders — rank, salary, and provisions following the Six Armies commanders\' precedent.',
    idiomatic: 'On jimao the Divine Strategy armies gained commanders equal to the Six Armies.',
  },
  s0542: {
    literal: 'On jiawu Cui Sun finished repairing the eight mausoleum palaces; the ministers performed congratulatory rites at Xuanzheng Hall.',
    idiomatic: 'On jiawu the tomb repairs were finished and the court congratulated Cui Sun.',
  },
  s0543: {
    literal: 'Zhexi observation commissioner and Runzhou prefect Wang Wei died.',
    idiomatic: 'Wang Wei of Zhexi died.',
  },
  s0544: {
    literal: 'Ninth month, dingwei new moon.',
    idiomatic: 'The ninth month opened on dingwei.',
  },
  s0545: {
    literal: 'On jiyou Shannan East Circuit military commissioner, acting Minister of the Right, Xiangzhou prefect Fan Ze died.',
    idiomatic: 'On jiyou Fan Ze of Shannan East died.',
  },
  s0546: {
    literal: 'On maomao Tongzhou prefect Cui Zong was made chief administrator of the great metropolitan prefecture of Shanzhou, Shan-Guo observation and water-land transport commissioner; Zhedong observer Li Ruochu was made Runzhou prefect, Zhexi observer, and salt-and-iron transport commissioner for all circuits; Changzhou prefect Pei Su was made Yuezhou prefect and Zhedong observer.',
    idiomatic: 'On maomao Cui Zong took Shan-Guo transport; Li Ruochu took Zhexi and salt-and-iron; Pei Su took Zhedong.',
  },
  s0547: {
    literal: 'On bingchen Shan-Guo observer Yu Di was made Xiangzhou prefect and Shannan East military commissioner.',
    idiomatic: 'On bingchen Yu Di became Shannan East commissioner at Xiangzhou.',
  },
  s0548: {
    literal: 'On dingmao Prince Qi Wang Chun died.',
    idiomatic: 'On dingmao Prince Qi died.',
  },
  s0549: {
    literal: 'Minister of Rites Du Que was made Tongzhou prefect, prefectural defense commissioner, and Changchun Palace commissioner.',
    idiomatic: 'Du Que became Tongzhou prefect and Changchun commissioner.',
  },
  s0550: {
    literal: 'On guiyou Remonstrance Bureau grandee Tian Deng memorialized: "War Ministry martial-examination candidates enter the Imperial City with bows and arrows — several thousands — which is perhaps not fitting."',
    idiomatic: 'On guiyou Tian Deng warned that martial candidates were entering the palace armed by the thousands.',
  },
  s0551: {
    literal: 'When the emperor heard it he started; he then ordered the martial examination stopped.',
    idiomatic: 'Alarmed, the emperor abolished the martial examination.',
  },
  s0552: {
    literal: 'Winter, tenth month, guiyou: because the year was harsh and grain dear, thirty thousand shi from the great storehouse were struck out and relief markets opened to benefit the people.',
    idiomatic: 'In the tenth month thirty thousand shi were sold from the granary to ease famine prices.',
  },
  s0553: {
    literal: 'On gengzi Xiazhou\'s Han Quanyi memorialized breaking Tibetans at Yanzhou.',
    idiomatic: 'On gengzi Han Quanyi reported a victory over Tibet at Yanzhou.',
  },
  s0554: {
    literal: 'Eleventh month, jiwei: Wei Gao presented ten scrolls of "Account of Opening the Southwestern Man," narrating the recovery of Nanzhao.',
    idiomatic: 'In the eleventh month Wei Gao submitted his account of reopening Nanzhao.',
  },
  s0555: {
    literal: 'Twelfth month, wuzi: heir-apparent junior tutor, retired, Prince of Yingguo Wei Lun died.',
    idiomatic: 'In the twelfth month Wei Lun died in retirement.',
  },
  s0556: {
    literal: 'On guiyou seventy thousand shi from Luoyang\'s Jiahe granary were issued and relief markets opened to aid Henan famine victims.',
    idiomatic: 'On guiyou Luoyang grain was sold to feed Henan.',
  },
  s0557: {
    literal: 'On jihai Nanzhao\'s Yimouxun sent envoys to congratulate the new year.',
    idiomatic: 'On jihai Nanzhao sent New Year envoys.',
  },
  s0558: {
    literal: 'Mingzhou garrison commander Su Huang killed prefect Lu Yun.',
    idiomatic: 'Su Huang of Mingzhou murdered his prefect Lu Yun.',
  },
  s0559: {
    literal: 'Fifteenth year, spring, first month, bingwu new moon.',
    idiomatic: 'The fifteenth year opened on bingwu.',
  },
  s0560: {
    literal: 'On jiayin Prince Ya Wang Yi died.',
    idiomatic: 'On jiayin Prince Ya died.',
  },
  s0561: {
    literal: 'On jiaxu Zhexi observation commissioner Li Ruochu died.',
    idiomatic: 'On jiaxu Li Ruochu died.',
  },
  s0562: {
    literal: 'Second month: the Central Harmony festival banquet was stopped — because the year was harsh.',
    idiomatic: 'The Central Harmony feast was canceled for famine.',
  },
  s0563: {
    literal: 'On dingchou Xuanwu Army military commissioner, acting Minister of the Left, Associate, Bianzhou prefect Dong Jin died.',
    idiomatic: 'On dingchou Dong Jin of Bianzhou died.',
  },
  s0564: {
    literal: 'On yiyou campaign marshal Lu Changyuan was made acting Minister of Rites, Bianzhou prefect, censor-in-chief, Xuanwu military commissioner with revenue, garrison-farming, and Bian-Song-Bo-Ying observation powers.',
    idiomatic: 'On yiyou Lu Changyuan was sent to command Bianzhou and the Xuanwu army.',
  },
  s0565: {
    literal: 'Changzhou prefect Li Qian was made Runzhou prefect, Zhexi observer, and all-circuits salt-and-iron transport commissioner.',
    idiomatic: 'Li Qian took Zhexi and the salt-and-iron post.',
  },
  s0566: {
    literal: 'That same day Bianzhou troops mutinied, killed Lu Changyuan and military adjutants Meng Shudu and Qiu Ying, and the soldiers dismembered and ate them.',
    idiomatic: 'That day Bianzhou soldiers killed Lu Changyuan and his staff and devoured the bodies.',
  },
  s0567: {
    literal: 'Army supervisor Ju Wenzhen, because Songzhou prefect Liu Yizhun had long been a great Bian general, wrote inviting him to quiet the disorder.',
    idiomatic: 'Ju Wenzhen summoned Liu Yizhun of Songzhou to restore order.',
  },
  s0568: {
    literal: 'On yichou Songzhou prefect Liu Yizhun was made acting Minister of Works, concurrent Bianzhou prefect and Xuanwu military commissioner, and granted the name Quanliang.',
    idiomatic: 'On yichou Liu Yizhun became Bianzhou commissioner as Quanliang.',
  },
  s0569: {
    literal: 'On yiwei Pei Su memorialized capturing Su Huang at Taizhou and presenting him — he was executed at Duliu Tree.',
    idiomatic: 'On yiwei Pei Su sent Su Huang\'s head after capturing him at Taizhou.',
  },
  s0570: {
    literal: 'On guimao the third-month ministers\' banquet reward was stopped — the year was famished.',
    idiomatic: 'The spring court banquet was canceled for hunger.',
  },
  s0571: {
    literal: 'One hundred eighty thousand shi from the great storehouse were sold in the capital districts.',
    idiomatic: 'One hundred eighty thousand shi were sold around the capital.',
  },
  s0572: {
    literal: 'Third month, jiayin: Wu Shaocheng raided Tang Prefecture, killed army supervisor Shao Guochao, and carried off more than a thousand civilians.',
    idiomatic: 'On jiayin Wu Shaocheng raided Tangzhou, killed the supervisor, and abducted civilians.',
  },
  s0573: {
    literal: 'On dingsi Revenue section chief and concurrent vice censor-in-chief Yu Mian was made Revenue vice minister, still acting transport controller.',
    idiomatic: 'On dingsi Yu Mian became revenue vice minister while keeping transport duties.',
  },
  s0574: {
    literal: 'On wuwu Zhaoyi Army military commissioner, acting Minister of Works Wang Qianxiu died.',
    idiomatic: 'On wuwu Wang Qianxiu of Zhaoyi died.',
  },
  s0575: {
    literal: 'On wuchen Heyang Three Cities military commissioner Li Yuan was made chief administrator of Luzhou, Zhaoyi military commissioner, and Ze-Lu-Ci-Xing-Ming observer; Heyang military adjutant Heng Ji was made Huaizhou prefect and Heyang Three Cities Huai military commissioner.',
    idiomatic: 'On wuchen Li Yuan took Zhaoyi; Heng Ji took Heyang-Huai.',
  },
  s0576: {
    literal: 'On xinwei retired heir-apparent junior tutor Yu Yi died.',
    idiomatic: 'On xinwei Yu Yi died in retirement.',
  },
  s0577: {
    literal: 'On renshen the Yongqing Army was established at Mancheng County in Yizhou.',
    idiomatic: 'On renshen the Yongqing Army was founded at Mancheng.',
  },
  s0578: {
    literal: 'On guiyou the Jiang-Huai circuits were ordered to transport two million shi of grain yearly.',
    idiomatic: 'On guiyou the court ordered two million shi of Jiang-Huai grain shipped annually.',
  },
  s0579: {
    literal: 'Though the order stood, yearly transport did not exceed four hundred thousand shi.',
    idiomatic: 'In practice only four hundred thousand shi moved each year.',
  },
  s0580: {
    literal: 'Fourth month, dingchou: because of long drought, yin-yang specialists were ordered to perform rain rites by law and technique.',
    idiomatic: 'On dingchou rain rites were ordered after prolonged drought.',
  },
  s0581: {
    literal: 'On renwu two additional inner provisioners were added to the Palace Domestic Service.',
    idiomatic: 'On renwu the inner palace gained two provisioners.',
  },
  s0582: {
    literal: 'On guiwei Anzhou prefect Yi Shen was made An-Huang military, garrison-farming, and observation commissioner.',
    idiomatic: 'On guiwei Yi Shen became An-Huang commissioner.',
  },
  s0583: {
    literal: 'On gengyin all military, county, and garrison staff inside and outside the capital — in all 58,271 persons — were each to be granted one shi of grain.',
    idiomatic: 'On gengyin every capital soldier and clerk received one shi of grain.',
  },
  s0584: {
    literal: 'On yiwei Special Advance, Minister of War Gui Chongjing died.',
    idiomatic: 'On yiwei Gui Chongjing died.',
  },
  s0585: {
    literal: 'Fifth month, jiachen new moon.',
    idiomatic: 'The fifth month opened on jiachen.',
  },
  s0586: {
    literal: 'On wuchen Court of Imperial Sacrifices director, collateral Prince of Wu Wu Zhan died.',
    idiomatic: 'On wuchen Prince of Wu Wu Zhan died.',
  },
  s0587: {
    literal: 'Sixth month, jimao: Qianzhong observation commissioner and vice censor-in-chief Wang Chu died.',
    idiomatic: 'In the sixth month Wang Chu died.',
  },
  s0588: {
    literal: 'On guisi Shannan West Circuit military commissioner, acting Minister of the Left, Associate Yan Zhen died.',
    idiomatic: 'On guisi Yan Zhen of Shannan West died.',
  },
  s0589: {
    literal: 'Autumn, seventh month, yisi: Xingzhou prefect and Xingyuan chief of staff Yan Li was made Xingyuan prefect, concurrent censor-in-chief, Shannan West military, revenue, garrison-farming, and observation commissioner.',
    idiomatic: 'On yisi Yan Li became Shannan West commissioner at Xingyuan.',
  },
  s0590: {
    literal: 'On bingwu the late Princess Tang\'an was granted the posthumous title Zhuangmu.',
    idiomatic: 'On bingwu Princess Tang\'an received the posthumous title Zhuangmu.',
  },
  s0591: {
    literal: 'Posthumous titles for princesses began with Tang\'an.',
    idiomatic: 'Imperial princesses first received posthumous titles with Tang\'an.',
  },
  s0592: {
    literal: 'On dingwei because Wang Chu died, court was suspended one day.',
    idiomatic: 'On dingwei court was canceled for Wang Chu\'s death.',
  },
  s0593: {
    literal: 'Suspending court when an observation commissioner died began with Chu.',
    idiomatic: 'Canceling court for an observer\'s death began with Chu.',
  },
  s0594: {
    literal: 'On wuwu Remonstrance Bureau grandee Miao Zheng was demoted to Wanzhou prefect; Left Collector Li Fan to Bozhou army adjutant — for privately debating Yan Li\'s improper appointment without memorial, yet falsely claiming repeated submissions.',
    idiomatic: 'On wuwu Miao Zheng and Li Fan were exiled for gossiping about Yan Li\'s appointment instead of memorializing.',
  },
  s0595: {
    literal: 'Zheng and Hua suffered great floods.',
    idiomatic: 'Zheng and Hua circuits flooded.',
  },
  s0596: {
    literal: 'Eighth month, renshen new moon.',
    idiomatic: 'The eighth month opened on renshen.',
  },
  s0597: {
    literal: 'On bingshen Chen-Xu military commissioner, acting Minister of the Right, Xuzhou prefect Qu Huan died.',
    idiomatic: 'On bingshen Qu Huan of Chen-Xu died.',
  },
  s0598: {
    literal: 'On dingyou Yangzhou prefect Wei Shizong was made Qianzhong observation commissioner.',
    idiomatic: 'On dingyou Wei Shizong became Qianzhong observer.',
  },
  s0599: {
    literal: 'On bingwu Chen-Xu army marshal and former Chenzhou prefect Shangguan Shui was made Xuzhou prefect and Chen-Xu military commissioner.',
    idiomatic: 'On bingwu Shangguan Shui took Chen-Xu at Xuzhou.',
  },
  s0600: {
    literal: 'Wu Shaocheng\'s plotting of rebellion grew daily; he seized Linying and pressed the siege of Xuzhou.',
    idiomatic: 'Wu Shaocheng\'s revolt deepened: he took Linying and besieged Xuzhou.',
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
if (data.metadata.chapter !== '013') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 013; standalone T ready (${Object.keys(T).length} entries).`
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
