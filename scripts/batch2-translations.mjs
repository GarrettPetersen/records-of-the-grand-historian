#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

/** Lunar slow-fast table rows for s0123 */
const lunarRows = [
  { day: 1, du: 14, fen: 13, rate: 'increase 25', ec: 'expansion 2', acc: null, col: 262, diff: null },
  { day: 2, du: 14, fen: 11, rate: 'increase 23', ec: 'expansion', acc: '10,803', col: 3, diff: 258 },
  { day: 3, du: 14, fen: 8, rate: 'increase 20', ec: 'expansion', acc: '36,096', col: 4, diff: 255 },
  { day: 4, du: 14, fen: 4, rate: 'increase 16', ec: 'expansion', acc: '51,136', col: 5, diff: 251 },
  { day: 5, du: 13, fen: 18, rate: 'increase 11', ec: 'expansion', acc: '63,168', col: 5, diff: 246 },
  { day: 6, du: 13, fen: 13, rate: 'increase 6', ec: 'expansion', acc: '71,446', col: 2, diff: 241 },
  { day: 7, du: 13, fen: 7, rate: 'increase', ec: 'expansion', acc: '75,952', col: 5, diff: 235 },
  { day: 8, du: 13, fen: 2, rate: 'decrease 5', ec: 'expansion', acc: '75,952', col: 4, diff: 239 },
  { day: 9, du: 12, fen: 17, rate: 'decrease 9', ec: 'expansion', acc: '72,192', col: 3, diff: 226 },
  { day: 10, du: 12, fen: 14, rate: 'decrease 12', ec: 'expansion', acc: '65,424', col: 3, diff: 223 },
  { day: 11, du: 12, fen: 11, rate: 'decrease 15', ec: 'expansion', acc: '56,400', col: 3, diff: 220 },
  { day: 12, du: 12, fen: 8, rate: 'decrease 18', ec: 'expansion', acc: '45,122', col: 2, diff: 217 },
  { day: 13, du: 12, fen: 6, rate: 'decrease 20', ec: 'expansion', acc: '31,584', col: 2, diff: 215 },
  { day: 14, du: 12, fen: 4, rate: 'decrease 22', ec: 'expansion', acc: '16,544', col: 2, diff: 213 },
  { day: 15, du: 12, fen: 2, rate: 'increase 24', ec: 'contraction 2', acc: null, col: null, diff: 211 },
  { day: 16, du: 12, fen: 4, rate: 'increase 22', ec: 'contraction', acc: '18,048', col: 2, diff: 213 },
  { day: 17, du: 12, fen: 6, rate: 'increase 20', ec: 'contraction', acc: '34,592', col: 3, diff: 215 },
  { day: 18, du: 12, fen: 9, rate: 'increase 17', ec: 'contraction', acc: '49,632', col: 5, diff: 218 },
  { day: 19, du: 12, fen: 14, rate: 'increase 12', ec: 'contraction', acc: '62,416', col: 6, diff: 223 },
  { day: 20, du: 13, fen: 1, rate: 'increase 6', ec: 'contraction', acc: '71,446', col: 2, diff: 229 },
  { day: 21, du: 13, fen: 7, rate: 'increase', ec: 'contraction', acc: '75,952', col: 5, diff: 235 },
  { day: 22, du: 13, fen: 12, rate: 'decrease 5', ec: 'contraction', acc: '75,952', col: 4, diff: 240 },
  { day: 23, du: 13, fen: 16, rate: 'decrease 9', ec: 'contraction', acc: '72,192', col: 4, diff: 244 },
  { day: 24, du: 14, fen: 1, rate: 'decrease 13', ec: 'contraction', acc: '65,424', col: 4, diff: 248 },
  { day: 25, du: 14, fen: 5, rate: 'decrease 17', ec: 'contraction', acc: '55,648', col: 3, diff: 252 },
  { day: 26, du: 14, fen: 8, rate: 'decrease 20', ec: 'contraction', acc: '42,864', col: 3, diff: 255 },
  { day: 27, du: 14, fen: 11, rate: 'decrease 23', ec: 'contraction', acc: '27,824', col: 2, diff: 258 },
  {
    day: 'circuit',
    du: 14,
    fen: 13,
    rate: 'decrease 25',
    ec: 'fixed contraction 10,528',
    acc: 'fixed complete 260',
    col: 'fixed',
    diff: null,
  },
];

