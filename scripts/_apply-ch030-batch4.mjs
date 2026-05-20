#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.030, Rites 6) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/030.json';
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
    literal: 'carrying the removed-chamber tablet on tour—fifth;',
    idiomatic: 'Carrying the removed-chamber tablet on tour—fifth;',
  },
  s0302: {
    literal: 'no second supreme in honor—sixth;',
    idiomatic: 'No second supreme in honor—sixth;',
  },
  s0303: {
    literal: 'not recorded in the Six Institutions—seventh.',
    idiomatic: 'Not recorded in the Six Institutions—seventh.',
  },
  s0304: {
    literal: 'I respectfully note King Wen moved to Feng and established a temple, King Wu to Hao, King Cheng to Luo—now the Eastern Capital would build a temple without removal, violating temples on removal.',
    idiomatic: 'King Wen, Wu, and Cheng each established temples on removal; the Eastern Capital would build without removal—violating that rule.',
  },
  s0305: {
    literal: 'I respectfully cite the Record of Rites: "In all sacrifice, what has been abolished—none dares raise it.',
    idiomatic: 'The Record of Rites: "What has been abolished in sacrifice—none dares raise; what has been raised—none dares abolish."',
  },
  s0306: {
    literal: 'What has been raised—none dares abolish."',
    idiomatic: 'The Eastern Capital Grand Temple has been abandoned eight reigns; rebuilding violates "abolished must not be raised."',
  },
  s0307: {
    literal: '" Now the Eastern Capital Grand Temple has been abolished through eight reigns; if truly rebuilt, this violates "abolished must not be raised."',
    idiomatic: 'The Record: "Seven and five temples must have no empty tablet."',
  },
  s0308: {
    literal: 'I respectfully cite the Record of Rites: "The seven temples and five temples must have no empty tablet."',
    idiomatic: 'Empty temples violate "temples cannot be empty."',
  },
  s0309: {
    literal: '" To wish empty temples violates "temples cannot be empty."',
    idiomatic: 'The Zuo Commentary: "On dingchou Duke Xi\'s tablet was made—untimely."',
  },
  s0310: {
    literal: 'I respectfully cite the Zuo Commentary: "On dingchou, Duke Xi\'s tablet was made.',
    idiomatic: 'The Record: "Late sacrifice is still ritual."',
  },
  s0311: {
    literal: 'The record is untimely."',
    idiomatic: 'Even timely rites are abandoned when late—may improper tablets be made?',
  },
  s0312: {
    literal: 'The Record also says: "Sacrifice out of season is ritual."',
    idiomatic: 'Out-of-season tablet-making violates the rule.',
  },
  s0313: {
    literal: '" Even proper sacrifice is abandoned when late—may an improper tablet be made?',
    idiomatic: 'Zengzi Questions: "Did armies carry the removed-chamber tablet?"',
  },
  s0314: {
    literal: 'Now to make tablets out of season violates "no out-of-season tablet-making."',
    idiomatic: 'Confucius: On tour the removed-chamber tablet rides on the fasting carriage—honor must be present.',
  },
  s0315: {
    literal: 'I respectfully cite the Zengzi Questions: "In antiquity did armies on campaign carry the removed-chamber tablet?"',
    idiomatic: 'Taking all seven temples\' tablets is wrong.',
  },
  s0316: {
    literal: 'Confucius said: On imperial tour the removed-chamber tablet must be carried, loaded on the fasting carriage—meaning there must be what is honored.',
    idiomatic: 'Huang: "Removed-chamber tablet = one newly removed chamber only."',
  },
  s0317: {
    literal: 'Now to take all seven temples\' tablets on tour is wrong.',
    idiomatic: 'Carrying all temples\' tablets violates that rule.',
  },
  s0318: {
    literal: '" Huang\'s commentary: "Removed-chamber tablet means carrying the tablet of one newly removed chamber."',
    idiomatic: 'The Record: "No second sun; no second king; xiang, di, suburban, soil—no second supreme."',
  },
  s0319: {
    literal: '" Now to carry all temples\' tablets violates carrying the removed chamber alone.',
    idiomatic: 'Building temples and tablets in both capitals violates "no second supreme."',
  },
  s0320: {
    literal: 'I respectfully cite the Record of Rites: "Heaven has no second sun; earth no second king.',
    idiomatic: 'The Six Institutions lists both capitals—the east temple is omitted—violating "not recorded."',
  },
  s0321: {
    literal: 'Xiang, di, suburban, and soil sacrifices—honor has no second supreme."',
    idiomatic: 'No book or tradition supports repair.',
  },
  s0322: {
    literal: '" Now to build temples and tablets in both capitals violates "no second supreme."',
    idiomatic: 'Through Wude and Zhenguan, when models were set and scholars gathered, repair would have been debated if possible.',
  },
  s0323: {
    literal: 'I respectfully cite the Six Institutions\' account of both capitals\' palaces and temples—at this time the Eastern Capital temple is not recorded—violating "not in the Six Institutions."',
    idiomatic: 'Music is Heaven\'s; ritual is Earth\'s.',
  },
  s0324: {
    literal: 'Searching all books and traditions—none supports repair.',
    idiomatic: 'Heaven moves.',
  },
  s0325: {
    literal: 'Through Wude and Zhenguan, when laws were made as models, culture was fully equipped and Confucian worthies gathered—if repair were possible, debate would not have missed it.',
    idiomatic: 'Earth rests."',
  },
  s0326: {
    literal: 'The Record says: Music is made by Heaven; ritual is formed by Earth.',
    idiomatic: 'Music may change; ritual should not.',
  },
  s0327: {
    literal: 'Heaven\'s nature is movement.',
    idiomatic: 'Your Majesty\'s sincerity embraces all things; filial piety toward ancestors seeks the root.',
  },
  s0328: {
    literal: 'Earth\'s nature is rest."',
    idiomatic: 'Deliberation is ordered again to settle the better view.',
  },
  s0329: {
    literal: ' This shows music may be composed; ritual is hard to change.',
    idiomatic: 'In ritual office I must reply clearly.',
  },
  s0330: {
    literal: 'Your Majesty\'s sincerity illuminates all things, solemn reverence governs Heaven; filial piety is urgent toward ancestors, affairs seek the root.',
    idiomatic: 'Dezhang\'s two memorials to the Secretariat and Ritual College are appended.',
  },
  s0331: {
    literal: 'Again ordering collective deliberation to settle what prevails.',
    idiomatic: 'First:',
  },
  s0332: {
    literal: 'I hold office in ritual affairs and dare not fail to set forth clearly in reply.',
    idiomatic: 'The eighth-month sixth-day edict orders debate on repairing the Eastern Capital Grand Temple.',
  },
  s0333: {
    literal: 'Dezhang also submitted two memorials to the Secretariat-Chancellery and Ritual College for detailed debate, both appended below.',
    idiomatic: 'Memorials already held further repair improper by ritual.',
  },
  s0334: {
    literal: 'The first states:',
    idiomatic: 'Thirty-eight Secretariat vice directors and below signed together.',
  },
  s0335: {
    literal: 'I note the sixth-day eighth-month edict wishing to repair the Eastern Capital Grand Temple and order conference.',
    idiomatic: 'Dezhang serves the ritual directorate—when the ruler is strict in worship and the chief minister esteems antiquity, departing from canon shames the age.',
  },
  s0336: {
    literal: 'At that time memorials already held that by ritual it should not be repaired further.',
    idiomatic: 'Hence this earnest reply.',
  },
  s0337: {
    literal: 'Thirty-eight persons from vice directors of the Secretariat down all signed the same memorial.',
    idiomatic: 'Yesterday\'s differences can be stated.',
  },
  s0338: {
    literal: 'Dezhang\'s office is in the ritual directorate—I am ashamed to hold charge; when the sage ruler is strict in suburban worship and the chief minister esteems antiquity over ornament, to depart from the state\'s sacrificial canon and stray from ritual text is not only censure for neglect—it shames the enlightened age.',
    idiomatic: 'First: a capital name implies a temple;',
  },
  s0339: {
    literal: 'Hence earnest and urgent—about to be silent yet speaking again.',
    idiomatic: 'second: repair to await tours.',
  },
  s0340: {
    literal: 'Yesterday\'s divergent views can all be pointed out.',
    idiomatic: 'They ignore empty temples and the one-tablet rule.',
  },
  s0341: {
    literal: 'First: having the name of a capital suffices to establish a temple;',
    idiomatic: 'Zhenguan 9: "Taiyuan began royal enterprise—like Feng/Pei and Wan/Qiao; ritually a temple must be debated."',
  },
  s0342: {
    literal: 'second: wishing to honor-repair the temple to await imperial tours.',
    idiomatic: 'Yan Shigu: "Temples belong in the capital, not separately in the provinces.',
  },
  s0343: {
    literal: 'They do not know temples cannot be empty and only one tablet may be carried.',
    idiomatic: 'Zhou\'s Feng and Hao were removals built as needed—not one-time separate temples."',
  },
  s0344: {
    literal: 'I respectfully cite the Zhenguan ninth-year edict: "Taiyuan, where royal enterprise began, equals Feng and Pei in matter, Wan and Qiao in meaning—in brief ritual terms a temple must be debated."',
    idiomatic: 'Taizong approved and stopped the same day.',
  },
  s0345: {
    literal: '" Then Secretariat Director Yan Shigu argued: "I have surveyed sacrificial canons and examined ritual classics—ancestral temples are all in the capital, not separately set in the provinces.',
    idiomatic: 'Taiyuan had a capital name yet was abolished—the Eastern Capital follows suit.',
  },
  s0346: {
    literal: 'Formerly Zhou\'s Feng and Hao were true removals—building as the matter required, not a separate establishment for one moment."',
    idiomatic: 'New chambers need tablets; buried tablets mean emptiness.',
  },
  s0347: {
    literal: '" Taizong approved the memorial and stopped the same day.',
    idiomatic: 'Capital therefore temple" collapses.',
  },
  s0348: {
    literal: 'Thus Taiyuan had a capital name yet was then abolished—the Eastern Capital need not be built is clear.',
    idiomatic: 'Zengzi Questions again: "Must the removed-chamber tablet be carried on campaign?"',
  },
  s0349: {
    literal: 'Moreover, when temple chambers are new, tablets are required; if tablets are stored and buried, how are they not empty?',
    idiomatic: 'Confucius: On tour it rides on the fasting carriage.',
  },
  s0350: {
    literal: 'The argument "capital therefore temple" refutes itself.',
    idiomatic: 'All seven temples is wrong.',
  },
  s0351: {
    literal: 'Again the Zengzi Questions: "In antiquity on campaign must the removed-chamber tablet be carried?"',
    idiomatic: 'Huang: only the newly removed chamber.',
  },
  s0352: {
    literal: 'Confucius: On tour the removed-chamber tablet is carried on the fasting carriage—there must be what is honored.',
    idiomatic: 'Un-entombed tablets are not carried on tour.',
  },
  s0353: {
    literal: 'To take all seven temples\' tablets is wrong.',
    idiomatic: 'Un-entombed tablets have no text for carrying on tour.',
  },
  s0354: {
    literal: '" Huang: "Removed-chamber tablet means only the one newly removed chamber."',
    idiomatic: 'Even awaiting tours, one chamber could be built—what basis for debating nine chambers?',
  },
  s0355: {
    literal: '" Un-entombed tablets have no text for carrying on tour.',
    idiomatic: 'The ancestral temple is honored and weighty—how decide on doubtful text?',
  },
  s0356: {
    literal: 'Even awaiting tours, one chamber could be built—what basis for debating nine chambers?',
    idiomatic: 'If words lack classic warrant, it is presumptuous deliberation.',
  },
  s0357: {
    literal: 'The ancestral temple is honored and weighty—how decide on doubtful text?',
    idiomatic: 'Even for tours one chamber suffices—nine chambers lack warrant.',
  },
  s0358: {
    literal: 'If words lack classic warrant, it is presumptuous deliberation.',
    idiomatic: 'The temple is supremely weighty—doubtful text cannot decide.',
  },
  s0359: {
    literal: 'Recent edicts: all deliberation must follow the classics item by item.',
    idiomatic: 'Without classics it is presumptuous.',
  },
  s0360: {
    literal: 'Without classic text, history may be used.',
    idiomatic: 'If words lack classic warrant, it is presumptuous deliberation.',
  },
  s0361: {
    literal: 'If neither classic nor history supports it, one may not speak at will.',
    idiomatic: 'Recent edicts require item-by-item classic warrant.',
  },
  s0362: {
    literal: 'An Eastern Capital temple has no classic or historical warrant—following private opinion contradicts prior edicts.',
    idiomatic: 'Else history; else silence.',
  },
  s0363: {
    literal: 'The Documents: "When three men divine, follow the two."',
    idiomatic: 'An Eastern Capital temple lacks both—private opinion contradicts edicts.',
  },
  s0364: {
    literal: '" Of forty-eight in conference, only six or seven agreed—compared with "two of three," how excessive!',
    idiomatic: 'The Documents: "Three divine; follow two."',
  },
  s0365: {
    literal: 'Yao and Shun as emperors are praised to this day not for other arts or strange wisdom but for worthy ministers assisting and following antiquity.',
    idiomatic: 'Forty-eight debated; six or seven agreed—far from "two of three."',
  },
  s0366: {
    literal: 'Thus Yao\'s document says "Examining antiquity, Emperor Yao."',
    idiomatic: 'Yao and Shun are praised for ministers who followed antiquity, not strange arts.',
  },
  s0367: {
    literal: '" Kong\'s commentary: "Able to follow and examine ancient ways."',
    idiomatic: 'Yao\'s text: "Examining antiquity, Emperor Yao."',
  },
  s0368: {
    literal: '" Yue assisted the Yin ruler: "Not modeling antiquity—Yue has not heard of it."',
    idiomatic: 'Kong: "Following ancient ways."',
  },
  s0369: {
    literal: 'Antiquity is as above; state regulations as below—seeking canonical substance, nothing replaces this.',
    idiomatic: 'Yue: "Not modeling antiquity—unheard of."',
  },
  s0370: {
    literal: 'I hope Your Majesty will root in the orthodox classics, slightly suppress floating debate, follow Gao and Kui\'s ancient way and Zhou and Confucius\'s transmitted text—then orthodox scholars throughout the realm will be deeply fortunate.',
    idiomatic: 'Antiquity and state law agree—no substitute.',
  },
  s0371: {
    literal: 'The rest is in the prior memorial.',
    idiomatic: 'Root in orthodox classics, suppress floating debate, follow Gao, Kui, Zhou, and Confucius—scholars will rejoice.',
  },
  s0372: {
    literal: 'The second states:',
    idiomatic: 'The rest is in the prior memorial.',
  },
  s0373: {
    literal: 'Ancestral temples exist for sincerity and reverence; reviewing the canon, duplication is not sincere.',
    idiomatic: 'Second:',
  },
  s0374: {
    literal: 'Hence without removal one does not separately establish temple buildings.',
    idiomatic: 'Temples serve sincerity; duplication is not sincere.',
  },
  s0375: {
    literal: 'The Record: "Heaven has no second sun; earth no second king; xiang, di, suburban, and soil—honor has no second supreme."',
    idiomatic: 'Without removal, no separate temple.',
  },
  s0376: {
    literal: '" Also: "In sacrifice, what is abolished—none dares raise; what is raised—none dares abolish."',
    idiomatic: 'No second sun, king, or supreme in sacrifice.',
  },
  s0377: {
    literal: '" Then the Eastern Capital Grand Temple long abolished—if repair is debated, it slightly departs from prior intent.',
    idiomatic: 'Abolished rites must not be revived.',
  },
  s0378: {
    literal: 'How so?',
    idiomatic: 'The Eastern Capital temple was long abolished—repair departs from intent.',
  },
  s0379: {
    literal: 'In the Shengli and Shenlong era Wu restored the bright ruler; Zhongzong took her temple and made it the Grand Temple—originally to secure hearts by expedient, not a lasting institution.',
    idiomatic: 'Why so?',
  },
  s0380: {
    literal: 'The surviving spirit tablets have been requested for entombment; with new temple chambers, tablets are required.',
    idiomatic: 'Under Wu, Zhongzong turned her temple into the Grand Temple to secure hearts—not permanent law.',
  },
  s0381: {
    literal: 'Tablets are not made out of season; temple chambers are not debated empty—if repair awaits tours, only one tablet is carried—fully in the registers, clear on inspection.',
    idiomatic: 'Surviving tablets were to be entombed; new chambers need tablets.',
  },
  s0382: {
    literal: 'Some cited meanings in classics are disciples\' words or others\' speech.',
    idiomatic: 'No out-of-season tablets; no empty chambers—tour repair carries one tablet only, per the registers.',
  },
  s0383: {
    literal: 'Temples cannot be empty, honor has no second supreme, no out-of-season tablets, one tablet on tour—all personally expounded by the great sage ancestor and Confucius; compared with ordinary citations, they cannot be treated alike.',
    idiomatic: 'Some classic citations are disciples\' or others\' words.',
  },
  s0384: {
    literal: 'Qiu Ming edited Spring and Autumn—all praise and blame by the gentleman; for Chen Xie punished for loyalty and Jin Wen summoned his lord, on these the gentleman is not named—Confucius alone judges.',
    idiomatic: 'Empty temples, no second supreme, no out-of-season tablets, one tablet on tour—the sage ancestor and Confucius expounded these; they cannot be equated with ordinary citations.',
  },
  s0385: {
    literal: 'The Commentary: "Doubtful points require sage words to clarify."',
    idiomatic: 'Qiu Ming judged as "the gentleman"; for Chen Xie and Jin Wen he used Confucius alone.',
  },
  s0386: {
    literal: '" Some say the Eastern Capital differs from other capitals in altars, temples, and palaces—expedient repair seems harmless.',
    idiomatic: 'The Commentary: "Doubt requires sage words."',
  },
  s0387: {
    literal: 'That weighs private feeling, not classic warrant.',
    idiomatic: 'Some say altars and palaces differ—expedient repair seems fine.',
  },
  s0388: {
    literal: 'Searching past and present, no proof of establishing temples at altars of soil and grain—using it as argument is unsettling.',
    idiomatic: 'That is inclination, not warrant.',
  },
  s0389: {
    literal: 'From Yin and Zhou down, aside from removal there is no text for separate temples.',
    idiomatic: 'No precedent anywhere for temples at altars of soil and grain.',
  },
  s0390: {
    literal: 'The Zhenguan Ritual: at xia sharing, meritorious ministers share in the temple court; at di they do not.',
    idiomatic: 'From Yin and Zhou, only removal establishes separate temples.',
  },
  s0391: {
    literal: 'The Zhenguan Ritual: at xia sharing, meritorious ministers share in the temple court; at di they do not.',
    idiomatic: 'The Zhenguan Ritual: at xia, meritorious ministers share in the temple court; at di they do not.',
  },
  s0392: {
    literal: 'Then regulations had meritorious ministers share on both xia and di days.',
    idiomatic: 'At that time regulations allowed meritorious ministers to share on both xia and di days.',
  },
  s0393: {
    literal: 'Zhenguan 16, before di sacrifice, offices requested ritualists and scholars to debate; Director Wei Ting and seventeen others argued: "Ancient kings possessing the four seas did not daily present food at the temple—fearing excessive ritual.',
    idiomatic: 'In Zhenguan 16, before the di sacrifice, offices requested debate; Director Wei Ting and seventeen others argued that ancient kings did not daily feed the temple lest ritual become excessive.',
  },
  s0394: {
    literal: 'Hence: Spring and Autumn sacrifice—think of them in season.',
    idiomatic: 'Hence: sacrifice in Spring and Autumn—think of them in season.',
  },
  s0395: {
    literal: 'When a minister has great merit and enjoys emolument, later filial sons observe ritual with pure offerings in abundance—li, si, zheng, and xiang without cease through the four seasons; at the great xia he may also share.',
    idiomatic: 'When a minister has great merit and enjoys emolument, later filial sons keep abundant seasonal rites and may share at the great xia—to display merit and encourage successors.',
  },
  s0396: {
    literal: 'Thus his merit is displayed and virtue honored to encourage successor ministers.',
    idiomatic: 'His merit is thus displayed and his virtue honored to encourage those who follow.',
  },
  s0397: {
    literal: 'At di and seasonal sharing, meritorious ministers should not participate.',
    idiomatic: 'At di and seasonal rites, meritorious ministers should not participate.',
  },
  s0398: {
    literal: 'Thus in Zhou ritual officials of the six merits share only at the great zheng.',
    idiomatic: 'In Zhou ritual, officials of the six merits share only at the great zheng.',
  },
  s0399: {
    literal: 'Former scholars all take great zheng as the xia sacrifice.',
    idiomatic: 'Scholars all take great zheng as the xia sacrifice.',
  },
  s0400: {
    literal: 'Gao Tanglong, Yu Weizhi, and others mostly follow Zheng Xuan\'s school—none took it as seasonal sharing.',
    idiomatic: 'Gao Tanglong and Yu Weizhi follow Zheng Xuan—not as seasonal sharing.',
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
if (data.metadata.chapter !== '030') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 030; standalone T ready (${Object.keys(T).length} entries).`
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
