#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.013, Dezong 2 — Huai-Xi war, Li Qian rebellion, Zhenyuan 16–18) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 700;

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
  s0601: {
    literal: 'On gengxu Xuanwu military commissioner, acting Minister of Works, Bianzhou prefect Liu Quanliang died.',
    idiomatic: 'On gengxu Liu Quanliang of Bianzhou died.',
  },
  s0602: {
    literal: 'On bingchen an edict stated: "Wu Shaocheng was promoted out of turn, given a command banner, rank standing with the highest ministers, responsibility over many cities.',
    idiomatic: 'On bingchen an edict declared: "Wu Shaocheng was raised beyond merit and given a full command.',
  },
  s0603: {
    literal: 'We expected repayment of service and obedience to our statutes; yet he harbors a heart not constant and brings himself to ruin.',
    idiomatic: 'We expected loyalty to law; instead his heart turned treacherous.',
  },
  s0604: {
    literal: 'Ferocity and cunning are his nature; he stirs many plots, moves troops on his own, and violently crosses the border markers.',
    idiomatic: 'He is cruel and cunning, raises armies without warrant, and tramples the frontier.',
  },
  s0605: {
    literal: 'At Shouzhou\'s tea gardens he wantonly plundered;',
    idiomatic: 'He looted Shouzhou\'s tea estates;',
  },
  s0606: {
    literal: 'at Tangzhou he secretly engineered the killing of an imperial envoy.',
    idiomatic: 'and at Tangzhou he had an imperial envoy murdered.',
  },
  s0607: {
    literal: 'He violated the statutes of the state — his crime admits no pardon.',
    idiomatic: 'His crimes are beyond pardon.',
  },
  s0608: {
    literal: 'We, in the virtue of a king, value sparing life;',
    idiomatic: 'A king\'s virtue is to spare life;',
  },
  s0609: {
    literal: 'the body of a ruler must bear stain and endure offense.',
    idiomatic: 'a ruler must sometimes swallow insult.',
  },
  s0610: {
    literal: 'We would rather humble Ourselves to forgive crime than destroy men to raise armies.',
    idiomatic: 'We chose mercy over marching armies against him.',
  },
  s0611: {
    literal: 'Above We weighed the majesty of the altars; below We restrained the loyal and worthy from pleading — hoping for repentance, still debating leniency.',
    idiomatic: 'We bowed to state majesty and silenced loyal ministers, still hoping he would repent.',
  },
  s0612: {
    literal: 'He took advantage of a neighbor\'s mourning to display greedy disorder, burning and plundering counties, brutalizing Our people.',
    idiomatic: 'When a neighbor mourned he burned counties and brutalized our people.',
  },
  s0613: {
    literal: 'We still hoped he would know his fault and bear the shame; when We issued gracious orders We still did not permit armies to march.',
    idiomatic: 'We bore the shame and withheld troops even after gracious edicts.',
  },
  s0614: {
    literal: 'Then he pressed the attack on Xuzhou, unleashed his poison, wantonly killed, and spread harm among the common folk.',
    idiomatic: 'Then he besieged Xuzhou, slaughtered, and poisoned the land.',
  },
  s0615: {
    literal: 'Evil ripe, calamity full — men and spirits alike cast him off.',
    idiomatic: 'His wickedness filled heaven and earth; gods and men abandoned him.',
  },
  s0616: {
    literal: 'To speak of raising punishment truly grieves Our heart.',
    idiomatic: 'To punish him now grieves Us — yet We must.',
  },
  s0617: {
    literal: 'Let every circuit send troops, advance together in pincer.',
    idiomatic: 'Let every circuit march and strike together.',
  },
  s0618: {
    literal: 'Wu Shaocheng\'s offices and titles while living are all to be stripped."',
    idiomatic: 'Strip Wu Shaocheng of every rank and office."',
  },
  s0619: {
    literal: 'On jisi from now on, at the Central Harmony and Double Ninth festivals, each festival shall forbid slaughter for one day only.',
    idiomatic: 'On jisi slaughter was banned for one day at each of the two festivals.',
  },
  s0620: {
    literal: 'On xinyou Grand Court reviewer and Xuanwu army marshal Han Hong was made acting Minister of Works, concurrent Bianzhou prefect, censor-in-chief, and Xuanwu military commissioner.',
    idiomatic: 'On xinyou Han Hong became Bianzhou and Xuanwu commander.',
  },
  s0621: {
    literal: 'Winter, tenth month, jichou: Prince Yong Wang Yan died.',
    idiomatic: 'In the tenth month Prince Yong died.',
  },
  s0622: {
    literal: 'Personnel vice minister Xi Zhi died.',
    idiomatic: 'Xi Zhi of the Board of Personnel died.',
  },
  s0623: {
    literal: 'Eleventh month, yisi: winter solstice — court assembly was stopped; armies were active.',
    idiomatic: 'Court was canceled on the solstice because of war.',
  },
  s0624: {
    literal: 'On renzi Xiangzhou\'s Yu Di memorialized breaking three thousand Huai-Xi rebels at Langshan.',
    idiomatic: 'On renzi Yu Di reported killing three thousand rebels at Langshan.',
  },
  s0625: {
    literal: 'Twelfth month, gengwu: deputy commander-in-chief of Shuofang and other circuits, Hezhong-Jiang military commissioner, acting Minister of Works, concurrent Shuofang director and Secretariat Director Hun Jian died.',
    idiomatic: 'In the twelfth month Hun Jian died.',
  },
  s0626: {
    literal: 'On yiwei the army fought Huai-Xi rebels at the Little Yin River; the imperial forces were unfavorable and the armies scattered on their own.',
    idiomatic: 'On yiwei the imperial army was routed at the Little Yin River.',
  },
  s0627: {
    literal: 'On dingyou Tongzhou prefect Du Que was made Hezhong prefect and Hezhong-Jiang observation commissioner.',
    idiomatic: 'On dingyou Du Que became Hezhong commissioner.',
  },
  s0628: {
    literal: 'Sixteenth year, spring, first month, gengzi new moon.',
    idiomatic: 'The sixteenth year opened on gengzi.',
  },
  s0629: {
    literal: 'On yisi the armies of Heng-Ji, Ding, Xu, and Heyang fought the rebels — all were unfavorable and withdrew.',
    idiomatic: 'On yisi four provincial armies attacked and were beaten back.',
  },
  s0630: {
    literal: 'Nanzhao presented the "Offering Sacred Music" dance suite; the emperor viewed it before Lindé Hall.',
    idiomatic: 'Nanzhao sent a dance suite performed before Lindé Hall.',
  },
  s0631: {
    literal: 'Second month, jiyou: Left Divine Strategy campaign and Yin-Xia military commissioner Han Quanyi was made Caizhou campaign commander-in-chief; Chen-Xu commissioner Shangguan Shui was his deputy.',
    idiomatic: 'On jiyou Han Quanyi commanded the Cai campaign with Shangguan Shui as deputy.',
  },
  s0632: {
    literal: 'On jichou Left Dragon Martial commanding general Cheng Huaizhi died.',
    idiomatic: 'On jichou Cheng Huaizhi died.',
  },
  s0633: {
    literal: 'On jiyou Huazhou prefect, Tongguan defense commissioner, and Zhenguo Army commissioner Lu Zheng died.',
    idiomatic: 'On jiyou Lu Zheng of Huazhou died.',
  },
  s0634: {
    literal: 'On renzi Minister of the Right assistant Yuan Zi was made Huazhou prefect, Tongguan defense commissioner, and Zhenguo Army commissioner.',
    idiomatic: 'On renzi Yuan Zi took Huazhou and Tongguan defense.',
  },
  s0635: {
    literal: 'Summer, fourth month, dinghai: Qianzhong banquet-setup clerk Fu Jin drove out observation commissioner Wei Shizong.',
    idiomatic: 'In the fourth month Fu Jin expelled Wei Shizong from Qianzhong.',
  },
  s0636: {
    literal: 'On jichou Yicheng Army military commissioner Yao Nanzhong was made Minister of the Right.',
    idiomatic: 'On jichou Yao Nanzhong became minister of the right.',
  },
  s0637: {
    literal: 'Kim Junyong, acting ruler of Silla, inherited his grandfather\'s offices of Kaifu, acting Grand Preceptor, Silla prefect, and King of Silla.',
    idiomatic: 'Silla\'s regent Kim Junyong received his grandfather\'s titles and the Silla kingship.',
  },
  s0638: {
    literal: 'On xinmao Yicheng campaign marshal Lu Qun was made Huazhou prefect, concurrent vice censor-in-chief, and Yicheng military commissioner.',
    idiomatic: 'On xinmao Lu Qun became Huazhou and Yicheng commander.',
  },
  s0639: {
    literal: 'On renshen acting Minister of War and Capital Metropolitan Prefect Wu Cou died.',
    idiomatic: 'On renshen Wu Cou died.',
  },
  s0640: {
    literal: 'Fifth month, wuxu new moon: because of rain, court was stopped.',
    idiomatic: 'Rain canceled court on the fifth month\'s new moon.',
  },
  s0641: {
    literal: 'On gengxu Han Quanyi fought Cai rebel general Wu Shaocheng south of the Yin River; the imperial army suffered a great defeat.',
    idiomatic: 'On gengxu Han Quanyi was crushed south of the Yin River.',
  },
  s0642: {
    literal: 'Xu-Si-Hao military commissioner, acting Minister of the Right, Xuzhou prefect Zhang Jianfeng died.',
    idiomatic: 'Zhang Jianfeng of Xu-Si died.',
  },
  s0643: {
    literal: 'On renzi Xuzhou troops mutinied, would not accept campaign marshal Wei Xiaqing, and forced Jianfeng\'s son Yin as acting commissioner.',
    idiomatic: 'On renzi Xuzhou soldiers rejected Wei Xiaqing and installed Zhang Yin as acting chief.',
  },
  s0644: {
    literal: 'On bingyin Wei Shizong returned to Qianzhou.',
    idiomatic: 'On bingyin Wei Shizong re-entered Qianzhou.',
  },
  s0645: {
    literal: 'On dingmao Personnel vice minister Gu Shaolian was made Capital Metropolitan Prefect.',
    idiomatic: 'On dingmao Gu Shaolian became metropolitan prefect.',
  },
  s0646: {
    literal: 'Sixth month, bingwu: Yanzhou\'s Li Shigu and Huainan\'s Du You were both made Concurrent Associates; You also took Xu-Si-Hao; former Guozhou aide Zhang Yin was recalled to Rapid Guard general, concurrent Xuzhou prefect, censor-in-chief, prefectural regimental commissioner, and acting Xuzhou chief.',
    idiomatic: 'On bingwu Li Shigu and Du You entered the chancellery; Du You also took Xu-Si-Hao while Zhang Yin held Xuzhou.',
  },
  s0647: {
    literal: 'Autumn, seventh month: Hunan observation commissioner Lü Wei died.',
    idiomatic: 'In the seventh month Lü Wei of Hunan died.',
  },
  s0648: {
    literal: 'Eighth month, guiyou: Hezhong prefect Wang [character missing in text] was made Tanzhou prefect and Hunan observation commissioner.',
    idiomatic: 'On guiyou the Hezhong prefect Wang Shao became Hunan commissioner at Tanzhou.',
  },
  s0649: {
    literal: 'Ninth month: Wu Shaocheng was pardoned.',
    idiomatic: 'In the ninth month Wu Shaocheng was pardoned.',
  },
  s0650: {
    literal: 'Emperor\'s son-in-law Guo Ai died.',
    idiomatic: 'Guo Ai, imperial son-in-law, died.',
  },
  s0651: {
    literal: 'Yicheng Army military commissioner Lu Qun died.',
    idiomatic: 'Lu Qun of Yicheng died.',
  },
  s0652: {
    literal: 'On bingwu former Minister of Rites Pei Yu died.',
    idiomatic: 'On bingwu Pei Yu died.',
  },
  s0653: {
    literal: 'On wuchen Left Assistant Li Yuansu was made Huazhou prefect, concurrent censor-in-chief, and Yicheng military commissioner.',
    idiomatic: 'On wuchen Li Yuansu took Yicheng at Huazhou.',
  },
  s0654: {
    literal: 'On gengxu Secretariat Vice Director and Concurrent Associate Zheng Yuqing was demoted to Chenzhou vice-prefect; Revenue vice minister and transport controller Yu Mian to Quanzhou registrar.',
    idiomatic: 'On gengxu Zheng Yuqing and Yu Mian were exiled to the south.',
  },
  s0655: {
    literal: 'Revenue vice minister Wang Shao was made acting transport controller; Revenue section chief Cui Congzhi was made Revenue vice minister.',
    idiomatic: 'Wang Shao took transport; Cui Congzhi became revenue vice minister.',
  },
  s0656: {
    literal: 'On guiyou Wu Shaocheng\'s rebels pressed the imperial army\'s camp below the Yin River fort; Han Quanyi withdrew to defend Chenzhou; the armies scattered to their circuits — the imperial forces did not recover.',
    idiomatic: 'On guiyou the campaign collapsed: Han Quanyi fled to Chenzhou and the armies dispersed.',
  },
  s0657: {
    literal: 'Henan assistant metropolitan prefect Zhang Shi was made Henan metropolitan prefect and water-land transport commissioner.',
    idiomatic: 'Zhang Shi became Henan prefect and transport commissioner.',
  },
  s0658: {
    literal: 'On gengshen Minister of Rites Qi Kang was made Secretariat Vice Director and Concurrent Associate.',
    idiomatic: 'On gengshen Qi Kang entered the chancellery.',
  },
  s0659: {
    literal: 'On guihai Prince Qian Wang Liang was made Xuzhou military commissioner; Zhang Yin was acting chief.',
    idiomatic: 'On guihai Prince Qian took Xuzhou; Zhang Yin remained acting chief.',
  },
  s0660: {
    literal: 'Winter, tenth month, xinwei: Xingyuan\'s Yan Li, courting the army supervisor\'s intent, falsely memorialized exiled Tongzhou vice-prefect Cui Hetu, sentenced him to distant exile at Yazhou, and granted death — scholars grieved.',
    idiomatic: 'In the tenth month Yan Li had the exile Cui Hetu executed at Yazhou to please the supervisor.',
  },
  s0661: {
    literal: 'Wu Shaocheng led troops back to Caizhou and submitted a table awaiting punishment.',
    idiomatic: 'Wu Shaocheng returned to Caizhou and submitted a confession.',
  },
  s0662: {
    literal: 'On wuzi an edict cleared Wu Shaocheng and restored his offices and titles.',
    idiomatic: 'On wuzi Wu Shaocheng was pardoned and restored to rank.',
  },
  s0663: {
    literal: 'On yichou Hedong military commissioner, acting Minister of Rites, Taiyuan prefect, concurrent censor-in-chief, northern capital protector Li Yue died.',
    idiomatic: 'On yichou Li Yue of Hedong died.',
  },
  s0664: {
    literal: 'On jiawu Hedong campaign marshal Zheng Dan was made acting Minister of Works, Taiyuan prefect, and Hedong military commissioner.',
    idiomatic: 'On jiawu Zheng Dan became Hedong commissioner.',
  },
  s0665: {
    literal: 'Eleventh month, guimao: Sizhou and Haozhou were to be subordinate to the Huainan observation commissioner.',
    idiomatic: 'On guimao Sizhou and Haozhou were placed under Huainan.',
  },
  s0666: {
    literal: 'On wushen Grand Steward Wei Qumou was made Minister of Rites.',
    idiomatic: 'On wushen Wei Qumou became minister of rites.',
  },
  s0667: {
    literal: 'Twelfth month, wuyin: Personnel re-examination judges and the Ministry of Rites\' separate-head examination were stopped.',
    idiomatic: 'In the twelfth month certain examination posts were abolished.',
  },
  s0668: {
    literal: 'Seventeenth year, spring, first month, jiawu new moon.',
    idiomatic: 'The seventeenth year opened on jiawu.',
  },
  s0669: {
    literal: 'On jiayin Han Quanyi returned from the Caizhou campaign headquarters; an edict ordered him back to his post at Hua.',
    idiomatic: 'On jiayin Han Quanyi left the front for Hua.',
  },
  s0670: {
    literal: 'Second month, guisi new moon: ministers were feasted at Qujiang Pavilion; the emperor composed a six-rhyme "Central Harmony Festival Banquet at Qujiang" and bestowed it.',
    idiomatic: 'On the second month\'s new moon the court feasted at Qujiang with a six-line imperial poem.',
  },
  s0671: {
    literal: 'On dingyou hail fell.',
    idiomatic: 'Hail struck on dingyou.',
  },
  s0672: {
    literal: 'On jihai frost fell.',
    idiomatic: 'Frost fell on jihai.',
  },
  s0673: {
    literal: 'On wushen night thunder sounded and hail fell.',
    idiomatic: 'On wushen night thunder brought hail.',
  },
  s0674: {
    literal: 'On gengxu great rain mixed with hail.',
    idiomatic: 'On gengxu heavy rain and hail struck.',
  },
  s0675: {
    literal: 'Third month, yichou: ministers were feasted at Qujiang Pavilion.',
    idiomatic: 'On yichou another Qujiang feast was held.',
  },
  s0676: {
    literal: 'On jisi Qianzhong observation commissioner Wei Shizong was again driven out by the three armies.',
    idiomatic: 'On jisi Wei Shizong was expelled from Qianzhong again.',
  },
  s0677: {
    literal: 'On guiyou Quzhou prefect Zheng Shizhan presented five thousand bolts of silk and two thousand taels of silver; the emperor said: "Shizhan is guilty of corruption — the censorate has already been ordered to investigate; what he presents should go to the Left Treasury."',
    idiomatic: 'On guiyou Zheng Shizhan\'s bribe was sent to the treasury while he was under investigation.',
  },
  s0678: {
    literal: 'On dingchou vice-prefects, vice-marshals, field-office officers, and adjutants were cut throughout the empire;',
    idiomatic: 'On dingchou many prefectural posts were abolished empire-wide;',
  },
  s0679: {
    literal: 'apart from the three metropolitan prefectures, where two clerks had held a post, one was cut.',
    idiomatic: 'outside the three capitals, duplicate prefectural clerks were halved.',
  },
  s0680: {
    literal: 'Summer, fourth month, dingwei: from now, imperial sons-in-law and commandery princesses\' husbands without sons might adopt sons without using the mother\'s privilege.',
    idiomatic: 'On dingwei childless imperial sons-in-law and princesses\' husbands could adopt heirs without maternal privilege.',
  },
  s0681: {
    literal: 'On xinhai Remonstrance Bureau grandee Pei Ji was made Qianzhong observation commissioner.',
    idiomatic: 'On xinhai Pei Ji became Qianzhong observer.',
  },
  s0682: {
    literal: 'Fifth month, renxu new moon: there was a solar eclipse.',
    idiomatic: 'On the fifth month\'s new moon the sun was eclipsed.',
  },
  s0683: {
    literal: 'On yiyou Binning military commissioner, acting Minister of Works, Bin prefect Yang Zhaosheng died.',
    idiomatic: 'On yiyou Yang Zhaosheng of Binning died.',
  },
  s0684: {
    literal: 'On bingxu Works vice minister Zhao Zhi was made Guangzhou prefect, concurrent censor-in-chief, and Lingnan military commissioner.',
    idiomatic: 'On bingxu Zhao Zhi became Lingnan commissioner.',
  },
  s0685: {
    literal: 'Sixth month, wuxu: Dingping garrison marshal Li Chaocai was made acting Minister of Works, concurrent Bin prefect and Shuofang-Binning-Qing military commissioner;',
    idiomatic: 'On wuxu Li Chaocai took Binning;',
  },
  s0686: {
    literal: 'the eunuch Yang Zhiliang was made Right Divine Strategy protector-army vice commissioner.',
    idiomatic: 'and Yang Zhiliang became Right Divine Strategy protector.',
  },
  s0687: {
    literal: 'A man of Zhexi, Cui Shanzhen, came to the palace gate and submitted a memorial on the crimes of Zhexi observation commissioner Li Qian.',
    idiomatic: 'Cui Shanzhen of Zhexi memorialized against Li Qian at the gate.',
  },
  s0688: {
    literal: 'When the emperor read the memorial he was displeased and ordered Shanzhen shackled and sent to Li Qian.',
    idiomatic: 'The emperor, angered, sent Shanzhen in chains to Li Qian.',
  },
  s0689: {
    literal: 'A pit was dug to await him; when he arrived, still in fetters he was pushed in and buried.',
    idiomatic: 'Li Qian buried him alive in a prepared pit.',
  },
  s0690: {
    literal: 'From this Qian grew reckless and rebelled.',
    idiomatic: 'Thereafter Li Qian turned openly rebellious.',
  },
  s0691: {
    literal: 'On jiyou Binning army marshal Gao Gu was made Bin prefect, concurrent censor-in-chief, and Binning-Qing military commissioner.',
    idiomatic: 'On jiyou Gao Gu became Binning commissioner.',
  },
  s0692: {
    literal: 'On dingsi Chengde Army military commissioner, Heng-Ji-Shen-Zhao Dede observation commissioner, chief administrator of the great metropolitan prefecture of Hengzhou, acting Grand Preceptor, Secretariat Director, Prince of Langye Wang Wujun died — posthumously made Grand Preceptor, posthumous title Zhonglie.',
    idiomatic: 'On dingsi Wang Wujun died and was posthumously enfeoffed as grand preceptor with the title Zhonglie.',
  },
  s0693: {
    literal: 'Autumn, seventh month, wuyin: Tibet raided Yanzhou.',
    idiomatic: 'In the seventh month Tibet raided Yanzhou.',
  },
  s0694: {
    literal: 'On xinsi former Chengde deputy military commissioner, acting Minister of Works, acting Heng prefect, Prince of Qinghe Wang Shizhen was recalled to service and made chief administrator of Hengzhou, filling the Chengde military commission.',
    idiomatic: 'On xinsi Wang Shizhen succeeded his father at Chengde.',
  },
  s0695: {
    literal: 'On yiyou Minister of Rites Wei Qumou died.',
    idiomatic: 'On yiyou Wei Qumou died.',
  },
  s0696: {
    literal: 'On jichou Tibet took Lin Prefecture, killed prefect Guo Feng, destroyed walls and ramparts, and withdrew.',
    idiomatic: 'On jichou Tibet sacked Linzhou, killed Guo Feng, and withdrew.',
  },
  s0697: {
    literal: 'Eighth month, wuwu: Hedong campaign marshal Yan Sui was made acting Minister of Works, concurrent Taiyuan prefect, censor-in-chief, and Hedong military commissioner.',
    idiomatic: 'On wuwu Yan Sui became Hedong commissioner.',
  },
  s0698: {
    literal: 'Ninth month, renxu: Wei Gao memorialized a great defeat of Tibet at Yazhou.',
    idiomatic: 'On renxu Wei Gao reported crushing Tibet at Yazhou.',
  },
  s0699: {
    literal: 'On wuchen ministers banqueted at Qujiang; the emperor composed a six-rhyme "Ninth Day Banquet at Qujiang Pavilion" and bestowed it.',
    idiomatic: 'On wuchen the court feasted at Qujiang with a six-line Ninth Day poem.',
  },
  s0700: {
    literal: 'On dingchou Minister of Rites Li Qiyun died.',
    idiomatic: 'On dingchou Li Qiyun died.',
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