function fmtLunarRow(r, style) {
  const label = r.day === 'circuit' ? 'Circuit day' : `Day ${r.day}`;
  const motion = `${r.du} ${style === 'literal' ? 'du' : '°'}${r.fen} ${style === 'literal' ? 'fen' : '′'}`;
  const parts = [label + ':', motion, r.rate, r.ec];
  if (r.acc) parts.push(style === 'literal' ? `${r.ec.includes('fixed') ? '' : 'accumulated '}${r.acc}` : r.acc);
  if (r.col != null) parts.push(style === 'literal' ? `column difference ${r.col}` : `col diff ${r.col}`);
  if (r.diff != null) parts.push(style === 'literal' ? `difference divisor ${r.diff}` : `diff divisor ${r.diff}`);
  return parts.filter(Boolean).join(', ');
}

const lunarLiteralHeader =
  'Lunar motion slow-fast degrees; increase-decrease rates; expansion-contraction accumulated parts; column difference; difference divisor.';
const lunarIdiomaticHeader = 'Lunar slow-fast table:';

const s0123Literal = [
  lunarLiteralHeader,
  ...lunarRows.map((r) => fmtLunarRow(r, 'literal')),
].join(' ');
const s0123Idiomatic = [
  lunarIdiomaticHeader,
  ...lunarRows.map((r) => fmtLunarRow(r, 'idiomatic')),
].join(' ');

/** Solar term table for s0132 */
const qiRows = [
  { qi: 'Rain Water', lodge: 'Room tai-qiang', shadow: '8 chi 2 cun 2 fen', day: '55 fen', night: '49 fen 5 parts' },
  { qi: 'Awakening of Insects', lodge: 'Wall 1 qiang', shadow: '6 chi 7 cun 2 fen', day: '52 fen 9 parts', night: '47 fen 1 part' },
  { qi: 'Spring Equinox', lodge: 'Straddles 7 shao-qiang', shadow: '5 chi 3 cun 9 fen', day: '55 fen 5 parts', night: '44 fen 5 parts' },
  { qi: 'Clear Brightness', lodge: 'Bond 6 ban', shadow: '4 chi 2 cun 5 fen', day: '58', night: '42' },
  { qi: 'Grain Rain', lodge: 'Stomach 9 tai-ruo', shadow: '3 [sun] 2 cun 5 fen', day: '63 fen', night: '39 fen 7 parts' },
  { qi: 'Start of Summer', lodge: 'Hairy Head 11 ruo', shadow: '2 chi 5 cun', day: '62 fen 3 parts', night: '37 fen 7 parts' },
  { qi: 'Lesser Fullness', lodge: 'Net 15 shao-ruo', shadow: '1 chi 9 cun 7 fen', day: '63 fen 9 parts', night: '36 fen 1 part' },
  { qi: 'Grain in Ear', lodge: 'Well 3 ban-ruo', shadow: '1 chi 6 cun 9 fen', day: '64 fen 8 parts', night: '35 fen 2 parts' },
  { qi: 'Summer Solstice', lodge: 'Well 18', shadow: '1 chi 5 cun', day: '65', night: '35' },
  { qi: 'Lesser Heat', lodge: 'Ghost 1 ruo', shadow: '1 chi 6 cun 9 fen', day: '64 fen 8 parts', night: '35 fen 2 parts' },
  { qi: 'Greater Heat', lodge: 'Willow 12 ruo', shadow: '1 chi 9 cun 7 fen', day: '63 fen 9 parts', night: '36 fen 1 part' },
  { qi: 'Start of Autumn', lodge: 'Spread 5 ban-qiang', shadow: '2 chi 5 cun', day: '62 fen 3 parts', night: '37 fen 7 parts' },
  { qi: 'End of Heat', lodge: 'Wings 2 ban', shadow: '3 chi 2 cun 5 fen', day: '63 fen', night: '39 fen 7 parts' },
  { qi: 'White Dew', lodge: 'Wings 17 tai-ruo', shadow: '4 chi 2 cun 5 fen', day: '58', night: '42' },
  { qi: 'Autumn Equinox', lodge: 'Chariot Crossboard 15', shadow: '5 chi 3 cun 9 fen', day: '55 fen 5 parts', night: '44 fen 5 parts' },
  { qi: 'Cold Dew', lodge: 'Gullet 1 shao', shadow: '6 chi 7 cun 2 fen', day: '52 fen 9 parts', night: '47 fen 1 part' },
  { qi: 'Frost Descent', lodge: 'Root 7 ban', shadow: '8 chi 2 cun 8 fen', day: '55 fen', night: '49 fen 5 parts' },
  { qi: 'Start of Winter', lodge: 'Heart 2 ban-ruo', shadow: '9 chi 9 cun 1 fen', day: '48 fen 4 parts', night: '51 fen 6 parts' },
  { qi: 'Lesser Snow', lodge: 'Tail 12 tai-qiang', shadow: '1 zhang 1 chi 3 cun 4 fen', day: '46 fen 7 parts', night: '53 fen 3 parts' },
  { qi: 'Greater Snow', lodge: 'Winnowing Basket 11', shadow: '1 zhang 2 chi 4 cun 8 fen', day: '45 fen 6 parts', night: '54 fen 4 parts' },
  { qi: 'Winter Solstice', lodge: 'Dipper 14 qiang', shadow: '1 zhang 3 chi', day: '45', night: '55' },
  { qi: 'Lesser Cold', lodge: 'Ox 3 ban-qiang', shadow: '1 zhang 2 chi 4 cun 8 fen', day: '45 fen 6 parts', night: '54 fen 4 parts' },
  { qi: 'Greater Cold', lodge: 'Maid 10 ban-qiang', shadow: '1 zhang 1 chi 3 cun 4 fen', day: '46 fen 7 parts', night: '53 fen 3 parts' },
  { qi: 'Start of Spring', lodge: 'Rooftop 4', shadow: '9 chi 9 cun 1 fen', day: '48 fen 4 parts', night: '51 fen 6 parts' },
];

