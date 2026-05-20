#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.014, Shunzong, Xianzong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
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
    literal: "On jiachen Yu Di of Xiangyang was made Grand Councillor.",
    idiomatic: "Yu Di of Xiangyang entered the council on jiachen.",
  },
  s0202: {
    literal: "On bingshen the moon trespassed upon Bi.",
    idiomatic: "The moon crossed the Bi asterism on bingshen.",
  },
  s0203: {
    literal: "On jiyou the newly appointed Supervisor of Attendants and Sichuan campaign staff officer Liu Pi was made Governor of Chengdu and Sichuan military commissioner.",
    idiomatic: "Liu Pi received Sichuan on jiyou — a fatal appointment.",
  },
  s0204: {
    literal: "The Year Star trespassed upon the western rampart of Supreme Palace Enclosure.",
    idiomatic: "Jupiter crossed the western wall of the Imperial Enclosure.",
  },
  s0205: {
    literal: "On gengxu Jinzhou again split off Shiyin county to establish Shiquan county.",
    idiomatic: "Shiquan county was carved from Shiyin on gengxu.",
  },
  s0206: {
    literal: "On renzi Right Remonstrator Wei Dan was made prefect of Zi and Sichuan eastern commissioner; Lu Ying, prefect of Changzhou, was made prefect of Xuan and Xuanchi-Chi observer.",
    idiomatic: "Wei Dan and Lu Ying took Sichuan and Huai-nan posts on renzi.",
  },
  s0207: {
    literal: "On renxu Zheng Yin, Grand Master for Court Audience, acting Secretariat Drafter, Hanlin academician, and pillar of the state, was made Vice Director of the Secretariat, Grand Councillor, and Academician of the Hall for Assembling Worthies.",
    idiomatic: "Zheng Yin joined the council on renxu.",
  },
  s0208: {
    literal: "Li Jifu, bureau director in the Ministry of Personnel and drafter of edicts, was made Secretariat Drafter; Pei, outer bureau director in the Ministry of Personnel, was made bureau director and drafter of edicts; both were also Hanlin academicians.",
    idiomatic: "Li Jifu, Pei, and others entered the Hanlin.",
  },
  s0209: {
    literal: "Spring, first month, bingyin new moon — the Emperor led the ministers at Xingqing Palace to present to the Retired Emperor the title Responding to Heaven, Sagely Longevity Retired Emperor.",
    idiomatic: "In the first month Xianzong offered his father the full retired honorific at Xingqing.",
  },
  s0210: {
    literal: "On dingmao he took Hanyuan Hall to receive court congratulations.",
    idiomatic: "He received New Year felicitations at Hanyuan on dingmao.",
  },
  s0211: {
    literal: "When the rites were complete, he took Danfeng Tower, proclaimed a great amnesty for the empire, and changed the era name to Yuanhe.",
    idiomatic: "From Danfeng he proclaimed amnesty and the Yuanhe era.",
  },
  s0212: {
    literal: "From before dawn on the second day of the first month, great execution and below, normally not pardoned by regular amnesties, were all pardoned and removed.",
    idiomatic: "Even capital crimes usually excluded from amnesty were forgiven.",
  },
  s0213: {
    literal: "On xinwei Han Gao, E-Yue-Mian observer, was made military commissioner of E, Yue, Qi, An, and Huang.",
    idiomatic: "Han Gao received a broader Hubei command on xinwei.",
  },
  s0214: {
    literal: "On dingchou Junior Tutor of the Heir Wei Xiaqing died.",
    idiomatic: "Wei Xiaqing died on dingchou.",
  },
  s0215: {
    literal: "On xinsi Xue Yingzhen, meritorious follower from the Yuanhe restoration and vice protector of the Right Divine Strategy Army, was made lieutenant protector of the Right Divine Strategy Army.",
    idiomatic: "Xue Yingzhen became a Shence army eunuch commander on xinsi.",
  },
  s0216: {
    literal: "On renwu Wang Shizhen, Chengde military commissioner and acting Master of Works, was made Grand Councillor.",
    idiomatic: "Wang Shizhen of Chengde entered the council on renwu.",
  },
  s0217: {
    literal: "On guiwei an edict: because the Retired Emperor's old illness was out of harmony, personally attending with medicine and food — from the sixteenth of this month onward, he is provisionally not to hear government.",
    idiomatic: "The retired emperor's illness suspended audiences from the sixteenth on guiwei.",
  },
  s0218: {
    literal: "Gao Chongwen, Changwu city autumn-defense commander of the Left Divine Strategy Army, was made acting Minister of Works and Shence campaign military commissioner.",
    idiomatic: "Gao Chongwen was appointed to crush Liu Pi in Sichuan.",
  },
  s0219: {
    literal: "On jiashen the Retired Emperor died in Xingqing Palace; the coffin was moved to the Hall of Supreme Ultimate and mourning was proclaimed.",
    idiomatic: "Shunzong died again in the annals' Yuanhe frame — mourning began on jiashen.",
  },
  s0220: {
    literal: "On yiyou Grand Councillor Du You acted as chief mourner; Du Huangchang as ritual commissioner; Right Vice Director Yi Zhen as Daming Palace regent, conducting affairs at the Department of State Affairs.",
    idiomatic: "The funeral bureaucracy was organized on yiyou.",
  },
  s0221: {
    literal: "On renchen the Xiegu road courier stations were restored.",
    idiomatic: "Xiegu postal stations reopened on renchen.",
  },
  s0222: {
    literal: "On wuzi an order: \"Southwestern Sichuan — borders long settled, frontier commands and garrisons each have divisions.",
    idiomatic: "On wuzi an expedition edict opened:",
  },
  s0223: {
    literal: "Recently because a great minister died, neighboring commands were not at peace; Liu Pi then exploited the void to fabricate a rift, nursing wrath into enmity, and so tired the royal army and also harmed the people.",
    idiomatic: "Liu Pi had seized on Wei Gao's death to rebel and harm the people.",
  },
  s0224: {
    literal: "My will stores tolerance for filth and seeks only to settle the people; I sent envoys to proclaim and instruct and entrusted him with the commander's banner.",
    idiomatic: "The emperor had tried appeasement before force.",
  },
  s0225: {
    literal: "I hear roads are blocked and war has not ceased; he lightly dares sieges and plots annexation.",
    idiomatic: "Liu Pi still blocked roads and besieged cities.",
  },
  s0226: {
    literal: "The body of being a ruler — righteousness lies in overcoming cruelty; ordering generals and raising armies is surely not obtained willingly.",
    idiomatic: "War was a reluctant duty of rule.",
  },
  s0227: {
    literal: "It is fitting to order Xingyuan Yan Li, eastern Sichuan Li Kang to coordinate pincers, Shence campaign commissioner Gao Chongwen and Shence army commander Li Yuanyi to lead infantry and cavalry, and with eastern Sichuan and Xingyuan armies jointly advance to attack.",
    idiomatic: "Yan Li, Li Kang, Gao Chongwen, and Li Yuanyi were ordered to converge on Sichuan.",
  },
  s0228: {
    literal: "Grain and supplies — commission the revenue commissioner to dispatch officials and report.\"",
    idiomatic: "Logistics were assigned to the fiscal office. Thus ended the edict.",
  },
  s0229: {
    literal: "On jiawu Gao Chongwen's army by the Xiegu road and Li Yuanyi's army by the Luogu road both assembled at Zitong.",
    idiomatic: "The two columns met at Zitong on jiawu.",
  },
  s0230: {
    literal: "On xinmao the host of ministers asked that he hear government.",
    idiomatic: "Ministers petitioned him to resume rule on xinmao.",
  },
  s0231: {
    literal: "Second month, yiwei new moon — Jing Kuan, bureau director in the Ministry of Revenue, was made grain commissioner of the Shannan-Sichuan campaign.",
    idiomatic: "Jing Kuan became campaign quartermaster in the second month.",
  },
  s0232: {
    literal: "Yan Li memorialized recovery of Jianzhou.",
    idiomatic: "Yan Li reported taking Jianzhou.",
  },
  s0233: {
    literal: "On yichou the visiting Xi king Meiluo was made Silver-Green Glory Grand Master, acting Master of Works, enfeoffed Prince of Raole, and sent back to Tibet.",
    idiomatic: "The Xi king Meiluo was honored and sent home on yichou.",
  },
  s0234: {
    literal: "On guimao Lu Changyuan, Xuanwu military commissioner, was posthumously made Right Vice Director; the late Prefect of Ji Jiang Gongfu was posthumously made Minister of Rites.",
    idiomatic: "Lu Changyuan and Jiang Gongfu were posthumously honored on guimao.",
  },
  s0235: {
    literal: "On jiachen because money was scarce, use of copper vessels was forbidden.",
    idiomatic: "Copper utensils were banned to save coin on jiachen.",
  },
  s0236: {
    literal: "On guichou Tian Ji'an of Weibo was made Grand Councillor.",
    idiomatic: "Tian Ji'an of Weibo entered the council on guichou.",
  },
  s0237: {
    literal: "On wuxu he told the councillors: \"Former dynasties' emperors — some were slack in hearing government, some personally decided complex affairs — what of their Ways?",
    idiomatic: "On wuxu he asked his ministers how an emperor should govern.",
  },
  s0238: {
    literal: "\"Du Huangchang replied: \"An emperor's task lies in cultivating the self with simplicity, choosing the worthy and entrusting them, from dawn seeking the people's sores, setting aside the self to follow others to enrich those below — solidly he should not be slack, dissipated, or at ease.",
    idiomatic: "Du Huangchang urged diligence and delegation, not micromanagement.",
  },
  s0239: {
    literal: "Yet affairs have large and small outlines; one should strive to know the distant and the great;",
    idiomatic: "The ruler must grasp great ends, he said,",
  },
  s0240: {
    literal: "as for ledgers, lawsuits, and the hundred clerks' competence — these are fundamentally not what the human ruler personally bears.",
    idiomatic: "not clerks' paperwork or petty suits.",
  },
  s0241: {
    literal: "Formerly Qin Shihuang personally judged decisions.",
    idiomatic: "Qin Shihuang judged cases himself",
  },
  s0242: {
    literal: "and was mocked by former ages;",
    idiomatic: "and was mocked by history;",
  },
  s0243: {
    literal: "Zhuge Liang, aide to kingly hegemony — above twenty lashes he all examined himself — and was also ridiculed by the enemy state, known not long to endure;",
    idiomatic: "Zhuge Liang's reviewing every harsh punishment was scorned by rivals;",
  },
  s0244: {
    literal: "Wei Mingdi wished to reduce the Secretariat's drafting of affairs — Chen Qiao said it could not be done;",
    idiomatic: "Wei Mingdi's plan to bypass the Secretariat was rebuked;",
  },
  s0245: {
    literal: "Sui Wendi at sundown heard government and ordered guards to pass meals — Emperor Wen also laughed at his finicky scrutiny.",
    idiomatic: "even Sui Wendi's dinner-table audiences were laughed at as excessive.",
  },
  s0246: {
    literal: "The body of being human ruler solidly cannot replace subordinates' offices; only choose men and entrust, demand their results, rewards and punishments must be trusted — who will not give their utmost?",
    idiomatic: "A sage-king trusts ministers, rewards faithfully, and does not do their work.",
  },
  s0247: {
    literal: "The Tradition says of Emperor Shun's virtue: 'What does he do?",
    idiomatic: "Du Huangchang quoted the Analects on Shun:",
  },
  s0248: {
    literal: "Reverently facing south — that is all!'",
    idiomatic: "'He merely faces south with reverence!'",
  },
  s0249: {
    literal: "Truly because he could raise the sixteen ministers and remove the four villains.",
    idiomatic: "Shun ruled by appointing the worthy and banishing the wicked.",
  },
  s0250: {
    literal: "How can he be spoken of in the same year as a lord who wearies spirit and body and personally bears eyes and ears!",
    idiomatic: "Such a ruler is no model for a tired micromanager.",
  },
  s0251: {
    literal: "Yet the human ruler's constant tendency —",
    idiomatic: "Yet rulers, he added,",
  },
  s0252: {
    literal: "the worry is inability to extend sincerity; ministers' flaw is inability to exhaust themselves.",
    idiomatic: "fail from distrust; ministers fail from withholding effort.",
  },
  s0253: {
    literal: "Hence above suspects and below deceives; ritual courtesy may be damaged — wishing to attain order, naturally it is hard to attain.",
    idiomatic: "Suspicion breeds fraud and makes good order impossible.",
  },
  s0254: {
    literal: "If without these flaws, what worry is there of not reaching order?",
    idiomatic: "Without that mutual flaw, order would follow.",
  },
  s0255: {
    literal: "'The Emperor praised it long.",
    idiomatic: "The emperor praised him at length.",
  },
  s0256: {
    literal: "Li Yong, Metropolitan Governor, was made Right Vice Director of the Department of State Affairs; Grand General of the Golden Guard Zheng Yunkui was made Metropolitan Governor.",
    idiomatic: "Li Yong and Zheng Yunkui exchanged capital posts.",
  },
  s0257: {
    literal: "Third month, yichou new moon.",
    idiomatic: "The third month opened on yichou.",
  },
  s0258: {
    literal: "On wuchen an edict: regular-attendance officials may visit graves at Cold Food — within the capital circuit they are permitted holiday travel back and forth; other prefectures and circuits memorialized for decision.",
    idiomatic: "Cold Food grave visits were regulated for capital officials on wuchen.",
  },
  s0259: {
    literal: "On xinwei Vice Censor-in-Chief Wu Yuanheng memorialized: \"Officials of the Secretariat-Chancellery and Censorate of fifth rank and above, the Department of State Affairs of fourth rank and above, all regular third rank and above, acting third rank and above, eastern capital regent, transport and salt commissioners, military observation commissioners, defense and campaign commissioners, Governor of Henan, Governors of Tong and Hua, generals of the guards of third rank and above — on appointment all enter the hall to give thanks; other officials are permitted to bow at the southern court of Xuanzheng and withdraw.",
    idiomatic: "Wu Yuanheng defined which appointees must attend formal thanksgiving audiences.",
  },
  s0260: {
    literal: "\"An edict said: \"Where this precedent includes added commissioners and duties, all follow this.",
    idiomatic: "The throne extended the rule to concurrent commissioners. Thus ended the edict.",
  },
  s0261: {
    literal: "\"Also: \"Personnel of the War, Personnel, and Rites examination bureaus — within each selection limit, from the tenth month to the second month do not attend court.",
    idiomatic: "Examination officials had long claimed exemption from winter audiences;",
  },
  s0262: {
    literal: "If they claim affairs are numerous, then the Secretariat-Chancellery, Censorate, revenue office, and metropolitan government have affairs to the utmost — court attendance as usual.",
    idiomatic: "but the edict noted heavier offices never skipped court.",
  },
  s0263: {
    literal: "Moreover seasonal holidays already grant return rest, and divided days are also permitted — within one month they attend court only ten days; in great heat and great cold they are also shown compassion.",
    idiomatic: "They already had holidays and half-days off, it argued.",
  },
  s0264: {
    literal: "Your subject seeks former precedent and holds that when Wang Yan held the censorate he once discussed this matter and answered in great detail.",
    idiomatic: "Wu Yuanheng cited Wang Yan's earlier precedent.",
  },
  s0265: {
    literal: "I humbly ask that the edict of Zhenyuan 12, fourth month, twenty-seventh day, be followed forever as constant form.\"",
    idiomatic: "He asked to restore the Zhenyuan 12 rule permanently.",
  },
  s0266: {
    literal: "\"It was followed.",
    idiomatic: "The throne agreed.",
  },
  s0267: {
    literal: "On bingzi Yan Li recovered Zizhou.",
    idiomatic: "Yan Li took Zizhou on bingzi.",
  },
  s0268: {
    literal: "On dingchou an order stripped Liu Pi of all offices held in life.",
    idiomatic: "Liu Pi was stripped of rank on dingchou.",
  },
  s0269: {
    literal: "Earlier Han Quanyi entered court; he ordered his nephew Yang Huilin to act as regent; soon an edict appointed Li Yan military commissioner in his stead.",
    idiomatic: "Han Quanyi's nephew Yang Huilin had held the command until Li Yan was appointed.",
  },
  s0270: {
    literal: "Yan went to his post; Huilin held the city in rebellion; an edict sent Hedong and Tiande troops to execute him.",
    idiomatic: "Yang Huilin rebelled when Li Yan arrived; imperial troops were sent.",
  },
  s0271: {
    literal: "On xinsi Xiazhou army commander Zhang Chengjin beheaded Huilin and sent the head as tribute.",
    idiomatic: "Zhang Chengjin killed Huilin and presented his head on xinsi.",
  },
  s0272: {
    literal: "On renchen the late Retired Emperor's Virtuous Consort Lady Dong died.",
    idiomatic: "Lady Dong, Shunzong's consort, died on renchen.",
  },
  s0273: {
    literal: "Gao Chongwen, Shence campaign commissioner, was made acting Minister of War, prefect of Zi, and eastern Sichuan military commissioner.",
    idiomatic: "Gao Chongwen received eastern Sichuan command.",
  },
  s0274: {
    literal: "On wuxu Zhang Zhou, Annan pacification vice commissioner, was made Protector-General of Annan and circuit commissioner.",
    idiomatic: "Zhang Zhou took Annan on wuxu.",
  },
  s0275: {
    literal: "On jihai former eastern Sichuan military commissioner Wei Dan was made Jin-He observer.",
    idiomatic: "Wei Dan went to the Jin-He circuit on jihai.",
  },
  s0276: {
    literal: "On renyin former Annan military commissioner Zhao Chang was made prefect of Guang and Lingnan military commissioner.",
    idiomatic: "Zhao Chang became Lingnan commissioner on renyin.",
  },
  s0277: {
    literal: "On guimao former Lingnan military commissioner Xu Shen died.",
    idiomatic: "Xu Shen died on guimao.",
  },
  s0278: {
    literal: "On bingwu the councillors were ordered to supervise examination of decree-examination candidates at the Department of State Affairs — because decree candidates were summoned by the former dynasty and he did not wish to examine personally.",
    idiomatic: "Ministers supervised the decree exam rather than the emperor on bingwu.",
  },
  s0279: {
    literal: "On dingwei Du You, acting Master of Works and Grand Councillor, was made Minister of Education; the relevant offices prepared rites for enfeoffment and bowing; Grand Councillor as before;",
    idiomatic: "Du You became Minister of Education on dingwei while keeping the council;",
  },
  s0280: {
    literal: "he ceased leading revenue, salt, iron, and transport commissions — following his declination — and Vice Minister of War Li Xun was still made to lead those duties.",
    idiomatic: "he yielded fiscal posts to Li Xun.",
  },
  s0281: {
    literal: "On wushen Liu Zhan, Longyou pacification commissioner, Qinzhou pacification commissioner, and prefect of Qin, was made Baoyi army military commissioner.",
    idiomatic: "Liu Zhan took the Baoyi command on wushen.",
  },
  s0282: {
    literal: "Zhedong was given 100,000 piculs of relief grain.",
    idiomatic: "Zhedong received famine relief grain.",
  },
  s0283: {
    literal: "On jiwei Wu Yuanheng memorialized: regular-attendance officials who are concurrent Censor-in-Chief or vice censor — follow the precedent for acting provincial officials, standing above others of the same original rank.",
    idiomatic: "Wu Yuanheng fixed precedence for censor-concurrents on jiwei.",
  },
  s0284: {
    literal: "On renxu Prince of Shao Yue died.",
    idiomatic: "Prince Yue of Shao died on renxu.",
  },
  s0285: {
    literal: "Wu Yuanheng memorialized: \"Regular-attendance awaiting-order officials — originally this office was established to prepare for questioning.",
    idiomatic: "Wu Yuanheng revived the awaiting-order institution:",
  },
  s0286: {
    literal: "Recently at regular court many do not present business.",
    idiomatic: "recently none had spoken at court.",
  },
  s0287: {
    literal: "From now on let officials of the Department of State Affairs of sixth rank and above with substantive posts, eastern palace tutors, companions, and princes' tutors — each court day two await order; after court, order them to wait at Yanying for audience.\"",
    idiomatic: "Two senior officials per day would wait at Yanying to advise the emperor.",
  },
  s0288: {
    literal: "\"It was followed.",
    idiomatic: "The throne agreed.",
  },
  s0289: {
    literal: "Fifth month, jiazi new moon.",
    idiomatic: "The fifth month opened on jiazi.",
  },
  s0290: {
    literal: "On dingmao Metropolitan Governor Zheng Yunkui died.",
    idiomatic: "Zheng Yunkui died on dingmao.",
  },
  s0291: {
    literal: "On xinwei Wei Wu, Vice Minister of War, was made Metropolitan Governor and concurrent Censor-in-Chief.",
    idiomatic: "Wei Wu became capital intendant on xinwei.",
  },
  s0292: {
    literal: "On renshen eastern Sichuan military commissioner Li Kang was demoted to staff officer of Lei.",
    idiomatic: "Li Kang was exiled to Lei on renshen.",
  },
  s0293: {
    literal: "Chen, Xu, Cai, and other prefectures suffered drought.",
    idiomatic: "Central plains drought continued.",
  },
  s0294: {
    literal: "Zhigong, regent of the Transocean Army, was made Transocean military commissioner.",
    idiomatic: "Cheng Zhigong received full command of the Transocean army.",
  },
  s0295: {
    literal: "On gengchen Left Vice Director and Grand Councillor Zheng Yuqing was made Junior Mentor to the Heir and ceased handling administration.",
    idiomatic: "Zheng Yuqing left the council for the heir's tutorate on gengchen.",
  },
  s0296: {
    literal: "On xinmao Retired Empress Lady Wang was enfeoffed Empress Dowager.",
    idiomatic: "Lady Wang became empress dowager on xinmao.",
  },
  s0297: {
    literal: "Sixth month, guisi new moon — because the empress dowager's investiture rites were complete, capital prisoners were pardoned — death reduced to exile, exile and below reduced one grade in succession.",
    idiomatic: "A partial amnesty followed the dowager's rites on guisi.",
  },
  s0298: {
    literal: "Civil and military officials within and without were given posthumous titles on their mothers; the dowager's kin were measured out favorable grants.",
    idiomatic: "Officials' mothers received honors and the dowager's kin gifts.",
  },
  s0299: {
    literal: "On bingshen Lady Wu, Full Consort of Dezong, was enfeoffed Chongling Virtuous Consort.",
    idiomatic: "Lady Wu was enfeoffed consort of Chongling on bingshen.",
  },
  s0300: {
    literal: "Great wind broke trees.",
    idiomatic: "A gale uprooted trees.",
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
if (data.metadata.chapter !== '014') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 014; standalone T ready (${Object.keys(T).length} entries).`
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
