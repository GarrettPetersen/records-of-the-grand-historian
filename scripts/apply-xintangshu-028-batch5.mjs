#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: {
    literal: 'Triple the minor remainder; divide by the chronogram method and add it;',
    idiomatic: 'Triple the minor remainder, divide by the chronogram divisor, and add the quotient;',
  },
  s0402: {
    literal: 'Multiply by the increase-decrease rate; take one per fixed-qi chronogram count.',
    idiomatic: 'Multiply by the rate of increase or decrease, and divide by the fixed-qi chronogram count.',
  },
  s0403: {
    literal: 'Apply the result to increase or decrease the fast-slow accumulation; each becomes a fixed count.',
    idiomatic: 'Use the result to adjust the anomalistic accumulation, yielding a fixed value for each entry.',
  },
  s0404: {
    literal: 'Southern Dipper 26, Ox 8, Maid 12, Emptiness 10, Emptiness fraction 779 and greater.',
    idiomatic: 'Southern Dipper: 26°; Ox: 8°; Maid: 12°; Emptiness: 10°, void fraction 779 and greater.',
  },
  s0405: {
    literal:
      'Rooftop 17, Encampment 16, Eastern Wall 9, Stride 16, Bond 12, Stomach 14, Hairy Head 11, Net 17, Turtle Beak 1, Three Stars 10, Eastern Well 33, Ghost Cart 3, Willow 15, Seven Stars 7, Extended Net 18, Wings 18, Chariot Shaft 17, Horn 12, Neck 9, Root 15, Room 5, Heart 5, Tail 18, Winnowing Basket 11 — these are equatorial degrees.',
    idiomatic:
      'Rooftop 17°, Encampment 16°, Eastern Wall 9°, Stride 16°, Bond 12°, Stomach 14°, Hairy Head 11°, Net 17°, Turtle Beak 1°, Three Stars 10°, Eastern Well 33°, Ghost Cart 3°, Willow 15°, Seven Stars 7°, Extended Net 18°, Wings 18°, Chariot Shaft 17°, Horn 12°, Neck 9°, Root 15°, Room 5°, Heart 5°, Tail 18°, Winnowing Basket 11° — the equatorial lodge degrees.',
  },
  s0406: {
    literal: 'The degree-counts of the four lodges Net, Turtle Beak, Three Stars, and Ghost Cart differ from antiquity.',
    idiomatic: 'The arc-degrees assigned to Net, Turtle Beak, Three Stars, and Ghost Cart differ from the ancient reckoning.',
  },
  s0407: {
    literal: 'Measured by instrument according to heaven, these are taken as constants.',
    idiomatic: 'They were fixed by armillary measurement against the sky and adopted as standard constants.',
  },
  s0408: {
    literal: 'The girdle spans heaven’s center; the instrument’s pole is relied upon to mark off the Yellow Path.',
    idiomatic: 'The celestial girdle runs through heaven’s center; the polar axis of the instrument is the reference for laying out the ecliptic.',
  },
  s0409: {
    literal: 'To determine the seat of the winter-solstice annual difference: each five degrees before and after the winter solstice is one limit; the initial count is twelve; each limit reduces by one.',
    idiomatic: 'To find where the winter-solstice precession applies: take five degrees on either side of the solstice as one band; begin at twelve and subtract one for each successive band.',
  },
  s0410: {
    literal: 'Through nine limits the count ends at four.',
    idiomatic: 'After nine bands the tally reaches four.',
  },
  s0411: {
    literal: 'At the two “Establishment” nodes, one degree slightly strong, follow the mean.',
    idiomatic: 'At the two Establishment qi, treat one degree as slightly strong and use the mean value.',
  },
  s0412: {
    literal:
      'Then from before the spring equinox and after the autumn equinox, the initial limit begins at four; each limit adds one; through nine limits it ends at twelve, and the ecliptic intersection returns.',
    idiomatic:
      'From before the spring equinox and after the autumn equinox, begin the first band at four and add one per band; after nine bands the tally is twelve, and the ecliptic obliquity cycle completes.',
  },
  s0413: {
    literal: 'Count likewise after the spring equinox and before the autumn equinox, again with five degrees per limit.',
    idiomatic: 'For the interval after the spring equinox and before the autumn equinox, use the same five-degree bands.',
  },
  s0414: {
    literal: 'The initial count is twelve; through nine limits the count ends at four.',
    idiomatic: 'Begin at twelve; after nine bands the tally reaches four.',
  },
  s0415: {
    literal: 'At the two “Establishment” nodes, one degree slightly strong, follow the mean.',
    idiomatic: 'At the two Establishment qi, treat one degree as slightly strong and use the mean value.',
  },
  s0416: {
    literal: 'Then before and after the summer solstice, the initial limit begins at four; through nine limits it ends at twelve.',
    idiomatic: 'Before and after the summer solstice, begin the first band at four; after nine bands the tally is twelve.',
  },
  s0417: {
    literal: 'Trim cumulatively in each case; multiply the limit-count by the band-number; divide by 120 to obtain degrees.',
    idiomatic: 'Accumulate the trims in order, multiply the band index by the limit value, and divide by 120 to obtain degrees.',
  },
  s0418: {
    literal: 'What does not fill, divide by twelve for parts.',
    idiomatic: 'The remainder, divided by twelve, gives fractional parts.',
  },
  s0419: {
    literal: 'If one divides by ten, the major parts take twelve as denominator; name greater, half, lesser, and strong or weak.',
    idiomatic: 'If divided by ten instead, use twelve as the denominator for major parts, naming greater, half, lesser, strong, and weak fractions.',
  },
  s0420: {
    literal: 'Name it the yellow–red path difference number.',
    idiomatic: 'This is called the ecliptic–equator difference.',
  },
  s0421: {
    literal:
      'For nine limits before and after each solstice, subtract the difference from equatorial degrees; for nine limits before and after each equinox, add the difference to equatorial degrees — each yields ecliptic degrees.',
    idiomatic:
      'Within nine bands on either side of each solstice, subtract the difference from the equatorial longitude; within nine bands on either side of each equinox, add it — yielding ecliptic longitude in each case.',
  },
  s0422: {
    literal:
      'Kaiyuan 12: Southern Dipper 23½, Ox 7½, Maid 11 lesser, Emptiness 10, six Emptiness differences 19 greater.',
    idiomatic:
      'Kaiyuan year 12: Southern Dipper 23½°, Ox 7½°, Maid 11° lesser, Emptiness 10°, six Emptiness-difference parts 19 greater.',
  },
  s0423: {
    literal:
      'Rooftop 17 greater, Encampment 17 lesser, Eastern Wall 9 greater, Stride 17½, Bond 12 greater, Stomach 14 greater, Hairy Head 11, Net 16 lesser, Turtle Beak 1, Three Stars 9 lesser, Eastern Well 30, Ghost Cart 2 greater, Willow 14 lesser, Seven Stars 6 greater, Extended Net 18 greater, Wings 19 lesser, Chariot Shaft 18 greater, Horn 13, Neck 9½, Root 15 greater, Room 5, Heart 4 greater, Tail 17, Winnowing Basket 10 lesser — these are ecliptic degrees for pacing the sun’s daily motion.',
    idiomatic:
      'Rooftop 17° greater, Encampment 17° lesser, Eastern Wall 9° greater, Stride 17½°, Bond 12° greater, Stomach 14° greater, Hairy Head 11°, Net 16° lesser, Turtle Beak 1°, Three Stars 9° lesser, Eastern Well 30°, Ghost Cart 2° greater, Willow 14° lesser, Seven Stars 6° greater, Extended Net 18° greater, Wings 19° lesser, Chariot Shaft 18° greater, Horn 13°, Neck 9½°, Root 15° greater, Room 5°, Heart 4° greater, Tail 17°, Winnowing Basket 10° lesser — the ecliptic lodge degrees used to pace the sun’s daily course.',
  },
  s0424: {
    literal: 'The moon and the five planets enter and exit according to this.',
    idiomatic: 'The moon and the five planets are reckoned by the same ecliptic framework.',
  },
  s0425: {
    literal: 'In seeking these lodge degrees, all have surplus parts; earlier and later generations round them to lesser, half, or greater, aligning them to whole degrees.',
    idiomatic: 'These lodge longitudes all carry fractional remainders; successive reckonings round them to lesser, half, or greater parts to align with whole degrees.',
  },
  s0426: {
    literal:
      'If one examines antiquity above and tests the future below, one should follow the annual difference and, for each degree it shifts, compute by the method so as to obtain the degrees and parts of that time — only then can one pace the Three Luminaries.',
    idiomatic:
      'To verify against past ages and test future ones, apply the precession: for each degree of shift, recalculate by the method to obtain contemporary longitudes — only then may one pace the sun, moon, and planets.',
  },
  s0427: {
    literal: 'Subtract circuit-of-heaven substance from the central accumulation;',
    idiomatic: 'Subtract the circuit-of-heaven constant from the central accumulation;',
  },
  s0428: {
    literal: 'What does not exhaust, fill the universal method to obtain degrees.',
    idiomatic: 'The remainder, divided by the universal divisor, gives degrees.',
  },
  s0429: {
    literal:
      'Fix the count from equatorial Emptiness 9; remove lodge by lodge, passing Emptiness and subtracting its fraction, until less than one lodge remains outside the count — obtaining the winter-solstice hour-added solar degree.',
    idiomatic:
      'Count from equatorial Emptiness 9°, subtracting whole lodges and the Emptiness fraction in turn, until less than one lodge remains beyond the tally — this yields the solar longitude at winter-solstice hour-addition.',
  },
  s0430: {
    literal: 'Cumulatively add the three-origin interval to obtain the hour-added solar degree for each successive qi.',
    idiomatic: 'Add the three-origin interval repeatedly to obtain the hour-added solar degree for each successive qi.',
  },
  s0431: {
    literal: 'Subtract the degree remainder from the universal method;',
    idiomatic: 'Subtract the degree remainder from the universal divisor;',
  },
  s0432: {
    literal: 'Multiply the remainder by the limit-number of the winter-solstice solar station’s distance-degree entry to obtain the pre-distance fraction.',
    idiomatic: 'Multiply the remainder by the band index for the winter-solstice solar station’s distance entry to obtain the pre-distance fraction.',
  },
  s0433: {
    literal: 'Set the yellow–red path difference below the distance degree; multiply by the universal method and subtract the pre-distance fraction;',
    idiomatic: 'Take the ecliptic–equator difference for the distance band, multiply by the universal divisor, and subtract the pre-distance fraction;',
  },
  s0434: {
    literal: 'Divide the remainder by 120 when full to obtain the fixed difference.',
    idiomatic: 'When the remainder fills 120, divide to obtain the fixed difference.',
  },
  s0435: {
    literal: 'What does not fill, multiply by the image cycle and divide again for seconds and parts.',
    idiomatic: 'If it does not fill, multiply by the image cycle and divide again to obtain seconds and parts.',
  },
  s0436: {
    literal: 'Then subtract the fixed difference from the equatorial lodge degree to obtain the ecliptic solar degree at winter-solstice hour-addition.',
    idiomatic: 'Subtract the fixed difference from the equatorial lodge longitude to obtain the ecliptic solar degree at winter-solstice hour-addition.',
  },
  s0437: {
    literal: 'Also set the annual difference; multiply by the limit-number; divide by 120 for seconds and parts.',
    idiomatic: 'Set the annual precession, multiply by the band index, and divide by 120 for seconds and parts.',
  },
  s0438: {
    literal: 'What does not exhaust becomes minor parts.',
    idiomatic: 'The remainder becomes minor parts.',
  },
  s0439: {
    literal: 'Add to the three-origin interval and trim cumulatively.',
    idiomatic: 'Add this to the three-origin interval and accumulate the trims in order.',
  },
  s0440: {
    literal: 'Fix the count by ecliptic lodge sequence; each yields the hour-added solar degree for fixed qi.',
    idiomatic: 'Count through the ecliptic lodges in sequence to obtain the hour-added solar degree for each fixed qi.',
  },
  s0441: {
    literal: 'Set the fixed minor remainder for that qi and keep a duplicate.',
    idiomatic: 'Set the fixed minor remainder for that qi and keep a duplicate tally.',
  },
  s0442: {
    literal: 'Multiply by its daily surplus-deficit fraction; divide by the universal method; surplus adds and deficit subtracts from the duplicate.',
    idiomatic: 'Multiply by its daily equation of time, divide by the universal divisor, and add or subtract from the duplicate according to surplus or deficit.',
  },
  s0443: {
    literal: 'Use this to subtract from the hour-added degree remainder for that day; obtain the midnight solar degree.',
    idiomatic: 'Subtract this from the day’s hour-added degree remainder to obtain the solar longitude at midnight.',
  },
  s0444: {
    literal: 'Cumulatively add one interval; with each day’s surplus-deficit fraction, surplus adds and deficit subtracts from the degree remainder — obtaining the midnight solar degree for each day.',
    idiomatic: 'Add one interval at each step; apply each day’s equation to the degree remainder by addition or subtraction — yielding the midnight solar degree day by day.',
  },
  s0445: {
    literal: 'Section Four: Method for pacing lunar motion',
    idiomatic: 'IV. Method for Determining Lunar Motion',
  },
  s0446: {
    literal: 'Rotation cycle 670,1279.',
    idiomatic: 'Rotation cycle constant: 670,1279.',
  },
  s0447: {
    literal: 'Rotation cycle days 27, remainder 1,685, seconds 79.',
    idiomatic: 'Rotation cycle: 27 days, remainder 1,685, 79 seconds.',
  },
  s0448: { literal: 'Rotation method 76.', idiomatic: 'Rotation divisor: 76.' },
  s0449: { literal: 'Rotation second method 80.', idiomatic: 'Rotation second divisor: 80.' },
  s0450: {
    literal: 'Multiply new-moon accumulation by the second method; remove what fills the rotation cycle;',
    idiomatic: 'Multiply the new-moon accumulation by the second divisor and cast out full rotation cycles;',
  },
  s0451: {
    literal: 'Reduce the remainder again by the second method to obtain rotation entry parts;',
    idiomatic: 'Reduce the remainder again by the second divisor to obtain rotation entry parts;',
  },
  s0452: {
    literal: 'When it fills the universal method, that makes days.',
    idiomatic: 'When the parts fill the universal divisor, they become days.',
  },
  s0453: {
    literal: 'Fix the count outside the day-tally; obtain the entry at canonical new moon of the celestial first month, hour-added.',
    idiomatic: 'Count outward from the day tally to obtain the rotation entry at the hour-added canonical new moon of the celestial first month.',
  },
  s0454: {
    literal: 'Then add rotation difference: one day, remainder 2,967, second 1 — obtaining the next new moon.',
    idiomatic: 'Add the rotation increment of one day, remainder 2,967, and one second to obtain the next new moon.',
  },
  s0455: {
    literal: 'With one four-image interval, change and add in sequence to obtain first and last quarters.',
    idiomatic: 'Add one four-image interval in turn to obtain the first and last quarters.',
  },
  s0456: {
    literal: 'When days and remainder-seconds fill the rotation cycle, remove them.',
    idiomatic: 'When days and remainder-seconds fill the rotation cycle, cast them out.',
  },
  s0457: {
    literal: 'For each, subtract the new-moon, quarter, or full-moon minor remainder to obtain the entry at that night’s midnight.',
    idiomatic: 'Subtract each new-moon, quarter, or full-moon minor remainder to obtain the rotation entry at that night’s midnight.',
  },
  s0458: { literal: 'Rotation day', idiomatic: 'Rotation day' },
  s0459: { literal: 'Rotation parts', idiomatic: 'Rotation parts' },
  s0460: { literal: 'Column decrement', idiomatic: 'Column decrement' },
  s0461: { literal: 'Accumulated rotation degrees', idiomatic: 'Accumulated rotation degrees' },
  s0462: { literal: 'Increase and decrease rates', idiomatic: 'Rates of increase and decrease' },
  s0463: { literal: 'Fast-slow accumulation', idiomatic: 'Anomalistic accumulation' },
  s0464: { literal: 'Day one', idiomatic: 'Day 1' },
  s0465: { literal: '917', idiomatic: '917' },
  s0466: { literal: 'Advance 13', idiomatic: 'Tabular advance: 13' },
  s0467: { literal: 'Degrees, initial', idiomatic: 'Rotation degrees, initial' },
  s0468: { literal: 'Increase 297', idiomatic: 'Increase rate: 297' },
  s0469: { literal: 'Slow, initial', idiomatic: 'Waning accumulation, initial' },
  s0470: { literal: 'Day two', idiomatic: 'Day 2' },
  s0471: { literal: '930', idiomatic: '930' },
  s0472: { literal: 'Advance 13', idiomatic: 'Tabular advance: 13' },
  s0473: { literal: '12 degrees 5 parts', idiomatic: '12° 5 parts' },
  s0474: { literal: 'Increase 259', idiomatic: 'Increase rate: 259' },
  s0475: { literal: 'Slow 297', idiomatic: 'Waning accumulation: 297' },
  s0476: { literal: 'Day three', idiomatic: 'Day 3' },
  s0477: { literal: '943', idiomatic: '943' },
  s0478: { literal: 'Advance 13', idiomatic: 'Tabular advance: 13' },
  s0479: { literal: '24 degrees 23 parts', idiomatic: '24° 23 parts' },
  s0480: { literal: 'Increase 220', idiomatic: 'Increase rate: 220' },
  s0481: { literal: 'Slow 556', idiomatic: 'Waning accumulation: 556' },
  s0482: { literal: 'Day four', idiomatic: 'Day 4' },
  s0483: { literal: '956', idiomatic: '956' },
  s0484: { literal: 'Advance 14', idiomatic: 'Tabular advance: 14' },
  s0485: { literal: '36 degrees 54 parts', idiomatic: '36° 54 parts' },
  s0486: { literal: 'Increase 180', idiomatic: 'Increase rate: 180' },
  s0487: { literal: 'Slow 776', idiomatic: 'Waning accumulation: 776' },
  s0488: { literal: 'Day five', idiomatic: 'Day 5' },
  s0489: { literal: '970', idiomatic: '970' },
  s0490: { literal: 'Advance 14', idiomatic: 'Tabular advance: 14' },
  s0491: { literal: '49 degrees 22 parts', idiomatic: '49° 22 parts' },
  s0492: { literal: 'Increase 139', idiomatic: 'Increase rate: 139' },
  s0493: { literal: 'Slow 956', idiomatic: 'Waning accumulation: 956' },
  s0494: { literal: 'Day six', idiomatic: 'Day 6' },
  s0495: { literal: '984', idiomatic: '984' },
  s0496: { literal: 'Advance 16', idiomatic: 'Tabular advance: 16' },
  s0497: { literal: '62 degrees 4 parts', idiomatic: '62° 4 parts' },
  s0498: { literal: 'Increase 97', idiomatic: 'Increase rate: 97' },
  s0499: { literal: 'Slow 1,095', idiomatic: 'Waning accumulation: 1,095' },
  s0500: { literal: 'Day seven', idiomatic: 'Day 7' },
};

const path = 'translations/current_translation_xintangshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) throw new Error(`Missing ${s.id}`);
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', Object.keys(T).length);