const starRows = [
  { qi: 'Rain Water', dusk: 'Turtle Beak 1 shao-qiang', dawn: 'Tail 11 qiang' },
  { qi: 'Awakening of Insects', dusk: 'Well 9 ban', dawn: 'Winnowing Basket 4 shao-ruo' },
  { qi: 'Spring Equinox', dusk: 'Well 29 ban-qiang', dawn: 'Dipper 4 ruo' },
  { qi: 'Clear Brightness', dusk: 'Willow 12 tai', dawn: 'Dipper 14 ban' },
  { qi: 'Grain Rain', dusk: 'Spread 10', dawn: 'Dipper 25 ban' },
  { qi: 'Start of Summer', dusk: 'Wings 10 tai-ruo', dawn: 'Maid 3 shao' },
  { qi: 'Lesser Fullness', dusk: 'Chariot Crossboard 10 ruo', dawn: 'Encampment 2 ruo' },
  { qi: 'Grain in Ear', dusk: 'Horn 10 tai-ruo', dawn: 'Rooftop 7 ruo' },
  { qi: 'Summer Solstice', dusk: 'Root 5 shao-ruo', dawn: 'Room 5 shao-qiang' },
  { qi: 'Lesser Heat', dusk: 'Chamber 4 tai-ruo', dawn: 'Wall 6 tai-ruo' },
  { qi: 'Greater Heat', dusk: 'Tail 8 tai-ruo', dawn: 'Straddles 12 tai-ruo' },
  { qi: 'Start of Autumn', dusk: 'Winnowing Basket 3', dawn: 'Stomach 2 tai-ruo' },
  { qi: 'End of Heat', dusk: 'Dipper 3 ban', dawn: 'Hairy Head 7 tai-ruo' },
  { qi: 'White Dew', dusk: 'Dipper 14 ban-ruo', dawn: 'Net 16 ban-ruo' },
  { qi: 'Autumn Equinox', dusk: 'Dipper 25 shao-qiang', dawn: 'Well 9 shao-qiang' },
  { qi: 'Cold Dew', dusk: 'Ox 8 ban-qiang', dawn: 'Well 29 ruo' },
  { qi: 'Frost Descent', dusk: 'Maid 11 ban-ruo', dawn: 'Willow 11 ban-qiang' },
  { qi: 'Start of Winter', dusk: 'Rooftop 2 ruo', dawn: 'Spread 8 tai-ruo' },
  { qi: 'Lesser Snow', dusk: 'Rooftop 13 ban-qiang', dawn: 'Wings 8 tai-qiang' },
  { qi: 'Greater Snow', dusk: 'Room 9 ban-qiang', dawn: 'Chariot Crossboard 8 shao-qiang' },
  { qi: 'Winter Solstice', dusk: 'Wall 8 tai-qiang', dawn: 'Horn 7 shao-qiang' },
  { qi: 'Lesser Cold', dusk: 'Straddles 15 shao', dawn: 'Gullet 9' },
  { qi: 'Greater Cold', dusk: 'Stomach 4 ban-qiang', dawn: 'Root 13 tai-qiang' },
  { qi: 'Start of Spring', dusk: 'Hairy Head 9 shao', dawn: 'Heart 4 qiang' },
];

const s0132Literal = [
  'Method for computing the five planets: twenty-four qi; solar lodge on the day; noon gnomon shadow; day clepsydra marks; night clepsydra marks.',
  ...qiRows.map(
    (r) =>
      `${r.qi}: lodge ${r.lodge}; shadow ${r.shadow}; day clepsydra ${r.day}; night clepsydra ${r.night}.`,
  ),
  'Twenty-four qi; dusk culmination star; dawn culmination star.',
  ...starRows.map((r) => `${r.qi}: dusk ${r.dusk}; dawn ${r.dawn}.`),
].join(' ');

