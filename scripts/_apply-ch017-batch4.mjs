#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.017, Jingzong, Wenzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/017.json';
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
    literal: 'On wuyin he visited Fish-Abundance Palace to watch the dragon-boat races.',
    idiomatic: 'On wuyin Jingzong watched boat races again.',
  },
  s0302: {
    literal: 'On xinsi the Tongzhou prefect Xiao Fu was made heir-apparent Junior Preceptor, assigned to the eastern capital.',
    idiomatic: 'On xinsi Xiao Fu went to Luoyang.',
  },
  s0303: {
    literal: 'On renwu Minister of Works Pei Wu was made Tongzhou prefect.',
    idiomatic: 'On renwu Pei Wu took Tongzhou.',
  },
  s0304: {
    literal: 'On guiwei the Lingnan military commissioner Cui Zhi memorialized: "Seven prefectures\' garrison troops at Guang, Hu, Feng, Lei, Pan, and Bian — except separate-command deputies, all are to be stopped."',
    idiomatic: 'On guiwei Cui Zhi asked to disband six Lingnan garrisons.',
  },
  s0305: {
    literal: 'Thus ended the edict; the throne assented.',
    idiomatic: 'Thus ended the edict.',
  },
  s0306: {
    literal: 'On bingxu the Kunming tribes sent envoys with tribute.',
    idiomatic: 'On bingxu Kunming envoys presented tribute.',
  },
  s0307: {
    literal: 'On dinghai an edict installed the Talented Lady Guo as Honored Consort.',
    idiomatic: 'On dinghai Lady Guo became Honored Consort.',
  },
  s0308: {
    literal: 'On bingshen Vice Minister of Personnel Wei Hongjing was made Shan-Guo observation commissioner.',
    idiomatic: 'On bingshen Wei Hongjing took Shan-Guo.',
  },
  s0309: {
    literal: 'Fourth month, wuxu new moon: the Henghai military commissioner Li Quanlue died.',
    idiomatic: 'The fourth month opened as Li Quanlue died.',
  },
  s0310: {
    literal: 'On renyin Right Gold Crow great general Gao Chengjian was made Bin-Ning-Qing military commissioner.',
    idiomatic: 'On renyin Gao Chengjian took Bin-Ning-Qing.',
  },
  s0311: {
    literal: 'On bingwu Wang Tingcou was advanced to acting Minister of Works.',
    idiomatic: 'On bingwu Wang Tingcou was promoted to acting Minister of Works.',
  },
  s0312: {
    literal: 'On wushen the Zhaoyi military regent Liu Congjian was made acting Vice Minister of Works, Zhaoyi vice commissioner, and acting military commissioner.',
    idiomatic: 'On wushen Liu Congjian took full Zhaoyi command.',
  },
  s0313: {
    literal: 'On bingwu Wang Tingcou was made acting Minister of Works.',
    idiomatic: 'On bingwu Wang Tingcou received acting Minister of Works.',
  },
  s0314: {
    literal:
      'On wushen Liu Congjian, Zhaoyi military commissioner designate, was made acting Minister of Works and Zhaoyi deputy military commissioner and commissioner.',
    idiomatic: 'On wushen Liu Congjian took full Zhaoyi command.',
  },
  s0315: {
    literal:
      'On gengxu the E-Yue observation commissioner Niu Sengru memorialized: "This circuit\'s Mianzhou faces Ezhou across the river — barely more than a li; the prefecture should be abolished and Hanyang and Hanchuan counties placed under Ezhou."',
    idiomatic: 'On gengxu Niu Sengru sought to merge Mianzhou into Ezhou across the Yangzi.',
  },
  s0316: {
    literal: 'On bingyin earlier Wang Tingcou had asked to erect a sage-virtue stele in his circuit; that day the palace issued the inscription text to Tingcou.',
    idiomatic: 'On bingyin Jingzong sent Wang Tingcou his stele text.',
  },
  s0317: {
    literal: 'Fifth month, wuchen new moon: the Emperor faced twelve hundred inner-kindred women at Xuanhe Hall, feasted them at the Music Office, and granted brocade to each.',
    idiomatic: 'On wuchen Jingzong feasted twelve hundred palace kin at Xuanhe.',
  },
  s0318: {
    literal: 'On xinwei Secretariat Compiler Wei Gongsu annotated Taizong\'s twelve-chapter "Models for Emperors" and presented it; one hundred bolts of brocade were specially granted.',
    idiomatic: 'On xinwei Wei Gongsu\'s annotation of Taizong\'s "Models for Emperors" won a hundred bolts of silk.',
  },
  s0319: {
    literal: 'On jiaxu the Jingyuan military commissioner Yang Yuanqing was made Heyang-Sancheng-Huaizhou military commissioner; Gold Crow great general Li You was made Jingyuan military commissioner.',
    idiomatic: 'On jiaxu Yang Yuanqing and Li You swapped frontier commands.',
  },
  s0320: {
    literal: 'That night the moon neared the Supreme Palace star.',
    idiomatic: 'The moon neared Supreme Palace that night.',
  },
  s0321: {
    literal: 'Zhexi sent the grain-abstaining Daoist nun Shi Ziwei.',
    idiomatic: 'Zhexi presented the fasting nun Shi Ziwei.',
  },
  s0322: {
    literal: 'On wuyin he visited Fish-Abundance Palace to watch the dragon-boat races.',
    idiomatic: 'On wuyin another boat-race excursion.',
  },
  s0323: {
    literal: 'On gengchen palace envoys returned from Silla with hawks and falcons.',
    idiomatic: 'On gengchen Silla hawks arrived.',
  },
  s0324: {
    literal: 'Youzhou mutinied; its commander Zhu Kerong and his son Yanling were killed; the soldiers installed his second son Yansi as regent.',
    idiomatic: 'Youzhou troops killed Zhu Kerong and made Yansi regent.',
  },
  s0325: {
    literal: 'On xinsi within the Divine Strategy park the old Chang\'an city was repaired — at Han Weiyang Palace a white jade couch six feet long was unearthed.',
    idiomatic: 'On xinsi diggers found a six-foot white jade couch at Weiyang.',
  },
  s0326: {
    literal: 'On guiwei the mountain man Du Jingxian presented a petition at Guangshun Gate claiming mastery of the Way;',
    idiomatic: 'On guiwei Du Jingxian claimed magical arts at Guangshun Gate;',
  },
  s0327: {
    literal: 'eunuchs were ordered to escort Du Jingxian to Huainan, Jiangnan, Hunan, and Lingnan to seek extraordinary men.',
    idiomatic: 'eunuchs were sent to scour the south for wonder-workers.',
  },
  s0328: {
    literal: 'On jiashen Right Vice Director Ding Gongzhu was made Vice Minister of War; the former Hunan observation commissioner Shen Chuanshi was made Left Vice Director.',
    idiomatic: 'On jiashen Ding Gongzhu took War and Shen Chuanshi the left vice post.',
  },
  s0329: {
    literal: 'On xinmao Zhu Kerong was posthumously made Minister of Education.',
    idiomatic: 'On xinmao the slain Zhu Kerong was posthumously honored.',
  },
  s0330: {
    literal: 'On jiazi night the Sparkling One transgressed the Pleiades.',
    idiomatic: 'On jiazi night Mars crossed the Pleiades.',
  },
  s0331: {
    literal: 'Twenty thousand strings were granted the Xingtang Abbey Daoist Liu Congzheng to repair his abbey.',
    idiomatic: 'Liu Congzheng received twenty thousand strings for his abbey.',
  },
  s0332: {
    literal: 'Sixth month, dingyou new moon: Vice Censor-in-Chief Dugu Lang was granted gold-purple.',
    idiomatic: 'The sixth month opened with Dugu Lang receiving gold-purple.',
  },
  s0333: {
    literal: 'On dingsi twenty-five hundred park laborers were reduced.',
    idiomatic: 'On dingsi twenty-five hundred park laborers were released.',
  },
  s0334: {
    literal: 'The Emperor loved carpentry; from spring through winter construction followed without pause.',
    idiomatic: 'Jingzong\'s carpentry projects ran year-round.',
  },
  s0335: {
    literal: 'On gengshen Yanzhou presented four donkey-polo players including Shi Dingkuan.',
    idiomatic: 'On gengshen Yanzhou sent donkey-polo players.',
  },
  s0336: {
    literal: 'That night Venus transgressed the Pleiades.',
    idiomatic: 'Venus crossed the Pleiades that night.',
  },
  s0337: {
    literal: 'On xinyou he visited Condensed Emerald Pool and ordered more than a thousand soldiers to take large fish from the pool; the largest were sent to a new pool.',
    idiomatic: 'On xinyou soldiers netted giant fish at Condensed Emerald Pool.',
  },
  s0338: {
    literal: 'On guihai because of drought capital offices were ordered to review prisoners.',
    idiomatic: 'On guihai drought prompted a prisoner review.',
  },
  s0339: {
    literal: 'One ward of Yan\'an Fang official residences was made princely mansion offices.',
    idiomatic: 'A Yan\'an ward became princely offices.',
  },
  s0340: {
    literal: 'On jiazi the Emperor faced the three halls to watch the two armies, Music Office, and inner garden compete in donkey polo and wrestling.',
    idiomatic: 'On jiazi the three halls hosted brutal polo and wrestling.',
  },
  s0341: {
    literal: 'In the heat of play some had heads smashed and arms broken; it did not end until the first and second watches.',
    idiomatic: 'Players were maimed before the games ended near midnight.',
  },
  s0342: {
    literal: 'Autumn, seventh month, bingyin new moon.',
    idiomatic: 'The seventh month opened on bingyin.',
  },
  s0343: {
    literal: 'On yihai Hezhong presented eight strongmen.',
    idiomatic: 'On yihai Hezhong sent eight wrestlers.',
  },
  s0344: {
    literal: 'On guiwei Prince of Heng Xuan died.',
    idiomatic: 'On guiwei Prince Xuan died.',
  },
  s0345: {
    literal: 'An edict: Meibo sluice at E county and Grand Canal Guangyun Pool were again granted to the Agriculture Office.',
    idiomatic: 'Meibo sluice and Guangyun Pool returned to the Agriculture Office.',
  },
  s0346: {
    literal: 'Eighth month, bingshen new moon: acting Minister of Works, Grand Councillor Pei Du was made revenue commissioner;',
    idiomatic: 'On bingshen Pei Du took the revenue commission;',
  },
  s0347: {
    literal: 'Vice Minister of Works Wang Bo was made Henan prefect, replacing Wang Qi;',
    idiomatic: 'Wang Bo replaced Wang Qi at Henan;',
  },
  s0348: {
    literal: 'Qi was made Vice Minister of Personnel;',
    idiomatic: 'Wang Qi took Personnel;',
  },
  s0349: {
    literal: 'the former Fuzhou observation commissioner Xu Hui was made Vice Minister of Works.',
    idiomatic: 'Xu Hui took Works.',
  },
  s0350: {
    literal: 'That night Venus neared Supreme Palace.',
    idiomatic: 'Venus neared Supreme Palace that night.',
  },
  s0351: {
    literal: 'Twenty attending Daoists were ordered to follow the Zhexi recluse Zhou Xiyuan into the inner mountain pavilion court; the Emperor asked him about the Way; he said he knew Zhang Guo and Ye Jingneng.',
    idiomatic: 'Zhou Xiyuan and twenty Daoists entered the inner pavilion claiming ties to immortals.',
  },
  s0352: {
    literal: 'The Zhexi observation commissioner Li Deyu memorialized that Xiyuan\'s claims were fraudulent, no different from ordinary men.',
    idiomatic: 'Li Deyu denounced Zhou Xiyuan as a fraud.',
  },
  s0353: {
    literal: 'On gengxu Senior Director of the Court of the Imperial Treasury Li Xian was made Jiangxi observation commissioner.',
    idiomatic: 'On gengxu Li Xian took Jiangxi.',
  },
  s0354: {
    literal: 'On dingchou night the moon transgressed the Ghost.',
    idiomatic: 'On dingchou night the moon crossed the Ghost.',
  },
  s0355: {
    literal: 'Jingzhao prefect Liu Qichu was added concurrent Censor-in-Chief.',
    idiomatic: 'Liu Qichu also received the censorate.',
  },
  s0356: {
    literal: 'On guichou Senior Minister of Rites Cui Cong was made acting Minister of Personnel, acting eastern-capital director, concurrent Censor-in-Chief, eastern-capital regent, and eastern Ji-Ru capital defense commissioner.',
    idiomatic: 'On guichou Cui Cong took Luoyang and the eastern ministries.',
  },
  s0357: {
    literal: 'Ninth month, dingchou new moon: a great feast at Xuanhe Hall with a hundred entertainments ran from jiaxu through bingzi before ending.',
    idiomatic: 'A three-day Xuanhe spectacle opened the ninth month.',
  },
  s0358: {
    literal: 'On wuyin the Hedong military commissioner, acting Minister of Education Li Guangyan died.',
    idiomatic: 'On wuyin Li Guangyan died.',
  },
  s0359: {
    literal: 'Ten thousand strings from the inner treasury were issued to recruit strongmen in the inner garden.',
    idiomatic: 'The inner garden received ten thousand strings to hire wrestlers.',
  },
  s0360: {
    literal: 'The Youzhou salt army memorialized: commander Li Zaiyi and his brother Zaining jointly killed Zhu Yansi and more than three hundred of his household and installed Zaiyi as regent.',
    idiomatic: 'Youzhou troops made Li Zaiyi regent after slaughtering Zhu Yansi\'s clan.',
  },
  s0361: {
    literal: 'On renshen Chief Minister Li Cheng was made northern capital regent and Hedong military commissioner.',
    idiomatic: 'On renshen Li Cheng went to Hedong.',
  },
  s0362: {
    literal: 'An edict: the Tongzhou Changchun Palace estates managed by Revenue were to be placed under the inner palace estates office.',
    idiomatic: 'Changchun Palace lands passed from Revenue to the inner estates office.',
  },
  s0363: {
    literal: 'Winter, tenth month, yiwei new moon.',
    idiomatic: 'The tenth month opened on yiwei.',
  },
  s0364: {
    literal: 'On yihai the Youzhou clerical commander Li Zaiyi was made acting Minister of Revenue, Lulong vice commissioner, and acting military commissioner, and granted the name Zaiyi.',
    idiomatic: 'On yihai Li Zaiyi was recognized as Lulong regent with the name Zaiyi.',
  },
  s0365: {
    literal: 'On renxu Secretariat drafter Cui Yan was made Vice Minister of Rites.',
    idiomatic: 'On renxu Cui Yan took Rites.',
  },
  s0366: {
    literal: 'Eleventh month, jiazi new moon: the Grand Pure Abbey Daoist Zhao Guizhen was made professor-doctor for both capital Daoist directorates.',
    idiomatic: 'On jiazi Zhao Guizhen taught both capitals\' Daoist schools.',
  },
  s0367: {
    literal: 'The Emperor loved to hunt foxes late at night within the palace — the inner quarters called it "beating night foxes."',
    idiomatic: 'Palace staff called his midnight fox hunts "beating night foxes."',
  },
  s0368: {
    literal: 'The eunuchs Xu Suizhen, Li Shaoduan, and Yu Hongzhi were demoted for failing to attend him.',
    idiomatic: 'Three eunuchs lost rank for missing a hunt.',
  },
  s0369: {
    literal: 'On renshen Minister of Revenue Hu Zheng was made acting Minister of War, concurrent Guangzhou prefect, and Lingnan military commissioner.',
    idiomatic: 'On renshen Hu Zheng was sent to Lingnan.',
  },
  s0370: {
    literal: 'On jiashen Right Vice Premier, Grand Councillor Li Fengji was made acting Minister of Works, Grand Councillor, concurrent Xiangzhou prefect, Shannan East military commissioner, and Linhan pasture commissioner.',
    idiomatic: 'On jiashen Li Fengji was exiled to Shannan East with council rank.',
  },
  s0371: {
    literal: 'On yiyou Tongzhou prefect Pei Wu died.',
    idiomatic: 'On yiyou Pei Wu died.',
  },
  s0372: {
    literal: 'On jichou an edict: court officials and frontier households must not keep private white-body retainers.',
    idiomatic: 'On jichou private retainers were forbidden to officials and garrison households.',
  },
  s0373: {
    literal: 'On guisi the former eastern-capital regent Yang Yuling was made heir-apparent Junior Preceptor.',
    idiomatic: 'On guisi Yang Yuling became junior preceptor.',
  },
  s0374: {
    literal: 'The eunuchs Li Fengyi, Wang Weizhi, and Cheng Shouzhen were each beaten thirty strokes and assigned to the mausolea;',
    idiomatic: 'Three eunuchs were flogged and sent to guard tombs;',
  },
  s0375: {
    literal: 'Palace Treasury commissioner Yan Hongyue and vice commissioner Liu Hongyi were each beaten twenty.',
    idiomatic: 'two Palace Treasury officers received twenty strokes each.',
  },
  s0376: {
    literal: 'Twelfth month, jiawu new moon.',
    idiomatic: 'The twelfth month opened on jiawu.',
  },
  s0377: {
    literal: 'On xinchou the Emperor returned from a night hunt; with eunuchs Liu Keming, Tian Wucheng, and Xu Wenduan he played ball; military officers Su Zuoming, Wang Jiaxian, Shi Dingkuan, and twenty-eight others drank wine.',
    idiomatic: 'On xinchou after a night hunt Jingzong drank and played ball with eunuchs and officers.',
  },
  s0378: {
    literal: 'As the Emperor grew drunk he entered to change clothes; the hall candles suddenly went out; Liu Keming and the rest jointly murdered the Emperor; he died in the chamber at once; he was eighteen.',
    idiomatic: 'Eunuchs snuffed the lamps and stabbed the eighteen-year-old emperor dead in his chamber.',
  },
  s0379: {
    literal: 'The ministers gave the posthumous title Ruiwu Zhaomin Xiaoxiao; temple name Jingzong.',
    idiomatic: 'The court named him Jingzong, posthumous title Ruiwu Zhaomin Xiaoxiao.',
  },
  s0380: {
    literal: 'On the thirteenth day of the seventh month of Taihe 1 he was buried at Zhuang Mausoleum.',
    idiomatic: 'He was buried at Zhuang Mausoleum in Taihe 1.',
  },
  s0381: {
    literal: '【Historian\'s appraisal】 The ancients said Yao had no son and Shun had no father — meaning how far apart in worth the worthy and unworthy can be.',
    idiomatic: '【Historian\'s appraisal】 The ancients said Yao had no son and Shun had no father — the worthy and unworthy can stand worlds apart.',
  },
  s0382: {
    literal: 'With Muzong\'s pampered, reckless nature, to be followed by Jingzong was indeed fitting.',
    idiomatic: 'Muzong\'s indulgent heir naturally produced Jingzong.',
  },
  s0383: {
    literal: 'Yet Wenzong and Wuzong were outstanding, unmatched — civil enough to weave the state, martial enough to quell disaster.',
    idiomatic: 'Yet the next brothers, Wenzong and Wuzong, were statesmen and soldiers both.',
  },
  s0384: {
    literal: 'The three sons\' conduct differed so sharply — can it be told in one breath?',
    idiomatic: 'Three brothers, three fates — how shall one phrase it?',
  },
  s0385: {
    literal: 'In Baoli the succession nearly broke; Heaven did not yet destroy the dynasty — fortunately Pei Du was there to take the council again.',
    idiomatic: 'Baoli nearly broke the line until Pei Du restored the council.',
  },
  s0386: {
    literal: 'That crafty boy — what is there to discuss!',
    idiomatic: 'As for that reckless boy — words fail.',
  },
  s0387: {
    literal: 'Emperor Wenzong, posthumous title Yuansheng Zhaoxian Xiaoxiao, taboo name Ang, was Muzong\'s second son; his mother was Empress Zhenxian, née Xiao.',
    idiomatic: 'Wenzong—taboo Ang—was Muzong\'s second son, born of Empress Zhenxian Xiao.',
  },
  s0388: {
    literal: 'On the tenth day of the tenth month of Yuanhe 4 he was born.',
    idiomatic: 'He was born on Yuanhe 4\'s tenth-month tenth day.',
  },
  s0389: {
    literal:
      'Wenzong — posthumous title Primordial Sage Manifest Illumination Filial, bore the taboo name Ang; he was Muzong\'s second son; his mother was Empress Zhenxian of the Xiao clan.',
    idiomatic:
      'Wenzong — styled Primordial Sage Manifest Illumination Filial, bore the taboo name Ang, Muzong\'s second son; his mother was Empress Zhenxian of the Xiao clan.',
  },
  s0390: {
    literal: 'In Changqing 1 he was enfeoffed as Prince of Jiang.',
    idiomatic: 'In Changqing 1 he became Prince of Jiang.',
  },
  s0391: {
    literal: 'His first name was Han.',
    idiomatic: 'He was first named Han.',
  },
  s0392: {
    literal: 'Baoli 2 — Baoli 2, on the eighth day of the twelfth month, Jingzong was murdered; the bandit Su Zuoming and others forged an edict installing the Prince of Jiang to manage state affairs.',
    idiomatic: 'On Baoli 2\'s twelfth-month eighth day assassins forged an edict enthroning the Prince of Jiang.',
  },
  s0393: {
    literal: 'Pivot Commissioner Wang Shoucheng and Defender Commissioner Liang Shouqian led the forbidden armies to suppress the bandits, executed the Prince of Jiang, and welcomed the Emperor at the Jiang mansion.',
    idiomatic: 'Wang Shoucheng and Liang Shouqian killed the puppet prince and brought Ang from the Jiang mansion.',
  },
  s0394: {
    literal: 'On guimao he met the chief ministers inside the side hall and issued an edict disposing of military and state affairs.',
    idiomatic: 'On guimao he met premiers in the side hall and took command.',
  },
  s0395: {
    literal: 'On jiachen the monks Weizhen, Qixian, and Zhengjian, the Daoist Zhao Guizhen, and six ball-game military officers including Yu Deng were all exiled to Lingnan; the ball officers were left to their armies for disposition.',
    idiomatic: 'On jiachen sorcerers and ball players were exiled or handed to their commands.',
  },
  s0396: {
    literal: 'The chief ministers and hundred officials three times submitted memorials urging accession.',
    idiomatic: 'The court thrice urged him to ascend.',
  },
  s0397: {
    literal: 'On yisi he took the throne at Xuanzheng Hall.',
    idiomatic: 'On yisi he ascended at Xuanzheng Hall.',
  },
  s0398: {
    literal: 'On bingwu he went to the western palace to complete mourning dress.',
    idiomatic: 'On bingwu he donned mourning at the western palace.',
  },
  s0399: {
    literal: 'On dingwei the chief ministers and hundred officials submitted memorials asking him to assume government; three memorials — assented.',
    idiomatic: 'On dingwei three pleas won consent to rule in person.',
  },
  s0400: {
    literal: 'The Daoists Ji Chuxuan and Yang Chongxu, and wonder-workers Li Yuanji and Wang Xin, were all exiled to Lingnan.',
    idiomatic: 'More wonder-workers were sent to Lingnan.',
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
