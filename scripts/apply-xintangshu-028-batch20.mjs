#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1901: { literal: 'Where slowness increases, subtract the accumulation; where swiftness increases, add it.', idiomatic: 'Subtract the accumulation when slowness increases; add it when swiftness increases.' },
  s1902: { literal: 'Extract the square root; with the result add or subtract the rate.', idiomatic: 'Take the square root and add or subtract the rate from the result.' },
  s1903: { literal: 'Where slowness increases, add the rate; where swiftness increases, subtract it.', idiomatic: 'Add the rate when slowness increases; subtract it when swiftness increases.' },
  s1904: { literal: 'Then halve; obtain the sought day-count.', idiomatic: 'Halve the result to obtain the sought day-count.' },
  s1905: { literal: 'For square-root division, set the number to be opened as dividend.', idiomatic: 'For square-root extraction, set the number to be rooted as the dividend.' },
  s1906: { literal: 'Borrow one count below the dividend; call it the lower method.', idiomatic: 'Place one counting rod below the dividend as the lower method.' },
  s1907: { literal: 'Step it, exceeding one place.', idiomatic: 'Shift it, skipping one place.' },
  s1908: {
    literal: 'Set the quotient above; set the auxiliary quotient on the lower method above; call it the square method.',
    idiomatic: 'Place the quotient above and an auxiliary quotient on the lower method—this is the square method.',
  },
  s1909: { literal: 'Order the upper quotient to divide the dividend.', idiomatic: 'Use the upper quotient to divide the dividend.' },
  s1910: { literal: 'When done, double the square method once and fold; fold the lower method again.', idiomatic: 'When finished, double the square method once and fold the lower method again.' },
  s1911: { literal: 'Then set the posterior quotient on the lower method above; call it the corner method.', idiomatic: 'Place the next quotient on the lower method as the corner method.' },
  s1912: { literal: 'Auxiliary corner joins the square.', idiomatic: 'Add the auxiliary corner to the square method.' },
  s1913: { literal: 'Order the posterior quotient to divide the dividend.', idiomatic: 'Use the next quotient to divide the dividend.' },
  s1914: {
    literal: 'When done, the corner follows the square method folded down; divide as when opening before.',
    idiomatic: 'When finished, fold the corner into the square method and continue extracting as before.',
  },
  s1915: { literal: 'For the five stars’ prior phase, entering a yang line is north of the Yellow Path;', idiomatic: 'In a planet’s prior phase, entering a yang line places it north of the ecliptic;' },
  s1916: { literal: 'entering a yin line is south of the Yellow Path.', idiomatic: 'entering a yin line places it south of the ecliptic.' },
  s1917: { literal: 'In the posterior phase, entering a yang line is south of the Yellow Path;', idiomatic: 'In the posterior phase, entering a yang line places it south of the ecliptic;' },
  s1918: { literal: 'entering a yin line is north of the Yellow Path.', idiomatic: 'entering a yin line places it north of the ecliptic.' },
  s1919: { literal: 'For Metal and Water, evening is the prior phase and morning the posterior phase.', idiomatic: 'For Venus and Mercury, evening is the prior phase and morning the posterior phase.' },
  s1920: {
    literal: 'For each compute its phase motion from the initial day’s entered-line count through the old-image top line’s uncounted number.',
    idiomatic: 'For each phase, count from the initial day’s entered line through the remaining counts on the old-image top line.',
  },
  s1921: {
    literal: 'If less than the phase-motion degree regular rate, set the number and multiply by the phase daily fixed rate; as one per phase-degree regular rate; this is days.',
    idiomatic: 'If less than the phase-motion degree regular rate, multiply the count by the phase daily fixed rate and divide by the phase-degree regular rate to obtain days.',
  },
  s1922: {
    literal: 'If the entered phase days and this day-count are below it, the star’s north-south latitude follows the yin-yang line originally entered.',
    idiomatic: 'Within this day-count, the star’s ecliptic latitude follows the yin-yang line originally entered.',
  },
  s1923: { literal: 'Beyond this day-count, north and south reverse.', idiomatic: 'Beyond this day-count, north and south reverse.' },
  s1924: { literal: 'The Nine Planets calendar comes from the Western Regions.', idiomatic: 'The Nine Planets calendar originated in the Western Regions.' },
  s1925: {
    literal: 'Kaiyuan year 6: an edict ordered Director of the Astronomy Bureau Gautama Siddhartha to translate it.',
    idiomatic: 'In Kaiyuan 6, an edict ordered Chief Astronomer Gautama Siddhartha to translate it.',
  },
  s1926: { literal: 'It takes a near interval, with new moon of Kaiyuan 2, month 2 as calendar head.', idiomatic: 'It uses a near interval, taking the new moon of Kaiyuan 2, month 2 as the calendar epoch.' },
  s1927: { literal: 'Degree method: 60.', idiomatic: 'Degree divisor: 60.' },
  s1928: { literal: 'The month has 29 days, remainder 373 of 703 parts of a day.', idiomatic: 'A month has 29 days plus 373/703 of a day.' },
  s1929: { literal: 'The calendar head has new-moon void parts 126.', idiomatic: 'The epoch has new-moon void parts: 126.' },
  s1930: { literal: 'Circuit of heaven 360 degrees, no remainder parts.', idiomatic: 'The circuit of heaven is 360° with no fractional remainder.' },
  s1931: { literal: 'Solar distance to disappearance parts: 13 parts of 900 degrees.', idiomatic: 'Solar distance to disappearance: 13 parts per 900 degrees.' },
  s1932: { literal: 'Two months make a season; six seasons make a year.', idiomatic: 'Two months make a season; six seasons make a year.' },
  s1933: { literal: 'Thirty degrees make a phase; twelve phases complete the circuit.', idiomatic: 'Thirty degrees make a phase; twelve phases complete the circuit of heaven.' },
  s1934: { literal: 'Before full moon is called White Bo Yì.', idiomatic: 'Before full moon is called White Bo Yì.' },
  s1935: { literal: 'After full moon is called Black Bo Yì.', idiomatic: 'After full moon is called Black Bo Yì.' },
  s1936: { literal: 'All calculations use written characters, not counting rods.', idiomatic: 'All calculations use written numerals rather than counting rods.' },
  s1937: { literal: 'Its art is intricate; it may chance to hit the mark but cannot serve as a standard method.', idiomatic: 'Its procedures are intricate; it may occasionally match observation but cannot serve as a standard method.' },
  s1938: { literal: 'Its terms and numbers are strange; at first none could distinguish them.', idiomatic: 'Its terminology and numbers are bizarre; at first none could make sense of them.' },
  s1939: {
    literal: 'Chen Xuanjing and others used it to mislead their contemporaries, saying Yi Xing had not fully written out its art—this was false.',
    idiomatic: 'Chen Xuanjing and others used it to mislead their contemporaries, claiming that Yi Xing had not fully recorded its procedures—falsely so.',
  },
  s1940: { literal: 'Collation note 0.85em|columns=2', idiomatic: '[Collation note]' },
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
