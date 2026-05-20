#!/usr/bin/env node
/** Batch 8: s0701–s0738 (Jiutangshu ch.021, ritual/music treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/021.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 701;
const END = 738;

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
    literal: 'That year, the twenty-seventh day of the tenth month, an edict: "Deliberation on suburban rites rests upon utmost sincerity."',
    idiomatic: 'That year, tenth month, twenty-seventh day, an edict: "Deliberation on suburban rites rests upon utmost sincerity."',
  },
  s0702: {
    literal: '"Fixing ritual and fixing names should accord with the facts of the affair, so that name and fact match—then honor and baseness have order."',
    idiomatic: '"Fixing ritual and names should accord with facts, so name and fact match—then honor and baseness have order."',
  },
  s0703: {
    literal: '"The Five Directions\' paired Thearchs are sage kings of high antiquity; their Way succored the teeming people, their ritual is set forth in bright sacrifice."',
    idiomatic: '"The Five Directions\' paired Thearchs are sage kings of high antiquity whose Way succored the people—bright sacrifice records their ritual."',
  },
  s0704: {
    literal: '"Weighing goodness and reckoning merit, then my virtue is not of that sort; holding Heaven and standing at the pole, my position is the same."',
    idiomatic: '"Weighing goodness and merit, my virtue is not of that sort; holding Heaven and standing at the pole, my position is the same."',
  },
  s0705: {
    literal: '"Yet in the prayer text to call myself subject in sacrifice benefits sincerity not at all—it only profanes rank and majesty."',
    idiomatic: '"Yet calling myself subject in the prayer text benefits sincerity not at all—it only profanes rank and majesty."',
  },
  s0706: {
    literal: '"Formerly Senior Recorder of the Capital Gao Pei memorialized with a request; his reasoning was refined and detailed."',
    idiomatic: '"Formerly Capital Senior Recorder Gao Pei memorialized; his reasoning was refined and detailed."',
  },
  s0707: {
    literal: '"I weighed altering the old rites and consulted you ministers; the great meaning was clarified—therefore I am released."',
    idiomatic: '"I weighed altering the old rites and consulted you ministers; the great meaning clarified—I am released."',
  },
  s0708: {
    literal: '"It is fitting to follow the correction and thereby thicken the utmost rite."',
    idiomatic: '"Follow the correction and thereby thicken the utmost rite."',
  },
  s0709: {
    literal: '"From now on, in prayer texts for sacrifice to the Five Directions\' paired Thearchs, none need call themselves subject."',
    idiomatic: '"Hereafter, prayer texts for the Five Directions\' paired Thearchs need not call oneself subject."',
  },
  s0710: {
    literal: '"The remaining ritual details are as before."',
    idiomatic: '"Remaining ritual details are as before."',
  },
  s0711: {
    literal: 'The edict concluded."',
    idiomatic: 'The edict closed.',
  },
  s0712: {
    literal: 'On the eighth day of the eleventh month of the sixth year, there was an affair at the southern suburb.',
    idiomatic: 'Sixth year, eleventh month, eighth day: an affair at the southern suburb.',
  },
  s0713: {
    literal: 'An edict made the crown prince the secondary offerer and imperial princes the final offerers.',
    idiomatic: 'An edict made the crown prince secondary offerer and imperial princes final offerers.',
  },
  s0714: {
    literal: 'The emperor asked the ritual officials: "Should secondary and final offerers receive the oath and admonition?"',
    idiomatic: 'The emperor asked ritual officials: "Should secondary and final offerers receive the oath and admonition?"',
  },
  s0715: {
    literal: '" The Director of the Ministry of Civil Office Liu Mian said: "According to the Kaiyuan Rites, offering officials seven days before receive the oath and admonition within the palace."',
    idiomatic: '" Ministry of Civil Office Director Liu Mian said: "Per the Kaiyuan Rites, offering officials receive oath and admonition in the palace seven days before."',
  },
  s0716: {
    literal: 'The text says: "Each display his office; whoever does not supply his task—the state has constant punishment."',
    idiomatic: 'The oath reads: "Each display his office; whoever fails his task—the state has fixed punishment."',
  },
  s0717: {
    literal: '"Now with the crown prince as secondary offerer, I ask to alter the old text to say: \'Each display his office; reverently uphold the constant rites.\'"',
    idiomatic: '"With the crown prince as secondary offerer, I ask to alter the old text: \'Each display his office; reverently uphold the constant rites.\'"',
  },
  s0718: {
    literal: '" It was approved.',
    idiomatic: '" Approved.',
  },
  s0719: {
    literal: 'In the fourth month of the fifteenth year, the adept Kuang Pengzu memorialized: "Great Tang\'s earth virtue—after a thousand years the tallies match; I ask that each season\'s month suburban-sacrifice Heaven and Earth."',
    idiomatic: 'Fifteenth year, fourth month: adept Kuang Pengzu memorialized: "Great Tang\'s earth virtue—a thousand-year tally matches; suburban-sacrifice Heaven and Earth each season\'s month."',
  },
  s0720: {
    literal: '" An edict ordered ritual officials and Confucian scholars to deliberate.',
    idiomatic: '" An edict ordered ritual officials and scholars to deliberate.',
  },
  s0721: {
    literal: 'Gui Chongjing said: "According to ritual, at the establishment of spring welcome spring at the eastern suburb and sacrifice to the Green Thearch."',
    idiomatic: 'Gui Chongjing said: "Per ritual, at spring\'s establishment welcome spring at the eastern suburb and sacrifice to the Green Thearch."',
  },
  s0722: {
    literal: '"At the establishment of summer welcome summer at the southern suburb and sacrifice to the Red Thearch."',
    idiomatic: '"At summer\'s establishment welcome summer at the southern suburb and sacrifice to the Red Thearch."',
  },
  s0723: {
    literal: '"Eighteen days after the establishment of autumn welcome the Yellow Spirit at the central ground and sacrifice to the Yellow Thearch."',
    idiomatic: '"Eighteen days after autumn\'s establishment welcome the Yellow Spirit at the central ground and sacrifice to the Yellow Thearch."',
  },
  s0724: {
    literal: '"Autumn and winter each at its direction."',
    idiomatic: '"Autumn and winter, each at its proper quarter."',
  },
  s0725: {
    literal: '"The Yellow Thearch in the Five Phases is earth; earth\'s king is in the four seasons; earth is born from fire and acts through wood—yet sacrifice is in autumn; three seasons are not so."',
    idiomatic: '"The Yellow Thearch is earth among the Five Phases; earth\'s king is the four seasons; earth is born from fire and acts through wood—yet sacrifice falls in autumn; three seasons are not so."',
  },
  s0726: {
    literal: '"Han, Wei, Zhou, and Sui all practiced this rite."',
    idiomatic: '"Han, Wei, Zhou, and Sui all kept this rite."',
  },
  s0727: {
    literal: '"Our state, riding earth virtue\'s season, also each year on the earth-king day of the sixth month sacrifices to the Yellow Thearch at the southern suburb with Queen Earth paired—accordant with the canon."',
    idiomatic: '"Our state, riding earth virtue, also each sixth month on the earth-king day sacrifices to the Yellow Thearch at the southern suburb with Queen Earth paired—accordant with canon."',
  },
  s0728: {
    literal: '"Pengzu relies on apocryphal prognostication and yin-yang books—the affair is uncanonical; I fear it will be hard to put into practice."',
    idiomatic: '"Pengzu relies on apocrypha and yin-yang books—uncanonical; I fear it will be hard to practice."',
  },
  s0729: {
    literal: '" Thereupon it was shelved.',
    idiomatic: '" Shelved.',
  },
  s0730: {
    literal: 'In the twelfth month of the fifteenth year of Yuanhe, they were about to have an affair at the southern suburb.',
    idiomatic: 'Yuanhe year 15, twelfth month: they were about to sacrifice at the southern suburb.',
  },
  s0731: {
    literal: 'Muzong asked the ritual officials: "Has the southern suburb day been divined?"',
    idiomatic: 'Muzong asked ritual officials: "Has the southern suburb day been divined?"',
  },
  s0732: {
    literal: '" The Rites Office memorialized: "I consider that per ritual statutes, all temple sacrifices are divined."',
    idiomatic: '" The Rites Office memorialized: "Per ritual statutes, all temple sacrifices are divined."',
  },
  s0733: {
    literal: '"From after Tianbao, whenever they wished suburban sacrifice, they first attended the Grand Pure Palace, the next day feasted at the Grand Temple, and the day after sacrificed at the southern suburb."',
    idiomatic: '"From after Tianbao, before suburban sacrifice they first attended the Grand Pure Palace, next day feasted at the Grand Temple, day after sacrificed at the southern suburb."',
  },
  s0734: {
    literal: '"This has continued to the present—days are not divined."',
    idiomatic: '"This continues to the present—days are not divined."',
  },
  s0735: {
    literal: '" It was approved.',
    idiomatic: '" Approved.',
  },
  s0736: {
    literal: 'By the first month of the following year, when the southern suburb rite was complete, the relevant offices did not set the imperial couch; the emperor stood to receive the hundred officials\' congratulations.',
    idiomatic: 'First month of the following year, southern suburb complete: relevant offices set no imperial couch; the emperor stood to receive officials\' congratulations.',
  },
  s0737: {
    literal: 'When the imperial tower guard withdrew, the hundred officials again did not congratulate before the tower but received congratulations at Xingqing Palace.',
    idiomatic: 'When the tower guard withdrew, officials again did not congratulate before the tower but at Xingqing Palace.',
  },
  s0738: {
    literal: 'Both were lapses of ritual—the fault of the relevant offices.',
    idiomatic: 'Both were breaches of ritual—and the fault lay with the officers charged.',
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
if (data.metadata.chapter !== '021') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 021; standalone T ready (${Object.keys(T).length} entries).`
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
