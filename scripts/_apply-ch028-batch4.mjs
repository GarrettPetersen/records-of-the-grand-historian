#!/usr/bin/env node
/** Batch 4: s0301–s0317 (Jiutangshu ch.028, Rites 4 / music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/028.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 317;

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
    literal: 'Moreover metal, stone, silk, and bamboo are the instruments of music.',
    idiomatic: 'Metal, stone, silk, and bamboo are the instruments of music.',
  },
  s0302: {
    literal: 'Recently, when personally performing suburban and temple sacrifices, whenever I heard the music, sometimes the gong and shang modes were out of order, or the bells and chimes were off pitch.',
    idiomatic: 'Lately, whenever I attended suburban and temple sacrifices and heard the music, the gong and shang modes were sometimes disordered, or the bells and chimes were out of tune.',
  },
  s0303: {
    literal: 'You may fully supply bells and chimes; I shall personally determine [them] within the palace.',
    idiomatic: 'Supply all the bells and chimes you can; I shall set the tuning myself within the palace.',
  },
  s0304: {
    literal: '" The Grand Minister of Ceremonial presented [them]; the emperor assembled music workers to test for several days, ascertained the errors, then ordered remaking and grinding and carving.',
    idiomatic: 'The quote ended. The Grand Minister of Ceremonial presented the instruments; the emperor assembled music workers and tested them for several days, identified the errors, and then ordered them remade and recut.',
  },
  s0305: {
    literal: 'On the twenty-fifth day, one set was first completed; he summoned the music workers of the Grand Minister of Ceremonial; the emperor went in person to the Three Halls to observe the testing and striking—all matched the five tones—and sent them to the Grand Minister of Ceremonial.',
    idiomatic: 'On the twenty-fifth day one set was finished first. He summoned the directorate\'s music workers, went in person to the Three Halls to watch the trial performances, found that all matched the five tones, and sent the set to the Grand Minister of Ceremonial.',
  },
  s0306: {
    literal: 'On the twenty-eighth day, he also within the palace composed thirty-one musical pieces and sent them to the Grand Minister of Ceremonial for suburban and temple sacrifices to sing them.',
    idiomatic: 'On the twenty-eighth day he also composed thirty-one pieces within the palace and sent them to the Grand Minister of Ceremonial to be sung at suburban and temple rites.',
  },
  s0307: {
    literal: 'Fourth month: Hedong Military Commissioner Ma Sui presented "Quelling Disturbances."',
    idiomatic: 'In the fourth month, Hedong Military Commissioner Ma Sui presented the "Quelling Disturbances" suite.',
  },
  s0308: {
    literal: 'He proceeded to Linde Hall and ordered it reviewed and tested.',
    idiomatic: 'The emperor went to Linde Hall and ordered it performed for review.',
  },
  s0309: {
    literal: 'Twelfth year, twelfth month: Zhaoyi Circuit Military Commissioner Wang Qianxiu presented "Continuing Heaven\'s Birthday Sacred Music."',
    idiomatic: 'In the twelfth year, twelfth month, Zhaoyi Military Commissioner Wang Qianxiu presented the "Continuing Heaven\'s Birthday Sacred Music."',
  },
  s0310: {
    literal: 'Fourteenth year, second month: Dezong personally composed the "Zhonghe Dance," and also presented the Nine Department Music and palace song-dances.',
    idiomatic: 'In the fourteenth year, second month, Dezong personally composed the "Zhonghe Dance" and also had the Nine Department Music and palace song-dances performed.',
  },
  s0311: {
    literal: 'Performers numbering over ten lined up in the court; the emperor proceeded to Linde Hall to assemble the hundred officials to view the new music and poems, and also ordered the Crown Prince to write them out and show the hundred officials.',
    idiomatic: 'More than ten performers were arrayed in the courtyard. The emperor went to Linde Hall, gathered the hundred officials to view the new music and poems, and also ordered the Crown Prince to copy them out and display them to the officials.',
  },
  s0312: {
    literal: 'First month: Nanzhao\'s Yi Mouxun composed the "Offering to the Sage Music and Dance" and had it presented through Wei Gao.',
    idiomatic: 'In the first month, Nanzhao\'s Yi Mouxun composed the "Offering to the Sage Music and Dance" and had Wei Gao present it to the court.',
  },
  s0313: {
    literal: 'Eighteenth year, first month: the king of Pyu came to present his state\'s music.',
    idiomatic: 'In the eighteenth year, first month, the king of Pyu came to present his kingdom\'s music.',
  },
  s0314: {
    literal: 'Tenth month: an edict was issued to the Grand Minister of Ceremonial to follow the old personnel count for Yünshao Music and order those newly arrived to rehearse at the directorate.',
    idiomatic: 'In the tenth month the throne directed the Grand Minister of Ceremonial to follow the old staffing for Yünshao Music and have the newly arrived musicians rehearse at the directorate.',
  },
  s0315: {
    literal: 'By the tenth month, training was complete.',
    idiomatic: 'By the tenth month the training was finished.',
  },
  s0316: {
    literal: 'Third year: the Wude Office received an imperial order seeking two scrolls of the Yünshao Music hanging chart and presented them.',
    idiomatic: 'In the third year the Wude Office received an imperial order for two scrolls of the Yünshao Music hanging chart and presented them.',
  },
  s0317: {
    literal: 'Eighth month: the Grand Minister of Ceremonial Rites Court memorialized:',
    idiomatic: 'In the eighth month the Grand Minister of Ceremonial Rites Court memorialized:',
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
if (data.metadata.chapter !== '028') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 028; standalone T ready (${Object.keys(T).length} entries).`
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