const s0132Idiomatic = [
  'Five-planet method — solar term table (solar lodge, noon shadow, day/night clepsydra):',
  ...qiRows.map(
    (r) =>
      `${r.qi}: ${r.lodge}; shadow ${r.shadow}; day ${r.day}; night ${r.night}.`,
  ),
  'Dusk and dawn culmination stars:',
  ...starRows.map((r) => `${r.qi}: dusk ${r.dusk}; dawn ${r.dawn}.`),
].join(' ');

/** @type {Record<string, [string, string]>} */
const T = {
  s0101: [
    'Method for fixing large and small remainders for conjunction and lunar eclipse: multiply the day remainder entered in the calendar by the increase-decrease rate under that calendar entry; entering day one, increase twenty-five is the rule.',
    'To fix syzygy and eclipse instants: multiply the anomalistic day fraction by the tabulated increase-decrease rate—for day 1 the rate is +25.',
  ],
  s0102: [
    'With it increase or decrease the expansion-contraction accumulated parts; where decrease applies, decrease; where increase applies, increase.',
    'Apply the product to the expansion-contraction accumulated column, adding or subtracting according to whether the rate is surplus or deficit.',
  ],
  s0103: ['This becomes the fixed accumulated parts.', 'The result is the corrected integral.'],
  s0104: [
    'Multiply the day remainder entered in the calendar by the column difference; when it fills the day divisor, subtract expansion or add contraction to the difference divisor—this becomes the fixed difference divisor.',
    'Multiply the anomalistic fraction by the column difference; at each full day divisor, adjust the difference divisor by expansion or contraction to obtain the fixed divisor.',
  ],
  s0105: [
    'Divide it into the fixed accumulated parts; what is obtained subtracts from or adds to the original new- or full-moon small remainder; where expansion applies, subtract; where contraction applies, add.',
    'Divide the corrected integral by the fixed difference divisor and apply the quotient to the base fractional day—subtract for expansion, add for contraction.',
  ],
  s0106: ['This becomes the fixed small remainder.', 'This yields the corrected fractional day.'],
  s0107: [
    'If adding fills the day divisor, the conjunction or lunar eclipse advances one day;',
    'A carry past the day divisor moves the syzygy or eclipse one day forward;',
  ],
  s0108: [
    'If subtracting is insufficient, add the day divisor and then subtract—then retreat one day.',
    'If subtraction underflows, borrow one day divisor and step the date back one day.',
  ],
  s0109: [
    'When it falls on a circuit day, use the circuit-day fixed number.',
    'On a circuit-day entry, apply the circuit-day fixed constants instead.',
  ],
  s0110: [
    'Method for pushing the double-hour: multiply the fixed small remainder by twelve; what fills the day divisor obtains one chen; count from zi outward, outside the reckoning—this is the chen where the new- or full-moon hour falls.',
    'To name the hour of syzygy: multiply the corrected fraction by 12, divide by 752 for whole double-hours counted from midnight (zi).',
  ],
  s0111: [
    'If there is remainder, quadruple it; what fills the day divisor gives one shao, two gives ban, three gives tai-ban.',
    'Split any leftover into quarters of the day divisor for the shao, half, and tai-half subdivisions.',
  ],
  s0112: [
    'If again there is remainder, triple it; what fills the day divisor gives one qiang; at half the divisor or above, advance one notch; below half the divisor, discard.',
    'Triple the tail again for the strong step, rounding up at half-divisor and discarding below.',
  ],
  s0113: [
    'Combine qiang with shao to make shao-qiang; combine with ban to make ban-qiang; combine with tai to make tai-qiang.',
    'Add strong units to weak, half, and full subdivisions per the classical clepsydra notation.',
  ],
  s0114: [
    'Obtaining two qiang makes xiao-ruo; combine with shao to make ban-ruo; combine with ban to make tai-ruo; combine with tai to make one chen-ruo.',
    'Two strongs collapse into a weak grade, stepping through the ladder to a full weak double-hour mark.',
  ],
  s0115: ['Name it by the chen where it stands.', 'Read the final label against the named double-hour.'],
  s0116: [
    'Method for pushing full clepsydra marks for the conjunction or lunar-eclipse hour: for each, multiply the fixed small remainder by one hundred clepsydra marks; divide by the day divisor;',
    'To convert syzygy time to clepsydra marks: multiply the corrected fractional day by 100 and divide by 752;',
  ],
  s0117: ['What is not exhausted, multiply by ten to obtain fen.', 'Scale the remainder by ten to recover fractional marks.'],
  s0118: [
    'First remove half the night clepsydra—then the day clepsydra hour marks and fen appear.',
    'Subtract half the night-water total first; the remainder gives the daytime hour and fractional marks.',
  ],
  s0119: ['When the day clepsydra is exhausted, enter the night clepsydra again.', 'After the day-water runs out, continue into the night-water register.'],
  s0120: [
    'Within four days before or after a mid-term node, consult the limit number.',
    'If the date lies within four days of a mid-climate, use the limit number.',
  ],
  s0121: [
    'Five days or more before or after a mid-term node, consult the interval-limit number.',
    'If five or more days from a mid-climate, use the interval-limit number instead.',
  ],
  s0122: [
    'When the lunar-eclipse hour fixed small remainder does not fill the limit or interval number, treat the computed day as the event day.',
    'If the eclipse-time fraction falls below the limit or interval threshold, count the syzygy on the computed calendar day.',
  ],
  s0123: [s0123Literal, s0123Idiomatic],
  s0124: [
    'Small parts one hundred three; decrease two hundred twenty-four; ninety-three thousand four hundred eight; increase; difference divisor two thousand',
    'Table continuation: small parts 103; deficit rate 224; accumulated surplus 93,408; excess; difference divisor 2,000',
  ],
  s0125: [
    'three hundred nine',
    '309 (completing difference divisor 2,309).',
  ],
  s0126: [
    'Method for pushing conjunction longitude: multiply the new-moon small remainder by rule years; what fills the communication divisor becomes large fractional parts; what does not exhaust is small fractional parts.',
    'To find syzygy longitude: multiply the conjunction fractional day by 19; divide by 47 for large fractional parts and keep the remainder as small fractional parts.',
  ],
  s0127: [
    'Add the large fractional parts to the new-moon midnight daily degree parts; when parts fill the degree divisor, carry into du; count the du as before—the longitude where sun and moon conjoin at the first-month new moon.',
    'Add the large parts to the midnight solar position on new-moon day, carrying at 304 parts per du—the result is the first-month conjunction longitude.',
  ],
  s0128: [
    'To seek the next month, add twenty-nine du, large parts one hundred sixty-one, and small parts fourteen; when small parts fill the communication divisor, carry into large parts; when large parts fill the degree divisor, carry into du.',
    'Each month add 29 du, 161 large parts, and 14 small parts, carrying through the communication and degree divisors.',
  ],
  s0129: ['Passing through Room, remove the lodge fractional parts.', 'When crossing the Room lodge, subtract its fractional correction.'],
  s0130: [
    'To seek full moon, add fourteen du, large parts two hundred thirty-two, and small parts thirty and a half.',
    'For full moon, add 14 du, 232 large parts, and 30½ small parts.',
  ],
  s0131: [
    'To seek the du where the full moon stands, add to the daily du one hundred eighty-two du, parts one hundred eighty-nine, and small parts twenty-three and a half.',
    'For the full-moon position, add 182 du, 189 parts, and 23½ small parts to the solar longitude.',
  ],
  s0132: [s0132Literal, s0132Idiomatic],
  s0133: ['Method for computing the five planets:', 'Procedure for the five planets:'],
  s0134: [
    'Conjunction years, conjunction count, daily-degree divisor, lodge fractional parts: Wood—344, 315, 95,762, 23,625; Fire—459, 215, 65,361, 16,125; Earth—383, 371, 112,482, 77,750; Metal—267, 167, 50,768, 12,525; Water—79, 249, 75,696, 18,675.',
    'Planetary cycle constants (conjunction years / conjunction count / daily-degree divisor / lodge fractional parts): Wood 344 / 315 / 95,762 / 23,625; Fire 459 / 215 / 65,361 / 16,125; Earth 383 / 371 / 112,482 / 77,750; Metal 267 / 167 / 50,768 / 12,525; Water 79 / 249 / 75,696 / 18,675.',
  ],
  s0135: [
    'Fire later origin: yihai; Yuanjia year 12 to Yuanjia year 20 guiwei—nine years, outside the count.',
    'Fire\'s later origin (yihai): from Yuanjia 12 to Yuanjia 20 (guiwei) is 9 years—exclusive of the count.',
  ],
  s0136: [
    'Earth later origin: jiaxu; Yuanjia year 11 to Yuanjia year 20 guiwei—ten years, outside the count.',
    'Earth\'s later origin (jiaxu): from Yuanjia 11 to Yuanjia 20 (guiwei) is 10 years—exclusive of the count.',
  ],
  s0137: [
    'Metal later origin: jiashen; Jin Taiyuan year 9 to Yuanjia year 20 guiwei—sixty years, outside the count.',
    'Metal\'s later origin (jiashen): from Jin Taiyuan 9 to Yuanjia 20 (guiwei) is 60 years—exclusive of the count.',
  ],
  s0138: [
    'Water later origin: yichou; Yuanjia year 2 to Yuanjia year 20 guiwei—nineteen years, outside the count.',
    'Water\'s later origin (yichou): from Yuanjia 2 to Yuanjia 20 (guiwei) is 19 years—exclusive of the count.',
  ],
  s0139: [
    'Method for computing the five planets: for each, set its era origin to the year sought, outside the count; multiply by the conjunction count; what fills conjunction years is accumulated conjunction; what does not exhaust is called conjunction remainder; if it fills the conjunction count more than once, divide by the conjunction count—obtaining one means the star conjoined the prior year, two means the year before that; if it does not fill the conjunction count, conjunction falls in the current year.',
    'For each planet, count from its era origin to the target year, multiply by the conjunction count, and divide by conjunction years; the quotient is accumulated conjunctions, the remainder the conjunction surplus—one full cycle back means last year\'s conjunction, two means the year before, otherwise the current year.',
  ],
  s0140: [
    'Wood, Earth, and Metal may conjoin in the prior year; Fire may conjoin in the year before that; Water may have three or four conjunctions in one year.',
    'Wood, Earth, and Metal can conjoin in the previous year; Fire may conjoin two years back; Water can have three or four conjunctions in a single year.',
  ],
  s0141: [
    'Subtract the conjunction remainder from the conjunction count for degree parts; for Water, when degree parts fill conjunction years, remove them.',
    'Degree parts equal the conjunction count minus the conjunction remainder; for Water, reduce modulo conjunction years.',
  ],
  s0142: [
    'Multiply degree parts by the circuit heaven 111,035; what fills the daily-degree divisor becomes accumulated du; what does not exhaust is called degree remainder.',
    'Multiply the degree parts by 111,035, divide by the daily-degree divisor for whole du, and keep the residue as degree remainder.',
  ],
  s0143: [
    'Count du from Room 2 outward, outside the reckoning—this is the du where the star conjoins.',
    'Name the conjunction longitude from Room 2—exclusive of the count.',
  ],
  s0144: [
    'Multiply the conjunction count by the year count; include the Rain Water small remainder; add the degree remainder for the day remainder; when it fills the daily-degree divisor, carry into accumulated du for the day; count from Rain Water outward, outside the reckoning—this is the star-conjunction day.',
    'Multiply years by the conjunction count, add Rain Water\'s fractional day and the degree remainder, carry into whole days, and name the date from Rain Water.',
  ],
  s0145: [
    'Method for finding the star-appearance day: use the occultation days and remainder from the method—for Wood it is sixteen days and remainder, and for Metal likewise.',
    'To find first visibility: take the tabulated occultation days and remainder—Wood uses 16 days (Metal likewise).',
  ],
  s0146: [
    'Add to the star-conjunction day and remainder; when it fills the daily-degree divisor, form one day; count as before—this is the star-appearance day.',
    'Add the occultation interval to the conjunction date, carrying at the daily-degree divisor, to obtain the appearance day.',
  ],
  s0147: [
    'Method for finding the star-appearance du: use the occultation du and remainder from the method—for Wood it is two du and remainder, likewise.',
    'For appearance longitude: add the tabulated occultation arc—for Wood, 2 du plus remainder.',
  ],
  s0148: [
    'Add to the star-conjunction du and remainder; when it fills the daily-degree divisor, form one du; count as before—this is the du where it appears.',
    'Add the occultation arc to the conjunction longitude, carrying at the daily-degree divisor, to obtain the appearance position.',
  ],
  s0149: [
    'Use the star-motion divisor—for Wood it is twenty-three at appearance.',
    'Take the star-motion denominator—Wood uses 23 from first appearance onward.',
  ],
  s0150: [
    'Multiply the appearance-degree remainder; when it fills the daily-degree divisor, obtain one fen; then daily add the motion fen.',
    'Scale the appearance remainder by the motion rate: each time it fills the daily-degree divisor, advance one fen of daily motion.',
  ],
  s0151: ['Wood: in direct motion, daily motion four fen.', 'Wood: direct motion at 4 fen per day.'],
  s0152: [
    'When fen fill the divisor, form one du; direct and retrograde divisors differ—for Wood the retrograde divisor is seven.',
    'Carry at the motion divisor to whole du; direct and retrograde phases use different divisors—Wood retrograde uses 7.',
  ],
  s0153: [
    'Each should multiply the degree remainder; during stationary phases continue the prior value; in retrograde subtract; during occultation do not record du; passing Room remove fen; if insufficient to subtract, break a whole du.',
    'Apply the motion increment to the degree remainder; hold position through stations, subtract in retrograde, omit degrees while hidden, subtract Room lodge parts, and borrow a whole du when needed.',
  ],
  s0154: [
    'The five planets\' lodge fractional parts each differ; if in motion parts, each removes them according to its lodge fractional parts.',
    'Each planet has its own lodge fractional correction—apply the appropriate reduction whenever motion parts cross a lodge boundary.',
  ],
  s0155: [
    'Wood: at first conjunction with the sun, occultation sixteen days, day remainder 41,780, motion two du, degree remainder 77,847½; morning appearance in the east.',
    'Wood: after initial conjunction it is hidden 16 days (day remainder 41,780), moves 2 du (remainder 77,847½), then appears in the east at dawn.',
  ],
  s0156: ['Distance from the sun thirteen du and a half qiang.', 'It stands 13½ du strong from the sun.'],
  s0157: [
    'Direct motion: daily motion four parts of twenty-three; in one hundred fifteen days it moves twenty du.',
    'Direct: 4/23 du per day, 20 du in 115 days.',
  ],
  s0158: ['Stationary—no motion—for twenty-six days, then retrograde.', 'It stations 26 days, then turns retrograde.'],
  s0159: ['Daily motion one part of seven; in eighty-four days it retreats twelve du.', 'Retrograde: 1/7 du per day, 12 du in 84 days.'],
  s0160: ['Again stationary twenty-six days.', 'It stations another 26 days.'],
  s0161: [
    'Direct motion: in one hundred fifteen days it moves twenty du; evening hiding in the west; solar degree remainder as at first; conjunction with the sun.',
    'Direct again for 115 days and 20 du, then hides at dusk in the west and rejoins the sun with the original remainder.',
  ],
  s0162: [
    'One cycle: three hundred ninety-eight days, day remainder 83,560; planetary motion thirty-three du, degree remainder 59,935.',
    'One synodic cycle: 398 days (remainder 83,560), heliocentric motion 33 du (remainder 59,935).',
  ],
  s0163: [
    'Fire: at first conjunction with the sun, occultation seventy-one days, day remainder 24,812½, motion fifty-four du, degree remainder 49,430; morning appearance in the east.',
    'Fire: hidden 71 days (remainder 24,812½), moves 54 du (remainder 49,430), then appears at dawn in the east.',
  ],
  s0164: ['Distance from the sun seventeen du and a half qiang.', 'It stands 17½ du strong from the sun.'],
  s0165: [
    'Direct, fast: daily motion five parts of seven; in one hundred eight days and a half it moves seventy-seven du and a half.',
    'Direct and fast: 5/7 du per day, 77½ du in 108½ days.',
  ],
  s0166: [
    'Slightly slow: daily motion four parts of seven; in one hundred twenty-six days it moves seventy-two du, then becomes fast again.',
    'Slightly slow: 4/7 du per day for 126 days (72 du), then speeds up again.',
  ],
  s0167: ['Daily motion two parts of seven; in forty-two days it moves twelve du.', 'Fast phase: 2/7 du per day, 12 du in 42 days.'],
  s0168: ['Stationary—no motion—for twelve days, then slow.', 'It stations 12 days, then slows.'],
  s0169: ['Daily motion three parts of ten; in sixty days it retreats eighteen du.', 'Retrograde: 3/10 du per day, 18 du in 60 days.'],
  s0170: ['Again stationary twelve days.', 'It stations another 12 days.'],
  s0171: ['Direct, slow: in forty-two days it moves twelve du.', 'Direct and slow: 12 du in 42 days.'],
  s0172: ['Slightly fast: in one hundred twenty-six days it moves seventy-two du.', 'Slightly fast: 72 du in 126 days.'],
  s0173: [
    'In one hundred eight days and a half it moves seventy-seven du and a half; evening hiding in the west; solar degree remainder as at first; conjunction with the sun.',
    '108½ days and 77½ du of direct motion, then dusk occultation and solar re-conjunction with the original remainder.',
  ],
  s0174: [
    'One cycle: seven hundred seventy-nine days, day remainder 49,625; planetary motion four hundred fourteen du, degree remainder 33,500.',
    'One synodic cycle: 779 days (remainder 49,625), heliocentric motion 414 du (remainder 33,500).',
  ],
  s0175: [
    'Remove one circuit; fixed motion forty-nine du, degree remainder 17,375.',
    'After subtracting one full circuit, the net motion is 49 du (remainder 17,375).',
  ],
  s0176: [
    'Earth: at first conjunction with the sun, occultation eighteen days, day remainder 4,482½, motion two du, degree remainder 46,847½; morning appearance in the east.',
    'Earth: hidden 18 days (remainder 4,482½), moves 2 du (remainder 46,847½), then appears at dawn in the east.',
  ],
  s0177: [
    'Distance from the sun fifteen du and a half qiang; direct motion: daily motion one part of twelve; in eighty-four days it moves seven du.',
    '15½ du strong from the sun; direct at 1/12 du per day, 7 du in 84 days.',
  ],
  s0178: ['Stationary—no motion—for thirty-six days, then retrograde.', 'It stations 36 days, then turns retrograde.'],
  s0179: ['Daily motion one part of seventeen; in one hundred two days it retreats six du.', 'Retrograde: 1/17 du per day, 6 du in 102 days.'],
  s0180: ['Again stationary thirty-six days.', 'It stations another 36 days.'],
  s0181: [
    'Direct motion: in eighty-four days it moves seven du; evening hiding in the west; solar degree remainder as at first; conjunction with the sun.',
    'Direct again for 84 days and 7 du, then dusk occultation and solar re-conjunction.',
  ],
  s0182: [
    'One cycle: three hundred seventy-eight days, day remainder 8,965; planetary motion twelve du, degree remainder 93,695.',
    'One synodic cycle: 378 days (remainder 8,965), heliocentric motion 12 du (remainder 93,695).',
  ],
  s0183: [
    'Metal: at first conjunction with the sun, occultation forty-one days, day remainder 49,684½, motion fifty-one du, degree remainder 49,684½; appearance in the west.',
    'Metal: hidden 41 days (remainder 49,684½), moves 51 du (same remainder), then appears in the west.',
  ],
  s0184: ['Distance from the sun ten du.', 'It stands 10 du from the sun.'],
  s0185: [
    'Direct, fast: daily motion three parts of thirteen in one du; in ninety-one days it moves one hundred twelve du, then becomes slightly slow.',
    'Evening star, direct and fast: 1 du 3/13 per day, 112 du in 91 days, then slightly slow.',
  ],
  s0186: [
    'Daily motion two parts of thirteen in one du; in ninety-one days it moves one hundred five du.',
    'Slightly slow: 1 du 2/13 per day, 105 du in 91 days.',
  ],
  s0187: ['Then becomes very slow again.', 'Then very slow again.'],
  s0188: ['Daily motion eleven parts of fifteen; in forty-five days it moves thirty-three du.', 'Very slow: 11/15 du per day, 33 du in 45 days.'],
  s0189: ['Stationary—no motion—for eight days, then slow.', 'It stations 8 days, then slows.'],
  s0190: ['Daily motion two parts of three; in nine days it retreats six du; occultation in the west.', 'Retrograde: 2/3 du per day, 6 du in 9 days, then hides in the west.'],
  s0191: ['Occultation six days; retreats four du and conjunction with the sun.', 'Hidden 6 days, retreating 4 du to rejoin the sun.'],
  s0192: ['Again six days, retreat four du; morning appearance in the east.', 'After another 6 days and 4 du of retreat, it appears at dawn in the east.'],
  s0193: ['Retrograde: in nine days retreats six du.', 'Morning star retrograde: 6 du in 9 days.'],
  s0194: ['Again stationary eight days.', 'It stations another 8 days.'],
  s0195: ['Direct motion: in forty-five days moves thirty-three du.', 'Direct: 33 du in 45 days.'],
  s0196: ['Slightly fast: in ninety-one days moves one hundred five du.', 'Slightly fast: 105 du in 91 days.'],
  s0197: [
    'Very fast: in ninety-one days moves one hundred twelve du; morning occultation in the east; solar degree remainder as at first; conjunction with the sun.',
    'Very fast: 112 du in 91 days, then dawn occultation and solar re-conjunction with the original remainder.',
  ],
  s0198: ['One cycle: five hundred eighty-three days, day remainder 48,601.', 'One synodic cycle: 583 days (remainder 48,601).'],
  s0199: [
    'Remove one circuit; fixed planetary motion two hundred eighteen du, degree remainder 36,076.',
    'After subtracting one full circuit, net heliocentric motion is 218 du (remainder 36,076).',
  ],
  s0200: [
    'One conjunction: two hundred ninety-one days, remainder 49,684½; planetary motion likewise.',
    'One inferior conjunction: 291 days (remainder 49,684½) with matching arc motion.',
  ],
};

let updated = 0;
let missing = [];
for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    updated++;
  } else {
    missing.push(s.id);
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));

const empty = data.sentences.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
console.log(`Updated ${updated} sentences`);
console.log(`Missing map entries: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`Empty literal/idiomatic remaining: ${empty.length}`);
if (empty.length) {
  console.error(empty.map((s) => s.id).join(', '));
  process.exit(1);
}
