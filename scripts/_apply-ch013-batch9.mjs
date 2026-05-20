#!/usr/bin/env node
/** Batch 9: s0801–s0827 (Jiutangshu ch.013, Dezong 2 — death, posthumous title, historian appraisal) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/013.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 801;
const END = 827;

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
  s0801: {
    literal:
      "At the beginning he removed nameless expenses and abolished non-urgent offices;",
    idiomatic:
      "Early on he cut waste posts and pointless spending;",
  },
  s0802: {
    literal:
      "sent out the consorts of the Eternal Lane, released the tame elephants of Wendan;",
    idiomatic:
      "sent palace women from the rear quarters away, freed the court elephants;",
  },
  s0803: {
    literal:
      "reduced the Grand Steward's meals, admonished luxury in dress and playthings;",
    idiomatic:
      "trimmed the imperial kitchen, and warned against finery and toys;",
  },
  s0804: {
    literal:
      "freed hawks and dogs and released musicians, stopped monopoly on wine and cut off tribute offerings.",
    idiomatic:
      "gave up hunting birds and hounds, dismissed idle musicians, ended the wine monopoly, and stopped lavish tribute.",
  },
  s0805: {
    literal:
      "The hundred spirits were all in order, the five classics were all followed; he faced the main hall to examine the worthy and able, and set aside court ministers to govern the capital region.",
    idiomatic:
      "Rites were restored, the classics honored; he held court examinations for talent and sent ministers to govern the capital districts.",
  },
  s0806: {
    literal:
      "These were all deeds former kings could perform, great principles for a state — to follow them in full, who would dare find fault?",
    idiomatic:
      "These were the acts of sage kings and the foundations of empire; had he kept to them, who could object?",
  },
  s0807: {
    literal:
      "Moreover his heaven-given talent was splendid and flourishing, his literary thought carved and ornate.",
    idiomatic:
      "His gifts were bright and his prose polished.",
  },
  s0808: {
    literal:
      "Brushing composition at the Golden Gate, he did not shame the Huainan master's works;",
    idiomatic:
      "At court he wrote verses worthy of the Huainan prince;",
  },
  s0809: {
    literal:
      "joining phrases on lead tablets, how would he shrink from the Longdi book?",
    idiomatic:
      "and on bamboo and silk he matched the classics of the Longdi.",
  },
  s0810: {
    literal:
      "Literary elegance revived — far above the previous age; could the \"Two Souths\" and three ancestral hymns surpass this?",
    idiomatic:
      "Letters flourished again, loftier than in recent reigns — a revival to rival the Odes themselves.",
  },
  s0811: {
    literal:
      "Yet the traces of kingship and hegemony differ, pure and coarse change with the age — to measure the time and govern is hard to weigh.",
    idiomatic:
      "Yet times differ: what makes a true king in one age fails in another, and to judge the moment is hardest of all.",
  },
  s0812: {
    literal:
      "If in the season of mutual loss one lightly takes the counsel of base men, looking through recent times none have not been ruined.",
    idiomatic:
      "When the realm was already fraying, he still heeded petty advisers — and in our own age such rulers always fall.",
  },
  s0813: {
    literal:
      "Dezong in his fief, in the years of capped youth, had once been commander-in-chief;",
    idiomatic:
      "As heir in his princedom he had already commanded armies;",
  },
  s0814: {
    literal:
      "when he emerged to receive Heaven's mandate on the day of bearing the tripod, he bore considerable statecraft.",
    idiomatic:
      "and when he ascended the throne he seemed to carry real statecraft in him.",
  },
  s0815: {
    literal:
      "Thus from the first, when he removed Guo Ziyi's military power and out of turn heeded Yang Yan's mistaken plan, he wished to unify Chinese and barbarian, bind the treacherous and strong, execute punishment south on Xiang and Han, and raise arms north against Hengyang.",
    idiomatic:
      "Yet from the start he stripped Guo Ziyi of command and rashly followed Yang Yan — dreaming of binding every warlord at once, punishing the south and marching on the north.",
  },
  s0816: {
    literal:
      "Chariots went forth like clouds, appointed generals like stars — exhausting the state treasury yet not enough to feed the armies, draining the people's strength yet never hearing of breaking the rebels.",
    idiomatic:
      "Armies rolled out in clouds of banners, generals were named by the score — the treasury emptied without feeding the hosts, the people were drained without breaking the enemy.",
  },
  s0817: {
    literal:
      "Once virtuous edicts were swept to the ground, lamentation linked roof to roof — it truly brought five bandits to usurp the Son of Heaven, and the two Zhu clans to press the altars of state; the distress at Fengtian could draw tears, and words of self-reproach — what did they repair?",
    idiomatic:
      "Then his good decrees vanished, grief filled every lane — five rebels mocked the throne, the Zhu kindred seized the altars, Fengtian became a siege that still brings tears, and even his confession could not undo the harm.",
  },
  s0818: {
    literal:
      "What was relied on was loyal ministers exerting strength together, and adverse fortune turning bright again.",
    idiomatic:
      "Only loyal ministers fighting together turned fortune back.",
  },
  s0819: {
    literal:
      "Although knowing his error he finally drove out Yang Yan, yet cherishing flatterers he did not forget Lu Qi.",
    idiomatic:
      "He did exile Yang Yan when he saw the fault, yet clung to Lu Qi and other flatterers.",
  },
  s0820: {
    literal:
      "Using Yan Shang's private grudge, he took Li Sheng's tally of command;",
    idiomatic:
      "He let Yan Shang's spite strip Li Sheng of command;",
  },
  s0821: {
    literal:
      "he took Pei Yanling's treacherous schemes.",
    idiomatic:
      "he embraced Pei Yanling's plots;",
  },
  s0822: {
    literal:
      "he removed Lu Zhi from the chancellorship — \"knowing men then is wise\" — is it like this!",
    idiomatic:
      "and drove Lu Zhi from office — is this what they mean by knowing men?",
  },
  s0823: {
    literal:
      "In the Zhenyuan years, our Way was at an end.",
    idiomatic:
      "Under Zhenyuan the moral order was spent.",
  },
  s0824: {
    literal:
      "【Eulogy】 Sagacious and bright, cultured and thoughtful — only the wise become sage.",
    idiomatic:
      "【Eulogy】 Bright and literate, fit for sagehood —",
  },
  s0825: {
    literal:
      "Protecting the wicked and harming the good, hearing and deciding without order.",
    idiomatic:
      "yet he shielded villains, wounded the good, and judged without justice.",
  },
  s0826: {
    literal:
      "He held the throne for thirty-nine years, and by chance met Heaven's favor.",
    idiomatic:
      "Thirty-nine years on the throne owed more to luck than to rule;",
  },
  s0827: {
    literal:
      "On the days of granted feasts, he merely prided himself on verses.",
    idiomatic:
      "at his banquets he preened over poems alone.",
  }
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
if (data.metadata.chapter !== '013') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 013; standalone T ready (${Object.keys(T).length} entries).`
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
