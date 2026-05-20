#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.008, Xuanzong 1 — Kaiyuan 1 through Kaiyuan 3) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/008.json';
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
      'In the ninth month, Minister of Works and concurrent Yangzhou chief administrator Prince Chengqi of Song became Grand Mentor and concurrent Yangzhou chief administrator; Yizhou chief administrator and concurrent Right Golden Guard grand general Prince Chengyi of Shen became Minister of Education and concurrent Yizhou chief administrator; Chanyu Protectorate-general and concurrent Left Golden Guard grand general Prince Shouli of Bin became Minister of Works.',
    idiomatic:
      'In the ninth month Prince Chengqi of Song became grand mentor and Yangzhou governor; Prince Chengyi of Shen became minister of education and Yizhou governor; Prince Shouli of Bin became minister of works.',
  },
  s0102: {
    literal: 'On guichou Mount Hua\'s spirit was enfeoffed as King of Metal Heaven.',
    idiomatic: 'On guichou the spirit of Mount Hua was enfeoffed as King of Metal Heaven.',
  },
  s0103: {
    literal:
      'On dingmao of the ninth month Prince Chengqi of Song became commissioner with the same privileges as the Three Dukes; Left Vice Minister of the Department of State Affairs Liu Youqiu was equal in rank to the Three Offices at the Secretariat Chancellery; acting Secretariat Director Zhang Yue, Duke of Yan, became Secretariat Director; Special Advance Wang Renjiao became commissioner with the same privileges as the Three Dukes.',
    idiomatic:
      'On dingmao of the ninth month Prince Chengqi became commissioner equal to the Three Dukes; Liu Youqiu joined the third rank at the Secretariat Chancellery; Zhang Yue became secretariat director; Wang Renjiao became commissioner equal to the Three Dukes.',
  },
  s0104: {
    literal:
      'On jimao he feasted the princes and the hundred officials at the Gate of Accepting Heaven, ordered coins scattered from the tower below for officials of the fifth rank and above at the Secretariat Chancellery and of the third rank and above in the ministries to scramble for, and granted goods in graded amounts.',
    idiomatic:
      'On jimao he feasted princes and officials at the Gate of Accepting Heaven, showered gold from the tower for fifth-rank secretariat officials and third-rank ministry officials to scramble for, and gave graded gifts.',
  },
  s0105: {
    literal: 'Guo Yuanzhen was made concurrent censor-in-chief.',
    idiomatic: 'Guo Yuanzhen became concurrent censor-in-chief.',
  },
  s0106: {
    literal: 'On bingxu the Right Censorate was established again.',
    idiomatic: 'On bingxu the right censorate was restored.',
  },
  s0107: {
    literal: 'In the tenth winter month, on jiashen, he visited the hot springs at Xinfeng.',
    idiomatic: 'In the tenth winter month, on jiashen, he went to the Xinfeng hot springs.',
  },
  s0108: {
    literal: 'On guimao he reviewed troops at Mount Li.',
    idiomatic: 'On guimao he held a military review at Mount Li.',
  },
  s0109: {
    literal:
      'Minister of War and Duke of Dai Guo Yuanzhen was punished for dereliction in military appearance and exiled to Xin Prefecture;',
    idiomatic:
      'Guo Yuanzhen, minister of war and Duke of Dai, was exiled to Xin Prefecture for dereliction in military appearance;',
  },
  s0110: {
    literal:
      'Drafting attendant and acting Vice Director of Court Ceremonies Tang Shao was beheaded beneath the army banners for faults in military rites.',
    idiomatic:
      'Tang Shao, drafting attendant and acting vice director of court ceremonies, was beheaded beneath the banners for faults in military rites.',
  },
  s0111: {
    literal: 'On jiachen he hunted on the Wei River.',
    idiomatic: 'On jiachen he hunted along the Wei.',
  },
  s0112: {
    literal:
      'Tongzhou prefect and Duke of Liang Yao Yuanzhi became Minister of War and equal in rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic:
      'Yao Yuanzhi, Tongzhou prefect and Duke of Liang, became minister of war of third rank at the Secretariat Chancellery.',
  },
  s0113: {
    literal: 'On yisi he returned from the hot springs.',
    idiomatic: 'On yisi he came back from the hot springs.',
  },
  s0114: {
    literal: 'On yichou Youqiu was made concurrent attendant-in-chief.',
    idiomatic: 'On yichou Liu Youqiu became concurrent attendant-in-chief.',
  },
  s0115: {
    literal: 'On wuzi the emperor\'s honorific was extended to Martial Divine Emperor.',
    idiomatic: 'On wuzi the emperor took the added title Martial Divine Emperor.',
  },
  s0116: {
    literal:
      'On the gengyin new moon of the twelfth month a general amnesty was proclaimed throughout the realm; the era name was changed to Kaiyuan, and civil and military officials received one turn on the merit roll.',
    idiomatic:
      'On the gengyin new moon of the twelfth month the court proclaimed amnesty, renamed the era Kaiyuan, and granted officials one merit turn.',
  },
  s0117: {
    literal:
      'The Left and Right Vice Ministers of the Department of State Affairs were renamed Left and Right Chancellors; the Secretariat was renamed the Purple Palace Office; the Chancellery was renamed the Yellow Gate Office; Attendant-in-Chief was renamed Supervisor.',
    idiomatic:
      'Left and right vice ministers became left and right chancellors; the secretariat became the Purple Palace Office; the chancellery the Yellow Gate Office; attendant-in-chief became supervisor.',
  },
  s0118: {
    literal:
      'Yong Prefecture became the metropolitan prefecture of Jingzhao, Luoyang the metropolitan prefecture of Henan; chief administrators were renamed prefects and assistants renamed vice prefects.',
    idiomatic:
      'Yong became Jingzhao metropolitan prefecture and Luoyang Henan metropolitan prefecture; chief administrators became prefects and assistants vice prefects.',
  },
  s0119: {
    literal:
      'Since the founding, descendants of chancellors and merit-fief holders who had sunk into obscurity without receiving favor were ordered appointed according to their talents.',
    idiomatic:
      'Descendants of founding chancellors and merit-fief holders long overlooked were ordered appointed by talent.',
  },
  s0120: {
    literal: 'On jihai of the twelfth month of Kaiyuan 1 the Cold-Dispelling Hu play was forbidden.',
    idiomatic: 'On jihai of Kaiyuan 1 the Cold-Dispelling Hu play was banned.',
  },
  s0121: {
    literal:
      'Left Chancellor and concurrent Yellow Gate Supervisor Liu Youqiu became Mentor of the Heir Apparent and ceased participation in government;',
    idiomatic:
      'Liu Youqiu, left chancellor and yellow gate supervisor, became mentor of the heir apparent and left the council;',
  },
  s0122: {
    literal: 'Purple Palace Director Zhang Yue became prefect of Xiang Prefecture.',
    idiomatic: 'Zhang Yue became prefect of Xiang Prefecture.',
  },
  s0123: {
    literal: 'On jiayin Yellow Gate Vice Director Lu Huaizhen became equal in rank to the Purple Palace and Yellow Gate Offices.',
    idiomatic: 'On jiayin Lu Huaizhen joined the third rank at the Purple Palace and Yellow Gate Offices.',
  },
  s0124: {
    literal:
      'In the first spring month of Kaiyuan 2, from the previous autumn until this month Guanzhong had no rain; many people were hungry, and envoys were sent with relief.',
    idiomatic:
      'In the first spring month of Kaiyuan 2 Guanzhong had had no rain since the previous autumn; famine spread and envoys were sent with relief.',
  },
  s0125: {
    literal: 'An edict sought forthright remonstrance and words that would benefit government.',
    idiomatic: 'An edict called for frank remonstrance and counsel that would improve government.',
  },
  s0126: {
    literal: 'Famous mountains and great rivers were all ordered to receive sacrificial prayers.',
    idiomatic: 'Sacrifices were ordered at famous mountains and great rivers.',
  },
  s0127: {
    literal:
      'On bingyin Purple Palace Director Yao Chong memorialized requesting inspection of monks and nuns throughout the realm; more than twenty thousand false ordinations were returned to lay life.',
    idiomatic:
      'On bingyin Yao Chong asked to inspect monks and nuns empire-wide; more than twenty thousand false ordinations were laicized.',
  },
  s0128: {
    literal:
      'On jiashen Bingzhou chief administrator and concurrent acting Left Guard grand general Xue Ne was equal in rank to the Purple Palace and Yellow Gate Offices and still commanded troops to campaign against the Xi and Khitan.',
    idiomatic:
      'On jiashen Xue Ne of Bingzhou joined the third rank at the Purple Palace and Yellow Gate Offices and still led troops against the Xi and Khitan.',
  },
  s0129: {
    literal:
      'In the second month the Turk qaghan Mojilie sent his son Tong\'e Tegin with troops to raid the Protectorate of the North Court; Right Swift-Cavalry general Guo Zhenzhen defeated them and beheaded Tong\'e beneath the wall.',
    idiomatic:
      'In the second month the Turk Mojilie sent his son Tong\'e Tegin against the North Court; Guo Zhenzhen crushed them and beheaded Tong\'e at the wall.',
  },
  s0130: {
    literal: 'On jiyou, because of drought, he personally reviewed prisoners.',
    idiomatic: 'On jiyou, in drought, he reviewed prisoners in person.',
  },
  s0131: {
    literal: 'The Directorate of Astronomy was changed and removed from subordination to the Secretariat.',
    idiomatic: 'The Directorate of Astronomy was reorganized and removed from the secretariat\'s oversight.',
  },
  s0132: {
    literal:
      'On the guihai new moon of the intercalary month Daoists, female Daoists, monks, and nuns were ordered to perform obeisance to their parents.',
    idiomatic:
      'On the guihai new moon of the intercalary month Daoists, nuns, monks, and nuns were ordered to bow to their parents.',
  },
  s0133: {
    literal: 'On dingmao the ten-circuit inspection commissioners were restored.',
    idiomatic: 'On dingmao the ten-circuit inspection commissioners were reinstated.',
  },
  s0134: {
    literal:
      'On jiwei Huoba Telifa Shishi and his wife, Mojilie\'s brother-in-law, came to defect and were enfeoffed as Prince of Yanshan commandery and made acting left guard assistant grand general.',
    idiomatic:
      'On jiwei Huoba Telifa Shishi, Mojilie\'s brother-in-law, and his wife defected; he was made Prince of Yanshan and acting left guard assistant general.',
  },
  s0135: {
    literal:
      'Purple Palace Vice Director and Duke of Zhao Wang Ju was demoted to prefect of Ze Prefecture with one hundred households in his fief; the rest of his rewards ceased.',
    idiomatic:
      'Wang Ju, purple palace vice director and Duke of Zhao, was demoted to Ze Prefecture with a hundred fief households; other rewards ceased.',
  },
  s0136: {
    literal: 'On dinghai Liu Youqiu became prefect of Mu Prefecture.',
    idiomatic: 'On dinghai Liu Youqiu was sent to Mu Prefecture.',
  },
  s0137: {
    literal:
      'On jiachen of the third month Qingzhou prefect and Duke of Xun Wei Anshi became acting prefect of Mian Prefecture;',
    idiomatic:
      'On jiachen Wei Anshi, Qingzhou prefect and Duke of Xun, became acting prefect of Mian;',
  },
  s0138: {
    literal:
      'Heir Apparent Mentor and Duke of Xiaoyao Wei Sili became acting prefect of Yue Prefecture;',
    idiomatic:
      'Wei Sili, heir apparent mentor and Duke of Xiaoyao, became acting prefect of Yue;',
  },
  s0139: {
    literal:
      'Special Advance in retirement Li Qiao, who had first followed his son to Yuan Prefecture, was further demoted to acting prefect of Chu Prefecture—all supernumerary appointments.',
    idiomatic:
      'Li Qiao, special advance in retirement, first exiled with his son to Yuan and then demoted to acting Chu prefect—all supernumerary posts.',
  },
  s0140: {
    literal: 'Last ninth month there had been an edict to destroy the Heavenly Axis; only this spring was it carried out.',
    idiomatic: 'An edict to destroy the Heavenly Axis had come last autumn; work began only this spring.',
  },
  s0141: {
    literal:
      'In the fifth summer month, on xinhai, Yellow Gate Supervisor Wei Zhigu became Minister of Works and ceased participation in government.',
    idiomatic:
      'In the fifth summer month, on xinhai, Wei Zhigu, yellow gate supervisor, became minister of works and left the council.',
  },
  s0142: {
    literal:
      'On dingsi Prince Chengqi of Song became prefect of Qi Prefecture, Prince Chengyi of Shen prefect of Bin Prefecture, and Prince Shouli of Bin prefect of Guo Prefecture—all affairs were entrusted to their aides.',
    idiomatic:
      'On dingsi Princes Chengqi, Chengyi, and Shouli were sent to Qi, Bin, and Guo as nominal prefects and left governing to their aides.',
  },
  s0143: {
    literal:
      'Pearls, jade, brocades, and other garments and curios issued from the inner palace were ordered burned before the main hall.',
    idiomatic:
      'Pearls, jade, brocades, and palace finery were ordered burned before the main hall.',
  },
  s0144: {
    literal: 'On yichou Zhang Rengui, minister of war in retirement and Duke of Han, died.',
    idiomatic: 'On yichou Zhang Rengui, retired minister of war and Duke of Han, died.',
  },
  s0145: {
    literal:
      'In the seventh month Xue Ne and deputy generals Du Binke, Cui Xuandao, and others with sixty thousand men on the Tanzhou route met the enemy on the Luan River and were defeated by them.',
    idiomatic:
      'In the seventh month Xue Ne and deputies Du Binke and Cui Xuandao led sixty thousand men on the Tanzhou route to the Luan River and were routed.',
  },
  s0146: {
    literal:
      'Ne and the others cast off their armor and fled back; their death sentences were commuted and they were stripped of office and made commoners.',
    idiomatic:
      'Xue Ne and the rest shed armor and fled; death was commuted to removal from office and commoner status.',
  },
  s0147: {
    literal: 'On xinwei Dou Xixian became Grand Mentor of the Heir Apparent.',
    idiomatic: 'On xinwei Dou Xixian became grand mentor of the heir apparent.',
  },
  s0148: {
    literal: 'Prince Chongmao of Xiang died at Liang Prefecture; his posthumous title was Emperor Shang.',
    idiomatic: 'Prince Chongmao of Xiang died at Liang; he was posthumously styled Emperor Shang.',
  },
  s0149: {
    literal:
      'On bingwu Zhaowen Institute scholar Liu Chong and Left Heir Apparent Liu Zixuan completed the two hundred juan Genealogies of Clans and presented them.',
    idiomatic:
      'On bingwu Liu Chong and Liu Zixuan finished the two-hundred-juan Genealogies of Clans and presented them.',
  },
  s0150: {
    literal: 'The former residence in Xingqing ward was made Xingqing Palace.',
    idiomatic: 'His old mansion in Xingqing ward became Xingqing Palace.',
  },
  s0151: {
    literal: 'Tutors to the princes were all discontinued.',
    idiomatic: 'All princely tutors were abolished.',
  },
  s0152: {
    literal:
      'Capital officials\' cross-sashes and tally-pouches were to be worn on audience days; outer officials on yamen days; on other days they ceased.',
    idiomatic:
      'Capital officials wore cross-sashes and tally-pouches on audience days, outer officials on yamen days, and neither on other days.',
  },
  s0153: {
    literal:
      'Tibet raided the Lintao army; it also ranged to raid Lan and Wei prefectures, plundering herd stations; Xue Ne was appointed acting left feathered-forest general and Longyou defense commissioner, leading Du Binke, Guo Zhiyun, Wang Jun, and An Sishun to resist.',
    idiomatic:
      'Tibet raided Lintao and ranged through Lan and Wei, plundering herds; Xue Ne became acting left feathered-forest general and Longyou commissioner, leading Du Binke, Guo Zhiyun, Wang Jun, and An Sishun against them.',
  },
  s0154: {
    literal:
      'Grand Master of Splendid Rites and Prince of Qi Fan became prefect of Hua Prefecture; Secretary Director and Prince of Xue Ye became prefect of Tong Prefecture.',
    idiomatic:
      'Prince Fan of Qi became Hua prefect; Prince Ye of Xue became Tong prefect.',
  },
  s0155: {
    literal: 'On wuwu of the eighth month western India sent envoys with tribute.',
    idiomatic: 'On wuwu western India sent tribute envoys.',
  },
  s0156: {
    literal: 'On wushen of the ninth month he visited the hot springs at Xinfeng.',
    idiomatic: 'On wushen of the ninth month he went to the Xinfeng hot springs.',
  },
  s0157: {
    literal:
      'On jiayin an edict said: "From antiquity emperors and kings have taken lavish burial as a warning, because it does no good to the dead and harms the living."',
    idiomatic:
      'On jiayin an edict said: "Since antiquity sage kings have warned against lavish burial—it profits the dead nothing and harms the living."',
  },
  s0158: {
    literal:
      'In recent times extravagance has been practiced in succession, each imitating the last until it became custom, draining households and often bringing ruin.',
    idiomatic:
      'Lately extravagance spread by imitation until custom drained households and brought ruin.',
  },
  s0159: {
    literal:
      'Yet the soul returns to heaven and the bright essence is already far;',
    idiomatic:
      'Yet the soul returns to heaven and the bright essence is far gone;',
  },
  s0160: {
    literal: 'choosing a grave in earth is only where longing remains.',
    idiomatic: 'choosing earth for a grave is only where longing remains.',
  },
  s0161: {
    literal: 'In antiquity there was no tumulus—this was not unenlightened.',
    idiomatic: 'The ancients used no tumulus—that was not ignorance.',
  },
  s0162: {
    literal:
      'The tomb is the true dwelling and already has its chambers; now separate estates are built and called "lower pavilions," and grave goods too are all competed in pride.',
    idiomatic:
      'The tomb is the true dwelling and already has chambers; now separate estates are built as "lower pavilions," and grave goods are rivaled in pride.',
  },
  s0163: {
    literal: 'This violates ritual and statute and is not fitting;',
    idiomatic: 'This violates ritual and law and is unfitting;',
  },
  s0164: {
    literal: 'exposing corpses and scattering bones truly springs from this.',
    idiomatic: 'exposing corpses and scattering bones truly spring from this.',
  },
  s0165: {
    literal:
      'Though there were earlier restrictions, the offices never made them clear, and mourning households had no standard.',
    idiomatic:
      'Though restrictions existed before, offices never enforced them and mourners had no standard.',
  },
  s0166: {
    literal:
      'Let the offices according to rank high and low set clear limits: grave goods shall have fixed colors and numbers and lengths and sizes;',
    idiomatic:
      'Offices shall set clear limits by rank: grave goods shall have fixed colors, numbers, and dimensions;',
  },
  s0167: {
    literal: 'estate pavilions below the tomb are all forbidden;',
    idiomatic: 'estate pavilions at the tomb are forbidden;',
  },
  s0168: {
    literal: 'tombs and burial grounds must follow simplicity;',
    idiomatic: 'tombs and grounds must stay simple;',
  },
  s0169: {
    literal: 'all funerary objects must not use gold or silver for ornament.',
    idiomatic: 'no funerary object may use gold or silver ornament.',
  },
  s0170: {
    literal: 'Whoever violates this shall first be beaten one hundred strokes.',
    idiomatic: 'Violators shall first receive one hundred strokes.',
  },
  s0171: {
    literal:
      'Prefectural and county chiefs who fail to investigate shall all be demoted and sent to distant posts."',
    idiomatic:
      'Magistrates who fail to investigate shall be demoted to distant posts."',
  },
  s0172: {
    literal: '"',
    idiomatic: '[End of edict.]',
  },
  s0173: {
    literal: 'In the tenth winter month, on wuwu, he returned from the hot springs.',
    idiomatic: 'In the tenth winter month, on wuwu, he came back from the hot springs.',
  },
  s0174: {
    literal:
      'Xue Ne defeated Tibet west of Wei Prefecture at the Wujie post station, beheading ten thousand seven hundred and taking seventy-seven thousand horses and forty thousand head of cattle and sheep.',
    idiomatic:
      'Xue Ne crushed Tibet west of Wei at Wujie post, taking ten thousand seven hundred heads, seventy-seven thousand horses, and forty thousand cattle and sheep.',
  },
  s0175: {
    literal:
      'Feng\'an army commander and acting general Wang Haibin fought fiercely in the van and died.',
    idiomatic:
      'Wang Haibin, Feng\'an commander and acting general, fought fiercely in the van and fell.',
  },
  s0176: {
    literal: 'On gengyin Emperor Shang was buried on the western plain of Wugong.',
    idiomatic: 'On gengyin Emperor Shang was buried on Wugong\'s western plain.',
  },
  s0177: {
    literal:
      'On yichou Princes Sizhen, Sichu, and Sixuan were enfeoffed as Prince of Zeng, Prince of E, and Prince of Yan respectively.',
    idiomatic:
      'On yichou Princes Sizhen, Sichu, and Sixuan were made princes of Zeng, E, and Yan.',
  },
  s0178: {
    literal:
      'At that time Right Valiant Guard lieutenant Zhou Qingli served as Annan maritime trade commissioner and, with the Persian monk Guangzao, devised strange contrivances to present within the palace.',
    idiomatic:
      'Right valiant guard lieutenant Zhou Qingli, Annan maritime trade commissioner, and the Persian monk Guangzao devised curios for the inner palace.',
  },
  s0179: {
    literal:
      'Selection supervisor and palace attendant Liu Ze memorialized in remonstrance; the emperor praised his frankness.',
    idiomatic:
      'Selection supervisor Liu Ze remonstrated; the emperor praised his frankness.',
  },
  s0180: {
    literal:
      'In the first spring month of Kaiyuan 3, on dinghai, Prince Siqian of Ying was installed as crown prince; capital punishment and below were reduced in severity, and public feasting lasted three days.',
    idiomatic:
      'In the first spring month of Kaiyuan 3, on dinghai, Prince Siqian of Ying was made crown prince; capital crimes were commuted and the realm feasted three days.',
  },
  s0181: {
    literal: 'On guimao Yellow Gate Vice Director Lu Huaizhen became acting Yellow Gate Supervisor.',
    idiomatic: 'On guimao Lu Huaizhen became acting yellow gate supervisor.',
  },
  s0182: {
    literal: 'On jiachen Minister of Works Wei Zhigu died.',
    idiomatic: 'On jiachen Wei Zhigu, minister of works, died.',
  },
  s0183: {
    literal: 'In the second month the catching of carp throughout the realm was forbidden.',
    idiomatic: 'In the second month carp fishing was banned empire-wide.',
  },
  s0184: {
    literal:
      'The ten surnames\' left wing—the five Dulu tribes—and right wing—the five Nushibi and five Irkin—and Goguryeo\'s Molichi Gao Wenjian, the Tiele chieftain Zhediesi Tai, and others each led their bands to defect from the Turks in succession; in all more than two thousand tents came.',
    idiomatic:
      'The Ten Surnames\' left and right wings, Goguryeo\'s Molichi Gao Wenjian, Tiele chief Zhediesi Tai, and others led more than two thousand tents to defect from the Turks in succession.',
  },
  s0185: {
    literal: 'Xu and Tang prefectures were divided to establish Xian Prefecture.',
    idiomatic: 'Xu and Tang were split to establish Xian Prefecture.',
  },
  s0186: {
    literal:
      'In the fourth summer month Prince Fan of Qi was made concurrent prefect of Guo Prefecture and Prince Ye of Xue concurrent prefect of You Prefecture.',
    idiomatic:
      'In the fourth summer month Prince Fan became concurrent Guo prefect and Prince Ye concurrent You prefect.',
  },
  s0187: {
    literal:
      'In the sixth month great locusts struck the Shandong prefectures; in flight they blotted the light, on the ground they devoured the crops, and their sound was like wind and rain.',
    idiomatic:
      'In the sixth month locusts swarmed Shandong, blotting the sun, devouring the fields, roaring like wind and rain.',
  },
  s0188: {
    literal:
      'Purple Palace Director Yao Chong memorialized requesting censors sent to each circuit to urge officials to drive and burn the pests and bury them, to save the autumn harvest; this was approved.',
    idiomatic:
      'Yao Chong asked censors sent to every circuit to drive, burn, and bury locusts and save the harvest; the throne agreed.',
  },
  s0189: {
    literal: 'That year the fields yielded a harvest and the people were not greatly hungry.',
    idiomatic: 'That year the harvest held and famine was mild.',
  },
  s0190: {
    literal: 'In the seventh month Minister of Punishments Li Rizhi died.',
    idiomatic: 'In the seventh month Li Rizhi, minister of punishments, died.',
  },
  s0191: {
    literal:
      'An edict said: "In the leisure of hearing government I often read the histories; matters touching principle and the Way truly engage my heart, and where there are doubts I sometimes need to inquire."',
    idiomatic:
      'An edict said: "In leisure from government I read histories; matters of principle engage me, and doubts must be answered."',
  },
  s0192: {
    literal: 'Let one aged Confucian of broad learning enter daily to lecture within.',
    idiomatic: 'One aged Confucian scholar was to enter daily to lecture at court.',
  },
  s0193: {
    literal:
      'Grand Master of Splendid Rites Ma Huaisu was made Left Regular Attendant and, with Right Regular Attendant Chu Wuliang, both served as lecturers.',
    idiomatic:
      'Ma Huaisu became left regular attendant and, with Chu Wuliang, served as court lecturers.',
  },
  s0194: {
    literal: 'On jiazi he visited the Fengquan hot springs in Mei County.',
    idiomatic: 'On jiazi he went to the Fengquan hot springs in Mei County.',
  },
  s0195: {
    literal: 'On yimao he returned from the Fengquan hot springs.',
    idiomatic: 'On yimao he returned from Fengquan.',
  },
  s0196: {
    literal: 'On yiyou he visited the Xinfeng hot springs.',
    idiomatic: 'On yiyou he went to the Xinfeng hot springs.',
  },
  s0197: {
    literal: 'On dinghai the sorcerer-rebel Cui Ziyan and others entered Xiang Prefecture and rose in revolt.',
    idiomatic: 'On dinghai the sorcerer Cui Ziyan and others rebelled in Xiang Prefecture.',
  },
  s0198: {
    literal: 'On wuzi the prefectural offices suppressed and pacified them.',
    idiomatic: 'On wuzi the prefectural forces put them down.',
  },
  s0199: {
    literal: 'On jiawu he returned from the hot springs.',
    idiomatic: 'On jiawu he came back from the hot springs.',
  },
  s0200: {
    literal:
      'On gengwu the Armory Office was made the Armory Directorate and officials were appointed.',
    idiomatic:
      'On gengwu the Armory Office became the Armory Directorate with a full staff.',
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
if (data.metadata.chapter !== '008') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 008; standalone T ready (${Object.keys(T).length} entries).`
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
