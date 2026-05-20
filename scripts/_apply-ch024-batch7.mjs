#!/usr/bin/env node
/** Batch 7: s0601–s0643 (Jiutangshu ch.024, suburban sacrifice treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/024.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 643;

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
    literal: 'This again is a great sacrifice using the rites of a middling sacrifice.',
    idiomatic: 'Here again is the case of a great rite performed with middling-rite procedures.',
  },
  s0602: {
    literal: 'Compare the sun and moon as above; examine the altars of soil and grain as below—what is called vast merit therefore receives special rites; what is called fitting rank dares not alter its text. This is the clear proof by which former sages and later scholars measured ascent and descent.',
    idiomatic: 'Weigh the sun and moon as above, the altars of soil and grain as below: where merit is vast, special rites follow; where rank is fitting, none dare alter the wording. So sages past and scholars after have measured what may rise and what must fall.',
  },
  s0603: {
    literal: 'Now the Nine Palaces august spirits already govern flood and drought, bestow blessing and ward off disaster; the people will rely on them. To revive the old statutes is truly obtaining ritual.',
    idiomatic: 'The Nine Palaces august spirits already govern flood and drought, bestow blessing and turn aside calamity—the people will lean on them. To revive the old statutes is truly proper ritual.',
  },
  s0604: {
    literal: 'Yet because establishing shrines is not ancient, dwelling positions have their directions, and divided duties already differ in their offices, invocations must participate in the gradations.',
    idiomatic: 'Yet to establish shrines is not ancient custom; each seat has its direction, each office its charge—sacrificial invocations must be ranked accordingly.',
  },
  s0605: {
    literal: 'Seeking the mean, there ought to be adaptation; a slightly heavier rite has something to compare with.',
    idiomatic: 'Seeking the mean calls for adaptation—a rite slightly elevated, yet still comparable.',
  },
  s0606: {
    literal: 'Humbly petition: from now on afterward, revert to using great-sacrifice rites; oath officers and prepared objects, without any reduction.',
    idiomatic: 'We humbly petition that hereafter the great-sacrifice rites be restored in full—oath officers, offerings, and equipage, with no reduction whatsoever.',
  },
  s0607: {
    literal: 'Only the Imperial Registry prayer text takes the altars of soil and grain as basis, humbly because one has already styled oneself subject before the Supreme Thearch—there cannot be two sovereigns.',
    idiomatic: 'Only the Imperial Registry prayer text should take the altars of soil and grain as its basis—for the Son of Heaven has already styled himself subject before the Supreme God, and there cannot be two sovereigns.',
  },
  s0608: {
    literal: 'The edict assented and was referred to the relevant offices.',
    idiomatic: 'The throne assented and referred the matter to the proper offices.',
  },
  s0609: {
    literal: 'Tianbao tenth year, fourth month, twenty-ninth day: moved the Yellow Thearch altar to the kun quadrant within the inner city; about to sacrifice in person—the work stopped when the altar was completed.',
    idiomatic: 'On the twenty-ninth day of the fourth month, Tianbao year 10, the Yellow Thearch altar was moved to the kun sector inside the inner city. The emperor meant to sacrifice in person; when the altar stood finished, the rite went no further.',
  },
  s0610: {
    literal: 'In Xuanzong\'s second year of Xiantian, enfeoffed Mount Hua\'s spirit as Golden Heaven King.',
    idiomatic: 'In Xuanzong\'s second year of Xiantian, Mount Hua\'s spirit was enfeoffed as Golden Heaven King.',
  },
  s0611: {
    literal: 'Kaiyuan thirteenth year: enfeoffed Mount Tai\'s spirit as Heavenly Equilibrium King.',
    idiomatic: 'In Kaiyuan year 13, Mount Tai\'s spirit became Heavenly Equilibrium King.',
  },
  s0612: {
    literal: 'Tianbao fifth year: enfeoffed the Central Peak spirit as Central Heaven King, the Southern Peak spirit as Director Heaven King, the Northern Peak spirit as Pacifying Heaven King.',
    idiomatic: 'In Tianbao year 5 the Central Peak became Central Heaven King, the Southern Peak Director Heaven King, the Northern Peak Pacifying Heaven King.',
  },
  s0613: {
    literal: 'Sixth year: the River Spirit was enfeoffed Spirit Source Prince, the Ji Spirit Clear Source Prince, the Yangtze Spirit Broad Source Prince, the Huai Spirit Long Source Prince.',
    idiomatic: 'In year 6 the River Spirit was named Spirit Source Prince, the Ji Clear Source Prince, the Yangtze Broad Source Prince, the Huai Long Source Prince.',
  },
  s0614: {
    literal: 'Tenth year, first month: the four seas were jointly enfeoffed as kings.',
    idiomatic: 'In the first month of year 10 all four seas were enfeoffed as kings.',
  },
  s0615: {
    literal: 'Sent the Imperial University Chancellor, Heir to Prince of Wu Zhi, to sacrifice to Eastern Peak Heavenly Equilibrium King; the Heir Apparent\'s Household Steward, Heir to Prince of Lu Yu, to Southern Peak Director Heaven King; Secretary Director Cui Xiu to Central Peak Central Heaven King; Imperial University Chancellor Ban Jingqian to Western Peak Golden Heaven King; Court of the Imperial Clan Vice Director Li Chengyu to Northern Peak Pacifying Heaven King;',
    idiomatic: 'The Imperial University chancellor and Heir to the Prince of Wu, Zhi, sacrificed to the Eastern Peak, Heavenly Equilibrium King; the heir apparent\'s household steward and Heir to the Prince of Lu, Yu, to the Southern Peak, Director Heaven King; Secretary Director Cui Xiu to the Central Peak, Central Heaven King; Imperial University Chancellor Ban Jingqian to the Western Peak, Golden Heaven King; Court of the Imperial Clan vice director Li Chengyu to the Northern Peak, Pacifying Heaven King;',
  },
  s0616: {
    literal: 'Weiwei Vice Director Li Huan to Yangtze Spirit Broad Source Prince; Jingzhao Vice Prefect Zhang Heng to River Spirit Spirit Source Prince; Heir Apparent Left Remonstrance Instructor Liu Wei to Huai Spirit Long Source Prince; Henan Vice Prefect Dou Lu Hui to Ji Spirit Clear Source Prince;',
    idiomatic: 'Weiwei vice director Li Huan to the Yangtze, Broad Source Prince; Jingzhao vice prefect Zhang Heng to the River, Spirit Source Prince; heir apparent left remonstrance instructor Liu Wei to the Huai, Long Source Prince; Henan vice prefect Dou Lu Hui to the Ji, Clear Source Prince;',
  },
  s0617: {
    literal: 'Heir Apparent Chief of Palace Services, Heir to Prince of Dao Lian, to Mount Yi Eastern Peace Prince; Wu Prefect Zhao Juzhen to Mount Kuaiji Eternal Prosperity Prince; Court of Review Vice Director Li Zhen to Mount Wu Virtue Realized Prince; Ying Prince Mansion Chief Administrator Gan Shoumo to Mount Huo Response Sage Prince; Fanyang Adjutant Bi Kang to Mount Yiwulu Broad Peace Prince;',
    idiomatic: 'Heir apparent chief of palace services and Heir to the Prince of Dao, Lian, to Mount Yi, Eastern Peace Prince; Wu prefect Zhao Juzhen to Mount Kuaiji, Eternal Prosperity Prince; Court of Review vice director Li Zhen to Mount Wu, Virtue Realized Prince; Ying Prince mansion chief administrator Gan Shoumo to Mount Huo, Response Sage Prince; Fanyang adjutant Bi Kang to Mount Yiwulu, Broad Peace Prince;',
  },
  s0618: {
    literal: 'Heir Apparent Middle Attendant Li Sui to Eastern Sea Broad Virtue King; Righteousness Prince Mansion Chief Administrator Zhang Jiuzhang to Southern Sea Broad Benefit King; Heir Apparent Middle Attendant Liu Yi to Western Sea Broad Moisture King; Heir Apparent Palace Groom Li Qirong to Northern Sea Broad Marsh King.',
    idiomatic: 'Heir apparent middle attendant Li Sui to the Eastern Sea, Broad Virtue King; Righteousness Prince mansion chief administrator Zhang Jiuzhang to the Southern Sea, Broad Benefit King; heir apparent middle attendant Liu Yi to the Western Sea, Broad Moisture King; heir apparent palace groom Li Qirong to the Northern Sea, Broad Marsh King.',
  },
  s0619: {
    literal: 'The investiture rite was set for the seventeenth day of the third month at one double-hour.',
    idiomatic: 'Investiture was performed on the seventeenth of the third month at the appointed hour.',
  },
  s0620: {
    literal: 'Xuanzong, having held the throne many years, still favored arts of longevity and ethereal ascent.',
    idiomatic: 'Xuanzong had reigned many years and still courted the arts of longevity and ethereal ascent.',
  },
  s0621: {
    literal: 'In the Grand Unity Hall he set images of perfected immortals; each midnight he rose early, burned incense, and bowed forehead to the ground.',
    idiomatic: 'In the Grand Unity Hall he set images of perfected immortals; each midnight he rose before dawn, burned incense, and bowed his forehead to the floor.',
  },
  s0622: {
    literal: 'Famous mountains throughout the realm were ordered to have Daoist priests and palace eunuchs jointly perform refining rites and sacrifices, succeeding one another along the roads—casting dragon tablets, offering jade, building hermitages, gathering medicinal foods; true formulas and immortal traces multiplied with the years.',
    idiomatic: 'At famous mountains across the realm, Daoist priests and palace eunuchs were ordered to perform refining rites and sacrifices in relays along the roads—casting dragon tablets, offering jade, building hermitages, gathering elixir herbs. True formulas and traces of immortals thickened year by year.',
  },
  s0623: {
    literal: 'Suzong, spring of Zhide second year, at Fengxiang: changed Qianyang prefecture\'s Mount Wu to Western Peak, raising its rank to seek spiritual aid.',
    idiomatic: 'In the spring of Suzong\'s second year of Zhide, at Fengxiang, Qianyang prefecture\'s Mount Wu was renamed the Western Peak and its rank raised to beg spiritual aid.',
  },
  s0624: {
    literal: 'By Shangyuan second year the sacred person was unwell; occultists requested changing Mount Wu to Mount Hua, Mount Hua to Mount Tai, Hua prefecture to Tai prefecture, Huayang county to Taiyin county.',
    idiomatic: 'By Shangyuan year 2 the emperor\'s health had failed; occultists urged that Mount Wu be renamed Mount Hua, Mount Hua Mount Tai, Hua prefecture Tai prefecture, and Huayang county Taiyin county.',
  },
  s0625: {
    literal: 'Baoying first year: restored the former.',
    idiomatic: 'In Baoying year 1 the old names were restored.',
  },
  s0626: {
    literal: 'Wu Zetian, Chang\'an third year: ordered all prefectures under heaven suitably to teach martial arts; each year, on the model of Mingjing presented scholars, to memorialize.',
    idiomatic: 'In Wu Zetian\'s third year of Chang\'an, every prefecture was ordered to teach the martial arts; each year candidates were to be memorialized on the model of Mingjing presented scholars.',
  },
  s0627: {
    literal: 'Kaiyuan nineteenth year: at the two capitals established one Grand Duke Lord Father temple each, with Han\'s Marquis of Liu Zhang Liang as associate spirit.',
    idiomatic: 'In Kaiyuan year 19 one Grand Duke Lord Father temple was established in each capital, with Han\'s Marquis of Liu, Zhang Liang, as associate spirit.',
  },
  s0628: {
    literal: 'Tianbao sixth year: edict that military examination candidates coming to the capital first worship at the Grand Duke temple; appointing generals also reported to the Grand Duke temple.',
    idiomatic: 'In Tianbao year 6 an edict required military examination candidates bound for the capital to worship first at the Grand Duke temple; appointing generals likewise reported there.',
  },
  s0629: {
    literal: 'By Suzong\'s intercalary fourth month of Shangyuan first year, further honored as Martial Accomplishment King; selected eminent generals through the ages as the Ten Sages.',
    idiomatic: 'By the intercalary fourth month of Suzong\'s first year of Shangyuan he was further honored as Martial Accomplishment King, with eminent generals of successive ages chosen as the Ten Sages.',
  },
  s0630: {
    literal: 'Gaozong, Xianqing first year, third month xinsi: Empress Wu performed rites at the Progenitress of Silk.',
    idiomatic: 'On xinsi in the third month of Gaozong\'s first year of Xianqing, Empress Wu performed rites at the Progenitress of Silk.',
  },
  s0631: {
    literal: 'Xuanzong, Xiantian second year, third month xinmao: Empress Wang sacrificed to the Progenitress of Silk.',
    idiomatic: 'On xinmao in the third month of Xuanzong\'s second year of Xiantian, Empress Wang sacrificed to the Progenitress of Silk.',
  },
  s0632: {
    literal: 'Suzong, Qianyuan second year, third month jisi: Empress Zhang sacrificed to the Progenitress of Silk within the park; inner and outer titled ladies gathered silk together.',
    idiomatic: 'On jisi in the third month of Suzong\'s second year of Qianyuan, Empress Zhang sacrificed to the Progenitress within the park, and titled ladies within and without the palace gathered silk together.',
  },
  s0633: {
    literal: 'Old regulations: at great sacrifices, palace suspended and district suspended music played in the court; ascent songs on the hall.',
    idiomatic: 'By old regulation, at great sacrifices palace music and district music sounded in the courtyard while ascent songs rose in the hall.',
  },
  s0634: {
    literal: 'From after recovering the two capitals in Zhide second year, musicians were incomplete and food was scarce; at shrine and temple offerings there remained only ascent songs, without music below the altar or in the courtyard, nor the three dances.',
    idiomatic: 'After the two capitals were recovered in Zhide year 2, musicians were few and food scarce; at shrine and temple offerings only ascent songs remained—no music below the altar or in the courtyard, and no three dances.',
  },
  s0635: {
    literal: 'Old regulations: whenever sacrifice was performed by officials, the Grand Marshal laid the libation vessel and silks, the Minister of Education bowed over the offering tray, the Minister of Works swept; the Grand Marshal made the first offering, the Director of Rites the second, the Director of Imperial Commissary the final.',
    idiomatic: 'By old regulation, when officials performed the sacrifice, the grand marshal set out the libation vessel and silks, the minister of education bowed over the offering tray, the minister of works swept clean; the grand marshal made the first offering, the director of rites the second, the director of the imperial commissariat the last.',
  },
  s0636: {
    literal: 'After Shangyuan, for the Southern Suburbs, Nine Palaces spirit altar, and Imperial Ancestral Temple, all five offices were complete; for the rest the Director of Rites stood in as Minister of Works and the Director of Imperial Commissary as Minister of Education—valuing economy in affairs.',
    idiomatic: 'After Shangyuan the five offices were fully staffed for the Southern Suburbs, the Nine Palaces altar, and the Imperial Ancestral Temple; for other rites the director of rites stood in as minister of works and the director of the imperial commissariat as minister of education—to spare labor.',
  },
  s0637: {
    literal: 'Old regulations: the pitch regulator stood on the east steps, baton in hand to time the music; now there is no pitch-regulator position.',
    idiomatic: 'By old regulation a pitch regulator stood on the east steps, baton in hand to beat time for the music; that post no longer exists.',
  },
  s0638: {
    literal: 'Old regulations: when the Imperial Commissary was about to prepare sacrificial food, the yang fire-striker was aimed at the sun to draw fire—called bright fire.',
    idiomatic: 'By old regulation, when the imperial commissariat prepared sacrificial food, a yang fire-striker was aimed at the sun to draw flame—this was called bright fire.',
  },
  s0639: {
    literal: 'The great victims were all stall-fed at the granary and sacrificial office until plump.',
    idiomatic: 'The great victims were stall-fed at the granary and sacrificial herds office until they grew plump.',
  },
  s0640: {
    literal: 'Before sacrifice their fullness or leanness was inspected—called examining the victims. Suzong, ninth month of Shangyuan second year, changed the era name to Yuan first year, edict: "For the round mound and square moat, per custom retain one great victim.',
    idiomatic: 'Before sacrifice their fullness or leanness was inspected—this was called examining the victims. In the ninth month of Suzong\'s second year of Shangyuan the era name was changed to Yuan year 1, with an edict: "For the round mound and square moat, per custom one great victim shall remain.',
  },
  s0641: {
    literal: 'Imperial temple and various shrines: offer cooked meat when the occasion requires."',
    idiomatic: 'For the imperial temple and other shrines, offer cooked meat as each occasion requires."',
  },
  s0642: {
    literal: 'Now for Supreme Heaven and the Imperial Ancestral Temple, one pen; three sheep and three swine each; other sacrifices all provision according to the affair to complete ritual.',
    idiomatic: 'Now for Supreme Heaven and the Imperial Ancestral Temple there is one pen, with three sheep and three swine; all other sacrifices are provisioned as each affair requires, merely to fulfill ritual.',
  },
  s0643: {
    literal: 'The rites of bright fire and stall-feeding—there is no leisure for them anymore.',
    idiomatic: 'As for the rites of bright fire and stall-feeding, there is no longer time for them.',
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
if (data.metadata.chapter !== '024') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 024; standalone T ready (${Object.keys(T).length} entries).`
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
