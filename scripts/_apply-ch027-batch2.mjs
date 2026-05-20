#!/usr/bin/env node
/** Batch 2: s0101–s0159 (Jiutangshu ch.027, Rites 3 / mourning) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/027.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 159;

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
    literal: 'Your servant has heard that rites adorn feeling and mourning garments follow righteous regulation; there may be continuations and changes, and what is to be reduced or increased can be made clear.',
    idiomatic: 'I have heard that ritual adorns emotion and mourning dress follows moral rule—where practice has shifted, what to add or trim can be stated plainly.',
  },
  s0102: {
    literal: 'The matter in its substance is already great; reason requires thorough deliberation.',
    idiomatic: 'The matter is weighty and calls for careful deliberation.',
  },
  s0103: {
    literal: 'We hope it may be entrusted to the Department of State Affairs to assemble the multitude of officials for detailed discussion, striving for compromise, and made a perpetual standard.',
    idiomatic: 'Please refer it to the Department of State Affairs for a full council of officials, seek a balanced outcome, and fix it as a lasting rule.',
  },
  s0104: {
    literal: 'The passage concluded."',
    idiomatic: 'The quote ended.',
  },
  s0105: {
    literal: 'Thereupon the Mentor of the Heir Apparent Cui Mian submitted a recommendation, saying: "Your servant has heard that when the Great Way was concealed, all under Heaven became one\'s household.',
    idiomatic: 'Then Mentor of the Heir Apparent Cui Mian memorialized: "I have heard that once the Great Way was hidden, the realm became a single household.',
  },
  s0106: {
    literal: 'The sages followed this and thereafter fashioned rites.',
    idiomatic: 'The sages took that as their basis and then fashioned ritual.',
  },
  s0107: {
    literal: 'The establishment of ritual teaching was fundamentally to rectify the family; when the family way is rectified, all under Heaven is settled.',
    idiomatic: 'Ritual teaching was instituted chiefly to set the household in order; when the household is right, the realm is stable.',
  },
  s0108: {
    literal: 'The way to rectify the family cannot be twofold; to gather and fix one deliberation, reason returns to the root lineage.',
    idiomatic: 'The way to order a household cannot be divided in two: one settled rule, with principle anchored in the main line.',
  },
  s0109: {
    literal: 'The father is honored and elevated; the mother is suppressed and demoted—how could one forget love and respect? One should preserve the order of human relations.',
    idiomatic: 'The father is exalted and the mother reduced in rank—not to forget love and respect, but to keep relational order.',
  },
  s0110: {
    literal: 'Therefore within there is zhan and cui; for external relations all wear si hemp; where honored names are added, it does not exceed one grade—this is the unchanging way of the former kings.',
    idiomatic: 'Hence within the family are the heaviest grades of mourning; for outside kin all wear the lightest hemp; added honor never exceeds one step—this is the former kings\' unchanging rule.',
  },
  s0111: {
    literal: 'What former sages recorded, later worthies transmitted—their coming has long been so.',
    idiomatic: 'What the ancient sages set down and later worthies handed on has stood for ages.',
  },
  s0112: {
    literal: 'In antiquity Xin You went to Yichuan and saw one with disheveled hair sacrificing in the wild, saying: \'Within less than a hundred years, will this be the Rong?',
    idiomatic: 'Long ago Xin You went to Yichuan and saw people with loose hair sacrificing in the open country, and said, \'In less than a hundred years, will this be the Rong?',
  },
  s0113: {
    literal: 'Their rites will perish first!\'',
    idiomatic: 'Their ritual will die first!\'',
  },
  s0114: {
    literal: 'In Zhenguan\'s revision of rites the times altered the old statutes, gradually widening the affection of the Wei-yang ode and not following the canons of Zhu and Si.',
    idiomatic: 'When Zhenguan revised ritual, old statutes were altered, maternal kin were favored ever more widely, and the standards of Confucius\'s homeland were left aside.',
  },
  s0115: {
    literal: 'Reaching after Hongdao and in the Tanglong era, the nation\'s mandate twice shifted to alien clans.',
    idiomatic: 'After Hongdao and in the Tanglong years, the dynastic mandate twice passed to outsiders.',
  },
  s0116: {
    literal: 'The perishing of rites had its omens—perhaps this is seen; at the juncture of Heaven and man, can one not be warned!',
    idiomatic: 'The death of ritual had its omens—perhaps we see them here; at the meeting of Heaven and humanity, ought we not take warning!',
  },
  s0117: {
    literal: 'At the beginning of Kaiyuan, Remonstrance Councillor Lu Lübing once submitted a memorial discussing the light and heavy grades of mourning garments; an edict ordered collective deliberation.',
    idiomatic: 'Early in Kaiyuan, Remonstrance Councillor Lu Lübing had memorialized on the grades of mourning dress, and an edict ordered joint deliberation.',
  },
  s0118: {
    literal: 'At that time the multitude of discussions were tangled; each clung to accumulated custom; the Court of Imperial Sacrifices and the Ministry of Rites memorialized to follow the old fixings.',
    idiomatic: 'Debate then was tangled, each side clinging to habit; the Court of Imperial Sacrifices and the Ministry of Rites urged keeping the old rules.',
  },
  s0119: {
    literal: 'Your Majesty, exercising reflection on antiquity and issuing independent, clarifying judgments, by the eighth year of Kaiyuan specially promulgated a separate edict, wholly following the ancient rites.',
    idiomatic: 'Your Majesty, drawing on antiquity and acting with decisive clarity, in Kaiyuan 8 issued a special edict restoring the ancient mourning rules in full.',
  },
  s0120: {
    literal: 'The matter accords with former facts; people know the direction; it firmly secures the clan bond—the fortune of the altars of soil and grain.',
    idiomatic: 'That matched ancient precedent, gave the people a clear standard, and strengthened the clan bond—a blessing to the state.',
  },
  s0121: {
    literal: 'To plot further divergent discussion—your servant has not yet understood.',
    idiomatic: 'To reopen dispute on this point is, in my view, hard to understand.',
  },
  s0122: {
    literal: 'We hope to preserve the clear directive of the eighth year as the enduring law for ten thousand generations.',
    idiomatic: 'I ask that the clear mandate of Kaiyuan 8 be kept as the permanent law for ages to come.',
  },
  s0123: {
    literal: '"',
    idiomatic: 'The quote ended.',
  },
  s0124: {
    literal: 'Director of Staff Registration Wei Shu submitted an opinion, saying:',
    idiomatic: 'Director of Staff Registration Wei Shu offered this view:',
  },
  s0125: {
    literal: 'Vice Director in the Ministry of Rites Yang Zhongchang submitted an opinion, saying: "Your servant respectfully examines the Ceremonies, which says: \'External mourning garments are all si hemp.',
    idiomatic: 'Vice Director of Rites Yang Zhongchang wrote: "I have reviewed the Ceremonies, which states, \'All mourning for external kin is si hemp.',
  },
  s0126: {
    literal: '\' It also says: \'Maternal grandparents, by addition of honor, and mother\'s sisters, by addition of name, are both xiao gong for five months.',
    idiomatic: '\' It also says, \'Maternal grandparents, by honor added, and mother\'s sisters, by name added, both wear xiao gong for five months.',
  },
  s0127: {
    literal: '\' For the mother\'s brother, si hemp—Duke of Zheng Wen, Wei Zheng, already deliberated to follow the mother\'s-sister precedent, increasing to xiao gong for five months, and that is settled.',
    idiomatic: '\' For the maternal uncle, si hemp—Wei Zheng, Duke of Zhengwen, had already argued he should match the mother\'s sister at xiao gong for five months, and that was settled.',
  },
  s0128: {
    literal: 'What is now to be added—how does it differ from the former intent?',
    idiomatic: 'What is now proposed to be added—how does it differ from that earlier ruling?',
  },
  s0129: {
    literal: 'Though Wen was worthy, yet Zhou and Confucius were sages; to use the worthy to alter the sage—what are later students to follow?',
    idiomatic: 'Wei Zheng was worthy, but Zhou and Confucius were sages; to let worthies revise sages—what should later students follow?',
  },
  s0130: {
    literal: 'Hall mother\'s brothers and sisters and hall mother\'s brothers\' wives, all raised to tan mian—then how may one trace and transmit the ritual classics?',
    idiomatic: 'Cousins on the mother\'s side and their wives, all raised to tan mian—how then can we claim to follow the ritual canon?',
  },
  s0131: {
    literal: 'If for maternal grandparents one increases to da gong, then would there not also be added return mourning for maternal grandsons?',
    idiomatic: 'If maternal grandparents are raised to da gong, must not maternal grandsons also return the heavier mourning?',
  },
  s0132: {
    literal: 'If maternal grandsons in return wore da gong, then the common grandsons of the root lineage—why are they equal in rank yet shallower in mourning?',
    idiomatic: 'If maternal grandsons wore da gong in return, how could patrilineal grandsons of the same degree wear less?',
  },
  s0133: {
    literal: 'If it must be so, this is deeply inconvenient.',
    idiomatic: 'If it must be so, the inconvenience is grave.',
  },
  s0134: {
    literal: 'Your servant fears inner and outer will lose their order, near and distant will usurp rank, and where feeling leads—what will not follow? Reason demands it.',
    idiomatic: 'I fear inner and outer kin will fall out of order and near and far will invert rank—where feeling leads, what limit will hold? That is inevitable.',
  },
  s0135: {
    literal: 'In antiquity Zilu had mourning for a sister yet did not remove the garments; Confucius questioned him, and Zilu replied: \'I have few brothers and sisters and cannot bear it.',
    idiomatic: 'Long ago Zilu mourned a sister but would not leave off the garments; Confucius asked him, and Zilu said, \'I have few siblings and cannot bear to do so.',
  },
  s0136: {
    literal: '\' The Master said: \'When the former kings fashioned rites, even travelers on the road could not bear it.',
    idiomatic: '\' The Master said, \'When the former kings made ritual, even passers-by felt the same reluctance.',
  },
  s0137: {
    literal: '\' Zilu heard this and removed the garments.',
    idiomatic: '\' Zilu heard and removed the mourning.',
  },
  s0138: {
    literal: 'This is the sage using words to establish instruction—an illuminating example of citing a case to restrain feeling.',
    idiomatic: 'Here the sage turned a remark into teaching—an explicit case of using precedent to curb excess of feeling.',
  },
  s0139: {
    literal: 'Does ritual not say: do not lightly discuss ritual?',
    idiomatic: 'Does ritual not say, Do not lightly debate ritual?',
  },
  s0140: {
    literal: 'Brightness coiled with Heaven and Earth, equal to sun and moon—the worthy follow it; how dare one make small additions or subtractions!',
    idiomatic: 'It coils with Heaven and Earth and stands with sun and moon—the worthy follow it; who would dare trim it even slightly!',
  },
  s0141: {
    literal: 'How much more the records of Mourning Garments—the great design of the former kings, upheld in practice to rectify the human way.',
    idiomatic: 'Above all the Mourning Garments—the former kings\' great design, carried in practice to set the human way right.',
  },
  s0142: {
    literal: 'One word is better left unchanged; for a thousand years it is followed; to touch heterodox paths—how may one call that broadening teaching?',
    idiomatic: 'A single phrase is not lightly altered; a thousand years follow it; to wander into side paths is not to enlarge teaching.',
  },
  s0143: {
    literal: 'We prostrate ourselves and hope each will follow the correct rites to thicken Confucian custom.',
    idiomatic: 'I beg that all adhere to the orthodox rites and strengthen Confucian practice.',
  },
  s0144: {
    literal: 'What the Court of Imperial Sacrifices calls increase—in this foolish view cannot be approved.',
    idiomatic: 'The increases urged by the Court of Imperial Sacrifices seem to me inadmissible.',
  },
  s0145: {
    literal: '" Also Bureau Director in the Ministry of Revenue Yang Bocheng and Left Gate Recorder Liu Zhi all submitted the same opinion, broadly matching Mian and the others.',
    idiomatic: 'The quote ended. Bureau Director Yang Bocheng in the Ministry of Revenue and Left Gate Recorder Liu Zhi also wrote in the same vein, broadly agreeing with Cui Mian and his allies.',
  },
  s0146: {
    literal: 'When the deliberations were memorialized, the emperor again personally edicted the attendant ministers, saying: "',
    idiomatic: 'When the opinions were submitted, the emperor again personally instructed the chief ministers:',
  },
  s0147: {
    literal: 'Attendant-in-chief Pei Yaoqing, Grand Counselor Zhang Jiuling, Minister of Rites Li Linfu, and others memorialized, saying: "Kin of the external clan—in ritual there is no suppressed demotion.',
    idiomatic: 'Chief Attendant Pei Yaoqing, Grand Counselor Zhang Jiuling, Minister of Rites Li Linfu, and others wrote: "External kin are not subject to ritual demotion.',
  },
  s0148: {
    literal: 'The sister\'s son already wears mourning for the mother\'s brother\'s wife; the mother\'s brother\'s wife in turn ought to return it.',
    idiomatic: 'A nephew already mourns his aunt by marriage; she in turn should return the obligation.',
  },
  s0149: {
    literal: 'Since the sister\'s son already wears return mourning, then with the husband\'s mother\'s brothers and sisters it is the same by category; the sister\'s son\'s wife cannot be without mourning.',
    idiomatic: 'If a nephew wears return mourning, the same logic covers the husband\'s aunts and uncles; a nephew\'s wife cannot go without dress.',
  },
  s0150: {
    literal: 'What is added is rather broad; what is cited grows ever more distant.',
    idiomatic: 'What is added grows wide; what is cited grows remote.',
  },
  s0151: {
    literal: 'This petty official, foolish and ignorant, still has what is not yet understood.',
    idiomatic: 'We, dull and ignorant, still do not fully grasp it.',
  },
  s0152: {
    literal: '" Emperor Xuanzong again personally composed a reply, saying: "" Yaoqing and others memorialized, saying: "Your Majesty embodies utmost benevolent virtue and broadly extends the way of grace, intending to enlarge kinship and display cordial kin relations, again issuing virtuous words and further ordering detailed deliberation.',
    idiomatic: 'The quote ended. Xuanzong also drafted a personal reply. Yaoqing and others then wrote: "Your Majesty embodies utmost benevolence and extends grace broadly, seeking to widen kinship and show familial warmth, and has again ordered further deliberation.',
  },
  s0153: {
    literal: 'Your servants examine the New Tang Rites: the mother\'s brother increased to xiao gong, the same mourning as the mother\'s sister.',
    idiomatic: 'We have reviewed the New Tang Rites: a mother\'s brother was raised to xiao gong, matching the mother\'s sister.',
  },
  s0154: {
    literal: 'This was at that time a special command, not increasing grade by grade, broadly not wishing to mix with the root lineage—caution in altering ritual.',
    idiomatic: 'That was a special order of the time, not a ladder of ever-heavier grades—chiefly to keep external kin from merging with the main line, a cautious change of ritual.',
  },
  s0155: {
    literal: 'Now the sage regulation makes mother\'s brothers and sisters xiao gong, further regulating the mother\'s brother\'s wife as si hemp, hall mother\'s brothers and sisters as tan mian, and the like—taking categories from the New Rites, displaying them for the future, penetrating common feeling, making the rule oneself.',
    idiomatic: 'Now Your Majesty sets mother\'s brothers and sisters at xiao gong, an aunt by marriage at si hemp, and cousins on the mother\'s side at tan mian—following the New Rites as a type, showing the future a rule that fits human feeling and is made here and now.',
  },
  s0156: {
    literal: 'The multitude of Confucians in discussion merely had delay.',
    idiomatic: 'The Confucian debaters had only delayed.',
  },
  s0157: {
    literal: 'All hope to approve the regulation and put it into practice.',
    idiomatic: 'All ask that the regulation be approved and enforced.',
  },
  s0158: {
    literal: '" The regulation was approved.',
    idiomatic: 'The quote ended. The regulation was approved.',
  },
  s0159: {
    literal: 'In the first month, a mother who has married out her son should complete the three-year mourning.',
    idiomatic: 'First month: a married-out mother should observe the full three-year mourning.',
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
if (data.metadata.chapter !== '027') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 027; standalone T ready (${Object.keys(T).length} entries).`
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
