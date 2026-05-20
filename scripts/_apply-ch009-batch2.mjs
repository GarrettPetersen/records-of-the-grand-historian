#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Suishu ch.009 — Sui capping, empress/consort investiture, marriage rites) */
import { readFileSync, writeFileSync } from 'fs';

const dataPath = 'data/suishu/009.json';
const transPath = 'translations/current_translation_suishu.json';
const START = 101;
const END = 200;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    let blockSentences = [];
    if (block.type === 'paragraph') blockSentences = block.sentences || [];
    else if (block.type === 'table_row')
      blockSentences = (block.cells || []).filter((c) => c.content?.trim());
    else if (block.type === 'table_header')
      blockSentences = (block.sentences || []).filter((s) => s.zh?.trim());
    for (const s of blockSentences) {
      const id = s.id;
      const chinese = s.zh || s.content;
      if (chinese?.trim()) out.set(id, { chinese, blockIndex });
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
    if (block.type === 'paragraph') blockSentences = block.sentences || [];
    else if (block.type === 'table_row')
      blockSentences = (block.cells || []).filter((c) => c.content?.trim());
    else if (block.type === 'table_header')
      blockSentences = (block.sentences || []).filter((s) => s.zh?.trim());
    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;
      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') chineseText = sentence.zh;
      else if (block.type === 'table_row') chineseText = sentence.content;
      let displayId = sentenceId;
      if (seenIds.has(displayId)) displayId = `${sentenceId}@${blockIndex}`;
      seenIds.add(displayId);
      out.push({ id: displayId, originalId: sentenceId, blockIndex, chinese: chineseText, literal: '', idiomatic: '' });
    }
  }
  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const T = {
  s0101: {
    literal: 'When the Sui crown prince was about to be capped, on the day before the emperor fasted in the Daxing Hall.',
    idiomatic: 'When the Sui crown prince was to be capped, the day before the emperor fasted in the Daxing Hall.',
  },
  s0102: {
    literal: 'The crown prince, the guest and assistant, and attendant officials all fasted in the principal chamber.',
    idiomatic: 'The crown prince, the guest and assistant of the rite, and attendant officials all fasted in the principal chamber.',
  },
  s0103: {
    literal: 'At daybreak on the day, the relevant office reported to the temple; each set a mat on the eastern steps.',
    idiomatic: 'At daybreak the relevant office reported to the temple, and a mat was set on the eastern steps for each.',
  },
  s0104: {
    literal: 'The emperor in dragon robe and crown entered to bow, then took the imperial seat.',
    idiomatic: 'The emperor, in dragon robe and crown, entered to bow and then took the imperial seat.',
  },
  s0105: {
    literal: 'The guest bowed and led the crown prince forward; he ascended the mat and sat facing west.',
    idiomatic: 'Bowing, the guest and led the crown prince forward; he ascended the mat and sat facing west.',
  },
  s0106: {
    literal: 'The assistant of the cap sat to comb and set the hairnet.',
    idiomatic: 'The assistant of the cap sat to comb his hair and set the hairnet.',
  },
  s0107: {
    literal: 'When the guest had finished washing, he stepped forward and placed the black cloth cap.',
    idiomatic: 'After washing, the guest stepped forward and placed the black cloth cap.',
  },
  s0108: {
    literal: 'The assistant of the cap stepped forward to set the forehead band and tassel.',
    idiomatic: 'The cap assistant stepped forward to set the forehead band and tassel.',
  },
  s0109: {
    literal: 'The guest bowed and led the crown prince to the eastern gallery; he came out in dark upper garment and plain lower skirt.',
    idiomatic: 'The guest bowed and led the crown prince to the eastern gallery; he emerged in dark upper garment and plain lower skirt.',
  },
  s0110: {
    literal: 'The assistant of the cap again sat to comb; the guest stepped forward and placed the far-wandering cap.',
    idiomatic: 'The cap assistant again sat to comb; the guest stepped forward and placed the far-wandering cap.',
  },
  s0111: {
    literal: 'When the change of dress was complete, the guest again received the crown.',
    idiomatic: 'Once the change of dress was complete, the guest again received the crown.',
  },
  s0112: {
    literal: 'The crown prince went to the eastern gallery, changed clothes, and came out.',
    idiomatic: 'The crown prince then went to the eastern gallery, changed clothes, and came out.',
  },
  s0113: {
    literal: 'The guest bowed and led the crown prince to stand facing south; the guest stepped forward to receive the ceremonial wine, came before the mat, and stood facing north to invoke.',
    idiomatic: 'Bowing, the guest and led the crown prince to stand facing south; the guest stepped forward to receive the ceremonial wine, came before the mat, and stood facing north to invoke.',
  },
  s0114: {
    literal: 'The crown prince bowed to receive the cup.',
    idiomatic: 'Bowing, the crown prince to receive the cup.',
  },
  s0115: {
    literal: 'The guest returned to his place and answered the bow facing east.',
    idiomatic: 'The guest returned to his place and returned the bow facing east.',
  },
  s0116: {
    literal: 'The assistant of the cap presented the food before the mat; the crown prince offered the libation.',
    idiomatic: 'The assistant of the cap presented the food before the mat, and the crown prince offered the libation.',
  },
  s0117: {
    literal: 'When the rite was complete, he descended from the mat, advanced, and bowed east of the throne.',
    idiomatic: 'With the rite complete, he descended from the mat, advanced, and bowed east of the throne.',
  },
  s0118: {
    literal: 'The Chief Counselor received the edict, proceeded to admonish the crown prince, and when finished the crown prince bowed.',
    idiomatic: 'Receiving the edict, the Chief Counselor the edict, proceeded to admonish the crown prince, and when finished the crown prince bowed.',
  },
  s0119: {
    literal: 'The assistant of the cap led the crown prince down the western steps.',
    idiomatic: 'The cap assistant led the crown prince down the western steps.',
  },
  s0120: {
    literal: 'The guest stepped forward slightly and bestowed the style name.',
    idiomatic: 'Stepping forward slightly, the guest and bestowed the style name.',
  },
  s0121: {
    literal: 'The assistant of the cap led the crown prince forward to stand in the courtyard facing east.',
    idiomatic: 'The cap assistant led the crown prince forward to stand in the courtyard facing east.',
  },
  s0122: {
    literal: 'When the relatives had finished bowing, the assistant of the cap bowed; the crown prince returned each bow.',
    idiomatic: 'When the relatives had finished bowing, the assistant of the cap bowed, and the crown prince returned each bow.',
  },
  s0123: {
    literal: 'He and the guest and assistant all returned to their places.',
    idiomatic: 'He, the guest and assistant all returned to their places.',
  },
  s0124: {
    literal: 'The Chief Counselor received the edict and descended, ordering the relevant office to present gifts.',
    idiomatic: 'Receiving the edict, the Chief Counselor the edict and descended, ordering the relevant office to present gifts.',
  },
  s0125: {
    literal: 'The guest and assistant bowed again.',
    idiomatic: 'The guest and assistant bowed again, as prescribed.',
  },
  s0126: {
    literal: 'The emperor descended and returned to the eastern steps and bowed; the crown prince and those below all bowed.',
    idiomatic: 'The emperor descended to the eastern steps and bowed; the crown prince and those below all bowed.',
  },
  s0127: {
    literal: 'The emperor withdrew, changed clothes, and returned to the palace.',
    idiomatic: 'Withdrawing, the emperor, changed clothes, and returned to the palace.',
  },
  s0128: {
    literal: 'The crown prince followed to the gate, then entered to see the empress, bowed, and returned.',
    idiomatic: 'Following to the gate, the crown prince to the gate, then entered to see the empress, bowed, and returned.',
  },
  s0129: {
    literal: 'The Later Qi rite for the emperor taking an empress: after initial gift, name inquiry, and betrothal gifts were complete, the Round Mound, Square Pond, and temple were notified as at the capping rite; on that day the emperor came to the front hall and ordered the Grand Commandant as envoy, with the Minister of Education as deputy.',
    idiomatic: 'In the Later Qi rite for the emperor taking an empress, after the initial gift, name inquiry, and betrothal gifts were complete, the Round Mound, Square Pond, and temple were notified as at the capping rite. That day the emperor came to the front hall and ordered the Grand Commandant as envoy, with the Minister of Education as deputy.',
  },
  s0130: {
    literal: 'Bearing the staff of authority he proceeded to the empress\'s traveling palace, faced east, presented the seal, cord, and bound scroll, and handed them to the palace attendant.',
    idiomatic: 'Staff in hand, he of authority he proceeded to the empress\'s traveling palace, faced east, presented the seal, cord, and bound scroll, and handed them to the palace attendant.',
  },
  s0131: {
    literal: 'The empress received the bound scroll in the traveling hall.',
    idiomatic: 'In the traveling hall, the empress received the bound scroll in the traveling hall.',
  },
  s0132: {
    literal: 'The envoy withdrew; he and the dukes and officials below all bowed.',
    idiomatic: 'The envoy withdrew, and he and the dukes and officials below all bowed.',
  },
  s0133: {
    literal: 'The relevant office prepared the welcoming rite.',
    idiomatic: 'Officials prepared the welcoming rite.',
  },
  s0134: {
    literal: 'The Grand Mentor and Grand Commandant received the edict and set out.',
    idiomatic: 'Grand Mentor and Grand Commandant and Grand Commandant received the edict and set out.',
  },
  s0135: {
    literal: 'The host in mourning dress welcomed and bowed at the gate.',
    idiomatic: 'In mourning dress, the host dress welcomed and bowed at the gate.',
  },
  s0136: {
    literal: 'The envoy entered and ascended by the guest steps, facing east.',
    idiomatic: 'Entering, the envoy and ascended by the guest steps, facing east.',
  },
  s0137: {
    literal: 'The host ascended by the host steps, facing west.',
    idiomatic: 'The host then ascended by the host steps, facing west.',
  },
  s0138: {
    literal: 'The gifts were displayed in the courtyard.',
    idiomatic: 'Gifts were displayed in the courtyard.',
  },
  s0139: {
    literal: 'A mat was set between the two pillars; a youth ascended with the seal and written tablet; the host knelt to receive.',
    idiomatic: 'A mat was set between the two pillars; a youth ascended with the seal and written tablet, and the host knelt to receive.',
  },
  s0140: {
    literal: 'Seeing off the envoy, he bowed outside the great gate.',
    idiomatic: 'To see off the envoy, he bowed outside the great gate.',
  },
  s0141: {
    literal: 'The relevant office had already supplied the pavilion between the two pillars of Zhaoyang Hall with the implements for the shared-mat rite.',
    idiomatic: 'The relevant office had already supplied the pavilion between the two pillars of Zhaoyang Hall with the implements for the shared-mat rite, as prescribed.',
  },
  s0142: {
    literal: 'The empress wore the great formal embroidered robe, belt, cord, and pendants, with the veil added.',
    idiomatic: 'The empress wore the great formal embroidered robe with belt, cord, and pendants, and added the veil.',
  },
  s0143: {
    literal: 'The senior lady attendant led her out and helped her ascend the painted four-view carriage.',
    idiomatic: 'A senior lady attendant led her out and helped her ascend the painted four-view carriage.',
  },
  s0144: {
    literal: 'The female attendant-in-ordinary bore the seal and accompanied her in the carriage.',
    idiomatic: 'A female attendant-in-ordinary bore the seal and accompanied her in the carriage.',
  },
  s0145: {
    literal: 'The guard of honor was as for the great procession.',
    idiomatic: 'The guard of honor matched that of the great imperial procession.',
  },
  s0146: {
    literal: 'The emperor in dragon robe and crown came out and ascended the imperial seat.',
    idiomatic: 'In dragon robe and crown, the emperor robe and crown came out and ascended the imperial seat.',
  },
  s0147: {
    literal: 'When the empress entered the gate, the great guard of honor halted outside the gate; the lesser guard of honor entered.',
    idiomatic: 'When the empress entered the gate, the great guard of honor halted outside; the lesser guard of honor entered.',
  },
  s0148: {
    literal: 'Arriving at the Eastern Upper Pavilion, a screen was set; she descended from the carriage, and a mat path was laid to enter Zhaoyang Hall.',
    idiomatic: 'Arriving at the Eastern Upper Pavilion, a screen was set; she descended from the carriage, and a mat path was laid for her to enter Zhaoyang Hall.',
  },
  s0149: {
    literal: 'Advancing to the seat, the matron removed the veil; the empress bowed first then rose, the emperor bowed after then rose first.',
    idiomatic: 'On advancing to the seat, the matron removed the veil; the empress bowed first then rose, the emperor bowed after then rose first.',
  },
  s0150: {
    literal: 'The emperor ascended the western steps, proceeded to the shared-mat seat, and sat together with the empress.',
    idiomatic: 'Ascending the western steps, the emperor the western steps, proceeded to the shared-mat seat, and sat together with the empress.',
  },
  s0151: {
    literal: 'Each finished three servings of rice; each also rinsed with two cups and one gourd.',
    idiomatic: 'They each finished three servings of rice; each also rinsed with two cups and one gourd.',
  },
  s0152: {
    literal: 'When the music for the completed rite was played, the empress rose and stood facing south.',
    idiomatic: 'At the music for the completed rite was played, the empress rose and stood facing south.',
  },
  s0153: {
    literal: 'The emperor proceeded to the Taichi Hall; the princes and dukes below bowed; the emperor rose and entered.',
    idiomatic: 'Proceeding to the Taichi Hall, the emperor to the Taichi Hall; the princes and dukes below bowed; the emperor rose and entered.',
  },
  s0154: {
    literal: 'The next day the empress in court dress bowed and submitted a memorial of thanks in Zhaoyang Hall.',
    idiomatic: 'On the following day the empress in court dress bowed and submitted a memorial of thanks in Zhaoyang Hall.',
  },
  s0155: {
    literal: 'On another day she presented hazelnuts, chestnuts, dates, and dried meat to the Empress Dowager in Zhaoyang Hall.',
    idiomatic: 'Another day she presented hazelnuts, chestnuts, dates, and dried meat to the Empress Dowager in Zhaoyang Hall.',
  },
  s0156: {
    literal: 'On a chosen day the assembled officials presented congratulatory gifts.',
    idiomatic: 'On a selected day the assembled officials presented congratulatory gifts.',
  },
  s0157: {
    literal: 'On another chosen day she visited the temple.',
    idiomatic: 'On another chosen day she visited the ancestral temple.',
  },
  s0158: {
    literal: 'The emperor dispatched the Grand Commandant first to report with a single ox at the temple, and afterward to visit all the temples in turn.',
    idiomatic: 'The emperor sent the Grand Commandant first to report with a single ox at the temple, and afterward to visit all the temples in turn.',
  },
  s0159: {
    literal: 'For the crown prince taking a consort, the emperor dispatched an envoy for the initial gift; the relevant office prepared the gifts.',
    idiomatic: 'When the crown prince took a consort, the emperor dispatched an envoy for the initial gift; the relevant office prepared the gifts.',
  },
  s0160: {
    literal: 'When the banquet was complete, the envoy received the edict and set out.',
    idiomatic: 'After the banquet was complete, the envoy received the edict and set out.',
  },
  s0161: {
    literal: 'The host welcomed outside the great gate.',
    idiomatic: 'The host welcomed the envoy outside the great gate.',
  },
  s0162: {
    literal: 'When the rite was complete, they met in the reception hall.',
    idiomatic: 'When the rite was complete, they met in the reception hall, as prescribed.',
  },
  s0163: {
    literal: 'Next came name inquiry and acceptance of auspicious omens, both as at the initial gift.',
    idiomatic: 'Next came name inquiry and acceptance of auspicious omens, both following the initial-gift rite.',
  },
  s0164: {
    literal: 'For betrothal gifts, the Minister of Education and Minister of Works served as envoys, with full gifts, and set out.',
    idiomatic: 'For betrothal gifts, the Minister of Education and Minister of Works served as envoys, bearing full gifts, and set out.',
  },
  s0165: {
    literal: 'For setting the date, the Director of the Grand Temple and Director of the Imperial Clan served as envoys, as at the initial gift.',
    idiomatic: 'Setting the date, the Director of the Grand Temple and Director of the Imperial Clan served as envoys, as at the initial gift.',
  },
  s0166: {
    literal: 'For the personal welcome, the Grand Commandant served as envoy.',
    idiomatic: 'The personal welcome, the Grand Commandant served as envoy.',
  },
  s0167: {
    literal: 'On the third day the consort attended upon the emperor in Zhaoyang Hall, and upon the empress in Xuangguang Hall.',
    idiomatic: 'On the third day the consort attended upon the emperor in Zhaoyang Hall and upon the empress in Xuangguang Hall.',
  },
  s0168: {
    literal: 'On a chosen day the assembled officials presented congratulatory gifts.',
    idiomatic: 'On a selected day the assembled officials presented congratulatory gifts.',
  },
  s0169: {
    literal: 'On another day the consort returned.',
    idiomatic: 'Another day the consort returned.',
  },
  s0170: {
    literal: 'On yet another day the crown prince paid court at the gate.',
    idiomatic: 'Still another day the crown prince paid court at the gate.',
  },
  s0171: {
    literal: 'For the Sui crown prince taking a consort, the emperor came to the front hall; the envoy received the edict and set out.',
    idiomatic: 'In the Sui crown prince taking a consort, the emperor came to the front hall; the envoy received the edict and set out.',
  },
  s0172: {
    literal: 'The host waited at the temple.',
    idiomatic: 'The host waited at the temple at the temple.',
  },
  s0173: {
    literal: 'The envoy held the geese; the host welcomed and bowed east of the great gate.',
    idiomatic: 'Holding the geese, the envoy the geese; the host welcomed and bowed east of the great gate.',
  },
  s0174: {
    literal: 'The envoy entered, ascended the western steps, and stood between the pillars facing south.',
    idiomatic: 'Entering, the envoy, ascended the western steps, and stood between the pillars facing south.',
  },
  s0175: {
    literal: 'When the initial gift was complete, the name inquiry rite was then performed.',
    idiomatic: 'Once the initial gift was complete, the name inquiry rite was then performed.',
  },
  s0176: {
    literal: 'When the rite was complete, the host requested to present gifts to the attendants.',
    idiomatic: 'When the rite was complete, the host requested to present gifts to the attendants, as prescribed.',
  },
  s0177: {
    literal: 'The gifts included silks and horses.',
    idiomatic: 'Gifts included silks and horses.',
  },
  s0178: {
    literal: 'Next, on a chosen day, auspicious omens were accepted, as at the initial gift.',
    idiomatic: 'On a chosen day next, auspicious omens were accepted, as at the initial gift.',
  },
  s0179: {
    literal: 'On another chosen day, jade silks and horses were sent as betrothal gifts.',
    idiomatic: 'Another chosen day brought jade silks and horses were sent as betrothal gifts.',
  },
  s0180: {
    literal: 'On another chosen day the date was announced.',
    idiomatic: 'On another chosen day the wedding date was announced.',
  },
  s0181: {
    literal: 'On another chosen day the relevant office was ordered to report to the temple with a special sacrifice and invest the consort.',
    idiomatic: 'Another chosen day the relevant office was ordered to report to the temple with a special sacrifice and invest the consort.',
  },
  s0182: {
    literal: 'When the crown prince was about to welcome her in person, the emperor came to the front hall, offered the parting cup, and admonished him: "Go to meet your partner, uphold our ancestral rites, and lead with reverence."',
    idiomatic: 'As the crown prince was about to welcome her in person, the emperor came to the front hall, offered the parting cup, and admonished him: "Go to meet your partner, uphold our ancestral rites, and lead with reverence."',
  },
  s0183: {
    literal: 'He replied: "I respectfully accept the edict."',
    idiomatic: 'The crown prince replied: "I respectfully accept the edict."',
  },
  s0184: {
    literal: 'Having received the mandate, he set out with guard of honor.',
    idiomatic: 'With the mandate received the mandate, he set out with guard of honor.',
  },
  s0185: {
    literal: 'The host set the offering table at the temple; the consort wore the yu-di robe and stood in the eastern chamber.',
    idiomatic: 'At the temple the host set the offering table at the temple; the consort wore the yu-di robe and stood in the eastern chamber.',
  },
  s0186: {
    literal: 'The host welcomed outside the gate and bowed facing west.',
    idiomatic: 'Outside the great gate, the host welcomed outside the gate and bowed facing west.',
  },
  s0187: {
    literal: 'The crown prince returned the bow.',
    idiomatic: 'The crown prince returned the bow, as prescribed.',
  },
  s0188: {
    literal: 'The host bowed and led the crown prince to enter first; the host ascended and stood on the host steps facing west.',
    idiomatic: 'The host bowed and led the crown prince to enter first; the host ascended and stood on the host steps facing west, as prescribed.',
  },
  s0189: {
    literal: 'The crown prince ascended and advanced; before the chamber door he faced north, knelt to set down the geese, bowed prostrate, rose, bowed, and descended to withdraw.',
    idiomatic: 'The crown prince ascended and advanced; before the chamber door he faced north, knelt to set down the geese, bowed prostrate, rose, bowed, and descended to withdraw, as prescribed.',
  },
  s0190: {
    literal: 'The consort\'s father stepped forward slightly and admonished her facing west.',
    idiomatic: 'The consort\'s father stepped forward slightly and admonished her facing west, as prescribed.',
  },
  s0191: {
    literal: 'The mother on the western steps placed the collar cord and sash; at the inner gate she placed the purse and applied the sash.',
    idiomatic: 'On the western steps the mother the western steps placed the collar cord and sash; at the inner gate she placed the purse and applied the sash.',
  },
  s0192: {
    literal: 'Going out the gate, the consort ascended the carriage, supported by the armrest.',
    idiomatic: 'At the gate going out the gate, the consort ascended the carriage, supported by the armrest.',
  },
  s0193: {
    literal: 'The matron added the veil.',
    idiomatic: 'The matron then added the veil.',
  },
  s0194: {
    literal: 'The crown prince then took the reins; the carriage wheel turned three times, and the driver took over.',
    idiomatic: 'Then the crown prince took the reins; the carriage wheel turned three times, and the driver took over.',
  },
  s0195: {
    literal: 'The crown prince went out the great gate, rode the carriage, and with guard of honor returned to the palace.',
    idiomatic: 'The crown prince then went out the great gate, rode the carriage, and with guard of honor returned to the palace.',
  },
  s0196: {
    literal: 'On the third day, at cockcrow she rose early to attend court.',
    idiomatic: 'At cockcrow on the third day she rose early to attend court.',
  },
  s0197: {
    literal: 'She presented dried meat to the emperor; the emperor touched it.',
    idiomatic: 'She presented dried meat to the emperor, and the emperor touched it.',
  },
  s0198: {
    literal: 'She also presented dried meat to the empress; the empress touched it.',
    idiomatic: 'She also presented dried meat to the empress, and the empress touched it.',
  },
  s0199: {
    literal: 'A mat was set between the door and window; the consort stood west of the mat, offered the libation, and withdrew.',
    idiomatic: 'They set a mat between the door and window; the consort stood west of the mat, offered the libation, and withdrew.',
  },
  s0200: {
    literal: 'The Later Qi betrothal rite: first, initial gift; second, name inquiry; third, acceptance of auspicious omens; fourth, betrothal gifts; fifth, setting the date; sixth, personal welcome.',
    idiomatic: 'The Later Qi betrothal rite had six stages: initial gift, name inquiry, acceptance of auspicious omens, betrothal gifts, setting the date, and personal welcome.',
  },
};

const source = loadSentencesFromData();
const expectedIds = new Set(
  [...source.keys()].filter((id) => {
    const n = parseInt(id.slice(1), 10);
    return n >= START && n <= END;
  })
);

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '009') {
  console.log(`Session is chapter ${data.metadata.chapter}, not 009`);
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
if (![...expectedIds].every((id) => sessionIds.has(id))) {
  for (const row of extractRange(dataPath, START, END)) {
    if (!sessionIds.has(row.originalId)) {
      data.sentences.push(row);
      sessionIds.add(row.originalId);
    }
  }
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src?.chinese) row.chinese = src.chinese;
}

let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) throw new Error(`${key}: literal and idiomatic must differ`);
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) throw new Error(`Missing: ${missing.join(', ')}`);
if (applied !== Object.keys(T).length) throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} translations (s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')})`);
