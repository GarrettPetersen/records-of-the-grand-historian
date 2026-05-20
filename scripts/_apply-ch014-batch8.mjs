#!/usr/bin/env node
/** Batch 8: s0701–s0770 (Jiutangshu ch.014, Shunzong, Xianzong 1) — 70 sentences */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/014.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 770;

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
  s0701: {
    literal: "Then all under Heaven constantly uses three parts laboring sinew and bone to support seven parts sitting clothed awaiting food.",
    idiomatic: "Three labor for every seven who only consume.",
  },
  s0702: {
    literal: "Now inner and outer offices receiving salary are not fewer than ten thousand posts; among them are posts with duties under strange names, salaries separate from the original bureau, offices vacant and abandoned, yet ranks drift on — very many.",
    idiomatic: "Over ten thousand salaried posts include phantom titles and empty desks.",
  },
  s0703: {
    literal: "Moreover revenue daily grows scant while bestowed salaries reach us — offices limited yet entrants to the colored ranks unlimited; how can the nine streams not be mixed, how can the myriad things not be troubled.",
    idiomatic: "Revenue shrinks while salaries swell and sinecures multiply without limit.",
  },
  s0704: {
    literal: "Early Han established not more than sixty commanderies; Wen and Jing's thick transformation — the hundred offices had none before them — then few offices need not mean confused government, many commanderies need not mean confused affairs.",
    idiomatic: "Han had only sixty commanderies yet flourished — few offices need not mean chaos.",
  },
  s0705: {
    literal: "Today all under Heaven has three hundred commanderies, one thousand four hundred counties.",
    idiomatic: "Today there are three hundred commanderies and fourteen hundred counties.",
  },
  s0706: {
    literal: "Hence one town's territory vainly sets many offices; one township's farmers vainly divide county duties — expense reaches vast extent, control entirely light.",
    idiomatic: "One town hosts many offices; one township splits county duties — vast cost, light control.",
  },
  s0707: {
    literal: "We humbly request an edict to Personnel and War vice ministers, bureau directors, gentlemen, and drafting editors, one each, to weave together benefit and harm, detail abolition and retention — staff posts that can be merged, merge them; prefectures and counties that can be merged, merge them; annual entrants that can be reduced, reduce them.",
    idiomatic: "They asked a commission to merge offices, counties, and annual entrants.",
  },
  s0708: {
    literal: "Then benefit will be broad and easy to seek, offices few and easy to govern, slightly reducing redundant eaters, enough to ease the weary farmers.",
    idiomatic: "Trimming eaters would ease the farmers' burden.",
  },
  s0709: {
    literal: "Moreover the state's old regulations, according to rank fixing salary — first rank monthly salary thirty thousand, the rest field, salary grain, and rice, altogether not exceeding one thousand shi — from first rank down, more or less knowable.",
    idiomatic: "Old salary tables capped even first rank at modest levels.",
  },
  s0710: {
    literal: "Since hardship, prohibitions gradually slackened — then added commissioner quotas, thickly requested salary cash.",
    idiomatic: "Since the rebellion extra commissioners had claimed swollen cash salaries.",
  },
  s0711: {
    literal: "Thus in Dali reign powerful ministers' monthly salary reached nine thousand strings; every circuit prefect regardless of size all received one thousand strings.",
    idiomatic: "Dali ministers had drawn nine thousand strings monthly; every prefect one thousand.",
  },
  s0712: {
    literal: "When Chang Gun was chancellor he first set limits; when Li Mi again measured idle and urgent, increasing with the matter — at the time called \"general relief,\" hard to reduce.",
    idiomatic: "Chang Gun and Li Mi had tried to cap pay — called relief, yet hard to cut.",
  },
  s0713: {
    literal: "Yet still there are names surviving while duties are abolished, quotas gone while salary remains — between idle and urgent, thick and thin suddenly differ.",
    idiomatic: "Titles lingered after duties vanished; pay varied wildly between posts.",
  },
  s0714: {
    literal: "To make an eternal model, a constant regulation must be established.\"",
    idiomatic: "A permanent salary law was needed.",
  },
  s0715: {
    literal: "Approved.",
    idiomatic: "The reform memorial was approved.",
  },
  s0716: {
    literal: "Then Drafting Editor Duan Pingzhong, Secretariat Drafting Editor Wei Guanzhi, War Vice Minister Xu Mengong, Revenue Vice Minister Li Jiang, and others were ordered to detail reduction.",
    idiomatic: "Duan Pingzhong, Wei Guanzhi, Xu Mengong, and Li Jiang were ordered to draft cuts.",
  },
  s0717: {
    literal: "On jiashen Vice Censor-in-Chief Liu Gongchuo was made Hunan observer.",
    idiomatic: "On jiashen Liu Gongchuo took Hunan.",
  },
  s0718: {
    literal: "On dinghai Great White approached Right Law Enforcement.",
    idiomatic: "On dinghai Venus neared Right Law Enforcement.",
  },
  s0719: {
    literal: "On wuzi Vice Censor-in-Chief Dou Yizhi was granted crimson fish bag.",
    idiomatic: "On wuzi Dou Yizhi received a crimson fish bag.",
  },
  s0720: {
    literal: "Autumn, seventh month, guisi new moon: retired Right Vice Director Gao Ying died.",
    idiomatic: "Seventh month, guisi new moon: retired Gao Ying died.",
  },
  s0721: {
    literal: "On gengshen posthumous Silver-Green Glory Grandee, Crown Prince Guest Pei Ji was posthumously made Heir Apparent Junior Tutor.",
    idiomatic: "On gengshen Pei Ji was posthumously made Junior Tutor.",
  },
  s0722: {
    literal: "Eighth month, jiahai new moon: Revenue Vice Minister Li Jiang memorialized: \"Prefectures lacking officials' field, salary grain, and rice, and incumbent officials' one-tenth field deduction — request local storage, to prepare flood and drought relief lending.\"",
    idiomatic: "Eighth month: Li Jiang asked to pool officials' field grain for famine relief.",
  },
  s0723: {
    literal: "Approved.",
    idiomatic: "Li Jiang's proposal was approved.",
  },
  s0724: {
    literal: "On yichou Tiande army defense commissioner Zhang Xu was made Xia prefect and Xia-Sui-Yin commissioner.",
    idiomatic: "On yichou Zhang Xu took Xia-Sui-Yin.",
  },
  s0725: {
    literal: "On dingmao Jingnan's former Yong'an army should cease.",
    idiomatic: "On dingmao Jingnan's Yong'an army was abolished.",
  },
  s0726: {
    literal: "On xinsi Changzhou prefect Cui Ping was made Hong prefect and Jiangxi observer.",
    idiomatic: "On xinsi Cui Ping took Jiangxi.",
  },
  s0727: {
    literal: "Ninth month, guisi new moon: Shu prefect Cui Neng was made Qianzhong observer.",
    idiomatic: "Ninth month: Cui Neng took Qianzhong.",
  },
  s0728: {
    literal: "On wuxu Fuping commoner Liang Yue avenged his father, killed Qin Gao, entered prison and requested punishment.",
    idiomatic: "On wuxu Liang Yue killed his father's murderer and surrendered.",
  },
  s0729: {
    literal: "A special edict exempted death, ordered one hundred blows of the staff, and exile to Xun prefecture.",
    idiomatic: "He was spared death, caned, and exiled to Xunzhou.",
  },
  s0730: {
    literal: "Duty Section outer-office gentleman Han Yu presented a memorial arguing and impeaching.",
    idiomatic: "Han Yu memorialized against the leniency.",
  },
  s0731: {
    literal: "Reduced outer-service personnel of all offices by one thousand seven hundred sixty-nine in all.",
    idiomatic: "Outer-service staff were cut by 1,769.",
  },
  s0732: {
    literal: "Qianzhong observer Dou Qun was demoted to Kai prefect — for harsh government; Chen and Jin two prefectures' barbarians rebelled for that reason.",
    idiomatic: "Dou Qun was demoted for harsh rule that sparked Chen and Jin rebellions.",
  },
  s0733: {
    literal: "Winter, tenth month: former Xia commissioner Li Yuan was made acting War Minister, Xuzhou prefect, and Wuning commissioner.",
    idiomatic: "Tenth month: Li Yuan took Wuning at Xuzhou.",
  },
  s0734: {
    literal: "On wuchen Revenue Minister Han Gao was made Eastern Capital regent and acting Eastern Capital Secretariat director.",
    idiomatic: "On wuchen Han Gao became Luoyang regent.",
  },
  s0735: {
    literal: "Crown Prince Household Head Li Fan was made Hua prefect, Tong Pass defense commissioner, and Zhenguo army commander.",
    idiomatic: "Li Fan took Hua and Tong Pass.",
  },
  s0736: {
    literal: "Eastern Capital regent Zheng Yuqing was made Personnel Minister.",
    idiomatic: "Zheng Yuqing became Personnel Minister.",
  },
  s0737: {
    literal: "On jisi an edict: \"We toward the hundred executors and the host of offices are clarifying the source stream to demand real effect.",
    idiomatic: "On jisi an edict began streamlining administration:",
  },
  s0738: {
    literal: "Transport is a weighty affair, specially entrusted to envoys — each circuit has an office dividing supervision;",
    idiomatic: "transport offices duplicated commissioners;",
  },
  s0739: {
    literal: "now Shaan route's grain towing all returns to the center, yet the Intendant's duty title still keeps the old name.",
    idiomatic: "Shaan grain now went to the capital yet old titles remained.",
  },
  s0740: {
    literal: "Moreover each circuit's overall training commissioners suffice to repair military readiness and pacify one region;",
    idiomatic: "Training commissioners should have sufficed for defense;",
  },
  s0741: {
    literal: "yet separately establishing army quotas, thereby adding official salaries, is also empty establishment, quite floating expense.",
    idiomatic: "extra army quotas only added salaries.",
  },
  s0742: {
    literal: "Thinking to remove trouble and return to root, expecting to economize affairs and employ men.",
    idiomatic: "The throne sought to cut redundancy.",
  },
  s0743: {
    literal: "River water-and-land transport, Shaanfu land transport, Runzhou Zhenhai army, Xuanzhou Caishi army, Yuezhou Yisheng army, Hongzhou Nanchang army, Fuzhou Jinghai army commissioner quotas are all to cease.",
    idiomatic: "Numerous transport and army commissioner posts were abolished.",
  },
  s0744: {
    literal: "Commissioner-and-below salaries collected since the affair began are entrusted to each circuit to cover the people's missing two-tax quota, still memorializing the amounts.",
    idiomatic: "Saved salaries were to offset local two-tax shortfalls.",
  },
  s0745: {
    literal: "On wuyin an edict: \"A king's tending the black-haired masses loves them as children, views them as wounded.",
    idiomatic: "On wuyin a famine edict opened:",
  },
  s0746: {
    literal: "If wind and rain are not timely, crops are not abundant, then surely remove trouble and adopt simplicity, spare strength and value toil, to seek convenience and peace, to enrich livelihood.",
    idiomatic: "When harvests fail, the ruler must lighten burdens.",
  },
  s0747: {
    literal: "Moreover within the metropolitan region, the hundred corvées labor — though diligent relief orders are urgently issued, the supply burden is still broad.",
    idiomatic: "The capital's corvée and supply burden remained heavy.",
  },
  s0748: {
    literal: "Added to summer's heat and drought, since autumn continuous rain — southern fields lost sowing's work, western harvest lost abundant hope.",
    idiomatic: "Summer drought and autumn floods had ruined both plantings and harvest.",
  },
  s0749: {
    literal: "Inner managed mouth-food, outer drawn royal corvée — not only transport's worry, fear there is starvation's affliction.",
    idiomatic: "Tax grain and corvée threatened starvation.",
  },
  s0750: {
    literal: "This is because the Way is still obstructed, harmonious qi not yet penetrating — speaking of it here, truly what we blame and sigh.",
    idiomatic: "He blamed cosmic disorder and his own governance.",
  },
  s0751: {
    literal: "The capital district's yearly allotted diverted-sale grain of two hundred fifty thousand shi should be remitted.",
    idiomatic: "Two hundred fifty thousand shi of diverted grain were remitted.",
  },
  s0752: {
    literal: "For commoners with grain willing to deliver in commutation, beyond market price specially add generous bounty.",
    idiomatic: "Grain commutation was priced generously above market.",
  },
  s0753: {
    literal: "This spring's lent charity-granary grain, being famine year, may wait until abundant harvest years to repay.",
    idiomatic: "Spring charity loans could wait for good years to repay.",
  },
  s0754: {
    literal: "All arrears of various levies before Yuanhe 5 are remitted.",
    idiomatic: "All tax arrears before Yuanhe 5 were forgiven.",
  },
  s0755: {
    literal: "The hundred officials' field allotments are very numerous; now because of flood, everywhere roads are blocked — let local storage receive them, revenue disburse, letting the hundred officials draw amounts from the Grand Granary.",
    idiomatic: "Officials' field grain was to be stored locally and drawn from the Grand Granary.",
  },
  s0756: {
    literal: "Where flood and drought struck, totaling damage, grant remission at once, no inspection or verification.",
    idiomatic: "Flood districts were to be written off without audit.",
  },
  s0757: {
    literal: "The root of governance lies in settling the people.",
    idiomatic: "Good government meant settled people.",
  },
  s0758: {
    literal: "You capital Intendants and magistrates are truly entrusted as kin to the people and uplifters of custom — you must inquire into their hardship, uphold our edict articles, take compassion as heart, be not slack in affairs, never pursue profit to strip the lowly, spit out the hard and swallow the soft, so that lanes and wells are all at peace and the solitary and weak obtain relief.",
    idiomatic: "Capital magistrates were ordered to inquire into suffering and forbid squeezing the poor.",
  },
  s0759: {
    literal: "Each strive in loyalty and filial piety — know fully our intent.\"",
    idiomatic: "He closed urging loyal, humane local rule.",
  },
  s0760: {
    literal: "On bingxu Remonstrating Doctor Kong Zhi was made crown prince and princes' lecturer.",
    idiomatic: "On bingxu Kong Zhi became lecturer to the heir and princes.",
  },
  s0761: {
    literal: "Eleventh month, renchen new moon.",
    idiomatic: "The eleventh month opened on renchen.",
  },
  s0762: {
    literal: "On guisi newly appointed Hua prefect Li Fan died.",
    idiomatic: "On guisi Li Fan died before reaching Hua.",
  },
  s0763: {
    literal: "On yisi Works Minister Zhao Chang was made acting War Minister, concurrent Hua prefect, Tong Pass defense, and Zhenguo army commander.",
    idiomatic: "On yisi Zhao Chang took Hua and Tong Pass.",
  },
  s0764: {
    literal: "Twelfth month, jiahai new moon.",
    idiomatic: "The twelfth month opened on jiahai.",
  },
  s0765: {
    literal: "On renshen an edict entrusted the Court of the Imperial Clan director to select men to marry the Sixteen Residences princes' daughters, still enfeoffing them as district princesses.",
    idiomatic: "On renshen clan marriages were arranged for sixteen-residence princesses.",
  },
  s0766: {
    literal: "On jiashen Capital Intendant Yuan Yifang and Revenue Vice Minister and acting revenue commissioner Lu Tan, for violating the edict erecting halberds, were fined one month's salary and the requested gate halberds confiscated.",
    idiomatic: "On jiashen Yuan Yifang and Lu Tan lost a month's pay over illegal gate halberds.",
  },
  s0767: {
    literal: "On jichou an edict made Court Discussion Gentleman, acting Revenue Vice Minister, Valiant Cavalry Captain, granted gold-purple fish bag Li Jiang Court Discussion Doctor, acting Vice Director, and Grand Councilor.",
    idiomatic: "On jichou Li Jiang entered the council.",
  },
  s0768: {
    literal: "Intercalary twelfth month, xinmao new moon: Right Guard senior general Yi Shen died.",
    idiomatic: "Intercalary twelfth month, xinmao new moon: Yi Shen died.",
  },
  s0769: {
    literal: "On xinhai Crown Prince Ning died; posthumous title Huizhao; court mourning abolished three days.",
    idiomatic: "On xinhai Crown Prince Ning died as Huizhao; mourning three days.",
  },
  s0770: {
    literal: "The national code had no ritual for a crown prince's death; Directorate of Education Vice Director Pei Ju was skilled in ritual studies — specially granted to fix rites within the western inner palace.",
    idiomatic: "With no precedent for a dead heir, Pei Ju was ordered to devise rites in the inner palace.",
  },
};const source = loadSentencesFromData();
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
