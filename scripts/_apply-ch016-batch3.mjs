#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.016, Muzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/016.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
  s0201: {
    literal: "Chengzong in gratitude also could establish merit.",
    idiomatic: "Chengzong too had proved loyal.",
  },
  s0202: {
    literal: "Ever speaking of ten generations' grace, bestow one house's glory.",
    idiomatic: "Ten generations of grace would crown one clan.",
  },
  s0203: {
    literal: "Chengzong's brothers already received offices; his funeral also had officials assigned to oversee it with full care.",
    idiomatic: "His brothers were enfeoffed and his funeral overseen with care.",
  },
  s0204: {
    literal:
      'Thus ended the edict. On dingwei Wang Chengzong\'s grandmother Lady Li was enfeoffed Grand Lady of Jin.',
    idiomatic:
      'Thus ended the edict; on dingwei Lady Li was enfeoffed Grand Lady of Jin.',
  },
  s0205: {
    literal: "On dingwei Wang Chengzong's grandmother Lady Li was enfeoffed Grand Lady of Jin.",
    idiomatic: "On dingwei Lady Li was enfeoffed Grand Lady of Jin.",
  },
  s0206: {
    literal: "On xinhai Tian Hongzheng memorialized that Wang Chengyuan on the ninth of this month would lead 2,000 men to take up Hua prefecture.",
    idiomatic: "On xinhai Tian Hongzheng reported Chengyuan marching to Hua.",
  },
  s0207: {
    literal: "Chengde's demand for reward money was quite urgent; Bai Qi was ordered to go first and instruct them.",
    idiomatic: "Chengde pressed for reward cash; Bai Qi went ahead to calm them.",
  },
  s0208: {
    literal: "Hua observation commissioner Wei Zhongxing was made Shaan prefect and Shaan-Guo observer;",
    idiomatic: "Wei Zhongxing took Shaan-Guo;",
  },
  s0209: {
    literal: "Director of the Imperial Clan Li Ao was made Hua prefect, Tongguan defense commissioner, and Zhenguo army commissioner.",
    idiomatic: "Li Ao took Hua and Tongguan.",
  },
  s0210: {
    literal: "On yimao the Emperor visited Gold Crow general Guo Cong's southern manor; Cong presented the manor.",
    idiomatic: "On yimao Muzong accepted Guo Cong's estate as a gift.",
  },
  s0211: {
    literal: "On wuwu an edict: \"I shall temporarily go to Huaqing Palace tomorrow and return at dusk.\"",
    idiomatic: "On wuwu Muzong announced a brief Huaqing visit.",
  },
  s0212: {
    literal: "Censor-in-Chief Li Jiang, Regular Attendant Cui Yuanlue, and below prostrated at Yanying Gate to remonstrate urgently.",
    idiomatic: "Li Jiang and others remonstrated at Yanying Gate.",
  },
  s0213: {
    literal: "The Emperor said: \"My journey is already set — no need for memorials.\"",
    idiomatic: "Muzong said the trip was already decided.",
  },
  s0214: {
    literal: "Remonstrance officials argued again and again.",
    idiomatic: "Remonstrators pressed repeatedly.",
  },
  s0215: {
    literal: "That day Tian Hongzheng memorialized that on the sixteenth of this month he entered Zhen prefecture.",
    idiomatic: "That day Tian Hongzheng reported entering Zhenzhou on the sixteenth.",
  },
  s0216: {
    literal: "On jiwei the Emperor left the palace for Huaqing by the secret route; the Left and Right commissioners cleared the way, over a thousand from the six armies, commissioners, princes, and sons-in-law followed, returning at night.",
    idiomatic: "On jiwei he slipped out to Huaqing with a thousand followers and returned at night.",
  },
  s0217: {
    literal: "On guihai Acting Minister of Works and Crown Prince Junior Tutor Zheng Yuqing died.",
    idiomatic: "On guihai Zheng Yuqing died.",
  },
  s0218: {
    literal: "Wei prefect and Jingyuan frontier commander Hao Qi, Prince of Baoding, was made Qing prefect.",
    idiomatic: "Hao Qi was moved inland to Qingzhou.",
  },
  s0219: {
    literal: "About to go deep into Tibet to fight, the court feared losing a brave general, hence moving him within the interior.",
    idiomatic: "The court feared losing him in deep Tibet raids.",
  },
  s0220: {
    literal: "Twelfth month, jisi new moon.",
    idiomatic: "The twelfth month opened on jisi.",
  },
  s0221: {
    literal: "On wuyin the late female academician Song Ruohua's sister Ruozhao was summoned to the palace to manage documents.",
    idiomatic: "On wuyin Song Ruozhao entered palace service.",
  },
  s0222: {
    literal: "On renwu he visited the Right Army for cuju, then hunted west of the city.",
    idiomatic: "On renwu he played cuju and hunted west of Chang'an.",
  },
  s0223: {
    literal: "On bingxu former Zhaoyi military commissioner Xin Mi died.",
    idiomatic: "On bingxu Xin Mi died.",
  },
  s0224: {
    literal: "On jichou Treasury Bureau director Niu Sengru was made Vice Censor-in-Chief.",
    idiomatic: "On jichou Niu Sengru became vice censor-in-chief.",
  },
  s0225: {
    literal: "Lingnan reported Huangfu Bo, clerk of Yazhou, died.",
    idiomatic: "Lingnan reported Huangfu Bo's death in exile.",
  },
  s0226: {
    literal: "On bingshen Secretariat Gate Bureau external official Bai Juyi was made Guest Host director and drafting officer.",
    idiomatic: "On bingshen Bai Juyi entered the drafting office.",
  },
  s0227: {
    literal: "This year household registers totaled 2,375,400 households and 15,760,000 persons.",
    idiomatic: "The census counted 2.38 million households and 15.76 million people.",
  },
  s0228: {
    literal: "Ding, Yan, Xia, eastern and western Sichuan, Lingnan, Qianzhong, Yong, Rong, and Annan — ninety-seven prefectures in all — did not file household registers.",
    idiomatic: "Ninety-seven frontier prefectures filed no census.",
  },
  s0229: {
    literal: "Changqing 1 — In the first month of Changqing 1, on jihai new moon, the Emperor personally offered sacrifice at the Supreme Ultimate and Imperial Ancestor temples.",
    idiomatic: "Changqing 1 opened with sacrifices at the ancestral temples.",
  },
  s0230: {
    literal: "That day the imperial procession went to the southern suburb.",
    idiomatic: "That day the procession went south for the suburban rite.",
  },
  s0231: {
    literal: "The sun showed halos; the chief ministers congratulated before the throne.",
    idiomatic: "Solar halos appeared; ministers offered congratulations.",
  },
  s0232: {
    literal: "On xinchou Heaven was sacrificed at the Round Mound; that day he returned to the palace, ascended Danfeng Tower, and proclaimed great amnesty.",
    idiomatic: "On xinchou the suburban sacrifice ended with universal amnesty from Danfeng Tower.",
  },
  s0233: {
    literal: "The era name was changed to Changqing.",
    idiomatic: "The reign was renamed Changqing.",
  },
  s0234: {
    literal: "Civil and military within and without, and retired officials of third rank and above, were granted one noble rank; fourth rank and below one step; commoners attending received two merit rotations; guards and soldiers beyond the general grace received graded merit and rank.",
    idiomatic: "Amnesty grants ranged by rank across the bureaucracy and army.",
  },
  s0235: {
    literal: "Still per old precedent, 204,960 bolts of goods were granted.",
    idiomatic: "The court also distributed 204,960 bolts of goods.",
  },
  s0236: {
    literal: "When rites ended, ministers congratulated before the tower.",
    idiomatic: "Ministers congratulated before Danfeng Tower.",
  },
  s0237: {
    literal: "When the guard withdrew, the Emperor attended the empress dowager at Xingqing Palace.",
    idiomatic: "He then visited the empress dowager at Xingqing.",
  },
  s0238: {
    literal: "On renyin Xia military commissioner memorialized that Zhedong and Hunan frontier troops did not know border affairs — keep their armor, return the men.",
    idiomatic: "Xiazhou asked to keep armor but send home unskilled frontier drafts.",
  },
  s0239: {
    literal: "Lingwu military commissioner Li Ting memorialized asking to take 3,000 autumn-guard troops from Huainan, Zhongwu, and Wuning with clothing and monthly grain, and let the circuit recruit 1,500 swift horsemen for the border.",
    idiomatic: "Li Ting sought 3,000 borrowed troops and 1,500 local recruits.",
  },
  s0240: {
    literal: "Still order fifty men as one society — when one horse dies, society members together replace it, so horses are never lacking.",
    idiomatic: "Fifty-man horse societies would keep mounts supplied.",
  },
  s0241: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0242: {
    literal: "On guimao Heyang-Huai military commissioner —",
    idiomatic: "On guimao Heyang posts were reshuffled:",
  },
  s0243: {
    literal: "Tian Bu was made Jing prefect and Four-Circuits Northern Court frontier commissioner and Jingyuan military commissioner;",
    idiomatic: "Tian Bu took Jingyuan;",
  },
  s0244: {
    literal: "Guo Zhao, Minister of Justice concurrent Minister of Agriculture, was made acting Revenue Minister and Huai prefect, Heyang-Sancheng-Huai military commissioner.",
    idiomatic: "Guo Zhao took Heyang;",
  },
  s0245: {
    literal: "Jingyuan military commissioner Wang Qian was made acting War Minister and Jiangling intendant, Jingnan military commissioner.",
    idiomatic: "Wang Qian took Jingnan.",
  },
  s0246: {
    literal: "On yisi Yan-Fang military commissioner Han Cui changed his name to Chong.",
    idiomatic: "On yisi Han Cui renamed himself Chong.",
  },
  s0247: {
    literal: "On jiyou former acting Dali vice director, Commandant of Sons-in-Law Liu Shijing was made Grand Master of the Stud.",
    idiomatic: "On jiyou Liu Shijing became Grand Master of the Stud.",
  },
  s0248: {
    literal: "Drafting Attendant Wei Hongjing and Xue Cunqing returned the edict sealed; the Emperor explained: \"Shijing's father Chang had frontier merit, long a vice director for more than ten years, and married Princess Yun'an — I wish to add grace; let the appointment proceed.\"",
    idiomatic: "Remonstrators returned Liu Shijing's appointment; Muzong overruled them citing frontier merit and marriage into the imperial clan.",
  },
  s0249: {
    literal: "The appointment then went forward.",
    idiomatic: "The appointment stood.",
  },
  s0250: {
    literal: "Hanlin academician Li Deyu memorialized: \"I see the dynastic precedent — sons-in-law are the state's intimates and should not traffic with important court offices; the Kaiyuan reign especially forbade it.",
    idiomatic: "Li Deyu asked to bar sons-in-law from visiting premiers:",
  },
  s0251: {
    literal: "Recently sons-in-law often go to chief ministers' and key officials' houses — they have no talent to entertain, only leak forbidden secrets and connect inside and outside.",
    idiomatic: "\"They leak secrets when they visit private houses.",
  },
  s0252: {
    literal: "I beg you proclaim to sons-in-law: hereafter if they have business they may come to the Secretariat to see the chief minister; beyond that they must not go to chief ministers' or censorial offices' private residences.\"",
    idiomatic: "Let them meet ministers only at the yamen.\" Thus ended the memorial's effect.",
  },
  s0253: {
    literal: "On wuzi night a comet appeared in Wings.",
    idiomatic: "A comet blazed in the Wing mansion that night.",
  },
  s0254: {
    literal: "On renxu Xiao Mian, Vice Director of the Secretariat and Grand Councillor, Duke of Xu, was made Right Vice Director — he had repeatedly memorialized begging to leave governance.",
    idiomatic: "On renxu Xiao Mian left the council at his own request.",
  },
  s0255: {
    literal: "On guihai Left Regular Cavalry Attendant Cui Yuanlue was made Qian prefect and Qianzhong observer.",
    idiomatic: "On guihai Cui Yuanlue took Qianzhong.",
  },
  s0256: {
    literal: "On dingmao a comet appeared in Changchen, near the first star south of the Supreme Palace's western rampart.",
    idiomatic: "On dingmao a comet neared the Supreme Palace rampart.",
  },
  s0257: {
    literal: "Second month, wuchen new moon.",
    idiomatic: "The second month opened on wuchen.",
  },
  s0258: {
    literal: "On guiyou Right Vice Director Xiao Mian was made Personnel Minister.",
    idiomatic: "On guiyou Xiao Mian became personnel minister.",
  },
  s0259: {
    literal: "On jiaxu Acting Right Vice Director and Personnel Minister Han Gao was ordered to keep the Right Vice Director post.",
    idiomatic: "On jiaxu Han Gao kept the right vice directorship.",
  },
  s0260: {
    literal: "On yihai night the White Planet invaded the Pleiades.",
    idiomatic: "On yihai night Venus crossed the Pleiades.",
  },
  s0261: {
    literal: "On bingzi the Emperor watched miscellaneous music at Linde Hall, greatly pleased, and said to Drafting Attendant Ding Gongzhu: \"I hear that outside, dukes and commoners sometimes hold merry feasts — the times are harmonious and the people at peace; it greatly comforts my heart.\"",
    idiomatic: "On bingzi at Linde Hall Muzong praised widespread feasting to Ding Gongzhu.",
  },
  s0262: {
    literal: "Gongzhu replied: \"It is indeed so.",
    idiomatic: "Ding Gongzhu agreed it was true,",
  },
  s0263: {
    literal: "Yet in my humble view, custom like this is not praiseworthy.",
    idiomatic: "but said such customs were no honor.",
  },
  s0264: {
    literal: "The hundred offices' many affairs gradually fear troubling the sacred mind.",
    idiomatic: "He warned that revelry would burden the emperor with neglected government.",
  },
  s0265: {
    literal: "The Emperor said: \"How could it reach that?\"",
    idiomatic: "Muzong dismissed the worry.",
  },
  s0266: {
    literal: "He replied: \"Guest-feast ritual seeks sincere respect and does not continue with excess.",
    idiomatic: "Gongzhu cited ritual:",
  },
  s0267: {
    literal: "Hence the Odes praise 'joy with measure.'",
    idiomatic: "\"The Odes praise measured joy.",
  },
  s0268: {
    literal: "They satirize repeated dancing.",
    idiomatic: "They mock repeated dancing.",
  },
  s0269: {
    literal: "Former ages' famous gentlemen, on fine days gathering, sometimes pure talk and poetry, pitch-pot and elegant song, cups for exchange — not reaching disorder.",
    idiomatic: "Ancient feasts stayed orderly with poetry and games.",
  },
  s0270: {
    literal: "Since Tianbao the custom has been extravagant; banquets take noisy drunkenness as joy.",
    idiomatic: "Since Tianbao banquets had turned to noisy drunkenness.",
  },
  s0271: {
    literal: "Those holding heavy rank and great power perform mixed, arrogant antics among clerks, without shame.",
    idiomatic: "High officials now caroused shamelessly with clerks.",
  },
  s0272: {
    literal: "Public and private imitate each other, gradually becoming custom.",
    idiomatic: "Public and private life imitated each other.",
  },
  s0273: {
    literal: "Then affairs are widely neglected.",
    idiomatic: "Government was neglected.",
  },
  s0274: {
    literal: "Only the sacred mind seeks order — how can it not weary the imperial concern!",
    idiomatic: "Only the throne still sought order — how could it not weary you!",
  },
  s0275: {
    literal: "Your Majesty should issue instruction forbidding excess, and the realm would be greatly fortunate.\"",
    idiomatic: "Issue prohibitions and the realm would be fortunate.\"",
  },
  s0276: {
    literal: "At the time the Emperor was dissolute in wine and music; Gongzhu used the reply to admonish, and the Emperor deeply approved.",
    idiomatic: "Muzong, deep in wine and music, took the rebuke well.",
  },
  s0277: {
    literal: "On jimao Youzhou military commissioner Liu Zong memorialized asking to leave office, shave the head, and become a monk.",
    idiomatic: "On jimao Liu Zong asked to abdicate and become a monk.",
  },
  s0278: {
    literal: "He also asked to divide Youzhou's prefectures and counties into three circuits and requested 1,000,000 strings to reward the three armies.",
    idiomatic: "He proposed splitting Youzhou into three circuits and sought one million strings.",
  },
  s0279: {
    literal: "On renshen Vice Premier Duan Wenchang was made acting Justice Minister, Grand Councillor, Chengdu intendant, and western Sichuan military commissioner; Du Yuanying, Grand Master for Splendid Happiness, Vice Minister of Revenue, drafting officer, Hanlin academician, Duke of Jian, kept his posts and became Grand Councillor.",
    idiomatic: "On renshen Duan Wenchang went to western Sichuan and Du Yuanying joined the council.",
  },
  s0280: {
    literal: "Western Sichuan military commissioner Wang Bo was made Justice Minister and Salt and Iron transport commissioner.",
    idiomatic: "Wang Bo took Salt and Iron.",
  },
  s0281: {
    literal: "On yiyou Ping'an Army military commissioner Ma Zong memorialized: \"This circuit has 33,500 soldiers under command; from last year's first month onward, those wishing to farm are released, and runaway households are not pursued.\"",
    idiomatic: "Ma Zong asked to release soldiers who wished to farm.",
  },
  s0282: {
    literal: "Earlier, when Henan was pacified and Wang Chengyuan left Zhen prefecture, Chief Minister Xiao Mian and others, not considering distant plans, offered a plan to reduce troops — secretly ordering all military commissioners yearly to count eight desertions or deaths per hundred, hence Zong's memorial.",
    idiomatic: "A secret quota on desertions had provoked Ma Zong's protest.",
  },
  s0283: {
    literal: "On dinghai night the moon invaded Jupiter in Tail's thirteenth degree.",
    idiomatic: "On dinghai night the moon crossed Jupiter in Tail.",
  },
  s0284: {
    literal: "On xinmao Cold Food Festival, ministers were feasted at Linde Hall with graded gifts.",
    idiomatic: "On xinmao Cold Food brought a Linde feast.",
  },
  s0285: {
    literal: "On renchen Vice Minister of Justice Li Jian died.",
    idiomatic: "On renchen Li Jian died.",
  },
  s0286: {
    literal: "On guisi the Nine-Clan Uighur Pijia Protective-Faith Khan died.",
    idiomatic: "On guisi the Uighur khan died.",
  },
  s0287: {
    literal: "Third month, dingyou new moon — Zhedong memorialized moving Ming prefecture to Yin county.",
    idiomatic: "The third month opened with moving Mingzhou.",
  },
  s0288: {
    literal: "Liu Zong presented 15,000 horses.",
    idiomatic: "Liu Zong presented fifteen thousand horses.",
  },
  s0289: {
    literal: "On jiachen Zheng-Hua military commissioner Wang Chengyuan's grandmother Grand Lady of Jin came to court; after seeing the Emperor she was directed to attend the empress dowager in the southern inner palace.",
    idiomatic: "On jiachen Lady Li of Jin visited both emperor and empress dowager.",
  },
  s0290: {
    literal: "On dingwei the Imperial Clan Court memorialized: \"Per the Zhenyuan 21 edict, clansmen attending received 570 offices; per this year's edict 300.",
    idiomatic: "The Imperial Clan asked for 200 more enfeoffments beyond this year's 300.",
  },
  s0291: {
    literal: "Per this year's edict 300.",
    idiomatic: "This year's quota was only three hundred.",
  },
  s0292: {
    literal: "I submit the number is so large many miss grace; beg special grace to release 200 more to office.\"",
    idiomatic: "They begged two hundred additional posts.\"",
  },
  s0293: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0294: {
    literal: "Pinglu Xue Ping memorialized: pirates sold Silla people along coastal prefectures — strictly forbid it so foreign peoples feel grace.",
    idiomatic: "Xue Ping asked to stop selling captured Silla subjects.",
  },
  s0295: {
    literal: "Approved.",
    idiomatic: "The throne agreed.",
  },
  s0296: {
    literal: "On wushen the western and northern capital grain-purchase commissioners were abolished for harassing the people.",
    idiomatic: "On wushen capital grain commissioners were abolished as oppressive.",
  },
  s0297: {
    literal: "The Hebei salt monopoly law was abolished; estimated annual profit totals were given to the monopoly office.",
    idiomatic: "Hebei salt monopoly rules were relaxed to fixed quotas.",
  },
  s0298: {
    literal: "On gengxu Left Vice Director Wei Shou was made Rituals Minister.",
    idiomatic: "On gengxu Wei Shou became rituals minister.",
  },
  s0299: {
    literal: "That night the White Planet neared the Five Chariots.",
    idiomatic: "That night Venus neared the Five Chariots.",
  },
  s0300: {
    literal: "On xinhai Drafting Attendant Wei Hongjing was made Youzhou comfort commissioner; Left Reminder Di Jianmo was deputy.",
    idiomatic: "On xinhai Wei Hongjing and Di Jianmo were sent to comfort Youzhou.",
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
