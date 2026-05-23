#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

/** Daming slow-fast table rows parsed from s0374 */
const damingLunarRows = [
  { day: 1, du: 14, fen: 13, rate: 'increase 70', ec: 'expansion opening', acc: null, diff: 5304 },
  { day: 2, du: 14, fen: 11, rate: 'increase 65', ec: 'expansion', acc: '1,842,316', diff: 5270 },
  { day: 3, du: 14, fen: 8, rate: 'increase 57', ec: 'expansion', acc: '3,550,706', diff: 5219 },
  { day: 4, du: 14, fen: 4, rate: 'increase 47', ec: 'expansion', acc: '5,058,208', diff: 5151 },
  { day: 5, du: 13, fen: 22, rate: 'increase 34', ec: 'expansion', acc: '6,297,857', diff: 5066 },
  { day: 6, du: 13, fen: 17, rate: 'increase 22', ec: 'expansion', acc: '7,202,691', diff: 4981 },
  { day: 7, du: 13, fen: 11, rate: 'increase 6', ec: 'expansion', acc: '7,772,710', diff: 4879 },
  { day: 8, du: 13, fen: 5, rate: 'decrease 9', ec: 'expansion', acc: '7,940,952', diff: 4777 },
  { day: 9, du: 12, fen: 22, rate: 'decrease 24', ec: 'expansion', acc: '7,707,415', diff: 4675 },
  { day: 10, du: 12, fen: 16, rate: 'decrease 39', ec: 'expansion', acc: '7,072,100', diff: 4573 },
  { day: 11, du: 12, fen: 11, rate: 'decrease 52', ec: 'expansion', acc: '6,035,007', diff: 4488 },
  { day: 12, du: 12, fen: 8, rate: 'decrease 60', ec: 'expansion', acc: '4,663,100', diff: 4437 },
  { day: 13, du: 12, fen: 6, rate: 'decrease 65', ec: 'expansion', acc: '3,090,302', diff: 4403 },
  { day: 14, du: 12, fen: 4, rate: 'decrease 70', ec: 'expansion', acc: '1,383,580', diff: 4369 },
  { day: 15, du: 12, fen: 2, rate: 'increase 67', ec: 'contraction', acc: '457,069', diff: 4368 },
  { day: 16, du: 12, fen: 7, rate: 'increase 62', ec: 'contraction', acc: '2,230,755', diff: 4420 },
  { day: 17, du: 12, fen: 10, rate: 'increase 55', ec: 'contraction', acc: '3,870,514', diff: 4471 },
  { day: 18, du: 12, fen: 14, rate: 'increase 44', ec: 'contraction', acc: '5,309,385', diff: 4539 },
  { day: 19, du: 12, fen: 19, rate: 'increase 32', ec: 'contraction', acc: '6,480,404', diff: 4624 },
  { day: 20, du: 13, fen: 1, rate: 'increase 19', ec: 'contraction', acc: '7,316,608', diff: 4709 },
  { day: 21, du: 13, fen: 7, rate: 'increase 4', ec: 'contraction', acc: '7,817,996', diff: 4811 },
  { day: 22, du: 13, fen: 13, rate: 'decrease 11', ec: 'contraction', acc: '7,917,607', diff: 4913 },
  { day: 23, du: 13, fen: 19, rate: 'decrease 27', ec: 'contraction', acc: '7,615,440', diff: 5015 },
  { day: 24, du: 14, fen: 1, rate: 'decrease 39', ec: 'contraction', acc: '6,901,495', diff: 5100 },
  { day: 25, du: 14, fen: 6, rate: 'decrease 52', ec: 'contraction', acc: '5,872,735', diff: 5185 },
  { day: 26, du: 14, fen: 10, rate: 'decrease 62', ec: 'contraction', acc: '4,499,159', diff: 5253 },
  { day: 27, du: 14, fen: 12, rate: 'decrease 67', ec: 'contraction', acc: '2,857,732', diff: 5287 },
  { day: 28, du: 14, fen: 14, rate: 'decrease 74', ec: 'contraction', acc: '1,082,379', diff: 5321 },
];

