#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.015, Xianzong 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/015.json';
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
    literal: "seven staff officers including Chief Secretary Liu Xie were executed.",
    idiomatic: "seven aides including Liu Xie were beheaded.",
  },
  s0502: {
    literal: "Recording pacification of Huai-West merit: Sui-Tang military commissioner, acting Left Regular Cavalry Attendant Li Su was made acting Left Vice Director, Xiangzhou prefect, and Shannan East military commissioner with observation over Xiang, Deng, Sui, Tang, Fu, E, Jun, and Fang;",
    idiomatic: "Li Su was richly rewarded with the Shannan East command;",
  },
  s0503: {
    literal: "Xuanwu military commissioner Han Hong was given concurrent Palace Attendant;",
    idiomatic: "Han Hong received a palace title;",
  },
  s0504: {
    literal: "Zhongwu military commissioner Li Guangyan and Heyang military commissioner Wu Zhongyin were both made acting Masters of Works.",
    idiomatic: "Li Guangyan and Wu Zhongyin were made honorary works ministers.",
  },
  s0505: {
    literal: "Xuanwu army chief adjutant Han Gongwu was made acting Left Regular Cavalry Attendant and Yan-Fang-Dan-Yan military commissioner; Weibo field army horse commander Tian Bu was made Right Golden Guard general — all rewarded for breaking rebels.",
    idiomatic: "Han Gongwu and Tian Bu were promoted for the victory.",
  },
  s0506: {
    literal: "jiawu — Prince En died.",
    idiomatic: "Prince En died on jiawu.",
  },
  s0507: {
    literal: "Cai prefecture's Yan City was made Yin prefecture; Shangcai, Xiping, and Suiping three counties were attached to it.",
    idiomatic: "Yan City became Yin prefecture with three counties.",
  },
  s0508: {
    literal: "wushen — Huai-West pacification vice commissioner, Chancellery Vice Director, Grand Councillor Pei Du kept his post, was granted Upper Pillar of State, Duke of Jin with three thousand households;",
    idiomatic: "Pei Du was ennobled Duke of Jin on wushen;",
  },
  s0509: {
    literal: "Cai acting prefect Ma Zong was made acting Works Minister, Cai prefect, Zhangyi military commissioner, and Yin-Fuying-Chen-Xu military commissioner.",
    idiomatic: "Ma Zong took the Zhangyi and Yin commands.",
  },
  s0510: {
    literal: "bingzi — Right Vice Guardian Han Yu was made Penal Vice Minister.",
    idiomatic: "Han Yu became penal vice minister on bingzi.",
  },
  s0511: {
    literal: "That year Henan and Hebei flooded.",
    idiomatic: "Floods struck Henan and Hebei that year.",
  },
  s0512: {
    literal: "Yuanhe 13 — spring, first month, jiyou new moon: at Hanyuan Hall the Emperor received New Year congratulations; when rites ended, he ascended Danfeng Tower and proclaimed a great amnesty for the empire.",
    idiomatic: "Yuanhe 13 opened with audience and empire-wide amnesty.",
  },
  s0513: {
    literal: "jichou — Kong Weizhi, thirty-eighth-generation descendant of the Duke of Culture, inherited the title Duke of Culture.",
    idiomatic: "Confucius' line received the hereditary dukedom on jichou.",
  },
  s0514: {
    literal: "gengyin — an edict: Li Shidao has repeatedly submitted memorials revealing earnest sincerity — Remonstrating Doctor Zhang Su should be sent there to proclaim comfort.",
    idiomatic: "Zhang Su was dispatched to reassure Li Shidao on gengyin.",
  },
  s0515: {
    literal: "xinchai — Rites Minister Wang Bo was made Chengdu Intendant and Western Sichuan military commissioner.",
    idiomatic: "Wang Bo went west as Sichuan commissioner on xinchai.",
  },
  s0516: {
    literal: "Second month, yihai — at Linde Hall the Emperor feasted the hundred officials with great music for three days, then dismissed; gifts were graded.",
    idiomatic: "A three-day victory feast filled Linde Hall in the second month.",
  },
  s0517: {
    literal: "Third month, gengyin — former Western Sichuan commissioner Li Yijian was made Censor-in-Chief.",
    idiomatic: "Li Yijian became chief censor on gengyin.",
  },
  s0518: {
    literal: "bingyin — Tongzhou Prefect Zheng Qian was made Eastern Capital regent and metropolitan Yu defense commissioner.",
    idiomatic: "Zheng Qian became Luoyang regent on bingyin.",
  },
  s0519: {
    literal: "gengzi — Censor-in-Chief Li Yijian was made Vice Director of the Secretariat and Grand Councillor.",
    idiomatic: "Li Yijian entered the council on gengzi.",
  },
  s0520: {
    literal: "Grand Councillor Li Yong kept the Revenue Ministry and ceased handling administration.",
    idiomatic: "Li Yong left the council but kept Revenue.",
  },
  s0521: {
    literal: "dingwei — Crown Prince Junior Tutor Zheng Yuqing was made Left Vice Director.",
    idiomatic: "Zheng Yuqing became left vice director on dingwei.",
  },
  s0522: {
    literal: "xinchai — an edict: \"Official duty fields of the hundred offices, more or less unequal, have long been a abuse — order each office to gather total duty-field grain and grass, and from the chief down, apart from retained vacant-office goods, distribute to all.\"",
    idiomatic: "An edict ordered fairer sharing of official duty-field harvests.",
  },
  s0523: {
    literal: "At Silver Terrace he awaited punishment, asking to offer De and Di prefectures and their taxes within his jurisdiction.",
    idiomatic: "A minister offered two prefectures to atone at court.",
  },
  s0524: {
    literal: "renxu — former Eastern Capital regent Xu Mengrong died.",
    idiomatic: "Xu Mengrong died on renxu.",
  },
  s0525: {
    literal: "gengchen — an edict restored Wang Chengzong's offices and titles.",
    idiomatic: "Wang Chengzong's rank was restored on gengchen.",
  },
  s0526: {
    literal: "Hua Prefect Zheng Quan was made Dezhou prefect, Transocean military commissioner, and observer over De, Di, Cang, and Jing.",
    idiomatic: "Zheng Quan took the Transocean command.",
  },
  s0527: {
    literal: "Fifth month, yiyou — Fengxiang military commissioner Li Weijian died.",
    idiomatic: "Li Weijian died in Fengxiang on yiyou.",
  },
  s0528: {
    literal: "yiwei — the moon drew near the rear Heart star.",
    idiomatic: "The moon neared the rear Heart star on yiwei.",
  },
  s0529: {
    literal: "bingchen — Zhongwu military commissioner Li Guangyan was made Hua prefect and Yicheng military commissioner; Zhangyi military commissioner Ma Zong was made Xu prefect, Zhongwu military commissioner, and Chen-Xu-Yin-Cai observer.",
    idiomatic: "Li Guangyan and Ma Zong swapped central China commands on bingchen.",
  },
  s0530: {
    literal: "wuxu — Shannan East military commissioner Li Su was made Fengxiang Intendant and Fengxiang-Longyou military commissioner; xinchou — Parhae state affairs director Da Renxiu was made acting Palace Secretary Supervisor and Khitan Prefecture Protector-General and enfeoffed King of Parhae.",
    idiomatic: "Li Su went to Fengxiang; Parhae's king was enfeoffed on xinchou.",
  },
  s0531: {
    literal: "bingwu — Revenue Vice Minister Meng Jian was made acting Works Minister, Xiangzhou prefect, and Shannan East military commissioner.",
    idiomatic: "Meng Jian took Shannan East on bingwu.",
  },
  s0532: {
    literal: "Sixth month, guichou new moon — there was a solar eclipse.",
    idiomatic: "An eclipse marked the sixth-month opening.",
  },
  s0533: {
    literal: "yichou — Hunan observation commissioner Yuan Zi died.",
    idiomatic: "Yuan Zi died in Hunan on yichou.",
  },
  s0534: {
    literal: "dingchou — Cang-Jing commissioner Cheng Quan was made Bin prefect and Binning military commissioner.",
    idiomatic: "Cheng Quan took Binning on dingchou.",
  },
  s0535: {
    literal: "Thirty myriad bolts of inner-store silk and thirty myriad strings were issued to Revenue to supply the army.",
    idiomatic: "Inner silk and cash funded the eastern campaign.",
  },
  s0536: {
    literal: "Autumn, seventh month, guiwei — newly appointed Fengxiang commissioner Li Su was made Xuzhou prefect and Wuning military commissioner.",
    idiomatic: "Li Su was shifted to Wuning on guiwei.",
  },
  s0537: {
    literal: "jiashen — Tian Hongzheng was made acting Master of Works.",
    idiomatic: "Tian Hongzheng received an honorary works title on jiashen.",
  },
  s0538: {
    literal: "yiyou — an edict stripped Ziqing military commissioner Li Shidao of all offices and titles in his person, and ordered Xuanwu, Weibo, Yicheng, Wuning, and Transocean armies to advance on separate routes.",
    idiomatic: "Li Shidao was outlawed and five armies marched on Ziqing on yiyou.",
  },
  s0539: {
    literal: "xinchou — Chancellery Vice Director, Grand Councillor Li Yijian was made acting Left Vice Director, Grand Councillor, Yangzhou metropolitan senior administrator, and Huainan military commissioner.",
    idiomatic: "Li Yijian went south to Huainan on xinchou.",
  },
  s0540: {
    literal: "jiyou — an edict: wherever circuit military commissioners also bore revenue or garrison-farm commissioner titles, all were abolished.",
    idiomatic: "Circuit revenue and garrison-farm titles were stripped on jiyou.",
  },
  s0541: {
    literal: "gengxu — Left Vice Director Zheng Yuqing was made Fengxiang-Longyou military commissioner.",
    idiomatic: "Zheng Yuqing took Fengxiang on gengxu.",
  },
  s0542: {
    literal: "Eighth month, renzi — Chancellery Vice Director and Grand Councillor Wang Ya was made War Vice Minister and ceased handling administration.",
    idiomatic: "Wang Ya left the council on renzi.",
  },
  s0543: {
    literal: "wuwu — Right Vice Director of the Department Cui Cong was made Xingyuan Intendant and Shannan West military commissioner.",
    idiomatic: "Cui Cong took Shannan West on wuwu.",
  },
  s0544: {
    literal: "jiaxu — Venus drew near the Left Enforcer star.",
    idiomatic: "Venus neared the Left Enforcer on jiaxu.",
  },
  s0545: {
    literal: "yihai — an edict: where officials of the same office have parents or elders in great mourning, except for linked judges and auditing officers and the office chief, they are not within the limit of avoidance and transfer.",
    idiomatic: "An edict narrowed kinship avoidance rules on yihai.",
  },
  s0546: {
    literal: "At the time Penal Bureau Director Yang Sifu's father, on mourning leave from Yuling, was made Revenue Vice Minister; following recent precedent for avoidance, he asked to leave the ministry and was not permitted — hence this edict.",
    idiomatic: "Yang Sifu's forced stay prompted the clarification.",
  },
  s0547: {
    literal: "dingchou — Wood, Metal, and Water three mansions gathered at Axle.",
    idiomatic: "Three mansions piled at Axle on dingchou.",
  },
  s0548: {
    literal: "wuyin — former Shannan West military commissioner Quan Deyu died.",
    idiomatic: "Quan Deyu died on wuyin.",
  },
  s0549: {
    literal: "jiashen — Left Guard General Gao Xiayu was made Chanyu Protector-General and Zhenwu-Linsheng military commissioner.",
    idiomatic: "Gao Xiayu took the northern frontier on jiashen.",
  },
  s0550: {
    literal: "jiachen — Revenue Vice Minister and acting revenue commissioner Huangfu Bo was made Grand Councillor, continuing to act for revenue.",
    idiomatic: "Huangfu Bo entered the council while keeping Revenue on jiachen.",
  },
  s0551: {
    literal: "Weiwei Director and salt-iron transport commissioner Cheng Yi was made Works Vice Minister and Grand Councillor, continuing as commissioner.",
    idiomatic: "Cheng Yi joined the council and kept salt transport.",
  },
  s0552: {
    literal: "At the time the Emperor was urgent about finances — hence revenue-minded men were placed in the council.",
    idiomatic: "Fiscal hardliners took the premiership for money.",
  },
  s0553: {
    literal: "When the edict was issued, public sentiment was shocked and alarmed; councillors Pei Du and Cui Qun remonstrated strongly — not accepted.",
    idiomatic: "Pei Du and Cui Qun protested in vain.",
  },
  s0554: {
    literal: "The two men requested withdrawal.",
    idiomatic: "Both offered to resign.",
  },
  s0555: {
    literal: "Mars drew near the Weeping star.",
    idiomatic: "Mars approached the Weeping star.",
  },
  s0556: {
    literal: "dingwei — one hundred thousand bolts of inner-store silk were issued to the eastern army.",
    idiomatic: "Silk was rushed to the eastern front on dingwei.",
  },
  s0557: {
    literal: "Winter, tenth month, jiayin — Tibet raided You prefecture.",
    idiomatic: "Tibet hit You on jiayin.",
  },
  s0558: {
    literal: "renxu — Lingwu reported breaking twenty thousand Tibetans at Dingyuan City.",
    idiomatic: "Lingwu claimed a twenty-thousand-man victory on renxu.",
  },
  s0559: {
    literal: "guihai — former Huainan military commissioner Wei Cigong died.",
    idiomatic: "Wei Cigong died on guihai.",
  },
  s0560: {
    literal: "jiazi — Pingliang frontier suppression horse commander Hao Qi memorialized recovering Yuan prefecture and breaking twenty thousand Tibetans.",
    idiomatic: "Hao Qi reported retaking Yuanzhou on jiazi.",
  },
  s0561: {
    literal: "That night the moon drew near the Hairy Head.",
    idiomatic: "The moon neared Mao that night.",
  },
  s0562: {
    literal: "bingzi — Left Golden Guard Grand General Xue Ping was made acting Penal Minister and Hua prefect, Yicheng military commissioner;",
    idiomatic: "Xue Ping took Yicheng on bingzi;",
  },
  s0563: {
    literal: "Yicheng military commissioner Li Guangyan was made Xu prefect, Zhongwu military commissioner, and Chen-Xu observer.",
    idiomatic: "Li Guangyan moved to Zhongwu at Xu.",
  },
  s0564: {
    literal: "Eleventh month, xinsi new moon — Xiazhou broke fifty thousand Tibetans.",
    idiomatic: "Xiazhou reported routing fifty thousand Tibetans on xinsi.",
  },
  s0565: {
    literal: "Lingwu memorialized breaking the outer wall of Tibet's Changle prefecture.",
    idiomatic: "Lingwu took Changle's outer wall.",
  },
  s0566: {
    literal: "dinghai — the mountain man Liu Bi was made Taizhou prefect for gathering immortal drugs on Tiantai for the Emperor.",
    idiomatic: "Alchemist Liu Bi was made Taizhou prefect on dinghai.",
  },
  s0567: {
    literal: "When the decree was issued, remonstrating officials debated it — not accepted.",
    idiomatic: "Censors protested the alchemist appointment in vain.",
  },
  s0568: {
    literal: "renyin — Heyang military commissioner Wu Zhongyin was made Cangzhou prefect, Transocean military commissioner, and observer over Cang, Jing, De, and Di.",
    idiomatic: "Wu Zhongyin took Transocean on renyin.",
  },
  s0569: {
    literal: "dingwei — Hua Prefect Linghu Chu was made Huai prefect and Heyang Three Cities, Huai, and Meng military commissioner.",
    idiomatic: "Linghu Chu took Heyang on dingwei.",
  },
  s0570: {
    literal: "Twelfth month, xinhai — an edict: the Left and Right Dragon Martial Six Armies and Weiyuan Camp corvée households, one thousand eight hundred persons' clothing and grain, all halted — still delivered to prefecture and county control.",
    idiomatic: "Corvée rations for palace guards were cut on xinhai.",
  },
  s0571: {
    literal: "wuyin — forty-seven men including Li Shidao's general Xia Houcheng were captured before the army; an edict released them to Weibo and Yicheng for custody; those wishing to return to the rebels were generously sent back.",
    idiomatic: "Captured Ziqing officers were freed to encourage defections on wuyin.",
  },
  s0572: {
    literal: "The Emperor looked at the councillors and said: \"Ministers serving the ruler need only strive to do good — fame comes of itself — why delight in forming factions?\"",
    idiomatic: "Xianzong warned his ministers against faction-making.",
  },
  s0573: {
    literal: "The Emperor said: \"Others' words are also like yours — how easy to distinguish?\"",
    idiomatic: "He admitted slander was hard to tell apart.",
  },
  s0574: {
    literal: "Du said: \"Gentleman and petty man — watch their conduct and they distinguish themselves.\"",
    idiomatic: "Pei Du said deeds reveal the man.",
  },
  s0575: {
    literal: "The Emperor said: \"Whatever is easy to say with the mouth is hard to carry out in person.",
    idiomatic: "Xianzong said talk is cheap.",
  },
  s0576: {
    literal: "You speak — you must act; do not empty talk.\"",
    idiomatic: "He ordered ministers to match words with deeds.\"",
  },
  s0577: {
    literal: "Du and the others thanked him: \"Your Majesty's handling can be called utmost — we dare not fail to be stirred.",
    idiomatic: "The council thanked him and vowed effort;",
  },
  s0578: {
    literal: "Yet all under Heaven follow what Your Majesty does, not what Your Majesty says — we also wish Your Majesty whenever you speak then to act.\"",
    idiomatic: "they begged him to rule by example, not edict alone.\"",
  },
  s0579: {
    literal: "The Emperor was quite pleased to accept it.",
    idiomatic: "He took the rebuke well.",
  },
  s0580: {
    literal: "That year Uighurs, Nanzhao, Parhae, Koguryo, Tibet, Xi, Khitan, and Heling all paid court tribute.",
    idiomatic: "Many foreign states sent tribute that year.",
  },
  s0581: {
    literal: "Yuanhe 14 — spring, first month, gengchen new moon: because eastern troops camped in the wild, New Year congratulations were not received.",
    idiomatic: "Yuanhe 14 opened without audience while armies were in the field.",
  },
  s0582: {
    literal: "renwu — the inner palace teaching workshop was restored at Yanzheng Lane.",
    idiomatic: "The inner music school returned on renwu.",
  },
  s0583: {
    literal: "dinghai — Xuzhou army broke twenty thousand rebels at Jinxiang.",
    idiomatic: "Wuning troops won at Jinxiang on dinghai.",
  },
  s0584: {
    literal: "Welcoming Fengxiang Famen Temple Buddha relics to the capital — three days in the inner palace, then sent to the temple; nobles and commoners rushed to give alms as if they could not keep pace.",
    idiomatic: "Buddha relics from Famen set off a donation frenzy in Chang'an.",
  },
  s0585: {
    literal: "Penal Vice Minister Han Yu memorialized strongly stating the harm.",
    idiomatic: "Han Yu denounced the relic cult in a memorial.",
  },
  s0586: {
    literal: "guisi — Yu was demoted to Chaozhou prefect.",
    idiomatic: "Han Yu was exiled to Chaozhou on guisi.",
  },
  s0587: {
    literal: "bingchen — Weibo army broke fifty thousand rebels at Dong'e.",
    idiomatic: "Weibo routed rebels at Dong'e on bingchen.",
  },
  s0588: {
    literal: "xinsi — former Cangzhou Prefect Li Zongshi was beheaded at the Lone Willow Tree.",
    idiomatic: "Li Zongshi was executed on xinsi.",
  },
  s0589: {
    literal: "The court had first appointed Zheng Quan to Cangzhou; Zongshi refused the edict and would not yield — later the three armies drove him out and he entered court — hence execution.",
    idiomatic: "He had resisted Zheng Quan's appointment until the army expelled him.",
  },
  s0590: {
    literal: "guimao night — the moon drew near the southern Dipper's leader.",
    idiomatic: "The moon neared the Dipper leader on guimao night.",
  },
  s0591: {
    literal: "bingwu — Weibo army broke ten thousand rebels at Yanggu.",
    idiomatic: "Weibo won again at Yanggu on bingwu.",
  },
  s0592: {
    literal: "Second month, jiyou new moon — Shang Prefect Yan Mo was made Qianzhong observation commissioner.",
    idiomatic: "Yan Mo took Qianzhong on jiyou.",
  },
  s0593: {
    literal: "yimao — an edict to Ziqing field armies: wherever cities are taken, do not rashly kill, burn houses, plunder people's goods, or open graves — strictly forbidden.",
    idiomatic: "Ziqing troops were ordered to spare civilians on yimao.",
  },
  s0594: {
    literal: "Because Zhen and Ji suffered flood disaster, ten thousand bolts of silk were granted Wang Chengzong.",
    idiomatic: "Wang Chengzong received flood relief silk.",
  },
  s0595: {
    literal: "xinyou — Xiangyang commissioner Meng Jian nominated Zhenxiang frontier commander Zhao Jie as Zhenxiang magistrate, violating regular form — fined one month's salary.",
    idiomatic: "Meng Jian was fined for an irregular magistrate appointment.",
  },
  s0596: {
    literal: "renxu — Tian Hongzheng memorialized: this month on the ninth day, Ziqing chief army commander Liu Wu beheaded Li Shidao and two sons' heads and asked to surrender; the twelve prefectures Shidao held were pacified.",
    idiomatic: "Liu Wu killed Li Shidong and surrendered Ziqing on renxu.",
  },
  s0597: {
    literal: "jiazi — the Emperor attended Xuanzheng Hall to receive congratulations.",
    idiomatic: "Court celebrated Ziqing's fall at Xuanzheng on jiazi.",
  },
  s0598: {
    literal: "jisi — at Xing'an Gate the Emperor received captives Tian Hongzheng presented; officials congratulated below the tower.",
    idiomatic: "Tian Hongzheng presented prisoners at Xing'an on jisi.",
  },
  s0599: {
    literal: "gengwu — by decree, Ziqing army commander, Gold-purple Grand Mentor, acting Palace Director, concurrent Investigating Censor Liu Wu was made acting Works Minister, Hua prefect, and Yicheng military commissioner; enfeoffed Prince of Pengcheng with three thousand households; granted twenty thousand strings, one manor and one estate.",
    idiomatic: "Liu Wu was enfeoffed and sent to Yicheng on gengwu.",
  },
  s0600: {
    literal: "guiyou — Tian Hongzheng was given concurrent Master of Works and Grand Councillor.",
    idiomatic: "Tian Hongzheng entered the council on guiyou.",
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
if (data.metadata.chapter !== '015') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 015; standalone T ready (${Object.keys(T).length} entries).`
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
