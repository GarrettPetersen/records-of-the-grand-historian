#!/usr/bin/env node
/** Batch 7: s0601–s0632 (Jiutangshu ch.009, Xuanzong 2 — Kaiyuan zenith, historian’s appraisal, eulogy) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0601: {
    literal:
      'Kowtowing below the cinnabar steps, barbarian songs before the guard of honor—one may say the hundred barbarians wore caps and belts and carts and writing reached ten thousand li.',
    idiomatic:
      'They kowtowed on the cinnabar steps and sang barbarian airs before the guard—caps and belts on every frontier, carts and writing for ten thousand li.',
  },
  s0602: {
    literal:
      'The Son of Heaven then reviewed the meaning of the Cloud Terrace, drafted the clay-and-gold letter, and afterward enfeoffed Riguanshan and performed the Border sacrifice at Yunting; sought the Way in the clear heavens, rested his spirit in the dark female; let the people rest; every house could be sealed.',
    idiomatic:
      'The emperor read Cloud Terrace precedent, drafted the clay-and-gold missive, then enfeoffed Riguanshan and sacrificed at Yunting, sought the Way in clear heaven, rested spirit in the dark female, let the people breathe, and made every household fit to seal.',
  },
  s0603: {
    literal: 'At that time children with hair in tufts all knew courtesy and yielding;',
    idiomatic: 'Children in topknots all knew courtesy;',
  },
  s0604: {
    literal: 'elders with white hair did not know weapons of war.',
    idiomatic: 'white-haired elders had never seen arms.',
  },
  s0605: {
    literal:
      'Barbarians dared not raid the borders by moonlight; soldiers dared not bend the bow to avenge grievances.',
    idiomatic:
      'Barbarians would not raid by moonlight; soldiers would not bend the bow for private revenge.',
  },
  s0606: {
    literal: 'The ode “How peaceful!” overflowed the eight directions.',
    idiomatic: 'The “How peaceful!” ode flooded the eight directions.',
  },
  s0607: {
    literal: 'What is called “benevolence after a generation” was seen in the Kaiyuan era.',
    idiomatic: 'The “benevolence after a generation” of the saying appeared in Kaiyuan.',
  },
  s0608: {
    literal: 'More than three decades had passed—this may be called great peace.',
    idiomatic: 'Thirty years and more—this was great peace.',
  },
  s0609: {
    literal: 'Woe!',
    idiomatic: 'Alas!',
  },
  s0610: {
    literal: 'Without worthy ministers, even a sage finds rule hard;',
    idiomatic: 'Without worthy ministers, even a sage cannot govern;',
  },
  s0611: {
    literal: 'when a mountain holds a fierce tiger, beasts dare not peer in.',
    idiomatic: 'where a mountain holds a tiger, beasts dare not look in.',
  },
  s0612: {
    literal: 'He who gains men flourishes—truly no empty saying.',
    idiomatic: 'Gain the right men and the state thrives—the saying is true.',
  },
  s0613: {
    literal:
      'Formerly Duke Huan of Qi behaved like the beasts yet did not lose the name of hegemon;',
    idiomatic:
      'Duke Huan of Qi lived like a beast yet kept the hegemon’s name;',
  },
  s0614: {
    literal:
      'Emperor Wu of Liang was quiet as a monk yet in the end suffered the cruelty of Taicheng.',
    idiomatic:
      'Liang Wudi was still as a monk yet died in Taicheng’s torment.',
  },
  s0615: {
    literal:
      'Having Guan Zhong, debauchery did not harm the hegemony; employing Zhu Yi, virtue could not save from ruin.',
    idiomatic:
      'With Guan Zhong, license did not break the hegemony; with Zhu Yi, virtue could not save the throne.',
  },
  s0616: {
    literal:
      'At the beginning of Kaiyuan worthy ministers held the state; all four gates were solemn and every measure upright, yet Daoist and Buddhist circles often asked audience pleading nonaction.',
    idiomatic:
      'Early Kaiyuan had worthy ministers at court, every gate solemn and every measure straight—yet Daoists and Buddhists often begged audience for nonaction.',
  },
  s0617: {
    literal:
      'The emperor then pursued purity, devoted himself to incense and cultivation, lingered over compositions from behind the hall, danced and chanted Laozi’s teaching—though he shifted somewhat from diligence to weariness, he had not yet reached neglect.',
    idiomatic:
      'The emperor turned to purity and ritual cultivation, lingered over hall compositions, danced to Laozi’s words—weariness grew, but not yet neglect.',
  },
  s0618: {
    literal: 'Soon court and countryside groaned; government and punishments tangled—why?',
    idiomatic: 'Soon court and countryside groaned; law and punishment snarled—why?',
  },
  s0619: {
    literal: 'Failure in the use of men.',
    idiomatic: 'Failure in appointing men.',
  },
  s0620: {
    literal: 'From Tianbao onward the way of petty men grew long.',
    idiomatic: 'From Tianbao on, petty men’s way lengthened.',
  },
  s0621: {
    literal: 'As when a mountain has inner rot, though great it must crumble;',
    idiomatic: 'As a mountain rots within, though great it must fall;',
  },
  s0622: {
    literal: 'when a tree has bore-worms, its glory is easily shed.',
    idiomatic: 'when a tree has bore-worms, its crown soon drops.',
  },
  s0623: {
    literal:
      'With a hundred mouths and hearts of slander screening the two eyes and two ears of intelligence, unless one had an iron gut and stone heart, how could one not be deluded!',
    idiomatic:
      'A hundred slandering mouths and hearts blinded two eyes and two ears—without iron bowels and a stone heart, who would not be lost?',
  },
  s0624: {
    literal: 'Yet offerable criticism and rejection of error—none heard the words of Yao Chong and Song Jing;',
    idiomatic: 'Offerable criticism went unheard from Yao and Song;',
  },
  s0625: {
    literal: 'jealous of worthies and harming merit—there were only memorials from Li and Yang.',
    idiomatic: 'jealous slander of worthies heard only Li and Yang.',
  },
  s0626: {
    literal:
      'The crafty thereby leered; the clear-minded thereupon folded their plans—so An Lushan’s kind could enact their deceit.',
    idiomatic:
      'The crafty leered; the wise folded their plans—so An Lushan’s kind could play their fraud.',
  },
  s0627: {
    literal:
      'The source of calamity did not descend from Heaven; poor counsel cast prior achievements aside.',
    idiomatic:
      'The calamity’s source did not fall from heaven—bad counsel threw away prior merit.',
  },
  s0628: {
    literal: 'A pity!',
    idiomatic: 'Pity!',
  },
  s0629: {
    literal: '【Eulogy】 The eulogy says: Kaiyuan grasped the chart and forever took the overturned cart as mirror.',
    idiomatic: '【Eulogy】 The eulogy says: Kaiyuan held the chart and forever mirrored the overturned cart.',
  },
  s0630: {
    literal: 'Prosperous aura blended clear; murky vapors were washed away.',
    idiomatic: 'Bright qi mingled; murky haze was scoured clean.',
  },
  s0631: {
    literal: 'Government talent waxed diligent and weary; demons gathered at the court gate.',
    idiomatic: 'Rule turned from zeal to fatigue; omens clustered at the palace gate.',
  },
  s0632: {
    literal: 'The words of the ancients: “There is no end without a beginning.”',
    idiomatic: 'The ancients said: “Nothing lacks a beginning.”',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/009.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 632;

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
if (trans.metadata.chapter !== '009') {
  throw new Error(`Expected chapter 009, got ${trans.metadata.chapter}`);
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
console.log(`Applied ${applied} translations (s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')})`);
