#!/usr/bin/env node
/** Batch 11: s1001–s1100 (Jiutangshu ch.019, Yizong–Xizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1001;
const END = 1100;

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
  s1001: {
    literal: 'At the time overall commander Wang Duo\'s forward commander Li Xi held Tanzhou with fifty thousand men, and with allied militia was said to number one hundred thousand.',
    idiomatic: 'Wang Duo\'s forward commander Li Xi held Tanzhou with fifty thousand men and allied militia said to number one hundred thousand.',
  },
  s1002: {
    literal: 'The rebels from Guiyang lashed thousands of rafts; riding the flood down the Xiang they reached Tanzhou at once, stormed the city, and took it in a day.',
    idiomatic: 'Rebels rafted down the Xiang flood, reached Tanzhou, and stormed the city in a day.',
  },
  s1003: {
    literal: 'Li Xi barely escaped with his life; fifty thousand soldiers were killed by the rebels and corpses choked the river.',
    idiomatic: 'Li Xi alone escaped; fifty thousand troops were slaughtered and corpses choked the river.',
  },
  s1004: {
    literal: 'The rebel general Shang Rang pressed downriver in victory and advanced on Jiangling.',
    idiomatic: 'Shang Rang pressed downriver toward Jiangling.',
  },
  s1005: {
    literal: 'Wang Duo, hearing of Xi\'s defeat, abandoned the city and fled to Xiangyang.',
    idiomatic: 'Wang Duo fled to Xiangyang on news of Xi\'s defeat.',
  },
  s1006: {
    literal: 'Deputy Liu Hanhong plundered Jiangling\'s people with unbearable cruelty; gentry and commoners fled into the hills and Jiangling was burned nearly bare.',
    idiomatic: 'Liu Hanhong ravaged Jiangling until the city was nearly burned bare and the people fled to the hills.',
  },
  s1007: {
    literal: 'More than half a month later the rebel host finally reached Jiangling.',
    idiomatic: 'The rebel host reached Jiangling only after half a month.',
  },
  s1008: {
    literal: 'Third month: the rebels massed to strike Xiangyang; Jiangxi campaign commissioner Cao Quanchao and Xiangyang military commissioner Liu Jurong planned to resist.',
    idiomatic: 'In the third month Cao Quanchao and Liu Jurong prepared to block the rebels from Xiangyang.',
  },
  s1009: {
    literal: 'They camped at Jingmen; ten thousand rebels held Tuanlin Post.',
    idiomatic: 'The allies camped at Jingmen while ten thousand rebels held Tuanlin Post.',
  },
  s1010: {
    literal: 'Quanchao had Jurong array all elite armor in the woods while he himself challenged with cavalry, feigned defeat, and fled.',
    idiomatic: 'Quanchao hid Jurong\'s elite troops in the woods and feigned a cavalry rout.',
  },
  s1011: {
    literal: 'The rebels gave chase in force; nearing Jingmen their ranks broke; Jurong sprang the ambush and the rebels fled in rout.',
    idiomatic: 'The rebels broke ranks at Jingmen; Jurong\'s ambush routed them.',
  },
  s1012: {
    literal: 'Quanchao\'s iron cavalry pursued hotly; by Jiangling seven or eight in ten were captured.',
    idiomatic: 'Quanchao\'s pursuit captured seven or eight rebels in ten by Jiangling.',
  },
  s1013: {
    literal: 'Huang Chao and Shang Rang forded the river with the remnant.',
    idiomatic: 'Huang Chao and Shang Rang crossed the river with survivors.',
  },
  s1014: {
    literal: 'Quanchao was crossing the river to strike the rebels when an urgent edict arrived making Duan Yanmo Jiangxi military commissioner; Quanchao turned back.',
    idiomatic: 'An edict recalled Quanchao when Duan Yanmo took Jiangxi.',
  },
  s1015: {
    literal: 'The rebels then led their fleet east, attacked Ezhou, and took its outer city.',
    idiomatic: 'The rebels sailed east, took Ezhou\'s outer city.',
  },
  s1016: {
    literal: 'When Quanchao arrived to rescue, the rebels turned to Jiangxi and seized fifteen prefectures including Rao, Xin, Hang, Qu, Xuan, She, and Chi.',
    idiomatic: 'Quanchao\'s rescue failed; rebels overran fifteen Jiangxi prefectures.',
  },
  s1017: {
    literal: 'Quanchao remained in Jiangxi.',
    idiomatic: 'Quanchao stayed in Jiangxi.',
  },
  s1018: {
    literal: 'The court, finding Wang Duo\'s overall command fruitless, made Huainan military commissioner Gao Pian overall commander of the campaign armies.',
    idiomatic: 'Wang Duo failed; Gao Pian became overall campaign commander.',
  },
  s1019: {
    literal: 'Pian ordered his great general Zhang Lin to cross the river against the rebels and won repeated victories.',
    idiomatic: 'Zhang Lin crossed the Yangzi and won repeated victories.',
  },
  s1020: {
    literal: 'Plague struck the rebels; their general Li Hanzhi defected to Huainan with a division and their spirit waned.',
    idiomatic: 'Rebel plague and Li Hanzhi\'s defection to Huainan broke rebel morale.',
  },
  s1021: {
    literal: 'That month Shatuo raided Xin and Dai; an edict made Ruzhou defense commissioner Zhuge Shuang northern campaign vice-recruiter and sent eastern-capital defense troops to Dai.',
    idiomatic: 'Shatuo raided Xin and Dai; Zhuge Shuang led eastern-capital troops north.',
  },
  s1022: {
    literal: 'Fourth month, jiazi new moon: great hail fell and wind uprooted twelve or thirteen in ten of the two capitals\' street trees; in Luoyang\'s Changxia Gate seven or eight in ten ancient locusts fell; palace finials were torn away.',
    idiomatic: 'On jiazi hail and wind ravaged both capitals and stripped palace roofs.',
  },
  s1023: {
    literal: 'On dingyou an order made Acting Minister of Personnel, former Director of Sacrifices, Pillar of State, Duke of Longxi with three thousand households Li Zhuo Grand Master of Splendid Happiness, Acting Right Vice Premier, Censor-in-Chief, and overall recruiter for Yun and Shuofang circuits;',
    idiomatic: 'On dingyou Li Zhuo took overall command of the northern campaign.',
  },
  s1024: {
    literal: 'The armies of Li Xiaochang, Li Yuanli, Zhuge Shuang, Wang Chongying, Zhu Mei, and Xin-Dai local militia were all placed under Zhuo\'s orders.',
    idiomatic: 'Northern armies and militia were placed under Zhuo.',
  },
  s1025: {
    literal: 'Inner attendant Zhang Cunli was made chief provisions commissioner; aide Cui Chan was made deputy commissioner for arrangements.',
    idiomatic: 'Zhang Cunli and Cui Chan managed campaign provisions.',
  },
  s1026: {
    literal: 'Sixth month: northern recruiter Li Zhuo, Youzhou commissioner Li Keju, and Togon chief Helian Duo marched on Li Keyong at Yunzhou.',
    idiomatic: 'In the sixth month Zhuo, Keju, and Helian Duo besieged Keyong at Yunzhou.',
  },
  s1027: {
    literal: 'Keyong had his great general Fu Wenda hold Yunzhou and Gao Wenji hold Shuozhou.',
    idiomatic: 'Keyong left Fu Wenda at Yun and Gao Wenji at Shuo.',
  },
  s1028: {
    literal: 'Helian Duo persuaded Gao Wenji to return to the dynasty; Wenji with Shatuo leaders Li Youjin, Sagal chief Mi Haiwan, and Anqing chief Shi Jingcun surrendered former Yunzhou to Zhuo.',
    idiomatic: 'Gao Wenji and Shatuo allies surrendered Yun to Zhuo.',
  },
  s1029: {
    literal: 'Keyong led troops to meet the Yan army at Xiongwu.',
    idiomatic: 'Keyong met the Yan army at Xiongwu.',
  },
  s1030: {
    literal: 'Seventh month: the three Shatuo tribes under Li Youjin opened the gates to the imperial army; Keyong rushed to aid them, was pursued by Li Keju, and suffered great defeat at Yao\'er Ridge.',
    idiomatic: 'Youjin opened the gates; Keyong was crushed at Yao\'er Ridge.',
  },
  s1031: {
    literal: 'Zhuo and Helian Duo defeated him again at Yunzhou, accepted Fu Wenda\'s surrender, and Keyong\'s followers scattered; he alone fled north into the Tatabi with Guochang and his brothers.',
    idiomatic: 'Keyong fled north to the Tatabi after defeat at Yunzhou.',
  },
  s1032: {
    literal: 'Helian Duo was made Yunzhou prefect and Datong defense commissioner; Bai Yicheng was made Yun prefect; Mi Haiwan was made Shuo prefect; Li Keju was advanced Acting Minister of Works and Grand Councillor.',
    idiomatic: 'Togon and Sagal chiefs took the border posts; Keju became councillor.',
  },
  s1033: {
    literal: 'Eighth month: Huang Chao\'s host crossed the river and raided Huainan.',
    idiomatic: 'In the eighth month Huang Chao raided Huainan.',
  },
  s1034: {
    literal: 'That spring the rebels at Xinzhou were stricken with plague and many died.',
    idiomatic: 'Plague at Xinzhou decimated the rebels.',
  },
  s1035: {
    literal: 'Huainan general Zhang Lin pressed them hard; the rebels feared him, bribed Lin with gold, and wrote Gao Pian begging life and return to the dynasty.',
    idiomatic: 'Rebels bribed Zhang Lin and begged Pian for amnesty.',
  },
  s1036: {
    literal: 'Pian believed them, treated their envoys generously, and promised to seek a commission.',
    idiomatic: 'Pian believed the rebels and promised them a commission.',
  },
  s1037: {
    literal: 'Tens of thousands from Zhaoyi, Wuning, and Yiwu had reached Huainan; Pian wished the merit for himself, memorialized that the rebels were nearly destroyed, needed no other circuits\' troops, and sent them all back north.',
    idiomatic: 'Pian sent allied armies home, claiming the rebels were nearly finished.',
  },
  s1038: {
    literal: 'Learning the armies had withdrawn and no commission was granted, the rebels raged, broke with Pian, and offered battle.',
    idiomatic: 'Denied a commission, the rebels broke with Pian and fought.',
  },
  s1039: {
    literal: 'Pian in anger ordered Zhang Lin to attack; Lin was defeated and killed in battle.',
    idiomatic: 'Pian sent Zhang Lin to attack; the rebels killed him.',
  },
  s1040: {
    literal: 'The rebels crossed the river in victory, struck Tianchang and Liuhe, and Pian could not resist—only breaching the Chengdeng sluice to protect himself.',
    idiomatic: 'Rebels crossed into Tianchang; Pian could only flood Chengdeng to shield himself.',
  },
  s1041: {
    literal: 'The court, hearing the rebels revived, was greatly afraid and ordered Henan circuits\' armies to camp at Yinshui.',
    idiomatic: 'The court massed Henan troops at Yinshui.',
  },
  s1042: {
    literal: 'Government armies gathered in force; the rebels had not yet crossed north.',
    idiomatic: 'Armies gathered; rebels had not crossed the Huai north.',
  },
  s1043: {
    literal: 'Yanzhou military commissioner Qi Kerang camped at Ruzhou.',
    idiomatic: 'Qi Kerang held Ruzhou.',
  },
  s1044: {
    literal: 'Ninth month: three thousand Xuzhou troops went to Yinshui and passed through Xu.',
    idiomatic: 'Three thousand Xuzhou troops marched through Xu toward Yinshui.',
  },
  s1045: {
    literal: 'Xu commissioner Xue Neng had formerly been Xu commander and knew the army\'s feelings.',
    idiomatic: 'Xue Neng, once Xu commander, knew the troops\' mood.',
  },
  s1046: {
    literal: 'Xu officers asked lodging; Neng, thinking Xu troops grateful, quartered them inside the prefecture.',
    idiomatic: 'Neng quartered Xu troops inside the city out of old goodwill.',
  },
  s1047: {
    literal: 'Xu troops feared attack by Xuzhou men; Xu general Zhou Ji returned from Yinshui with garrison troops, drove out Xue Neng, and seized the city.',
    idiomatic: 'Zhou Ji expelled Xue Neng and seized Xu.',
  },
  s1048: {
    literal: 'Xuzhou troops reached Heyin, heard of the Xu mutiny; Xu commander Shi Bo also returned from garrison duty, drove out commissioner Zhi Xiang.',
    idiomatic: 'Shi Bo expelled Zhi Xiang at Xuzhou after Xu\'s mutiny.',
  },
  s1049: {
    literal: 'Qi Kerang, fearing his troops would be attacked, also returned to Yanzhou.',
    idiomatic: 'Qi Kerang retreated to Yanzhou.',
  },
  s1050: {
    literal: 'The Yinshui armies all dispersed.',
    idiomatic: 'The Yinshui camp dissolved.',
  },
  s1051: {
    literal: 'Hearing this, in the tenth month the rebels crossed the Huai in full force.',
    idiomatic: 'In the tenth month the rebels crossed the Huai in force.',
  },
  s1052: {
    literal: 'Huang Chao styled himself Great General Over All the Land; his host was rich; north of the Huai they marched in order, did not plunder goods, but only pressed able-bodied men as soldiers.',
    idiomatic: 'Huang Chao styled himself ruler of all lands; north of the Huai his host pressed men into service without looting.',
  },
  s1053: {
    literal: 'Eleventh month, xinhai new moon.',
    idiomatic: 'The eleventh month opened on xinhai.',
  },
  s1054: {
    literal: 'On jisi the rebels took the eastern capital; acting eastern-capital prefect Liu Yunzhang led branch-office officials to welcome them; the rebels supplied themselves and departed and the wards were calm.',
    idiomatic: 'On jisi rebels entered Luoyang; Liu Yunzhang welcomed them and the city stayed calm.',
  },
  s1055: {
    literal: 'On renshen they took Guo prefecture.',
    idiomatic: 'On renshen Guo fell.',
  },
  s1056: {
    literal: 'On bingzi they attacked Tong Pass; defending generals fled at sight of them.',
    idiomatic: 'On bingzi Tong Pass defenders fled.',
  },
  s1057: {
    literal: 'Twelfth month, gengchen new moon.',
    idiomatic: 'The twelfth month opened on gengchen.',
  },
  s1058: {
    literal: 'On xinsi the rebels held Tong Pass.',
    idiomatic: 'On xinsi rebels held Tong Pass.',
  },
  s1059: {
    literal: 'Left Army Commandant Tian Lingzi monopolized power; Chancellor Lu Xie curried favor; together they erred in counsel to the point of ruin.',
    idiomatic: 'Tian Lingzi and Lu Xie misruled the court into collapse.',
  },
  s1060: {
    literal: 'Lingzi feared blame would fall on him, asked that Xie be demoted, and appointed academicians Wang Hui and Pei Che as chancellors.',
    idiomatic: 'Lingzi demoted Lu Xie and made Wang Hui and Pei Che chancellors.',
  },
  s1061: {
    literal: 'On jiashen an edict made Vice Minister of Revenue, Hanlin academician Wang Hui and Pei Che Grand Councillors at their present ranks.',
    idiomatic: 'On jiashen Wang Hui and Pei Che joined the council.',
  },
  s1062: {
    literal: 'Right Vice Premier, Gate Director, Grand Councillor Lu Xie was demoted to heir-apparent guest.',
    idiomatic: 'Lu Xie was demoted to heir-apparent guest.',
  },
  s1063: {
    literal: 'Xie, hearing the rebels had come, took poison and died.',
    idiomatic: 'Lu Xie poisoned himself on news of the rebels.',
  },
  s1064: {
    literal: 'That day the Emperor with several hundred princes, consorts, and consorts rode from the inner city through Hanguang Hall\'s Golden Light Gate to take refuge in the south; the hundred civil and military officials did not know and none followed; the capital was calm.',
    idiomatic: 'That day the emperor fled south unseen by officials; the capital seemed calm.',
  },
  s1065: {
    literal: 'That evening the rebels entered the capital; Right Brave Guards general Zhang Zhifang led a dozen martial officers to welcome Huang Chao at Potou.',
    idiomatic: 'At dusk Zhang Zhifang welcomed Huang Chao into Chang\'an.',
  },
  s1066: {
    literal: 'On renchen Huang Chao seized the inner palace, usurped the title Great Qi, and proclaimed the era Jintong.',
    idiomatic: 'On renchen Huang Chao declared the Great Qi and era Jintong.',
  },
  s1067: {
    literal: 'He displayed ritual objects and issued a false amnesty from Danfeng Gate.',
    idiomatic: 'He displayed regalia and issued a false amnesty at Danfeng Gate.',
  },
  s1068: {
    literal: 'Erudite Pi Rixiu and presented scholar Shen Yunxiang were made academicians.',
    idiomatic: 'Pi Rixiu and Shen Yunxiang became rebel academicians.',
  },
  s1069: {
    literal: 'The false amnesty read: "The rites of yielding the throne have long been abandoned; flight and hiding rightly stir distress.',
    idiomatic: 'The false amnesty lamented abandoned abdication rites and imperial flight.',
  },
  s1070: {
    literal: 'Officials of third rank and above are all suspended from current posts; fourth rank and below should return to former positions.',
    idiomatic: 'Third-rank officials were suspended; fourth rank and below restored.',
  },
  s1071: {
    literal: '" Zhao Zhang was made Secretariat Director; Shang Rang Grand Marshal; Cui Kui Secretariat Vice Director and Grand Councillor.',
    idiomatic: 'Zhao Zhang, Shang Rang, and Cui Kui took top rebel posts.',
  },
  s1072: {
    literal: 'Chancellors Dou Lu and Cui Hang, former Left Vice Premier Liu Ye, heir tutor Pei Zhan, Vice Censor-in-Chief Zhao Meng, Vice Minister of Punishments Li Pu, and former chancellor Yu Cong—all missed the imperial train, hid in lanes, were seized by rebels, and killed.',
    idiomatic: 'Missing ministers hiding in the city were seized and killed.',
  },
  s1073: {
    literal: 'Director of Works Zheng Qi and Bureau of Stores director Zheng Xi refused to serve the rebels; whole families hanged themselves.',
    idiomatic: 'Zheng Qi and Zheng Xi hanged their families rather than serve rebels.',
  },
  s1074: {
    literal: 'Zhonghe 1, spring, first month, gengxu new moon: the imperial train was at Xingyuan.',
    idiomatic: 'Zhonghe 1 opened with the court at Xingyuan.',
  },
  s1075: {
    literal: 'Hanlin expository academician, Vice Minister of Revenue, edict drafter Xiao Zhan was made Vice Minister of War and salt-and-iron transport commissioner;',
    idiomatic: 'Xiao Zhan took war and salt transport.',
  },
  s1076: {
    literal: 'soon also Grand Councillor at his present rank, retaining the commission.',
    idiomatic: 'He soon joined the Grand Council while keeping transport.',
  },
  s1077: {
    literal: 'Suzhou prefect Liu Hanhong was made Yuezhou prefect, Zhendong army commander, and Zhejiang East observation commissioner.',
    idiomatic: 'Liu Hanhong received Zhedong command.',
  },
  s1078: {
    literal: 'An edict ordered Taiyuan commissioner Zheng Congdang to send this circuit\'s troops with northern vice-recruiter Zhuge Shuang, Dai prefect Zhu Mei, Xiazhou officer Li Sigong, and other campaign forces to the capital against the rebels.',
    idiomatic: 'Border armies were ordered to march on Chang\'an.',
  },
  s1079: {
    literal: 'Hezhong horse-and-foot chief inspector Wang Chongrong expelled his commander Li Du and styled himself acting commander.',
    idiomatic: 'Wang Chongrong expelled Li Du at Hezhong.',
  },
  s1080: {
    literal: 'Second month: northern campaign overseer Chen Jingsi led Shatuo, Sagal, Anqing, and Togon—thirty thousand—to aid Guanzhong and halted at Jiangzhou.',
    idiomatic: 'Chen Jingsi led thirty thousand allies to Jiangzhou.',
  },
  s1081: {
    literal: 'Shatuo leader Zhai Ji plundered Jiangzhou and rebelled back; Jingsi knew him unusable, sent envoys to the court asking pardon for Li Guochang and his sons to redeem guilt by fighting rebels—the request was granted.',
    idiomatic: 'Zhai Ji rebelled; the court pardoned the Li clan to fight rebels.',
  },
  s1082: {
    literal: 'Third month: Chen Jingsi carried the edict into the Tatabi, summoned Li Keyong to camp at Yunzhou; Keyong thereupon plundered garrisons north of Yanmen.',
    idiomatic: 'Keyong answered the summons but plundered north of Yanmen.',
  },
  s1083: {
    literal: 'Fengxiang commissioner Zheng Tian was made Acting Minister of Works, Gate Director, Grand Councillor, and overall commander of western capital circuits; with Cheng Zongchu, Qiu Gongyu, Li Xiaochang, and Tuoba Sigong he allied armies and issued a manifesto to the realm.',
    idiomatic: 'Zheng Tian rallied western armies against the rebels.',
  },
  s1084: {
    literal: 'Huang Chao sent Lin Yan and Shang Rang with tens of thousands against Fengxiang; Zheng Tian met them and routed the rebels at Longwei Slope.',
    idiomatic: 'Zheng Tian crushed rebels at Longwei Slope.',
  },
  s1085: {
    literal: 'Fourth month: former Datong defense commissioner Li Keyong was made Acting Minister of Works, concurrent Dai prefect, and northern campaign military commissioner.',
    idiomatic: 'Keyong received northern command and Dai prefecture.',
  },
  s1086: {
    literal: 'Fifth month: Keyong reached Dai, then led ten thousand tribal and Han troops south through Shiling Pass, claiming imperial orders to rescue Chang\'an.',
    idiomatic: 'Keyong marched ten thousand south through Shiling to save Chang\'an.',
  },
  s1087: {
    literal: 'On dingsi Shatuo troops reached Taiyuan; Zheng Congdang supplied grain.',
    idiomatic: 'On dingsi Shatuo reached Taiyuan and were fed.',
  },
  s1088: {
    literal: 'On xinyou Shatuo asked battle bounty money; Congdang gave one thousand strings cash and one thousand shi grain.',
    idiomatic: 'On xinyou Congdang gave meager bounty; Keyong grew angry.',
  },
  s1089: {
    literal: 'Keyong in anger let his troops plunder widely.',
    idiomatic: 'Keyong\'s troops plundered Taiyuan.',
  },
  s1090: {
    literal: 'Congdang sought aid from Zhenwu; Qibi Tong came in person and fought Shatuo at Jinwang Ridge.',
    idiomatic: 'Qibi Tong fought Shatuo at Jinwang Ridge.',
  },
  s1091: {
    literal: 'Shatuo fled, seized Yuci and Yangqu, then withdrew.',
    idiomatic: 'Shatuo seized Yuci and Yangqu and withdrew.',
  },
  s1092: {
    literal: 'That day great wind blew and dust rained from heaven.',
    idiomatic: 'That day wind blew and dust fell like rain.',
  },
  s1093: {
    literal: 'Special Emeritus, Right Vice Premier Zhao Yin died and was posthumously made Minister of Works.',
    idiomatic: 'Zhao Yin died and was posthumously Minister of Works.',
  },
  s1094: {
    literal: 'Sixth month: Shatuo withdrew to Dai.',
    idiomatic: 'In the sixth month Shatuo returned to Dai.',
  },
  s1095: {
    literal: 'The imperial train reached Chengdu; Xichuan commissioner Chen Jingxuan came in person to welcome.',
    idiomatic: 'The court reached Chengdu; Chen Jingxuan welcomed it.',
  },
  s1096: {
    literal: 'Seventh month, dingwei new moon.',
    idiomatic: 'The seventh month opened on dingwei.',
  },
  s1097: {
    literal: 'On yimao the train reached western Shu.',
    idiomatic: 'On yimao the court entered western Shu.',
  },
  s1098: {
    literal: 'On dingsi he held court at the Chengdu prefectural hall, changed Guangming 2 to Zhonghe 1, and proclaimed a great amnesty.',
    idiomatic: 'On dingsi the era became Zhonghe with universal amnesty.',
  },
  s1099: {
    literal: 'Vice Minister of War and revenue commissioner Wei Zhaodu was made Grand Councillor at his present rank.',
    idiomatic: 'Wei Zhaodu joined the council.',
  },
  s1100: {
    literal: 'Attendant-in-ordinary Wang Duo was made Acting Grand Preceptor, Secretariat Director, concurrent Hua prefect, Yicheng army commander, Zheng-Hua observation commissioner, and overall commander of the capital\'s four-sided campaign;',
    idiomatic: 'Wang Duo became overall commander of the capital campaign.',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
