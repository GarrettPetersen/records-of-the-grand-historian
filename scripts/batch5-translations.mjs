#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const chapterFile = 'data/songshu/013.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

/** Ensure batch-5 sentence rows exist in the working translation file. */
const existing = new Set(data.sentences.map((s) => s.id));
const sourceById = new Map();
chapter.content.forEach((block, blockIndex) => {
  for (const s of block.sentences || []) {
    const n = Number.parseInt(s.id.slice(1), 10);
    if (n >= 401 && n <= 500) {
      sourceById.set(s.id, { chinese: s.zh, blockIndex });
    }
  }
});

for (const id of [...sourceById.keys()].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))) {
  if (!existing.has(id)) {
    const src = sourceById.get(id);
    data.sentences.push({
      id,
      originalId: id,
      blockIndex: src.blockIndex,
      chinese: src.chinese,
      literal: '',
      idiomatic: '',
    });
  }
}

/** @type {Record<string, [string, string]>} */
const T = {
  s0401: ['Deficit fifteen.', 'Day 12: deficit 15.'],
  s0402: ['Forty-one.', 'Combined number: 41.'],
  s0403: ['Day thirteen.', 'Day 13.'],
  s0404: ['Deficit sixteen.', 'Day 13: deficit 16.'],
  s0405: ['Twenty-six.', 'Combined number: 26.'],
  s0406: ['Day fourteen.', 'Day 14.'],
  s0407: ['Deficit sixteen.', 'Day 14: deficit 16.'],
  s0408: [
    'Method for pushing entry into the yin-yang calendar: set the communication dividend; remove the conjunction circuit; what does not fill conjunction number 358,888½ is the new-moon entry into the yang-calendar fraction; when full remove it—for entry into the yin-calendar fraction.',
    'To enter the yin-yang table: take the communication dividend, reduce modulo the conjunction circuit (717,777); a remainder under the conjunction number (358,888½) is the yang fraction—otherwise subtract and take the yin fraction.',
  ],
  s0409: [
    'Each, what fills the communication divisor gives one day; what is not exhausted is day remainder; name the day outside the count—that is the calendar-entry day at midnight on the month-11 new moon.',
    'Divide each fraction by the communication divisor (26,377) for whole days; name the day count (exclusive)—this is the yin-yang index at month-11 new-moon midnight.',
  ],
  s0410: [
    'To seek the next month, add two days for a long month and one day for a short month; the day remainder is always 20,779.',
    'For the following month add 2 days (long) or 1 day (short), each with day remainder 20,779.',
  ],
  s0411: [
    'When the calendar fills thirteen days and day remainder 15,987½, remove it.',
    'At the 13-day cycle limit, clear day remainder 15,987½ and roll the table forward.',
  ],
  s0412: [
    'When yang ends, enter yin; when yin ends, enter yang.',
    'At yang cycle end, flip to yin—and vice versa.',
  ],
  s0413: ['To seek the next day, add one day.', 'For the following day, add 1 day.'],
  s0414: [
    'To seek new-moon and full-moon difference: multiply the new-moon small remainder by 2,029; what fills 303 becomes day remainder; what is not exhausted, double it for small fraction—that is the new-moon difference number.',
    'For the syzygy offset: multiply the new-moon fractional day by 2,029, divide by 303 for the day remainder, double the residue for small parts—that yields the new-moon difference index.',
  ],
  s0415: [
    'Add fourteen days, day remainder 20,186, small fraction 125; when small fraction fills 606 carry into day remainder; when day remainder fills the communication divisor form days—that is the full-moon difference number.',
    'For full moon add 14 days, remainder 20,186, and small fraction 125, carrying at 606 and the communication divisor—that gives the full-moon difference index.',
  ],
  s0416: [
    'Add again—that is the next month\'s new moon.',
    'Repeat the same addition for the following month\'s new moon.',
  ],
  s0417: [
    'To seek conjunction and lunar eclipse: set the new-moon and full-moon midnight yin-yang calendar days and remainders; remove halves; set small fraction 303; add the difference number; when small fraction fills 606 carry into day remainder; when day remainder fills the communication divisor carry into days; when days fill one calendar remove it.',
    'For conjunction and lunar eclipse: take the midnight yin-yang index at syzygy, drop half-units, add small fraction 303 plus the difference index, carrying at 606 and 26,377 and clearing each 13-day table cycle.',
  ],
  s0418: [
    'Name the day outside the count—that is the calendar entry at the hour of new moon and full moon.',
    'Name the day count (exclusive)—this is the yin-yang index at syzygy hour.',
  ],
  s0419: [
    'When new-moon and full-moon hour calendar entry is day one, day remainder 4,198, small fraction 428 or below—or day twelve, day remainder 11,788, small fraction 481 or above—at new moon there is conjunction, at full moon lunar eclipse.',
    'If the syzygy-hour index is day 1 (remainder ≤4,198, small fraction ≤428) or day 12 (remainder ≥11,788, small fraction ≥481), new moon brings conjunction and full moon brings lunar eclipse.',
  ],
  s0420: [
    'To seek the fixed great and small remainders for conjunction and lunar eclipse: let the difference-number day remainder add to the midnight slow-fast calendar remainder; when day remainder fills the communication divisor carry into days—that is the calendar entry at syzygy hour.',
    'To fix syzygy remainder: add the difference day-fraction to the midnight slow-fast remainder, carrying at the communication divisor—that yields the syzygy-hour table index.',
  ],
  s0421: [
    'Multiply the calendar-entry remainder by the increase-decrease rate; by it increase or decrease the expansion-contraction accumulated parts; divide by the difference divisor; surplus subtract, deficit add to the original new-moon and full-moon small remainder—for the fixed small remainder.',
    'Scale the table remainder by the surplus-deficit rate, adjust the expansion-contraction integral, divide by the difference divisor, and subtract surplus or add deficit from the mean syzygy fraction for the true small remainder.',
  ],
  s0422: [
    'When increasing it may fill the divisor; when decreasing it may be insufficient—advance or retreat the day by the day divisor.',
    'If addition overflows or subtraction underflows, borrow or carry a day using the day modulus (3,939).',
  ],
  s0423: [
    'To seek the hour of conjunction and lunar eclipse: multiply the fixed small remainder by twelve; what fills the day divisor gives one double-hour; name from zi, outside the count—the double-hour where the addition falls.',
    'For syzygy hour: multiply the true fractional day by 12, divide by the day modulus (3,939), and name the stem-branch hour from zi (exclusive).',
  ],
  s0424: [
    'If there is remainder, multiply by four; what fills the day divisor gives one as shao, two as ban, three as tai.',
    'For the leftover fraction, multiply by 4 and divide by the day modulus—1 gives shao (less), 2 ban (half), 3 tai (greater).',
  ],
  s0425: [
    'If there is still remainder, multiply by three; what fills the day divisor gives one as qiang; combine qiang with shao for shao-qiang, with ban for ban-qiang, with tai for tai-qiang.',
    'If fraction remains, multiply by 3 and divide by the day modulus—1 gives qiang (strong); combine with shao, ban, or tai for shao-qiang, ban-qiang, or tai-qiang.',
  ],
  s0426: [
    'Obtaining two gives shao-ruo; combine with tai for one double-hour weak; name by the prior double-hour.',
    'Two qiang yields shao-ruo (less-weak); tai plus two qiang makes one chronogram weak—name the hour from the preceding stem-branch.',
  ],
  s0427: [
    'To seek the moon\'s distance from the sun\'s path in du: set the yin-yang calendar remainder; multiply by the increase-decrease rate; divide by the communication divisor; by it increase or decrease the combined number for the fixed value; divide the fixed number by twelve for du; what is not exhausted, divide by three for shao, ban, tai.',
    'For lunar latitude: multiply the yin-yang remainder by the surplus-deficit rate, divide by the communication divisor (26,377), adjust the paired number, divide by 12 for whole degrees, and express the remainder in thirds as shao, ban, or tai.',
  ],
  s0428: [
    'What is still not exhausted—one gives qiang, two gives shao-ruo—that is the moon\'s distance from the sun\'s path number.',
    'Mark any leftover third as qiang (1) or shao-ruo (2)—the moon\'s ecliptic latitude.',
  ],
  s0429: [
    'The yang calendar is outside, the yin calendar inside.',
    'Yang-table latitude is north of the ecliptic; yin-table latitude is south.',
  ],
  s0430: [
    'To seek the dusk and dawn culminating stars: for each add the degree number to where the sun stands at midnight—that is the culminating-star degree.',
    'For dusk and dawn stars: add the tabulated arc to the midnight solar longitude to obtain the culminating-star position.',
  ],
  s0431: [
    'Method for pushing the five planets: Wood rate: 15,753,082.',
    'Five-planet procedure — Wood orbital constant: 15,753,082.',
  ],
  s0432: [
    'Fire rate: 30,804,196.',
    'Fire orbital constant: 30,804,196.',
  ],
  s0433: [
    'Earth rate: 14,930,354.',
    'Earth orbital constant: 14,930,354.',
  ],
  s0434: [
    'Metal rate: 23,060,014.',
    'Metal orbital constant: 23,060,014.',
  ],
  s0435: [
    'Water rate: 4,576,204.',
    'Water orbital constant: 4,576,204.',
  ],
  s0436: [
    'Method for pushing the five planets: set the degree dividend; for each remove by rate; subtract the remainder from the rate; divide the remainder by the era modulus for entry-year days; what is not exhausted is day remainder.',
    'For each planet: take the degree dividend (accumulated days × era modulus), divide by the orbital rate, subtract the remainder from the rate, divide again by the era modulus (39,491) for conjunction days—the residue is the fractional day.',
  ],
  s0437: [
    'Name from Heaven\'s first-month new moon, outside the count—the star-conjunction day.',
    'Name the date forward from the month-11 new moon (exclusive)—the planetary conjunction day.',
  ],
  s0438: [
    'To seek star-conjunction degree: add entry-year days and remainder to the first-month new-moon accumulated solar degree and remainder; when it fills the era modulus carry into du; when it fills 360 remove the degree fraction; name from Emptiness 1, outside the count—the degree where the star conjoins.',
    'For conjunction longitude: add the entry days and fraction to the month-11 new-moon solar position, carrying at the era modulus and stripping 360°, then name from Emptiness 1 (exclusive).',
  ],
  s0439: [
    'Method for finding star-appearance day: add occultation days and remainder to star-conjunction day and remainder; when remainder fills the era modulus carry into days; name as before—the appearance day.',
    'For first visibility: add the tabulated occultation interval to the conjunction date, carrying at the era modulus, and name the date as before.',
  ],
  s0440: [
    'Method for finding star-appearance degree: add occultation du and remainder to star-conjunction du and remainder; when remainder fills the era modulus carry into du; entering Emptiness remove degree fraction; name as before—the star-appearance degree.',
    'For appearance longitude: add the occultation arc to the conjunction position, carrying at the era modulus and applying the Emptiness-void correction, then name as before.',
  ],
  s0441: [
    'Method for moving the five planets: divide degree remainder by the small-fraction divisor; what is obtained is motion fen; what is not exhausted is small fraction; daily add the motion fen—when it fills the divisor carry into du; during stationary continue the prior value; in retrograde subtract; during occultation do not complete du.',
    'Divide the degree remainder by the small-fen divisor (1,717) for daily motion fen; add each day and carry into whole du; hold through stations, subtract in retrograde, and omit degrees while hidden.',
  ],
  s0442: [
    'In direct motion entering Emptiness, remove motion fen six and small fraction 147;',
    'At Emptiness entry in direct motion, subtract 6 motion fen and 147 small parts;',
  ],
  s0443: [
    'In retrograde exiting Emptiness, then add them.',
    'In retrograde exiting Emptiness, add them back.',
  ],
  s0444: [
    'Wood: at first conjunction with the sun, occultation sixteen days, day remainder 17,832, motion two du, degree remainder 37,504; morning appearance in the east.',
    'Wood: after initial conjunction it is hidden 16 days (day remainder 17,832), moves 2 du (remainder 37,504), then appears in the east at dawn.',
  ],
  s0445: [
    'Direct: daily motion four fen, 112 days, motion nineteen du eleven fen.',
    'Direct motion at 4 fen per day for 112 days—19 du 11 fen of travel.',
  ],
  s0446: ['Stationary twenty-eight days.', 'It stations 28 days.'],
  s0447: [
    'Retrograde: daily motion three fen, 86 days, retreat eleven du five fen.',
    'Retrograde at 3 fen per day for 86 days—retreat 11 du 5 fen.',
  ],
  s0448: ['Stationary again twenty-eight days.', 'It stations another 28 days.'],
  s0449: [
    'Direct: daily motion four fen, 112 days; evening hidden in the west.',
    'Direct motion at 4 fen per day for 112 days, then hidden in the west at dusk.',
  ],
  s0450: [
    'Day and degree remainders as at first.',
    'Day and degree remainders return to their initial values.',
  ],
  s0451: [
    'One cycle: 398 days, day remainder 35,664, motion 33 du, degree remainder 25,215.',
    'One complete cycle: 398 days (remainder 35,664), net motion 33 du (remainder 25,215).',
  ],
  s0452: [
    'Fire: at first conjunction with the sun, occultation 72 days, day remainder 608, motion 55 du, degree remainder 28,865; morning appearance in the east.',
    'Fire: after initial conjunction it is hidden 72 days (day remainder 608), moves 55 du (remainder 28,865), then appears in the east at dawn.',
  ],
  s0453: [
    'Direct, fast: daily motion seventeen fen, 92 days, motion 68 du.',
    'Direct fast phase: 17 fen per day for 92 days—68 du of travel.',
  ],
  s0454: [
    'Slightly slow: daily motion fourteen fen, 92 days, motion 56 du.',
    'Direct slightly slow phase: 14 fen per day for 92 days—56 du of travel.',
  ],
  s0455: [
    'Greatly slow: daily motion nine fen, 92 days, motion 36 du.',
    'Direct greatly slow phase: 9 fen per day for 92 days—36 du of travel.',
  ],
  s0456: ['Stationary ten days.', 'It stations 10 days.'],
  s0457: [
    'Retrograde: daily motion six fen, 64 days, retreat sixteen du sixteen fen.',
    'Retrograde at 6 fen per day for 64 days—retreat 16 du 16 fen.',
  ],
  s0458: ['Stationary again ten days.', 'It stations another 10 days.'],
  s0459: [
    'Direct, slow: daily motion nine fen, 92 days.',
    'Direct slow phase: 9 fen per day for 92 days.',
  ],
  s0460: [
    'Slightly fast: daily motion fourteen fen, 92 days.',
    'Direct slightly fast phase: 14 fen per day for 92 days.',
  ],
  s0461: [
    'Greatly fast: daily motion seventeen fen, 92 days; evening hidden in the west; day and degree remainders as at first.',
    'Direct greatly fast phase: 17 fen per day for 92 days, then hidden in the west at dusk; day and degree remainders return to their initial values.',
  ],
  s0462: [
    'One cycle: 780 days, day remainder 1,216, motion 414 du, degree remainder 30,258.',
    'One complete cycle: 780 days (remainder 1,216), gross motion 414 du (remainder 30,258).',
  ],
  s0463: [
    'Remove one circuit; net motion 49 du, degree remainder 19,809.',
    'Subtract one 360° circuit; net motion 49 du (remainder 19,809).',
  ],
  s0464: [
    'Earth: at first conjunction with the sun, occultation seventeen days, day remainder 1,378, motion one du, degree remainder 19,333; morning appearance in the east.',
    'Earth: after initial conjunction it is hidden 17 days (day remainder 1,378), moves 1 du (remainder 19,333), then appears in the east at dawn.',
  ],
  s0465: [
    'Direct motion: daily motion two fen, 84 days, motion seven du seven fen.',
    'Direct motion at 2 fen per day for 84 days—7 du 7 fen of travel.',
  ],
  s0466: ['Stationary thirty-three days.', 'It stations 33 days.'],
  s0467: [
    'Retrograde: daily motion one fen, 110 days, retreat four du eighteen fen.',
    'Retrograde at 1 fen per day for 110 days—retreat 4 du 18 fen.',
  ],
  s0468: ['Stationary again thirty-three days.', 'It stations another 33 days.'],
  s0469: [
    'Direct: daily motion two fen, 84 days; evening hidden in the west; day and degree remainders as at first.',
    'Direct motion at 2 fen per day for 84 days, then hidden in the west at dusk; day and degree remainders return to their initial values.',
  ],
  s0470: [
    'One cycle: 378 days, day remainder 2,756, motion 12 du, degree remainder 31,798.',
    'One complete cycle: 378 days (remainder 2,756), net motion 12 du (remainder 31,798).',
  ],
  s0471: [
    'Metal: at first conjunction with the sun, occultation 39 days, remainder 38,126, motion 49 du, degree remainder 38,126; evening appearance in the west.',
    'Metal: after initial conjunction it is hidden 39 days (remainder 38,126), moves 49 du (remainder 38,126), then appears in the west at dusk.',
  ],
  s0472: [
    'Direct, fast: daily motion one du five fen, 92 days, motion 112 du.',
    'Evening star direct fast phase: 1 du 5 fen per day for 92 days—112 du of travel.',
  ],
  s0473: [
    'Slightly slow: daily motion one du four fen, 92 days, motion 108 du.',
    'Evening star slightly slow phase: 1 du 4 fen per day for 92 days—108 du of travel.',
  ],
  s0474: [
    'Greatly slow: daily motion seventeen fen, 45 days, motion 33 du six fen.',
    'Evening star greatly slow phase: 17 fen per day for 45 days—33 du 6 fen of travel.',
  ],
  s0475: ['Stationary nine days.', 'It stations 9 days.'],
  s0476: [
    'Slow: daily motion sixteen fen, retreat six du six fen.',
    'Slow retrograde at 16 fen per day—retreat 6 du 6 fen.',
  ],
  s0477: ['Evening hidden in the west.', 'Hidden in the west at dusk.'],
  s0478: [
    'Occultation five days, retreat five du, then conjoins with the sun.',
    'Hidden 5 days, retreating 5 du, then conjoins with the sun.',
  ],
  s0479: [
    'Again five days, retreat five du, then morning appearance in the east.',
    'Hidden another 5 days, retreating 5 du, then appears in the east at dawn.',
  ],
  s0480: [
    'Retrograde: daily motion sixteen fen, nine days.',
    'Morning star retrograde at 16 fen per day for 9 days.',
  ],
  s0481: ['Stationary nine days.', 'It stations 9 days.'],
  s0482: [
    'Direct, slow: daily motion seventeen fen, 45 days.',
    'Morning star direct slow phase: 17 fen per day for 45 days.',
  ],
  s0483: [
    'Slightly fast: daily motion one du four fen, 92 days.',
    'Morning star slightly fast phase: 1 du 4 fen per day for 92 days.',
  ],
  s0484: [
    'Greatly fast: daily motion one du five fen, 92 days; morning hidden in the east; day and degree remainders as at first.',
    'Morning star greatly fast phase: 1 du 5 fen per day for 92 days, then hidden in the east at dawn; day and degree remainders return to their initial values.',
  ],
  s0485: [
    'One cycle: 583 days, day remainder 36,761; planetary motion likewise.',
    'One complete cycle: 583 days (remainder 36,761); gross planetary motion matches.',
  ],
  s0486: [
    'Remove one circuit; net motion 218 du, degree remainder 26,312.',
    'Subtract one 360° circuit; net motion 218 du (remainder 26,312).',
  ],
  s0487: [
    'One conjunction: 291 days, day remainder 38,126; planetary motion likewise.',
    'One conjunction period: 291 days (remainder 38,126); gross planetary motion matches.',
  ],
  s0488: [
    'Water: at first conjunction with the sun, occultation fourteen days, day remainder 37,115, motion 30 du, degree remainder 37,115; evening appearance in the west.',
    'Water: after initial conjunction it is hidden 14 days (day remainder 37,115), moves 30 du (remainder 37,115), then appears in the west at dusk.',
  ],
  s0489: [
    'Direct, fast: daily motion one du six fen, 23 days, motion 29 du.',
    'Evening star direct fast phase: 1 du 6 fen per day for 23 days—29 du of travel.',
  ],
  s0490: [
    'Slow: daily motion twenty fen, eight days, motion six du twenty-two fen.',
    'Evening star slow phase: 20 fen per day for 8 days—6 du 22 fen of travel.',
  ],
  s0491: ['Stationary two days.', 'It stations 2 days.'],
  s0492: [
    'Slow: daily motion eleven fen, two days, retreat twenty-two fen.',
    'Slow retrograde at 11 fen per day for 2 days—retreat 22 fen.',
  ],
  s0493: ['Evening hidden in the west.', 'Hidden in the west at dusk.'],
  s0494: [
    'Occultation eight days, retreat eight du, then conjoins with the sun.',
    'Hidden 8 days, retreating 8 du, then conjoins with the sun.',
  ],
  s0495: [
    'Again eight days, retreat eight du, then morning appearance in the east.',
    'Hidden another 8 days, retreating 8 du, then appears in the east at dawn.',
  ],
  s0496: [
    'Retrograde: daily motion eleven fen, two days.',
    'Morning star retrograde at 11 fen per day for 2 days.',
  ],
  s0497: ['Stationary two days.', 'It stations 2 days.'],
  s0498: [
    'Direct, slow: daily motion twenty fen, eight days.',
    'Morning star direct slow phase: 20 fen per day for 8 days.',
  ],
  s0499: [
    'Fast: daily motion one du six fen, 23 days; morning hidden in the east; day and degree remainders as at first.',
    'Morning star fast phase: 1 du 6 fen per day for 23 days, then hidden in the east at dawn; day and degree remainders return to their initial values.',
  ],
  s0500: [
    'One cycle: 115 days, day remainder 34,739; planetary motion likewise.',
    'One complete cycle: 115 days (remainder 34,739); gross planetary motion matches.',
  ],
};

let updated = 0;
const missing = [];
for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    updated++;
  }
}

for (const id of Object.keys(T).sort()) {
  if (!data.sentences.some((s) => s.id === id)) missing.push(id);
}

data.sentences.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

const empty = data.sentences.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
console.log(`Updated ${updated} sentences`);
console.log(`Missing map entries in file: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`Empty literal/idiomatic remaining: ${empty.length}`);
if (empty.length) {
  console.error(empty.map((s) => s.id).join(', '));
  process.exit(1);
}
