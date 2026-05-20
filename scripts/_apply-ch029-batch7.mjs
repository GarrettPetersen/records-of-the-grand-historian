#!/usr/bin/env node
/** Batch 7: s0601–s0636 (Jiutangshu ch.029, Rites 5 / court music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/029.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 636;

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
  s0601: {
    literal: 'The temples of the Former Sage and of the Crown Prince each used nine frames, with dance in six rows.',
    idiomatic: 'The Former Sage Temple and the Crown Prince Temple each had nine suspension frames and six rows of dancers.',
  },
  s0602: {
    literal: 'Between the suspensions one set each of zhu and yi; the zhu on the left, the yi on the right.',
    idiomatic: 'Between the suspensions stood one zhu and one yi—the zhu to the left, the yi to the right.',
  },
  s0603: {
    literal: 'Chunyu, fupai, dunxiang, nao, and duo were arrayed next south of the road drums.',
    idiomatic: 'Chunyu, clappers, beating blocks, nao, and duo were lined up south of the road drums.',
  },
  s0604: {
    literal: 'The dancers were arrayed north of the suspension.',
    idiomatic: 'Dancers stood north of the suspension.',
  },
  s0605: {
    literal: 'Two ascending-hymn frames were set before the two pillars on the hall.',
    idiomatic: 'Two ascending-hymn frames stood before the hall\'s central pillars.',
  },
  s0606: {
    literal: 'The serial bells were on the east; the serial chimes on the west.',
    idiomatic: 'Serial bells were placed east; serial chimes west.',
  },
  s0607: {
    literal: 'Ascending-hymn workers sat in the hall; bamboo players stood below the hall—what is called "zithers and se in the hall, yu and sheng in the court."',
    idiomatic: 'Ascending-hymn musicians sat in the hall; bamboo players stood below—"zithers and se in the hall, yu and sheng in the courtyard," as the saying runs.',
  },
  s0608: {
    literal: 'In the palace courtyard wind-and-percussion ensembles were additionally set at the four corners.',
    idiomatic: 'The palace courtyard also had wind-and-percussion ensembles at the four corners.',
  },
  s0609: {
    literal: 'At banquets Clear Music and Western Liang Music were presented.',
    idiomatic: 'Banquets featured Clear Music and Western Liang Music.',
  },
  s0610: {
    literal: 'Frames faced each other in the left and right wings, with a dance mat set between them.',
    idiomatic: 'Frames faced each other in the left and right wings, with a dance mat between.',
  },
  s0611: {
    literal: 'Formerly the empress\'s court had only silk and pipes; the Great Enterprise prized display and first set bells and chimes, yet still did not set bo bells, using large stone chimes in their place.',
    idiomatic: 'Earlier the empress\'s court had only strings and winds; under the Great Enterprise, when display was prized, bells and chimes were first installed—but still no bo bells; large stone chimes stood in for them.',
  },
  s0612: {
    literal: 'When Empress Wu held power she used bells, and thereafter it was never changed.',
    idiomatic: 'When Empress Wu ruled she restored full bells, and the practice was never altered.',
  },
  s0613: {
    literal: 'For music stands: court temples used mixed five-color ornament; regnal suspension used vermillion; the five suburban altars each followed its directional color.',
    idiomatic: 'Music stands at court temples were ornamented in mixed five colors; regnal suspension in vermillion; the five suburban altars each took the color of its direction.',
  },
  s0614: {
    literal: 'Each time, three days before music was performed, the Director of Grand Music overnight set the suspension in the courtyard; on the day itself he led the workers to lodge in their stations.',
    idiomatic: 'Three days before each performance the Director of Grand Music set up the suspension in the courtyard and lodged there overnight; on the day itself he led the musicians to their stations.',
  },
  s0615: {
    literal: 'The Director of Pitch raised the banner, and music began;',
    idiomatic: 'The pitch director raised the banner—music began;',
  },
  s0616: {
    literal: 'he lowered the banner, and music stopped.',
    idiomatic: 'he lowered it—music stopped.',
  },
  s0617: {
    literal: 'The civil dance withdrew; the martial dance advanced.',
    idiomatic: 'Civil dance withdrew; martial dance entered.',
  },
  s0618: {
    literal: 'For regular feasts and assemblies, the day before the names of seated- and standing-section pieces were sealed and submitted, requesting which were to be played so the throne might annotate and send them down.',
    idiomatic: 'For routine feasts, the day before, lists of seated- and standing-section pieces were sealed and submitted so the throne could mark which to perform.',
  },
  s0619: {
    literal: 'At the assembly, seated-section performers were played first, then standing-section, then treading-horse, then Scattered Music—and it was finished.',
    idiomatic: 'At the gathering they played seated-section pieces first, then standing-section, then treading-horse, then Scattered Music—and that concluded the program.',
  },
  s0620: {
    literal: 'At the beginning of the Guangming era, the Huang Chao bandits disturbed the realm; the imperial carriage was driven abroad; both capitals were overthrown; the ancestral temples were all ash and embers; music workers were scattered; metal music nearly perished.',
    idiomatic: 'Early in the Guangming era Huang Chao\'s rebels threw the realm into chaos; the court fled; both capitals fell; ancestral temples burned to ash; musicians scattered; bronze ritual music nearly died out.',
  },
  s0621: {
    literal: 'When Xizong returned to the palace, he sought to purchase bell-suspension instruments—not one remained.',
    idiomatic: 'When Xizong returned to the capital he tried to buy bell-suspension instruments—none survived.',
  },
  s0622: {
    literal: 'When Zhaozong took the throne, about to visit the suburban altars in person, the authorities requested that music stands be made; they inquired of old craftsmen, but none knew the system.',
    idiomatic: 'Zhaozong, on accession, prepared to attend the suburban altars in person; the authorities ordered new music stands and questioned veteran craftsmen, but none knew the regulations.',
  },
  s0623: {
    literal: 'The Commissioner for Repairing and Presenting the Music Stands, Chief Minister Zhang Jun, gathered all Grand Music Office clerks of the Court of Imperial Sacrifices for detailed deliberation, yet in the end could not obtain the method.',
    idiomatic: 'Zhang Jun, chief minister and commissioner for the music stands, assembled every Grand Music clerk in the Court of Imperial Sacrifices for consultation, yet still could not recover the method.',
  },
  s0624: {
    literal: 'At that time Court of Imperial Sacrifices Doctor Yin Yingsun was deep in ancient precedent; he then examined the text of the Zhou Offices\' Artificers\' Record, investigated the methods for luan, xian, yu, gu, zheng, wu, and yong, pondered three or four nights, and by performing calculation with multiplication and division fixed the weight and height of the bo bells.',
    idiomatic: 'Doctor Yin Yingsun of the Court of Imperial Sacrifices, versed in antiquity, turned to the Artificers\' Record in the Zhou Offices, worked out the rules for bell crowns, shanks, sound-bowls, bodies, clapper-bosses, dance-panels, and stems, brooded three or four nights, and by arithmetic fixed the weight and pitch of the bo bells.',
  },
  s0625: {
    literal: 'For suspended serial bells, proper Yellow Bell was nine cun five fen, down to ascending-hymn doubled Ying Bell at three cun three and a half fen—forty-eight grades in all.',
    idiomatic: 'For the suspended serial bells, proper Yellow Bell measured nine cun five fen, down to ascending-hymn doubled Ying Bell at three cun three and a half fen—forty-eight grades in all.',
  },
  s0626: {
    literal: 'The measures of mouth and crown and the girth of stem and crossbar were all made into diagrams; metalworkers were sent to cast according to the law—two hundred forty pieces in all.',
    idiomatic: 'Mouth and crown dimensions and stem and crossbar girth were fully diagrammed; metalworkers cast to specification—two hundred forty bells in all.',
  },
  s0627: {
    literal: 'When casting was finished, Zhang Jun sought those who knew sound—Recluse Xiao Chengxun, Pear Garden music worker Chen Jingyan, and Director of Grand Music Li Congzhou—and ordered them first to calibrate the stone chimes; joined and struck together, the eight tones harmonized, and viewers listened in awe.',
    idiomatic: 'After casting, Zhang Jun found masters of pitch—recluse Xiao Chengxun, Pear Garden musician Chen Jingyan, and Director of Grand Music Li Congzhou—had them tune the stone chimes first, then strike them together; the eight categories matched, and listeners were struck dumb.',
  },
  s0628: {
    literal: 'When Jun had presented them, Zhaozong arrayed them in the palace courtyard to test them.',
    idiomatic: 'Jun presented the set; Zhaozong had it arranged in the palace courtyard for trial.',
  },
  s0629: {
    literal: 'At that time, because after the ancestral temples were burned restoration could not keep pace, they provisionally used the Ministry of Imperial Manufactories hall as the Imperial Ancestral Temple.',
    idiomatic: 'With the ancestral temples still in ruins and restoration lagging, the court temporarily used the Ministry of Imperial Manufactories hall as the Imperial Ancestral Temple.',
  },
  s0630: {
    literal: 'Its courtyard was very narrow; deliberators debated that the frames of the suspended music were not the same.',
    idiomatic: 'The courtyard was very cramped; officials argued that the suspension frames could not match the usual layout.',
  },
  s0631: {
    literal: 'Jun memorialized in deliberation, saying:',
    idiomatic: 'Zhang Jun submitted a memorial of deliberation, saying:',
  },
  s0632: {
    literal: 'It was followed.',
    idiomatic: 'The throne approved.',
  },
  s0633: {
    literal: 'Ancient regulation: under elegant music\'s palace suspension, four frames of serial bells, sixteen mouths.',
    idiomatic: 'By ancient rule, under elegant music\'s palace suspension there were four frames of serial bells—sixteen bells.',
  },
  s0634: {
    literal: 'In recent times twenty-four mouths were used—twelve proper tones, twelve doubled tones—each with its pitch standard; twenty-four sounds in all.',
    idiomatic: 'Later ages used twenty-four bells—twelve fundamental tones and twelve octave doubles—each with its pitch name, twenty-four tones in all.',
  },
  s0635: {
    literal: 'One ascending-hymn frame also had twenty-four bells.',
    idiomatic: 'The ascending-hymn frame likewise held twenty-four bells.',
  },
  s0636: {
    literal: 'Elegant music had been lost and destroyed; by this time it was restored complete.',
    idiomatic: 'Elegant music had been lost; now at last it was whole again.',
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
if (data.metadata.chapter !== '029') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 029; standalone T ready (${Object.keys(T).length} entries).`
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
