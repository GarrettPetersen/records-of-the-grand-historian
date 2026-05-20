#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.022, Bright Hall treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/022.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
    literal: 'Your subject\'s foolish sincerity also hopes Your Majesty will weigh fullness and spareness and set its abbreviated text, and cannot decline out of modesty thereby drowning the great canon. The passage concluded."',
    idiomatic: 'I hope Your Majesty will trim the text and not decline modesty into delay of the great rite. The quote ended.',
  },
  s0102: {
    literal: 'Soon afterward, because of affairs in Liaohai, there was no leisure to plan construction.',
    idiomatic: 'Liaohai affairs left no time to build.',
  },
  s0103: {
    literal: 'On the second day of the seventh month of the second year of Yonghui, an edict said: "The High Mystery secretly assists, lofty and without speech;',
    idiomatic: 'Yonghui 2.7.2—edict: "High Mystery assists in silence;',
  },
  s0104: {
    literal: 'the imperial king grasps the image, replacing divine achievement to order things.',
    idiomatic: 'the king grasps the image, ordering things in Heaven\'s stead.',
  },
  s0105: {
    literal: 'Thus one knows the five essences descend virtue and respond to the emperor\'s honor;',
    idiomatic: 'five essences descend virtue to the emperor;',
  },
  s0106: {
    literal: 'the nine chambers hang text, used to record the work of residing in Heaven.',
    idiomatic: 'nine chambers record the work of dwelling in Heaven.',
  },
  s0107: {
    literal: 'Moreover Harmonious Palace and Spirit Storehouse created great models in high antiquity;',
    idiomatic: 'Harmonious Palace and Spirit Storehouse set high antiquity\'s models;',
  },
  s0108: {
    literal: 'Grand Chamber and Zongzhang marked flourishing patterns in the middle age.',
    idiomatic: 'Grand Chamber and Zongzhang marked the middle age.',
  },
  s0109: {
    literal: 'Though substance and text differed in form and extravagance and thrift differed in time, yet establishing the center of Heaven and making the human pole, distributing governance and teaching—their return is one measure.',
    idiomatic: 'Forms differed, thrift and splendor shifted—yet center of Heaven, human pole, and teaching were one aim.',
  },
  s0110: {
    literal: 'We have succeeded to martial achievement and greatly inherited the upper blaze, thinking how to answer the favor of the upper spirit and reverently follow filial offering—yet the ritual palace lacks rites and the Bright Hall sleeps in structure.',
    idiomatic: 'We inherited martial glory yet the ritual palace lacks rites and the Bright Hall stands unfinished.',
  },
  s0111: {
    literal: 'Now the state\'s four quarters are without care, men are harmonious and years abundant—establishing pattern and bequeathing instruction, now is the time.',
    idiomatic: 'The realm is calm and harvest full—now is the time to set pattern.',
  },
  s0112: {
    literal: 'It is fitting to order the relevant offices together with ritual officials and academicians to examine precedents, deliberate gain and loss in detail, and with all effort follow canonical ritual to establish the Bright Hall.',
    idiomatic: 'Let offices and Ru scholars examine precedents, weigh gain and loss, and build the Bright Hall by canonical ritual.',
  },
  s0113: {
    literal: 'May a text missing through the ages find expression on this day;',
    idiomatic: 'May ages\' missing text find voice today;',
  },
  s0114: {
    literal: 'following the heart to display reverence, forever bequeathed to later generations.',
    idiomatic: 'heartfelt reverence bequeathed to posterity.',
  },
  s0115: {
    literal: 'As for the Bright Hall\'s regulations, order the various department ministers and left and right assistant ministers and vice ministers, the Minister of Rites, Palace Library officials, and Hongwen Pavilion academicians jointly to deliberate in detail.',
    idiomatic: 'Bright Hall rules: ministers, vice ministers, Rites, Palace Library, and Hongwen scholars shall deliberate together.',
  },
  s0116: {
    literal: 'The passage concluded."',
    idiomatic: 'The quote ended.',
  },
  s0117: {
    literal: 'Thereupon Palace Scholar of the Minister of Rites Liu Xuan still followed Zheng Xuan\'s meaning, holding that the Bright Hall\'s form should have five chambers.',
    idiomatic: 'Rites scholar Liu Xuan held Zheng Xuan\'s five chambers.',
  },
  s0118: {
    literal: 'Inner Rectifier Assistant Kong Zhiyue followed the Elder Dai Rites and Lu Zhi, Cai Yong, and others, holding nine chambers.',
    idiomatic: 'Inner Rectifier Kong Zhiyue, following Elder Dai, Lu Zhi, and Cai Yong, held nine chambers.',
  },
  s0119: {
    literal: 'Friend to the Prince of Cao Zhao Cihao, Secretariat Gentleman Xue Wensi, and others each made Bright Hall diagrams.',
    idiomatic: 'Zhao Cihao, Xue Wensi, and others each drew Bright Hall plans.',
  },
  s0120: {
    literal: 'The Confucians disputed, each differing.',
    idiomatic: 'Ru scholars clashed.',
  },
  s0121: {
    literal: 'At first the emperor took the nine-chamber proposal as right and ordered the relevant offices to fix in detail the form and measures and the Imperial Academy gates and towers.',
    idiomatic: 'The emperor first favored nine chambers and ordered form, gates, and towers fixed.',
  },
  s0122: {
    literal: 'In the sixth month of the following year, a nine-chamber model was issued from within, and again the relevant offices were ordered to increase or decrease it.',
    idiomatic: 'Next year, sixth month: an inner nine-chamber model was issued for revision.',
  },
  s0123: {
    literal: 'The relevant offices memorialized:',
    idiomatic: 'Offices reported:',
  },
  s0124: {
    literal: 'Inner model: the hall foundation triple-tiered, each foundation twelve steps per tier.',
    idiomatic: 'Inner model: triple foundation, twelve steps per tier.',
  },
  s0125: {
    literal: 'Upper foundation square nine zhi, eight corners, one foot high.',
    idiomatic: 'Upper tier: nine zhi square, eight corners, one foot high.',
  },
  s0126: {
    literal: 'Middle foundation square three hundred feet, one bench high.',
    idiomatic: 'Middle tier: three hundred feet square, one bench high.',
  },
  s0127: {
    literal: 'Lower foundation square three hundred sixty feet, one zhang two feet high.',
    idiomatic: 'Lower tier: three hundred sixty feet square, one zhang two feet high.',
  },
  s0128: {
    literal: 'The upper foundation images the yellow jade tube, made eight-cornered; on four sides twelve steps were set.',
    idiomatic: 'Upper tier images the yellow tube, eight-cornered, twelve steps on four sides.',
  },
  s0129: {
    literal: 'We ask to take the inner model as fixed.',
    idiomatic: 'We ask to fix the inner model.',
  },
  s0130: {
    literal: 'For foundation height we still ask to follow Zhou regulation of nine feet high; its square altogether to follow the Secretariat standard of one hundred forty-eight feet.',
    idiomatic: 'Height should follow Zhou\'s nine feet; square, the Secretariat standard of one hundred forty-eight feet.',
  },
  s0131: {
    literal: 'Middle and lower foundations—we hope both unused.',
    idiomatic: 'Middle and lower tiers should be dropped.',
  },
  s0132: {
    literal: 'Also inner model: each chamber square three benches, opening four doors and eight windows.',
    idiomatic: 'Inner model: each chamber three benches square, four doors and eight windows.',
  },
  s0133: {
    literal: 'The roof\'s round beam diameter two hundred ninety-one feet.',
    idiomatic: 'Round roof-beam diameter: two hundred ninety-one feet.',
  },
  s0134: {
    literal: 'According to the autumn great offering to the Five Emperors, each in one chamber—deliberation finds it inconvenient; we ask to follow the two Han autumn joint offering, gathering all in the Grand Chamber.',
    idiomatic: 'Autumn offering to the Five Emperors in separate chambers is awkward—we follow two Han practice: one joint rite in the Grand Chamber.',
  },
  s0135: {
    literal: 'If it is sacrifice to welcome the qi of the four seasons, then each in its directional chamber.',
    idiomatic: 'Seasonal qi rites stay in their directional chambers.',
  },
  s0136: {
    literal: 'As for arranging the nine chambers, increasing and decreasing Bright Hall precedent—three and three layered.',
    idiomatic: 'Nine chambers should revise precedent in threes, layered three by three.',
  },
  s0137: {
    literal: 'The Grand Chamber in the center, square six zhang.',
    idiomatic: 'Grand Chamber center: six zhang square.',
  },
  s0138: {
    literal: 'The four corner chambers are called left and right rooms, each square two zhang four feet.',
    idiomatic: 'Four corners: left and right rooms, each two zhang four feet square.',
  },
  s0139: {
    literal: 'Facing the Grand Chamber on four sides, Qingyang, Bright Hall, Zongzhang, Xuantang, and other chambers, each six zhang long to correspond to the Grand Chamber;',
    idiomatic: 'On four sides of the Grand Chamber: Qingyang, Bright Hall, Zongzhang, Xuantang—each six zhang long to match the center;',
  },
  s0140: {
    literal: 'two zhang four feet wide to correspond to the left and right rooms.',
    idiomatic: 'two zhang four feet wide to match the corner rooms.',
  },
  s0141: {
    literal: 'Between chambers all connecting lanes, each one zhang eight feet wide.',
    idiomatic: 'Connecting lanes between chambers, each one zhang eight feet wide.',
  },
  s0142: {
    literal: 'The nine chambers and lanes together on the hall, total square one hundred forty-four feet, matching Kun\'s counting rods.',
    idiomatic: 'Nine chambers and lanes atop the hall: one hundred forty-four feet square—Kun\'s number.',
  },
  s0143: {
    literal: 'Round roof-beam, balustrade, and eaves—or not yet approved.',
    idiomatic: 'Round beam, balustrade, and eaves remain unsettled.',
  },
  s0144: {
    literal: 'We ask to follow Zheng Xuan, Lu Zhi, and others, taking the front beam as the beam; its diameter two hundred sixteen feet, matching Qian\'s counting rods.',
    idiomatic: 'Per Zheng Xuan and Lu Zhi: front beam as main beam, diameter two hundred sixteen feet—Qian\'s number.',
  },
  s0145: {
    literal: 'Round pillars projecting beside the nine chambers at the four corners, each seven feet, matching Heaven\'s reckoning by seven.',
    idiomatic: 'Round pillars at the four corners, seven feet each—Heaven\'s seven.',
  },
  s0146: {
    literal: 'Outside the pillars, remaining foundation—section making Secretariat standard; on each face separately one zhang one foot remaining.',
    idiomatic: 'Beyond the pillars, each face leaves one zhang one foot by Secretariat measure.',
  },
  s0147: {
    literal: 'Inner model: each chamber separately four doors and eight windows—checked against antiquity, the same; we ask to fix by this.',
    idiomatic: 'Inner model\'s four doors and eight windows match antiquity—we fix them.',
  },
  s0148: {
    literal: 'The doors, following antiquity, are set outside but not opened.',
    idiomatic: 'Doors, per antiquity, are set outside but not opened.',
  },
  s0149: {
    literal: 'Inner model: outside thirty-six pillars, ten beams per pillar.',
    idiomatic: 'Inner model: thirty-six outer pillars, ten beams each.',
  },
  s0150: {
    literal: 'Inside seven bays; from pillar root up to beam three zhang, from beam up to roof ridge rising, total height eight zhang one foot.',
    idiomatic: 'Seven inner bays; pillar to beam three zhang; beam to ridge—total eight zhang one foot.',
  },
  s0151: {
    literal: 'Round above and square below, flying eaves matching compass—we ask to fix by the inner model.',
    idiomatic: 'Round above, square below, flying eaves on compass—we fix the inner model.',
  },
  s0152: {
    literal: 'As for the roof-cover form, still we hope to follow the Record of Crafts and change to four slopes, and according to ritual add double eaves, following the Grand Temple in setting owl-tail ornaments.',
    idiomatic: 'Roof form: follow Crafts for four slopes, double eaves, and Grand Temple owl-tails.',
  },
  s0153: {
    literal: 'The hall\'s four directions in five colors—we ask to follow the Zhou Rites\' white fill as convenient.',
    idiomatic: 'Four directions, five colors—we follow Zhou white fill.',
  },
  s0154: {
    literal: 'Each direction follows its directional color.',
    idiomatic: 'Each direction takes its color.',
  },
  s0155: {
    literal: 'We ask to set four enclosing walls and four gates.',
    idiomatic: 'We ask four walls and four gates.',
  },
  s0156: {
    literal: 'Imperial Academy: according to the Elder Dai Rites and former-age sayings, the Imperial Academy often lacks numbers for water breadth and inner diameter.',
    idiomatic: 'Imperial Academy: Elder Dai and older sources often omit water breadth and inner diameter.',
  },
  s0157: {
    literal: 'Cai Yong said: "The water twenty-four zhang broad, encircling on the outside." The passage concluded."',
    idiomatic: 'Cai Yong: "water twenty-four zhang wide, encircling outside." The quote ended.',
  },
  s0158: {
    literal: 'The Chart of the Three Metropolises says "water broad on four sides," not differing from Cai Yong, and again says "outside the water a circular embankment."',
    idiomatic: 'Three Metropolises Chart: "water on four sides," like Cai Yong, with a circular embankment outside.',
  },
  s0159: {
    literal: 'Also Zhang Heng\'s Rhapsody on the Eastern Capital says \'making boats into a bridge.\'',
    idiomatic: 'Zhang Heng\'s Eastern Capital rhapsody speaks of boats as a bridge.',
  },
  s0160: {
    literal: 'The Record of Rites "Positions in the Bright Hall" and the Yin-Yang Record say: "The water turns left to image Heaven."',
    idiomatic: 'Rites "Bright Hall Positions" and Yin-Yang Record: "water turns left to mirror Heaven."',
  },
  s0161: {
    literal: 'The passage concluded." Deliberation finds water twenty-four zhang perhaps too broad; now we ask to reduce to twenty-four paces, measuring the perimeter outside the wall as sufficient.',
    idiomatic: 'The quote ended. Twenty-four zhang may be too wide—we reduce to twenty-four paces, perimeter measured outside the wall.',
  },
  s0162: {
    literal: 'Still following precedent to make boats into a bridge; outside, encircle with a round embankment, and take the Yin-Yang system\'s \'water moves, turning left.\'',
    idiomatic: 'Keep the boat-bridge precedent, round embankment outside, and left-turning water per Yin-Yang.',
  },
  s0163: {
    literal: 'Hall wall: according to the Chart of the Three Metropolises, the hall wall on four sides square within the water, high enough not to block the sun; the hall gate seventy-two paces from the hall.',
    idiomatic: 'Hall wall per Three Metropolises Chart: square within the water, low enough for sun; hall gate seventy-two paces off.',
  },
  s0164: {
    literal: 'Compared with present practice for array and setting, it still seems narrow and small.',
    idiomatic: 'Present array practice still seems cramped.',
  },
  s0165: {
    literal: 'For the square wall\'s four gates\' distance in paces from the hall, we ask to follow the Grand Temple south gate\'s distance from the temple foundation as regulation.',
    idiomatic: 'Gate distances should follow Grand Temple south-gate spacing.',
  },
  s0166: {
    literal: 'Still establish four gates and eight towers; following the Grand Temple, on each gate side set three gates, install dark lattices, and at the four corners make triple-tier Wei towers.',
    idiomatic: 'Four gates, eight towers; three gates each like Grand Temple, dark lattices, triple Wei towers at corners.',
  },
  s0167: {
    literal: 'After this the Confucians disputed competitively, each clinging to a different opinion.',
    idiomatic: 'Ru scholars then disputed, each clinging to his view.',
  },
  s0168: {
    literal: 'Left Vice Director of the Department of State Affairs Yu Zhining and others asked for nine chambers; Palace Scholar of the Minister of Rites Tang and others asked for five chambers.',
    idiomatic: 'Yu Zhining urged nine chambers; Tang of the Minister of Rites urged five.',
  },
  s0169: {
    literal: 'Gaozong ordered both proposals set up in Guande Hall for the emperor personally to view with the dukes and ministers.',
    idiomatic: 'Gaozong had both models set in Guande Hall for the emperor and ministers to view.',
  },
  s0170: {
    literal: 'The emperor said: "Bright Hall ritual exists from antiquity."',
    idiomatic: 'The emperor said: "Bright Hall rites are ancient."',
  },
  s0171: {
    literal: 'Deliberators differed, and construction was not accomplished.',
    idiomatic: 'Debates differed; nothing was built.',
  },
  s0172: {
    literal: 'Now setting up the two proposals—which do you, lords, find fitting?',
    idiomatic: 'Now two models are shown—which suits you?',
  },
  s0173: {
    literal: 'The passage concluded." Minister of Works Yan Lide replied: "The two proposals differ, each with canonical precedent."',
    idiomatic: 'The quote ended. Minister of Works Yan Lide said: "Both have precedent."',
  },
  s0174: {
    literal: 'Nine chambers seem dim; five chambers seem bright.',
    idiomatic: 'Nine chambers seem dim; five seem bright.',
  },
  s0175: {
    literal: 'What is fitting to take or discard rests in the sacred deliberation.',
    idiomatic: 'The choice rests with Your Majesty.',
  },
  s0176: {
    literal: 'The passage concluded." The emperor took five chambers as convenient, yet deliberation was again unsettled, and thereby it was for the time stopped.',
    idiomatic: 'The quote ended. The emperor favored five chambers, debate stalled again, and work paused.',
  },
  s0177: {
    literal: 'By the second month of the second year of Qianfeng, the detailed plan was roughly settled, and an edict was issued:',
    idiomatic: 'Qianfeng 2.2: the plan was roughly set and an edict issued:',
  },
  s0178: {
    literal: 'We, meager and slight, humbly inherit the great succession, uphold the two sages\' entrusted instruction, soothe the hundred millions at first assuming rule, hold rotten wood in fearful care, and push the ditch in thought.',
    idiomatic: 'We are slight, inheriting the great line, holding the two sages\' charge, soothing the millions, fearful on rotten wood, mindful of the ditch.',
  },
  s0179: {
    literal: 'Yet the High Mystery bestows protection; the altars of the ancestral temple send blessing; years are abundant and seasons harmonious, men numerous and custom rich.',
    idiomatic: 'Heaven protects; the altars bless; harvests are full and customs rich.',
  },
  s0180: {
    literal: 'Carriage and writing are unified; culture and tracks are greatly alike.',
    idiomatic: 'Carriage script is one; culture and law align.',
  },
  s0181: {
    literal: 'Inspecting jade and sealing gold, ascending the center and announcing shan, the hundred barbarians present tribute, ten thousand states come to court, court and wilds alike rejoice, Chinese and foreigners all pleased.',
    idiomatic: 'Jade inspected, gold sealed, fengshan announced—barbarians tribute, states at court, all rejoice.',
  },
  s0182: {
    literal: 'Yet for suburban and temple solemn matching, the Grand Chamber is not settled; distributing governance and implementing teaching still lacks the Harmonious Palace.',
    idiomatic: 'Yet suburban matching lacks the Grand Chamber; government and teaching lack the Harmonious Palace.',
  },
  s0183: {
    literal: 'We therefore from sun tilting forget fatigue, at midnight cease sleep, discuss tomb classics and weave together the many sayings, gather the essence of the three ages and probe the utmost profundity of the nine sovereigns, weigh former records, and fashion the Bright Hall.',
    idiomatic: 'So we toil past sunset, study classics, weave debate, gather three ages\' essence, and design the Bright Hall.',
  },
  s0184: {
    literal: 'Though the rules of beams and compass for square and round draw on old facts;',
    idiomatic: 'Beam and compass rules draw on old facts;',
  },
  s0185: {
    literal: 'the method of measuring benches and setting offerings alone applies financial completion.',
    idiomatic: 'bench and offering measures are our own invention.',
  },
  s0186: {
    literal: 'Announce within and without, broadly examine and deliberate in detail, seek strengths and weaknesses, hoping to broaden divergent hearing.',
    idiomatic: 'We announce it widely for debate, seeking strengths and broader hearing.',
  },
  s0187: {
    literal: 'Yet great-born eminent Ru all called it perfect; gentry and scholars all memorialized thorough mastery.',
    idiomatic: 'Great scholars called it perfect; gentry said it was thorough.',
  },
  s0188: {
    literal: 'Creating this great model—we ourselves make antiquity.',
    idiomatic: 'This great model—we make our own antiquity.',
  },
  s0189: {
    literal: 'Following the heart already displayed, feeling and ritual obtained extension; speaking forever of ancestral sacrifice, truly deep grateful relief.',
    idiomatic: 'Heart shown, ritual restored; ancestral rites deeply comfort us.',
  },
  s0190: {
    literal: 'It is fitting to order the relevant offices timely to commence work, with all effort following the mean, matching our intent.',
    idiomatic: 'Let offices build at once, following the mean as we intend.',
  },
  s0191: {
    literal: 'The passage concluded." Thereupon a great amnesty was proclaimed for all under Heaven, the era name changed to Zongzhang, and from Wannian was set apart Bright Hall County.',
    idiomatic: 'The quote ended. A great amnesty followed, the era became Zongzhang, and Bright Hall County was split from Wannian.',
  },
  s0192: {
    literal: 'In the third month of the following year, the regulations of breadth and narrowness were again fully set, and an edict was issued:',
    idiomatic: 'Next year, third month: dimensions were fixed again by edict:',
  },
  s0193: {
    literal: 'The Harmonious Palace hears the new moon, opening the flourishing pattern of Yellow Xuan;',
    idiomatic: 'Harmonious Palace at new moon opens Yellow Xuan\'s pattern;',
  },
  s0194: {
    literal: 'the Spirit Storehouse communicates harmony, spreading the emperor\'s merit and bright transformation.',
    idiomatic: 'the Spirit Storehouse harmonizes, spreading imperial merit.',
  },
  s0195: {
    literal: 'The Yin people\'s Yang Lodge prepared green jade tablets for ritual;',
    idiomatic: 'Yin\'s Yang Lodge set green jade for ritual;',
  },
  s0196: {
    literal: 'the Ji clan\'s Xuantang combined red tablets in offering.',
    idiomatic: 'Zhou\'s Xuantang offered red tablets.',
  },
  s0197: {
    literal: 'Though fortune differed like black horse and white horse, times changed substance and ornament, yet establishing the center of Heaven and building the imperial pole, tracking things and teaching—their return is one measure.',
    idiomatic: 'Fortunes and forms changed, yet Heaven\'s center, the imperial pole, and teaching were one.',
  },
  s0198: {
    literal: 'Examining the chart on the Wen, barely surviving was Gongyu\'s ceremony;',
    idiomatic: 'Wen River charts barely preserve Gongyu\'s rite;',
  },
  s0199: {
    literal: 'measuring the chamber and jade pacing, only the Zhongyuan system was recorded.',
    idiomatic: 'chamber and jade measures record only Zhongyuan.',
  },
  s0200: {
    literal: 'It happened that the fiery essence fell from its chariot, the wise palace destroyed its pipes; the four seas sank in a boiling cauldron, the nine lands fell into a mud plain.',
    idiomatic: 'The Han fiery essence fell, the wise palace\'s pipes were ruined; seas boiled, lands sank to mud.',
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
if (data.metadata.chapter !== '022') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 022; standalone T ready (${Object.keys(T).length} entries).`
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