function fmtDamingLunarRow(r, style) {
  const label = `Day ${r.day}`;
  const motion =
    style === 'literal'
      ? `${r.du} du ${r.fen} motion fen`
      : `${r.du}° ${r.fen}′ motion`;
  const parts = [label + ':', motion, r.rate, r.ec];
  if (r.acc) {
    parts.push(
      style === 'literal'
        ? `${r.ec.includes('opening') ? '' : 'accumulated '}${r.acc}`
        : r.acc
    );
  }
  if (r.diff != null) {
    parts.push(style === 'literal' ? `difference divisor ${r.diff}` : `diff divisor ${r.diff}`);
  }
  return parts.filter(Boolean).join(', ');
}

const s0374Literal = [
  'Lunar motion in du; increase-decrease rates; expansion-contraction accumulated parts; difference divisor.',
  ...damingLunarRows.map((r) => fmtDamingLunarRow(r, 'literal')),
].join(' ');
const s0374Idiomatic = [
  'Daming slow-fast table:',
  ...damingLunarRows.map((r) => fmtDamingLunarRow(r, 'idiomatic')),
].join(' ');

/** @type {Record<string, [string, string]>} */
const T = {
  s0301: [
    'The earlier scholar Yu Xi thoroughly discussed its meaning.',
    'Earlier scholars—Yu Xi foremost among them—set out the full rationale.',
  ],
  s0302: [
    'Now the calendar\'s upper-origin solar position begins from Emptiness 1.',
    'In the new calendar, the upper-origin solar longitude starts at Emptiness 1.',
  ],
  s0303: [
    'Second: by the numbering of days and hours, jiazi comes first; in setting a calendar era, it should fall in this year.',
    'Second foundation: jiazi leads the sexagenary cycle—the calendar era ought to begin in that year.',
  ],
  s0304: [
    'Yet from the Yellow Emperor down, through every age\'s usage—all eleven calendars—none placed the upper-origin year in jiazi.',
    'Yet from the Yellow Emperor through eleven successive systems, not one upper-origin year has borne the name jiazi.',
  ],
  s0305: [
    'Now the calendar\'s upper origin falls in jiazi year.',
    'The new calendar places its upper origin in a jiazi year.',
  ],
  s0306: [
    'Third: with the upper-origin year, every clause in the calendar ought to begin from it; yet the Jingchu Calendar\'s conjunction and slow-fast tables also set era offsets, barely aligning only new moons and qi.',
    'Third: every calendar procedure should start from the upper-origin year—but the Jingchu Calendar\'s eclipse and slow-fast tables still use era offsets, aligning new moons and qi and nothing more.',
  ],
  s0307: [
    'The clauses are tangled and jumbled, falling short of the ancient intent.',
    'Its procedures are tangled and jumbled—far from the older ideal.',
  ],
  s0308: [
    'Now the method is set: sun, moon, five planets, conjunctions, slow and fast—all begin from the upper-origin year\'s head.',
    'Under my method, sun, moon, planets, eclipses, and slow-fast tables all originate at the upper-origin year.',
  ],
  s0309: [
    'Then the paired-disk luminaries would be trusted and verified, the string-of-pearls radiance would be present; all streams share one source—truly refining the ancient method.',
    'Then the jade disks would align with proof, the pearls strung with light—and every strand of the calendar would share one spring, refining the ancient way.',
  ],
  s0310: [
    'As for measuring to fix form, relying on real effect—the suspended images clear and bright, gnomon and rule can verify; the moving qi subtle, the inch-tube clepsydra\'s signs accurate.',
    'Measure form against fact: the sky\'s signs stand clear, gnomon shadows confirm it, and even the finest clepsydra pulse stays true.',
  ],
  s0311: [
    'What your subject has established is easy to trust.',
    'What I propose is easy to verify.',
  ],
  s0312: [
    'But practiced deep from start to finish, broadly preserved in integral precision—reforming the old, there are simplified and elaborate parts.',
    'It is painstaking from first principle to last, preserving whole precision while replacing the old—some steps spare, some elaborate.',
  ],
  s0313: [
    'Using the simplified clauses, reason itself is not afraid; using the elaborate intent, surely it is not absurd.',
    'The simpler steps need no apology on grounds of logic; the more elaborate ones are not empty flourish.',
  ],
  s0314: ['Why?', 'Why so?'],
  s0315: [
    'Era and intercalation vary by uneven amounts; each number has its fraction; fractions as the substance—without fineness there is no precision.',
    'Eras and leap months run on uneven fractions—without fine parts there is no real precision.',
  ],
  s0316: [
    'Your subject therefore deeply cherishes hairs and hairsbreadths to preserve the standard of seeking perfection, not shunning accumulation to forge a permanently fixed system.',
    'I weigh every hairbreadth to preserve exactness, and do not shirk the accumulation required for a lasting system.',
  ],
  s0317: [
    'It is not that one thinks and fails to grasp, or knows and does not change; I fear privately that supporters have their yes and no, always elevating what is distant and following what is near;',
    'This is not stubborn ignorance—I fear that reviewers honor what is near and dismiss what is far;',
  ],
  s0318: [
    'In debate there is right and wrong, or one values what is heard and neglects what is seen.',
    'Or trust what they hear and disregard what the eye can test.',
  ],
  s0319: [
    'Therefore I exhaust my narrow tube, bowing to wash away suspicion of difference; baring my heart to sun and moon, looking up to hope for the mallow\'s illumination.',
    'So I lay bare my narrow craft, hoping to clear every doubt—and offer my heart to sun and moon, as the mallow turns toward the light.',
  ],
  s0320: [
    'If what your subject submits might in the slightest be adopted, I humbly wish it promulgated to all offices, granted careful examination—perhaps this mite may slightly augment the great rite.',
    'If anything here may serve, I beg that it be sent to every office for review—even a grain might add something to the imperial rite.',
  ],
  s0321: ['○ Calendar method', '○ Calendar Method'],
  s0322: [
    'From upper origin jiazi to year gui-mao of Daming 7 in Song—51,939 years, outside the count.',
    'From the jiazi upper origin to Daming 7 (gui-mao): 51,939 years—exclusive of the count.',
  ],
  s0323: ['Origin divisor: 592,365.', 'Origin modulus (yuan fa): 592,365.'],
  s0324: ['Era divisor: 39,491.', 'Era modulus (ji fa): 39,491.'],
  s0325: ['Rule years: 391.', 'Rule years (zhang sui): 391.'],
  s0326: ['Rule months: 4,836.', 'Rule months (zhang yue): 4,836.'],
  s0327: ['Rule intercalations: 144.', 'Rule leap months (zhang run): 144.'],
  s0328: ['Intercalation divisor: 12.', 'Leap-month divisor (run fa): 12.'],
  s0329: ['Month divisor: 116,321.', 'Month modulus (yue fa): 116,321.'],
  s0330: ['Day divisor: 3,939.', 'Day modulus (ri fa): 3,939.'],
  s0331: ['Remainder number: 207,044.', 'Remainder number (yu shu): 207,044.'],
  s0332: ['Year remainder: 9,589.', 'Year remainder (sui yu): 9,589.'],
  s0333: ['Extinction fraction: 3,605,951.', 'Extinction fraction (mo fen): 3,605,951.'],
  s0334: ['Extinction divisor: 51,761.', 'Extinction divisor (mo fa): 51,761.'],
  s0335: ['Circuit heaven: 14,424,664.', 'Circumference of heaven (zhou tian): 14,424,664.'],
  s0336: ['Void fraction: 10,449.', 'Void fraction (xu fen): 10,449.'],
  s0337: ['Motion-fen divisor: 23.', 'Motion-fen divisor (xing fen fa): 23.'],
  s0338: ['Small-fen divisor: 1,717.', 'Small-fen divisor (xiao fen fa): 1,717.'],
  s0339: ['Communication circuit: 726,810.', 'Communication circuit (tong zhou): 726,810.'],
  s0340: ['Conjunction circuit: 717,777.', 'Conjunction circuit (hui zhou): 717,777.'],
  s0341: ['Communication divisor: 26,377.', 'Communication divisor (tong fa): 26,377.'],
  s0342: ['Difference rate: 39.', 'Difference rate (cha lü): 39.'],
  s0343: [
    'Method for pushing new moons: set the upper-origin year count outside the count; multiply by rule months; what fills rule years is accumulated months; what does not exhaust is intercalary remainder.',
    'To compute new moons: take years from the upper origin (exclusive), multiply by rule months (4,836), divide by rule years (391) for accumulated months; the remainder is the intercalary surplus.',
  ],
  s0344: [
    'If the intercalary remainder is 247 or more, that year has an intercalation.',
    'If the intercalary remainder is 247 or greater, declare a leap month that year.',
  ],
  s0345: [
    'Multiply accumulated months by the month divisor; what fills the day divisor is accumulated days; what does not exhaust is small remainder.',
    'Multiply accumulated months by the month modulus (116,321), divide by the day modulus (3,939) for whole days; the residue is the fractional day.',
  ],
  s0346: [
    'Remove six decades from accumulated days; what does not exhaust is great remainder.',
    'Strip full 60-day cycles from the day-count; the residue is the sexagenary day count.',
  ],
  s0347: [
    'Name the great remainder from jiazi, outside the count—that is the new moon of Heaven\'s first month, month 11, of the year sought.',
    'Name the stem-branch date from jiazi (exclusive)—this gives the month-11 new moon of the target year.',
  ],
  s0348: [
    'If the small remainder is 1,849 or more, that month is long.',
    'If the fractional remainder is 1,849 or greater, the month is a long (30-day) month.',
  ],
  s0349: [
    'To seek the next month, add twenty-nine to the great remainder and 2,090 to the small remainder; when the small remainder fills the day divisor, carry into the great remainder; when the great remainder fills six decades, remove it; name as before—that is the next month\'s new moon.',
    'For the following month, add 29 days and 2,090 parts, carrying at the day modulus and stripping 60-day cycles—that yields the next new moon.',
  ],
  s0350: [
    'To seek first quarter and full moon: add seven to the new-moon great remainder, 1,507 to the small remainder, and one to the small fraction; when small fraction fills four, carry into small remainder; when small remainder fills the day divisor, carry into great remainder; name as before—that is the first-quarter day.',
    'For first quarter: add 7 days, 1,507 parts, and 1 small part to the new-moon date, carrying fractions as needed—that gives the first-quarter day.',
  ],
  s0351: [
    'Add again to obtain full moon; add again to obtain last quarter; add again to obtain the next month\'s new moon.',
    'Repeat the same addition for full moon, last quarter, and the following month\'s new moon.',
  ],
  s0352: [
    'Method for pushing intercalary months: subtract rule years from the intercalary remainder; what fills the intercalation divisor gives one month; name from Heaven\'s first month, outside the count—the intercalation lies there.',
    'To locate the leap month: subtract 391 from the intercalary surplus, divide by 12; count forward from month 11—the leap month falls there.',
  ],
  s0353: [
    'Intercalations may advance or retreat; govern them by the absence of a mid-term qi.',
    'Leap-month placement may shift; a month without a mid-climate qi must be intercalary.',
  ],
  s0354: [
    'Method for pushing the twenty-four qi: set the upper-origin year count outside the count; multiply by the remainder number; what fills the era divisor is accumulated days; what does not exhaust is small remainder.',
    'To find the twenty-four solar terms: take years from the upper origin (exclusive), multiply by the remainder number (207,044), divide by the era modulus (39,491) for whole days; the residue is the fractional part.',
  ],
  s0355: [
    'Remove six decades from accumulated days; what does not exhaust is great remainder.',
    'Remove 60-day cycles; the residue is the sexagenary day count.',
  ],
  s0356: [
    'Name the great remainder from jiazi, outside the count—that is the winter solstice day of Heaven\'s first month, month 11.',
    'Name the stem-branch date from jiazi (exclusive)—this is the month-11 winter solstice of the target year.',
  ],
  s0357: [
    'To seek the next qi, add fifteen to the great remainder, 8,626 to the small remainder, and five to the small fraction; when small fraction fills six, carry into small remainder; when small remainder fills the era divisor, carry into great remainder; name as before—that is the next qi day.',
    'For the next term, add 15 days, 8,626 parts, and 5 small parts, carrying through the small-fraction, era, and sexagenary counts.',
  ],
  s0358: [
    'To seek Earth\'s reign: add twenty-seven to the winter-solstice great remainder and 15,528 to the small remainder—that is the late-winter day when Earth takes charge.',
    'For Earth\'s reign in late winter: add 27 days and 15,528 parts to the winter-solstice date.',
  ],
  s0359: [
    'Add again ninety-one to the great remainder and 12,270 to the small remainder—that is the next day when Earth takes charge.',
    'Add another 91 days and 12,270 parts for the second Earth-reign day.',
  ],
  s0360: [
    'Method for pushing extinction: multiply the winter-solstice small remainder by ninety and subtract from the extinction fraction; what fills the extinction divisor gives days; what does not exhaust is day remainder; name the day from the winter solstice, outside the count—that is the extinction day.',
    'For extinction days: multiply the winter-solstice fraction by 90, subtract from the extinction fraction (3,605,951), divide by the extinction divisor (51,761); name forward from the solstice.',
  ],
  s0361: [
    'To seek the next extinction, add sixty-nine days and day remainder 34,442; when the remainder fills the extinction divisor, carry into days—that is the next extinction day.',
    'For the following extinction, add 69 days and 34,442 parts, carrying at the extinction divisor.',
  ],
  s0362: [
    'When the day remainder is exhausted, it is an extinction day.',
    'When the day remainder reaches zero, that day is marked as extinction (mie).',
  ],
  s0363: [
    'Method for pushing the sun\'s lodge degree: multiply new-moon accumulated days by the era divisor for degree dividend; remove circuit heaven; the remainder that fills the era divisor is accumulated degrees; what does not exhaust is degree remainder; name from Emptiness 1, remove lodges in sequence, outside the count—that is the sun\'s lodge degree at midnight on the month-11 new moon.',
    'For the sun\'s position at month-11 new-moon midnight: multiply accumulated days by the era modulus, reduce modulo circuit heaven, divide by the era modulus for whole degrees; name from Emptiness 1 and step through the lodges.',
  ],
  s0364: [
    'To seek the next month, add thirty degrees for a long month and twenty-nine for a short month; when entering Emptiness, remove the degree fraction.',
    'For the following month, add 30 du (long month) or 29 du (short month), applying the Emptiness-void correction to the fractional degree.',
  ],
  s0365: [
    'To seek motion fen, divide the degree remainder by the small-fen divisor; what is obtained is motion fen; what is not exhausted is small fraction.',
    'Convert the degree remainder to motion fen by dividing by the small-fen divisor (1,717); the quotient is motion fen, the residue small parts.',
  ],
  s0366: [
    'When small fraction fills the divisor, carry into motion fen; when motion fen fills the divisor, carry into degrees.',
    'Carry small parts into motion fen and motion fen into whole degrees at their respective divisors.',
  ],
  s0367: ['To seek the next day, add one degree.', 'For the following day, add 1 du.'],
  s0368: [
    'When entering Emptiness, remove six motion fen and 147 small parts.',
    'At Emptiness entry, subtract 6 motion fen and 147 small parts.',
  ],
  s0369: [
    'Method for pushing the moon\'s lodge degree: multiply the new-moon small remainder by 124 for degree remainder.',
    'For the moon\'s position: multiply the new-moon fractional day by 124 for the degree remainder.',
  ],
  s0370: [
    'Again multiply the new-moon small remainder by 860 for micro-fraction.',
    'Multiply the same new-moon fraction by 860 for the micro-fraction.',
  ],
  s0371: [
    'When micro-fraction fills the month divisor, carry into degree remainder; when degree remainder fills the era divisor, form degrees; subtract from the new-moon midnight solar position—then the moon\'s lodge degree.',
    'Carry micro-parts into the degree remainder and then into whole degrees at the month and era moduli; subtract from the midnight solar longitude to obtain the moon\'s lodge.',
  ],
  s0372: [
    'To seek the next month: for a long month add thirty-five degrees, degree remainder 31,834, and micro-fraction 77,967; for a short month add twenty-two degrees, degree remainder 17,261, and micro-fraction 63,736; when entering Emptiness, remove the degree fraction.',
    'For the following month add 35 du (or 22 du for a short month) with the listed remainders and micro-parts, applying the Emptiness-void correction.',
  ],
  s0373: ['Slow-fast calendar:', 'Slow-fast calendar:'],
  s0374: [s0374Literal, s0374Idiomatic],
  s0375: [
    'Method for pushing entry into the slow-fast calendar: multiply new-moon accumulated days by the communication divisor for communication dividend; remove the communication circuit; the remainder that fills the communication divisor gives days; what does not exhaust is day remainder.',
    'To enter the slow-fast table: multiply accumulated days by the communication divisor (26,377), reduce modulo the communication circuit (726,810); the quotient is whole days, the residue the fractional day.',
  ],
  s0376: [
    'Name the day outside the count—that is the slow-fast calendar-entry day at midnight on the month-11 new moon.',
    'Name the day count (exclusive)—this is the slow-fast index at month-11 new-moon midnight.',
  ],
  s0377: [
    'To seek the next month, add two days for a long month and one day for a short month; the day remainder is always 11,746.',
    'For the following month add 2 days (long) or 1 day (short), each with day remainder 11,746.',
  ],
  s0378: [
    'When the calendar fills twenty-seven days and the day remainder is 14,631, remove it.',
    'At the 27-day cycle limit, clear day remainder 14,631 and roll the table forward.',
  ],
  s0379: ['To seek the next day, add one day.', 'For the following day, add 1 day.'],
  s0380: [
    'To seek the corrected solar degree: multiply the midnight slow-fast calendar day remainder by the increase-decrease rate; by it increase or decrease the expansion-contraction accumulated parts; divide by the difference rate; what is obtained filling the era divisor is degrees; what does not exhaust is degree remainder; add for expansion and subtract for contraction from the mean degree and remainder for the corrected degree.',
    'For true solar longitude: scale the midnight table remainder by the rate, adjust the expansion-contraction integral, divide by the difference rate (39), carry at the era modulus, and add or subtract from the mean position.',
  ],
  s0381: [
    'When increasing, it may fill the divisor; when decreasing, it may be insufficient—advance or retreat by the era divisor.',
    'If addition overflows or subtraction underflows, borrow or carry using the era modulus (39,491).',
  ],
  s0382: [
    'To seek degree motion fen, use the method above.',
    'Convert the corrected degree remainder to motion fen by the same method as above.',
  ],
  s0383: [
    'To seek the next day, add according to the slow-fast entry as above; when entering Emptiness, remove fractions as above.',
    'For the following day, step through the slow-fast table and apply the Emptiness-void correction as above.',
  ],
  s0384: ['Yin-yang calendar', 'Yin-yang calendar'],
  s0385: [
    'Surplus-deficit rates',
    'Table heading: surplus-deficit rates',
  ],
  s0386: [
    'Surplus sixteen, initial.',
    'Day 1: surplus 16 — opening entry.',
  ],
  s0387: [
    'Surplus fifteen.',
    'Day 2: surplus 15.',
  ],
  s0388: [
    'Surplus fourteen.',
    'Day 3: surplus 14.',
  ],
  s0389: [
    'Thirty-one.',
    'Combined number: 31.',
  ],
  s0390: [
    'Surplus twelve.',
    'Day 4: surplus 12.',
  ],
  s0391: [
    'Forty-five.',
    'Combined number: 45.',
  ],
  s0392: [
    'Fifty-seven.',
    'Combined number: 57.',
  ],
  s0393: [
    'Sixty-six.',
    'Combined number: 66.',
  ],
  s0394: [
    'Seventy-one.',
    'Combined number: 71.',
  ],
  s0395: [
    'Seventy-two.',
    'Combined number: 72.',
  ],
  s0396: [
    'Sixty-four.',
    'Combined number: 64.',
  ],
  s0397: [
    'Day eleven.',
    'Day 11.',
  ],
  s0398: [
    'Deficit thirteen.',
    'Day 11: deficit 13.',
  ],
  s0399: [
    'Fifty-four.',
    'Combined number: 54.',
  ],
  s0400: [
    'Day twelve.',
    'Day 12.',
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

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

const empty = data.sentences.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
console.log(`Updated ${updated} sentences`);
console.log(`Missing map entries: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`Empty literal/idiomatic remaining: ${empty.length}`);
if (empty.length) {
  console.error(empty.map((s) => s.id).join(', '));
  process.exit(1);
}
