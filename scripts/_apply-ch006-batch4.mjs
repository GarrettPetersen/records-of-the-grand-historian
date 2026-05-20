#!/usr/bin/env node
/** Batch 4: s0301–s0310 (Jiutangshu ch.006, Empress Wu — historian's appraisal close, eulogy) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0301: {
    literal:
      'In antiquity the slander of the nose-covering was called poisonous;',
    idiomatic:
      'The old tale of the nose-covering slander was called poison itself;',
  },
  s0302: {
    literal: 'the cruelty of the human pig the world held as wrongful.',
    idiomatic: 'the horror of the Human Pig the world counted as a crying wrong.',
  },
  s0303: {
    literal:
      'In the empress\'s plot to seize the succession she silenced infants still in swaddling clothes and minced the bones of consorts of the peppered chambers—her impiety was extreme, yet also the constant manner of jealous wicked women.',
    idiomatic:
      'In her bid for the throne she strangled babes in their wraps and ground the bones of rival consorts to paste—wicked beyond measure, yet the old habit of a jealous, vicious woman.',
  },
  s0304: {
    literal: 'Yet she still broadly extended frank counsel and at times honored upright men.',
    idiomatic: 'Still she kept frank counsel in circulation and at times paid honor to upright men.',
  },
  s0305: {
    literal:
      'Though at first a hen crowed at dawn, in the end she restored her son and clarified the throne; she refuted flying slander to clear Yuan Zhong\'s guilt, spoke kindly to comfort Ren Jie\'s heart, exalted the statutes of the age and checked favored ministers, heard loyal words and executed cruel officials.',
    idiomatic:
      'Though at first the hen ruled the dawn, in the end she restored her son and set the throne in order; she answered slander to clear Yuan Zhong, soothed Ren Jie with gracious words, exalted the law of the time and reined in favorites, heeded loyal counsel and put cruel officers to death.',
  },
  s0306: {
    literal: 'How apt—how apt!',
    idiomatic: 'There is truth in this—truth indeed!',
  },
  s0307: {
    literal: '[Eulogy] The eulogy says: Dragon seed changed face; the eastern palace flourished with an heir.',
    idiomatic:
      '【Eulogy】 The eulogy says: Dragon seed took another face; the eastern palace swelled with heirs.',
  },
  s0308: {
    literal: 'Why did the vault of Heaven bear this one-legged demon?',
    idiomatic: 'Why did Heaven above breed this ogre and goblin?',
  },
  s0309: {
    literal: 'She seized the sacred regalia and defiled the imperial residence.',
    idiomatic: 'She snatched the sacred vessel and fouled the imperial halls.',
  },
  s0310: {
    literal: 'Evil pursued to white-haired old age—what judgment will Heaven send down?',
    idiomatic: 'Her demonry ran to a white-haired end—what verdict will Heaven hand down?',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/006.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 310;

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

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '006') {
  throw new Error(`Expected chapter 006, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

let applied = 0;
for (const s of trans.sentences) {
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

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s0301–s0310)`);
