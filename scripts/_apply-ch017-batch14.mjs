#!/usr/bin/env node
/** Batch 14: s1301–s1400 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1301;
const END = 1400;

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

const T = {  s1301: {
    literal: 'On jiashen Left Divine Strategy great general Zhao Dan was made Bian-Fang military commissioner.',
    idiomatic: 'On jiashen Zhao Dan took Bian-Fang.',
  },
  s1302: {
    literal: 'On jiawu Secretariat drafter Quan Xu was demoted to Zhengzhou prefect.',
    idiomatic: 'On jiawu Quan Xu was sent to Zhengzhou.',
  },
  s1303: {
    literal: 'On bingshen inner attendants Yang Chenghe was settled at Huanzhou, Wei Yuansu at Xiangzhou, Wang Jianyan at Sizhou — all escorted under guard.',
    idiomatic: 'On bingshen three eunuchs were exiled under guard.',
  },
  s1304: {
    literal: 'It was said that when Li Zongmin was Vice Minister of Personnel he asked the consort\'s son-in-law Shen through palace woman Song Ruoxian for the premiership; Chenghe, Jianyan, and Yuansu had conveyed it.',
    idiomatic: 'They had brokered Li Zongmin\'s bid for office through palace channels.',
  },
  s1305: {
    literal: 'Zongmin\'s partisans Yang Yuqing, Li Han, and Xiao Huan were all demoted again.',
    idiomatic: 'Yang Yuqing, Li Han, and Xiao Huan were demoted again.',
  },
  s1306: {
    literal: 'On renyin Secretariat drafter Gao Yuanyu was demoted to Langzhou prefect.',
    idiomatic: 'On renyin Gao Yuanyu was sent to Langzhou.',
  },
  s1307: {
    literal: 'Yuanyu had drafted Zheng Zhu\'s appointment and praised his medical skill; Zhu bore a grudge.',
    idiomatic: 'Gao Yuanyu had praised Zheng Zhu in an appointment text and paid for it.',
  },
  s1308: {
    literal: 'Suzhou prefect Lu Zhouren was made Hunan observation commissioner.',
    idiomatic: 'Lu Zhouren took Hunan.',
  },
  s1309: {
    literal: 'Ninth month, guimao new moon: villains Li Xun and Zheng Zhu held power; those who would not join them were instantly demoted; the court trembled and men could not feel secure.',
    idiomatic: 'On guimao Li Xun and Zheng Zhu ruled by terror, demoting dissent at once.',
  },
  s1310: {
    literal: 'That day an edict said: "I inherit Heaven\'s order yet govern without full clarity, laboring with open heart to seek the worthy and urging broad virtue to embrace the multitude."',
    idiomatic: 'That day the throne confessed imperfect rule yet vowed to seek worthies and embrace the people.',
  },
  s1311: {
    literal: '"Lately the councilors strayed from harmony while the staff fanned faction; they rushed together and truly shattered the statutes."',
    idiomatic: '"Councilors had lost harmony and clerks had fanned factions," the edict said.',
  },
  s1312: {
    literal: '"Hence sweet grass and stinkweed shared one vessel, worthy and unworthy ran together, the retired were men out of season, and those at the gate had fawning guests."',
    idiomatic: '"Worthies and sycophants mingled at court," it lamented.',
  },
  s1313: {
    literal: '"Distorted air lay choked and unquiet; yet we hoped for seasonable yin and yang, no plague, a clean court and ordered ranks — from antiquity to now, never seen."',
    idiomatic: '"Yet we still hoped for order while corruption choked the realm."',
  },
  s1314: {
    literal: '"Now the court law is proclaimed anew and the shallow wind changed; partisan hangers-on are swept away and honest custom restored; let every officer renew his charge."',
    idiomatic: '"Now partisans are swept out and honest custom is to be restored."',
  },
  s1315: {
    literal: '"If among the court there is still fear, or idle pointing that unsettles men, today we make it plain and show our intent."',
    idiomatic: '"Let no man fear idle accusation," the edict promised.',
  },
  s1316: {
    literal: '"All tied to Zongmin or Deyu, new or old, students or former clerks — except those already dismissed before today — are not to be questioned."',
    idiomatic: '"All ties to Zongmin or Deyu, save prior dismissals, shall go unpunished."',
  },
  s1317: {
    literal: 'On xinhai heir-apparent guest at the eastern capital Bai Juyi was made Tongzhou prefect, replacing Yang Rushi;',
    idiomatic: 'On xinhai Bai Juyi took Tongzhou, replacing Yang Rushi;',
  },
  s1318: {
    literal: 'Rushi was made Director of the Bureau of Tributary Vehicles.',
    idiomatic: 'Yang Rushi took the Tributary Vehicles bureau.',
  },
  s1319: {
    literal: 'On yihai Jingyuan military commissioner Liu Mian was made Zhenwu-Linsheng military commissioner.',
    idiomatic: 'On yihai Liu Mian took Zhenwu-Linsheng.',
  },
  s1320: {
    literal: 'On bingchen acting Vice Censor-in-Chief Shu Yuanyu was made Vice Censor-in-Chief, concurrent Vice Minister of Punishments.',
    idiomatic: 'On bingchen Shu Yuanyu took the censorate and Punishments.',
  },
  s1321: {
    literal: 'On gengshen Fengxiang military commissioner Li Ting was made Zhongwu military commissioner.',
    idiomatic: 'On gengshen Li Ting took Zhongwu.',
  },
  s1322: {
    literal: 'On guihai inner nurturer Qi Baozhen was ordered to beat to death at Qingni Post former Xiangzhou military commissioner Chen Hongzhi for regicide.',
    idiomatic: 'On guihai Chen Hongzhi was beaten to death at Qingni for regicide.',
  },
  s1323: {
    literal: 'On dingmao Vice Secretariat Director, Grand Councillor Li Guyan was made Xingyuan prefect and Shannan West military commissioner;',
    idiomatic: 'On dingmao Li Guyan took Shannan West;',
  },
  s1324: {
    literal: 'Hanlin lecture academician, Minister of Works Zheng Zhu was made acting Right Vice Premier and Fengxiang-Longyou military commissioner.',
    idiomatic: 'Zheng Zhu took Fengxiang with an acting right vice premiership.',
  },
  s1325: {
    literal: 'On wuchen Right Army Commandant Wang Shoucheng was made joint Observer of the Left and Right Divine Strategy Armies and commander of the Twelve Guards.',
    idiomatic: 'On wuchen Wang Shoucheng took both Divine Strategy armies.',
  },
  s1326: {
    literal: 'On jisi an edict made Court Gentleman for Discussion, acting Vice Censor-in-Chief, concurrent Vice Minister of Punishments, granted purple-gold fish Shu Yuanyu Grand Councillor with his present posts.',
    idiomatic: 'On jisi Shu Yuanyu joined the Grand Council.',
  },
  s1327: {
    literal: 'Court Gentleman for Discussion, acting War Bureau director, edict drafter, Hanlin lecture academician, granted scarlet fish Li Xun was made acting Minister of Rites and Grand Councillor, with gold-purple.',
    idiomatic: 'Li Xun became acting Minister of Rites and grand councillor with gold-purple.',
  },
  s1328: {
    literal: 'On renshen Punishments Bureau director, concurrent Attendant Censor, handling miscellaneous matters Li Xiaoben was made acting Vice Censor-in-Chief.',
    idiomatic: 'On renshen Li Xiaoben acted as vice censor-in-chief.',
  },
  s1329: {
    literal: 'Winter, tenth month, guiyou.',
    idiomatic: 'The tenth month reached guiyou.',
  },
  s1330: {
    literal: 'On yihai Du Cong again became Chen-Xu military commissioner; Li Ting became heir-apparent senior mentor at the eastern capital.',
    idiomatic: 'On yihai Du Cong returned to Chen-Xu; Li Ting retired to Luoyang.',
  },
  s1331: {
    literal: 'From the inner palace came plaques for the new Ziyun Tower and Caixia Pavilion at Qujiang; Left Army Commandant Qiu Shiliang greeted them with a hundred entertainments at the Silver Terrace Gate.',
    idiomatic: 'Qiu Shiliang staged a hundred acts to welcome new Qujiang pavilions.',
  },
  s1332: {
    literal: 'Zheng Zhu said Qin had disaster and earthworks should appease it; Kunming and Qujiang pools were dredged.',
    idiomatic: 'Zheng Zhu ordered dredging of Kunming and Qujiang to ward off ill omens.',
  },
  s1333: {
    literal: 'The Emperor loved verse and often recited Du Fu\'s "Qujiang Walk": "Palace gates along the river lock a thousand doors — for whom the tender willows and new reeds?"',
    idiomatic: 'He often recited Du Fu on Qujiang\'s lost splendor.',
  },
  s1334: {
    literal: '"Thus he knew that before Tianbao both banks had palaces, terraces, and ministry offices; wishing to restore the age of peace, he built towers and halls to magnify it."',
    idiomatic: 'He rebuilt Qujiang pavilions to revive Tianbao grandeur.',
  },
  s1335: {
    literal: 'Wang Ya presented the profit of tea monopoly; hence Ya was made tea monopoly commissioner.',
    idiomatic: 'Wang Ya won the tea monopoly and took the post.',
  },
  s1336: {
    literal: 'Taxed tea began with Ya.',
    idiomatic: 'The tea tax began with Wang Ya.',
  },
  s1337: {
    literal: 'The two capitals of Jingzhao and Henan suffered drought.',
    idiomatic: 'Both capitals suffered drought.',
  },
  s1338: {
    literal: 'Minister of Personnel Linghu Chu was made Left Vice Premier; Vice Minister of Punishments Zheng Tan was made Right Vice Premier.',
    idiomatic: 'Linghu Chu and Zheng Tan became left and right vice premiers.',
  },
  s1339: {
    literal: 'On xinsi the court sent messenger Li Haogu with poisoned wine to Wang Shoucheng; that day Shoucheng died.',
    idiomatic: 'On xinsi Wang Shoucheng was poisoned by imperial order.',
  },
  s1340: {
    literal: 'On renwu the court feasted ministers at Qujiang Pavilion.',
    idiomatic: 'On renwu the court feasted at Qujiang.',
  },
  s1341: {
    literal: 'On guimao former Guangzhou military commissioner Wang Maoyuan was made Jingyuan military commissioner.',
    idiomatic: 'On guimao Wang Maoyuan took Jingyuan.',
  },
  s1342: {
    literal: 'On dinghai Rites Bureau director Qian Kefu, War Bureau outer-section director Li Jingyi, Tributary Vehicles outer-section director Lu Jianneng, Receptions outer-section director Xiao Jie, and Left Reminder Lu Maohong were all made Fengxiang staff judges at Zheng Zhu\'s request.',
    idiomatic: 'On dinghai five officers became Zheng Zhu\'s Fengxiang judges.',
  },
  s1343: {
    literal: 'On yiwei the newly appointed Tongzhou prefect Bai Juyi was made heir-apparent junior mentor at the eastern capital; Ru prefect Liu Yuxi was made Tongzhou prefect.',
    idiomatic: 'On yiwei Bai Juyi went to Luoyang; Liu Yuxi took Tongzhou.',
  },
  s1344: {
    literal: 'On jihai former Heyang military commissioner Xiao Hong was made Bian-Fang military commissioner.',
    idiomatic: 'On jihai Xiao Hong took Bian-Fang.',
  },
  s1345: {
    literal: 'Ziqing observation commissioner Wang Yanwei asked to abolish nineteen county assistants within his circuit; assented.',
    idiomatic: 'Wang Yanwei cut nineteen county posts; the court agreed.',
  },
  s1346: {
    literal: 'On gengzi eastern capital regent, Special Advance, acting Minister of Education, Palace Censor Pei Du was advanced to Secretariat Director, other posts unchanged.',
    idiomatic: 'On gengzi Pei Du became secretariat director.',
  },
  s1347: {
    literal: 'Former Shannan West military commissioner Wang Yuanzhong was made Vice Minister of Punishments.',
    idiomatic: 'Wang Yuanzhong took Punishments.',
  },
  s1348: {
    literal: 'Eleventh month, renyin new moon.',
    idiomatic: 'The eleventh month opened on renyin.',
  },
  s1349: {
    literal: 'On yisi inner nurturer Feng Shuliang was ordered to kill former Xuzhou military commissioner Wang Shoujuan at Zhongmou county.',
    idiomatic: 'On yisi Wang Shoujuan was killed at Zhongmou.',
  },
  s1350: {
    literal: 'Left Divine Strategy general Hu Mu was made Rong-Guan frontier commissioner; Court of Judicature Review director Guo Xingyu was made Bin-Ning military commissioner.',
    idiomatic: 'Hu Mu took Rong-Guan; Guo Xingyu took Bin-Ning.',
  },
  s1351: {
    literal: 'On dingwei Bian-Fang military commissioner Zhao Dan died.',
    idiomatic: 'On dingwei Zhao Dan died.',
  },
  s1352: {
    literal: 'On yiyou Left Gold Crow great general Cui Ye died.',
    idiomatic: 'On yiyou Cui Ye died.',
  },
  s1353: {
    literal: 'On guichou Left Vice Premier Linghu Chu was assigned Grand Master of Splendid Happiness duties; Right Vice Premier Zheng Tan was assigned National University chancellor duties.',
    idiomatic: 'On guichou Linghu Chu and Zheng Tan took ceremonial assignments.',
  },
  s1354: {
    literal: 'On dingsi Minister of Revenue and revenue commissioner Wang Fan was made Taiyuan prefect, northern capital regent, and Hedong military commissioner.',
    idiomatic: 'On dingsi Wang Fan took Hedong.',
  },
  s1355: {
    literal: 'On wuwu Jingzhao prefect Li You was made Vice Minister of Revenue and revenue commissioner; Jingzhao junior prefect Luo Liyan was made acting prefect.',
    idiomatic: 'On wuwu Li You took Revenue; Luo Liyan acted at Jingzhao.',
  },
  s1356: {
    literal: 'On jiwei Grand Master of the Stud Han Yue was made Left Gold Crow great general.',
    idiomatic: 'On jiwei Han Yue became Left Gold Crow general.',
  },
  s1357: {
    literal: 'On renxu Army Commandant Qiu Shiliang led troops to execute Grand Councillors Wang Ya, Jia Su, Shu Yuanyu, and Li Xun, the newly appointed Taiyuan commissioner Wang Fan, Guo Xingyu, Zheng Zhu, Luo Liyan, Li Xiaoben, Han Yue, and more than ten households — all clans exterminated.',
    idiomatic: 'On renxu Qiu Shiliang slaughtered Li Xun\'s party and a dozen allied houses.',
  },
  s1358: {
    literal: 'Li Xun and Zheng Zhu had plotted to kill the eunuchs, falsely claiming dew on a pomegranate at the Gold Crow guard house; they asked the Emperor to view it.',
    idiomatic: 'They lured the Emperor with a fake "sweet dew" at the guard barracks.',
  },
  s1359: {
    literal: 'The eunuchs reached the guard house first, saw armor hidden beneath curtains, and hurried the imperial carriage inside; hence Xun and the rest failed, blood flooding the ground.',
    idiomatic: 'Eunuchs spotted the ambush and rushed the throne inside; the plot collapsed in blood.',
  },
  s1360: {
    literal: 'The capital was greatly alarmed; after ten days it gradually calmed.',
    idiomatic: 'The capital panicked, then slowly steadied.',
  },
  s1361: {
    literal: 'On guihai an edict made Silver-Green Grand Master, Left Vice Premier, Upper Pillar, Duke of Xingyang Zheng Tan Grand Councillor with his present post.',
    idiomatic: 'On guihai Zheng Tan joined the Grand Council.',
  },
  s1362: {
    literal: 'On yichou an edict made Court Gentleman for Discussion, acting Minister of Revenue, revenue commissioner Li Shi Court Gentleman and Grand Councillor with his present posts.',
    idiomatic: 'On yichou Li Shi joined the Grand Council.',
  },
  s1363: {
    literal: 'On dingmao Left Divine Strategy great general Chen Junyi was made Fengxiang military commissioner.',
    idiomatic: 'On dingmao Chen Junyi took Fengxiang.',
  },
  s1364: {
    literal: 'On wuchen Supplement Li Yi was made Vice Censor-in-Chief; Left and Right Army commandants Qiu Shiliang and Yu Zhihong were both made senior generals.',
    idiomatic: 'On wuchen Li Yi took the censorate; the eunuch generals were promoted.',
  },
  s1365: {
    literal: 'Twelfth month, renshen new moon: salt and transport tea monopoly commissioner Linghu Chu memorialized that the tea tax harmed the people and should stop; assented.',
    idiomatic: 'On renshen the tea monopoly was abolished at Linghu Chu\'s plea.',
  },
  s1366: {
    literal: 'On guichou.',
    idiomatic: 'The day was guichou.',
  },
  s1367: {
    literal: 'Heir-apparent senior mentor Zhang Maozong died.',
    idiomatic: 'Zhang Maozong died.',
  },
  s1368: {
    literal: 'On jiazi an edict ordered Left and Right Secretariat diarists to carry brush, inkstone, and paper below the chi-head to record words and events.',
    idiomatic: 'On jiazi diarists were ordered to record audiences at the chi-head.',
  },
  s1369: {
    literal: 'On bingzi Vice Minister of Punishments Wang Yuanzhong was made Tianping military commissioner.',
    idiomatic: 'On bingzi Wang Yuanzhong took Tianping.',
  },
  s1370: {
    literal: 'On dingchou an edict forbade circuit prefectures from privately printing calendar boards.',
    idiomatic: 'On dingchou private calendar printing was forbidden.',
  },
  s1371: {
    literal: 'On jimao Fengxiang military commissioner reported Zheng Zhu\'s staff judges Qian Kefu and three others all executed.',
    idiomatic: 'On jimao four of Zheng Zhu\'s Fengxiang judges were reported executed.',
  },
  s1372: {
    literal: 'On gengchen the Emperor held Zichen and asked the premiers: "Are the wards and markets gradually calm?"',
    idiomatic: 'On gengchen he asked whether the city had calmed.',
  },
  s1373: {
    literal: 'Li Shi replied: "Sentiment is calmer, yet executions are excessive and bring this yin blight."',
    idiomatic: 'Li Shi said calm had returned but mass executions bred ill omens.',
  },
  s1374: {
    literal: '"I hear Zheng Zhu at Fengxiang raised many troops; now all are executed — I fear trouble from this and urge amnesty to settle them."',
    idiomatic: 'He urged amnesty lest Fengxiang executions stir new trouble.',
  },
  s1375: {
    literal: 'The Emperor said: "So." Zheng Tan also spoke on governance.',
    idiomatic: 'The Emperor assented; Zheng Tan spoke on rule.',
  },
  s1376: {
    literal: 'The Emperor said: "I often think of Zhenguan and Kaiyuan; seeing today\'s affairs, rage often fills my breast."',
    idiomatic: '"I think of Zhenguan and Kaiyuan," he said, "and rage fills me."',
  },
  s1377: {
    literal: 'On guimao equipage commissioner Tian Quancao returned from patrolling the border, galloped through Golden Light Gate, and street rumor panicked the crowd into scattering.',
    idiomatic: 'On guimao Tian Quancao\'s gallop through Golden Light Gate sparked panic.',
  },
  s1378: {
    literal: 'Thanks to Gold Crow great general Chen Junshang standing with his men below Wangxian Gate, order was restored by evening.',
    idiomatic: 'Chen Junshang held Wangxian Gate until evening calmed the city.',
  },
  s1379: {
    literal: 'On dinghai acting Jingzhao prefect Zhang Zhongfang was made Hua defense commissioner; Director of Imperial Sacrifices Xue Yuan shang was made acting Jingzhao prefect.',
    idiomatic: 'On dinghai Zhang Zhongfang took Hua; Xue Yuan shang acted at Jingzhao.',
  },
  s1380: {
    literal: 'Left Vice Premier Linghu Chu memorialized: "Military commissioners and the like come with crossbows, draped quivers, and weapons to the War Ministry at the Secretariat for farewell audiences — we beg this stopped."',
    idiomatic: 'Linghu Chu asked to end armed military commissioners\' Ministry visits.',
  },
  s1381: {
    literal: '"If audience is needed, let them wear public robes."',
    idiomatic: '"Let them wear court robes instead," he said.',
  },
  s1382: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s1383: {
    literal: 'Chu had abetted Xun and Zhu\'s plot, used Wang Fan and Guo Xingyu\'s armed retinues, then said weapons should not enter the Ministry — utterly contrary to propriety.',
    idiomatic: 'Chu had armed Xun\'s allies, then banned weapons at the Ministry — critics scorned him.',
  },
  s1384: {
    literal: 'The age greatly faulted him.',
    idiomatic: 'Public opinion condemned him.',
  },
  s1385: {
    literal: 'Earlier when Grand Councillor Wu Yuanheng was murdered, Xianzong issued inner-store bows and bo blades to the left and right street commissioners to escort premiers entering court until they passed Jianfu Gate.',
    idiomatic: 'After Wu Yuanheng\'s murder, premiers had entered court under armed escort.',
  },
  s1386: {
    literal: 'Now that too was stopped.',
    idiomatic: 'That escort was now ended.',
  },
  s1387: {
    literal: 'On xinmao the Remonstrance Bureau seal was established.',
    idiomatic: 'On xinmao the Remonstrance Bureau received its seal.',
  },
  s1388: {
    literal: 'Kaicheng 1, first month, xinchou new moon: in ordinary dress the Emperor received congratulations at Xuanzheng Hall, then proclaimed a great amnesty and changed the era to Kaicheng.',
    idiomatic: 'Kaicheng 1 opened with amnesty and a new era name.',
  },
  s1389: {
    literal: 'On yisi at Zichen Grand Councillor Li Shi said: "Your Majesty\'s new era audience has greatly pleased the people; remitting Jingzhao\'s yearly tax and stopping the four-season tribute are timely grace."',
    idiomatic: 'On yisi Li Shi praised tax relief and an end to seasonal tribute.',
  },
  s1390: {
    literal: 'The Emperor said: "I aim to act in fact, not exalt empty words."',
    idiomatic: '"I want deeds, not empty words," the Emperor replied.',
  },
  s1391: {
    literal: 'Shi said: "The amnesty text should keep one copy inside for Your Majesty to read."',
    idiomatic: 'Li Shi urged keeping a copy of the amnesty for the throne.',
  },
  s1392: {
    literal: '"When the ten-circuit promotion-and-demotion commissioners depart, give them the archival root so that abroad they may consult with chief officials and carry out what fits benefit and harm."',
    idiomatic: 'He also wanted promotion commissioners to carry archival copies for local use.',
  },
  s1393: {
    literal: 'On dingwei Secretary Supervisor Wei Zhen was made Minister of Works.',
    idiomatic: 'On dingwei Wei Zhen took Works.',
  },
  s1394: {
    literal: 'An edict: "Yang Chenghe, Wei Yuansu, Wang Jianyan, and Cui Tanjun were lately wronged; we often grieve it — restore their ranks and allow burial at home."',
    idiomatic: 'An edict rehabilitated four wronged eunuchs and allowed them burial.',
  },
  s1395: {
    literal: 'Yin prefect Liu Yuan was made Xia-Sui-Yin-You military commissioner.',
    idiomatic: 'Liu Yuan took Xia-Sui-Yin-You.',
  },
  s1396: {
    literal: 'On bingchen at the full moon there was an eclipse.',
    idiomatic: 'On bingchen the full moon was eclipsed.',
  },
  s1397: {
    literal: 'Second month, xinwei new moon: Left Regular Cavalry Attendant Luo Rang was made Jiangxi observation commissioner.',
    idiomatic: 'On xinwei Luo Rang took Jiangxi.',
  },
  s1398: {
    literal: 'On yihai at the fourth watch the capital quaked; roof tiles fell.',
    idiomatic: 'At the fourth watch on yihai the capital quaked and tiles fell.',
  },
  s1399: {
    literal: 'On bingshen Left Martial Guard great general Zhu Shuye was granted death at Lantian Pass.',
    idiomatic: 'On bingshen Zhu Shuye was executed at Lantian.',
  },
  s1400: {
    literal: 'Tiande reported that three thousand tents of the Sheng Tuihun tribe came to submit at Fengzhou.',
    idiomatic: 'Tiande reported three thousand Tuihun tents submitting at Fengzhou.',
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
