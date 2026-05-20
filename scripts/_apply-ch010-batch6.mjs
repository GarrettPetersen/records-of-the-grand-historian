#!/usr/bin/env node
/** Batch 6: s0501–s0549 (Jiutangshu ch.010, Suzong — Baoying treasures, Xuanzong’s death, Suzong’s death, historian’s appraisal, eulogy) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0501: {
    literal:
      'Third: the grain disc, of white jade, about five or six cun in diameter, its pattern like millet grains with no trace of carving.',
    idiomatic:
      'Third came a white-jade grain disc five or six cun wide, millet-patterned and uncarved.',
  },
  s0502: {
    literal:
      'Fourth: the Queen Mother of the West’s white rings, two pieces, of white jade, six or seven cun in diameter.',
    idiomatic:
      'Fourth, two white-jade rings of the Queen Mother of the West, six or seven cun across.',
  },
  s0503: {
    literal:
      'Fifth: the green treasure, round and luminous.',
    idiomatic:
      'Fifth was a round green gem that shone.',
  },
  s0504: {
    literal:
      'Sixth: the wish-fulfilling pearl, round as a hen’s egg, bright as the moon.',
    idiomatic:
      'Sixth, a wish-fulfilling pearl egg-round and moon-bright.',
  },
  s0505: {
    literal:
      'Seventh: red mokling, large as a great chestnut, red as a cherry.',
    idiomatic:
      'Seventh, a red mokling stone big as a chestnut and cherry-red.',
  },
  s0506: {
    literal:
      'Eighth: langgan pearls, two pieces, one cun two fen long.',
    idiomatic:
      'Eighth, two langgan pearls an inch and two fen long.',
  },
  s0507: {
    literal:
      'Ninth: the jade tablet, shaped like a jade ring with one quarter missing.',
    idiomatic:
      'Ninth, a jade tablet like a ring missing a quarter.',
  },
  s0508: {
    literal:
      'Tenth: the jade seal, large as half a hand, oblong, its grain like a deer, the deer shape sunk in the seal so that when stamped the deer appeared.',
    idiomatic:
      'Tenth, a palm-half seal oblong-grained like a deer that stamped clear.',
  },
  s0509: {
    literal:
      'Eleventh: the empress’s silkworm-gathering hook, five or six cun long, thin as a chopstick, bent at the tip, seeming true gold and yet seeming silver.',
    idiomatic:
      'Eleventh, the empress’s silkworm hook—chopstick-thin, gold-bright yet silver-pale.',
  },
  s0510: {
    literal:
      'Twelfth: Lord Thunder’s stone axe, four cun long, two cun wide, without a hole, fine as green jade.',
    idiomatic:
      'Twelfth, Lord Thunder’s green-jade axe, four by two cun, holeless.',
  },
  s0511: {
    literal:
      'When the thirteen treasures were set in the sun, white vapor joined heaven.',
    idiomatic:
      'Set in sunlight, all thirteen threw white vapor to the sky.',
  },
  s0512: {
    literal:
      'A prior memorial had reported: "At a Chuzhou temple the nun Zhenru in a trance ascended and saw the God on High.',
    idiomatic:
      'A memorial had told how the Chuzhou nun Zhenru, in trance, rose to the God on High.',
  },
  s0513: {
    literal:
      'The God bestowed thirteen treasures, saying: \'China has calamity; the second treasure should guard it.\'',
    idiomatic:
      'He gave her thirteen treasures, saying China was in calamity and the second should guard the realm.',
  },
  s0514: {
    literal:
      '" On jiayin the Retired Emperor of Supreme Way and Sagely Heaven died in the Hall of Divine Dragon in the western inner palace.',
    idiomatic:
      'On jiayin the retired emperor died in the western palace’s Hall of Divine Dragon.',
  },
  s0515: {
    literal:
      'The emperor had been unwell since mid-spring; hearing of the retired emperor’s passing, he could not bear the grief and his illness sharply worsened.',
    idiomatic:
      'Ill since mid-spring, he collapsed on news of his father’s death.',
  },
  s0516: {
    literal:
      'On yichou an edict ordered the crown prince to supervise the state.',
    idiomatic:
      'On yichou the crown prince was ordered to govern.',
  },
  s0517: {
    literal:
      'The edict also said: "Heaven has sent down treasures offered from Chuzhou; therefore take them as the body of the calendar and fit the five reckonings.',
    idiomatic:
      'The edict went on: heaven’s treasures from Chuzhou would reshape the calendar and the five reckonings.',
  },
  s0518: {
    literal:
      'The first year shall be changed to Baoying; the jiansi month shall be the fourth month; the other months follow the usual count; still, the first day of the first month remains the start of the year.',
    idiomatic:
      'The era would become Baoying; the intercalary jiansi month would count as fourth; other months unchanged; New Year still the first of the first month.',
  },
  s0519: {
    literal:
      '" On dingmao the testamentary edict was proclaimed.',
    idiomatic:
      'On dingmao the death edict was read aloud.',
  },
  s0520: {
    literal:
      'That day the emperor died in the Hall of Eternal Life at age fifty-two.',
    idiomatic:
      'That day he died in the Hall of Eternal Life, aged fifty-two.',
  },
  s0521: {
    literal:
      'The ministers gave the posthumous title Emperor of Civil Culture, Martial Virtue, Great Sagely, Great Manifest Filial Piety; his temple name was Suzong.',
    idiomatic:
      'Ministers named him Civil, Martial, Great Sagely, Great Manifest Filial; temple name Suzong.',
  },
  s0522: {
    literal:
      'On gengwu in the third month of Baoying 2 he was buried at Jian Tomb.',
    idiomatic:
      'On gengwu in Baoying 2, third month, he was buried at Jian Tomb.',
  },
  s0523: {
    literal:
      '【Historian’s appraisal】 The historian says: Whenever I read the Odes and reach Lady Xu Mu hearing of her state’s overthrow, or the Zhou grandees grieving millet over ruined halls—their words troubled and earnest, their remonstrance painstaking—I always lay down the book and sigh.',
    idiomatic:
      '【Historian’s appraisal】 The historian writes: Reading the Odes to Lady Xu Mu’s grief for a fallen state, or Zhou nobles mourning millet among ruins—I always close the book and sigh.',
  },
  s0524: {
    literal:
      'When I behold the loss of reins in the Tianbao era, flight and exile, it exceeds even the poets’ distress.',
    idiomatic:
      'The Tianbao collapse and flight surpassed even those poets’ sorrow.',
  },
  s0525: {
    literal:
      'When the Rong and Jie broke faith and surged like boars, jackals rose beneath the chariot wheels and barbarians from north and south crowded the boats—borrowing another’s spear to turn it back, disaster came unlooked-for.',
    idiomatic:
      'Barbarians broke faith; beasts swarmed the capital; north and south filled the boats—spears borrowed were turned inward, and ruin came unawares.',
  },
  s0526: {
    literal:
      'Yet when Great King went from his land, the Bin people did not forget their Zhou lord;',
    idiomatic:
      'Yet when Great King left Bin, the people still loved their Zhou lord;',
  },
  s0527: {
    literal:
      'when Xin Mang seized the mandate, common folk still yearned for Han virtue.',
    idiomatic:
      'when Xin Mang took the throne, the people still longed for Han.',
  },
  s0528: {
    literal:
      'Thus the Manifest Filial Emperor inherited the legacy of six sages and rode the people’s acclaim.',
    idiomatic:
      'So Suzong took six sages’ legacy and the people’s acclaim.',
  },
  s0529: {
    literal:
      'Proclaiming command from Shuofang, in ten days chariots and foot gathered like clouds;',
    idiomatic:
      'From Shuofang his call ran; in ten days armies clouded the horizon;',
  },
  s0530: {
    literal:
      'turning the army to the right capital, within a month Pass and Longxi were made level.',
    idiomatic:
      'wheeling to the western capital, within a month Pass and Longxi lay level.',
  },
  s0531: {
    literal:
      'So the two capitals welcomed the imperial carriage again, and the nine temples once more received millet offerings.',
    idiomatic:
      'The two capitals took back the throne; the nine temples tasted millet again.',
  },
  s0532: {
    literal:
      'See how he met the retired emperor on the Shu road and offered celebration at Wangxian: father and son wept, and passersby shed tears.',
    idiomatic:
      'He met his father on the Shu road and bowed at Wangxian—father, son, and every passerby wept.',
  },
  s0533: {
    literal:
      'Of old, Taigong welcomed his son, perhaps following the house steward’s counsel;',
    idiomatic:
      'Taigong once welcomed a son on a steward’s word;',
  },
  s0534: {
    literal:
      'yet Duke of the West served his kin and never slackened the bedchamber door’s inquiry.',
    idiomatic:
      'yet the Duke of the West never failed the bedchamber door.',
  },
  s0535: {
    literal:
      'Zeng Shen and Xiaoji offer enough parallel.',
    idiomatic:
      'Zeng Shen and Xiaoji are fit comparison.',
  },
  s0536: {
    literal:
      'Yet the Way bent short of knowing the moment; his aims were slight and foresight thin.',
    idiomatic:
      'Yet he missed the moment; his vision ran short.',
  },
  s0537: {
    literal:
      'Rebel remnants undestroyed, recovery should have come first;',
    idiomatic:
      'Rebels still lived—recovery should have come first;',
  },
  s0538: {
    literal:
      'ash barely gathered, what leisure for rites of great peace?',
    idiomatic:
      'embers still smoked—what time for rites of peace?',
  },
  s0539: {
    literal:
      'He listened to Wang Yu kneeling in memorial and Li Fuguo urging approval—the dark canopy tilling spring fields, the green carriage leading silkworms at the Cocoon Hall; or holding dawn court to proclaim seasons, or mounting the altar to lodge all night honoring the spirits.',
    idiomatic:
      'He heard Wang Yu and Li Fuguo urge rites—the emperor plowing spring fields, the empress leading silkworms, dawn audiences for seasons, night vigils at the altars.',
  },
  s0540: {
    literal:
      'Rites in themselves were fitting; when had time to spare?',
    idiomatic:
      'The rites were right; the hour was wrong.',
  },
  s0541: {
    literal:
      'Bells had not yet shifted on the bell-frame when Siming already took Luoyang—so much for prayer clerks and calendar officers reaching far ahead.',
    idiomatic:
      'Bells had not moved when Siming took Luoyang—what prayer clerk sees that far?',
  },
  s0542: {
    literal:
      'Yet great ministers bore the burden and generals proved loyal: the Comet Banner fell at last in the Three Rivers, the bright sun shone again over all within the four seas.',
    idiomatic:
      'Yet ministers and generals endured: the comet fell in the Three Rivers; the sun shone over the realm again.',
  },
  s0543: {
    literal:
      'Compared to King Ping’s move to Luoyang, ours was heroic;',
    idiomatic:
      'Beside King Ping’s flight to Luoyang, this was heroism;',
  },
  s0544: {
    literal:
      'set beside Emperor Yuan’s crossing the Yangtze, that was petty indeed.',
    idiomatic:
      'beside Emperor Yuan’s Yangtze crossing, that was small.',
  },
  s0545: {
    literal:
      'To comfort kin and restore the realm—Suzong’s was a true rest!',
    idiomatic:
      'To heal kin and restore the state—Suzong’s rest was real!',
  },
  s0546: {
    literal:
      '【Eulogy】 The eulogy says: Dogs and sheep rebelled; the imperial carriage wandered.',
    idiomatic:
      '【Eulogy】 Dogs and sheep rose; the throne wandered.',
  },
  s0547: {
    literal:
      'The felons died at last; the imperial fortune lengthened again.',
    idiomatic:
      'The rebels died; the mandate lengthened.',
  },
  s0548: {
    literal:
      'Stars racing on the Shu road, rain weeping at Wangxian.',
    idiomatic:
      'Stars flew on the Shu road; rain fell at Wangxian.',
  },
  s0549: {
    literal:
      'The posthumous name Filial and Martial—who says it is not so?',
    idiomatic:
      'Filial and Martial—who denies the name?',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/010.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 549;

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
if (trans.metadata.chapter !== '010') {
  throw new Error(`Expected chapter 010, got ${trans.metadata.chapter}`);
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
