#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
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
    literal: "Salt and Iron Commissioner Wang Bo memorialized: on the Jiang-Huai salt price add fifty cash per dou, making 350 cash with the old 300.",
    idiomatic: "Wang Bo raised the Jiang-Huai salt price by fifty cash per dou.",
  },
  s0302: {
    literal: "On guichou Youzhou deputy military commissioner Liu Zong was made acting Minister of Works, concurrent Vice Director, Duke of Chu, and Ping'an Army military commissioner.",
    idiomatic: "On guichou Liu Zong was formally shifted to Ping'an Army.",
  },
  s0303: {
    literal: "Xuanwu Army military commissioner —",
    idiomatic: "Xuanwu posts were reassigned:",
  },
  s0304: {
    literal: "Acting Right Vice Director Zhang Hongjing was made acting Minister of Works, Grand Councillor, chief of You prefecture, and Youzhou-Lulong military commissioner.",
    idiomatic: "Zhang Hongjing took Youzhou at Liu Zong's request.",
  },
  s0305: {
    literal: "Following Liu Zong's memorial.",
    idiomatic: "This followed Liu Zong's abdication plan.",
  },
  s0306: {
    literal: "Fengxiang military commissioner Li Yuan was made acting Minister of Works, Bian prefect, and Xuanwu military commissioner;",
    idiomatic: "Li Yuan took Xuanwu;",
  },
  s0307: {
    literal: "Bin-Ning military commissioner Li Guangyan was made Fengxiang intendant, keeping acting Minister of Works and Grand Councillor, and Fengxiang-Longyou military commissioner.",
    idiomatic: "Li Guangyan took Fengxiang.",
  },
  s0308: {
    literal: "Right Guard Grand General Gao Xiayu was made acting Works Minister, Bin prefect, and Bin-Ning military commissioner.",
    idiomatic: "Gao Xiayu took Bin-Ning.",
  },
  s0309: {
    literal: "Remonstrance officials memorialized that Xiayu had been demoted for defeat and should not receive a commandery.",
    idiomatic: "Remonstrators said Gao Xiayu was unfit after defeat.",
  },
  s0310: {
    literal: "Not accepted.",
    idiomatic: "Muzong ignored them.",
  },
  s0311: {
    literal: "On yimao Acting Jingzhao intendant Lu Shimei was made Ying prefect and Ying-Mo regimental observer.",
    idiomatic: "On yimao Lu Shimei took Ying-Mo per Liu Zong's partition plan.",
  },
  s0312: {
    literal: "Following Liu Zong's memorial to divide and establish.",
    idiomatic: "The post followed Liu Zong's three-circuit scheme.",
  },
  s0313: {
    literal: "On dingsi a decree: \"Liu Zong has reached the highest terrace yet still moves to a heavy commandery; brothers, sons, and nephews each receive rank; great generals and guests should also be promoted.",
    idiomatic: "On dingsi a decree rewarded Liu Zong's household and army:",
  },
  s0314: {
    literal: "Youzhou commoners receive one year's tax remission; grant the three armies 1,000,000 strings for rewards.",
    idiomatic: "Youzhou got a tax holiday and one million strings for the troops.",
  },
  s0315: {
    literal: "Order comfort commissioner Xue Cunqing and Hongjing to calculate and disburse.\"",
    idiomatic: "Xue Cunqing and Hongjing would disburse the funds.\" Thus ended the edict.",
  },
  s0316: {
    literal: "On wuwu younger brothers Jing was enfeoffed Prince of Fen, Yue Prince of Qiong, Xun Prince of Mian, Yi Prince of Wu, Yin Prince of Mao, Yi Prince of Guang, Xie Prince of Zi, Tan Prince of Qu, Wan Prince of Chan;",
    idiomatic: "On wuwu nine younger brothers received princely titles;",
  },
  s0317: {
    literal: "Princes Zhan Prince of Jing, Han Prince of Jiang, Cou Prince of Zhang, Rong Prince of An, Chan Prince of Ying.",
    idiomatic: "five sons also became princes.",
  },
  s0318: {
    literal: "Vice War Minister Liu Gongchuo was made Jingzhao intendant and concurrent Censor-in-Chief.",
    idiomatic: "Liu Gongchuo became Jingzhao intendant.",
  },
  s0319: {
    literal: "On jiwei Field Bureau external official Li Deyu was made Director of Merit; Left Reminder Li Shen was made Merit Bureau external official — both kept drafting and Hanlin posts.",
    idiomatic: "On jiwei Li Deyu and Li Shen were promoted within the drafting office.",
  },
  s0320: {
    literal: "An order: this year's jinshi graduates Zheng Lang and thirteen others should be re-examined by Secretariat drafter Wang Qi and Guest Host drafting officer Bai Juyi and reported.",
    idiomatic: "The court ordered a re-examination of Qian Hui's jinshi picks.",
  },
  s0321: {
    literal: "On jiazi Liu Zong asked to make his private residence a Buddhist temple; a palace envoy granted the plaque name \"Repaying Grace.\"",
    idiomatic: "On jiazi Liu Zong's house became the Repaying Grace temple.",
  },
  s0322: {
    literal: "Youzhou memorialized Liu Zong firmly asked to become a monk; monk robes were again granted and the religious name Great Awakening given.",
    idiomatic: "Youzhou reported Liu Zong took the name Great Awakening.",
  },
  s0323: {
    literal: "That night Zong fled; the Youzhou people did not know where.",
    idiomatic: "That night Liu Zong vanished.",
  },
  s0324: {
    literal: "On yichou Zhang prefect Han Tai was made Chen prefect, Ting prefect Han Ye Yong prefect, Xun prefect Chen Jian Dao prefect — transferred in grade.",
    idiomatic: "On yichou four exiled officials were moved to lesser posts.",
  },
  s0325: {
    literal: "Summer, fourth month, bingyin new moon — Liu Zong's brother Yue and Zong's sons and others, eleven persons, received offices; five became prefects, the rest palace guard.",
    idiomatic: "The fourth month opened with offices for Liu Zong's kin.",
  },
  s0326: {
    literal: "On gengwu Yi-Ding reported Liu Zong had become a monk and died on the twenty-seventh of the third month on the circuit border; posthumously made Grand Preceptor.",
    idiomatic: "On gengwu Yi-Ding reported Liu Zong's death as a monk.",
  },
  s0327: {
    literal: "On jiaxu Secretariat Director Jiang Yi died.",
    idiomatic: "On jiaxu Jiang Yi died.",
  },
  s0328: {
    literal: "On bingzi former Ping'an Army military commissioner Ma Zong again became Ping'an military commissioner.",
    idiomatic: "On bingzi Ma Zong returned to Ping'an.",
  },
  s0329: {
    literal: "On dingchou an edict: \"The state establishes literary examinations to seek real talent; if chance is tolerated, fairness differs.",
    idiomatic: "On dingchou Muzong condemned the jinshi scandal:",
  },
  s0330: {
    literal: "I hear recently shallow men stir faction, called 'gate-nodes,' disturbing the chief examiner; each year's listed names are fixed beforehand.",
    idiomatic: "\"Exam factions fixed outcomes before testing.",
  },
  s0331: {
    literal: "Ever speaking of corrupting custom, I deeply feel indignation.",
    idiomatic: "The court was outraged.",
  },
  s0332: {
    literal: "Zheng Lang and others were re-tested to scrutinize ability, not to seek obscure topics in the unusual, but to see accomplishment and depth of learning.",
    idiomatic: "The re-test sought real learning, not trick questions.",
  },
  s0333: {
    literal: "The lone-bamboo pipe is music for sacrificing Heaven, from the orthodox Zhou Rites; reading their submitted texts, none knew its basis.",
    idiomatic: "Graduates could not explain a Zhou Rites music question.",
  },
  s0334: {
    literal: "Their prose was shallow and piled with errors.",
    idiomatic: "Their essays were crude and error-filled.",
  },
  s0335: {
    literal: "Also order Qian Hui shown it so he deeply feels shame.",
    idiomatic: "Qian Hui was shamed before the court.",
  },
  s0336: {
    literal: "Truly they should all be rejected to warn the future.",
    idiomatic: "All should have been failed.",
  },
  s0337: {
    literal: "But the four seas are untroubled and hearts at peace — use broad mercy and show special grace.",
    idiomatic: "Yet peace allowed mercy.",
  },
  s0338: {
    literal: "Kong Wenye, Zhao Cunyue, and Dou Xunzhi's tests were roughly passable and passed;",
    idiomatic: "Three passed marginally;",
  },
  s0339: {
    literal: "Lu Gongliang and eleven others were to fail.",
    idiomatic: "eleven including Lu Gongliang failed.",
  },
  s0340: {
    literal: "Hereafter Rituals Bureau candidates' examination essays and policy answers should be sent to the Secretariat for detailed review per the Kaiyuan 25 edict.\"",
    idiomatic: "Future jinshi papers would go to the Secretariat for review.\" Thus ended the edict.",
  },
  s0341: {
    literal: "Rituals Vice Minister Qian Hui was demoted to Jiang prefect; Secretariat drafter Li Zongmin to Jian prefect; Right Reminder Yang Rushi to Kaijiang magistrate of Kaizhou.",
    idiomatic: "Qian Hui, Li Zongmin, and Yang Rushi were punished.",
  },
  s0342: {
    literal: "On wuyin chief ministers Cui Zhi and Du Yuanying memorialized: on audience days record all ministers' policy proposals touching ritual and send yearly to the History Office as \"Record of Sagely Governance.\"",
    idiomatic: "On wuyin Cui Zhi proposed a Record of Sagely Governance.",
  },
  s0343: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0344: {
    literal: "The matter also was not carried out.",
    idiomatic: "The project never materialized.",
  },
  s0345: {
    literal: "On bingxu at regular court an envoy installed the Nine-Clan Uighur as Dengluo Yuluolu Moimi Shiju Zhulu Pijia Protective-Faith Khan.",
    idiomatic: "On bingxu a new Uighur khan was enthroned.",
  },
  s0346: {
    literal: "On xinmao Heng prefect Linghu Chu was made E prefect; Jizhou Sima Meng Jian was made Mu prefect.",
    idiomatic: "On xinmao Linghu Chu and Meng Jian were reassigned.",
  },
  s0347: {
    literal: "On renchen an edict: the hundred officials and scholars should each pursue the public good and not form factions.",
    idiomatic: "On renchen the court forbade factionalism.",
  },
  s0348: {
    literal: "On jiawu Zhang Hongjing entered Youzhou and received court congratulations.",
    idiomatic: "On jiawu Zhang Hongjing entered Youzhou to acclaim.",
  },
  s0349: {
    literal: "Secretariat and Department memorialized: the eight Yan-Ji prefectures were pacified — per ritual the imperial tombs should be notified.",
    idiomatic: "The Secretariat asked to notify the tombs of Yan-Ji pacification.",
  },
  s0350: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0351: {
    literal: "Fifth month, bingchen new moon.",
    idiomatic: "The fifth month opened on bingchen.",
  },
  s0352: {
    literal: "On wuxu because criminal cases lagged, a schedule was set: great cases — Dali thirty-five days to judge and finish, then Justice thirty days to report;",
    idiomatic: "On wuxu Muzong set judicial deadlines for great, middle, and small cases;",
  },
  s0353: {
    literal: "middle cases — Dali thirty days, Justice twenty-five;",
    idiomatic: "middle cases thirty and twenty-five days;",
  },
  s0354: {
    literal: "small cases — Dali twenty-five days, Justice twenty.",
    idiomatic: "small cases twenty-five and twenty.",
  },
  s0355: {
    literal: "Judged crimes of twenty items and above are great, ten and above middle, below ten small.",
    idiomatic: "Twenty or more counts were great, ten middle, fewer small.",
  },
  s0356: {
    literal: "Justice four review officers and Dali six assistants must enter the offices twenty days monthly; kitchen funds increased by Revenue — following Vice Censor Niu Sengru's memorial.",
    idiomatic: "Review officers got more kitchen funds per Niu Sengru's plan.",
  },
  s0357: {
    literal: "On jihai Merit Bureau external official Li Bo was demoted to Qian prefect — earlier he had praised the chief ministers too highly in examination comments; Du Yuanying and others memorialized for demotion.",
    idiomatic: "On jihai Li Bo was exiled for flattering the premiers in exam reports.",
  },
  s0358: {
    literal: "On guimao eighteen Youzhou great generals including Li Can were made prefects and guard generals.",
    idiomatic: "On guimao eighteen Youzhou generals received capital posts.",
  },
  s0359: {
    literal: "On jiyou retired Right Regular Cavalry Attendant Liu Deng died.",
    idiomatic: "On jiyou Liu Deng died in retirement.",
  },
  s0360: {
    literal: "On xinhai a hundred-chi tower was built in the palace.",
    idiomatic: "On xinhai a hundred-chi tower rose in the palace.",
  },
  s0361: {
    literal: "On renzi tea monopoly was increased — old quota 100 cash, now add fifty, following Wang Bo's memorial.",
    idiomatic: "On renzi the tea tax rose fifty cash per Wang Bo.",
  },
  s0362: {
    literal: "Remonstrator Li Jue memorialized it should not be done; the memorial was not answered.",
    idiomatic: "Li Jue protested in vain.",
  },
  s0363: {
    literal: "On bingchen Prince Shen died.",
    idiomatic: "Prince Shen died on bingchen.",
  },
  s0364: {
    literal: "On dingsi Cangzhou's earlier Jing prefecture at Gonggao county and Guihua county at Fucheng market were both abolished.",
    idiomatic: "On dingsi two Cangzhou counties were abolished.",
  },
  s0365: {
    literal: "On renxu Youzhou comfort commissioner Xue Cunqing died at Zhen prefecture.",
    idiomatic: "On renxu Xue Cunqing died in Youzhou service.",
  },
  s0366: {
    literal: "On guihai the earlier Yin prefecture at Yancheng was abolished;",
    idiomatic: "On guihai Yin prefecture was abolished;",
  },
  s0367: {
    literal: "Yancheng, Shangcai, Xiping, and Suiping two counties returned to Cai prefecture.",
    idiomatic: "its counties reverted to Cai prefecture.",
  },
  s0368: {
    literal: "The imperial sister Princess Taihe was sent to marry the Uighur Dengluo Gumu Shijia Pijia Protective-Faith Khan.",
    idiomatic: "Princess Taihe departed to marry the Uighur khan.",
  },
  s0369: {
    literal: "On jiazi Gold Crow Grand General Hu Zheng was made envoy escorting the princess into Uighur lands and concurrently enfeoffing the khan.",
    idiomatic: "On jiazi Hu Zheng escorted the princess and enthroned the khan.",
  },
  s0370: {
    literal: "Also Yi Grand Master of the Stud Li Rui was made marriage envoy to Uighur.",
    idiomatic: "Li Rui served as marriage envoy.",
  },
  s0371: {
    literal: "Sixth month, yichou new moon.",
    idiomatic: "The sixth month opened on yichou.",
  },
  s0372: {
    literal: "On xinwei Tibet raided Qing Fortress.",
    idiomatic: "Tibet raided Qing Fortress on xinwei.",
  },
  s0373: {
    literal: "On jiashen Vice Censor-in-Chief Niu Sengru was granted gold-purple.",
    idiomatic: "On jiashen Niu Sengru received gold-purple.",
  },
  s0374: {
    literal: "Autumn, seventh month, yiwei new moon.",
    idiomatic: "The seventh month opened on yiwei.",
  },
  s0375: {
    literal: "On renyin the moon occulted the Room's second star.",
    idiomatic: "On renyin the moon eclipsed a Room star.",
  },
  s0376: {
    literal: "On renzi the ministers advanced the honorific Civil-Martial Filial Virtue Emperor.",
    idiomatic: "On renzi ministers offered the honorific Civil-Martial Filial Virtue.",
  },
  s0377: {
    literal: "That day the Emperor received the seal at Xuanzheng Hall; when rites ended he ascended Danfeng Tower and proclaimed great amnesty.",
    idiomatic: "That day Muzong took the honorific and proclaimed amnesty.",
  },
  s0378: {
    literal: "On jiayin Youzhou military commissioner reported: on the tenth of this month the army mutinied, imprisoning military commissioner Zhang Hongjing in a separate lodge.",
    idiomatic: "On jiayin Youzhou mutinied and seized Zhang Hongjing.",
  },
  s0379: {
    literal: "They killed judges Wei Yong, Zhang Zongyuan, Cui Zhongqing, and Zheng Kan.",
    idiomatic: "Four staff were murdered.",
  },
  s0380: {
    literal: "Soldiers took Zhu Tao's son Hui as acting commander.",
    idiomatic: "The troops installed Zhu Hui as acting commander.",
  },
  s0381: {
    literal: "On dingsi Zhang Hongjing was demoted to crown prince mentor at eastern Luoyang.",
    idiomatic: "On dingsi Zhang Hongjing was demoted.",
  },
  s0382: {
    literal: "On jiwei Hongjing was demoted again to Ji prefect.",
    idiomatic: "On jiwei he was sent to Jizhou.",
  },
  s0383: {
    literal: "Zhu Hui, finding himself old, had the army install his son Wurong as acting commander.",
    idiomatic: "Zhu Hui yielded to his son Wurong.",
  },
  s0384: {
    literal: "Earlier when Liu Zong came to court he registered hard-to-control officers and sent them to the capital; Ke Rong was on the register.",
    idiomatic: "Liu Zong had sent unruly officers including Ke Rong to Chang'an.",
  },
  s0385: {
    literal: "Chief ministers Cui Zhi and Du Yuanying did not know warfare and lacked far sight, thinking the two Hebei circuits secure and no longer prone to rebellion, so memorialized to send Liu Zong's registered great generals back to Youzhou — hence Ke Rong rebelled and Hebei was lost again.",
    idiomatic: "Cui Zhi and Du Yuanying sent the officers back, restoring Hebei rebellion under Ke Rong.",
  },
  s0386: {
    literal: "On gengshen Zhaoyi military commissioner Liu Wu was made acting Minister of Works, concurrent chief of You prefecture, Youzhou-Lulong deputy military commissioner managing affairs.",
    idiomatic: "On gengshen Liu Wu was rushed to Youzhou.",
  },
  s0387: {
    literal: "National University Chancellor Han Yu was made Vice Minister of War.",
    idiomatic: "Han Yu was made vice war minister.",
  },
  s0388: {
    literal: "On xinyou Princess Taihe set out for Uighur; the Emperor with half the guard saw her off at Tonghua Gate; ministers lined up before Zhangjing Temple.",
    idiomatic: "On xinyou Muzong half-escorted Princess Taihe to the frontier.",
  },
  s0389: {
    literal: "Eighth month, jiazi new moon.",
    idiomatic: "The eighth month opened on jiazi.",
  },
  s0390: {
    literal: "On jisi Zhen prefecture commissioner Song Weicheng memorialized: on the night of the twenty-eighth of the seventh month the army mutinied; military commissioner Tian Hongzheng and over three hundred family and staff were all killed.",
    idiomatic: "On jisi Zhenzhou reported Tian Hongzheng and three hundred kin slaughtered.",
  },
  s0391: {
    literal: "Soldiers elevated yamen officer Wang Tingcou as acting commander.",
    idiomatic: "Wang Tingcou was made acting commander.",
  },
  s0392: {
    literal: "On xinwei Left Gold Crow general Yang Yuanqing was made Jing prefect and Four-Circuits Northern Court frontier commissioner and Jingyuan military commissioner.",
    idiomatic: "On xinwei Yang Yuanqing took Jingyuan.",
  },
  s0393: {
    literal: "An order: dukes and great ministers should come to the Secretariat to discuss You-Zhen suppression.",
    idiomatic: "The court convened to plan war on You and Zhen.",
  },
  s0394: {
    literal: "On guiyou Wang Tingcou sent assassins to kill Ji prefect Wang Jinki and seize the prefecture.",
    idiomatic: "On guiyou Wang Tingcou murdered Ji prefect Wang Jinki.",
  },
  s0395: {
    literal: "On yihai former Jingyuan military commissioner Tian Bu was recalled to acting Works Minister, concurrent chief of Wei prefecture, and Weibo military commissioner.",
    idiomatic: "On yihai Tian Bu was sent to Weibo in mourning dress.",
  },
  s0396: {
    literal: "On jimao Shen prefect and regimental commissioner Niu Yuanyi was made Shen-Ji military commissioner.",
    idiomatic: "On jimao Niu Yuanyi defended Shen-Ji.",
  },
  s0397: {
    literal: "On xinsi night the White Planet neared the left horn of the Chariot.",
    idiomatic: "On xinsi night Venus neared the Chariot's horn.",
  },
  s0398: {
    literal: "Ji prefect Wu Yun was secretly driven out by Youzhou troops.",
    idiomatic: "Wu Yun was expelled from Jizhou by Youzhou troops.",
  },
  s0399: {
    literal: "Ying prefecture mutinied, imprisoning observer Lu Shimei.",
    idiomatic: "Yingzhou mutinied and seized Lu Shimei.",
  },
  s0400: {
    literal: "Ying prefecture was soon taken by Youzhou troops.",
    idiomatic: "Youzhou troops then seized Yingzhou.",
  },
};;
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
if (data.metadata.chapter !== '016') {
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
