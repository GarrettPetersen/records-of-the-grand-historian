#!/usr/bin/env node
/** Batch 5: s0401–s0447 (Jiutangshu ch.031, Rites 7 / mourning) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/031.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 447;

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
  s0401: {
    literal: 'Hall mother\'s brothers and sisters and hall mother\'s brothers\' wives, all raised to tan mian—then how may one trace and transmit the ritual classics?',
    idiomatic: 'Cousins on the mother\'s side and their wives, all raised to tan mian—how then can we claim to follow the ritual canon?',
  },
  s0402: {
    literal: 'If for maternal grandparents one increases to da gong, then would there not also be added return mourning for maternal grandsons?',
    idiomatic: 'If maternal grandparents are raised to da gong, must not maternal grandsons also return the heavier mourning?',
  },
  s0403: {
    literal: 'If maternal grandsons in return wore da gong, then the common grandsons of the root lineage—why are they equal in rank yet shallower in mourning?',
    idiomatic: 'If maternal grandsons wore da gong in return, how could patrilineal grandsons of the same degree wear less?',
  },
  s0404: {
    literal: 'If it must be so, this is deeply inconvenient.',
    idiomatic: 'If it must be so, the inconvenience is grave.',
  },
  s0405: {
    literal: 'Your servant fears inner and outer will lose their order, near and distant will usurp rank, and where feeling leads—what will not follow? Reason demands it.',
    idiomatic: 'I fear inner and outer kin will fall out of order and near and far will invert rank—where feeling leads, what limit will hold? That is inevitable.',
  },
  s0406: {
    literal: 'In antiquity Zilu had mourning for a sister yet did not remove the garments; Confucius questioned him, and Zilu replied: \'I have few brothers and sisters and cannot bear it.',
    idiomatic: 'Long ago Zilu mourned a sister but would not leave off the garments; Confucius asked him, and Zilu said, \'I have few siblings and cannot bear to do so.',
  },
  s0407: {
    literal: '\' The Master said: \'When the former kings fashioned rites, even travelers on the road could not bear it.',
    idiomatic: '\' The Master said, \'When the former kings made ritual, even passers-by felt the same reluctance.',
  },
  s0408: {
    literal: '\' Zilu heard this and removed the garments.',
    idiomatic: '\' Zilu heard and removed the mourning.',
  },
  s0409: {
    literal: 'This is the sage using words to establish instruction—an illuminating example of citing a case to restrain feeling.',
    idiomatic: 'Here the sage turned a remark into teaching—an explicit case of using precedent to curb excess of feeling.',
  },
  s0410: {
    literal: 'Does ritual not say: do not lightly discuss ritual?',
    idiomatic: 'Does ritual not say, Do not lightly debate ritual?',
  },
  s0411: {
    literal: 'Brightness coiled with Heaven and Earth, equal to sun and moon—the worthy follow it; how dare one make small additions or subtractions!',
    idiomatic: 'It coils with Heaven and Earth and stands with sun and moon—the worthy follow it; who would dare trim it even slightly!',
  },
  s0412: {
    literal: 'How much more the records of Mourning Garments—the great design of the former kings, upheld in practice to rectify the human way.',
    idiomatic: 'Above all the Mourning Garments—the former kings\' great design, carried in practice to set the human way right.',
  },
  s0413: {
    literal: 'One word is better left unchanged; for a thousand years it is followed; to touch heterodox paths—how may one call that broadening teaching?',
    idiomatic: 'A single phrase is not lightly altered; a thousand years follow it; to wander into side paths is not to enlarge teaching.',
  },
  s0414: {
    literal: 'We prostrate ourselves and hope each will follow the correct rites to thicken Confucian custom.',
    idiomatic: 'I beg that all adhere to the orthodox rites and strengthen Confucian practice.',
  },
  s0415: {
    literal: 'What the Court of Imperial Sacrifices calls increase—in this foolish view cannot be approved.',
    idiomatic: 'The increases urged by the Court of Imperial Sacrifices seem to me inadmissible.',
  },
  s0416: {
    literal: '" Also Bureau Director in the Ministry of Revenue Yang Bocheng and Left Gate Recorder Liu Zhi all submitted the same opinion, broadly matching Mian and the others.',
    idiomatic: '" The quote ended. Bureau Director Yang Bocheng in the Ministry of Revenue and Left Gate Recorder Liu Zhi also wrote in the same vein, broadly agreeing with Cui Mian and his allies.',
  },
  s0417: {
    literal: 'When the deliberations were memorialized, the emperor again personally edicted the attendant ministers, saying: "Your Majesty holds that for mother\'s brothers and sisters by blood who already wear xiao gong, the mother\'s brother\'s wife wears three years\' mourning for the mother\'s brother; the mourning is receiving me and is thick—by regulating feeling through mourning garments, the mother\'s brother\'s wife\'s mourning cannot be wholly reduced below the mother\'s brother\'s; she should wear si hemp.',
    idiomatic: 'When the opinions were submitted, the emperor again personally instructed the chief ministers: "I hold that mother\'s brothers and sisters by blood already wear xiao gong; an aunt by marriage wears three years\' mourning for her husband, the uncle—mourning received from me and therefore weighty. By regulating feeling through dress, her mourning cannot be reduced entirely below his; she should wear si hemp.',
  },
  s0418: {
    literal: 'Hall mother\'s brothers and sisters have had no regulated mourning in antiquity and modernity; We contemplate cordial kinship of the nine clans, drawing them near in affection—they should wear tan mian.',
    idiomatic: 'Cousins on the mother\'s side have never had fixed mourning in antiquity or our day; I wish to cherish the nine clans and draw them nearer—they should wear tan mian.',
  },
  s0419: {
    literal: 'Also Zheng Xuan\'s commentary on the Book of Rites says \'same hearth si hemp\'; if hall mother\'s brothers and sisters are compared to same hearth, the kinship would be thicker.',
    idiomatic: 'Zheng Xuan\'s commentary on the Book of Rites also says \'same hearth, si hemp\'; if cousins on the mother\'s side were classed with same-hearth kin, the bond would be thicker still.',
  },
  s0420: {
    literal: 'Also the Mourning Garments Commentary says \'mourning for external kin is all si hemp\'—this also does not exclude hall mother\'s brothers and sisters.',
    idiomatic: 'The Mourning Garments Commentary also says, \'All mourning for external kin is si hemp\'—that does not exclude cousins on the mother\'s side either.',
  },
  s0421: {
    literal: 'If because the mourning worn cannot exceed the root lineage, one must still wear mourning for external great-grandparents and external uncles and aunts among grandparents—is there any harm?',
    idiomatic: 'If the rule is that mourning worn may not exceed that of the root lineage, what harm is there in still mourning external great-grandparents and external uncles and aunts of the grandparent generation?',
  },
  s0422: {
    literal: 'These are all the intent of treating kin as kin and thickening the root; you ministers should deliberate further in detail."',
    idiomatic: 'All of this serves kinship and thickening the root line; you ministers should deliberate further in detail."',
  },
  s0423: {
    literal: 'Attendant-in-chief Pei Yaoqing, Grand Counselor Zhang Jiuling, Minister of Rites Li Linfu, and others memorialized, saying: "Kin of the external clan—in ritual there is no suppressed demotion.',
    idiomatic: 'Chief Attendant Pei Yaoqing, Grand Counselor Zhang Jiuling, Minister of Rites Li Linfu, and others wrote: "External kin are not subject to ritual demotion.',
  },
  s0424: {
    literal: 'The sister\'s son already wears mourning for the mother\'s brother\'s wife; the mother\'s brother\'s wife in turn ought to return it.',
    idiomatic: 'A nephew already mourns his aunt by marriage; she in turn should return the obligation.',
  },
  s0425: {
    literal: 'Since the sister\'s son already wears return mourning, then with the husband\'s mother\'s brothers and sisters it is the same by category; the sister\'s son\'s wife cannot be without mourning.',
    idiomatic: 'If a nephew wears return mourning, the same logic covers the husband\'s aunts and uncles; a nephew\'s wife cannot go without dress.',
  },
  s0426: {
    literal: 'What is added is rather broad; what is cited grows ever more distant.',
    idiomatic: 'What is added grows wide; what is cited grows remote.',
  },
  s0427: {
    literal: 'This petty official, foolish and ignorant, still has what is not yet understood.',
    idiomatic: 'We, dull and ignorant, still do not fully grasp it.',
  },
  s0428: {
    literal: '" Emperor Xuanzong again personally composed a reply, saying: "Followed mourning has six kinds; this is one of them.',
    idiomatic: '" The quote ended. Xuanzong again drafted a personal reply: "Followed mourning has six kinds; this is one of them.',
  },
  s0429: {
    literal: 'The regulations for reduction and killing off—in ritual there is no explicit text.',
    idiomatic: 'Rules for reducing and stepping down grades have no explicit text in ritual.',
  },
  s0430: {
    literal: 'These all take the self as leading kin and use it to fashion mourning garments.',
    idiomatic: 'These all take one\'s own person as leading kin and use that to set mourning dress.',
  },
  s0431: {
    literal: 'All preservation and suppression are wholly extending grace.',
    idiomatic: 'Every retention or reduction is wholly a matter of extending grace.',
  },
  s0432: {
    literal: 'We have what is not yet at ease in feeling, therefore ordered detailed deliberation—not wishing casually to seek to alter antiquity to show being different.',
    idiomatic: 'I am not yet at ease in my own feeling, hence I ordered further deliberation—not to seek casually to alter antiquity and show myself different.',
  },
  s0433: {
    literal: 'You ministers hold that \'kin of the external clan—in ritual there is no suppressed demotion; return mourning\'s regulation—what is cited is very remote.\'',
    idiomatic: 'You hold that \'external kin are not subject to ritual demotion\' and that \'return mourning, as you cite it, draws on very remote kin.\'',
  },
  s0434: {
    literal: 'Moreover mother\'s brothers and sisters are kin of the collateral at the utmost nearness; speaking by closeness, they are also the match of father\'s sisters and father\'s brothers.',
    idiomatic: 'Moreover aunts and uncles are collateral kin of the utmost nearness; by closeness they match father\'s sisters and father\'s brothers.',
  },
  s0435: {
    literal: 'How can what is cited be remote, yet the mourning for those who are kin be reduced?',
    idiomatic: 'How can what you cite be remote while the mourning worn for those who are close be reduced?',
  },
  s0436: {
    literal: 'Moreover the wife follows the husband.',
    idiomatic: 'Moreover a wife follows her husband.',
  },
  s0437: {
    literal: 'The husband\'s mother\'s brothers and sisters—the husband already has mourning; following the husband in mourning—thereby cordial kinship.',
    idiomatic: 'For the husband\'s aunts and uncles, the husband already has mourning; following the husband in mourning is how kinship is kept warm.',
  },
  s0438: {
    literal: 'Truly wishing to make the unworthy aspire and the worthy bend down to approach.',
    idiomatic: 'The aim is truly to let the unworthy aspire and the worthy bend down to approach.',
  },
  s0439: {
    literal: 'You ministers should deliberate in detail.',
    idiomatic: 'You ministers should deliberate further in detail.',
  },
  s0440: {
    literal: '" Yaoqing and others memorialized, saying: "Your Majesty embodies utmost benevolent virtue and broadly extends the way of grace, intending to enlarge kinship and display cordial kin relations, again issuing virtuous words and further ordering detailed deliberation.',
    idiomatic: '" The quote ended. Yaoqing and others wrote: "Your Majesty embodies utmost benevolence and extends grace broadly, seeking to widen kinship and show familial warmth, and has again ordered further deliberation.',
  },
  s0441: {
    literal: 'Your servants examine the New Tang Rites: the mother\'s brother increased to xiao gong, the same mourning as the mother\'s sister.',
    idiomatic: 'We have reviewed the New Tang Rites: a mother\'s brother was raised to xiao gong, matching the mother\'s sister.',
  },
  s0442: {
    literal: 'This was at that time a special command, not increasing grade by grade, broadly not wishing to mix with the root lineage—caution in altering ritual.',
    idiomatic: 'That was a special order of the time, not a ladder of ever-heavier grades—chiefly to keep external kin from merging with the main line, a cautious change of ritual.',
  },
  s0443: {
    literal: 'Now the sage regulation makes mother\'s brothers and sisters xiao gong, further regulating the mother\'s brother\'s wife as si hemp, hall mother\'s brothers and sisters as tan mian, and the like—taking categories from the New Rites, displaying them for the future, penetrating common feeling, making the rule oneself.',
    idiomatic: 'Now Your Majesty sets mother\'s brothers and sisters at xiao gong, an aunt by marriage at si hemp, and cousins on the mother\'s side at tan mian—following the New Rites as a type, showing the future a rule that fits human feeling and is made here and now.',
  },
  s0444: {
    literal: 'The multitude of Confucians in discussion merely had delay.',
    idiomatic: 'The Confucian debaters had only delayed.',
  },
  s0445: {
    literal: 'All hope to approve the regulation and put it into practice.',
    idiomatic: 'All ask that the regulation be approved and enforced.',
  },
  s0446: {
    literal: '" The regulation was approved.',
    idiomatic: '" The quote ended. The regulation was approved.',
  },
  s0447: {
    literal: 'In the first month of the sixth year of Tianbao, a mother who has married out her son should complete the three-year mourning.',
    idiomatic: 'First month, Tianbao 6: a married-out mother should observe the full three-year mourning.',
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
if (data.metadata.chapter !== '031') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 031; standalone T ready (${Object.keys(T).length} entries).`
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
