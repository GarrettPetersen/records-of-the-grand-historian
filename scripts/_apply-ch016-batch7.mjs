#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
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
    literal: "Eastern Capital intendant Chen Chu was made Heyang-Huai military commissioner.",
    idiomatic: "Chen Chu went to Heyang.",
  },
  s0602: {
    literal: "On guiyou, Han Chong memorialized that on the sixth of this month he had sent the army into Bianzhou territory and encamped at Qian Pagoda.",
    idiomatic: "On guiyou Han Chong reported his army entering Bian territory.",
  },
  s0603: {
    literal: "On bingzi, Bianzhou supervising commissioner Yao Wenshou and military commissioner Li Zhi together plotted and beheaded Li Si and his partisans Xue Zhizhong, Qin Lin, and others.",
    idiomatic: "On bingzi Bianzhou loyalists beheaded Li Si and his partisans.",
  },
  s0604: {
    literal: "On dingchou, Han Chong entered Bianzhou.",
    idiomatic: "On dingchou Han Chong entered Bianzhou.",
  },
  s0605: {
    literal: "Former Eastern Capital intendant Li Jiang was made Hua prefect and Tong Pass defense and Zhenguo army commissioner.",
    idiomatic: "Li Jiang was posted to Hua and Tong Pass.",
  },
  s0606: {
    literal: "In Zhedong, Chuzhou had great flood water drowning residents.",
    idiomatic: "Chuzhou flood drowned Zhedong residents.",
  },
  s0607: {
    literal: "Yan-Hai-Qi-Mi military commissioner Cao Hua was made Hua prefect and Yicheng military commissioner and Zheng-Hua-Ying observation commissioner;",
    idiomatic: "Cao Hua took Yicheng;",
  },
  s0608: {
    literal: "Songzhou prefect Gao Chengjian was made Yan prefect and Yan-Hai-Qi-Mi military commissioner;",
    idiomatic: "Gao Chengjian took Yan;",
  },
  s0609: {
    literal: "Bianzhou city-defense military commissioner Li Zhi was made Right Golden Guard General.",
    idiomatic: "Li Zhi was honored at court.",
  },
  s0610: {
    literal: "Yingzhou Di-Zheng-Hua observation commissioner.",
    idiomatic: "He was named Ying observation commissioner.",
  },
  s0611: {
    literal: "Salt and Iron Transport Commissioner Wang Bo presented the Diagram of Opening the Ying Mouth.",
    idiomatic: "Wang Bo presented a canal plan for the Ying mouth.",
  },
  s0612: {
    literal: "Ninth month, wuzi new moon — Zhexi great general Wang Guoqing plotted rebellion; observation commissioner Dou Yizhi suppressed it; more than two hundred accomplices were all executed.",
    idiomatic: "The ninth month opened with Dou Yizhi crushing a Zhexi mutiny.",
  },
  s0613: {
    literal: "Han Chong sent Li Si's sons Daoyuan, Daoshu, and Daoyue — the three were beheaded at the Western Market;",
    idiomatic: "Han Chong sent Li Si's sons to be beheaded at the Western Market;",
  },
  s0614: {
    literal: "Si's wife Lady Ma, young son Daoben, and daughter Bianniang were assigned to the Palace Women.",
    idiomatic: "Li Si's family was sent to the palace women.",
  },
  s0615: {
    literal: "On renzi, Junior Tutor of the Crown Prince Li Yijian died and was posthumously made Grand Tutor of the Crown Prince.",
    idiomatic: "On renzi Li Yijian died and was posthumously honored.",
  },
  s0616: {
    literal: "On guimao, former Heyang military commissioner Guo Zhao was made Hedong intendant and Hedong, Jiang, and Xi military commissioner.",
    idiomatic: "On guimao Guo Zhao took Hedong.",
  },
  s0617: {
    literal: "Supervising Censor-in-Chief Li Deyu was made Runzhou prefect, concurrent Censor-in-Chief, and Zhexi regrouped-defense observation and disposition commissioner, replacing Dou Yizhi.",
    idiomatic: "Li Deyu replaced Dou Yizhi in Zhexi.",
  },
  s0618: {
    literal: "Yizhi was made Vice Minister of Personnel.",
    idiomatic: "Dou Yizhi became vice personnel minister.",
  },
  s0619: {
    literal: "Jinzhou prefect Li Huan was promoted to Jin-Ci regrouped-defense observation commissioner.",
    idiomatic: "Li Huan received an observation commission.",
  },
  s0620: {
    literal: "On yisi, an edict: regrouped-defense prefectures were to have one administrative aide; deputy commissioners for patrol were all stopped.",
    idiomatic: "On yisi regrouped-defense prefectures were streamlined.",
  },
  s0621: {
    literal: "On xinhai, Vice Minister of Personnel Liu Gongchuo was made Censor-in-Chief.",
    idiomatic: "On xinhai Liu Gongchuo became censor-in-chief.",
  },
  s0622: {
    literal: "Earlier an edict had expanded the south face of Furong Garden; commoners' lodges and graves were all to be moved — public sentiment was alarmed.",
    idiomatic: "An order to expand Furong Garden had uprooted commoners.",
  },
  s0623: {
    literal: "On guichou, a lowered edict cancelled it.",
    idiomatic: "On guichou the expansion was cancelled.",
  },
  s0624: {
    literal: "Dezhou troops mutinied, killed prefect Wang Ji, and plundered all his household wealth and slaves.",
    idiomatic: "Dezhou mutineers killed Wang Ji and looted his household.",
  },
  s0625: {
    literal: "On dingsi, Wanzhou prefect Li Yuanxi was made Protector General of Annan.",
    idiomatic: "On dingsi Li Yuanxi took Annan.",
  },
  s0626: {
    literal: "Yinshan-fu Shatuo Turk military commissioner Zhuye Zhixin came to court with tribute; official patent, brocade, and silver vessels were granted.",
    idiomatic: "Shatuo leader Zhuye Zhixin came to court with gifts.",
  },
  s0627: {
    literal: "Winter, tenth month, wuwu new moon.",
    idiomatic: "The tenth month opened on wuwu.",
  },
  s0628: {
    literal: "On renxu, former Hedong Jin-Jiang-Ci-Xi military commissioner, Palace Grandee, acting Minister of Works, Vice Director of the Chancellery, Grand Councillor, Hedong intendant, Upper Pillar, Duke of Xu Han Hong was confirmed as acting Minister of Works and concurrent Vice Director of the Chancellery.",
    idiomatic: "On renxu Han Hong was confirmed in high council rank.",
  },
  s0629: {
    literal: "On jiazi night, the moon occulted the middle star of the Ox Herd.",
    idiomatic: "On jiazi night the moon eclipsed the Ox Herd.",
  },
  s0630: {
    literal: "On wuchen, Xingyuan military commissioner Wu Chongyin came to court and was transferred to Tianping military commissioner.",
    idiomatic: "On wuchen Wu Chongyin was transferred to Tianping.",
  },
  s0631: {
    literal: "On jimao, Works Vice Minister Zheng Quan was made Works Minister; former Hua Vice Minister Xu Jitong was made Works Vice Minister.",
    idiomatic: "On jimao Zheng Quan and Xu Jitong were reassigned at Works.",
  },
  s0632: {
    literal: "That day, the Emperor by the covered way went to Xianyang, stopping at Shanyin Buddhist temple, bestowing one million cash on monks and one hundred bolts of silk on the Xianyang magistrate.",
    idiomatic: "That day the emperor visited Xianyang and lavished gifts on monks and officials.",
  },
  s0633: {
    literal: "Intercalary tenth month, wuzi new moon — Uyghur envoys Golden Guard Grand General Hu Zheng, deputy envoy Grand Master of Splendid Happiness Li Xian, marriage envoy Chamberlain Li Rui, deputy envoy Court of Imperial Sacrifices Vice Director Li Zihong, and others escorted Princess Taihe back from the barbarians.",
    idiomatic: "The intercalary month brought Princess Taihe home from the Uyghurs.",
  },
  s0634: {
    literal: "On gengyin, Minister of Personnel Zheng Yin was made Junior Tutor of the Crown Prince;",
    idiomatic: "On gengyin Zheng Yin became crown prince tutor;",
  },
  s0635: {
    literal: "Grand Master of the Palace Zhao Zongru was made Minister of Personnel;",
    idiomatic: "Zhao Zongru took Personnel;",
  },
  s0636: {
    literal: "Wei Shou was made Xingyuan intendant and Shannan West military commissioner.",
    idiomatic: "Wei Shou went to Shannan West.",
  },
  s0637: {
    literal: "On renchen, Right Valiant Cavalry General Han Gongwu died; court audience was suspended.",
    idiomatic: "On renchen Han Gongwu died and mourning closed court.",
  },
  s0638: {
    literal: "Minister of Revenue Yang Yuling was made Grand Herald.",
    idiomatic: "Yang Yuling became grand herald.",
  },
  s0639: {
    literal: "On bingshen, the Uyghur qaghan sent envoys presenting four state-letter beds, six female attendants, and four Karluk attendants.",
    idiomatic: "On bingshen the Uyghur qaghan sent lavish gifts.",
  },
  s0640: {
    literal: "On jihai, an edict: Hanlin Lecturing Academician and Remonstrating Doctor Lu Sui and Secretariat Drafter Wei Chuhou were additionally made History Office compilers of the Veritable Record of Xianzong, still entering the History Office on alternate days.",
    idiomatic: "On jihai Lu Sui and Wei Chuhou were named to compile Xianzong's Veritable Record.",
  },
  s0641: {
    literal: "Because the Veritable Record was not yet complete, they were for the time being not to enter the inner drafting office, yet were released from court audience.",
    idiomatic: "Until the record was done they need not attend inner drafting or regular audience.",
  },
  s0642: {
    literal: "On jiayin, an edict: \"Many Jiang-Huai prefectures suffered drought damage; local rice prices could not but soar — thinking on the weary and distressed, favor must be discussed.",
    idiomatic: "An edict on drought relief began:",
  },
  s0643: {
    literal: "Huainan, western and eastern Zhexi, Xuanshe, Jiangxi, and Fujian observation commissioners should each in their circuits where flood or drought occurred take Ever-Normal Granary grain, sell at half the current price estimate to benefit the poor.\"",
    idiomatic: "\"Southern observers should sell granary grain at half price where drought struck.\" Thus ended the edict.",
  },
  s0644: {
    literal: "On bingchen, Crown Prince Guest Linghu Chu was made Shan-Guo observation commissioner.",
    idiomatic: "On bingchen Linghu Chu took Shan-Guo.",
  },
  s0645: {
    literal: "Eleventh month, dingsi new moon.",
    idiomatic: "The eleventh month opened on dingsi.",
  },
  s0646: {
    literal: "On dingmao, Left Vice Director of the Secretariat Geng Chengxuan was made Shan-Guo observation commissioner.",
    idiomatic: "On dingmao Geng Chengxuan took Shan-Guo.",
  },
  s0647: {
    literal: "Linghu Chu again became Crown Prince Guest, assigned to the Eastern Capital.",
    idiomatic: "Linghu Chu was recalled to the Eastern Capital.",
  },
  s0648: {
    literal: "Chu had reached Shanzhou and assumed duties one day — then was changed.",
    idiomatic: "He had served one day at Shanzhou before the reversal.",
  },
  s0649: {
    literal: "On gengwu, Prince Jing was ordered to lead five hundred palace guard horsemen attending the Empress Dowager to Huaqing Palace, and also to Stone Urn Temple.",
    idiomatic: "On gengwu Prince Jing escorted the empress dowager to Huaqing.",
  },
  s0650: {
    literal: "On xinwei, former Protector General of Annan Gui Zhongwu was made Yongguan pacification commissioner.",
    idiomatic: "On xinwei Gui Zhongwu took Yongguan.",
  },
  s0651: {
    literal: "On guiyou, the Emperor went to Huaqing Palace to welcome the Empress Dowager, touring below Mount Li — that day he galloped back; the Empress Dowager returned only the next day.",
    idiomatic: "On guiyou the emperor rushed home from Huaqing before the empress dowager.",
  },
  s0652: {
    literal: "On bingzi, Prince of Ji Xiang died.",
    idiomatic: "On bingzi Prince Xiang died.",
  },
  s0653: {
    literal: "On gengchen, the Emperor and inner attendants played cuju in the forbidden quarters; an inner attendant suddenly fell from his horse as if struck by something.",
    idiomatic: "On gengchen an inner attendant fell mysteriously during palace cuju.",
  },
  s0654: {
    literal: "The Emperor was afraid, stopped cuju and ascended the hall; his feet could not tread the ground; vertigo sent him to bed.",
    idiomatic: "The emperor stopped play, could not walk, and took to his bed with vertigo.",
  },
  s0655: {
    literal: "From then for three days the outer court heard nothing of the Emperor's movements.",
    idiomatic: "For three days the court heard nothing of the emperor's condition.",
  },
  s0656: {
    literal: "That night, the moon drew near the Room mansion.",
    idiomatic: "That night the moon neared the Room mansion.",
  },
  s0657: {
    literal: "Twelfth month, dinghai new moon — an edict released all Five Wards hawks and falcons; hunting gear was all destroyed.",
    idiomatic: "The twelfth month opened with freeing the palace hawks.",
  },
  s0658: {
    literal: "On gengyin, Chief Minister Li Fengji led the hundred officials to Yanying Gate requesting audience — the Emperor did not permit it.",
    idiomatic: "On gengyin Li Fengji was turned away at Yanying Gate.",
  },
  s0659: {
    literal: "Inside and outside the court, together with Pei Du and others, thrice submitted memorials requesting establishment of the crown prince.",
    idiomatic: "Court and ministers thrice begged for a crown prince.",
  },
  s0660: {
    literal: "That night, Minister of Works and Vice Director of the Chancellery Han Hong died.",
    idiomatic: "That night Han Hong died.",
  },
  s0661: {
    literal: "On xinmao, the Emperor at Zichen Hall mounted the great rope bed and received the hundred officials; Li Fengji memorialized that Prince Jing had come of age and requested he be made crown prince; Left Vice Director Pei Du also spoke forcefully.",
    idiomatic: "On xinmao the ailing emperor received officials and heard pleas for Prince Jing.",
  },
  s0662: {
    literal: "On guisi, an edict made Prince Jing crown prince.",
    idiomatic: "On guisi Prince Jing was named crown prince.",
  },
  s0663: {
    literal: "Huainan memorialized Hezhou famine; Wujiang commoners killed the magistrate to seize official grain.",
    idiomatic: "Huainan reported famine and a magistrate killed for grain.",
  },
  s0664: {
    literal: "On jiawu, two hundred bolts of silk were issued from the inner palace to relieve the crippled poor of the two markets.",
    idiomatic: "On jiawu silk relieved the capital's destitute.",
  },
  s0665: {
    literal: "On jiwei, the two armies' commissioners, inner offices, princesses, and affinal kin — all because the Emperor's illness had fully recovered — held vegetarian feasts at various temples.",
    idiomatic: "On jiwei the court celebrated the emperor's recovery with temple feasts.",
  },
  s0666: {
    literal: "Still an edict ordered capital offices to review and release prisoners.",
    idiomatic: "Prisoners were ordered released.",
  },
  s0667: {
    literal: "On bingwu, the Emperor attended Xuanzheng Hall to invest the crown prince.",
    idiomatic: "On bingwu the crown prince was invested.",
  },
  s0668: {
    literal: "When investiture was complete, the hundred officials visited the crown prince at the Eastern Palace; the crown prince raised the curtain, held the tablet, and returned bows; when palace officers bowed he received them.",
    idiomatic: "Officials then paid court to the new heir with full ceremony.",
  },
  s0669: {
    literal: "On dingwei, revenue judge and Vice Minister of Revenue Zhang Pingshu was demoted to Tongzhou prefect.",
    idiomatic: "On dingwei Zhang Pingshu was exiled to Tongzhou.",
  },
  s0670: {
    literal: "That night, the moon occulted the Left Horn.",
    idiomatic: "That night the moon eclipsed the Left Horn.",
  },
  s0671: {
    literal: "On jiyou, former Tianping military commissioner Ma Zong was made acting Left Vice Director, acting Minister of Revenue.",
    idiomatic: "On jiyou Ma Zong was named acting left vice director.",
  },
  s0672: {
    literal: "On gengxu, Vice Minister of Personnel Dou Yizhi was made Vice Minister of Revenue and revenue judge.",
    idiomatic: "On gengxu Dou Yizhi took revenue.",
  },
  s0673: {
    literal: "On guichou, because crown prince investiture rites were complete, an edict proclaimed amnesty for prisoners.",
    idiomatic: "On guichou investiture amnesty was proclaimed.",
  },
  s0674: {
    literal: "Former Qianzhong observation commissioner Cui Yuanlue was made E-Yue-Qi-Huang-An observation commissioner.",
    idiomatic: "Cui Yuanlue took the E-Yue command.",
  },
  s0675: {
    literal: "Crown Prince Guest Meng Jian died.",
    idiomatic: "Meng Jian died.",
  },
  s0676: {
    literal: "On yimao, former Shan-Guo observation commissioner Wei Zhongxing was made Right Vice Director of the Secretariat.",
    idiomatic: "On yimao Wei Zhongxing became right vice director.",
  },
  s0677: {
    literal: "That winter in the tenth month snow fell repeatedly; afterward it was constantly warm, water did not freeze, grass and trees sprouted — as after the first or second month.",
    idiomatic: "That winter snow gave way to unseasonable warmth and budding trees.",
  },
  s0678: {
    literal: "Changqing 3 — In the first month of Changqing 3, dingsi new moon — because of illness the Emperor did not receive New Year congratulations.",
    idiomatic: "Changqing 3 opened with illness canceling New Year audience.",
  },
  s0679: {
    literal: "That day, great wind; gloom covered the day.",
    idiomatic: "That day wind and gloom shrouded the sky.",
  },
  s0680: {
    literal: "Heir Apparent of E Wang Zuo was to be settled at Yazhou for falsely spreading forbidden-palace words.",
    idiomatic: "Prince Zuo was exiled to Yazhou for palace gossip.",
  },
  s0681: {
    literal: "An edict forbade buying new Silla people as slave servants; those already in China were to be sent back to their country.",
    idiomatic: "Buying Silla slaves was forbidden and existing slaves freed.",
  },
  s0682: {
    literal: "Minister of Rites Wang Qi memorialized: when his office tested tribute candidates and testing was finished they were sent to the Secretariat; after review was finished they were returned to his office — then large-character posting of the list.",
    idiomatic: "Wang Qi reformed the examination posting procedure.",
  },
  s0683: {
    literal: "Approved.",
    idiomatic: "The court approved.",
  },
  s0684: {
    literal: "Second month — Tianping supervising commissioner memorialized: military commissioner Wu Chongyin was ill; guard officer Wang Zan cut flesh from his thigh to treat him. Heyang military commissioner Chen Chu memorialized: moving the commissioner office to Three Cities, there were no gate halberds — he wished to move Huai prefecture gate halberds to Heyang.",
    idiomatic: "Second month brought memorials on Wu Chongyin's illness and Heyang ritual arms.",
  },
  s0685: {
    literal: "Approved.",
    idiomatic: "Both were approved.",
  },
  s0686: {
    literal: "Remonstrating Doctor Yin You memorialized asking the Ministry of Rites examination to establish Three Traditions and Three Histories subjects — approved.",
    idiomatic: "Yin You added Three Traditions and Three Histories to the examinations.",
  },
  s0687: {
    literal: "Minister of Revenue.",
    idiomatic: "At Revenue,",
  },
  s0688: {
    literal: "Cui Cong died.",
    idiomatic: "Cui Cong, the revenue minister, died.",
  },
  s0689: {
    literal: "Third month, dingsi — chief ministers and the hundred officials were granted feast at Qujiang Pavilion.",
    idiomatic: "In the third month the court feasted at Qujiang.",
  },
  s0690: {
    literal: "An edict: imperial mourning dress and vessels due from Huainan, two Zhe, Xuanshe, and other circuits, and regular Dragon Boat and birthday tributes — all were temporarily stopped.",
    idiomatic: "Tribute of mourning goods and festival gifts was suspended.",
  },
  s0691: {
    literal: "Hawks, dogs, and the like — except for hunting reserve — were all ordered released.",
    idiomatic: "Hunting birds and dogs were released except for the hunt.",
  },
  s0692: {
    literal: "Niu Sengru was made Grand Councillor.",
    idiomatic: "Niu Sengru joined the council.",
  },
  s0693: {
    literal: "In the late afternoon, bandits entered Tonghua Gate; one died in fighting, six were wounded.",
    idiomatic: "Late that day bandits fought at Tonghua Gate.",
  },
  s0694: {
    literal: "Palace Attendant Office followers were granted one hundred twenty strings and below in graded amounts.",
    idiomatic: "Palace attendants received cash grants.",
  },
  s0695: {
    literal: "Fifth month — Shannan West memorialized moving Chen prefecture to Baojing Fort.",
    idiomatic: "Shannan West moved Chen prefecture to Baojing.",
  },
  s0696: {
    literal: "Shannan East military commissioner Niu Yuanyi died.",
    idiomatic: "Niu Yuanyi died.",
  },
  s0697: {
    literal: "Secretariat Vice Supervisor Li Sui memorialized requesting one History Office book seal — approved.",
    idiomatic: "Li Sui received a History Office seal.",
  },
  s0698: {
    literal: "Sixth month — supervising compiler of maps and histories Du Yuanying memorialized: History Officer Shen Chuanshi, having been made Hunan military commissioner, should take his duty of compiling history and proceed to his post to compile.",
    idiomatic: "Du Yuanying ordered Shen Chuanshi to compile history in his new post.",
  },
  s0699: {
    literal: "Approved.",
    idiomatic: "The court approved.",
  },
  s0700: {
    literal: "An edict: Jingzhao intendant and Censor-in-Chief Han Yu should be released from Secretariat audience duty — afterward this must not become precedent.",
    idiomatic: "Han Yu was excused from Secretariat audience, not as precedent.",
  }
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
