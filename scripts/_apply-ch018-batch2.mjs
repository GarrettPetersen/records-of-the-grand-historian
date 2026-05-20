#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.018, Wenzong 2 / Wuzong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/018.json';
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
    literal: 'After the Censorate investigates, if facts are found, public service must be rewarded.',
    idiomatic: '"Proven charges merit reward for public service."',
  },
  s0102: {
    literal: 'If it involves false accusation, there must be counter-inquiry.',
    idiomatic: '"False accusation brings counter-inquiry."',
  },
  s0103: {
    literal: 'Proclaim to inner and outer so all clearly know this intent."',
    idiomatic: '"Let all know this rule." Thus ended the edict.',
  },
  s0104: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0105: {
    literal: 'Seventh month, jisi: in the north a meteor crossed the sky for a long time.',
    idiomatic: 'On jisi a meteor crossed the northern sky for a long while.',
  },
  s0106: {
    literal: 'East of the Pass great locusts harmed the crops.',
    idiomatic: 'Locusts ravaged the eastern plain.',
  },
  s0107: {
    literal: 'Xiang, Ying, and the lands east of the river suffered great floods.',
    idiomatic: 'Floods struck Xiang, Ying, and the lower Yangzi.',
  },
  s0108: {
    literal: 'The comet again appeared between Room and Wall.',
    idiomatic: 'The comet returned between Room and Wall.',
  },
  s0109: {
    literal: 'Eighth month: the Uighur Wujie qaghan sent envoys reporting distress, saying his state was attacked by the Kirghiz, the former qaghan died, and the tribes now made him qaghan.',
    idiomatic: 'In the eighth month Uighur Wujie reported Kirghiz attacks and his election as qaghan.',
  },
  s0110: {
    literal: 'Because the state was broken and scattered, he now escorts Princess Taihe south to the great state.',
    idiomatic: 'Broken and scattered, he escorted Princess Taihe south to Tang.',
  },
  s0111: {
    literal: 'At the time Wujie reached the frontier; great chief Wamosi and the Red-Heart chancellor fought, killing Red-Heart and leading several thousand tents near the western city.',
    idiomatic: 'At the frontier Wamosi killed the Red-Heart chancellor and led thousands of tents westward.',
  },
  s0112: {
    literal: 'Tiande defense commissioner Tian Mou reported it.',
    idiomatic: 'Tian Mou of Tiande reported it.',
  },
  s0113: {
    literal: 'Wujie also had his chancellor Qiegan Jiasi memorialize, borrowing Tiande city to settle the princess, still begging grain stores and cattle and sheep for supply.',
    idiomatic: 'Wujie asked to borrow Tiande for the princess and begged grain and herds.',
  },
  s0114: {
    literal: 'An edict sent Gold Crow general Wang Hui and Court of Imperial Clan vice director Li Shiyan to his camp to console, ordering release of the princess to court, and relief grain twenty thousand shi.',
    idiomatic: 'Wang Hui and Li Shiyan were sent to console Wujie, free the princess, and grant twenty thousand shi of grain.',
  },
  s0115: {
    literal: 'September: Youzhou army mutinied, expelled its commander Shi Yuanzhong, and made barracks general Chen Xingtai provisional commander.',
    idiomatic: 'In the ninth month Youzhou expelled Shi Yuanzhong for Chen Xingtai.',
  },
  s0116: {
    literal: 'The three armies submitted a memorial requesting credentials; court orders were not yet granted.',
    idiomatic: 'The armies petitioned for credentials; the court withheld them.',
  },
  s0117: {
    literal: 'Tenth month: Youzhou Xiongwu commissioner Zhang Jiang sent army clerk Wu Zhongshu to court, saying Xingtai was cruel and could not hold a commander\'s post, requesting the garrison army be added for punishment; it was permitted.',
    idiomatic: 'In the tenth month Zhang Jiang denounced Xingtai\'s cruelty and won permission to attack.',
  },
  s0118: {
    literal: 'Tenth month: Xingtai was executed; Jiang was then made provisional commander.',
    idiomatic: 'Xingtai was executed; Zhang Jiang took command.',
  },
  s0119: {
    literal: 'The imperial carriage hunted at Xianyang.',
    idiomatic: 'The Emperor hunted at Xianyang.',
  },
  s0120: {
    literal: 'Eleventh month, dingyou new moon.',
    idiomatic: 'The eleventh month opened on dingyou.',
  },
  s0121: {
    literal: 'On renyin night a great star flowed northeast; its light lit the ground; there was sound like thunder; mountains collapsed and stones fell.',
    idiomatic: 'On renyin night a great fire-star lit the northeast with thunder; mountains collapsed.',
  },
  s0122: {
    literal: 'The comet arose in Room; in all fifty-six days it vanished.',
    idiomatic: 'The comet in Room lasted fifty-six days.',
  },
  s0123: {
    literal: 'Princess Taihe sent envoys to court saying Wujie styled himself qaghan and begged investiture patent; because he had first reached south of the desert he begged envoys to console—approved.',
    idiomatic: 'Princess Taihe asked patents for Wujie; envoys were sent to console him.',
  },
  s0124: {
    literal: 'Twelfth month: the Secretariat memorialized rules for revising the Veritable Records: "The old record carries words from within the forbidden quarters.',
    idiomatic: 'In the twelfth month the Secretariat tightened Veritable Records rules:',
  },
  s0125: {
    literal: 'We consider that when the sovereign speaks with councillors and ministers, all must hear before it may be written in the historical book.',
    idiomatic: '"Only words heard by many may enter the history."',
  },
  s0126: {
    literal: 'Moreover words within the forbidden—how would the outer know? If obtained by rumor they often involve the floating and false; to shape them in the history pen truly burdens great design.',
    idiomatic: '"Inner words known only by rumor must be cut."',
  },
  s0127: {
    literal: 'Hereafter if the Veritable Records has such color, all request excision.',
    idiomatic: '"Cut such passages hereafter."',
  },
  s0128: {
    literal: 'Also when councillors and ministers debate affairs, whether carried out or not there must be clear evidence.',
    idiomatic: '"Debates need public proof of outcome."',
  },
  s0129: {
    literal: 'If a memorial is approved and pleasing, praise must appear;',
    idiomatic: '"Approved plans must show praise;"',
  },
  s0130: {
    literal: 'if what is discussed is perverse, there will be punishment.',
    idiomatic: '"perverse ones punishment."',
  },
  s0131: {
    literal: 'In frontier commands memorials must have written replies; key officials presenting affairs have their own clarity—all must shine in human eyes and ears.',
    idiomatic: '"Frontier memorials need written replies visible to all."',
  },
  s0132: {
    literal: 'Whether keep or discard rests in hall records, or grant and seize appears in edicts—former dynasties\' histories record memorials and meaning without exception thus.',
    idiomatic: '"Hall records and edicts must show decisions openly."',
  },
  s0133: {
    literal: 'Recently the Veritable Records often carry secret memorials—words not proclaimed in court hearing, affairs not shown at the time, obtained from their families, insufficient for trust.',
    idiomatic: '"Secret memorials from families must not be recorded."',
  },
  s0134: {
    literal: 'Hereafter Veritable Records may record memorials only if the court jointly knew them; secret memorials all request not to be recorded.',
    idiomatic: '"Record only what the court jointly knew."',
  },
  s0135: {
    literal: 'Thus principle can be law, all turn to fairness, love and hate cannot run, praise and blame words will be trusted."',
    idiomatic: '"Thus history stays fair and trusted." Thus ended the memorial.',
  },
  s0136: {
    literal: '" It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0137: {
    literal: 'Li Deyu memorialized to revise the Veritable Records\' record of Jifu\'s faults; Zheng Ya to please the intent cut them.',
    idiomatic: 'Li Deyu had Zheng Ya cut Jifu\'s faults from Xianzong\'s records.',
  },
  s0138: {
    literal: 'Deyu changed this memorial clause to cover his tracks.',
    idiomatic: 'Deyu rewrote the rule to hide his hand.',
  },
  s0139: {
    literal: 'Gentry slandered; Wuzong knew it fairly well.',
    idiomatic: 'The gentry murmured; Wuzong knew.',
  },
  s0140: {
    literal: 'Huichang 2, spring, first month, bingchen new moon—year Huichang 2 duplicated—Prince of Fu Hong was made Acting Grand Preceptor and Youzhou grand protector, full Youzhou Lulong military commissioner.',
    idiomatic: 'Huichang 2 opened with Prince of Fu Hong made Lulong commissioner.',
  },
  s0141: {
    literal: 'Xiongwu commissioner Zhang Jiang was made Acting Left Cavalier and concurrent Youzhou left marshal, provisional commander of both commissions, still granted the name Zhongwu.',
    idiomatic: 'Zhang Jiang became Zhongwu, provisional Lulong commander.',
  },
  s0142: {
    literal: 'The Secretariat memorialized officials\' debate: the Nine Palaces altar was originally a great sacrifice; request lowering it to middle sacrifice.',
    idiomatic: 'The Nine Palaces altar was lowered from great to middle sacrifice.',
  },
  s0143: {
    literal: 'Grand councillors Cui Gong and Chen Yixing memorialized fixing the protocol for left and right vice directors presenting affairs.',
    idiomatic: 'Cui Gong and Chen Yixing fixed vice-director audience protocol.',
  },
  s0144: {
    literal: 'Second month, bingyin: the Secretariat memorialized: "Per the Yuanhe 7 order, Hedong, Fengxiang, Bin-Fang, and Bin-Ning circuit prefects were to receive supplemental salary funds of sixty-two thousand five hundred strings yearly from Revenue.',
    idiomatic: 'On bingyin the Secretariat asked steady supplemental pay for frontier prefects:',
  },
  s0145: {
    literal: 'Personnel released several hundred balanced retention posts; at the time it was thought fitting.',
    idiomatic: '"Personnel once released hundreds of balanced posts when pay was steady."',
  },
  s0146: {
    literal: 'Since then Revenue paid in fragments not on time; observation commissioners then diverted broken funds—empty addition without reaching officials, so candidates feared distance and would not accept appointment.',
    idiomatic: '"Now fragmented pay never reaches appointees, deterring frontier service."',
  },
  s0147: {
    literal: 'We request the ministry deliver in kind and pay on time.',
    idiomatic: '"Deliver supplemental pay in kind on time."',
  },
  s0148: {
    literal: 'Let circuits\' observation vice commissioners manage distribution, solely judge this case, pay monthly, year-end account to Revenue.',
    idiomatic: '"Observation vice commissioners should pay monthly and account yearly."',
  },
  s0149: {
    literal: 'Also appointees often owe capital debts; on reaching post they repay, so their greed—none is not from this.',
    idiomatic: '"Capital debts drive frontier greed."',
  },
  s0150: {
    literal: 'This year\'s three selections—for those gaining posts in the aforesaid prefectures, permit joint bonds; Revenue lends two months supplemental salary, deducted at payout.',
    idiomatic: '"Lend two months supplemental pay to new frontier appointees."',
  },
  s0151: {
    literal: 'We hope new officials reaching post carry no interest debt, food and clothing somewhat sufficient, and may be charged with integrity."',
    idiomatic: '"So new appointees arrive debt-free and able to serve cleanly." Thus ended the memorial.',
  },
  s0152: {
    literal: '" It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0153: {
    literal: 'Retired Grand Preceptor Xiao Fang died.',
    idiomatic: 'Xiao Fang, retired grand preceptor, died.',
  },
  s0154: {
    literal: 'Zangke and Nanzhao barbarians sent envoys to court.',
    idiomatic: 'Zangke and Nanzhao sent envoys.',
  },
  s0155: {
    literal: 'Third month: envoys were sent to invest the Uighur Wujie qaghan.',
    idiomatic: 'In the third month envoys invested Wujie qaghan.',
  },
  s0156: {
    literal: 'Zhenwu Lin-Sheng military commissioner Liu Mian was made Acting Right Vice Director, concurrent Taiyuan prefect, Beijing regent, full Hedong military commissioner and circuit observation commissioner, replacing Fu Che.',
    idiomatic: 'Liu Mian replaced Fu Che at Hedong with a massive commission.',
  },
  s0157: {
    literal: 'At the time the Uighur were at Tiande; Mian was ordered to take Taiyuan troops to attack them.',
    idiomatic: 'Mian was ordered to strike the Uighur at Tiande with Taiyuan troops.',
  },
  s0158: {
    literal: 'Fourth month, yichou new moon: Acting Minister of Works and Secretariat Vice Director Li Deyu, Acting Right Vice Director and Secretariat Vice Director Cui Gong, Secretariat Vice Director Li Shen, Acting Minister of Education Niu Sengru, and others submitted a memorial requesting the honorific title Benevolent Sagely Martial Civil Ultimate Filial Emperor.',
    idiomatic: 'On yichou the councillors sought the honorific Benevolent Sagely Martial Civil Ultimate Filial Emperor.',
  },
  s0159: {
    literal: 'On wuyin he received the patent at Xuanzheng Hall.',
    idiomatic: 'On wuyin Wuzong received the honorific at Xuanzheng Hall.',
  },
  s0160: {
    literal: 'That month rain from the ninth to the fourteenth grew worse, so they changed to the twenty-third.',
    idiomatic: 'Rain forced the rites from the ninth to the twenty-third.',
  },
  s0161: {
    literal: 'At the time a petty man informed Commandant Qiu Shiliang that the councillors were drafting an amnesty to cut forbidden-army clothing, grain, and fodder.',
    idiomatic: 'A informer told Qiu Shiliang the amnesty would cut army rations.',
  },
  s0162: {
    literal: 'Shiliang angrily said: "If truly so, the soldiers must riot before the tower."',
    idiomatic: 'Shiliang threatened a tower-front mutiny.',
  },
  s0163: {
    literal: 'Grand councillor Li Deyu and others learned it and requested Extended Ying to plead the matter.',
    idiomatic: 'Li Deyu pleaded the case in Extended Ying.',
  },
  s0164: {
    literal: 'The Emperor said: "The words of a villain."',
    idiomatic: '"Villain\'s talk," said the Emperor.',
  },
  s0165: {
    literal: 'He summoned both army commandants and instructed: "The amnesty comes from my intent, not the councillors; moreover it is not yet implemented—how can you say this?"',
    idiomatic: 'He told the commandants the amnesty was his own and unreleased.',
  },
  s0166: {
    literal: 'Shiliang fearfully apologized.',
    idiomatic: 'Shiliang apologized in fear.',
  },
  s0167: {
    literal: 'That day cleared.',
    idiomatic: 'The sky cleared that day.',
  },
  s0168: {
    literal: 'The Secretariat memorialized: "On New Year\'s day at Hanyuan Hall the hundred officials take formation; only councillors and both-department officials stand inside the railing before the fans open; when fans open they attend before the throne.',
    idiomatic: 'The Secretariat asked councillors to bow with the hundred officials at New Year:',
  },
  s0169: {
    literal: 'Three great morning felicitations, ten thousand states congratulate—only councillors and attending ministers stand like armored warriors, finally not bowing to the supreme before withdrawing—compared to ritual intent, the matter is not balanced.',
    idiomatic: '"Councillors alone stood like guards without bowing—against ritual."',
  },
  s0170: {
    literal: 'We request on audience days at dawn councillors and both-department officials queue before the incense table; when fans open, the usher praises both-department officials to bow again; after bowing ascend and attend."',
    idiomatic: '"Let councillors queue and bow before ascending." Thus ended the memorial.',
  },
  s0171: {
    literal: '" It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0172: {
    literal: 'Tiande reported Uighur tribal tents harassing within the command.',
    idiomatic: 'Tiande reported Uighur harassment.',
  },
  s0173: {
    literal: 'An order: "Encouraging mulberry planting—there have been orders; if numbers increase, report yearly.',
    idiomatic: 'An order forbade felling mulberry for fuel:',
  },
  s0174: {
    literal: 'We know none obey; they recklessly cut, display in markets, and sell as firewood.',
    idiomatic: '"Officials had ignored mulberry orders, selling trees as firewood."',
  },
  s0175: {
    literal: 'From now prefectural agents must strictly forbid."',
    idiomatic: '"Strictly forbid it hereafter." Thus ended the edict.',
  },
  s0176: {
    literal: 'The edict closed with the closing bracket.',
    idiomatic: 'Thus ended the edict.',
  },
  s0177: {
    literal: 'Fifth month: an order for Qingyang Festival besides officials\' pooled gifts additionally granted three hundred strings for vegetarian joint banquet, still ordering Jingzhao to supply tents without pressing market musicians.',
    idiomatic: 'Qingyang Festival gained three hundred strings for banquets without pressed musicians.',
  },
  s0178: {
    literal: 'Tiande commissioner Tian Mou memorialized: Uighur great general Wamosi and Duolan general and officers twenty-six hundred requested surrender; the court sent envoys with edicts to console.',
    idiomatic: 'Wamosi and twenty-six hundred Uighur officers sought surrender.',
  },
  s0179: {
    literal: 'Grand councillor Li Deyu concurrently Acting Minister of Education.',
    idiomatic: 'Li Deyu also became acting minister of education.',
  },
  s0180: {
    literal: 'Retired Grand Preceptor Zheng Qin died.',
    idiomatic: 'Zheng Qin, retired grand preceptor, died.',
  },
  s0181: {
    literal: 'Sixth month, jiazi new moon: Mars transgressed Wood.',
    idiomatic: 'The sixth month opened with Mars transgressing Wood.',
  },
  s0182: {
    literal: 'On bingyin Venus transgressed the eastern well.',
    idiomatic: 'On bingyin Venus crossed the eastern well.',
  },
  s0183: {
    literal: 'Uighur surrendering general Wamosi and officers more than twenty-six hundred reached the capital.',
    idiomatic: 'Wamosi and twenty-six hundred Uighur reached Chang\'an.',
  },
  s0184: {
    literal: 'An order made Wamosi Acting Minister of Works, full Return-to-Righteousness commissioner, enfeoffed Duke of Huaihua, still granted the surname Li and name Sizhong;',
    idiomatic: 'Wamosi became Li Sizhong, Duke of Huaihua, Return-to-Righteousness commissioner;',
  },
  s0185: {
    literal: 'the Uighur chancellor Shouyewu was made Return-to-Righteousness vice commissioner, Acting Right Cavalier, granted the surname Li and name Hongshun.',
    idiomatic: 'Shouyewu became Li Hongshun, his vice commissioner.',
  },
  s0186: {
    literal: 'Seventh month: Lanzhou man Tian Manchuan rebelled holding the prefecture; Liu Mian executed him.',
    idiomatic: 'Liu Mian crushed Tian Manchuan\'s Lanzhou revolt.',
  },
  s0187: {
    literal: 'Eighth month: Uighur Wujie qaghan passed Tiande to north of Batou beacon, plundering Yun and Shuo north of the river; Liu Mian was ordered to march guarding Yanmen passes.',
    idiomatic: 'Wujie raided north of the river; Liu Mian guarded Yanmen.',
  },
  s0188: {
    literal: 'Uighur chief Quwu surrendered to Youzhou and was made Left Martial Guard general on probation.',
    idiomatic: 'Quwu surrendered at Youzhou and became a probationary general.',
  },
  s0189: {
    literal: 'An edict: because the Uighur violated the border and gradually soaked the inner lands, whether attack or defense—by principle what is secure?',
    idiomatic: 'The court asked whether to attack or merely defend the Uighur.',
  },
  s0190: {
    literal: 'Order Junior Preceptor Niu Sengru and Chen Yixing with public ministers to gather debate on feasibility and report.',
    idiomatic: 'Niu Sengru and Chen Yixing were told to debate policy.',
  },
  s0191: {
    literal: 'Sengru said: "Now the hundred officials\' memorials debate holding firm pass defenses and striking when possible with troops."',
    idiomatic: 'Niu Sengru favored holding passes and striking when possible.',
  },
  s0192: {
    literal: 'Grand councillor Li Deyu debated: "What the Uighur rely on are only Wamosi and Red-Heart; now they have split—their strong and weak situation is visible.',
    idiomatic: 'Li Deyu argued the Uighur had lost Wamosi and Red-Heart and could be crushed.',
  },
  s0193: {
    literal: 'Barbarians are fierce and heed not success or failure; having lost two generals they invade in rage—urgent strike and breaking them is certain.',
    idiomatic: '"Strike now while they rage without their generals."',
  },
  s0194: {
    literal: 'Holding peril and showing weakness—the barbarians have no reason to withdraw.',
    idiomatic: '"Defensive weakness only emboldens them."',
  },
  s0195: {
    literal: 'Striking is advantageous."',
    idiomatic: '"Attack is the advantage."',
  },
  s0196: {
    literal: 'The Son of Heaven thought it so.',
    idiomatic: 'The Emperor agreed.',
  },
  s0197: {
    literal: 'Then Xu, Cai, Bian, and Hua six commands\' troops were mobilized; Taiyuan commissioner Liu Mian was Uighur southern campaign commissioner;',
    idiomatic: 'Six commands mobilized; Liu Mian led the southern campaign;',
  },
  s0198: {
    literal: 'Zhang Zhongwu was Youzhou Lulong commissioner, Acting Minister of Works, enfeoffed Duke of Lanling, full Uighur eastern campaign commissioner;',
    idiomatic: 'Zhang Zhongwu led the eastern campaign;',
  },
  s0199: {
    literal: 'Li Sizhong was Hexi Tangut commander, Uighur southwestern campaign commissioner—all assembling at Taiyuan.',
    idiomatic: 'Li Sizhong led the southwest—all converging at Taiyuan.',
  },
  s0200: {
    literal: 'An order made the princes Xian Prince of Yi, Qi Prince of Yan; the eldest imperial daughter Princess of Changle, second daughter Princess of Shouchun, third daughter Princess of Yongning.',
    idiomatic: 'Princes Xian and Qi and three princesses were enfeoffed.',
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
if (data.metadata.chapter !== '018') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 018; standalone T ready (${Object.keys(T).length} entries).`
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
